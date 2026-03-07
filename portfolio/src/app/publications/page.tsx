import { PublicationsSection } from "@/components/sections";

export const metadata = {
  title: "Publications | Emmanuel Safo Acheampong",
  description: "Peer-reviewed publications and research contributions in signal processing and machine learning.",
};

export default function PublicationsPage() {
  return (
    <div className="pt-16">
      <PublicationsSection />
    </div>
  );
}
