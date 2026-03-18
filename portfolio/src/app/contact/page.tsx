import { ContactSection } from "@/components/sections";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export const metadata = {
  title: "Contact | Emmanuel Safo Acheampong",
  description: "Get in touch for research collaboration, engineering projects, or career opportunities.",
};

export default async function ContactPage() {
  let settings: Awaited<ReturnType<typeof prisma.siteSettings.findUnique>> = null;
  try {
    settings = await prisma.siteSettings.findUnique({ where: { id: "main" } });
  } catch { /* empty */ }

  return (
    <div className="pt-16">
      <ContactSection settings={settings ?? undefined} />
    </div>
  );
}
