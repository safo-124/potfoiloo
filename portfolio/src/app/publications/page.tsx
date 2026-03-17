import { PublicationsSection } from "@/components/sections";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Publications | Emmanuel Safo Acheampong",
  description: "Peer-reviewed publications and research contributions in signal processing and machine learning.",
};

export default async function PublicationsPage() {
  let publications;
  try {
    publications = await prisma.publication.findMany({ orderBy: { order: "asc" } });
  } catch { publications = []; }

  return (
    <div className="pt-16">
      <PublicationsSection data={publications} />
    </div>
  );
}
