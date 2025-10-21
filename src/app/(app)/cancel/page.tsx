import { Footer } from "@/components/shared/footer";
import Header from "@/components/shared/header";
import Link from "next/link";

export const metadata = {
  title: "Payment Canceled - Nature Nurtures",
  description: "Your payment was not completed. Please try again.",
};

export default function CancelPage() {
  return (
    <>
      <Header />
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md text-center">
          <h1 className="text-3xl font-bold mb-4 text-red-600">
            Payment Canceled
          </h1>
          <p className="text-gray-700 mb-6">Your payment was not completed.</p>
          <Link href="/" className="text-blue-500 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
