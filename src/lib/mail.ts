import nodemailer from "nodemailer";
import { unitLabel, sourceLabel } from "./leads";

type LeadMail = {
  name: string;
  phone: string;
  message: string | null;
  source: string | null;
  unit_interest: string | null;
};

function esc(s: unknown) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Yeni talep gelince info@ adresine bildirim maili gönderir.
// SMTP ayarı (.env) yoksa sessizce hiçbir şey yapmaz; mail hatası lead kaydını etkilemez.
export async function sendLeadNotification(lead: LeadMail): Promise<void> {
  try {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const port = Number(process.env.SMTP_PORT || "465");
    const to = process.env.LEAD_NOTIFY_TO || user;
    if (!host || !user || !pass) return;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const tarih = new Date().toLocaleString("tr-TR", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const row = (label: string, value: string) =>
      `<tr><td style="padding:8px 0;color:#8a8378;width:130px;vertical-align:top">${label}</td><td style="padding:8px 0;color:#1a1a1a">${value}</td></tr>`;

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:8px">
        <h2 style="color:#c08a4d;margin:0 0 2px">Yeni Müşteri Talebi — Loft 777</h2>
        <p style="color:#999;margin:0 0 18px;font-size:13px">${tarih}</p>
        <table style="width:100%;border-collapse:collapse;font-size:15px">
          ${row("Ad Soyad", `<b>${esc(lead.name)}</b>`)}
          ${row("Telefon", `<a href="tel:${esc(lead.phone)}" style="color:#c08a4d">${esc(lead.phone)}</a>`)}
          ${lead.unit_interest ? row("İlgilendiği", esc(unitLabel(lead.unit_interest))) : ""}
          ${lead.message ? row("Mesaj", esc(lead.message)) : ""}
          ${row("Kaynak", esc(sourceLabel(lead.source)))}
        </table>
        <p style="margin-top:22px">
          <a href="https://camsankoparan.com/yonetim" style="background:#c08a4d;color:#14110e;padding:11px 20px;border-radius:22px;text-decoration:none;font-weight:bold;font-size:14px">Panelde Aç</a>
        </p>
      </div>`;

    await transporter.sendMail({
      from: `"Loft 777 Web Sitesi" <${user}>`,
      to,
      subject: `🔔 Yeni Talep — ${lead.name} (${lead.phone})`,
      html,
    });
  } catch {
    // mail gönderim hatası talebi etkilemesin
  }
}
