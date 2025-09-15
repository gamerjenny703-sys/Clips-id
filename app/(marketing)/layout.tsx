// app/(marketing)/layout.tsx
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import { createClient } from "@/lib/supabase/server";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <div className="flex min-h-screen flex-col">
      <Header initialUser={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
