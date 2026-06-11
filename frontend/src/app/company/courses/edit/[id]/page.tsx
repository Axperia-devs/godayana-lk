// src/app/company/courses/edit/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { CourseForm } from "@/components/company/courses/CourseForm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data fetch - replace with API call
const getCourseData = (id: number) => {
  return {
    id,
    title: "Advanced Web Development Course",
    category: "programming",
    description:
      "Learn advanced web development techniques including React, Node.js, and modern frameworks. This comprehensive course covers frontend and backend development with hands-on projects.",
    enrollType: "physical" as "online" | "physical",
    location: "123 Main Street, Colombo, Sri Lanka",
    startDate: new Date("2025-01-15"),
    endDate: new Date("2025-03-15"),
    price: "45000",
    maxStudents: "25",
    benefits:
      "Build real-world projects, Get certificate upon completion, Lifetime access to course materials, One-on-one mentorship sessions",
    requirements: [
      "Basic knowledge of HTML/CSS",
      "JavaScript fundamentals",
      "Laptop with minimum 8GB RAM",
    ],
    courseImage: "",
    confirmationEmail: "courses@techacademy.com",
  };
};

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = parseInt(params.id as string);
  const courseData = getCourseData(courseId);

  return (
    <div className="space-y-2">
      {/* Back Button */}
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
        <h2 className="text-xl font-bold">Edit Course</h2>
      </div>

      <Card className="bg-primary/4">
        <CardContent className="px-6 pb-6">
          <CourseForm initialData={courseData} isEditing />
        </CardContent>
      </Card>
    </div>
  );
}
