import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { formatDistanceToNow } from "date-fns";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata: Metadata = {
  title: "Blog | Goke",
  description:
    "Career tips, job market guides, and practical advice for professionals navigating their next move.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div>
      {/* Hero */}
      <section className="py-14 md:py-24 bg-[#2a5144]">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#487f6a] mb-4">The Goke Blog</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Career Resources
          </h1>
          <p className="text-white/85 text-base md:text-lg">
            Practical advice, job market insights, and guides to help you make confident career decisions — wherever you are in your journey.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl font-bold text-foreground mb-3">Articles coming soon.</p>
              <p className="text-muted-foreground text-base mb-8">
                We&apos;re working on resources to help you move forward. In the meantime, get started with your free career analysis.
              </p>
              <ButtonLink href="/signup">
                Get My Free Career Analysis
              </ButtonLink>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                  <article className="bg-card border border-white rounded-2xl p-8 h-full flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs font-semibold uppercase tracking-widest text-accent"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <h2 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors mb-3 leading-snug">
                        {post.title}
                      </h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {post.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/50">
                      <span className="text-xs text-muted-foreground">{post.author}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
