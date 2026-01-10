"use client";

import { useTranslations } from "next-intl";
import Header from "@/components/header";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";
import Footer from "@/components/footer";

export default function ContactPage() {
  const t = useTranslations("ContactPage");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Header />

      <main className="flex-1 overflow-y-auto  bg-gray-50">
        <div className="container mx-auto px-4 py-6 h-full">
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            {/* Title Section */}
            <div className="mb-10 text-center">
              <h1 className="text-4xl md:text-5xl  bg-linear-to-r from-primary-700 to-primary-800 bg-clip-text text-transparent mb-3 tracking-tight leading-tight pb-2">
                {t("heroTitle")}
              </h1>
              <p className="text-lg text-gray-600 font-medium">
                {t("heroDescription")}
              </p>
            </div>

            {/* Main Content Grid */}
            <div className="flex flex-col-reverse lg:grid lg:grid-cols-3 gap-6 flex-1 min-h-0">
              {/* Contact Form - Takes 2 columns */}
              <div className="lg:col-span-2 flex flex-col">
                <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 flex flex-col h-full">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {t("formTitle")}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {t("formDescription")}
                    </p>
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col flex-1 min-h-0"
                  >
                    <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                      {/* Name & Email Row */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                            Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder={t("namePlaceholder")}
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-600 focus:bg-white transition-colors text-gray-900 placeholder-gray-400 font-medium"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder={t("emailPlaceholder")}
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-600 focus:bg-white transition-colors text-gray-900 placeholder-gray-400 font-medium"
                            required
                          />
                        </div>
                      </div>

                      {/* Phone & Subject Row */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                            Phone
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder={t("phonePlaceholder")}
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-600 focus:bg-white transition-colors text-gray-900 placeholder-gray-400 font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                            Subject
                          </label>
                          <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder={t("subjectPlaceholder")}
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-600 focus:bg-white transition-colors text-gray-900 placeholder-gray-400 font-medium"
                            required
                          />
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                          Message
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder={t("messagePlaceholder")}
                          rows={3}
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-600 focus:bg-white transition-colors text-gray-900 placeholder-gray-400 resize-none font-medium"
                          required
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <button
                        type="submit"
                        className="w-full px-8 py-4 bg-primary-600 text-white font-bold rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors uppercase tracking-wide text-sm"
                      >
                        {t("submitButton")}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Sidebar - Takes 1 column */}
              <div className="flex flex-col gap-6 min-h-0">
                {/* Contact Information Card */}
                <div className="bg-white rounded-lg p-6 shadow-sm border-2 border-primary-600 space-y-3">
                  {/* Address */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <h4 className="font-bold text-gray-900 mb-1 text-sm">
                          {t("addressLabel")}
                        </h4>
                        <p className="text-gray-600 text-xs leading-relaxed">
                          {t("addressValue")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <h4 className="font-bold text-gray-900 mb-1 text-sm">
                          {t("phoneLabel")}
                        </h4>
                        <p className="text-gray-600 text-xs">
                          {t("phoneValue")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <h4 className="font-bold text-gray-900 mb-1 text-sm">
                          {t("emailLabel")}
                        </h4>
                        <p className="text-gray-600 text-xs break-all">
                          {t("emailValue")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <h4 className="font-bold text-gray-900 mb-1 text-sm">
                          {t("hoursLabel")}
                        </h4>
                        <p className="text-gray-600 text-xs">
                          {t("hoursValue")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex-1 min-h-0 overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d105735.24719278784!2d44.29493841640625!3d33.31243900000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15577f67a0a74193%3A0x9deda9d2a3b16f2c!2sBaghdad%2C%20Iraq!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Al Nakhla FM Location"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
