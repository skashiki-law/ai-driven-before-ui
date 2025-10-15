import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

type Post = {
  id: number;
  title: string;
  description: string;
  content?: string;
  imageUrl?: string;
  category?: string;
  tags?: string[];
  createdAt: string;
  favorites?: any[];
};

type PostListProps = {
  posts: Post[];
  onSelect: (id: number) => void;
  onFilter: (filters: {
    category?: string;
    search?: string;
    tags?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => void;
};

const PostList = ({ posts, onSelect, onFilter }: PostListProps) => {
  const { user } = useUser();
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    tags: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [favoritePosts, setFavoritePosts] = useState<number[]>([]);

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/favorites');
      const result = await response.json();
      if (result.message === 'Success') {
        const favoriteIds = result.favorites.map((fav: any) => fav.postId);
        setFavoritePosts(favoriteIds);
      }
    } catch (error) {
      console.error('お気に入り取得エラー:', error);
    }
  };

  const toggleFavorite = async (postId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      alert('お気に入り機能を使用するにはログインが必要です');
      return;
    }

    const isFavorite = favoritePosts.includes(postId);
    
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          action: isFavorite ? 'remove' : 'add'
        }),
      });

      const result = await response.json();
      if (result.message === 'Success') {
        if (isFavorite) {
          setFavoritePosts(prev => prev.filter(id => id !== postId));
        } else {
          setFavoritePosts(prev => [...prev, postId]);
        }
      }
    } catch (error) {
      console.error('お気に入り更新エラー:', error);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* フィルター */}
      <div className="bg-[#fffdfa] rounded-lg shadow-md p-5 mb-6">
        <h3 className="text-lg font-semibold text-[#684d3c] mb-4">フィルター</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-[#684d3c] font-medium mb-1">カテゴリ</label>
            <select
              className="w-full border border-[#e5cdb3] rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#f8d9a0] outline-none text-[#4e342e] bg-white"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">すべて</option>
              <option value="技術">技術</option>
              <option value="ライフスタイル">ライフスタイル</option>
              <option value="旅行">旅行</option>
              <option value="料理">料理</option>
              <option value="その他">その他</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-[#684d3c] font-medium mb-1">検索</label>
            <input
              className="w-full border border-[#e5cdb3] rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#f8d9a0] outline-none text-[#4e342e] placeholder-[#9d856c]"
              type="text"
              placeholder="タイトル、説明で検索"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm text-[#684d3c] font-medium mb-1">タグ</label>
            <input
              className="w-full border border-[#e5cdb3] rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#f8d9a0] outline-none text-[#4e342e] placeholder-[#9d856c]"
              type="text"
              placeholder="タグで検索"
              value={filters.tags}
              onChange={(e) => handleFilterChange('tags', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm text-[#684d3c] font-medium mb-1">並び順</label>
            <select
              className="w-full border border-[#e5cdb3] rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#f8d9a0] outline-none text-[#4e342e] bg-white"
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                handleFilterChange('sortBy', sortBy);
                handleFilterChange('sortOrder', sortOrder);
              }}
            >
              <option value="createdAt-desc">新しい順</option>
              <option value="createdAt-asc">古い順</option>
              <option value="title-asc">タイトル順</option>
            </select>
          </div>
        </div>
      </div>

      {/* 記事一覧 */}
      <div className="bg-[#fffdfa] rounded-lg shadow-md p-5">
        {posts.length === 0 ? (
          <div className="text-center text-[#be8c58] py-8">記事はまだありません。</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map(post => (
              <div key={post.id} className="border border-[#e5cdb3] rounded-lg p-4 hover:shadow-md transition cursor-pointer" onClick={() => onSelect(post.id)}>
                {post.imageUrl && (
                  <div className="mb-3">
                    <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover rounded" />
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-semibold text-[#684d3c] flex-1">{post.title}</h2>
                  <button
                    onClick={(e) => toggleFavorite(post.id, e)}
                    className={`ml-2 p-1 rounded-full transition ${
                      favoritePosts.includes(post.id)
                        ? 'text-red-500 hover:text-red-600'
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                    title={favoritePosts.includes(post.id) ? 'お気に入りから削除' : 'お気に入りに追加'}
                  >
                    <svg className="w-5 h-5" fill={favoritePosts.includes(post.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
                
                <p className="text-[#b49574] text-sm line-clamp-2 mb-3">{post.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  {post.category && (
                    <span className="px-2 py-1 bg-[#f8d9a0] text-[#684d3c] text-xs rounded-full">
                      {post.category}
                    </span>
                  )}
                  {post.tags?.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-[#e5cdb3] text-[#7d5c39] text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <p className="text-xs text-[#be8c58]">
                  {new Date(post.createdAt).toLocaleDateString('ja-JP')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostList;
