import React from "react";

type Post = {
  id: number;
  title: string;
  description: string;
};

type PostListProps = {
  posts: Post[];
  onSelect: (id: number) => void;
};

const PostList = ({ posts, onSelect }: PostListProps) => (
  <ul className="w-full max-w-xl mx-auto bg-[#fffdfa] rounded-lg shadow-md p-5 divide-y divide-[#eee1cf]">
    {posts.length === 0 && (
      <li className="text-center text-[#be8c58] py-8">記事はまだありません。</li>
    )}
    {posts.map(post => (
      <li key={post.id} className="py-4 cursor-pointer hover:bg-[#fff2e3] transition" onClick={() => onSelect(post.id)}>
        <h2 className="text-lg font-semibold text-[#684d3c]">{post.title}</h2>
        <p className="text-[#b49574] mt-1 line-clamp-2">{post.description}</p>
      </li>
    ))}
  </ul>
);

export default PostList;
