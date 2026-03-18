import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Briefcase, BookOpen, Plane, Users, MapPin, DollarSign, Clock, TrendingUp, Award, Globe } from 'lucide-react'
import { Hero } from '@/components/sections/Hero'
import { Features } from '@/components/sections/Features'
import { Trust } from '@/components/sections/Trust'
import { SuccessStories } from '@/components/sections/SuccessStories'

// Hardcoded data for now
const featuredJobs = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'Tech Solutions Lanka',
    location: 'Colombo',
    type: 'Full-time',
    salary: 'Rs 250,000 - 350,000',
    postedAt: '2024-03-10',
    isOverseas: false,
  },
  {
    id: '2',
    title: 'Marketing Manager',
    company: 'Global Brands International',
    location: 'Dubai',
    type: 'Full-time',
    salary: 'AED 15,000 - 20,000',
    postedAt: '2024-03-09',
    isOverseas: true,
    country: 'UAE',
  },
  {
    id: '3',
    title: 'UI/UX Designer',
    company: 'Creative Studio',
    location: 'Kandy',
    type: 'Remote',
    salary: 'Rs 150,000 - 200,000',
    postedAt: '2024-03-08',
    isOverseas: false,
  },
  {
    id: '4',
    title: 'Registered Nurse',
    company: 'Healthcare UK',
    location: 'London',
    type: 'Full-time',
    salary: '£30,000 - £40,000',
    postedAt: '2024-03-07',
    isOverseas: true,
    country: 'UK',
  },
]

const featuredCourses = [
  {
    id: 'c1',
    title: 'IELTS Preparation Course',
    provider: 'British Council',
    duration: '3 months',
    price: 35000,
    level: 'Intermediate',
  },
  {
    id: 'c2',
    title: 'Full Stack Web Development',
    provider: 'Code Academy Sri Lanka',
    duration: '6 months',
    price: 85000,
    level: 'Beginner',
  },
  {
    id: 'c3',
    title: 'Digital Marketing Masterclass',
    provider: 'Digital Marketing Institute',
    duration: '4 months',
    price: 45000,
    level: 'Intermediate',
  },
]

const stats = [
  { label: 'Active Jobs', value: '2,500+', icon: Briefcase },
  { label: 'Companies', value: '1,200+', icon: Users },
  { label: 'Overseas Jobs', value: '500+', icon: Globe },
  { label: 'Courses', value: '300+', icon: BookOpen },
]

const categories = [
  { name: 'Information Technology', count: 850, icon: Briefcase },
  { name: 'Healthcare', count: 420, icon: Award },
  { name: 'Engineering', count: 380, icon: TrendingUp },
  { name: 'Hospitality', count: 290, icon: Users },
  { name: 'Education', count: 310, icon: BookOpen },
  { name: 'Marketing', count: 275, icon: TrendingUp },
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Feature Section */}
      <Features />

      {/* Trust Section */}
      <Trust />

      {/* Success Stories Section */}
      <SuccessStories />
    </div>
  );
}