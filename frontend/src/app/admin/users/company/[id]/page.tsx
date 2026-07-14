// src/app/admin/users/company/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Briefcase,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Facebook,
  Linkedin,
  Instagram,
  User,
  FileText,
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

// Mock Company Data based on actual DB structure
interface Company {
  id: string;
  user_id: string;
  company_name: string;
  registration_number: string;
  website: string;
  logo_url: string;
  description: string;
  industry: string;
  company_type: string;
  employee_count: string;
  location: string;
  company_email: string;
  hotline_number: string;
  facebook_url: string;
  linkedin_url: string;
  instagram_url: string;
  contact_person_name: string;
  designation: string;
  cv_delivery_email: string;
  is_verified: boolean;
  status: "PENDING" | "ACTIVE" | "SUSPENDED" | "REJECTED";
  created_at: string;
  updated_at: string;
  cv_delivery_terms: boolean;
  job_posting_terms: boolean;
}

// Mock data
const mockCompany: Company = {
  id: "ab587901-0ac2-479e-95c6-caf59f704573",
  user_id: "66becedd-888c-4091-90ba-5828508d9c4c",
  company_name: "Test Company",
  registration_number: "123",
  website: "https://test.com",
  logo_url:
    "company-profile-pics/bf4a1d53-4706-41d3-a067-21c56ba5391e-NesjavellirPowerPlant_edit2.jpg",
  description: "nooo",
  industry: "MARKETING",
  company_type: "PUBLIC",
  employee_count: "1",
  location: "Colombo",
  company_email: "test@gmail.com",
  hotline_number: "0717112345",
  facebook_url: "https://facebook.com/test",
  linkedin_url: "https://linkedin.com/test",
  instagram_url: "https://instagram.com/test",
  contact_person_name: "PCW Ride Dev",
  designation: "HR",
  cv_delivery_email: "testtest@gmail.com",
  is_verified: false,
  status: "PENDING",
  created_at: "2026-06-19 10:55:49.502166",
  updated_at: "2026-06-19 12:00:27.580524",
  cv_delivery_terms: true,
  job_posting_terms: true,
};

// Industry label mapping
const industryLabels: Record<string, string> = {
  IT: "IT & Software",
  MARKETING: "Marketing & Advertising",
  FINANCE: "Finance & Banking",
  HEALTHCARE: "Healthcare",
  EDUCATION: "Education",
  CONSTRUCTION: "Construction",
  HOSPITALITY: "Hospitality",
  RETAIL: "Retail",
  MANUFACTURING: "Manufacturing",
  OTHER: "Other",
};

// Company type labels
const companyTypeLabels: Record<string, string> = {
  PRIVATE: "Private Limited",
  PUBLIC: "Public Limited",
  SOLE: "Sole Proprietorship",
  PARTNERSHIP: "Partnership",
  LLC: "LLC",
  NONPROFIT: "Non-Profit",
};

// Employee count labels
const employeeCountLabels: Record<string, string> = {
  "1": "1-10 employees",
  "2": "11-50 employees",
  "3": "51-200 employees",
  "4": "201-500 employees",
  "5": "501-1000 employees",
  "6": "1000+ employees",
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

export default function AdminCompanyView() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.id as string;

  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<
    "ACTIVE" | "SUSPENDED" | "REJECTED" | null
  >(null);

  useEffect(() => {
    // Simulate API call
    const fetchCompany = async () => {
      setIsLoading(true);
      try {
        // In real app: const response = await companyAPI.getCompanyById(companyId);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setCompany(mockCompany);
      } catch (error) {
        toast.error("Failed to load company details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompany();
  }, [companyId]);

  const handleStatusChange = (status: "ACTIVE" | "SUSPENDED" | "REJECTED") => {
    setNewStatus(status);
    setShowStatusDialog(true);
  };

  const confirmStatusChange = async () => {
    if (!newStatus || !company) return;

    try {
      // In real app: await companyAPI.updateCompanyStatus(companyId, newStatus);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCompany({ ...company, status: newStatus });
      toast.success(`Company ${newStatus.toLowerCase()} successfully`);
      setShowStatusDialog(false);
      setNewStatus(null);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            Active
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            Pending
          </Badge>
        );
      case "SUSPENDED":
        return <Badge variant="destructive">Suspended</Badge>;
      case "REJECTED":
        return (
          <Badge
            variant="destructive"
            className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
          >
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getVerificationBadge = (isVerified: boolean) => {
    if (isVerified) {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircle className="h-3 w-3 mr-1" />
          Verified
        </Badge>
      );
    }
    return (
      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
        <AlertCircle className="h-3 w-3 mr-1" />
        Not Verified
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="text-muted-foreground">Loading company details...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Building2 className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-2xl font-semibold">Company Not Found</h2>
        <p className="text-muted-foreground">
          The company you&apos;re looking for doesn&apos;t exist.
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
            <h1 className="text-2xl font-bold">{company.company_name}</h1>
            {getStatusBadge(company.status)}
            {getVerificationBadge(company.is_verified)}
          </div>
          {/* <p className="text-muted-foreground mt-1 text-sm">ID: {company.id}</p> */}
        </div>
      </div>

      {/* Status Actions - Show based on current status */}
      <Card
        className={
          company.status === "PENDING"
            ? "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800"
            : company.status === "SUSPENDED"
              ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
              : company.status === "REJECTED"
                ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
                : "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
        }
      >
        <CardContent className="px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {company.status === "PENDING" && (
                <>
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <p className="font-semibold text-yellow-800 dark:text-yellow-300">
                      This company is pending verification
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                      Review the company details and approve or reject the
                      application.
                    </p>
                  </div>
                </>
              )}
              {company.status === "ACTIVE" && (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="font-semibold text-green-800 dark:text-green-300">
                      This company is active
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-400">
                      The company has full access to all features.
                    </p>
                  </div>
                </>
              )}
              {company.status === "SUSPENDED" && (
                <>
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <div>
                    <p className="font-semibold text-red-800 dark:text-red-300">
                      This company is suspended
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-400">
                      The company cannot access their account until activated.
                    </p>
                  </div>
                </>
              )}
              {company.status === "REJECTED" && (
                <>
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <div>
                    <p className="font-semibold text-red-800 dark:text-red-300">
                      This company has been rejected
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-400">
                      The company application has been rejected.
                    </p>
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {/* Show Activate button for non-active companies */}
              {company.status !== "ACTIVE" && (
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 cursor-pointer"
                  onClick={() => handleStatusChange("ACTIVE")}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Activate
                </Button>
              )}

              {/* Show Suspend button only for active companies */}
              {company.status === "ACTIVE" && (
                <Button
                  size="sm"
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={() => handleStatusChange("SUSPENDED")}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Suspend
                </Button>
              )}

              {/* Show Reject button for pending or active companies */}
              {(company.status === "PENDING" ||
                company.status === "ACTIVE") && (
                <Button
                  size="sm"
                  variant="destructive"
                  className="text-white bg-red-600 hover:bg-red-700 cursor-pointer"
                  onClick={() => handleStatusChange("REJECTED")}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Company Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="px-6">
              <h2 className="text-lg font-semibold mb-4">
                Company Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Company Name
                    </Label>
                    <p className="font-medium mt-1">{company.company_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Registration Number
                    </Label>
                    <p className="font-medium mt-1">
                      {company.registration_number || "N/A"}
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">
                    Description
                  </Label>
                  <p className="font-medium mt-1">
                    {company.description || "No description provided"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Industry
                    </Label>
                    <p className="font-medium mt-1">
                      {industryLabels[company.industry] || company.industry}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Company Type
                    </Label>
                    <p className="font-medium mt-1">
                      {companyTypeLabels[company.company_type] ||
                        company.company_type}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Employee Count
                    </Label>
                    <p className="font-medium mt-1">
                      {employeeCountLabels[company.employee_count] ||
                        company.employee_count ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Location
                    </Label>
                    <p className="font-medium mt-1">
                      {company.location || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Details */}
          <Card>
            <CardContent className="px-6">
              <h2 className="text-lg font-semibold mb-4">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Company Email
                    </Label>
                    <p className="font-medium mt-1">{company.company_email}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Hotline Number
                    </Label>
                    <p className="font-medium mt-1">
                      {company.hotline_number || "N/A"}
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">
                    Website
                  </Label>
                  <p className="font-medium mt-1">
                    {company.website ? (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {company.website}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardContent className="px-6">
              <h2 className="text-lg font-semibold mb-4">Social Media Links</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Facebook className="h-4 w-4 text-blue-600 shrink-0" />
                  <span className="font-medium break-all">
                    {company.facebook_url ? (
                      <a
                        href={company.facebook_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {company.facebook_url}
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Linkedin className="h-4 w-4 text-blue-700 shrink-0" />
                  <span className="font-medium break-all">
                    {company.linkedin_url ? (
                      <a
                        href={company.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {company.linkedin_url}
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Instagram className="h-4 w-4 text-pink-600 shrink-0" />
                  <span className="font-medium break-all">
                    {company.instagram_url ? (
                      <a
                        href={company.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {company.instagram_url}
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* HR/Contact Person */}
          <Card>
            <CardContent className="px-6">
              <h2 className="text-lg font-semibold mb-4">
                HR / Contact Person
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Contact Person
                    </Label>
                    <p className="font-medium mt-1">
                      {company.contact_person_name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Designation
                    </Label>
                    <p className="font-medium mt-1">
                      {company.designation || "N/A"}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    CV Delivery Email
                  </Label>
                  <p className="font-medium mt-1">
                    {company.cv_delivery_email || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Logo */}
          <Card>
            <CardContent className="p-6 flex flex-col items-center">
              <Avatar className="w-32 h-32 ring-4 ring-primary/10">
                <AvatarImage src={company.logo_url} />
                <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                  {company.company_name?.charAt(0).toUpperCase() || "C"}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm text-muted-foreground mt-2">Company Logo</p>
            </CardContent>
          </Card>

          {/* Terms & Agreements */}
          <Card>
            <CardContent className="px-6">
              <h2 className="text-lg font-semibold mb-4">Terms & Agreements</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm">Job Posting Terms</span>
                  </div>
                  <Badge
                    variant={
                      company.job_posting_terms ? "default" : "destructive"
                    }
                  >
                    {company.job_posting_terms ? "Accepted" : "Not Accepted"}
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm">CV Delivery Terms</span>
                  </div>
                  <Badge
                    variant={
                      company.cv_delivery_terms ? "default" : "destructive"
                    }
                  >
                    {company.cv_delivery_terms ? "Accepted" : "Not Accepted"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardContent className="px-6">
              <h2 className="text-lg font-semibold mb-4">Timeline</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Joined</p>
                    <p className="font-medium">
                      {formatDate(company.created_at)}
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
                      {formatDate(company.updated_at)}
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
                  <Briefcase className="h-4 w-4 mr-2" />
                  View Jobs
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start cursor-pointer"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status Change Confirmation Dialog */}
      <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change this company&apos;s status to{" "}
              <span className="font-semibold">{newStatus?.toLowerCase()}</span>?
              {newStatus === "ACTIVE" &&
                " This will allow the company to post jobs and access all features."}
              {newStatus === "SUSPENDED" &&
                " This will prevent the company from accessing their account."}
              {newStatus === "REJECTED" &&
                " This will reject the company's application."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmStatusChange}
              className={
                newStatus === "ACTIVE"
                  ? "bg-green-600 hover:bg-green-700 cursor-pointer"
                  : "bg-red-600 hover:bg-red-700 cursor-pointer"
              }
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
