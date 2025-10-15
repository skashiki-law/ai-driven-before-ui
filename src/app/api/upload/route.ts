import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { uploadImage } from "../../../lib/supabase";

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json({ message: "認証が必要です" }, { status: 401 });
        }

        // Supabase設定チェック
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            return NextResponse.json({ 
                message: "Supabase設定が不完全です。環境変数を確認してください。" 
            }, { status: 500 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ message: "ファイルが選択されていません" }, { status: 400 });
        }

        // ファイルサイズチェック（5MB制限）
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ message: "ファイルサイズが大きすぎます（5MB以下）" }, { status: 400 });
        }

        // ファイル形式チェック
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ 
                message: `サポートされていないファイル形式です。対応形式: ${allowedTypes.join(', ')}` 
            }, { status: 400 });
        }

        // ユニークなファイル名を生成
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileExtension = file.name.split('.').pop();
        const fileName = `${userId}/${timestamp}-${randomString}.${fileExtension}`;

        console.log('アップロード開始:', fileName);

        // Supabase Storageにアップロード
        const uploadResult = await uploadImage(file, fileName);

        if (!uploadResult) {
            throw new Error('アップロード結果が取得できませんでした');
        }

        const publicUrl = `https://${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]}/storage/v1/object/public/images/${uploadResult.path}`;

        console.log('アップロード成功:', publicUrl);

        return NextResponse.json({
            message: "Success",
            fileName: uploadResult.path,
            url: publicUrl
        }, { status: 200 });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ 
            message: "アップロードに失敗しました", 
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
