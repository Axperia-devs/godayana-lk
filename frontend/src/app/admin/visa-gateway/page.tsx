// src/app/admin/visa-gateway/page.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Calendar, Building2, Globe, Users, Book } from "lucide-react";
import Link from "next/link";

interface VisaGatewayPost {
  id: number;
  title: string;
  company: string;
  companyId: number;
  type: "visa" | "gateway";
  country: string;
  postedDate: string;
  applications: number;
  views: number;
}

// Mock data - replace with API call
const allPosts: VisaGatewayPost[] = [
  // UK Visa
  {
    id: 1,
    title: "UK Visa Services",
    company: "Visa Solutions",
    companyId: 1,
    type: "visa",
    country: "United Kingdom",
    postedDate: "2024-04-21",
    applications: 45,
    views: 320,
  },
  // UK Gateway
  {
    id: 1,
    title: "UK Immigration Gateway",
    company: "Gateway Global",
    companyId: 2,
    type: "gateway",
    country: "United Kingdom",
    postedDate: "2024-04-20",
    applications: 28,
    views: 190,
  },
  // Australia Visa
  {
    id: 3,
    title: "Australia Visa Services",
    company: "Global Visa Services",
    companyId: 3,
    type: "visa",
    country: "Australia",
    postedDate: "2024-04-22",
    applications: 0,
    views: 0,
  },
  // Australia Gateway
  {
    id: 4,
    title: "Australia Migration Gateway",
    company: "Migration Experts",
    companyId: 4,
    type: "gateway",
    country: "Australia",
    postedDate: "2024-04-19",
    applications: 15,
    views: 120,
  },
  // Canada Visa
  {
    id: 5,
    title: "Canada Visa Services",
    company: "Travel Visas",
    companyId: 5,
    type: "visa",
    country: "Canada",
    postedDate: "2024-04-19",
    applications: 12,
    views: 89,
  },
  // Canada Gateway
  {
    id: 6,
    title: "Canada Immigration Gateway",
    company: "Gateway Global",
    companyId: 6,
    type: "gateway",
    country: "Canada",
    postedDate: "2024-04-18",
    applications: 20,
    views: 150,
  },
  // USA Visa
  {
    id: 7,
    title: "USA Visa Services",
    company: "US Visa Experts",
    companyId: 7,
    type: "visa",
    country: "USA",
    postedDate: "2024-04-15",
    applications: 28,
    views: 210,
  },
  // USA Gateway
  {
    id: 8,
    title: "USA Immigration Gateway",
    company: "Immigration Pro",
    companyId: 8,
    type: "gateway",
    country: "USA",
    postedDate: "2024-04-16",
    applications: 22,
    views: 180,
  },
  // Germany Visa
  {
    id: 9,
    title: "Germany Visa Services",
    company: "Europe Visas",
    companyId: 9,
    type: "visa",
    country: "Germany",
    postedDate: "2024-04-14",
    applications: 8,
    views: 45,
  },
  // Japan Visa
  {
    id: 10,
    title: "Japan Visa Services",
    company: "Asia Visas",
    companyId: 10,
    type: "visa",
    country: "Japan",
    postedDate: "2024-04-13",
    applications: 5,
    views: 30,
  },
  // France Visa
  {
    id: 11,
    title: "France Visa Services",
    company: "Europe Visas",
    companyId: 11,
    type: "visa",
    country: "France",
    postedDate: "2024-04-12",
    applications: 3,
    views: 25,
  },
  // Other Visa
  {
    id: 12,
    title: "Other Countries Visa Services",
    company: "Global Visas",
    companyId: 12,
    type: "visa",
    country: "Other",
    postedDate: "2024-04-11",
    applications: 10,
    views: 60,
  },
  // Other Gateway
  {
    id: 13,
    title: "Other Countries Gateway",
    company: "Global Gateway",
    companyId: 13,
    type: "gateway",
    country: "Other",
    postedDate: "2024-04-10",
    applications: 7,
    views: 40,
  },
];

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

export default function AdminVisaGateway() {
  const [currentPage, setCurrentPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<"all" | "visa" | "gateway">(
    "visa",
  );
  const itemsPerPage = 10;

  const getFilteredPosts = () => {
    let filtered = allPosts;

    // Filter by type only
    if (typeFilter === "visa") {
      filtered = filtered.filter((post) => post.type === "visa");
    } else if (typeFilter === "gateway") {
      filtered = filtered.filter((post) => post.type === "gateway");
    }

    return filtered;
  };

  const filteredPosts = getFilteredPosts();
  const totalItems = filteredPosts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  // Get counts for filters
  const allCount = allPosts.length;
  const visaCount = allPosts.filter((p) => p.type === "visa").length;
  const gatewayCount = allPosts.filter((p) => p.type === "gateway").length;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get navigation link based on post type
  const getNavigationLink = (post: VisaGatewayPost) => {
    if (post.type === "visa") {
      return `/admin/visa-gateway/visa/${post.id}`;
    } else {
      return `/admin/visa-gateway/gateway/${post.id}`;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-primary/4 min-h-[calc(100vh-7rem)] flex flex-col">
        <CardContent className="flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mt-1">
              View and manage visa and gateway service applications
            </p>
          </div>

          {/* Type Filter Tabs */}
          <div className="flex gap-4 mb-6">
            <div className="bg-primary/10 p-1 rounded-lg w-full lg:w-fit flex items-center gap-1 flex-wrap">
              {/* <button
                onClick={() => {
                  setTypeFilter("all");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  typeFilter === "all"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                All <span className="hidden md:inline-block">({allCount})</span>
              </button> */}
              <button
                onClick={() => {
                  setTypeFilter("visa");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold flex items-center gap-1 ${
                  typeFilter === "visa"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                {/* <Book size={14} /> */}
                Visa{" "}
                <span className="hidden md:inline-block">({visaCount})</span>
              </button>
              <button
                onClick={() => {
                  setTypeFilter("gateway");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold flex items-center gap-1 ${
                  typeFilter === "gateway"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                {/* <Globe size={14} /> */}
                Gateway{" "}
                <span className="hidden md:inline-block">({gatewayCount})</span>
              </button>
            </div>
          </div>

          {/* Posts List - Country Cards */}
          <div className="flex-1 space-y-4">
            {currentPosts.map((post) => (
              <div
                key={post.id}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-card"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left Section */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="gap-1">
                        {post.type === "visa" ? (
                          <Book size={14} />
                        ) : (
                          <Globe size={14} />
                        )}
                        {post.type === "visa"
                          ? "Visa Service"
                          : "Gateway Service"}
                      </Badge>
                    </div>

                    <h3 className="font-semibold text-xl mb-1">
                      {post.country} {post.type === "visa" ? "Visa" : "Gateway"}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-3">
                      {post.company}
                    </p>

                    {/* Post Stats */}
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users size={14} /> {post.applications} applications
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={14} /> {post.views} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> {formatDate(post.postedDate)}
                      </span>
                    </div>
                  </div>

                  {/* View Applications Button with different navigation */}
                  <div className="flex items-center">
                    <Link href={getNavigationLink(post)}>
                      <Button
                        variant="default"
                        size="default"
                        className="gap-2 cursor-pointer bg-primary hover:bg-primary/90"
                      >
                        <Eye size={16} />
                        View Applications
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {currentPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {typeFilter === "visa"
                    ? "No visa posts found"
                    : typeFilter === "gateway"
                      ? "No gateway posts found"
                      : "No posts found"}
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
                {totalItems} posts
              </div>
            </div>
          )}

          {totalPages <= 1 && totalItems > 0 && (
            <div className="text-center text-sm text-muted-foreground mt-8 pt-4 border-t">
              Showing all {totalItems} posts
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
