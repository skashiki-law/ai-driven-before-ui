'use client';

import React, { useState } from "react";

type PostFormProps = {
  initialTitle?: string;
  initialDescription?: string;
  onSubmit: (title: string, desc: string) => void;
  onCancel: () => void;
};

const PostForm = ({ initialTitle = "", initialDescription = "", onSubmit, onCancel }: PostFormProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    onSubmit(title, description);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto bg-[#fffdfa] rounded-lg shadow-lg p-8 flex flex-col gap-6 mt-8">
      <div>
        <label className="block text-[#7d5c39] font-semibold mb-2">タイトル</label>
        <input
          className="w-full border border-[#e5cdb3] rounded px-4 py-2 focus:ring-2 focus:ring-[#f8d9a0] outline-none"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-[#7d5c39] font-semibold mb-2">説明</label>
        <textarea
          className="w-full h-24 border border-[#e5cdb3] rounded px-4 py-2 focus:ring-2 focus:ring-[#f8d9a0] outline-none"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-[#dbc1ad] text-[#7d5c39] rounded hover:bg-[#e7cead] transition">キャンセル</button>
        <button type="submit" className="px-6 py-2 bg-[#f8d9a0] text-[#684d3c] rounded font-semibold shadow hover:bg-[#ffd9b3] transition">保存</button>
      </div>
    </form>
  );
};

export default PostForm;
