"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Download,
  X,
  Camera,
  Shirt,
  Wand2,
  ArrowLeft,
  Share2,
  Zap,
} from "lucide-react";
import { processImages } from "@/lib/api";
import { cn } from "@/lib/utils";
import Image from "next/image";

type ViewMode = "upload" | "processing" | "result";

export default function VirtualTryOn() {
  const [userImage, setUserImage] = useState<File | null>(null);
  const [outfitImage, setOutfitImage] = useState<File | null>(null);
  const [userImagePreview, setUserImagePreview] = useState<string | null>(null);
  const [outfitImagePreview, setOutfitImagePreview] = useState<string | null>(
    null
  );
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("upload");

  const onDropUser = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUserImage(file);
      setUserImagePreview(URL.createObjectURL(file));
      setError(null);
      setResultImageUrl(null);
    }
  }, []);

  const {
    getRootProps: getUserRootProps,
    getInputProps: getUserInputProps,
    isDragActive: isUserDragActive,
  } = useDropzone({
    onDrop: onDropUser,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
  });

  const onDropOutfit = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setOutfitImage(file);
      setOutfitImagePreview(URL.createObjectURL(file));
      setError(null);
      setResultImageUrl(null);
    }
  }, []);

  const {
    getRootProps: getOutfitRootProps,
    getInputProps: getOutfitInputProps,
    isDragActive: isOutfitDragActive,
  } = useDropzone({
    onDrop: onDropOutfit,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
  });

  const handleTryOn = async () => {
    if (!userImage || !outfitImage) {
      setError("Please upload both images");
      return;
    }

    setIsProcessing(true);
    setViewMode("processing");
    setError(null);

    try {
      const result = await processImages(userImage, outfitImage);
      setResultImageUrl(result.imageUrl);
      setViewMode("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setViewMode("upload");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setUserImage(null);
    setOutfitImage(null);
    setUserImagePreview(null);
    setOutfitImagePreview(null);
    setResultImageUrl(null);
    setError(null);
    setViewMode("upload");
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#F5F1ED] via-[#FEFDFB] to-[#E8D5D0] overflow-hidden">
      {/* Luxury gradient background with texture */}
      <div className="absolute inset-0">
        {/* Soft radial gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#E6E1F0]/30 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#C9D5C0]/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#E4C5B8]/10 via-transparent to-transparent" />

        {/* Subtle fabric texture overlay */}
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E\")",
            backgroundSize: "200px 200px",
          }}
        />

        {/* Organic flowing shapes */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.08, 0.05],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#D4AF7A]/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.08, 0.05, 0.08],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-gradient-to-tr from-[#E6E1F0]/20 to-transparent rounded-full blur-3xl"
        />
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative h-full"
          >
            {/* MOBILE LAYOUT (default) */}
            <div className="md:hidden h-full flex flex-col">
              {/* Mobile Header */}
              <div className="flex-shrink-0 px-6 pt-8 pb-4 pt-safe">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2.5">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#D4AF7A] to-[#E4C5B8] flex items-center justify-center"
                        style={{
                          boxShadow: "0 8px 32px -8px rgba(212, 175, 122, 0.35)",
                        }}
                      >
                        <Sparkles className="w-4.5 h-4.5 text-[#FEFDFB]" />
                      </motion.div>
                      <span className="text-[#5A5A5A] font-bold text-lg tracking-tight">
                        StyleAI
                      </span>
                    </div>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="px-3 py-1.5 rounded-full bg-[#E6E1F0]/40 backdrop-blur-xl border border-[#E6E1F0]/60"
                      style={{
                        boxShadow: "0 2px 16px -4px rgba(230, 225, 240, 0.4)",
                      }}
                    >
                      <span className="text-xs font-medium text-[#5A5A5A] tracking-wide">
                        BETA
                      </span>
                    </motion.div>
                  </div>

                  <h1 className="text-4xl font-bold mb-2 leading-tight tracking-tight">
                    <span className="bg-gradient-to-r from-[#5A5A5A] via-[#D4AF7A] to-[#5A5A5A] bg-clip-text text-transparent">
                      Virtual Try-On
                    </span>
                  </h1>
                  <p className="text-[#5A5A5A]/70 text-sm font-light tracking-wide">
                    AI-powered transformation in seconds
                  </p>
                </motion.div>
              </div>

              {/* Mobile Upload Section */}
              <div className="flex-1 px-6 pb-6 min-h-0 flex flex-col gap-4">
                {/* Upload Cards - Vertical Stack */}
                <div className="flex-1 flex flex-col gap-3.5 min-h-0">
                  {/* User Photo Card */}
                  <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex items-center gap-2.5 mb-2">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-6 h-6 rounded-xl bg-gradient-to-br from-[#D4AF7A] to-[#E4C5B8] flex items-center justify-center"
                        style={{
                          boxShadow: "0 4px 16px -4px rgba(212, 175, 122, 0.3)",
                        }}
                      >
                        <Camera className="w-3.5 h-3.5 text-[#FEFDFB]" />
                      </motion.div>
                      <span className="text-sm font-medium text-[#5A5A5A] tracking-wide">
                        Your Photo
                      </span>
                      {userImagePreview && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 25 }}
                          className="ml-auto w-2 h-2 rounded-full bg-gradient-to-br from-[#C9D5C0] to-[#D4AF7A]"
                          style={{
                            boxShadow: "0 0 8px rgba(201, 213, 192, 0.6)",
                          }}
                        />
                      )}
                    </div>

                    <div {...getUserRootProps()} className="flex-1 min-h-0">
                      <motion.div
                        whileTap={{ scale: 0.985 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                          "relative h-full rounded-[20px] overflow-hidden transition-all backdrop-blur-xl",
                          isUserDragActive
                            ? "ring-2 ring-[#D4AF7A]"
                            : userImagePreview
                            ? "ring-1 ring-[#E8D5D0]/60"
                            : "ring-1 ring-dashed ring-[#5A5A5A]/20"
                        )}
                        style={{
                          background: userImagePreview
                            ? "rgba(254, 253, 251, 0.95)"
                            : "rgba(254, 253, 251, 0.6)",
                          boxShadow: userImagePreview
                            ? "0 8px 32px -8px rgba(90, 90, 90, 0.12)"
                            : "0 4px 24px -8px rgba(90, 90, 90, 0.08)",
                        }}
                      >
                        <input {...getUserInputProps()} />
                        {userImagePreview ? (
                          <>
                            <Image
                              src={userImagePreview}
                              alt="You"
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#5A5A5A]/30 via-transparent to-transparent" />
                            <motion.button
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setUserImage(null);
                                setUserImagePreview(null);
                              }}
                              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#FEFDFB]/95 backdrop-blur-xl flex items-center justify-center hover:bg-[#FEFDFB] transition-all"
                              style={{
                                boxShadow: "0 4px 16px -4px rgba(90, 90, 90, 0.2)",
                              }}
                            >
                              <X className="w-4 h-4 text-[#5A5A5A]" />
                            </motion.button>
                          </>
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                            <motion.div
                              animate={{ y: [0, -8, 0] }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                              className="w-14 h-14 rounded-[18px] bg-gradient-to-br from-[#D4AF7A] to-[#E4C5B8] flex items-center justify-center mb-3"
                              style={{
                                boxShadow: "0 12px 32px -8px rgba(212, 175, 122, 0.4)",
                              }}
                            >
                              <Camera className="w-6 h-6 text-[#FEFDFB]" />
                            </motion.div>
                            <p className="text-base font-medium text-[#5A5A5A] tracking-wide">
                              Tap to upload
                            </p>
                            <p className="text-xs text-[#5A5A5A]/50 mt-1 tracking-wide">
                              or drag & drop
                            </p>
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </div>

                  {/* Outfit Photo Card */}
                  <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex items-center gap-2.5 mb-2">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-6 h-6 rounded-xl bg-gradient-to-br from-[#C9D5C0] to-[#E6E1F0] flex items-center justify-center"
                        style={{
                          boxShadow: "0 4px 16px -4px rgba(201, 213, 192, 0.3)",
                        }}
                      >
                        <Shirt className="w-3.5 h-3.5 text-[#FEFDFB]" />
                      </motion.div>
                      <span className="text-sm font-medium text-[#5A5A5A] tracking-wide">
                        Outfit Photo
                      </span>
                      {outfitImagePreview && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 25 }}
                          className="ml-auto w-2 h-2 rounded-full bg-gradient-to-br from-[#C9D5C0] to-[#D4AF7A]"
                          style={{
                            boxShadow: "0 0 8px rgba(201, 213, 192, 0.6)",
                          }}
                        />
                      )}
                    </div>

                    <div {...getOutfitRootProps()} className="flex-1 min-h-0">
                      <motion.div
                        whileTap={{ scale: 0.985 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                          "relative h-full rounded-[20px] overflow-hidden transition-all backdrop-blur-xl",
                          isOutfitDragActive
                            ? "ring-2 ring-[#C9D5C0]"
                            : outfitImagePreview
                            ? "ring-1 ring-[#E8D5D0]/60"
                            : "ring-1 ring-dashed ring-[#5A5A5A]/20"
                        )}
                        style={{
                          background: outfitImagePreview
                            ? "rgba(254, 253, 251, 0.95)"
                            : "rgba(254, 253, 251, 0.6)",
                          boxShadow: outfitImagePreview
                            ? "0 8px 32px -8px rgba(90, 90, 90, 0.12)"
                            : "0 4px 24px -8px rgba(90, 90, 90, 0.08)",
                        }}
                      >
                        <input {...getOutfitInputProps()} />
                        {outfitImagePreview ? (
                          <>
                            <Image
                              src={outfitImagePreview}
                              alt="Outfit"
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#5A5A5A]/30 via-transparent to-transparent" />
                            <motion.button
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setOutfitImage(null);
                                setOutfitImagePreview(null);
                              }}
                              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#FEFDFB]/95 backdrop-blur-xl flex items-center justify-center hover:bg-[#FEFDFB] transition-all"
                              style={{
                                boxShadow: "0 4px 16px -4px rgba(90, 90, 90, 0.2)",
                              }}
                            >
                              <X className="w-4 h-4 text-[#5A5A5A]" />
                            </motion.button>
                          </>
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                            <motion.div
                              animate={{ y: [0, -8, 0] }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 0.5,
                              }}
                              className="w-14 h-14 rounded-[18px] bg-gradient-to-br from-[#C9D5C0] to-[#E6E1F0] flex items-center justify-center mb-3"
                              style={{
                                boxShadow: "0 12px 32px -8px rgba(201, 213, 192, 0.4)",
                              }}
                            >
                              <Shirt className="w-6 h-6 text-[#FEFDFB]" />
                            </motion.div>
                            <p className="text-base font-medium text-[#5A5A5A] tracking-wide">
                              Tap to upload
                            </p>
                            <p className="text-xs text-[#5A5A5A]/50 mt-1 tracking-wide">
                              or drag & drop
                            </p>
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Features - Compact */}
                <div className="flex gap-2 justify-center">
                  {[
                    { icon: Zap, label: "Instant", colors: "from-[#D4AF7A] to-[#E4C5B8]" },
                    { icon: Sparkles, label: "AI", colors: "from-[#E6E1F0] to-[#C9D5C0]" },
                    { icon: Wand2, label: "Realistic", colors: "from-[#E8D5D0] to-[#E6E1F0]" },
                  ].map((feature, idx) => (
                    <motion.div
                      key={feature.label}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: 0.3 + idx * 0.1,
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                      className="px-3 py-2 rounded-full bg-[#FEFDFB]/60 backdrop-blur-xl border border-[#5A5A5A]/10 flex items-center gap-2"
                      style={{
                        boxShadow: "0 2px 12px -4px rgba(90, 90, 90, 0.08)",
                      }}
                    >
                      <div className={cn("w-1.5 h-1.5 rounded-full bg-gradient-to-br", feature.colors)} />
                      <span className="text-xs text-[#5A5A5A] font-medium tracking-wide">
                        {feature.label}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-2xl bg-[#E4C5B8]/20 backdrop-blur-xl border border-[#E4C5B8]/40"
                    style={{
                      boxShadow: "0 4px 16px -4px rgba(228, 197, 184, 0.2)",
                    }}
                  >
                    <p className="text-sm text-[#5A5A5A] text-center font-medium tracking-wide">
                      {error}
                    </p>
                  </motion.div>
                )}

                {/* Transform Button */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: userImage && outfitImage ? 1.01 : 1 }}
                  onClick={handleTryOn}
                  disabled={!userImage || !outfitImage || isProcessing}
                  className={cn(
                    "relative py-4 rounded-[20px] font-bold text-base overflow-hidden transition-all",
                    userImage && outfitImage
                      ? "bg-gradient-to-r from-[#D4AF7A] via-[#E6E1F0] to-[#C9D5C0] text-[#5A5A5A]"
                      : "bg-[#FEFDFB]/40 text-[#5A5A5A]/30 cursor-not-allowed backdrop-blur-xl border border-[#5A5A5A]/10"
                  )}
                  style={{
                    boxShadow:
                      userImage && outfitImage
                        ? "0 12px 32px -8px rgba(212, 175, 122, 0.3)"
                        : "0 4px 16px -4px rgba(90, 90, 90, 0.05)",
                  }}
                >
                  <span className="relative flex items-center justify-center gap-2.5 tracking-wide">
                    <Sparkles className="w-5 h-5" />
                    Transform Now
                  </span>
                </motion.button>
              </div>
            </div>

            {/* DESKTOP LAYOUT (md and up) - PREMIUM DENSE DESIGN */}
            <div className="hidden md:flex h-full flex-col">
              <div className="flex-1 flex flex-col max-w-[1400px] mx-auto w-full px-12 py-6">
                {/* Luxury Header */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="flex items-center justify-between mb-6"
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                      className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF7A] to-[#E4C5B8] flex items-center justify-center"
                      style={{
                        boxShadow: "0 8px 32px -8px rgba(212, 175, 122, 0.35)",
                      }}
                    >
                      <Sparkles className="w-6 h-6 text-[#FEFDFB]" />
                    </motion.div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-[#5A5A5A] font-bold text-2xl tracking-tight">
                          StyleAI
                        </span>
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="px-3 py-1 rounded-full bg-[#E6E1F0]/40 backdrop-blur-xl border border-[#E6E1F0]/60"
                          style={{
                            boxShadow: "0 2px 16px -4px rgba(230, 225, 240, 0.4)",
                          }}
                        >
                          <span className="text-xs font-medium text-[#5A5A5A] tracking-wide">
                            BETA
                          </span>
                        </motion.div>
                      </div>
                      <p className="text-sm text-[#5A5A5A]/70 font-light tracking-wide">
                        AI-Powered Virtual Try-On
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {[
                      {
                        icon: Zap,
                        label: "Instant",
                        colors: "from-[#D4AF7A] to-[#E4C5B8]",
                      },
                      {
                        icon: Sparkles,
                        label: "AI Powered",
                        colors: "from-[#E6E1F0] to-[#C9D5C0]",
                      },
                      {
                        icon: Wand2,
                        label: "Realistic",
                        colors: "from-[#E8D5D0] to-[#E6E1F0]",
                      },
                    ].map((feature, idx) => (
                      <motion.div
                        key={feature.label}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          delay: 0.2 + idx * 0.1,
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                        className="px-4 py-2 rounded-full bg-[#FEFDFB]/60 backdrop-blur-xl border border-[#5A5A5A]/10 flex items-center gap-2.5"
                        style={{
                          boxShadow: "0 2px 12px -4px rgba(90, 90, 90, 0.08)",
                        }}
                      >
                        <div className={cn("w-2 h-2 rounded-full bg-gradient-to-br", feature.colors)} />
                        <span className="text-sm text-[#5A5A5A] font-medium tracking-wide">
                          {feature.label}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Main Content Area */}
                <div className="flex-1 grid grid-cols-2 gap-10 min-h-0">
                  {/* User Photo Upload */}
                  <motion.div
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                    className="relative group flex flex-col"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-br from-[#D4AF7A]/20 to-[#E4C5B8]/20 rounded-[24px] blur-xl opacity-40 group-hover:opacity-70 transition-opacity" />
                    <div
                      className="relative bg-[#FEFDFB]/80 backdrop-blur-2xl border border-[#E8D5D0]/60 rounded-[24px] p-5 flex flex-col h-full"
                      style={{
                        boxShadow: "0 8px 32px -8px rgba(90, 90, 90, 0.12)",
                      }}
                    >
                      {/* Card Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF7A] to-[#E4C5B8] flex items-center justify-center"
                          style={{
                            boxShadow: "0 4px 16px -4px rgba(212, 175, 122, 0.3)",
                          }}
                        >
                          <Camera className="w-5 h-5 text-[#FEFDFB]" />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[#5A5A5A] font-bold text-base tracking-wide">
                            Your Photo
                          </h3>
                          <p className="text-[#5A5A5A]/60 text-sm truncate font-light">
                            Upload a clear photo
                          </p>
                        </div>
                        {userImagePreview && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 25 }}
                            className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#C9D5C0] to-[#D4AF7A] flex items-center justify-center"
                            style={{
                              boxShadow: "0 0 12px rgba(201, 213, 192, 0.6)",
                            }}
                          >
                            <svg
                              className="w-3.5 h-3.5 text-[#FEFDFB]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </motion.div>
                        )}
                      </div>

                      {/* Upload Area */}
                      <div
                        {...getUserRootProps()}
                        className="flex-1 relative min-h-0"
                      >
                        <motion.div
                          whileHover={{ scale: 1.005 }}
                          whileTap={{ scale: 0.995 }}
                          transition={{ duration: 0.2 }}
                          className={cn(
                            "relative h-full rounded-[20px] overflow-hidden transition-all cursor-pointer backdrop-blur-xl",
                            isUserDragActive
                              ? "ring-2 ring-[#D4AF7A]"
                              : userImagePreview
                              ? "ring-1 ring-[#E8D5D0]/60"
                              : "ring-1 ring-dashed ring-[#5A5A5A]/20 hover:ring-[#D4AF7A]/50"
                          )}
                          style={{
                            background: userImagePreview
                              ? "rgba(254, 253, 251, 0.95)"
                              : "rgba(254, 253, 251, 0.6)",
                            boxShadow: userImagePreview
                              ? "0 8px 32px -8px rgba(90, 90, 90, 0.12)"
                              : "0 4px 24px -8px rgba(90, 90, 90, 0.08)",
                          }}
                        >
                          <input {...getUserInputProps()} />
                          {userImagePreview ? (
                            <>
                              <Image
                                src={userImagePreview}
                                alt="You"
                                fill
                                className="object-contain"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#5A5A5A]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              <motion.button
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setUserImage(null);
                                  setUserImagePreview(null);
                                }}
                                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#FEFDFB]/95 backdrop-blur-xl flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-[#FEFDFB] transition-all"
                                style={{
                                  boxShadow: "0 4px 16px -4px rgba(90, 90, 90, 0.2)",
                                }}
                              >
                                <X className="w-4.5 h-4.5 text-[#5A5A5A]" />
                              </motion.button>
                            </>
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                              <motion.div
                                animate={{
                                  y: isUserDragActive ? -3 : [0, -10, 0],
                                }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="w-20 h-20 rounded-[20px] bg-gradient-to-br from-[#D4AF7A] to-[#E4C5B8] flex items-center justify-center mb-4"
                                style={{
                                  boxShadow: "0 12px 32px -8px rgba(212, 175, 122, 0.4)",
                                }}
                              >
                                <Camera className="w-9 h-9 text-[#FEFDFB]" />
                              </motion.div>
                              <p className="text-lg font-bold text-[#5A5A5A] mb-1.5 tracking-wide">
                                {isUserDragActive
                                  ? "Drop here"
                                  : "Upload Photo"}
                              </p>
                              <p className="text-sm text-[#5A5A5A]/60 mb-2 font-light">
                                Click or drag & drop
                              </p>
                              <p className="text-xs text-[#5A5A5A]/40 font-light">
                                PNG, JPG, WEBP • Max 10MB
                              </p>
                            </div>
                          )}
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Outfit Photo Upload */}
                  <motion.div
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative group flex flex-col"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-br from-[#C9D5C0]/20 to-[#E6E1F0]/20 rounded-[24px] blur-xl opacity-40 group-hover:opacity-70 transition-opacity" />
                    <div
                      className="relative bg-[#FEFDFB]/80 backdrop-blur-2xl border border-[#E8D5D0]/60 rounded-[24px] p-5 flex flex-col h-full"
                      style={{
                        boxShadow: "0 8px 32px -8px rgba(90, 90, 90, 0.12)",
                      }}
                    >
                      {/* Card Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-9 h-9 rounded-[14px] bg-gradient-to-br from-[#C9D5C0] to-[#E6E1F0] flex items-center justify-center"
                          style={{
                            boxShadow:
                              "0 8px 24px -8px rgba(201, 213, 192, 0.4)",
                          }}
                        >
                          <Shirt className="w-4.5 h-4.5 text-[#FEFDFB]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[#5A5A5A] font-bold text-sm tracking-wide">
                            Outfit Photo
                          </h3>
                          <p className="text-[#5A5A5A]/60 text-xs truncate">
                            Choose clothing to try
                          </p>
                        </div>
                        {outfitImagePreview && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 25 }}
                            className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#C9D5C0] to-[#E6E1F0] flex items-center justify-center"
                            style={{
                              boxShadow:
                                "0 4px 16px -4px rgba(201, 213, 192, 0.4)",
                            }}
                          >
                            <svg
                              className="w-3.5 h-3.5 text-[#FEFDFB]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </motion.div>
                        )}
                      </div>

                      {/* Upload Area */}
                      <div
                        {...getOutfitRootProps()}
                        className="flex-1 relative min-h-0"
                      >
                        <motion.div
                          whileHover={{ scale: 1.005 }}
                          whileTap={{ scale: 0.995 }}
                          className={cn(
                            "relative h-full rounded-[18px] overflow-hidden transition-all cursor-pointer",
                            isOutfitDragActive
                              ? "ring-2 ring-[#C9D5C0]"
                              : outfitImagePreview
                              ? "ring-1 ring-[#E8D5D0]/60"
                              : "ring-1 ring-dashed ring-[#5A5A5A]/20"
                          )}
                          style={{
                            background: outfitImagePreview
                              ? "rgba(254, 253, 251, 0.95)"
                              : "rgba(254, 253, 251, 0.6)",
                            boxShadow: outfitImagePreview
                              ? "0 8px 32px -8px rgba(90, 90, 90, 0.12)"
                              : "0 4px 24px -8px rgba(90, 90, 90, 0.08)",
                          }}
                        >
                          <input {...getOutfitInputProps()} />
                          {outfitImagePreview ? (
                            <>
                              <Image
                                src={outfitImagePreview}
                                alt="Outfit"
                                fill
                                className="object-contain"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#5A5A5A]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              <motion.button
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOutfitImage(null);
                                  setOutfitImagePreview(null);
                                }}
                                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#FEFDFB]/95 backdrop-blur-xl border border-[#E8D5D0]/60 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-[#E4C5B8]/90 hover:border-[#E4C5B8] transition-all"
                                style={{
                                  boxShadow:
                                    "0 4px 16px -4px rgba(90, 90, 90, 0.2)",
                                }}
                              >
                                <X className="w-4.5 h-4.5 text-[#5A5A5A]" />
                              </motion.button>
                            </>
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                              <motion.div
                                animate={{
                                  y: isOutfitDragActive ? -3 : [0, -10, 0],
                                }}
                                transition={{
                                  duration: 3,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                                className="w-20 h-20 rounded-[20px] bg-gradient-to-br from-[#C9D5C0] to-[#E6E1F0] flex items-center justify-center mb-4"
                                style={{
                                  boxShadow:
                                    "0 12px 32px -8px rgba(201, 213, 192, 0.4)",
                                }}
                              >
                                <Shirt className="w-9 h-9 text-[#FEFDFB]" />
                              </motion.div>
                              <p className="text-lg font-bold text-[#5A5A5A] mb-1.5 tracking-wide">
                                {isOutfitDragActive
                                  ? "Drop here"
                                  : "Upload Outfit"}
                              </p>
                              <p className="text-xs text-[#5A5A5A]/60 mb-2">
                                Click or drag & drop
                              </p>
                              <p className="text-xs text-[#5A5A5A]/40">
                                PNG, JPG, WEBP • Max 10MB
                              </p>
                            </div>
                          )}
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Bottom Action Bar */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6"
                >
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mb-4 p-4 rounded-[18px] bg-[#E4C5B8]/10 backdrop-blur-xl border border-[#E4C5B8]/40"
                      style={{
                        boxShadow: "0 4px 16px -4px rgba(228, 197, 184, 0.2)",
                      }}
                    >
                      <p className="text-sm text-[#5A5A5A] text-center font-medium">
                        {error}
                      </p>
                    </motion.div>
                  )}

                  <motion.button
                    whileHover={{ scale: userImage && outfitImage ? 1.01 : 1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleTryOn}
                    disabled={!userImage || !outfitImage || isProcessing}
                    className={cn(
                      "relative w-full py-5 rounded-[20px] font-bold text-base overflow-hidden transition-all",
                      userImage && outfitImage
                        ? "bg-gradient-to-r from-[#D4AF7A] via-[#E6E1F0] to-[#C9D5C0] text-[#5A5A5A]"
                        : "bg-[#FEFDFB]/40 text-[#5A5A5A]/30 cursor-not-allowed backdrop-blur-xl border border-[#5A5A5A]/10"
                    )}
                    style={{
                      boxShadow:
                        userImage && outfitImage
                          ? "0 12px 32px -8px rgba(212, 175, 122, 0.3)"
                          : "0 4px 16px -4px rgba(90, 90, 90, 0.05)",
                    }}
                  >
                    {userImage && outfitImage && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-[#C9D5C0] via-[#E6E1F0] to-[#D4AF7A]"
                        initial={{ x: "100%" }}
                        whileHover={{ x: "0%" }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                      />
                    )}
                    <span className="relative flex items-center justify-center gap-2.5">
                      <Sparkles className="w-5 h-5" />
                      {userImage && outfitImage
                        ? "Transform Now"
                        : "Upload Both Images to Continue"}
                    </span>
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {viewMode === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative h-full flex flex-col items-center justify-between p-6 md:p-12"
          >
            {/* Top spacer */}
            <div className="flex-1" />

            {/* Main content */}
            <div className="text-center">
              {/* Animated orb */}
              <div className="relative w-32 h-32 md:w-48 md:h-48 mx-auto mb-8 md:mb-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#D4AF7A]/30 via-[#E6E1F0]/30 to-[#C9D5C0]/30 blur-2xl md:blur-3xl opacity-60"
                />
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-4 md:inset-6 rounded-full bg-gradient-to-br from-[#D4AF7A] via-[#E6E1F0] to-[#C9D5C0] flex items-center justify-center"
                  style={{
                    boxShadow: "0 20px 60px -12px rgba(212, 175, 122, 0.4)",
                  }}
                >
                  <Sparkles className="w-12 h-12 md:w-20 md:h-20 text-[#FEFDFB]" />
                </motion.div>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-[#5A5A5A] mb-4 md:mb-6 tracking-tight">
                Creating Magic
              </h2>
              <p className="text-[#5A5A5A]/70 text-base md:text-lg mb-10 md:mb-16 max-w-lg mx-auto leading-relaxed">
                Our AI is analyzing and transforming your look with cutting-edge
                technology...
              </p>

              {/* Progress dots */}
              <div className="flex justify-center gap-2.5 md:gap-3 mb-8 md:mb-12">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-gradient-to-br from-[#D4AF7A] to-[#E4C5B8]"
                  />
                ))}
              </div>

              <div className="space-y-3 md:space-y-4 max-w-md mx-auto">
                {["Analyzing photos", "AI processing", "Finalizing result"].map(
                  (step, idx) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.5 }}
                      className="flex items-center gap-4 px-5 md:px-6 py-3 md:py-4 rounded-[18px] bg-[#FEFDFB]/80 backdrop-blur-xl border border-[#E8D5D0]/60"
                      style={{
                        boxShadow: "0 4px 24px -8px rgba(90, 90, 90, 0.1)",
                      }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 md:w-6 md:h-6 border-2 md:border-3 border-[#D4AF7A] border-t-transparent rounded-full flex-shrink-0"
                      />
                      <span className="text-sm md:text-base text-[#5A5A5A] font-medium tracking-wide">
                        {step}
                      </span>
                    </motion.div>
                  )
                )}
              </div>
            </div>

            {/* Bottom spacer */}
            <div className="flex-1" />
          </motion.div>
        )}

        {viewMode === "result" && resultImageUrl && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative h-full flex flex-col bg-gradient-to-br from-[#F5F1ED] via-[#FEFDFB] to-[#E8D5D0]"
          >
            {/* Result header */}
            <div
              className="flex-shrink-0 px-4 md:px-6 py-4 flex items-center justify-between border-b border-[#E8D5D0]/60 backdrop-blur-xl bg-[#FEFDFB]/80 pt-safe"
              style={{
                boxShadow: "0 2px 16px -4px rgba(90, 90, 90, 0.08)",
              }}
            >
              <button
                onClick={handleReset}
                className="w-10 h-10 md:w-12 md:h-12 rounded-[16px] bg-[#FEFDFB]/80 backdrop-blur-xl border border-[#E8D5D0]/60 flex items-center justify-center hover:bg-[#E8D5D0]/20 transition-colors"
                style={{
                  boxShadow: "0 4px 16px -4px rgba(90, 90, 90, 0.1)",
                }}
              >
                <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-[#5A5A5A]" />
              </button>
              <div className="text-center">
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#C9D5C0]/20 to-[#E6E1F0]/20 backdrop-blur-xl border border-[#C9D5C0]/40"
                  style={{
                    boxShadow: "0 4px 16px -4px rgba(201, 213, 192, 0.2)",
                  }}
                >
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-[#5A5A5A]" />
                  <span className="text-xs md:text-sm font-medium text-[#5A5A5A] tracking-wide">
                    Complete!
                  </span>
                </div>
              </div>
              <button
                className="w-10 h-10 md:w-12 md:h-12 rounded-[16px] bg-[#FEFDFB]/80 backdrop-blur-xl border border-[#E8D5D0]/60 flex items-center justify-center hover:bg-[#E8D5D0]/20 transition-colors"
                style={{
                  boxShadow: "0 4px 16px -4px rgba(90, 90, 90, 0.1)",
                }}
              >
                <Share2 className="w-5 h-5 md:w-6 md:h-6 text-[#5A5A5A]" />
              </button>
            </div>

            {/* Result image */}
            <div className="flex-1 flex items-center justify-center p-4 md:p-8 min-h-0">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative w-full h-full max-w-3xl rounded-[24px] md:rounded-[32px] overflow-hidden ring-2 ring-[#E8D5D0]/60"
                style={{
                  boxShadow: "0 20px 60px -12px rgba(90, 90, 90, 0.15)",
                }}
              >
                <Image
                  src={resultImageUrl}
                  alt="Result"
                  fill
                  className="object-contain bg-[#FEFDFB]"
                  priority
                />
              </motion.div>
            </div>

            {/* Action buttons */}
            <div className="flex-shrink-0 p-4 md:p-6 pb-safe space-y-3 bg-gradient-to-t from-[#FEFDFB]/95 via-[#FEFDFB]/80 to-transparent">
              <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
                <motion.a
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 500, damping: 30 }}
                  href={resultImageUrl}
                  download="styleai-result.jpg"
                  className="py-3.5 md:py-4 rounded-[18px] bg-gradient-to-r from-[#C9D5C0] to-[#E6E1F0] text-[#5A5A5A] font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
                  style={{
                    boxShadow: "0 8px 32px -8px rgba(201, 213, 192, 0.3)",
                  }}
                >
                  <Download className="w-5 h-5" />
                  <span className="text-sm md:text-base tracking-wide">Download</span>
                </motion.a>

                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 500, damping: 30 }}
                  className="py-3.5 md:py-4 rounded-[18px] bg-[#FEFDFB]/80 backdrop-blur-xl text-[#5A5A5A] font-bold border border-[#E8D5D0]/60 hover:bg-[#E8D5D0]/20 transition-colors flex items-center justify-center gap-2"
                  style={{
                    boxShadow: "0 4px 16px -4px rgba(90, 90, 90, 0.1)",
                  }}
                >
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm md:text-base tracking-wide">Share</span>
                </motion.button>
              </div>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 500, damping: 30 }}
                onClick={handleReset}
                className="w-full max-w-2xl mx-auto py-3.5 md:py-4 rounded-[18px] bg-[#E8D5D0]/20 backdrop-blur-xl text-[#5A5A5A] font-medium hover:bg-[#E8D5D0]/30 transition-colors text-sm md:text-base border border-[#E8D5D0]/40"
                style={{
                  boxShadow: "0 4px 16px -4px rgba(232, 213, 208, 0.2)",
                }}
              >
                Try Another Outfit
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
