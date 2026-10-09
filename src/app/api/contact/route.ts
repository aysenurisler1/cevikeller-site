import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contact } from "@/data/content";

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("RESEND_API_KEY tanımlı değil — .env.local dosyasına ekle.");
    return NextResponse.json(
      { error: "Sunucu yapılandırma hatası." },
      { status: 500 }
    );
  }

  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Ad, e-posta ve mesaj alanları zorunlu." },
        { status: 400 }
      );
    }

    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      // Resend hesabı doğrulanmış bir alan adına sahip olana kadar bu
      // varsayılan gönderici adresi kullanılıyor.
      from: "Çevikeller Web Sitesi <onboarding@resend.dev>",
      to: contact.emailPlaceholder,
      replyTo: email,
      subject: `Web sitesi mesajı — ${name}`,
      text: `Gönderen: ${name}\nE-posta: ${email}\n\n${message}`,
    });

    if (error) {
      console.error("Resend hata:", error);
      return NextResponse.json(
        { error: "E-posta gönderilemedi." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("İletişim formu hatası:", err);
    return NextResponse.json(
      { error: "Beklenmeyen bir hata oluştu." },
      { status: 500 }
    );
  }
}