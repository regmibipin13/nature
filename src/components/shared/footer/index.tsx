import prisma from "@/lib/db";
import {
  IconBrandTelegram,
  IconBrandThreads,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import {
  Facebook,
  Github,
  Instagram,
  Linkedin,
  MailIcon,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import Link from "next/link";

const socialIconMap = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  github: Github,
  telegram: IconBrandTelegram,
  whatsapp: IconBrandWhatsapp,
  email: MailIcon,
  phone: Phone,
  threads: IconBrandThreads,
};

interface SocialLink {
  icon: keyof typeof socialIconMap;
  url: string;
  value: string;
}

interface FooterData {
  socialLinks: SocialLink[];
  copyrightText: string;
  logoUrl: string;
}

export async function Footer() {
  const pageContent = await prisma.pageContent.findUnique({
    where: { pageType: "footer" },
  });

  if (!pageContent) {
    return null;
  }

  const footerData: FooterData = pageContent.content as any;

  return (
    <footer className="bg-white rounded-b-2xl pt-12 pb-4 px-6 sm:px-8 border-t mt-20">
      <div className="max-w-7xl mx-auto flex flex-col">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:justify-between mb-8 gap-8">
          {/* Logo */}
          <div className="flex-1 min-w-[180px] flex flex-col">
            <div className="mb-4 md:mb-8">
              <img
                src={footerData.logoUrl || "/logo.png"}
                alt="Logo"
                className="h-10"
              />
            </div>
          </div>

          {/* Columns */}
          <div className="flex-[3] grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12 w-full">
            <div>
              <div className="font-semibold mb-4">COMPANY</div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <Link href="/blogs">BLOG</Link>
                </li>
                <li>
                  <Link href="/about">ABOUT</Link>
                </li>
                <li>
                  <Link href="/contact">CONTACT</Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-4">LEGAL</div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <Link href="/tos">TERMS OF SERVICE</Link>
                </li>
                <li>
                  <Link href="/privacy">PRIVACY POLICY</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="my-4 border-gray-200" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="text-xs text-gray-500 text-center sm:text-left">
            {footerData.copyrightText ||
              "© 2025 NATURE AND NURTURES COMPANY, INC. ALL RIGHTS RESERVED."}
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-6">
            {footerData.socialLinks?.map((link: SocialLink, index: number) => {
              const IconComponent = socialIconMap[link.icon];
              if (!IconComponent) return null;

              return (
                <Link
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <IconComponent className="w-5 h-5" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
