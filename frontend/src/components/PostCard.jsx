import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/helpers";
import { getCategoryColor } from "../api/api";
import { MessageCircle } from "lucide-react";

export default function PostCard({ post }) {
  const navigate = useNavigate();

  const author = post?.author;
  const coverImage = post?.coverImage;
  const category = post?.category;

  return (
    <div className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300 flex flex-col h-full cursor-pointer">

      {coverImage && (
        <div
          onClick={() => navigate(`/post/${post.slug}`)}
          className="relative w-full h-48 bg-gray-100 overflow-hidden"
        >
          <img
            src={
              coverImage.url?.startsWith("http")
                ? coverImage.url
                : `${import.meta.env.VITE_API_URL}${coverImage.url}`
            }
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      <div className="p-4 flex flex-col flex-1">
        
        <div className="flex items-center gap-2 mb-3">
          {category?.icon && (
            <img
              src={category.icon}
              alt=""
              className="w-4 h-4 rounded-sm object-contain"
              referrerPolicy="no-referrer"
            />
          )}
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            {category?.name || "zerologic"}
          </span>
        </div>

        
        <h2
          onClick={() => navigate(`/post/${post.slug}`)}
          className="text-lg font-bold text-gray-900  leading-snug line-clamp-2 h-14 group-hover:text-gray-700 transition-colors"
        >
          <span className="border-b-2 border-transparent line-clamp-2 group-hover:border-gray-900 transition-all">
            {post.title}
          </span>
        </h2>

        <div className="flex-1" />

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="font-medium">By {author?.name || "Anonymous"}</span>
          <span>{formatDate(post.publishedAt)}</span>
        </div>

     
       
      </div>
    </div>
  );
}