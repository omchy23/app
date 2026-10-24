import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/Hero";
import EarningsChart from "@/components/Earningchart";

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <EarningsChart />
    </>
  );
}