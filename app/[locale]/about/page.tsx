import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";
import {
  Radio,
  Target,
  Zap,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Music2,
  Linkedin,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutPage" });

  return {
    title: t("pageTitle"),
  };
}

export default function AboutPage() {
  const t = useTranslations("AboutPage");

  const timeline = [
    {
      year: t("timeline.0.year"),
      title: t("timeline.0.title"),
      description: t("timeline.0.description"),
    },
    {
      year: t("timeline.1.year"),
      title: t("timeline.1.title"),
      description: t("timeline.1.description"),
    },
    {
      year: t("timeline.2.year"),
      title: t("timeline.2.title"),
      description: t("timeline.2.description"),
    },
    {
      year: t("timeline.3.year"),
      title: t("timeline.3.title"),
      description: t("timeline.3.description"),
    },
    {
      year: t("timeline.4.year"),
      title: t("timeline.4.title"),
      description: t("timeline.4.description"),
    },
    {
      year: t("timeline.5.year"),
      title: t("timeline.5.title"),
      description: t("timeline.5.description"),
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Mission & Vision Section - Professional layout */}
        <div className="bg-linear-to-r from-primary-700 via-primary-800 to-primary-700 py-16">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t("heroTitle")}
            </h1>
            <p className="text-xl text-white/80">{t("heroDescription")}</p>
          </div>
        </div>
        <section className="py-12 md:p-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              {/* Page Title */}

              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                {/* Mission Card */}
                <div className="bg-white rounded-lg p-10 md:p-12 shadow-sm hover:shadow-md transition-shadow duration-300 border-2 border-primary-500">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="shrink-0">
                      <div className="w-14 h-14 bg-primary-500 rounded-lg flex items-center justify-center">
                        <Target className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        {t("missionTitle")}
                      </h2>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {t("missionDescription")}
                  </p>
                </div>

                {/* Vision Card */}
                <div className="bg-white rounded-lg p-10 md:p-12 shadow-sm hover:shadow-md transition-shadow duration-300 border-2 border-primary-500">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="shrink-0">
                      <div className="w-14 h-14 bg-primary-500 rounded-lg flex items-center justify-center">
                        <Zap className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        {t("visionTitle")}
                      </h2>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {t("visionDescription")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section - Professional layout */}
        <section className="py-20 md:py-32 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {t("timelineTitle")}
                </h2>
                <div className="w-20 h-1 bg-primary-500 mx-auto" />
              </div>

              {/* Timeline Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {timeline.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-8 hover:shadow-md transition-all duration-300 border-2 border-primary-500"
                  >
                    <div className="mb-5">
                      <span className="inline-block text-2xl font-bold text-primary-500 mb-2">
                        {item.year}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Social Media Section */}
        <section className="py-20 md:py-32 bg-gray-50 border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {t("socialTitle")}
                </h2>
                <div className="w-20 h-1 bg-primary-500 mx-auto mb-6" />
                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  {t("socialDescription")}
                </p>
              </div>

              {/* Social Media Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {/* Facebook */}
                <a
                  href="https://facebook.com/alnakhlafm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-lg p-6 transition-all duration-300 hover:shadow-lg border-2 border-gray-200 hover:border-blue-600"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                      <Facebook className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <span className="text-base font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                      {t("facebook")}
                    </span>
                  </div>
                </a>

                {/* Twitter */}
                <a
                  href="https://twitter.com/alnakhlafm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-lg p-6 transition-all duration-300 hover:shadow-lg border-2 border-gray-200 hover:border-sky-500"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-sky-50 rounded-lg flex items-center justify-center group-hover:bg-sky-500 transition-colors duration-300">
                      <Twitter className="w-6 h-6 text-sky-500 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <span className="text-base font-semibold text-gray-700 group-hover:text-sky-500 transition-colors duration-300">
                      {t("twitter")}
                    </span>
                  </div>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com/alnakhlafm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-lg p-6 transition-all duration-300 hover:shadow-lg border-2 border-gray-200 hover:border-pink-600"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-pink-50 rounded-lg flex items-center justify-center group-hover:bg-pink-600 transition-colors duration-300">
                      <Instagram className="w-6 h-6 text-pink-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <span className="text-base font-semibold text-gray-700 group-hover:text-pink-600 transition-colors duration-300">
                      {t("instagram")}
                    </span>
                  </div>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com/@alnakhlafm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-lg p-6 transition-all duration-300 hover:shadow-lg border-2 border-gray-200 hover:border-primary-500"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-primary-500 transition-colors duration-300">
                      <Youtube className="w-6 h-6 text-primary-500 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <span className="text-base font-semibold text-gray-700 group-hover:text-primary-500 transition-colors duration-300">
                      {t("youtube")}
                    </span>
                  </div>
                </a>

                {/* TikTok */}
                <a
                  href="https://tiktok.com/@alnakhlafm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-lg p-6 transition-all duration-300 hover:shadow-lg border-2 border-gray-200 hover:border-gray-900"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-900 transition-colors duration-300">
                      <Music2 className="w-6 h-6 text-gray-900 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <span className="text-base font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                      {t("tiktok")}
                    </span>
                  </div>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/company/alnakhlafm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-lg p-6 transition-all duration-300 hover:shadow-lg border-2 border-gray-200 hover:border-blue-700"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors duration-300">
                      <Linkedin className="w-6 h-6 text-blue-700 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <span className="text-base font-semibold text-gray-700 group-hover:text-blue-700 transition-colors duration-300">
                      {t("linkedin")}
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Facilities Section - Professional layout */}
        <section className="py-20 md:py-32 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {t("facilitiesTitle")}
                </h2>
                <div className="w-20 h-1 bg-primary-500 mx-auto mb-6" />
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {t("facilitiesDescription")}
                </p>
              </div>

              {/* Images Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="group relative h-96 lg:h-[500px] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-500">
                  <Image
                    src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=600&fit=crop"
                    alt="Studio"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-center gap-3">
                      <Radio className="w-6 h-6 text-red-400" />
                      <span className="text-xl font-bold text-white">
                        Broadcasting Studio
                      </span>
                    </div>
                  </div>
                </div>
                <div className="group relative h-96 lg:h-[500px] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-500">
                  <Image
                    src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=600&fit=crop"
                    alt="Newsroom"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-center gap-3">
                      <Radio className="w-6 h-6 text-red-400" />
                      <span className="text-xl font-bold text-white">
                        Newsroom
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
