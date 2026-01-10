import { useTranslations, useLocale } from "next-intl";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useState, useEffect } from "react";
import RadioCard from "@/components/radio-card";

// Static data for demo
const mockProgram = {
  title: {
    ar: " برامج اذاعة النخلة",
    en: "Al-Nakhla Radio Programs",
  },
  listeners: 12453,
  description: {
    ar: " استمع إلى أفضل البرامج الموسيقية والثقافية على إذاعة النخلة إف إم طوال اليوم. انضم إلينا في رحلة مليئة بالترفيه والمعرفة.",
    en: "Tune in to the best music and cultural programs on Al Nakhla FM Radio all day long. Join us for a journey filled with entertainment and knowledge.",
  },
  startTime: "18:00",
  endTime: "21:00",
};

// Toggle this to test both states
const HAS_ACTIVE_PROGRAM = true;

export default function RadioPage() {
  const t = useTranslations("RadioPage");
  const locale = useLocale();

  const currentTitle =
    mockProgram.title[locale as keyof typeof mockProgram.title] ||
    mockProgram.title.en;

  // Simulate listener count changes

  return (
    <>
      <Header />
      <main className="  py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <RadioCard
            title={currentTitle}
            description={
              mockProgram.description[
                locale as keyof typeof mockProgram.description
              ] || mockProgram.description.en
            }
            imageUrl="/images/radio.jpeg"
            isLive={HAS_ACTIVE_PROGRAM}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
