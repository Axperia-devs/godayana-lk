"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Briefcase,
  Plane,
  Clock,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  AlertCircle,
  FileText,
  Landmark,
  Languages,
  Heart,
  Users,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useMobileNav } from "@/context/MobileNavContext";

// Visa Types Data (Top Section)
const visaTypes = [
  {
    id: 1,
    title: "Student Visa",
    sinhala: "ශිෂ්‍ය වීස",
    description: "Pursue higher education in top global universities.",
    cost: "LKR 1.5M - 4.5M",
    time: "4 - 12 Weeks",
    icon: BookOpen,
    color: "from-blue-500 to-blue-700",
    bgColor: "bg-blue-500/10",
  },
  {
    id: 2,
    title: "Work Visa",
    sinhala: "වැඩ වීසා",
    description: "Legal employment pathways for skilled and unskilled workers.",
    cost: "LKR 500k - 1.5M",
    time: "8 - 24 Weeks",
    icon: Briefcase,
    color: "from-emerald-500 to-emerald-700",
    bgColor: "bg-emerald-500/10",
  },
  {
    id: 3,
    title: "Visit Visa",
    sinhala: "සංචාරක වීසා",
    description: "Explore the world for tourism or family visits.",
    cost: "LKR 50k - 250k",
    time: "1 - 4 Weeks",
    icon: Plane,
    color: "from-purple-500 to-purple-700",
    bgColor: "bg-purple-500/10",
  },
];

// Visa Guides Data (Bottom Carousel)
const visaGuides = [
  {
    id: 1,
    country: "UK",
    title: "UK Student Visa Guide",
    description:
      "Everything you need to know about studying in the United Kingdom from Sri Lanka.",
    documents: [
      "CAS Letter",
      "IELTS Result (6.5+)",
      "Bank Statement (6 months)",
      "TB Test Certificate",
    ],
    commonMistakes: [
      "Insufficient Funds",
      "Gap in Education",
      "Weak Statement of Purpose",
    ],
    cost: "£1,500 - £2,000",
    processingTime: "3 - 6 weeks",
    image: "/images/test.jpg",
    color: "from-blue-600 to-blue-800",
    flag: "🇬🇧",
  },
  {
    id: 2,
    country: "Australia",
    title: "Australia Student Visa Guide",
    description:
      "Complete guide for Sri Lankan students applying to Australian universities.",
    documents: [
      "Confirmation of Enrollment",
      "IELTS/PTE Results",
      "Genuine Student Check",
      "Health Insurance (OSHC)",
    ],
    commonMistakes: [
      "GTE Statement Issues",
      "Incorrect Financials",
      "Health Requirements",
    ],
    cost: "AUD 30,000 - 45,000",
    processingTime: "4 - 8 weeks",
    image: "/images/test.jpg",
    color: "from-blue-600 to-blue-800",
    flag: "🇦🇺",
  },
  {
    id: 3,
    country: "Canada",
    title: "Canada Student Visa Guide",
    description:
      "Step-by-step guide for Canadian study permit applications from Sri Lanka.",
    documents: [
      "Letter of Acceptance",
      "IELTS Results",
      "GIC Account",
      "Medical Exam",
    ],
    commonMistakes: [
      "Missing Biometrics",
      "Insufficient Funds",
      "Purpose of Visit",
    ],
    cost: "CAD 20,000 - 35,000",
    processingTime: "8 - 12 weeks",
    image: "/images/test.jpg",
    color: "from-red-500 to-red-700",
    flag: "🇨🇦",
  },
  {
    id: 4,
    country: "USA",
    title: "USA Student Visa Guide",
    description:
      "Comprehensive F-1 visa guide for Sri Lankan students heading to America.",
    documents: [
      "I-20 Form",
      "SEVIS Fee Receipt",
      "TOEFL/IELTS",
      "Financial Affidavits",
    ],
    commonMistakes: [
      "Visa Interview Prep",
      "SEVIS Payment",
      "Ties to Home Country",
    ],
    cost: "USD 25,000 - 50,000",
    processingTime: "2 - 4 weeks",
    image: "/images/test.jpg",
    color: "from-indigo-500 to-indigo-700",
    flag: "🇺🇸",
  },
  {
    id: 5,
    country: "Germany",
    title: "Germany Student Visa Guide",
    description:
      "Complete guide for German student visa applications from Sri Lanka.",
    documents: [
      "University Admission",
      "Blocked Account",
      "Health Insurance",
      "CV & SOP",
    ],
    commonMistakes: [
      "Blocked Account Amount",
      "APS Certificate",
      "Language Requirements",
    ],
    cost: "EUR 10,000 - 15,000",
    processingTime: "6 - 12 weeks",
    image: "/images/test.jpg",
    color: "from-yellow-600 to-yellow-800",
    flag: "🇩🇪",
  },
  {
    id: 6,
    country: "Japan",
    title: "Japan Student Visa Guide",
    description:
      "Everything Sri Lankan students need for Japanese study visas.",
    documents: ["COE", "JLPT/NAT Results", "Bank Statements", "Study Plan"],
    commonMistakes: [
      "Language Proficiency",
      "Financial Proof",
      "Document Translation",
    ],
    cost: "JPY 1.5M - 2.5M",
    processingTime: "4 - 8 weeks",
    image: "/images/test.jpg",
    color: "from-red-500 to-red-700",
    flag: "🇯🇵",
  },
];

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function VisaPage() {
  const [currentGuideIndex, setCurrentGuideIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number | null>(null);
  const { isMobileNavOpen } = useMobileNav();
  
  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentGuideIndex((prev) => (prev + 1) % visaGuides.length);
      }, 5000); // Change every 5 seconds
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying]);

  // Pause auto-play on user interaction
  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);
    // Resume after 10 seconds of inactivity
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 10000);
  };

  const nextGuide = () => {
    pauseAutoPlay();
    setCurrentGuideIndex((prev) => (prev + 1) % visaGuides.length);
  };

  const prevGuide = () => {
    pauseAutoPlay();
    setCurrentGuideIndex(
      (prev) => (prev - 1 + visaGuides.length) % visaGuides.length,
    );
  };

  const goToGuide = (index: number) => {
    pauseAutoPlay();
    setCurrentGuideIndex(index);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;

    if (Math.abs(diffX) > 50) {
      // Swipe threshold
      if (diffX > 0) {
        nextGuide(); // Swipe left
      } else {
        prevGuide(); // Swipe right
      }
    }

    touchStartX.current = null;
  };

  const currentGuide = visaGuides[currentGuideIndex];

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="py-8 mx-4 sm:mx-6 lg:mx-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          ගොඩයන
          <span className="text-primary"> Visa</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Your comprehensive guide to global visa processes. We simplify the
          complex documentation for you.
        </p>
      </motion.div>

      {/* Visa Types Cards - Top Section (Matching first image) */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 pb-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-2"
        >
          {visaTypes.map((visa) => (
            <motion.div
              key={visa.id}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="group h-full"
            >
              <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300">
                <CardContent className="px-6 py-2 flex flex-col h-full">
                  {/* Icon and Title */}
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${visa.color} bg-opacity-10 flex items-center justify-center shrink-0`}
                    >
                      <visa.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">{visa.title}</h3>
                      <p className="text-sm text-muted-foreground font-bold">
                        {visa.sinhala}
                      </p>
                    </div>
                  </div>

                  {/* Description - Flex-1 to push button down */}
                  <div className="flex-1">
                    <p className="text-muted-foreground text-sm mb-4">
                      {visa.description}
                    </p>

                    {/* Cost and Time */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Est. Cost</span>
                        <span className="font-semibold">{visa.cost}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Proc. Time
                        </span>
                        <span className="font-semibold">{visa.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Book Consultation Button - Always at bottom */}
                  <div className="mt-auto pt-2">
                    <Link href={`/visa/consultation/${visa.id}`}>
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer group">
                        <span>Book Consultation</span>
                        <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Visa Guides Carousel Section - Bottom Section (Matching second image) */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Country Visa Guides
          </h2>

          {/* Carousel Container */}
          <div
            className="relative"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Pagination Dots */}
            <div className="flex items-center justify-center gap-2 my-6">
              {visaGuides.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToGuide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentGuideIndex
                      ? "w-8 bg-primary"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Go to guide ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="absolute left-15 top-1/2 -translate-y-1/2 z-20 -ml-4 hidden md:block">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevGuide}
                  className="rounded-full bg-background shadow-lg cursor-pointer h-10 w-10"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </motion.div>
            </div>

            <div className="absolute right-15 top-1/2 -translate-y-1/2 z-20 -mr-4 hidden md:block">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextGuide}
                  className="rounded-full bg-background shadow-lg cursor-pointer h-10 w-10"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </motion.div>
            </div>

            {/* Main Guide Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentGuideIndex}
                initial={!isMobileNavOpen ? { opacity: 0, x: 50 } : false}
                animate={
                  !isMobileNavOpen ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }
                }
                exit={
                  !isMobileNavOpen
                    ? { opacity: 0, x: -50 }
                    : { opacity: 1, x: 0 }
                }
                transition={
                  !isMobileNavOpen ? { duration: 0.3 } : { duration: 0 }
                }
                className="w-full flex items-center justify-center"
              >
                <Card className="overflow-hidden border-0 shadow-xl lg:w-3/4 w-full max-w-4xl mx-auto py-0">
                  {/* Two Column Layout - Image on Right */}
                  <div className="flex flex-col md:flex-row">
                    {/* Left Column - Content */}
                    <div className="flex-1 p-6">
                      {/* Country Badge and Title */}
                      <div className="mb-4">
                        {/* <Badge className="bg-primary/10 text-primary border-0 mb-3">
                          {currentGuide.flag} {currentGuide.country}
                        </Badge> */}
                        <h3 className="text-2xl font-bold">
                          {currentGuide.title}
                        </h3>
                        <p className="text-muted-foreground mt-2">
                          {currentGuide.description}
                        </p>
                      </div>

                      {/* Content Grid */}
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Left Column - Required Documents */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            Required Documents
                          </h4>
                          <ul className="space-y-2">
                            {currentGuide.documents.map((doc, idx) => (
                              <motion.li
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center gap-2 text-sm"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                <span>{doc}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>

                        {/* Right Column - Common Mistakes */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-destructive" />
                            Common Mistakes
                          </h4>
                          <ul className="space-y-2 mb-4">
                            {currentGuide.commonMistakes.map((mistake, idx) => (
                              <motion.li
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 + 0.3 }}
                                className="flex items-center gap-2 text-sm"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                                <span>{mistake}</span>
                              </motion.li>
                            ))}
                          </ul>

                          {/* Additional Info */}
                          <div className="bg-muted/30 rounded-lg p-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-muted-foreground">
                                Est. Cost
                              </span>
                              <span className="font-semibold">
                                {currentGuide.cost}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                Processing Time
                              </span>
                              <span className="font-semibold">
                                {currentGuide.processingTime}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="md:w-96 h-64 md:h-auto relative">
                      {/* Image or Gradient Background */}
                      {currentGuide.image ? (
                        <Image
                          src={currentGuide.image}
                          alt={currentGuide.country}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 384px"
                        />
                      ) : (
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${currentGuide.color} opacity-90`}
                        >
                          <div className="absolute inset-0 bg-black/20" />
                        </div>
                      )}

                      {/* Dark overlay for better text readability */}
                      <div className="absolute inset-0 bg-black/20" />

                      {/* Centered Globe Icon - Only show if no image */}
                      {!currentGuide.image && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Globe className="h-24 w-24 text-white/30" />
                        </div>
                      )}

                      {/* Country Flag and Name - Always visible */}
                      <div className="absolute bottom-4 right-4 text-white/80 text-sm drop-shadow-lg">
                        {currentGuide.flag} {currentGuide.country}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
                    <Link
                      href={`/visa/guide/${currentGuide.id}`}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        className="w-full cursor-pointer group"
                      >
                        <span>View Full Guide</span>
                        <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                    <Link
                      href={`/visa/consultation/${currentGuide.id}`}
                      className="flex-1"
                    >
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer group">
                        <span>Book Free Consultation</span>
                        <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Mobile Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 px-8 md:hidden">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevGuide}
                  className="cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </motion.div>

              <span className="text-sm text-muted-foreground">
                {currentGuideIndex + 1} / {visaGuides.length}
              </span>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextGuide}
                  className="cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
