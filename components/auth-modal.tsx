"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { generateDeviceId, saveToken, saveUsername } from "@/lib/token-utils";
import { generatePublicToken } from "@/lib/api/token-api";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string, username: string) => void;
  locale: string;
  translations: {
    title: string;
    description: string;
    namePlaceholder: string;
    nameLabel: string;
    submit: string;
    cancel: string;
    generating: string;
    success: string;
    error: string;
  };
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  locale,
  translations: t,
}: AuthModalProps) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const isRTL = locale === "ar";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError(isRTL ? "الرجاء إدخال اسمك" : "Please enter your name");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const deviceId = generateDeviceId();
      const response = await generatePublicToken(name.trim(), deviceId);

      if (response.success && response.data.token) {
        const token = response.data.token;
        const username = response.data.name;

        // Save to localStorage
        saveToken(token);
        saveUsername(username);

        // Show success state briefly
        setSuccess(true);

        setTimeout(() => {
          onSuccess(token, username);
          handleClose();
        }, 1000);
      } else {
        throw new Error("Failed to generate token");
      }
    } catch (err) {
      console.error("Error generating token:", err);
      setError(t.error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setName("");
      setError("");
      setSuccess(false);
      onClose();
    }
  };

  // State to track if we're on the client (for portal)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-700 to-primary-800 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">{t.title}</h2>
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="text-white/80 hover:text-white transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {success ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                    <p className="text-lg font-semibold text-gray-900">
                      {t.success}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-gray-600 text-sm mb-4">
                      {t.description}
                    </p>

                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        {t.nameLabel}
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setError("");
                        }}
                        placeholder={t.namePlaceholder}
                        disabled={isLoading}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                        dir={isRTL ? "rtl" : "ltr"}
                        autoFocus
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {t.cancel}
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading || !name.trim()}
                        className="flex-1 px-4 py-3 bg-primary-700 text-white rounded-lg font-medium hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {t.generating}
                          </>
                        ) : (
                          t.submit
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  // Use portal to render at document body level to avoid z-index issues
  if (!mounted) return null;

  return createPortal(modalContent, document.body);
}
