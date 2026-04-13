import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { SeoSchema } from "@/components/shared/seo-schema";
import { ButtonLink } from "@/components/ui/button-link";
import { format } from "date-fns";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: { "@type": "Person", name: post.author },
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    image: `${process.env.NEXT_PUBLIC_SITE_URL}/opengraph-image`,
    publisher: {
      "@type": "Organization",
      name: "Goke",
      url: process.env.NEXT_PUBLIC_SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.svg`,
      },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: process.env.NEXT_PUBLIC_SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${process.env.NEXT_PUBLIC_SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title },
    ],
  };

  return (
    <>
      <SeoSchema schema={articleSchema} />
      <SeoSchema schema={breadcrumbSchema} />

      {/* Hero */}
      <section className="py-14 md:py-24 bg-[#2a5144]">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-white/75 hover:text-white transition-colors mb-8"
          >
            ← Back to Blog
          </Link>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-4">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs font-semibold uppercase tracking-widest text-[#487f6a]">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            {post.title}
          </h1>
          <p className="text-white/85 text-base mb-6">{post.description}</p>
          <div className="flex items-center gap-4 text-xs text-white/65">
            <span>{post.author}</span>
            <span>·</span>
            <span>{format(new Date(post.publishedAt), "MMMM d, yyyy")}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="py-10 md:py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="prose prose-stone max-w-none
            prose-headings:font-bold prose-headings:text-foreground prose-headings:mt-10 prose-headings:mb-4
            prose-h2:text-2xl prose-h3:text-xl
            prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-5
            prose-a:text-accent prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground
            prose-li:text-muted-foreground prose-li:mb-2
            prose-ul:mt-4 prose-ul:mb-6 prose-ol:mt-4 prose-ol:mb-6
            prose-hr:my-10 prose-hr:border-border
            prose-blockquote:border-l-accent prose-blockquote:text-muted-foreground
          ">
            <MDXRemote source={post.content} />
          </div>
        </div>
      </article>

      {/* CTA */}
      <section className="py-14 md:py-24 bg-[#2a5144]">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-card border border-white rounded-2xl px-6 md:px-10 py-10 md:py-14 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
              Ready to put this into action?
            </h2>
            <p className="text-muted-foreground text-base mb-8">
              Get a personalized career analysis and a clear plan tailored to your background and goals. Free to start.
            </p>
            <ButtonLink href="/signup" size="lg" style={{ padding: '1.25rem 2.5rem' }}>
              Get My Free Career Analysis
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
