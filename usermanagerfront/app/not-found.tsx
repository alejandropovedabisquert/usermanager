import Link from "next/link";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: 'Not Found',
}

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold text-red-600">404 - Not Found</h1>
      <p className="mt-4 text-lg">
        The page you are looking for does not exist.
      </p>
      <Link href="/" className="mt-6 text-blue-500 hover:underline">
        Return to Home
      </Link>
    </div>
  );
}