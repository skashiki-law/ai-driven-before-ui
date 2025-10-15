import { PrismaClient } from "../../../generated/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function main() {
    try {
        await prisma.$connect();
    } catch (err) {
        return Error("DB接続に失敗しました");
    }
    
}

//GET ブログの全記事取得（フィルター機能付き）

export const GET = async (req: Request) => {
    try {
        await main();
        
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const tags = searchParams.get('tags');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') || 'desc';
        
        // フィルター条件を構築
        const where: any = {};
        
        if (category) {
            where.category = category;
        }
        
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } }
            ];
        }
        
        if (tags) {
            const tagArray = tags.split(',');
            where.tags = { hasSome: tagArray };
        }
        
        const posts = await prisma.post.findMany({ 
            where,
            orderBy: { [sortBy]: sortOrder },
            include: {
                favorites: true
            }
        });
        
        return NextResponse.json({ message: "Success", posts }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: "Error", err }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
};

// Post ブログの記事作成

export const POST = async (req: Request) => {
    console.log("POST");

    try {
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json({ message: "認証が必要です" }, { status: 401 });
        }

        const { title, description, content, imageUrl, category, tags } = await req.json();
        
        await main();
        
        // ユーザーが存在しない場合は作成
        let user = await prisma.user.findUnique({
            where: { clerkId: userId }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    clerkId: userId,
                    email: "user@example.com",
                    name: "User"
                }
            });
        }
        
        const post = await prisma.post.create({ 
            data: { 
                title, 
                description, 
                content,
                imageUrl,
                category,
                tags: tags || [],
                authorId: user.id
            } 
        });
        
        return NextResponse.json({ message: "Success", post }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: "Error", err }, { status: 500 });
    } finally {
        await prisma.$disconnect();       
    }
};
