import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

export async function main() {
    try {
        await prisma.$connect();
    } catch (err) {
        return Error("DB接続に失敗しました");
    }
}

export const GET = async (req: Request, res: NextResponse) => {
    return NextResponse.json({ message: 'Clerk webhook endpoint is working' }, { status: 200 });
};

export const POST = async (req: Request, res: NextResponse) => {
    console.log("Webhook POST received");
    
    try {
        const event = req.headers.get('svix-event') || req.headers.get('clerk-event') || '';
        const body = await req.json();
        
        console.log('Webhook received:', { event, body });
        
        // 対象イベントのみ処理
        if (!['user.created', 'user.signed_in'].includes(event) && 
            !['user.created', 'user.signed_in'].includes(body.type)) {
            console.log('Event ignored:', event || body.type);
            return NextResponse.json({ message: 'event ignored' }, { status: 200 });
        }
        
        const user = body.data || body;
        
        // 必須データの確認
        if (!user?.id) {
            console.log('Missing user ID:', user);
            return NextResponse.json({ message: 'user data insufficient - missing ID' }, { status: 400 });
        }
        
        if (!user?.email_addresses?.[0]?.email_address) {
            console.log('Missing email:', user);
            return NextResponse.json({ message: 'user data insufficient - missing email' }, { status: 400 });
        }
        
        await main();
        
        // 二重登録防止：IDで既存チェック
        const existingUser = await prisma.user.findUnique({ 
            where: { id: user.id } 
        });
        
        if (existingUser) {
            return NextResponse.json({ message: 'user already exists' }, { status: 200 });
        }
        
        // ユーザー情報を挿入
        await prisma.user.create({
            data: {
                id: user.id,
                email: user.email_addresses[0].email_address,
                firstname: user.first_name || '',
                lastname: user.last_name || '',
                imageUrl: user.image_url || '',
                // createdAt, updateAtは自動で設定される
            }
        });
        
        return NextResponse.json({ message: 'user created successfully' }, { status: 200 });
        
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ 
            message: 'error', 
            error: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
};
