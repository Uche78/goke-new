import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { SeoSchema } from "@/components/shared/seo-schema";
import { formatDistanceToNow } from "date-fns";

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
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
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
    publisher: {
      "@type": "Organization",
      name: "Goke",
      url: process.env.NEXT_PUBLIC_SITE_URL,
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

      <article className="container mx-auto px-4 py-16 max-w-2xl">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          <p className="text-muted-foreground mb-4">{post.description}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{post.author}</span>
            <span>
              {formatDistanceToNow(new Date(post.publishedAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </header>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <MDXRemote source={post.content} />
        </div>
      </article>
    </>
  );
}
