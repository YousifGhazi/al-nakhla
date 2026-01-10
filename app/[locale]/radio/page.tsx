"use client";

import { useTranslations, useLocale } from "next-intl";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useState, useEffect } from "react";
import RadioCard from "@/components/radio-card";

// Static data for demo
const mockProgram = {
  title: {
    ar: "أمسيات النخلة",
    en: "Evening Vibes",
  },
  host: {
    ar: "سارة المنصوري",
    en: "Sarah Al-Mansouri",
  },
  listeners: 12453,
  description: {
    ar: "انضم إلينا لأفضل الأمسيات الموسيقية والترفيهية مع أجمل الأغاني والحوارات الممتعة",
    en: "Join us for the best evening music and entertainment with the finest songs and engaging conversations",
  },
  startTime: "18:00",
  endTime: "21:00",
};

// Toggle this to test both states
const HAS_ACTIVE_PROGRAM = true;

export default function RadioPage() {
  const t = useTranslations("RadioPage");
  const locale = useLocale();
  const [currentListeners, setCurrentListeners] = useState(
    mockProgram.listeners
  );

  const currentTitle =
    mockProgram.title[locale as keyof typeof mockProgram.title] ||
    mockProgram.title.en;

  // Simulate listener count changes
  useEffect(() => {
    if (!HAS_ACTIVE_PROGRAM) return;

    const interval = setInterval(() => {
      setCurrentListeners((prev) =>
        Math.max(
          mockProgram.listeners - 100,
          Math.min(
            mockProgram.listeners + 100,
            prev + Math.floor(Math.random() * 10 - 5)
          )
        )
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
            imageUrl="https://picsum.photos/500/500"
            duration={`${mockProgram.startTime} - ${mockProgram.endTime}`}
            isLive={HAS_ACTIVE_PROGRAM}
            listeners={currentListeners}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
