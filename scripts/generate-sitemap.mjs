import { writeFileSync } from "fs";
import { resolve } from "path";

 const GET_POST = `
query Publication {
  publication(host: "suhailkakar.hashnode.dev") {
    isTeam
    title
    posts(first: 20) {
      edges {
        node {
          id
          title
          brief
          tags {
            name
          }
          slug
          publishedAt
        }
      }
    }
  }
}
`;

async function getPosts() {
  const res = await fetch("https://gql.hashnode.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: GET_POST }),
  });

  const { data } = await res.json();
  return data.publication.posts.edges.map((edge) => edge.node);
}

async function generateSitemap() {
  const posts = await getPosts();
  const baseUrl = "https://suhailkakar.com";

  const staticPages = [
    { path: "", changefreq: "always", priority: 1.0 },
  ];

  const dynamicPages = posts.map((post) => ({
    path: `/${post.slug}`,
    changefreq: "daily",
    priority: 0.8,
    lastmod: new Date(post.publishedAt).toISOString(),
  }));

  const allPages = [
    ...staticPages,
    ...dynamicPages.map((page) => ({
      path: page.path,
      changefreq: page.changefreq,
      priority: page.priority,
      lastmod: page.lastmod || new Date().toISOString(),
    })),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (url) => `
  <url>
    <loc>${baseUrl}${url.path}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    <lastmod>${url.lastmod || new Date().toISOString()}</lastmod>
  </url>`
  )
  .join("")}
</urlset>`;

  const sitemapPath = resolve(process.cwd(), "public", "sitemap.xml");
  writeFileSync(sitemapPath, sitemap, "utf8");
  console.log(`✔️ Sitemap generated at ${sitemapPath}`);
}

generateSitemap().catch((err) => {
  console.error(`❌ Error generating sitemap: ${err}`);
});
