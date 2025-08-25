import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-4xl font-black uppercase text-red-500 mb-4">
        Authentication Failed
      </h1>
      <p className="text-black font-bold mb-6">
        Something went wrong during the authentication process. Please try
        again.
      </p>
      <Link href="/user/settings">
        <button className="bg-black text-white border-4 border-black hover:bg-white hover:text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-6 py-3">
          Back to Settings
        </button>
      </Link>
    </div>
  );
}
