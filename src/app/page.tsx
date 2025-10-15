'use client';

import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PostList from "./components/PostList";
import PostDetail from "./components/PostDetail";
import PostForm from "./components/PostForm";

<<<<<<< HEAD
export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [mode, setMode] = useState<"list" | "detail" | "new" | "edit">("list");
  const [loading, setLoading] = useState(false);

  // 全記事取得
  const fetchPosts = async () => {
    setLoading(true);
    const res = await fetch("/api/blog");
    const data = await res.json();
    setPosts(data.posts || []);
    setLoading(false);
  };

  // 詳細取得
  const fetchPost = async (id: number) => {
    setLoading(true);
    const res = await fetch(`/api/blog/${id}`);
    const data = await res.json();
    setSelectedPost(data.post || null);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 選択時
  const handleSelect = (id: number) => {
    fetchPost(id);
    setMode("detail");
  };
  // 新規投稿
  const handleNew = () => {
    setSelectedPost(null);
    setMode("new");
  };
  // 編集開始
  const handleEdit = (id: number) => {
    if (selectedPost) setMode("edit");
    else fetchPost(id).then(() => setMode("edit"));
  };
  // 削除
  const handleDelete = async (id: number) => {
    if (!window.confirm("この記事を削除します。よろしいですか？")) return;
    setLoading(true);
    await fetch(`/api/blog/${id}`, { method: "DELETE" });
    setLoading(false);
    setMode("list");
    fetchPosts();
  };
  // 投稿・編集保存
  const handleSave = async (title: string, description: string) => {
    setLoading(true);
    if (mode === "new") {
      await fetch("/api/blog", {
        method: "POST",
        body: JSON.stringify({ title, description })
      });
    } else if (selectedPost) {
      await fetch(`/api/blog/${selectedPost.id}`, {
        method: "PUT",
        body: JSON.stringify({ title, description })
      });
    }
    setLoading(false);
    setMode("list");
    fetchPosts();
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fffdfa]">
      <Header />
      <main className="flex-1 min-h-0 py-8 px-1 sm:px-0">
        <div className="w-full max-w-2xl mx-auto">
          {mode === "list" && (
            <>
              <div className="flex justify-end mb-3">
                <button onClick={handleNew} className="bg-[#6f432a] text-white px-5 py-2 rounded shadow hover:bg-[#9d856c] transition-all">新規投稿</button>
              </div>
              {loading ? (
                <div className="text-center text-[#b49574] py-12">Loading...</div>
              ) : (
                <PostList posts={posts} onSelect={handleSelect} />
              )}
            </>
          )}
          {mode === "detail" && selectedPost && (
            <>
              <button onClick={() => setMode("list")} className="mb-3 px-3 py-1 border rounded text-xs bg-[#eee1cf] hover:bg-[#f8d9a0]">← 一覧へ</button>
              <PostDetail post={selectedPost} onEdit={handleEdit} onDelete={handleDelete} />
            </>
          )}
          {mode === "new" && (
            <>
              <button onClick={() => setMode("list")} className="mb-3 px-3 py-1 border rounded text-xs bg-[#eee1cf] hover:bg-[#f8d9a0]">← 一覧へ</button>
              <PostForm onSubmit={handleSave} onCancel={() => setMode("list")} />
            </>
          )}
          {mode === "edit" && selectedPost && (
            <>
              <button onClick={() => setMode("detail")} className="mb-3 px-3 py-1 border rounded text-xs bg-[#eee1cf] hover:bg-[#f8d9a0]">← 戻る</button>
              <PostForm
                onSubmit={handleSave}
                onCancel={() => setMode("detail")}
                initialTitle={selectedPost.title}
                initialDescription={selectedPost.description}
              />
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
=======
  export default function Home() {
    return (
        <div className="flex justify-center items-center h-screen">
            Hello World
        </div>
    );
  }


>>>>>>> 7f78a821552daeecdf2e5c28acb94e4a322b1be2
