// src/app/company/leads/courses/[id]/applications/page.tsx
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Eye,
  Download,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  ArrowLeft,
  GraduationCap,
  MapPin,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  education: string;
  matchPercentage: number;
  status: "new" | "under_review" | "shortlisted" | "rejected" | "enrolled";
  appliedDate: string;
  resume: string;
  avatar?: string;
}

// Mock data - replace with API call
const getStudentsByCourseId = (
  courseId: number,
): { courseTitle: string; courseId: number; students: Student[] } => {
  const coursesData: Record<
    number,
    { courseTitle: string; courseId: number; students: Student[] }
  > = {
    1: {
      courseId: 1,
      courseTitle: "Advanced Web Development Bootcamp",
      students: [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          phone: "+94 77 123 4567",
          education: "Bachelor's in Computer Science",
          matchPercentage: 92,
          status: "new",
          appliedDate: "2024-04-21",
          resume: "/resumes/john-doe.pdf",
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane.smith@example.com",
          phone: "+94 77 234 5678",
          education: "Master's in IT",
          matchPercentage: 88,
          status: "under_review",
          appliedDate: "2024-04-20",
          resume: "/resumes/jane-smith.pdf",
        },
        {
          id: 3,
          name: "Bob Johnson",
          email: "bob@example.com",
          phone: "+94 77 345 6789",
          education: "Diploma in Web Development",
          matchPercentage: 75,
          status: "new",
          appliedDate: "2024-04-19",
          resume: "/resumes/bob-johnson.pdf",
        },
        {
          id: 4,
          name: "Alice Brown",
          email: "alice@example.com",
          phone: "+94 77 456 7890",
          education: "Bachelor's in Software Engineering",
          matchPercentage: 95,
          status: "shortlisted",
          appliedDate: "2024-04-18",
          resume: "/resumes/alice-brown.pdf",
        },
        {
          id: 5,
          name: "Charlie Wilson",
          email: "charlie@example.com",
          phone: "+94 77 567 8901",
          education: "Self-taught Developer",
          matchPercentage: 68,
          status: "rejected",
          appliedDate: "2024-04-17",
          resume: "/resumes/charlie-wilson.pdf",
        },
        {
          id: 6,
          name: "Diana Prince",
          email: "diana@example.com",
          phone: "+94 77 678 9012",
          education: "Master's in Computer Science",
          matchPercentage: 98,
          status: "enrolled",
          appliedDate: "2024-04-16",
          resume: "/resumes/diana-prince.pdf",
        },
        {
          id: 7,
          name: "Ethan Hunt",
          email: "ethan@example.com",
          phone: "+94 77 789 0123",
          education: "Bachelor's in IT",
          matchPercentage: 82,
          status: "new",
          appliedDate: "2024-04-15",
          resume: "/resumes/ethan-hunt.pdf",
        },
        {
          id: 8,
          name: "Fiona Gallagher",
          email: "fiona@example.com",
          phone: "+94 77 890 1234",
          education: "Bachelor's in Computer Science",
          matchPercentage: 90,
          status: "under_review",
          appliedDate: "2024-04-14",
          resume: "/resumes/fiona-gallagher.pdf",
        },
      ],
    },
    2: {
      courseId: 2,
      courseTitle: "Digital Marketing Masterclass",
      students: [
        {
          id: 9,
          name: "Mike Wilson",
          email: "mike.wilson@example.com",
          phone: "+94 77 345 6789",
          education: "Bachelor's in Marketing",
          matchPercentage: 85,
          status: "shortlisted",
          appliedDate: "2024-04-19",
          resume: "/resumes/mike-wilson.pdf",
        },
      ],
    },
  };
  return (
    coursesData[courseId] || {
      courseId,
      courseTitle: "Unknown Course",
      students: [],
    }
  );
};

const getStatusConfig = (status: Student["status"]) => {
  const config = {
    new: {
      label: "New",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    },
    under_review: {
      label: "Under Review",
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
    shortlisted: {
      label: "Shortlisted",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    },
    rejected: {
      label: "Rejected",
      color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    },
    enrolled: {
      label: "Enrolled",
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    },
  };
  return config[status];
};

export default function CourseApplicationsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = parseInt(params.id as string);
  const { courseTitle, students } = getStudentsByCourseId(courseId);
  const [currentStudents, setCurrentStudents] = useState(students);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "new" | "shortlisted" | "rejected" | "enrolled"
  >("new");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter students based on status
  const getFilteredStudents = () => {
    if (activeFilter === "new") {
      return currentStudents.filter((s) => s.status === "new");
    }
    if (activeFilter === "shortlisted") {
      return currentStudents.filter((s) => s.status === "shortlisted");
    }
    if (activeFilter === "rejected") {
      return currentStudents.filter((s) => s.status === "rejected");
    }
    if (activeFilter === "enrolled") {
      return currentStudents.filter((s) => s.status === "enrolled");
    }
    return currentStudents;
  };

  const filteredStudents = getFilteredStudents();
  const totalItems = filteredStudents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudentsList = filteredStudents.slice(startIndex, endIndex);

  // Get counts for filters
  const allCount = currentStudents.length;
  const newCount = currentStudents.filter((s) => s.status === "new").length;
  const shortlistedCount = currentStudents.filter(
    (s) => s.status === "shortlisted",
  ).length;
  const rejectedCount = currentStudents.filter(
    (s) => s.status === "rejected",
  ).length;
  const enrolledCount = currentStudents.filter(
    (s) => s.status === "enrolled",
  ).length;

  const handleStatusChange = (
    studentId: number,
    newStatus: Student["status"],
  ) => {
    setCurrentStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status: newStatus } : s)),
    );
    toast.success(`Student ${newStatus.replace("_", " ")} successfully`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil(
      Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays === 1) return "Applied 1 day ago";
    if (diffDays <= 7) return `Applied ${diffDays} days ago`;
    if (diffDays <= 30) return `Applied ${Math.floor(diffDays / 7)} weeks ago`;
    return `Applied ${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 pb-4 border-b">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="bg-primary/10 rounded-full h-8 w-8 p-0 flex items-center justify-center hover:bg-primary/20 cursor-pointer"
        >
          <ArrowLeft size={16} />
        </Button>
        <h2 className="text-xl font-bold">Applications for {courseTitle}</h2>
      </div>
      <Card className="bg-primary/4 min-h-[calc(100vh-7rem)] flex flex-col">
        <CardContent className="flex-1 flex flex-col px-4 ">
          {/* Filter Tabs */}
          <div className="w-full flex flex-col md:flex-row justify-between">
            <div className="bg-primary/10 p-1 rounded-lg w-full lg:w-fit flex items-center justify-between gap-1 flex-wrap mb-6 order-last md:order-first">
              {/* <button
                onClick={() => {
                  setActiveFilter("all");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeFilter === "all"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                All <span className="hidden md:inline-block">({allCount})</span>
              </button> */}
              <button
                onClick={() => {
                  setActiveFilter("new");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeFilter === "new"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                New <span className="hidden md:inline-block">({newCount})</span>
              </button>
              {/* <button
                onClick={() => {
                  setActiveFilter("shortlisted");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeFilter === "shortlisted"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Shortlisted{" "}
                <span className="hidden md:inline-block">
                  ({shortlistedCount})
                </span>
              </button> */}
              <button
                onClick={() => {
                  setActiveFilter("enrolled");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeFilter === "enrolled"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Enrolled{" "}
                <span className="hidden md:inline-block">
                  ({enrolledCount})
                </span>
              </button>
              <button
                onClick={() => {
                  setActiveFilter("rejected");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeFilter === "rejected"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Rejected{" "}
                <span className="hidden md:inline-block">
                  ({rejectedCount})
                </span>
              </button>
            </div>

            <div className="pb-2 md:pb-0">
              <Link href={`/company/courses/${courseId}`}>
                <Button className="gap-2 cursor-pointer w-full lg:w-auto px-4">
                  <GraduationCap size={16} />
                  View Course
                </Button>
              </Link>
            </div>
          </div>

          {/* Students List */}
          <div className="flex-1 space-y-4">
            {currentStudentsList.map((student) => {
              const statusConfig = getStatusConfig(student.status);
              return (
                <div
                  key={student.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Student Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary text-lg">
                            {student.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {student.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {student.education}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={statusConfig.color}>
                                {statusConfig.label}
                              </Badge>
                              {/* <Badge variant="outline" className="gap-1">
                                <TrendingUp size={12} />
                                Match: {student.matchPercentage}%
                              </Badge> */}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail size={14} /> {student.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone size={14} /> {student.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />{" "}
                              {formatDate(student.appliedDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/company/leads/courses/${courseId}/applications/student/${student.id}`}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 cursor-pointer"
                        >
                          <Eye size={14} />
                          View Profile
                        </Button>
                      </Link>
                      {/* <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 cursor-pointer"
                      >
                        <Download size={14} />
                        Download CV
                      </Button> */}
                      {/* {student.status !== "shortlisted" &&
                        student.status !== "enrolled" && (
                          <Button
                            size="sm"
                            className="gap-1 bg-green-600 hover:bg-green-700 cursor-pointer"
                            onClick={() =>
                              handleStatusChange(student.id, "shortlisted")
                            }
                          >
                            <UserCheck size={14} />
                            Shortlist
                          </Button>
                        )} */}
                      {student.status !== "enrolled" &&
                        student.status !== "rejected" && (
                          <Button
                            size="sm"
                            className="gap-1 bg-purple-600 hover:bg-purple-700 cursor-pointer"
                            onClick={() =>
                              handleStatusChange(student.id, "enrolled")
                            }
                          >
                            <GraduationCap size={14} />
                            Enroll
                          </Button>
                        )}
                      {student.status !== "rejected" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="gap-1 cursor-pointer"
                          onClick={() =>
                            handleStatusChange(student.id, "rejected")
                          }
                        >
                          <UserX size={14} />
                          Reject
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Empty State */}
            {currentStudentsList.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {activeFilter === "new"
                    ? "No new applications"
                    : activeFilter === "shortlisted"
                      ? "No shortlisted students"
                      : activeFilter === "enrolled"
                        ? "No enrolled students"
                        : activeFilter === "rejected"
                          ? "No rejected students"
                          : "No applications received yet"}
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-4 mt-8 pt-4 border-t">
              <div className="flex justify-center items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="cursor-pointer"
                >
                  Previous
                </Button>

                <div className="flex gap-2 flex-wrap justify-center">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="cursor-pointer w-10"
                          >
                            {page}
                          </Button>
                        );
                      }
                      if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <span key={page} className="px-2">
                            ...
                          </span>
                        );
                      }
                      return null;
                    },
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="cursor-pointer"
                >
                  Next
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
                {totalItems} applicants
              </div>
            </div>
          )}

          {totalPages <= 1 && totalItems > 0 && (
            <div className="text-center text-sm text-muted-foreground mt-8 pt-4 border-t">
              Showing all {totalItems} applicants
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
