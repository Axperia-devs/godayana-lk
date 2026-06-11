// src/app/company/leads/page.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Eye,
  Users,
  MapPin,
  Clock,
  GraduationCap,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

interface CourseLead {
  id: number;
  title: string;
  company: string;
  location: string;
  enrollType: "online" | "physical";
  status: "active" | "closed";
  applicationsCount: number;
  newApplicationsCount: number;
  postedDate: string;
  price: string;
}

// Mock data - replace with API call
const allCourses: CourseLead[] = [
  {
    id: 1,
    title: "Advanced Web Development Bootcamp",
    company: "Tech Academy",
    location: "Colombo",
    enrollType: "physical",
    status: "active",
    applicationsCount: 12,
    newApplicationsCount: 3,
    postedDate: "2024-04-20",
    price: "45000",
  },
  {
    id: 2,
    title: "Digital Marketing Masterclass",
    company: "Marketing Pro",
    location: "Online",
    enrollType: "online",
    status: "active",
    applicationsCount: 8,
    newApplicationsCount: 1,
    postedDate: "2024-04-15",
    price: "25000",
  },
  {
    id: 3,
    title: "Data Science & AI Course",
    company: "Data Institute",
    location: "Online",
    enrollType: "online",
    status: "active",
    applicationsCount: 15,
    newApplicationsCount: 5,
    postedDate: "2024-04-18",
    price: "55000",
  },
  {
    id: 4,
    title: "UI/UX Design Course",
    company: "Design Hub",
    location: "Kandy",
    enrollType: "physical",
    status: "closed",
    applicationsCount: 5,
    newApplicationsCount: 0,
    postedDate: "2024-04-10",
    price: "35000",
  },
  {
    id: 5,
    title: "Business English Communication",
    company: "Language Center",
    location: "Online",
    enrollType: "online",
    status: "active",
    applicationsCount: 3,
    newApplicationsCount: 2,
    postedDate: "2024-04-22",
    price: "15000",
  },
];

const getStatusConfig = (status: CourseLead["status"]) => {
  const config = {
    active: {
      label: "Active",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    },
    closed: {
      label: "Closed",
      color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    },
  };
  return config[status];
};

const getEnrollTypeConfig = (type: CourseLead["enrollType"]) => {
  return {
    online: {
      label: "Online Course",
      icon: <GraduationCap size={14} />,
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    },
    physical: {
      label: "Physical Course",
      icon: <MapPin size={14} />,
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    },
  }[type];
};

export default function CourseLeads() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "closed">(
    "all",
  );
  const [courses, setCourses] = useState<CourseLead[]>(allCourses);
  const itemsPerPage = 10;

  // Filter courses based on status
  const getFilteredCourses = () => {
    if (activeFilter === "active") {
      return courses.filter((course) => course.status === "active");
    }
    if (activeFilter === "closed") {
      return courses.filter((course) => course.status === "closed");
    }
    return courses;
  };

  const filteredCourses = getFilteredCourses();
  const totalItems = filteredCourses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCourses = filteredCourses.slice(startIndex, endIndex);

  // Get counts for filters
  const allCount = courses.length;
  const activeCount = courses.filter(
    (course) => course.status === "active",
  ).length;
  const closedCount = courses.filter(
    (course) => course.status === "closed",
  ).length;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Posted 1 day ago";
    if (diffDays <= 7) return `Posted ${diffDays} days ago`;
    if (diffDays <= 30) return `Posted ${Math.floor(diffDays / 7)} weeks ago`;
    return `Posted ${Math.floor(diffDays / 30)} months ago`;
  };

  const formatPrice = (price: string) => {
    const numPrice = parseInt(price);
    if (numPrice === 0) return "Free";
    return `LKR ${numPrice.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-primary/4 min-h-[calc(100vh-7rem)] flex flex-col">
        <CardContent className="flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mt-1">
              View and manage all applications received for your courses
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b pb-3">
            <div className="bg-primary/10 p-1 rounded-lg w-full lg:w-fit flex items-center justify-between gap-1 flex-wrap">
              <button
                onClick={() => {
                  setActiveFilter("all");
                  setCurrentPage(1);
                }}
                className={`px-3 lg:px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeFilter === "all"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                All <span className="hidden md:inline-block">({allCount})</span>
              </button>
              <button
                onClick={() => {
                  setActiveFilter("active");
                  setCurrentPage(1);
                }}
                className={`px-3 lg:px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeFilter === "active"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Active{" "}
                <span className="hidden md:inline-block">({activeCount})</span>
              </button>
              <button
                onClick={() => {
                  setActiveFilter("closed");
                  setCurrentPage(1);
                }}
                className={`px-3 lg:px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeFilter === "closed"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Closed{" "}
                <span className="hidden md:inline-block">({closedCount})</span>
              </button>
            </div>
          </div>

          {/* Courses List */}
          <div className="flex-1 space-y-4">
            {currentCourses.map((course) => {
              const statusConfig = getStatusConfig(course.status);
              const enrollTypeConfig = getEnrollTypeConfig(course.enrollType);
              return (
                <div
                  key={course.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={enrollTypeConfig.color}>
                              <span className="flex items-center gap-1">
                                {enrollTypeConfig.icon}
                                {enrollTypeConfig.label}
                              </span>
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-lg">
                            {course.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {course.company}
                          </p>
                        </div>
                        <Badge className={statusConfig.color}>
                          {statusConfig.label}
                        </Badge>
                      </div>

                      {/* Course Stats */}
                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users size={14} /> {course.applicationsCount}{" "}
                          applications
                        </span>
                        {course.newApplicationsCount > 0 && (
                          <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                            <Clock size={14} /> {course.newApplicationsCount}{" "}
                            new
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar size={14} /> {formatDate(course.postedDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} /> {course.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign size={14} /> {formatPrice(course.price)}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/company/lead/${course.id}`}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 cursor-pointer"
                        >
                          <Eye size={14} />
                          View Applications
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Empty State */}
            {currentCourses.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {activeFilter === "active"
                    ? "No active courses with applications found"
                    : activeFilter === "closed"
                      ? "No closed courses found"
                      : "No courses found. Post a course to start receiving applications."}
                </p>
                {activeFilter === "all" && (
                  <Link href="/company/courses/post">
                    <Button className="mt-4 gap-2">
                      <GraduationCap size={16} />
                      Post a Course
                    </Button>
                  </Link>
                )}
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
                {totalItems} courses
              </div>
            </div>
          )}

          {totalPages <= 1 && totalItems > 0 && (
            <div className="text-center text-sm text-muted-foreground mt-8 pt-4 border-t">
              Showing all {totalItems} courses
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
