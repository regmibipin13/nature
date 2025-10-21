import { BlogCard } from "@/components/shared/blog-card";
import { Footer } from "@/components/shared/footer";
import Header from "@/components/shared/header";
import prisma from "@/lib/db";
import { Metadata } from "next";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "Blogs | Nature & Nurtures",
  description: "Read our latest blogs about nature and nurturing",
};
export const revalidate = 0;

async function getPublishedBlogs() {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        status: "published",
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return blogs;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export default async function BlogsPage() {
  const blogs = await getPublishedBlogs();

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Blogs</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Our Blogs</h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Discover insights about nature and nurturing through our latest
            articles.
          </p>
        </div>

        {/* Blogs Grid */}
        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">No blogs available</h2>
            <p className="text-muted-foreground">
              Check back later for new content.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                id={blog.id}
                title={blog.title}
                excerpt={blog.excerpt || undefined}
                categories={blog.categories}
                tags={blog.tags}
                featuredImage={blog.featuredImage || undefined}
                slug={blog.slug || undefined}
                createdAt={blog.createdAt}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
