import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import ShareButtons from "@/components/news/share-buttons";
import {
  Radio,
  Clock,
  Calendar,
  Phone,
  MessageCircle,
  ArrowLeft,
  ArrowRight,
  Heart,
  User,
  ExternalLink,
} from "lucide-react";
import { Show, ShowlugResponse } from "@/types/shows";

const API_BASE_URL = "http://168.231.101.52:8080/api";

interface ShowDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

async function getShowBySlug(slug: string): Promise<Show | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/shows/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return null;
    }

    const data: ShowlugResponse = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("Error fetching show:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: ShowDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const show = await getShowBySlug(slug);

  if (!show) {
    return {
      title: "Show Not Found",
    };
  }

  const siteName = locale === "ar" ? "النخلة إف إم" : "Al Nakhla FM";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://alnakhlafm.com";
  const pageUrl = `${siteUrl}/${locale}/shows/${slug}`;

  // Ensure image URL is absolute
  const imageUrl = show.cover_url?.startsWith("http")
    ? show.cover_url
    : show.cover_url
    ? `${siteUrl}${show.cover_url}`
    : undefined;

  return {
    title: `${show.title} | ${siteName}`,
    description: show.about,
    openGraph: {
      title: show.title,
      description: show.about,
      url: pageUrl,
      type: "website",
      siteName,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: show.title,
            },
          ]
        : [],
      locale: locale === "ar" ? "ar_SA" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: show.title,
      description: show.about,
      images: imageUrl ? [imageUrl] : [],
    },
    alternates: {
      canonical: pageUrl,
      languages: {
        ar: `${siteUrl}/ar/shows/${slug}`,
        en: `${siteUrl}/en/shows/${slug}`,
      },
    },
  };
}

export default async function ShowDetailPage({ params }: ShowDetailPageProps) {
  const { locale, slug } = await params;
  const show = await getShowBySlug(slug);

  if (!show) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "ShowsPage" });
  const isArabic = locale === "ar";
  const BackArrow = isArabic ? ArrowRight : ArrowLeft;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-linear-to-b from-gray-50 to-white">
        {/* Hero Section with Cover Image */}
        <section className="relative h-64 md:h-80 lg:h-96">
          <Image
            src={show.cover_url || "/images/placeholder-show.jpg"}
            alt={show.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent" />

          {/* Back Button */}
          <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
            <Link
              href={`/${locale}/shows`}
              className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <BackArrow className="w-5 h-5" />
              <span className="hidden md:inline">{t("heroTitle")}</span>
            </Link>
          </div>

          {/* Featured Badge */}
          {show.is_featured && (
            <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 animate-pulse">
              <div className="w-2.5 h-2.5 bg-white rounded-full" />
              {t("liveNow")}
            </div>
          )}

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="container mx-auto">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                {show.title}
              </h1>
              {show.author && (
                <p className="text-white/80 text-lg flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {t("hostedBy")} {show.author.name}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="container mx-auto px-4 md:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Schedule Cards */}
              {show.schedule && show.schedule.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-red-50 rounded-xl p-5 border border-red-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Clock className="w-5 h-5 text-red-600" />
                      </div>
                      <span className="font-semibold text-gray-900">
                        {t("airTime")}
                      </span>
                    </div>
                    <p className="text-gray-700 text-lg">
                      {show.schedule[0].steam_time}
                    </p>
                  </div>

                  <div className="bg-rose-50 rounded-xl p-5 border border-rose-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-rose-100 rounded-lg">
                        <Calendar className="w-5 h-5 text-rose-600" />
                      </div>
                      <span className="font-semibold text-gray-900">
                        {t("days")}
                      </span>
                    </div>
                    <p className="text-gray-700 text-lg">
                      {show.schedule[0].human_readable}
                    </p>
                  </div>
                </div>
              )}

              {/* About Section */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <Radio className="w-6 h-6 text-red-600" />
                  {t("aboutShow")}
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                  {show.about}
                </p>
              </div>

              {/* Stream Link */}
              {show.stream_url && (
                <div className="bg-linear-to-r from-red-600 to-rose-600 rounded-2xl p-6 text-white">
                  <h3 className="text-xl font-bold mb-3">
                    {isArabic ? "استمع الآن" : "Listen Now"}
                  </h3>
                  <a
                    href={show.stream_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors"
                  >
                    <Radio className="w-5 h-5" />
                    {isArabic ? "البث المباشر" : "Live Stream"}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Host Card */}
              {show.author && (
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {t("hostedBy")}
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src={
                          show.author.avatar_url ||
                          "/images/placeholder-avatar.jpg"
                        }
                        alt={show.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-900">
                        {show.author.name}
                      </p>
                      {show.author.email && (
                        <a
                          href={`mailto:${show.author.email}`}
                          className="text-red-600 text-sm hover:underline"
                        >
                          {show.author.email}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Card */}
              {show.contacts && (
                <div className="bg-linear-to-br from-red-50 to-rose-50 rounded-2xl p-6 border border-red-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-red-600" />
                    {t("contactInfo")}
                  </h3>

                  <div className="space-y-4">
                    {/* Phone */}
                    {show.contacts.phone && (
                      <div>
                        <p className="text-sm font-semibold text-gray-600 mb-2">
                          {t("callUs")}
                        </p>
                        <a
                          href={`tel:${show.contacts.phone}`}
                          className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-lg text-red-600 font-semibold hover:bg-red-100 transition-colors border border-red-200 w-full"
                        >
                          <Phone className="w-4 h-4" />
                          {show.contacts.phone}
                        </a>
                      </div>
                    )}

                    {/* WhatsApp */}
                    {show.contacts.whatsapp && (
                      <div>
                        <p className="text-sm font-semibold text-gray-600 mb-2">
                          {t("whatsapp")}
                        </p>
                        <a
                          href={`https://wa.me/${show.contacts.whatsapp.replace(
                            /^0/,
                            "964"
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors w-full justify-center"
                        >
                          <MessageCircle className="w-5 h-5" />
                          {show.contacts.whatsapp}
                        </a>
                      </div>
                    )}

                    {/* Email */}
                    {show.contacts.email && (
                      <div>
                        <p className="text-sm font-semibold text-gray-600 mb-2">
                          {isArabic ? "البريد الإلكتروني" : "Email"}
                        </p>
                        <a
                          href={`mailto:${show.contacts.email}`}
                          className="text-red-600 hover:underline"
                        >
                          {show.contacts.email}
                        </a>
                      </div>
                    )}

                    {/* Social Links */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {show.contacts.facebook && (
                        <a
                          href={show.contacts.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          title="Facebook"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {show.contacts.instagram && (
                        <a
                          href={show.contacts.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                          title="Instagram"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {show.contacts.twitter && (
                        <a
                          href={show.contacts.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                          title="Twitter"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {show.contacts.telegram && (
                        <a
                          href={show.contacts.telegram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          title="Telegram"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors">
                  <Heart className="w-5 h-5" />
                  {t("favorite")}
                </button>
              </div>

              {/* Share Section */}
              <ShareButtons
                title={show.title}
                translations={{
                  shareArticle: t("share"),
                  copyLink: isArabic ? "نسخ الرابط" : "Copy Link",
                  linkCopied: isArabic ? "تم النسخ!" : "Link Copied!",
                }}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
