export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard/"], // Keep admin areas private
    },
    sitemap: "https://zookly.vercel.app/sitemap.xml",
  };
}