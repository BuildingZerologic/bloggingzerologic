const API_URL = import.meta.env.VITE_API_URL;

/* -----------------------------
   FETCH POSTS (ALL)
------------------------------*/
export const fetchPosts = async () => {
  try {
    const res = await fetch(
      `${API_URL}/api/posts?populate[author][populate]=avatar&populate[category]=true&populate[coverImage]=true`
    );

    const data = await res.json();
    return data?.data || [];
  } catch (err) {
    console.error(err);
    return [];
  }
};

/* -----------------------------
   SINGLE POST
------------------------------*/
export const fetchPostBySlug = async (slug) => {
  try {
    const res = await fetch(
      `${API_URL}/api/posts?filters[slug][$eq]=${slug}&populate[author][populate]=avatar&populate[category]=true&populate[coverImage]=true`
    );

    const data = await res.json();
    return data?.data?.[0] || null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

/* -----------------------------
   CATEGORIES
------------------------------*/
export const fetchCategories = async () => {
  try {
    const res = await fetch(`${API_URL}/api/categories`);
    const data = await res.json();
    return data?.data || [];
  } catch (err) {
    console.error(err);
    return [];
  }
};

/* -----------------------------
   CATEGORY COLORS
------------------------------*/
export const getCategoryColor = (id) => {
  const colors = [
    { bg: "#DC2626" },
    { bg: "#2563EB" },
    { bg: "#7C3AED" },
    { bg: "#059669" },
    { bg: "#DB2777" },
  ];

  return colors[id % colors.length];
};