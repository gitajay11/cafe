import { MotionConfig } from "framer-motion";
import { Atmosphere } from "./components/Atmosphere";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { EASE } from "./lib/motion";
import { Contact } from "./sections/Contact";
import { Experience } from "./sections/Experience";
import { Gallery } from "./sections/Gallery";
import { Hero } from "./sections/Hero";
import { Menu } from "./sections/Menu";
import { Story } from "./sections/Story";
import { Visit } from "./sections/Visit";

export default function App() {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: EASE }}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Atmosphere />
      <Navbar />
      <main id="main" className="relative z-10">
        <Hero />
        <Story />
        <Menu />
        <Experience />
        <Gallery />
        <Visit />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}
