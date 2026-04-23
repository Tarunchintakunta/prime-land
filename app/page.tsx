import { Chapter1Gate } from "@/components/chapters/Chapter1Gate";
import { Chapter2Manifesto } from "@/components/chapters/Chapter2Manifesto";
import { Chapter3Stats } from "@/components/chapters/Chapter3Stats";
import { Chapter4Categories } from "@/components/chapters/Chapter4Categories";
import { Chapter5Courses } from "@/components/chapters/Chapter5Courses";
import { Chapter6HowItWorks } from "@/components/chapters/Chapter6HowItWorks";
import { Chapter7Plans } from "@/components/chapters/Chapter7Plans";
import { Chapter8Graduation } from "@/components/chapters/Chapter8Graduation";
import { Footer } from "@/components/ui/Footer";
import { TopNav } from "@/components/ui/TopNav";

/**
 * Orchestrates the eight chapters. Each chapter self-registers ScrollTrigger
 * and pushes its chapter/theme into the zustand store. The BackgroundCanvas
 * (mounted in layout) listens to that store for the ink↔paper cross-fade.
 */
export default function HomePage() {
  return (
    <>
      <TopNav />
      <main id="main" className="relative">
        <Chapter1Gate />
        <Chapter2Manifesto />
        <Chapter3Stats />
        <Chapter4Categories />
        <Chapter5Courses />
        <Chapter6HowItWorks />
        <Chapter7Plans />
        <Chapter8Graduation />
      </main>
      <Footer />
    </>
  );
}
