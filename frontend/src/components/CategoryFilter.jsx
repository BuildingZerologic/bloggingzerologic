import { useEffect, useState } from "react";
import { fetchCategories } from "../api/api";
import { Search, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CategoryFilter({
 
  posts = [],
  onSelect,
  selectedCategory
}) {
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

   const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "";

  // =========================
  // LOAD CATEGORIES
  // =========================
  useEffect(() => {
    const load = async () => {
      const data = await fetchCategories();
      setCategories(data || []);

      if (!selectedCategory && data?.length > 0) {
        onSelect(data[0].id);
      }
    };

    load();
  }, []);

  // =========================
  // FILTER POSTS
  // =========================
  const filteredPosts = posts.filter((post) => {
    const matchCategory = selectedCategory
      ? String(post?.category?.id) === String(selectedCategory)
      : true;

    const matchSearch =
      post?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post?.author?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchSearch;
  });

  const currentCategory =
    categories.find((c) => c.id === selectedCategory)?.name ||
    "Select Category";

  return (
    <div className="w-full max-w-[400px] flex flex-col gap-6">

      {/* SEARCH */}
      <div className="relative ">
        <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="w-full bg-[#F2F2F2] border border-gray-400/50 rounded-full py-4 pl-12 pr-4 text-[16px] focus:outline-none"
        />
      </div>

      {/* CATEGORY CARD */}
      <div className="bg-[#F2F2F2] rounded-[24px] border border-gray-400/50 overflow-hidden">

        {/* HEADER */}
        <div className="p-6 flex items-center justify-between border-b border-black">
          <h2 className="text-[20px] font-bold">Category</h2>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 text-[13px] font-medium "
            >
              {currentCategory}
              <ChevronDown className="w-4 h-4" />
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0"
                  onClick={() => setIsDropdownOpen(false)}
                />

                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg z-20">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onSelect(cat.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                        selectedCategory === cat.id
                          ? "bg-gray-100 font-semibold"
                          : ""
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* =========================
            FIXED HEIGHT + SCROLL AREA
        ========================== */}
        <div className="flex flex-col lg:h-[calc(100vh-220px)] lg:overflow-y-auto">

          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div
                key={post.slug}
                onClick={() => navigate(`/post/${post.slug}`)}
                className="p-6 border-b border-gray-400/50 hover:bg-black/5 transition"
              >
                {/* AUTHOR */}
                <div className="flex items-center gap-2 mb-1">
                  {post?.author?.avatar?.url && (
                    <img
                      src={`${API_URL}${post.author.avatar.url}`}
                      className="w-5 h-5 rounded-full"
                      alt=""
                    />
                  )}
                  <span className="text-xs text-gray-600">
                    {post?.author?.name}
                  </span>
                </div>

                {/* TITLE */}
                <h3 className="text-[15px] font-semibold line-clamp-2">
                  {post.title}
                </h3>
              </div>
            ))
          ) : (
            <div className="p-6 text-sm text-gray-500">
              No posts found
            </div>
          )}

        </div>
      </div>
    </div>
  );
}