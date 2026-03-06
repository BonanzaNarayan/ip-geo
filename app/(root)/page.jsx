import CodeSnippets from "./_components/CodeSnippets";
import { CTA, Footer } from "./_components/CTAAndFooter";
import Endpoints from "./_components/Endpoints";
import Hero from "./_components/Hero";
import LiveDemo from "./_components/LiveDemo";
import Navbar from "./_components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Endpoints />
      <LiveDemo />
      <CodeSnippets />
      <Footer />
    </main>
  );
}
