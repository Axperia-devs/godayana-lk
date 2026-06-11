"use client";

import { useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Brain,
  CheckCircle,
  ChevronRight,
  ArrowRight,
  ChevronLeft,
  ChevronDown,
  GraduationCap,
  DollarSign,
  ClipboardCheck,
  Globe,
  BookOpen,
  Briefcase,
  Heart,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Animation
const fadeInUp: Variants = {
  hidden: { opacity: 1, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const fadeIn = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

// Study Fields
const studyFields = [
  "Business & Management",
  "Information Technology (IT)",
  "Engineering",
  "Healthcare",
  "Hospitality & Tourism",
  "Education & Teaching",
  "Accounting & Finance",
  "Marketing",
  "Logistics & Supply Chain",
  "Skilled Trades (Construction, Caregiver, Automotive, etc.)",
  "Language Studies",
  "Postgraduate Studies",
  "Scholarship Programs",
  "Other",
];

// Study Levels
const studyLevels = [
  "Diploma",
  "Foundation",
  "Bachelor's Degree",
  "Postgraduate Diploma",
  "Master's Degree",
  "PhD",
  "Certificate Program",
];

// Intake Months
const intakes = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Countries
const countries = [
  "United Kingdom",
  "Australia",
  "Canada",
  "USA",
  "Germany",
  "Japan",
  "France",
  "Italy",
  "New Zealand",
  "Ireland",
  "Netherlands",
  "Sweden",
  "Other",
];

export default function GatewayPage() {
  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    // Study Preferences
    preferredCountry: "",
    otherCountry: "",
    preferredStudyField: "",
    preferredStudyLevel: "",
    preferredIntake: "",
    preferredUniversityType: "",
    languageTestStatus: "",

    // Financial Planning
    budget: "",
    familySponsorship: "",
    educationLoanInterest: "",

    // Readiness
    passportAvailable: "",
    previousVisaRejection: "",
    readyToApplyWithin: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Form Data Submitted:", formData);
    setIsSubmitting(false);
    alert(
      "Application submitted successfully! Our counselor will contact you soon.",
    );
  };

  const isStepValid = () => {
    if (currentStep === 1) {
      return (
        formData.preferredCountry &&
        formData.preferredStudyField &&
        formData.preferredStudyLevel &&
        formData.preferredIntake
      );
    }
    if (currentStep === 2) {
      return (
        formData.budget &&
        formData.familySponsorship &&
        formData.educationLoanInterest
      );
    }
    if (currentStep === 3) {
      return (
        formData.passportAvailable &&
        formData.previousVisaRejection &&
        formData.readyToApplyWithin
      );
    }
    return true;
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="mb-2 py-8 px-4 sm:px-6 lg:px-8 border-b relative bg-linear-to-b from-blue-400 via-blue-700 to-blue-900 rounded-b-lg text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2 relative text-background/90 ">
          <span className="font-fm-gamunu text-[40px] md:text-5xl">ගොඩයන </span>
          <span className=""> Gateway</span>
        </h1>
        <p className="text-background/80 relative">
          Your premium structured migration portal. Start your journey with a
          professional eligibility assessment.
        </p>
      </motion.div>

      {/* Landing Section - Show before form */}
      <AnimatePresence mode="wait">
        {!showForm ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center px-4 py-10"
          >
            <div className="text-center max-w-2xl mx-auto">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <GraduationCap className="h-10 w-10 text-primary" />
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Start Your Global Education Journey
              </h2>

              <p className="text-xl text-primary font-semibold mb-8">
                Apply for Your Study Abroad Dream - Free
              </p>

              <Button
                onClick={() => setShowForm(true)}
                size="lg"
                className="text-lg px-8 py-6 bg-primary hover:bg-primary/90"
              >
                APPLY NOW
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 px-4 sm:px-6 lg:px-8 py-10"
          >
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* LEFT COLUMN - Steps */}
                <div className="space-y-6">
                  <div className="bg-card border rounded-xl p-5 sticky top-24">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <ClipboardCheck className="h-5 w-5 text-primary" />
                      Application Steps
                    </h3>

                    <div className="space-y-4 text-sm">
                      <div
                        className={`flex items-center gap-2 ${
                          currentStep >= 1
                            ? "text-primary font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            currentStep > 1
                              ? "bg-primary text-white"
                              : currentStep === 1
                                ? "bg-primary text-white"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {currentStep > 1 ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            1
                          )}
                        </div>
                        Study Preferences
                      </div>

                      <div
                        className={`flex items-center gap-2 ${
                          currentStep >= 2
                            ? "text-primary font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            currentStep > 2
                              ? "bg-primary text-white"
                              : currentStep === 2
                                ? "bg-primary text-white"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {currentStep > 2 ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            2
                          )}
                        </div>
                        Financial Planning
                      </div>

                      <div
                        className={`flex items-center gap-2 ${
                          currentStep >= 3
                            ? "text-primary font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            currentStep === 3
                              ? "bg-primary text-white"
                              : currentStep > 3
                                ? "bg-primary text-white"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {currentStep > 3 ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            3
                          )}
                        </div>
                        Readiness Check
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN - Form Steps */}
                <div className="lg:col-span-2">
                  <div className="bg-card border rounded-xl p-6 shadow-sm">
                    <AnimatePresence mode="wait">
                      {/* Step 1: Study Preferences */}
                      {currentStep === 1 && (
                        <motion.div
                          key="step1"
                          variants={fadeIn}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="space-y-5"
                        >
                          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-primary" />
                            Study Preferences
                          </h2>

                          {/* Preferred Country */}
                          <div>
                            <Label className="text-sm mb-1 block">
                              Preferred Country{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              value={formData.preferredCountry}
                              onValueChange={(value) =>
                                handleChange("preferredCountry", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a country" />
                              </SelectTrigger>
                              <SelectContent>
                                {countries.map((country) => (
                                  <SelectItem key={country} value={country}>
                                    {country}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Other Country Input */}
                          {formData.preferredCountry === "Other" && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                            >
                              <Label className="text-sm mb-1 block">
                                Please specify country{" "}
                                <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                placeholder="Enter country name"
                                value={formData.otherCountry}
                                onChange={(e) =>
                                  handleChange("otherCountry", e.target.value)
                                }
                              />
                            </motion.div>
                          )}

                          {/* Preferred Study Field */}
                          <div>
                            <Label className="text-sm mb-1 block">
                              Preferred Study Field{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              value={formData.preferredStudyField}
                              onValueChange={(value) =>
                                handleChange("preferredStudyField", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select study field" />
                              </SelectTrigger>
                              <SelectContent>
                                {studyFields.map((field) => (
                                  <SelectItem key={field} value={field}>
                                    {field}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Preferred Study Level */}
                          <div>
                            <Label className="text-sm mb-1 block">
                              Preferred Study Level{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              value={formData.preferredStudyLevel}
                              onValueChange={(value) =>
                                handleChange("preferredStudyLevel", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select study level" />
                              </SelectTrigger>
                              <SelectContent>
                                {studyLevels.map((level) => (
                                  <SelectItem key={level} value={level}>
                                    {level}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Preferred Intake */}
                          <div>
                            <Label className="text-sm mb-1 block">
                              Preferred Intake{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              value={formData.preferredIntake}
                              onValueChange={(value) =>
                                handleChange("preferredIntake", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select intake month" />
                              </SelectTrigger>
                              <SelectContent>
                                {intakes.map((intake) => (
                                  <SelectItem key={intake} value={intake}>
                                    {intake}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Preferred University Type (Optional) */}
                          <div>
                            <Label className="text-sm mb-1 block">
                              Preferred University Type (If available)
                            </Label>
                            <Input
                              placeholder="e.g., Public University, Private University, etc."
                              value={formData.preferredUniversityType}
                              onChange={(e) =>
                                handleChange(
                                  "preferredUniversityType",
                                  e.target.value,
                                )
                              }
                            />
                          </div>

                          {/* Language Test Status */}
                          <div>
                            <Label className="text-sm mb-1 block">
                              Language Test Status{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <RadioGroup
                              value={formData.languageTestStatus}
                              onValueChange={(value) =>
                                handleChange("languageTestStatus", value)
                              }
                              className="flex gap-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="completed"
                                  id="completed"
                                />
                                <Label htmlFor="completed">Completed</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="planning"
                                  id="planning"
                                />
                                <Label htmlFor="planning">
                                  Planning to do soon
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div className="flex justify-end pt-4">
                            <Button
                              onClick={handleNext}
                              disabled={!isStepValid()}
                            >
                              Next
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 2: Financial Planning */}
                      {currentStep === 2 && (
                        <motion.div
                          key="step2"
                          variants={fadeIn}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="space-y-5"
                        >
                          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-primary" />
                            Financial Planning
                          </h2>

                          {/* Budget */}
                          <div>
                            <Label className="text-sm mb-1 block">
                              Budget (Annual - in USD/LKR){" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              placeholder="e.g., $25,000 or LKR 7.5M"
                              value={formData.budget}
                              onChange={(e) =>
                                handleChange("budget", e.target.value)
                              }
                            />
                          </div>

                          {/* Family Sponsorship */}
                          <div>
                            <Label className="text-sm mb-1 block">
                              Family Sponsorship Available?{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <RadioGroup
                              value={formData.familySponsorship}
                              onValueChange={(value) =>
                                handleChange("familySponsorship", value)
                              }
                              className="flex gap-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="yes"
                                  id="sponsorshipYes"
                                />
                                <Label htmlFor="sponsorshipYes">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="sponsorshipNo" />
                                <Label htmlFor="sponsorshipNo">No</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          {/* Education Loan Interest */}
                          <div>
                            <Label className="text-sm mb-1 block">
                              Education Loan Interest?{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <RadioGroup
                              value={formData.educationLoanInterest}
                              onValueChange={(value) =>
                                handleChange("educationLoanInterest", value)
                              }
                              className="flex gap-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="loanYes" />
                                <Label htmlFor="loanYes">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="loanNo" />
                                <Label htmlFor="loanNo">No</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div className="flex justify-between pt-4">
                            <Button variant="outline" onClick={handleBack}>
                              <ChevronLeft className="mr-2 h-4 w-4" />
                              Back
                            </Button>
                            <Button
                              onClick={handleNext}
                              disabled={!isStepValid()}
                            >
                              Next
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 3: Readiness Check */}
                      {currentStep === 3 && (
                        <motion.div
                          key="step3"
                          variants={fadeIn}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="space-y-5"
                        >
                          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <ClipboardCheck className="h-5 w-5 text-primary" />
                            Readiness Check
                          </h2>

                          {/* Passport Available */}
                          <div>
                            <Label className="text-sm mb-1 block">
                              Passport Available?{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <RadioGroup
                              value={formData.passportAvailable}
                              onValueChange={(value) =>
                                handleChange("passportAvailable", value)
                              }
                              className="flex gap-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="passportYes" />
                                <Label htmlFor="passportYes">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="passportNo" />
                                <Label htmlFor="passportNo">No</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          {/* Previous Visa Rejection */}
                          <div>
                            <Label className="text-sm mb-1 block">
                              Previous Visa Rejection?{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <RadioGroup
                              value={formData.previousVisaRejection}
                              onValueChange={(value) =>
                                handleChange("previousVisaRejection", value)
                              }
                              className="flex gap-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="rejectionYes" />
                                <Label htmlFor="rejectionYes">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="rejectionNo" />
                                <Label htmlFor="rejectionNo">No</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          {/* Ready to Apply Within */}
                          <div>
                            <Label className="text-sm mb-1 block">
                              Ready to Apply Within?{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <RadioGroup
                              value={formData.readyToApplyWithin}
                              onValueChange={(value) =>
                                handleChange("readyToApplyWithin", value)
                              }
                              className="flex flex-col gap-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="1month" id="1month" />
                                <Label htmlFor="1month">1 Month</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="3months" id="3months" />
                                <Label htmlFor="3months">3 Months</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="6months" id="6months" />
                                <Label htmlFor="6months">6 Months</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="other" id="other" />
                                <Label htmlFor="other">Other</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div className="flex justify-between pt-4">
                            <Button variant="outline" onClick={handleBack}>
                              <ChevronLeft className="mr-2 h-4 w-4" />
                              Back
                            </Button>
                            <Button
                              onClick={handleSubmit}
                              disabled={!isStepValid() || isSubmitting}
                              className="bg-primary hover:bg-primary/90"
                            >
                              {isSubmitting ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                  Submitting...
                                </>
                              ) : (
                                <>
                                  Submit Application
                                  <CheckCircle className="ml-2 h-4 w-4" />
                                </>
                              )}
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
