import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t-4 border-white py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="text-3xl font-black uppercase mb-4 text-pink-400">
              CLIPS.ID
            </div>
            <p className="font-bold">
              MENGHUBUNGKAN CREATOR DENGAN CLIPPER TERBAIK, SATU KONTEN VIRAL
              PADA SATU WAKTU.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-black uppercase mb-4 text-yellow-400">
              FITUR
            </h3>
            <ul className="space-y-2 font-bold">
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-cyan-400 transition-colors"
                >
                  DASHBOARD CREATOR
                </Link>
              </li>
              <li>
                <Link
                  href="/marketplace"
                  className="hover:text-cyan-400 transition-colors"
                >
                  MARKETPLACE CLIPPER
                </Link>
              </li>
              <li>
                <Link
                  href="/contests"
                  className="hover:text-cyan-400 transition-colors"
                >
                  KOMPETISI BERHADIAH
                </Link>
              </li>
              <li>
                <Link
                  href="/analytics"
                  className="hover:text-cyan-400 transition-colors"
                >
                  ANALYTICS
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-black uppercase mb-4 text-cyan-400">
              KONTAK
            </h3>
            <div className="space-y-2 font-bold">
              <div>HELLO@CLIPS.ID</div>
              <div>+62 812-3456-7890</div>
              <div>JAKARTA, INDONESIA</div>
              <div className="flex gap-4 mt-4">
                <Link
                  href="#"
                  className="hover:text-pink-400 transition-colors"
                >
                  INSTAGRAM
                </Link>
                <Link
                  href="#"
                  className="hover:text-yellow-400 transition-colors"
                >
                  TIKTOK
                </Link>
                <Link
                  href="#"
                  className="hover:text-cyan-400 transition-colors"
                >
                  YOUTUBE
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t-4 border-white mt-12 pt-8 text-center font-bold uppercase">
          © 2024 CLIPS.ID - SEMUA HAK DILINDUNGI
        </div>
      </div>
    </footer>
  );
}
