import { useEffect, useState } from "react";
import { fetchPosts } from "../api/api";
import PostCard from "../components/PostCard";
import CategoryFilter from "../components/CategoryFilter";
import { Search } from "lucide-react";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);

  // -----------------------------
  // DEVICE DETECTION
  // -----------------------------
  useEffect(() => {
    const checkDevice = () => {
      setIsMobileOrTablet(window.innerWidth < 1024);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // -----------------------------
  // FETCH POSTS
  // -----------------------------
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchPosts();
      setPosts(data);
      setLoading(false);
    };

    load();
  }, []);

  // -----------------------------
  // FILTER LOGIC
  // -----------------------------
  const filteredPosts =
    isMobileOrTablet && searchQuery.trim()
      ? posts.filter((post) =>
          post?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post?.author?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : posts;

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">

        {/* LEFT SIDE (POSTS) */}
        <div className="flex-1">

          {/* MOBILE/TABLET SEARCH (HIDDEN ON LG+) */}
          {isMobileOrTablet && (
            <div className="relative lg:hidden sticky top-0 z-10 bg-gray-50 py-3">
              
              {/* SEARCH ICON */}
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                className="w-full bg-white border rounded-full py-3 pl-10 pr-4 text-sm shadow-sm focus:outline-none"
              />
            </div>
          )}

          {/* POSTS */}
          <div className="space-y-4 lg:space-y-6 mt-4 lg:mt-0">

            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-gray-500 text-sm font-medium">
                  No posts yet
                </p>
              </div>
            )}

          </div>

        </div>

        {/* RIGHT SIDE (CATEGORY - DESKTOP ONLY) */}
        <div className="hidden lg:block w-[320px] sticky top-6 h-[calc(100vh-40px)] overflow-hidden">
          <CategoryFilter
            posts={posts}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

      </div>
    </div>
  );
}

export default Home;