import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-6xl font-bold mb-3">Bring Photos to Life with AI</h1>
      <p className="mb-5 text-xl text-gray-600">
        Generate cinematic videos from still images in just seconds.
      </p>

      <Link href="/create" className="bg-gray-600 hover:bg-gray-900 text-white px-6 py-3 rounded-md mb-4">
        TRY NOW
      </Link>
      
      </main>
  );
}
