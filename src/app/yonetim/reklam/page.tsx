import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin-auth";
import { getSettings, serviceKeyReady } from "@/lib/supabase-admin";
import { ReklamEditor } from "../reklam-editor";

export const dynamic = "force-dynamic";

export default async function ReklamPage() {
  if (!(await isAuthed())) {
    redirect("/yonetim/giris");
  }

  const settings = serviceKeyReady() ? await getSettings() : {};
  return <ReklamEditor initial={settings} />;
}
