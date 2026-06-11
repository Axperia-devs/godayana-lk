// src/components/company/courses/CourseDetailsView.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  Calendar,
  Share2,
  Bookmark,
  BookmarkCheck,
  Building2,
  Eye,
  Users,
  CheckCircle,
  ExternalLink,
  DollarSign,
  Award,
  Video,
  FileText,
  Globe,
  Mail,
  Phone,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";

interface CourseDetails {
  id: number;
  title: string;
  category: string;
  categoryLabel: string;
  enrollType: "online" | "physical";
  location?: string;
  instructor: string;
  instructorBio?: string;
  instructorAvatar?: string;
  price: number;
  originalPrice?: number;
  startDate: string;
  endDate: string;
  duration: string;
  schedule?: string;
  enrolledStudents: number;
  maxStudents: number;
  views: number;
  rating?: number;
  reviews?: number;
  description: string;
  curriculum: {
    modules: {
      title: string;
      lessons: {
        title: string;
        duration: string;
        isPreview?: boolean;
      }[];
    }[];
  };
  requirements: string[];
  learningOutcomes: string[];
  includes: string[];
  targetAudience: string[];
  certificate: boolean;
  certificateType?: string;
  company: string;
  companyDescription: string;
  companyLogo?: string;
  companyWebsite?: string;
  contactEmail: string;
  contactPhone?: string;
  postedDate: string;
  lastUpdated?: string;
  isEnrolled?: boolean;
  isSaved?: boolean;
}

interface CourseDetailsViewProps {
  course: CourseDetails;
  onEnroll?: () => void;
  onSave?: () => void;
  onShare?: () => void;
}

export function CourseDetailsView({
  course,
  onEnroll,
  onSave,
  onShare,
}: CourseDetailsViewProps) {
  const [saved, setSaved] = useState(course.isSaved || false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "curriculum" | "instructor" | "reviews"
  >("overview");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return `LKR ${price.toLocaleString()}`;
  };

  const getEnrollTypeConfig = (type: "online" | "physical") => {
    return {
      online: {
        label: "Online Course",
        icon: <Globe className="h-4 w-4" />,
        color:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      },
      physical: {
        label: "Physical Course",
        icon: <MapPin className="h-4 w-4" />,
        color:
          "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      },
    }[type];
  };

  const handleSave = () => {
    setSaved(!saved);
    if (onSave) {
      onSave();
    } else {
      toast.success(saved ? "Removed from saved" : "Course saved successfully");
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  const handleEnroll = () => {
    if (onEnroll) {
      onEnroll();
    } else {
      toast.success("Successfully enrolled in the course!");
    }
  };

  const enrollTypeConfig = getEnrollTypeConfig(course.enrollType);
  const isFull = course.enrolledStudents >= course.maxStudents;

  return (
    <div className="space-y-6">
      {/* HERO HEADER */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl p-8">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary" className="bg-white/20 text-white">
            {course.categoryLabel}
          </Badge>
          <Badge className={enrollTypeConfig.color}>
            <span className="flex items-center gap-1">
              {enrollTypeConfig.icon}
              {enrollTypeConfig.label}
            </span>
          </Badge>
          {course.certificate && (
            <Badge variant="secondary" className="bg-white/20 text-white gap-1">
              <Award className="h-3 w-3" />
              Certificate Included
            </Badge>
          )}
        </div>
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p className="text-lg opacity-90 mt-2">
          By {course.instructor} • {course.company}
        </p>
        <div className="flex flex-wrap gap-4 mt-4 text-sm opacity-80">
          <span className="flex items-center gap-1">
            <Calendar size={14} /> Starts: {formatDate(course.startDate)}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} /> {course.duration}
          </span>
          {course.rating && (
            <span className="flex items-center gap-1">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              {course.rating} ({course.reviews} reviews)
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:pr-10">
        {/* LEFT CONTENT */}
        <div className="lg:col-span-3 space-y-6">
          {/* Mobile Sticky Bar */}
          <div className="bg-card rounded-xl shadow-xl overflow-visible md:sticky md:top-40 z-12 border py-2 md:hidden sticky top-14 mb-2">
            <div className="px-4 py-2 space-y-4">
              <div className="space-y-3">
                <Button
                  onClick={handleEnroll}
                  disabled={isFull}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold"
                  size="lg"
                >
                  {isFull ? "Course Full" : "Enroll Now"}
                </Button>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleSave}
                    className="flex-1 gap-2"
                  >
                    {saved ? (
                      <BookmarkCheck size={16} className="text-primary" />
                    ) : (
                      <Bookmark size={16} />
                    )}
                    {saved ? "Saved" : "Save Course"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="flex-1 gap-2"
                  >
                    <Share2 size={16} />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab("overview")}
                className={`pb-3 px-1 font-medium transition-colors ${
                  activeTab === "overview"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("curriculum")}
                className={`pb-3 px-1 font-medium transition-colors ${
                  activeTab === "curriculum"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Curriculum
              </button>
              <button
                onClick={() => setActiveTab("instructor")}
                className={`pb-3 px-1 font-medium transition-colors ${
                  activeTab === "instructor"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Instructor
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`pb-3 px-1 font-medium transition-colors ${
                  activeTab === "reviews"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Reviews
              </button>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Description */}
              <div className="rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4 uppercase text-primary">
                  Course Description
                </h2>
                <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {course.description}
                </div>
              </div>

              {/* Learning Outcomes */}
              {course.learningOutcomes.length > 0 && (
                <div className="bg-card rounded-xl p-6 shadow-sm border">
                  <h2 className="text-xl font-bold mb-4 uppercase text-primary">
                    What You&apos;ll Learn
                  </h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {course.learningOutcomes.map((outcome, i) => (
                      <div key={i} className="flex gap-3">
                        <CheckCircle
                          size={18}
                          className="text-primary mt-0.5 shrink-0"
                        />
                        <span className="text-muted-foreground">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {course.requirements.length > 0 && (
                <div className="bg-card rounded-xl p-6 shadow-sm border">
                  <h2 className="text-xl font-bold mb-4 uppercase text-primary">
                    Requirements
                  </h2>
                  <ul className="space-y-3">
                    {course.requirements.map((req, i) => (
                      <li key={i} className="flex gap-3">
                        <CheckCircle
                          size={18}
                          className="text-primary mt-0.5 shrink-0"
                        />
                        <span className="text-muted-foreground">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Includes */}
              {course.includes.length > 0 && (
                <div className="bg-card rounded-xl p-6 shadow-sm border">
                  <h2 className="text-xl font-bold mb-4 uppercase text-primary">
                    This Course Includes
                  </h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {course.includes.map((item, i) => (
                      <div key={i} className="flex gap-3">
                        <CheckCircle
                          size={18}
                          className="text-primary mt-0.5 shrink-0"
                        />
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Schedule for Physical Courses */}
              {course.enrollType === "physical" && course.schedule && (
                <div className="bg-card rounded-xl p-6 shadow-sm border">
                  <h2 className="text-xl font-bold mb-4 uppercase text-primary">
                    Class Schedule
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>
                        {formatDate(course.startDate)} -{" "}
                        {formatDate(course.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{course.schedule}</span>
                    </div>
                    {course.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{course.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Curriculum Tab */}
          {activeTab === "curriculum" && (
            <div className="space-y-4">
              {course.curriculum.modules.map((module, moduleIdx) => (
                <Card key={moduleIdx}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">
                      Module {moduleIdx + 1}: {module.title}
                    </h3>
                    <div className="space-y-2">
                      {module.lessons.map((lesson, lessonIdx) => (
                        <div
                          key={lessonIdx}
                          className="flex items-center justify-between p-2 hover:bg-muted rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {lesson.isPreview ? (
                              <Video className="h-4 w-4 text-primary" />
                            ) : (
                              <FileText className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="text-sm">{lesson.title}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground">
                              {lesson.duration}
                            </span>
                            {lesson.isPreview && (
                              <Badge variant="outline" className="text-xs">
                                Preview
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Instructor Tab */}
          {activeTab === "instructor" && (
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {course.instructorAvatar ? (
                    <Image
                      src={course.instructorAvatar}
                      alt={course.instructor}
                      width={80}
                      height={80}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-10 w-10 text-primary" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">
                      {course.instructor}
                    </h3>
                    {course.instructorBio && (
                      <p className="text-muted-foreground mt-2">
                        {course.instructorBio}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No reviews yet. Be the first to review this course!
              </CardContent>
            </Card>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-1 -top-16 md:-top-44 relative order-first lg:order-last hidden md:block">
          {/* Main Enrollment Card */}
          <div className="bg-card shadow-xl rounded-t-xl overflow-visible relative top-24 pb-40 border">
            <div className="px-6 py-2 space-y-4">
              <div className="w-30 h-30 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center text-white font-bold text-xl absolute -top-10 shadow-xl z-10">
                {course.title.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>

          <div className="bg-card border-l border-r relative md:sticky md:top-18 z-1 py-2">
            <div className="px-6 py-2 space-y-4">
              <div className="pb-2 border-b">
                <h3 className="font-bold text-lg">{course.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {course.instructor} • {course.company}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card relative shadow-xl overflow-visible border-l border-r">
            <div className="px-6 py-2 space-y-4">
              {/* Price */}
              <div className="text-center py-3 border-b">
                <p className="text-3xl font-bold text-primary">
                  {formatPrice(course.price)}
                </p>
                {course.originalPrice && (
                  <p className="text-sm text-muted-foreground line-through">
                    {formatPrice(course.originalPrice)}
                  </p>
                )}
              </div>

              {/* Quick Info */}
              <div className="text-sm space-y-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-primary" />
                  <span>Starts: {formatDate(course.startDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-primary" />
                  <span>{course.duration}</span>
                </div>
                {course.enrollType === "physical" && course.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-primary" />
                    <span>{course.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-primary" />
                  <span>{enrollTypeConfig.label}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 py-2 border-t">
                <div className="text-center p-2 bg-muted/30 rounded-lg">
                  <Users size={16} className="mx-auto mb-1 text-primary" />
                  <p className="text-lg font-bold">
                    {course.enrolledStudents}/{course.maxStudents}
                  </p>
                  <p className="text-xs text-muted-foreground">Enrolled</p>
                </div>
                <div className="text-center p-2 bg-muted/30 rounded-lg">
                  <Eye size={16} className="mx-auto mb-1 text-primary" />
                  <p className="text-lg font-bold">{course.views}</p>
                  <p className="text-xs text-muted-foreground">Views</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-b-xl shadow-xl overflow-visible md:sticky md:top-40 z-12 border-l border-r border-b pb-2">
            <div className="px-6 py-2 space-y-4">
              <div className="space-y-3">
                <Button
                  onClick={handleEnroll}
                  disabled={isFull}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold"
                  size="lg"
                >
                  {isFull ? "Course Full" : "Enroll Now"}
                </Button>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleSave}
                    className="flex-1 gap-2"
                  >
                    {saved ? (
                      <BookmarkCheck size={16} className="text-primary" />
                    ) : (
                      <Bookmark size={16} />
                    )}
                    {saved ? "Saved" : "Save"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="flex-1 gap-2"
                  >
                    <Share2 size={16} />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Provider Info Card */}
          <Card className="rounded-xl shadow-sm my-8">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Building2 size={16} className="text-primary" />
                Course Provider
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium">{course.company}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {course.companyDescription.substring(0, 100)}...
                  </p>
                </div>
                {course.companyWebsite && (
                  <Link
                    href={course.companyWebsite}
                    target="_blank"
                    className="flex items-center gap-1 text-primary hover:underline text-xs"
                  >
                    Visit Website <ExternalLink size={12} />
                  </Link>
                )}
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2 text-xs">
                    <Mail size={12} className="text-primary" />
                    <span>{course.contactEmail}</span>
                  </div>
                  {course.contactPhone && (
                    <div className="flex items-center gap-2 text-xs mt-1">
                      <Phone size={12} className="text-primary" />
                      <span>{course.contactPhone}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certificate Info */}
          {course.certificate && (
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
              <Award className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                Certificate of Completion
              </p>
              <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                {course.certificateType || "Professional Certificate"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
