import React from "react";

type Post = {
  id: number;
  title: string;
  description: string;
  content?: string;
  imageUrl?: string;
  category?: string;
  tags?: string[];
  createdAt: string;
};

type PostDetailProps = {
  post: Post;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

const PostDetail = ({ post, onEdit, onDelete }: PostDetailProps) => (
  <div className="w-full max-w-4xl mx-auto bg-[#fffdfa] rounded-lg shadow-lg p-8 mt-6">
    {/* 画像表示 */}
    {post.imageUrl && (
      <div className="mb-6">
        <img src={post.imageUrl} alt={post.title} className="w-full h-64 object-cover rounded-lg" />
      </div>
    )}
    
    {/* タイトル */}
    <h2 className="text-3xl pb-2 font-bold text-[#684d3c] border-b border-[#eee1cf] mb-4">{post.title}</h2>
    
    {/* カテゴリとタグ */}
    <div className="flex flex-wrap gap-2 mb-4">
      {post.category && (
        <span className="px-3 py-1 bg-[#f8d9a0] text-[#684d3c] text-sm rounded-full font-medium">
          {post.category}
        </span>
      )}
      {post.tags?.map((tag, index) => (
        <span key={index} className="px-3 py-1 bg-[#e5cdb3] text-[#7d5c39] text-sm rounded-full">
          {tag}
        </span>
      ))}
    </div>
    
    {/* 作成日 */}
    <p className="text-sm text-[#be8c58] mb-6">
      作成日: {new Date(post.createdAt).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
    </p>
    
    {/* 説明 */}
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-[#684d3c] mb-2">概要</h3>
      <p className="text-[#7d5c39] whitespace-pre-wrap">{post.description}</p>
    </div>
    
    {/* コンテンツ */}
    {post.content && (
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-[#684d3c] mb-2">詳細</h3>
        <div className="text-[#7d5c39] whitespace-pre-wrap leading-relaxed">
          {post.content}
        </div>
      </div>
    )}
    
    {/* アクションボタン */}
    <div className="flex gap-4 justify-end pt-4 border-t border-[#eee1cf]">
      <button onClick={() => onEdit(post.id)} className="bg-[#f8d9a0] text-[#684d3c] px-5 py-2 rounded-md shadow hover:bg-[#ffd9b3] transition font-medium">編集</button>
      <button onClick={() => onDelete(post.id)} className="bg-[#dbc1ad] text-[#7d5c39] px-5 py-2 rounded-md hover:bg-[#e1b696] transition">削除</button>
    </div>
  </div>
);

export default PostDetail;
