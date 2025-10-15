import React from "react";
import { useUser } from "@clerk/nextjs";

type HeaderProps = {
  onShowFavorites?: () => void;
};

const Header = ({ onShowFavorites }: HeaderProps) => {
  const { user } = useUser();

  return (
    <header className="w-full bg-[#fff6ec] border-b border-[#e3d8ca] shadow-sm py-4 px-6 flex flex-col sm:flex-row items-center sm:justify-between">
      <h1 className="text-2xl font-bold text-[#4e342e] tracking-wide">My Ameba Blog</h1>
      <nav className="mt-2 sm:mt-0 flex gap-6">
        {user && onShowFavorites && (
          <button
            onClick={onShowFavorites}
            className="text-[#7d5c39] hover:text-[#684d3c] transition-colors font-medium"
          >
            お気に入り
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
