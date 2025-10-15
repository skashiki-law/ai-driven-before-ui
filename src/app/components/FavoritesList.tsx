import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

type FavoritePost = {
  id: number;
  postId: number;
  post: {
    id: number;
    title: string;
    description: string;
    imageUrl?: string;
    category?: string;
    tags?: string[];
    createdAt: string;
  };
  createdAt: string;
};

type FavoritesListProps = {
  onSelect: (id: number) => void;
  onBack: () => void;
};

const FavoritesList = ({ onSelect, onBack }: FavoritesListProps) => {
  const { user } = useUser();
  const [favorites, setFavorites] = useState<FavoritePost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/favorites');
      const result = await response.json();
      if (result.message === 'Success') {
        setFavorites(result.favorites);
      }
    } catch (error) {
      console.error('お気に入り取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (postId: number) => {
    if (!user) return;

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          action: 'remove'
        }),
      });

      const result = await response.json();
      if (result.message === 'Success') {
        setFavorites(prev => prev.filter(fav => fav.postId !== postId));
      }
    } catch (error) {
      console.error('お気に入り削除エラー:', error);
    }
  };

  if (!user) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-[#fffdfa] rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold text-[#684d3c] mb-4">お気に入り</h2>
          <p className="text-[#be8c58]">お気に入り機能を使用するにはログインが必要です</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-[#fffdfa] rounded-lg shadow-md p-8 text-center">
          <p className="text-[#be8c58]">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-[#fffdfa] rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#684d3c]">お気に入り記事</h2>
          <button onClick={onBack} className="px-4 py-2 bg-[#dbc1ad] text-[#7d5c39] rounded hover:bg-[#e7cead] transition">
            一覧に戻る
          </button>
        </div>
        
        {favorites.length === 0 ? (
          <p className="text-center text-[#be8c58] py-8">お気に入り記事はまだありません。</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favorites.map((favorite) => (
              <div key={favorite.id} className="border border-[#e5cdb3] rounded-lg p-4 hover:shadow-md transition">
                {favorite.post.imageUrl && (
                  <div className="mb-3">
                    <img src={favorite.post.imageUrl} alt={favorite.post.title} className="w-full h-48 object-cover rounded" />
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-2">
                  <h3 
                    className="text-lg font-semibold text-[#684d3c] flex-1 cursor-pointer hover:text-[#9d856c] transition"
                    onClick={() => onSelect(favorite.postId)}
                  >
                    {favorite.post.title}
                  </h3>
                  <button
                    onClick={() => removeFavorite(favorite.postId)}
                    className="ml-2 p-1 text-red-500 hover:text-red-600 transition"
                    title="お気に入りから削除"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
                
                <p className="text-[#b49574] text-sm line-clamp-2 mb-3">{favorite.post.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  {favorite.post.category && (
                    <span className="px-2 py-1 bg-[#f8d9a0] text-[#684d3c] text-xs rounded-full">
                      {favorite.post.category}
                    </span>
                  )}
                  {favorite.post.tags?.slice(0, 2).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-[#e5cdb3] text-[#7d5c39] text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <p className="text-xs text-[#be8c58]">
                  お気に入り追加日: {new Date(favorite.createdAt).toLocaleDateString('ja-JP')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesList;
