import React from "react";

type Post = {
  id: number;
  title: string;
  description: string;
};

type PostDetailProps = {
  post: Post;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

const PostDetail = ({ post, onEdit, onDelete }: PostDetailProps) => (
  <div className="w-full max-w-xl mx-auto bg-[#fffdfa] rounded-lg shadow-lg p-8 mt-6">
    <h2 className="text-2xl pb-2 font-bold text-[#684d3c] border-b border-[#eee1cf] mb-4">{post.title}</h2>
    <p className="text-[#7d5c39] mb-8 whitespace-pre-wrap min-h-[96px]">{post.description}</p>
    <div className="flex gap-4 justify-end">
      <button onClick={() => onEdit(post.id)} className="bg-[#f8d9a0] text-[#684d3c] px-5 py-2 rounded-md shadow hover:bg-[#ffd9b3] transition font-medium">編集</button>
      <button onClick={() => onDelete(post.id)} className="bg-[#dbc1ad] text-[#7d5c39] px-5 py-2 rounded-md hover:bg-[#e1b696] transition">削除</button>
    </div>
  </div>
);

export default PostDetail;
