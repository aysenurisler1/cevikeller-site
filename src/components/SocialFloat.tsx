import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { contact } from "@/data/content";

const WHATSAPP_MESSAGE = encodeURIComponent(
  "Merhaba, ürünleriniz hakkında bilgi almak istiyorum."
);

export default function SocialFloat() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-center gap-3">
      <a href={`https://www.instagram.com/${contact.instagramUsername}/`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram hesabımız"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white shadow-lg transition-transform hover:scale-110"
      >
        <FaInstagram className="h-7 w-7" />
      </a>
      <a href={`https://wa.me/${contact.whatsappNumber}?text=${WHATSAPP_MESSAGE}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp ile yazın"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110"
      >
        <FaWhatsapp className="h-8 w-8" />
      </a>
    </div>
  );
}