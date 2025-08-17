import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t-4 border-white py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="text-3xl font-black uppercase mb-4">BRUTAL.CO</div>
            <p className="font-bold">
              MAKING THE WEB MORE INTERESTING, ONE BRUTAL DESIGN AT A TIME.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-black uppercase mb-4">SERVICES</h3>
            <ul className="space-y-2 font-bold">
              <li>
                <Link
                  href="/services/web-design"
                  className="hover:text-yellow-400"
                >
                  WEB DESIGN
                </Link>
              </li>
              <li>
                <Link
                  href="/services/development"
                  className="hover:text-yellow-400"
                >
                  DEVELOPMENT
                </Link>
              </li>
              <li>
                <Link
                  href="/services/branding"
                  className="hover:text-yellow-400"
                >
                  BRANDING
                </Link>
              </li>
              <li>
                <Link
                  href="/services/consulting"
                  className="hover:text-yellow-400"
                >
                  CONSULTING
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-black uppercase mb-4">CONTACT</h3>
            <div className="space-y-2 font-bold">
              <div>HELLO@BRUTAL.CO</div>
              <div>+1 (555) BRUTAL-1</div>
              <div>NEW YORK, NY</div>
            </div>
          </div>
        </div>
        <div className="border-t-4 border-white mt-12 pt-8 text-center font-bold uppercase">
          © 2024 BRUTAL.CO - ALL RIGHTS RESERVED
        </div>
      </div>
    </footer>
  );
}
