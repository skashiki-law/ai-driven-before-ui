'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function DebugSupabase() {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testSupabaseConnection = async () => {
    setIsLoading(true);
    setTestResult('テスト開始...');

    try {
      // 環境変数チェック
      const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
      const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      setTestResult(`環境変数チェック:
- SUPABASE_URL: ${hasUrl ? '設定済み' : '未設定'}
- SUPABASE_ANON_KEY: ${hasKey ? '設定済み' : '未設定'}

`);

      if (!hasUrl || !hasKey) {
        setTestResult(prev => prev + '❌ 環境変数が設定されていません');
        return;
      }

      // Supabase接続テスト
      const { data, error } = await supabase.storage.listBuckets();
      
      if (error) {
        setTestResult(prev => prev + `❌ Supabase接続エラー: ${error.message}`);
        return;
      }

      setTestResult(prev => prev + `✅ Supabase接続成功！
バケット一覧:
${data.map(bucket => `- ${bucket.name} (${bucket.public ? '公開' : '非公開'})`).join('\n')}

`);

      // imagesバケットの確認
      const imagesBucket = data.find(bucket => bucket.name === 'images');
      if (imagesBucket) {
        setTestResult(prev => prev + '✅ imagesバケットが見つかりました');
      } else {
        setTestResult(prev => prev + '❌ imagesバケットが見つかりません。Supabaseダッシュボードで作成してください。');
      }

    } catch (error) {
      setTestResult(prev => prev + `❌ エラー: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffdfa] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-[#684d3c] mb-6">Supabase設定デバッグ</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold text-[#684d3c] mb-4">設定情報</h2>
          <div className="space-y-2 text-sm">
            <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? '設定済み' : '未設定'}</p>
            <p><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '設定済み' : '未設定'}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <button
            onClick={testSupabaseConnection}
            disabled={isLoading}
            className="bg-[#6f432a] text-white px-6 py-2 rounded hover:bg-[#9d856c] transition disabled:opacity-50"
          >
            {isLoading ? 'テスト中...' : 'Supabase接続テスト'}
          </button>
        </div>

        {testResult && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-[#684d3c] mb-4">テスト結果</h2>
            <pre className="whitespace-pre-wrap text-sm font-mono bg-gray-100 p-4 rounded">
              {testResult}
            </pre>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg mt-6">
          <h2 className="text-lg font-semibold text-[#684d3c] mb-4">設定手順</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Supabaseプロジェクトを作成</li>
            <li>Storageで「images」バケットを作成</li>
            <li>バケットを公開設定にする</li>
            <li>.env.localファイルに以下を追加：
              <pre className="bg-gray-100 p-2 rounded mt-2 text-xs">
{`NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"`}
              </pre>
            </li>
            <li>アプリケーションを再起動</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
