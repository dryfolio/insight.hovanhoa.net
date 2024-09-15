import Hero from "@/components/hero";
import Navbar from "@/components/nav";
import PostTile from "@/components/post-tile";
import { HASHNODE_API } from "@/constants";
import { GET_POST } from "@/lib/gql";
import { type PostExcerpt } from "@/lib/types";
import Link from "next/link";

async function getPosts(
  cursor?: string
): Promise<{ posts: PostExcerpt[]; endCursor?: string }> {
  const res = await fetch(HASHNODE_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({ query: GET_POST }),
    next: {
      revalidate: 1,
    },
  });

  const { data } = await res.json();

  const posts = data.publication.posts.edges.map((edge: any) => edge.node);

  return {
    posts,
  };
}

export default async function Home() {
  const { posts } = await getPosts();

  return (
    <main className="min-h-screen relative">
      <div className="py-8 md:py-12 pb-0 px-4 sm:px-6 lg:pl-52 mb-8 md:mb-0">
        <Navbar />
      </div>
      <Hero />
      <section className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 overflow-hidden">
        {posts.map((post: PostExcerpt) => (
          <Link href={`/${post.slug}`} prefetch={false} key={post.id} replace>
            <PostTile key={post.id} post={post} />
          </Link>
        ))}
      </section>
    </main>
  );
}
