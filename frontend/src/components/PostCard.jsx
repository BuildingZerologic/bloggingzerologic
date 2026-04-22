import { useNavigate } from "react-router-dom";
import { formatDate} from "../utils/helpers";
import { getCategoryColor } from "../api/api";

function PostCard({ post }) {
  const navigate = useNavigate();

  const author = post.author;
  const coverImage = post.coverImage;
  const category = post.category;
  const categoryColor = category ? getCategoryColor(category.id) : null;

  return (
    <div className="group relative h-full bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
      {category && categoryColor && (
        <div className="absolute left-0 top-0 bottom-0 w-1 z-10">
          <div
            className="absolute -left-0.5 top-2 px-2 py-1 rounded-r text-white text-xs font-bold"
            style={{
              background: `linear-gradient(to right, ${categoryColor.bg} 0%, ${categoryColor.dark} 100%)`,
            }}
          >
            {category.name}
          </div>
        </div>
      )}

    
      {coverImage && (
        <div className="h-32 overflow-hidden bg-gray-200">
          <img
            src={`${import.meta.env.VITE_API_URL}${coverImage.url}`}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      )}

      <div className="p-3 flex flex-col grow pl-4">
      
        <h2 className="text-base font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-gray-700 transition-colors">
          {post.title}
        </h2>

      

        
        {author && (
          <div className="flex items-center mb-2 pt-2 border-t border-gray-200">
            {author.avatar && (
              <img
                src={`${import.meta.env.VITE_API_URL}${author.avatar.url}`}
                alt={author.name}
                className="w-6 h-6 rounded-full mr-2 object-cover border border-gray-300 shrink-0"
              />
            )}
            <div className="grow min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">{author.name}</p>
              <p className="text-xs text-gray-500">
                {formatDate(post.publishedAt)}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => navigate(`/post/${post.slug}`)}
          className="w-full px-3 py-2 bg-linear-to-r from-gray-900 to-gray-800 text-white text-xs font-semibold rounded-md hover:from-gray-800 hover:to-gray-700 transition-all duration-200 shadow-sm hover:shadow-md group/btn shrink-0"
        >
          Read More
          <svg className="inline ml-1 w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default PostCard;