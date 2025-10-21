import { Footer } from "@/components/shared/footer";
import Header from "@/components/shared/header";
import Link from "next/link";

export const metadata = {
  title: "Product Not Found",
  description: "The product you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <h1 className="text-9xl font-extrabold  dark:text-blue-400">404</h1>
          <h2 className="text-3xl sm:text-4xl font-bold">Page Not Found</h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
            Oops! The page you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/">
            <div className="inline-block px-6 py-3 text-sm font-semibold text-black  rounded-lg shadow-md  transition-colors duration-300">
              Return Home
            </div>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
