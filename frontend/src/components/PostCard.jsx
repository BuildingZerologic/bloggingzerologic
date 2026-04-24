import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/helpers";
import { getCategoryColor } from "../api/api";
import { Hand, MessageCircle, BookmarkPlus } from "lucide-react";

export default function PostCard({ post }) {
  
  const navigate = useNavigate();

  const author = post?.author;
  const coverImage = post?.coverImage;
  const category = post?.category;
  const categoryColor = category ? getCategoryColor(category.id) : null;
 
  return (
    <div className="group flex flex-col md:flex-row gap-6 py-8 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors duration-200 px-4 -mx-4 rounded-xl">

      {/* CONTENT */}
      <div className="flex-1 min-w-0 order-2 md:order-1">

        {/* CATEGORY META */}
        <div className="flex items-center gap-2 mb-3">
          {category?.icon && (
            <img
              src={category.icon}
              alt=""
              className="w-5 h-5 rounded-sm object-contain"
              referrerPolicy="no-referrer"
            />
          )}

          <span className="text-[13px] text-gray-600">
            Published in{" "}
            <span className="font-semibold text-gray-900 border-b border-transparent hover:border-gray-900 cursor-pointer">
              {category?.name || "zerologic"}
            </span>
          </span>
        </div>

        {/* TITLE */}
        <h2
          onClick={() => navigate(`/post/${post.slug}`)}
          className="text-xl md:text-2xl font-bold text-gray-900 mb-2 leading-tight cursor-pointer group-hover:text-gray-700 transition-colors line-clamp-2"
        >
          {post.title}
        </h2>

        {/* AUTHOR */}
        <p className="text-[15px] text-gray-500 mb-6 font-medium">
          By {author?.name || "Anonymous"}
        </p>

        {/* FOOTER */}
        <div className="flex items-center justify-between mt-auto pt-2">

          {/* LEFT ACTIONS */}
          <div className="flex items-center gap-6 text-[13px] text-gray-500">

            <span>{formatDate(post.publishedAt)}</span>

            <button className="flex items-center gap-1.5 hover:text-gray-900 transition-colors">
              <Hand size={18} strokeWidth={1.5} />
              <span>{post.claps || 0}</span>
            </button>

            <button className="flex items-center gap-1.5 hover:text-gray-900 transition-colors">
              <MessageCircle size={18} strokeWidth={1.5} />
              <span>{post.comments || 0}</span>
            </button>

          </div>

          {/* RIGHT ACTION */}
          <button className="text-gray-400 hover:text-gray-900 transition-colors">
            <BookmarkPlus size={22} strokeWidth={1.2} />
          </button>

        </div>
      </div>

      {/* IMAGE */}
      {coverImage && (
        <div
          onClick={() => navigate(`/post/${post.slug}`)}
          className="w-full md:w-[200px] h-[134px] flex-shrink-0 bg-gray-100 rounded-sm overflow-hidden cursor-pointer order-1 md:order-2 self-center"
        >
          <img
            src={
              coverImage.url?.startsWith("http")
                ? coverImage.url
                : `${import.meta.env.VITE_API_URL}${coverImage.url}`
            }
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        </div>
      )}
    </div>
  );
}