'use client';

import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PostList from "./components/PostList";
import PostDetail from "./components/PostDetail";
import PostForm from "./components/PostForm";
import FavoritesList from "./components/FavoritesList";

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [mode, setMode] = useState<"list" | "detail" | "new" | "edit" | "favorites">("list");
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    tags: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // 記事取得（フィルター付き）
  const fetchPosts = async (customFilters?: any) => {
    setLoading(true);
    const currentFilters = customFilters || filters;
    
    const params = new URLSearchParams();
    if (currentFilters.category) params.append('category', currentFilters.category);
    if (currentFilters.search) params.append('search', currentFilters.search);
    if (currentFilters.tags) params.append('tags', currentFilters.tags);
    if (currentFilters.sortBy) params.append('sortBy', currentFilters.sortBy);
    if (currentFilters.sortOrder) params.append('sortOrder', currentFilters.sortOrder);
    
    const res = await fetch(`/api/blog?${params.toString()}`);
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
  // フィルター変更
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    fetchPosts(newFilters);
  };

  // 投稿・編集保存
  const handleSave = async (data: {
    title: string;
    description: string;
    content: string;
    category: string;
    tags: string[];
    imageUrl: string;
  }) => {
    setLoading(true);
    try {
      if (mode === "new") {
        await fetch("/api/blog", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
      } else if (selectedPost) {
        await fetch(`/api/blog/${selectedPost.id}`, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
      }
      setMode("list");
      fetchPosts();
    } catch (error) {
      console.error('保存エラー:', error);
      alert('保存に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fffdfa]">
      <Header onShowFavorites={() => setMode("favorites")} />
      <main className="flex-1 min-h-0 py-8 px-1 sm:px-0">
        <div className="w-full max-w-6xl mx-auto">
          {mode === "list" && (
            <>
              <div className="flex justify-end mb-6">
                <button onClick={handleNew} className="bg-[#6f432a] text-white px-5 py-2 rounded shadow hover:bg-[#9d856c] transition-all">新規投稿</button>
              </div>
              {loading ? (
                <div className="text-center text-[#b49574] py-12">Loading...</div>
              ) : (
                <PostList posts={posts} onSelect={handleSelect} onFilter={handleFilterChange} />
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
                initialContent={selectedPost.content}
                initialCategory={selectedPost.category}
                initialTags={selectedPost.tags}
                initialImageUrl={selectedPost.imageUrl}
              />
            </>
          )}
          {mode === "favorites" && (
            <FavoritesList 
              onSelect={handleSelect}
              onBack={() => setMode("list")}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
