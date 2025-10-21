import { Footer } from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import prisma from "@/lib/db";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getBlogBySlug(slug: string) {
  try {
    const blog = await prisma.blog.findFirst({
      where: {
        slug: slug,
        status: "published",
      },
    });
    return blog;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog Not Found",
    };
  }

  return {
    title: `${blog.title} | Nature & Nurtures`,
    description:
      blog.metaDescription ||
      blog.excerpt ||
      `Read ${blog.title} on Nature & Nurtures`,
    openGraph: {
      title: blog.title,
      description: blog.metaDescription || blog.excerpt || "",
      images: blog.featuredImage ? [{ url: blog.featuredImage }] : [],
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-6 md:py-10">
        {/* Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList className="text-sm md:text-base">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/blogs">Blogs</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1">
                {blog.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <article className="max-w-7xl mx-auto mt-12">
          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="aspect-video relative overflow-hidden rounded-lg mb-6 md:mb-10">
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="object-cover w-full h-full"
              />
            </div>
          )}

          {/* Blog Header */}
          <header className="mb-6 md:mb-10">
            <h1 className="text-2xl md:text-4xl font-bold mb-4 max-w-7xl break-words">
              {blog.title}
            </h1>

            {blog.excerpt && (
              <p className="text-base md:text-xl text-muted-foreground mb-4 md:mb-6">
                {blog.excerpt}
              </p>
            )}

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
              {blog.categories.map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
              {blog.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Published Date */}
            <div className="text-xs md:text-sm text-muted-foreground">
              Published on{" "}
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </header>

          {/* Blog Content */}
          <div
            className="prose  break-words overflow-hidden [&_*]:max-w-full   [&_img]:w-full [&_img]:object-cover"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>
      </div>
      <Footer />
    </div>
  );
}
