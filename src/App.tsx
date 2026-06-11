/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Header from "./components/Header";
import Hero from "./components/Hero";
import WhyUs from "./components/WhyUs";
import Curriculum from "./components/Curriculum";
import FeaturedPrograms from "./components/FeaturedPrograms";
import SuccessSection from "./components/SuccessSection";
import Testimonials from "./components/Testimonials";
import CommunityAndFAQs from "./components/CommunityAndFAQs";

export default function App() {
  return (
    <div id="app-root" className="min-h-screen bg-[#FAFBFC] text-[#101828] font-sans antialiased relative selection:bg-[#2D7FF9]/25 selection:text-[#011673]">
      {/* Sticky top-level Glass navigation */}
      <Header />

      {/* Main visual layouts stack */}
      <main>
        {/* SECTION 1: Interactive Hero space and Mockups */}
        <Hero />

        {/* SECTION 2 & 3: Brand Trust, grayscales logos & value grids */}
        <WhyUs />

        {/* SECTION 4 & 8: Learning Paths, categories and syllabus timeline */}
        <Curriculum />

        {/* SECTION 5: Live filtering catalogue maps */}
        <FeaturedPrograms />

        {/* SECTION 6 & 9: Dynamic custom statistics and credentials biography */}
        <SuccessSection />

        {/* SECTION 7: Student testimonials, carousels, and visual interview players */}
        <Testimonials />

        {/* SECTION 10, 11, 12, 13, 14: Community discussions, pricing levels, FAQ, conversions card */}
        <CommunityAndFAQs />
      </main>
    </div>
  );
}

