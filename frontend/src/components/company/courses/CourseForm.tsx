// src/components/company/courses/CourseForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Upload, CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import Image from "next/image";

interface CourseData {
  id?: number;
  title?: string;
  category?: string;
  description?: string;
  enrollType?: "online" | "physical";
  location?: string;
  startDate?: Date;
  endDate?: Date;
  price?: string;
  maxStudents?: string;
  benefits?: string;
  requirements?: string[];
  courseImage?: string;
  confirmationEmail?: string;
}

interface CourseFormProps {
  initialData?: CourseData;
  isEditing?: boolean;
}

export function CourseForm({ initialData, isEditing }: CourseFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [enrollType, setEnrollType] = useState<"online" | "physical">(
    initialData?.enrollType || "online",
  );
  const [requirements, setRequirements] = useState<string[]>(
    initialData?.requirements || [],
  );
  const [currentRequirement, setCurrentRequirement] = useState("");
  const [courseImage, setCourseImage] = useState<string>(
    initialData?.courseImage || "",
  );

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    category: initialData?.category || "",
    description: initialData?.description || "",
    location: initialData?.location || "",
    startDate: initialData?.startDate || undefined,
    endDate: initialData?.endDate || undefined,
    price: initialData?.price || "",
    maxStudents: initialData?.maxStudents || "",
    benefits: initialData?.benefits || "",
    confirmationEmail: initialData?.confirmationEmail || "",
  });

  const handleAddRequirement = () => {
    if (currentRequirement && !requirements.includes(currentRequirement)) {
      setRequirements([...requirements, currentRequirement]);
      setCurrentRequirement("");
    }
  };

  const handleRemoveRequirement = (requirement: string) => {
    setRequirements(requirements.filter((r) => r !== requirement));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCourseImage(reader.result as string);
        toast.success("Image uploaded successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setCourseImage("");
    toast.success("Image removed");
  };

  const handleSubmit = async (
    e: React.FormEvent,
    action: "publish" | "draft",
  ) => {
    e.preventDefault();

    // Validate location for physical courses
    if (enrollType === "physical" && !formData.location) {
      toast.error("Location is required for physical courses");
      return;
    }

    // Validate dates
    if (
      formData.startDate &&
      formData.endDate &&
      formData.endDate <= formData.startDate
    ) {
      toast.error("End date must be after start date");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success(
      action === "publish"
        ? "Course published successfully!"
        : "Course saved as draft",
    );
    setIsLoading(false);
    router.push("/company/courses");
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, "publish")} className="space-y-4">
      <div className="space-y-8">
        {/* Course Type Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Course Type</h3>
          <RadioGroup
            value={enrollType}
            onValueChange={(value) =>
              setEnrollType(value as "online" | "physical")
            }
            className="flex gap-4 lg:gap-8"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="online" id="online" />
              <Label htmlFor="online" className="cursor-pointer">
                Online Course
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="physical" id="physical" />
              <Label htmlFor="physical" className="cursor-pointer">
                Physical Course
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Course Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Course Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="title"
                className="text-sm font-semibold text-primary"
              >
                Course Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., Advanced Web Development Course"
                required
                className="mt-1.5"
              />
            </div>

            <div>
              <Label
                htmlFor="category"
                className="text-sm font-semibold text-primary"
              >
                Course Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="programming">
                    Programming & Development
                  </SelectItem>
                  <SelectItem value="design">Design & Creative</SelectItem>
                  <SelectItem value="business">
                    Business & Management
                  </SelectItem>
                  <SelectItem value="marketing">Digital Marketing</SelectItem>
                  <SelectItem value="data">Data Science & AI</SelectItem>
                  <SelectItem value="language">Language Learning</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location - Only show for physical courses */}
          {enrollType === "physical" && (
            <div>
              <Label
                htmlFor="location"
                className="text-sm font-semibold text-primary"
              >
                Course Location <span className="text-red-500">*</span>
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="e.g., 123 Main St, New York, NY 10001"
                required={enrollType === "physical"}
                className="mt-1.5"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Full address where the course will be conducted
              </p>
            </div>
          )}

          {/* Course Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-semibold text-primary">
                Start Date <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1.5",
                      !formData.startDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? (
                      format(formData.startDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date: Date | undefined) =>
                      setFormData({ ...formData, startDate: date })
                    }
                    disabled={(date: Date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label className="text-sm font-semibold text-primary">
                End Date <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1.5",
                      !formData.endDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? (
                      format(formData.endDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date: Date | undefined) =>
                      setFormData({ ...formData, endDate: date })
                    }
                    disabled={(date: Date) =>
                      formData.startDate
                        ? date <= formData.startDate
                        : date < new Date()
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Price and Capacity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="price"
                className="text-sm font-semibold text-primary"
              >
                Course Price (LKR) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="0.00"
                required
                className="mt-1.5"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Set 0 for free courses
              </p>
            </div>

            <div>
              <Label
                htmlFor="maxStudents"
                className="text-sm font-semibold text-primary"
              >
                Maximum Students <span className="text-red-500">*</span>
              </Label>
              <Input
                id="maxStudents"
                type="number"
                value={formData.maxStudents}
                onChange={(e) =>
                  setFormData({ ...formData, maxStudents: e.target.value })
                }
                placeholder="e.g., 30"
                required
                className="mt-1.5"
              />
            </div>
          </div>
        </div>

        {/* Course Description */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-semibold">Course Content</h3>

          <div>
            <Label
              htmlFor="description"
              className="text-sm font-semibold text-primary"
            >
              Course Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe what students will learn, course structure, prerequisites..."
              rows={6}
              required
              className="mt-1.5"
            />
          </div>

          <div>
            <Label
              htmlFor="benefits"
              className="text-sm font-semibold text-primary"
            >
              What Students Will Learn / Benefits
            </Label>
            <Textarea
              id="benefits"
              value={formData.benefits}
              onChange={(e) =>
                setFormData({ ...formData, benefits: e.target.value })
              }
              placeholder="List the key takeaways and benefits of taking this course..."
              rows={4}
              className="mt-1.5"
            />
          </div>

          {/* Requirements/Prerequisites */}
          <div>
            <Label className="text-sm font-semibold text-primary">
              Prerequisites / Requirements (Optional)
            </Label>
            <div className="flex gap-2 mt-1.5">
              <Input
                value={currentRequirement}
                onChange={(e) => setCurrentRequirement(e.target.value)}
                placeholder="e.g., Basic knowledge of HTML"
                className="flex-1"
                onKeyPress={(e: React.KeyboardEvent) =>
                  e.key === "Enter" &&
                  (e.preventDefault(), handleAddRequirement())
                }
              />
              <Button
                type="button"
                onClick={handleAddRequirement}
                variant="outline"
                size="icon"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {requirements.map((req) => (
                <Badge key={req} variant="secondary" className="px-3 py-1">
                  {req}
                  <button
                    type="button"
                    onClick={() => handleRemoveRequirement(req)}
                    className="ml-2 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Course Image Upload */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-semibold">Course Media</h3>

          <div>
            <Label className="text-sm font-semibold text-primary">
              Course Image (Optional)
            </Label>
            <div className="mt-2">
              {courseImage ? (
                <div className="relative inline-block">
                  <Image
                    src={courseImage}
                    alt="Course"
                    width={300}
                    height={200}
                    className="rounded-lg object-cover border"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-primary/5 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload course image
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG (Max 2MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Confirmation Email */}
        <div className="space-y-4 pt-4 border-t">
          <div>
            <Label
              htmlFor="confirmationEmail"
              className="text-sm font-semibold text-primary"
            >
              Confirmation Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="confirmationEmail"
              type="email"
              value={formData.confirmationEmail}
              onChange={(e) =>
                setFormData({ ...formData, confirmationEmail: e.target.value })
              }
              placeholder="courses@example.com"
              required
              className="mt-1.5"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Course confirmation and updates will be sent to this email
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4 border-t justify-end">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 cursor-pointer max-w-2xl"
          >
            {isEditing
              ? isLoading
                ? "Updating..."
                : "Save Changes"
              : isLoading
                ? "Publishing..."
                : "Publish Course"}
          </Button>
          {!isEditing && (
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              className="flex-1 cursor-pointer"
              onClick={(e) => handleSubmit(e, "draft")}
            >
              Save as Draft
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
