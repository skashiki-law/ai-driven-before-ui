import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/generated/prisma'; // 実際のprisma client importのパスに合わせて修正してください

export async function POST(req: NextRequest) {
  try {
    const event = req.headers.get('clerk-event') || '';
    const body = await req.json();
    if (!['user.created', 'user.signed_in'].includes(event) && !['user.created', 'user.signed_in'].includes(body.type)) {
      return NextResponse.json({ message: 'event ignored' }, { status: 200 });
    }
    const user = body.data || body;
    if (!user?.id || !user?.email_addresses?.[0]?.email_address) {
      return NextResponse.json({ message: 'user data insufficient' }, { status: 400 });
    }
    // 二重登録防止：IDまたはemailで既存チェック
    const found = await prisma.user.findFirst({ where: { id: user.id } });
    if (found) {
      return NextResponse.json({ message: 'already exists' }, { status: 200 });
    }
    // 挿入実行
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email_addresses[0].email_address,
        firstname: user.first_name || '',
        lastname: user.last_name || '',
        imageUrl: user.image_url || '',
        // createdAt, updateAtはデフォルト
      }
    });
    return NextResponse.json({ message: 'ok' });
  } catch (e) {
    return NextResponse.json({ message: 'error', error: String(e) }, { status: 500 });
  }
}

