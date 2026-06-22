import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin-auth";
import { serviceKeyReady } from "@/lib/supabase-admin";
import { getContent } from "@/lib/content";
import type { Dict } from "@/lib/dict";
import { ContentEditor, type EditableContent } from "../content-editor";

export const dynamic = "force-dynamic";

// Dict'ten düzenlenebilir alanları çıkarır
function extract(d: Dict): EditableContent {
  return {
    contact: {
      phone: d.contactPage.phone,
      address: d.contactPage.address,
      mail: d.contactPage.mail,
    },
    project: {
      status: d.project.status,
      location: d.project.location,
    },
    units: d.project.units.map((u) => ({
      type: u.type,
      size: u.size,
      d: u.d,
      img: u.img,
    })),
    texts: {
      heroSub: d.hero.sub,
      aboutBody: d.about.body,
      aboutIntro: d.aboutPage.intro,
    },
  };
}

export default async function IcerikPage() {
  if (!(await isAuthed())) {
    redirect("/yonetim/giris");
  }

  if (!serviceKeyReady()) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold text-bronze">Son bir adım kaldı</h1>
        <p className="mt-4 leading-relaxed text-white/70">
          İçerik yönetimi için Supabase&apos;in <b>service_role</b> anahtarının ayar dosyasına
          eklenmesi gerekiyor.
        </p>
      </main>
    );
  }

  const tr = extract(await getContent("tr"));
  const en = extract(await getContent("en"));

  return <ContentEditor initialTr={tr} initialEn={en} />;
}
