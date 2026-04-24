import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPostBySlug, fetchPosts } from "../api/api";
import { formatDate } from "../utils/helpers";
import { ArrowLeft, ArrowUp } from "lucide-react";
import PostCard from "../components/PostCard";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function SinglePost() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [seconds, setSeconds] = useState(0);

  const [showTopBtn, setShowTopBtn] = useState(false);
  const [isBottom, setIsBottom] = useState(false);

  const storageKey = `read_time_${slug}`;

  // -------------------------
  // FETCH DATA
  // -------------------------
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      window.scrollTo(0, 0);

      const postData = await fetchPostBySlug(slug);
      setPost(postData);

      const postsData = await fetchPosts();
      setAllPosts(postsData);

      const savedTime = localStorage.getItem(storageKey);
      setSeconds(savedTime ? parseInt(savedTime) : 0);

      setLoading(false);
    };

    load();
  }, [slug]);

  // -------------------------
  // TIMER
  // -------------------------
  useEffect(() => {
    if (!post) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        const updated = prev + 1;
        localStorage.setItem(storageKey, updated);
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [post]);

  // -------------------------
  // SCROLL DETECTION
  // -------------------------
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      const atBottom = scrollTop + windowHeight >= docHeight - 10;

      setIsBottom(atBottom);
      setShowTopBtn(scrollTop > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatTime = (sec) =>
    `${Math.max(1, Math.floor(sec / 60))} min read`;

  // -------------------------
  // IMAGE FIX
  // -------------------------
  const coverImage = post?.coverImage?.url?.startsWith("http")
    ? post.coverImage.url
    : `${API_URL}${post?.coverImage?.url || ""}`;

  const avatar = post?.author?.avatar?.url?.startsWith("http")
    ? post.author.avatar.url
    : `${API_URL}${post?.author?.avatar?.url || ""}`;

  // -------------------------
  // RELATED POSTS
  // -------------------------
  const relatedPosts = allPosts.filter(
    (p) =>
      p.category?.id === post?.category?.id &&
      p.slug !== post.slug
  );

  // -------------------------
  // LOADING
  // -------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-10 text-gray-500 hover:text-black"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* TITLE */}
        <h1 className="text-4xl font-bold mb-4">
          {post.title}
        </h1>

        {/* AUTHOR */}
        <div className="flex items-center gap-3 mt-6">
          {avatar && (
            <img
              src={avatar}
              className="w-10 h-10 rounded-full object-cover"
              alt="author"
            />
          )}
          <span className="text-gray-700 font-medium">
            {post.author?.name}
          </span>
        </div>

        {/* META */}
        <div className="flex justify-between border-y py-3 text-sm text-gray-500 mb-6">
          <span>{formatDate(post.publishedAt)}</span>
          <span className="text-black font-semibold">
            {formatTime(seconds)}
          </span>
        </div>

        {/* CONTENT */}
        <div className="max-w-3xl">
          {post.content?.map((block, i) => (
            <div key={i}>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {block.children?.map((c) => c.text).join("")}
              </p>

              {/* COVER IMAGE AFTER FIRST PARAGRAPH */}
              {i === 0 && coverImage && (
                <img
                  src={coverImage}
                  className="w-full rounded-xl mb-8"
                  alt="cover"
                />
              )}
            </div>
          ))}
        </div>

        {/* RELATED POSTS */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">
              Related Posts
            </h2>

            <div className="flex flex-col gap-6">
              {relatedPosts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* =========================
          BACK TO TOP BUTTONS
      ========================= */}

      {/* FLOATING BUTTON (SCROLLING) */}
      {showTopBtn && !isBottom && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-black text-white p-3 rounded-full shadow-lg hover:scale-105 transition"
        >
          <ArrowUp size={18} />
        </button>
      )}

      {/* CENTER BUTTON (BOTTOM REACHED OR END CONTENT) */}
      {isBottom && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2">
          <button
            onClick={scrollToTop}
            className="bg-black text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition flex items-center gap-2"
          >
            <ArrowUp size={18} />
            Back to Top
          </button>
        </div>
      )}
    </div>
  );
}