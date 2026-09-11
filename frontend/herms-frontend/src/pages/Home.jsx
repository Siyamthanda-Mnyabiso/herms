import {
  ArrowRight,
  Building2,
  CalendarCheck,
  ChevronRight,
  Cross,
  GraduationCap,
  Landmark,
  Pill,
  Send,
  UserPlus,
  Users,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navigation/Navbar";
import Button from "../components/common/Button";
import heroImage from "../assets/images/hero_2.png";

const ROLE_CALLOUTS = [
  { title: "Doctors", description: "Make a difference, anywhere.", position: "right-[44%] bottom-[30%]" },
  { title: "Nurses", description: "Care knows no borders.", position: "right-[30%] bottom-[12%]" },
  { title: "Teachers", description: "Empower new futures.", position: "right-[16%] bottom-[26%]" },
  { title: "Pharmacists", description: "Healthier communities.", position: "right-[3%] bottom-[10%]" },
];

const TRUSTED_BY = [
  { icon: Cross, label: "Hospitals & Clinics" },
  { icon: GraduationCap, label: "Schools & Education" },
  { icon: Landmark, label: "NGOs & Government" },
  { icon: Pill, label: "Pharmacies & Healthcare" },
  { icon: Users, label: "And More" },
];

const HOW_IT_WORKS = [
  { icon: UserPlus, title: "Create Profile", description: "Professionals create their profile. Organizations set up their account." },
  { icon: Search, title: "Find & Match", description: "Organizations find candidates. We match the best fits." },
  { icon: Send, title: "Request & Respond", description: "Organization sends a booking request. Professional has 24h to respond." },
  { icon: CalendarCheck, title: "Confirm & Work", description: "Once accepted, the booking is confirmed. Get the work done." },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="relative isolate overflow-hidden lg:flex lg:min-h-[680px] lg:items-center">
        <img
          src={heroImage}
          alt="Four healthcare and education professionals overlooking Cape Town"
          className="h-56 w-full object-cover object-[70%_center] sm:h-72 lg:hidden"
        />
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          className="hidden lg:absolute lg:inset-0 lg:-z-10 lg:block lg:size-full lg:object-cover"
        />

        <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-10 lg:py-16">
          <div className="flex max-w-lg flex-col gap-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Skilled people. Stronger communities.
            </p>
            <h1 className="text-4xl font-extrabold leading-tight text-gray-900 lg:text-5xl">
              Connecting Professionals
              <span className="block text-primary-500">with Purpose</span>
            </h1>
            <p className="max-w-md text-base text-gray-500">
              HERMS links qualified professionals — doctors, nurses, teachers,
              pharmacists and more — with organizations that need temporary
              and contract staff.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                icon={ArrowRight}
                className="!bg-gray-900 !text-white hover:!bg-gray-800"
                onClick={() => navigate("/register")}
              >
                I'm a Professional
              </Button>
              <Button variant="secondary" size="lg" onClick={() => navigate("/account")}>
                I'm an Organization
              </Button>
            </div>
          </div>
        </div>

        <p className="absolute right-6 top-6 hidden max-w-[9rem] text-right font-serif text-base italic leading-snug text-gray-400 lg:right-10 lg:block">
          People Build Brighter Tomorrows
        </p>

        {ROLE_CALLOUTS.map(({ title, description, position }) => (
          <div
            key={title}
            className={`absolute hidden w-32 rounded-lg bg-white/95 px-2.5 py-2 shadow-md backdrop-blur lg:block ${position}`}
          >
            <p className="text-xs font-semibold text-gray-900">{title}</p>
            <p className="text-[10px] leading-tight text-gray-500">{description}</p>
          </div>
        ))}
      </section>

      <section className="border-y border-gray-100 bg-gray-50 px-6 py-10 lg:px-10">
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-gray-400">
          Trusted by organizations across South Africa
        </p>
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {TRUSTED_BY.map(({ icon: Icon, label }) => (
            <span key={label} className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Icon className="size-4" />
              {label}
            </span>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-500">Get Started</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900 lg:text-3xl">I want to...</h2>
        </div>
        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
          <div
            id="for-professionals"
            className="group rounded-3xl border border-gray-100 bg-primary-50 p-10 shadow-sm transition-shadow hover:shadow-lg"
          >
            <span className="flex size-14 items-center justify-center rounded-2xl bg-white text-primary-500 shadow-sm">
              <UserPlus className="size-7" />
            </span>
            <h3 className="mt-5 text-xl font-semibold text-primary-700">Find Work Opportunities</h3>
            <p className="mt-2 text-sm text-gray-600">
              Create your profile, showcase your skills and get discovered by organizations.
            </p>
            <Button
              variant="primary"
              icon={ArrowRight}
              className="mt-6 transition-transform group-hover:translate-x-1"
              onClick={() => navigate("/register")}
            >
              Join as a Professional
            </Button>
          </div>

          <div
            id="for-organizations"
            className="group rounded-3xl border border-gray-100 bg-accent-purple-50 p-10 shadow-sm transition-shadow hover:shadow-lg"
          >
            <span className="flex size-14 items-center justify-center rounded-2xl bg-white text-accent-purple-500 shadow-sm">
              <Building2 className="size-7" />
            </span>
            <h3 className="mt-5 text-xl font-semibold text-accent-purple-600">Hire Professionals</h3>
            <p className="mt-2 text-sm text-gray-600">
              Find qualified, available professionals for your temporary staffing needs.
            </p>
            <Button
              icon={ArrowRight}
              className="mt-6 !bg-accent-purple-500 !text-white transition-transform hover:!bg-accent-purple-600 group-hover:translate-x-1"
              onClick={() => navigate("/account")}
            >
              Join as an Organization
            </Button>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-gray-50 px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-500">The Process</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900 lg:text-3xl">How HERMS Works</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500">
            From profile to placement — a simple, fast process for both professionals and organizations.
          </p>
        </div>

        <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-4 lg:flex-row lg:items-stretch">
          {HOW_IT_WORKS.map(({ icon: Icon, title, description }, index) => (
            <div key={title} className="flex w-full items-center gap-3 lg:flex-1">
              <div className="flex w-full flex-1 flex-col items-center gap-3 rounded-2xl bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white">
                  {index + 1}
                </span>
                <span className="flex size-12 items-center justify-center rounded-full bg-primary-50 text-primary-500">
                  <Icon className="size-5" />
                </span>
                <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
                <p className="text-xs text-gray-500">{description}</p>
              </div>
              {index < HOW_IT_WORKS.length - 1 && (
                <ChevronRight className="hidden size-5 shrink-0 text-gray-300 lg:block" />
              )}
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="relative overflow-hidden bg-gray-900 px-6 py-16 text-white lg:px-10">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">About HERMS</p>
            <h2 className="mt-3 text-2xl font-bold lg:text-3xl">
              Opportunities that create change
            </h2>
            <p className="mt-3 max-w-md text-sm text-gray-300">
              HERMS was built to make temporary and contract staffing simple for
              South Africa's hospitals, clinics, schools and pharmacies — while
              giving skilled professionals more flexible ways to work.
            </p>
          </div>
          <div className="flex flex-col gap-1 text-sm text-gray-400 lg:items-end lg:text-right">
            <span>People</span>
            <span>Opportunities</span>
            <span>Stronger Communities</span>
          </div>
        </div>
      </section>
    </div>
  );
}
