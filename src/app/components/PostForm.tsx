'use client';

import React, { useState } from "react";

type PostFormProps = {
  initialTitle?: string;
  initialDescription?: string;
  initialContent?: string;
  initialCategory?: string;
  initialTags?: string[];
  initialImageUrl?: string;
  onSubmit: (data: {
    title: string;
    description: string;
    content: string;
    category: string;
    tags: string[];
    imageUrl: string;
  }) => void;
  onCancel: () => void;
};

const PostForm = ({ 
  initialTitle = "", 
  initialDescription = "", 
  initialContent = "",
  initialCategory = "",
  initialTags = [],
  initialImageUrl = "",
  onSubmit, 
  onCancel 
}: PostFormProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [content, setContent] = useState(initialContent);
  const [category, setCategory] = useState(initialCategory);
  const [tags, setTags] = useState(initialTags.join(', '));
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('ファイルアップロード開始:', file.name, file.size, file.type);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('アップロード結果:', result);

      if (result.message === 'Success') {
        setImageUrl(result.url);
        console.log('画像URL設定:', result.url);
      } else {
        console.error('アップロードエラー:', result.message);
        alert(`画像のアップロードに失敗しました: ${result.message}`);
      }
    } catch (error) {
      console.error('アップロードエラー:', error);
      alert(`画像のアップロードに失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    onSubmit({
      title,
      description,
      content,
      category,
      tags: tagsArray,
      imageUrl
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto bg-[#fffdfa] rounded-lg shadow-lg p-8 flex flex-col gap-6 mt-8">
      <div>
        <label className="block text-[#684d3c] font-semibold mb-2">タイトル</label>
        <input
          className="w-full border border-[#e5cdb3] rounded px-4 py-2 focus:ring-2 focus:ring-[#f8d9a0] outline-none text-[#4e342e] placeholder-[#9d856c]"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div>
        <label className="block text-[#684d3c] font-semibold mb-2">説明</label>
        <textarea
          className="w-full h-24 border border-[#e5cdb3] rounded px-4 py-2 focus:ring-2 focus:ring-[#f8d9a0] outline-none text-[#4e342e] placeholder-[#9d856c]"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-[#684d3c] font-semibold mb-2">コンテンツ</label>
        <textarea
          className="w-full h-32 border border-[#e5cdb3] rounded px-4 py-2 focus:ring-2 focus:ring-[#f8d9a0] outline-none text-[#4e342e] placeholder-[#9d856c]"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="記事の詳細な内容を入力してください"
        />
      </div>

      <div>
        <label className="block text-[#684d3c] font-semibold mb-2">カテゴリ</label>
        <select
          className="w-full border border-[#e5cdb3] rounded px-4 py-2 focus:ring-2 focus:ring-[#f8d9a0] outline-none text-[#4e342e] bg-white"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="">カテゴリを選択</option>
          <option value="技術">技術</option>
          <option value="ライフスタイル">ライフスタイル</option>
          <option value="旅行">旅行</option>
          <option value="料理">料理</option>
          <option value="その他">その他</option>
        </select>
      </div>

      <div>
        <label className="block text-[#684d3c] font-semibold mb-2">タグ（カンマ区切り）</label>
        <input
          className="w-full border border-[#e5cdb3] rounded px-4 py-2 focus:ring-2 focus:ring-[#f8d9a0] outline-none text-[#4e342e] placeholder-[#9d856c]"
          type="text"
          value={tags}
          onChange={e => setTags(e.target.value)}
          placeholder="例: React, Next.js, プログラミング"
        />
      </div>

      <div>
        <label className="block text-[#684d3c] font-semibold mb-2">画像</label>
        <input
          className="w-full border border-[#e5cdb3] rounded px-4 py-2 focus:ring-2 focus:ring-[#f8d9a0] outline-none text-[#4e342e] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#f8d9a0] file:text-[#684d3c] hover:file:bg-[#ffd9b3]"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
        />
        {uploading && <p className="text-sm text-[#be8c58] mt-1">アップロード中...</p>}
        {imageUrl && (
          <div className="mt-2">
            <img src={imageUrl} alt="Preview" className="max-w-full h-32 object-cover rounded" />
            <p className="text-sm text-[#684d3c] mt-1">画像がアップロードされました</p>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-[#dbc1ad] text-[#7d5c39] rounded hover:bg-[#e7cead] transition">キャンセル</button>
        <button type="submit" disabled={uploading} className="px-6 py-2 bg-[#f8d9a0] text-[#684d3c] rounded font-semibold shadow hover:bg-[#ffd9b3] transition disabled:opacity-50">保存</button>
      </div>
    </form>
  );
};

export default PostForm;
