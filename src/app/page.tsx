import {Navbar} from "@/components/navbar";
import { Footer } from "@/components/footer";
import HeroSection from "@/components/hero";
export default function Home() {
  return (
    <div className=" flex flex-col">
      <Navbar />
      <HeroSection />
      <main className="mt-1">
        <Footer />
      </main>
      
    </div>
        
  );
}
