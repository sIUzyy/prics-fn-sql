// ---- react ----
import React, { useRef } from "react";

// ---- component - header ----
import NavigationBar from "@/components/header/navigation-bar";
import Footer from "@/components/header/footer";

// ---- component - pages ----
import HeroPageComponent from "@/components/pages/hero-page";
import AboutPageComponent from "@/components/pages/about-page";
import ClientPageComponent from "@/components/pages/clients-page";
import AboutEpodPageComponent from "@/components/pages/about-epod-page";

export default function LandingPage() {
  // ref to scroll down to specific page
  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  const clientRef = useRef(null);
  const epodRef = useRef(null);

  return (
    <React.Fragment>
      {/* Navigation Bar */}
      <NavigationBar
        aboutRef={aboutRef}
        contactRef={contactRef}
        clientRef={clientRef}
      />

      {/* Landing Page */}
      <HeroPageComponent epodRef={epodRef} />

      <ClientPageComponent clientRef={clientRef} />

      {/* About Page */}
      <AboutPageComponent aboutRef={aboutRef} />

      {/* About EPOD Page */}
      <AboutEpodPageComponent epodRef={epodRef} />

      {/* Footer Page */}
      <Footer contactRef={contactRef} />
    </React.Fragment>
  );
}
