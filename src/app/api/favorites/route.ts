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

// ユーザーのお気に入り記事一覧を取得
export const GET = async (req: Request) => {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json({ message: "認証が必要です" }, { status: 401 });
        }

        await main();

        // ユーザーが存在しない場合は作成
        let user = await prisma.user.findUnique({
            where: { clerkId: userId }
        });

        if (!user) {
            // Clerkからユーザー情報を取得（実際の実装では Clerk の API を使用）
            user = await prisma.user.create({
                data: {
                    clerkId: userId,
                    email: "user@example.com", // 実際の実装では Clerk から取得
                    name: "User"
                }
            });
        }

        const favorites = await prisma.favorite.findMany({
            where: { userId: user.id },
            include: {
                post: true
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json({ message: "Success", favorites }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: "Error", err }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
};

// お気に入りの追加・削除
export const POST = async (req: Request) => {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json({ message: "認証が必要です" }, { status: 401 });
        }

        const { postId, action } = await req.json();

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

        if (action === "add") {
            // お気に入りに追加
            const favorite = await prisma.favorite.create({
                data: {
                    userId: user.id,
                    postId: parseInt(postId)
                }
            });
            return NextResponse.json({ message: "Success", favorite }, { status: 200 });
        } else if (action === "remove") {
            // お気に入りから削除
            await prisma.favorite.deleteMany({
                where: {
                    userId: user.id,
                    postId: parseInt(postId)
                }
            });
            return NextResponse.json({ message: "Success" }, { status: 200 });
        }

        return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    } catch (err) {
        return NextResponse.json({ message: "Error", err }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
};
