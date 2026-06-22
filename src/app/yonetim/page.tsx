import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin-auth";
import { getLeads, serviceKeyReady } from "@/lib/supabase-admin";
import type { Lead } from "@/lib/leads";
import { LeadsBoard } from "./leads-table";

export const dynamic = "force-dynamic";

export default async function YonetimPage() {
  // Giriş kontrolü
  if (!(await isAuthed())) {
    redirect("/yonetim/giris");
  }

  // service_role anahtarı henüz girilmemişse uyarı göster
  if (!serviceKeyReady()) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold text-bronze">Son bir adım kaldı</h1>
        <p className="mt-4 leading-relaxed text-white/70">
          Panelin talepleri okuyabilmesi için Supabase&apos;in <b>service_role</b> anahtarının
          ayar dosyasına eklenmesi gerekiyor. Bu adım tamamlanınca talepler burada listelenecek.
        </p>
      </main>
    );
  }

  let leads: Lead[] = [];
  let error = "";
  try {
    leads = await getLeads();
  } catch {
    error = "Talepler yüklenemedi. Lütfen biraz sonra tekrar deneyin.";
  }

  return <LeadsBoard initialLeads={leads} loadError={error} />;
}
