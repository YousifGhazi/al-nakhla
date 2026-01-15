import { Metadata } from "next";
import Header from "@/components/header";
import Footer from "@/components/footer";
import RadioCard from "@/components/radio-card";
import ShareButtons from "@/components/news/share-buttons";

interface RadioPageProps {
  params: Promise<{ locale: string }>;
}

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

export async function generateMetadata({
  params,
}: RadioPageProps): Promise<Metadata> {
  const { locale } = await params;

  const siteName = locale === "ar" ? "النخلة إف إم" : "Al Nakhla FM";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://alnakhlafm.com";
  const pageUrl = `${siteUrl}/${locale}/radio`;
  const title = locale === "ar" ? "الراديو المباشر" : "Live Radio";
  const description =
    mockProgram.description[locale as keyof typeof mockProgram.description] ||
    mockProgram.description.en;
  const imageUrl = `${siteUrl}/images/radio.jpeg`;

  return {
    title: `${title} | ${siteName}`,
    description,
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      url: pageUrl,
      type: "website",
      siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: locale === "ar" ? "ar_SA" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteName}`,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: pageUrl,
      languages: {
        ar: `${siteUrl}/ar/radio`,
        en: `${siteUrl}/en/radio`,
      },
    },
  };
}

export default async function RadioPage({ params }: RadioPageProps) {
  const { locale } = await params;
  const isArabic = locale === "ar";

  const currentTitle =
    mockProgram.title[locale as keyof typeof mockProgram.title] ||
    mockProgram.title.en;

  return (
    <>
      <Header />
      <main className="py-12 px-4">
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

          {/* Share Section */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <ShareButtons
              title={currentTitle}
              translations={{
                shareArticle: isArabic ? "مشاركة الراديو" : "Share Radio",
                copyLink: isArabic ? "نسخ الرابط" : "Copy Link",
                linkCopied: isArabic ? "تم النسخ!" : "Link Copied!",
              }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
