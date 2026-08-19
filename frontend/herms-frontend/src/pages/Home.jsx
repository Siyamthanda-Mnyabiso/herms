import {
  ArrowRight,
  Building2,
  CalendarCheck,
  Lock,
  ShieldCheck,
  Send,
  UserPlus,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navigation/Navbar";
import Button from "../components/common/Button";
import { CandidatePreviewCard } from "../components/cards/CandidateCard";

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "Verified Professionals" },
  { icon: CalendarCheck, label: "Quick & Easy Booking" },
  { icon: Lock, label: "Secure & Private" },
];

const PREVIEW_CANDIDATES = [];

const STATS = [];

const HOW_IT_WORKS = [
  { icon: UserPlus, title: "1. Create Profile", description: "Professionals create their profile. Organizations set up their account." },
  { icon: Search, title: "2. Find & Match", description: "Organizations find candidates. We match the best fits." },
  { icon: Send, title: "3. Request & Respond", description: "Organization sends a booking request. Professional has 24h to respond." },
  { icon: CalendarCheck, title: "4. Confirm & Work", description: "Once accepted, the booking is confirmed. Get the work done." },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="grid grid-cols-1 gap-10 px-6 py-12 lg:grid-cols-2 lg:px-10 lg:py-16">
        <div className="flex flex-col justify-center gap-6">
          <h1 className="text-4xl font-bold leading-tight text-gray-900 lg:text-5xl">
            The smarter way to find healthcare &amp; education{" "}
            <span className="text-primary-500">professionals.</span>
          </h1>
          <p className="max-w-md text-base text-gray-500">
            HERMS connects trusted professionals with organizations for temporary
            staffing, project work, and short-term needs.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
                variant="primary"
                size="lg"
                icon={ArrowRight}
                onClick={() => navigate("/register/professional")}
            >
              I'm a Professional
            </Button>
            <Button
                variant="outline"
                size="lg"
                icon={ArrowRight}
                onClick={() => navigate("/register/organization")}
            >
              I'm an Organization
            </Button>
          </div>
          <div className="flex flex-wrap gap-6 pt-2">
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-2 text-sm text-gray-500">
                <span className="flex size-7 items-center justify-center rounded-full bg-primary-50 text-primary-500">
                  <Icon className="size-4" />
                </span>
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-center rounded-2xl bg-gray-50 p-6">
          <div className="flex size-full min-h-80 items-center justify-center rounded-xl bg-gray-200 text-gray-400">
            Hero image
          </div>
          <div className="absolute -right-2 top-6 w-64 space-y-3 sm:right-4">
            {PREVIEW_CANDIDATES.map((candidate) => (
              <CandidatePreviewCard key={candidate.id} {...candidate} />
            ))}
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-xl bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              View all professionals
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="mx-6 grid grid-cols-2 gap-8 rounded-2xl bg-gray-50 p-8 lg:mx-10 lg:grid-cols-4">
        {STATS.map(({ icon: Icon, value, label, sub }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500">
              <Icon className="size-5" />
            </span>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm font-medium text-gray-700">{label}</p>
              <p className="text-xs text-gray-400">{sub}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="px-6 py-16 lg:px-10">
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">I want to...</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-primary-50 p-8">
            <span className="flex size-12 items-center justify-center rounded-full bg-white text-primary-500">
              <UserPlus className="size-6" />
            </span>
            <h3 className="mt-4 text-lg font-semibold text-primary-700">Find Work Opportunities</h3>
            <p className="mt-2 text-sm text-gray-600">
              Create your profile, showcase your skills and get discovered by organizations.
            </p>
            <Button variant="primary" size="sm" icon={ArrowRight} className="mt-4">
              Join as a Professional
            </Button>
          </div>

          <div className="rounded-2xl bg-accent-purple-50 p-8">
            <span className="flex size-12 items-center justify-center rounded-full bg-white text-accent-purple-500">
              <Building2 className="size-6" />
            </span>
            <h3 className="mt-4 text-lg font-semibold text-accent-purple-600">Hire Professionals</h3>
            <p className="mt-2 text-sm text-gray-600">
              Find qualified, available professionals for your temporary staffing needs.
            </p>
            <Button
              size="sm"
              icon={ArrowRight}
              className="mt-4 bg-accent-purple-500 text-white hover:bg-accent-purple-600"
            >
              Join as an Organization
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-6 py-16 lg:px-10">
        <h2 className="mb-12 text-center text-2xl font-bold text-gray-900">How HERMS Works</h2>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col items-center gap-3 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-primary-50 text-primary-500">
                <Icon className="size-5" />
              </span>
              <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
              <p className="text-xs text-gray-500">{description}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button variant="secondary" icon={ArrowRight}>
            Learn more about the process
          </Button>
        </div>
      </section>
    </div>
  );
}
