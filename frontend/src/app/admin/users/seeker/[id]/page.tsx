// src/app/admin/users/seeker/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  DollarSign,
  Clock,
  Globe,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Award,
  BookOpen,
  CalendarDays,
  Upload,
  Eye,
  Download,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

// Mock Seeker Data based on actual DB structure
interface JobSeeker {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  profile_pic_url: string;
  resume_url: string;
  skills: string[];
  experience_years: number;
  education: string;
  study_field: string;
  location: string;
  date_of_birth: string;
  gender: string;
  nationality: string;
  employment_status: string;
  current_job_title: string;
  current_salary: number | null;
  expected_salary: number;
  notice_period: string;
  portfolio_url: string;
  professional_summary: string;
  preferred_job_categories: string[];
  share_cv: boolean;
  created_at: string;
  updated_at: string;
}

// Mock data
const mockSeeker: JobSeeker = {
  id: "2b30eace-f2de-44eb-80a2-c3379371d22d",
  user_id: "66becedd-888c-4091-90ba-5828508d9c4c",
  full_name: "Test User",
  email: "test@gmail.com",
  phone: "+94123456789",
  profile_pic_url:
    "seeker-profile-pics/b8de2be8-5019-49ea-8f53-fa1a9a3ca8fe-d7159ee3-ec48-4fa3-be98-d253c9714112.jpeg",
  resume_url:
    "resumes/fc1d8086-5b98-4d11-9043-7c7adc4ab931-Test_User_CV_20260618.pdf",
  skills: ["next", "nest", "React", "TypeScript", "Node.js"],
  experience_years: 1,
  education: "BACHELORS",
  study_field: "ICT",
  location: "Colombo",
  date_of_birth: "2004-05-16",
  gender: "MALE",
  nationality: "OTHER",
  employment_status: "STUDENT",
  current_job_title: "SE",
  current_salary: null,
  expected_salary: 100000,
  notice_period: "10",
  portfolio_url: "https://bk.vercel.app",
  professional_summary: "test",
  preferred_job_categories: ["IT & Software", "Education"],
  share_cv: true,
  created_at: "2026-06-12 20:58:23.965528",
  updated_at: "2026-06-18 19:00:13.04693",
};

// Label mappings
const educationLabels: Record<string, string> = {
  HIGH_SCHOOL: "High School",
  DIPLOMA: "Diploma",
  BACHELORS: "Bachelor's Degree",
  MASTERS: "Master's Degree",
  PHD: "PhD",
  OTHER: "Other",
};

const genderLabels: Record<string, string> = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
  PREFER_NOT_TO_SAY: "Prefer not to say",
};

const nationalityLabels: Record<string, string> = {
  SRI_LANKAN: "Sri Lankan",
  INDIAN: "Indian",
  AMERICAN: "American",
  BRITISH: "British",
  OTHER: "Other",
};

const employmentStatusLabels: Record<string, string> = {
  EMPLOYED: "Employed",
  UNEMPLOYED: "Unemployed",
  STUDENT: "Student",
  SELF_EMPLOYED: "Self-Employed",
  FREELANCE: "Freelance",
  OTHER: "Other",
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateOfBirth = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatCurrency = (amount: number | null) => {
  if (amount === null) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function AdminSeekerView() {
  const params = useParams();
  const router = useRouter();
  const seekerId = params.id as string;

  const [seeker, setSeeker] = useState<JobSeeker | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchSeeker = async () => {
      setIsLoading(true);
      try {
        // In real app: const response = await seekerAPI.getSeekerById(seekerId);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setSeeker(mockSeeker);
      } catch (error) {
        toast.error("Failed to load seeker details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeeker();
  }, [seekerId]);

  const getStatusBadge = () => {
    // Since there's no status field in the DB, we can determine based on other factors
    // For now, we'll show a default "Active" badge
    return (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
        Active
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="text-muted-foreground">Loading job seeker details...</p>
        </div>
      </div>
    );
  }

  if (!seeker) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <User className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-2xl font-semibold">Job Seeker Not Found</h2>
        <p className="text-muted-foreground">
          The job seeker you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/admin/users">
          <Button className="cursor-pointer">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/admin/users">
            <Button variant="ghost" className="pl-0 hover:pl-2 cursor-pointer">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
          </Link>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <h1 className="text-2xl font-bold">{seeker.full_name}</h1>
            {getStatusBadge()}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Summary */}
          {/* <Card>
            <CardContent className="px-6">
              <div className="flex flex-col md:flex-row gap-6">
                <Avatar className="w-24 h-24 ring-4 ring-primary/10">
                  <AvatarImage src={seeker.profile_pic_url} />
                  <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                    {seeker.full_name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold">
                      {seeker.full_name}
                    </h2>
                    <Badge variant="outline" className="text-xs">
                      {seeker.employment_status
                        ? employmentStatusLabels[seeker.employment_status]
                        : "N/A"}
                    </Badge>
                    {seeker.share_cv && (
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        <Upload className="h-3 w-3 mr-1" />
                        CV Shared
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">
                    {seeker.current_job_title || "No current job"}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {seeker.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {seeker.phone || "N/A"}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {seeker.location || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {seeker.skills?.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* Personal Information */}
          <Card>
            <CardContent className="px-6">
              <h2 className="text-lg font-semibold mb-4">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Full Name
                  </Label>
                  <p className="font-medium mt-1">{seeker.full_name}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Email</Label>
                  <p className="font-medium mt-1">{seeker.email}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Phone</Label>
                  <p className="font-medium mt-1">{seeker.phone || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Date of Birth
                  </Label>
                  <p className="font-medium mt-1">
                    {seeker.date_of_birth
                      ? formatDateOfBirth(seeker.date_of_birth)
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Gender
                  </Label>
                  <p className="font-medium mt-1">
                    {seeker.gender ? genderLabels[seeker.gender] : "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Nationality
                  </Label>
                  <p className="font-medium mt-1">
                    {seeker.nationality
                      ? nationalityLabels[seeker.nationality]
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Location
                  </Label>
                  <p className="font-medium mt-1">{seeker.location || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Summary */}
          <Card>
            <CardContent className="px-6">
              <h2 className="text-lg font-semibold mb-3">
                Professional Summary
              </h2>
              <p className="text-muted-foreground">
                {seeker.professional_summary ||
                  "No professional summary provided."}
              </p>
            </CardContent>
          </Card>

          {/* Education & Experience */}
          <Card>
            <CardContent className="px-6">
              <h2 className="text-lg font-semibold mb-4">
                Education & Experience
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Education Level
                  </Label>
                  <p className="font-medium mt-1">
                    {seeker.education
                      ? educationLabels[seeker.education]
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Study Field
                  </Label>
                  <p className="font-medium mt-1">
                    {seeker.study_field || "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Experience
                  </Label>
                  <p className="font-medium mt-1">
                    {seeker.experience_years || 0} years
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Employment Status
                  </Label>
                  <p className="font-medium mt-1">
                    {seeker.employment_status
                      ? employmentStatusLabels[seeker.employment_status]
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Current Job Title
                  </Label>
                  <p className="font-medium mt-1">
                    {seeker.current_job_title || "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Notice Period
                  </Label>
                  <p className="font-medium mt-1">
                    {seeker.notice_period || "N/A"} days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Summary */}
          <Card>
            <CardContent className="px-6">
              <h2 className="text-lg font-semibold mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {seeker.skills?.length > 0 ? (
                  seeker.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No skills listed
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Salary Information */}
          <Card>
            <CardContent className="px-6">
              <h2 className="text-lg font-semibold mb-4">Salary Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Current Salary
                  </Label>
                  <p className="font-medium mt-1">
                    {formatCurrency(seeker.current_salary)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Expected Salary
                  </Label>
                  <p className="font-medium mt-1">
                    {formatCurrency(seeker.expected_salary)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferred Job Categories */}
          <Card>
            <CardContent className="px-6">
              <h2 className="text-lg font-semibold mb-3">
                Preferred Job Categories
              </h2>
              <div className="flex flex-wrap gap-2">
                {seeker.preferred_job_categories?.length > 0 ? (
                  seeker.preferred_job_categories.map((category, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {category}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground">
                    No preferred categories specified
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Profile Picture */}
          <Card>
            <CardContent className="p-6 flex flex-col items-center">
              <Avatar className="w-32 h-32 ring-4 ring-primary/10">
                <AvatarImage src={seeker.profile_pic_url} />
                <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                  {seeker.full_name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm text-muted-foreground mt-2">
                Profile Picture
              </p>
            </CardContent>
          </Card>

          {/* Resume */}
          <Card>
            <CardContent className="px-6">
              <h2 className="text-lg font-semibold mb-4">Resume</h2>
              {seeker.resume_url ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <FileText className="h-8 w-8 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {seeker.resume_url.split("/").pop()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PDF Document
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 cursor-pointer"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 cursor-pointer"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No resume uploaded
                </p>
              )}
              <div className="mt-3 flex items-center gap-2">
                <Upload className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  CV Sharing: {seeker.share_cv ? "Enabled" : "Disabled"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio */}
          <Card>
            <CardContent className="px-6">
              <h2 className="text-lg font-semibold mb-4">Portfolio</h2>
              {seeker.portfolio_url ? (
                <a
                  href={seeker.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Globe className="h-4 w-4" />
                  {seeker.portfolio_url}
                </a>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No portfolio provided
                </p>
              )}
            </CardContent>
          </Card>

          {/* Skills Summary */}
          {/* <Card>
            <CardContent className="px-6">
              <h2 className="text-lg font-semibold mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {seeker.skills?.length > 0 ? (
                  seeker.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No skills listed
                  </p>
                )}
              </div>
            </CardContent>
          </Card> */}

          {/* Timeline */}
          <Card>
            <CardContent className="px-6">
              <h2 className="text-lg font-semibold mb-4">Timeline</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Joined</p>
                    <p className="font-medium">
                      {formatDate(seeker.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Last Updated
                    </p>
                    <p className="font-medium">
                      {formatDate(seeker.updated_at)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent className="px-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start cursor-pointer"
                >
                  <Users className="h-4 w-4 mr-2" />
                  View Applications
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start cursor-pointer"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start cursor-pointer"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Resume
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
