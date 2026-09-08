import { redirect, notFound } from "next/navigation";
import { isAuthed } from "@/lib/admin-auth";
import { getLead, getActivities, serviceKeyReady } from "@/lib/supabase-admin";
import type { Activity } from "@/lib/leads";
import { LeadDetail } from "./detail";

export const dynamic = "force-dynamic";

// Tek adayın detay + görüşme geçmişi ekranı
export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAuthed())) redirect("/yonetim/giris");
  if (!serviceKeyReady()) redirect("/yonetim");

  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) notFound();

  let activities: Activity[] = [];
  try {
    activities = await getActivities(id);
  } catch {
    // geçmiş yüklenemezse boş göster; sayfa yine açılır
  }

  return <LeadDetail lead={lead} initialActivities={activities} />;
}
