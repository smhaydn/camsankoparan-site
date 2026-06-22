import { redirect } from "next/navigation";
import { defaultLocale } from "@/lib/i18n";

// Kök adres varsayılan dile yönlendirilir
export default function RootRedirect() {
  redirect(`/${defaultLocale}`);
}
