import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { formatDistanceToNow } from "date-fns";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Career tips, immigration insights, and job market guides for newcomers to Canada.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div>
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Career Resources
          </h1>
          <p className="text-muted-foreground text-lg">
            Tips, guides, and insights to help immigrants succeed in Canada&apos;s
            job market.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          {posts.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Articles coming soon. Check back shortly!
            </p>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="border-b border-border pb-8 last:border-0"
                >
                  <Link href={`/blog/${post.slug}`} className="group">
                    <h2 className="text-xl font-bold group-hover:text-accent transition-colors mb-2">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-muted-foreground text-sm mb-3">
                    {post.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{post.author}</span>
                    <span>
                      {formatDistanceToNow(new Date(post.publishedAt), {
                        addSuffix: true,
                      })}
                    </span>
                    {post.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="bg-muted px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
