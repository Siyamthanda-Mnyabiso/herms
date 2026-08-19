import { ChevronDown, Moon } from "lucide-react";
import Button from "../common/Button";
import hermsLogo from "../../assets/images/herms-logo.png";
import { useNavigate } from "react-router-dom";

const NAV_LINKS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "For Professionals", href: "#for-professionals" },
  { label: "For Organizations", href: "#for-organizations" },
  { label: "About Us", href: "#about" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
    const navigate = useNavigate();
  return (
    <header className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4 lg:px-10">
      <a href="/" className="flex items-center">
        <img src={hermsLogo} alt="HERMS" className="h-10 w-auto" />
      </a>

      <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 lg:flex">
        {NAV_LINKS.map((link) => (
          <a key={link.label} href={link.href} className="hover:text-gray-900">
            {link.label}
          </a>
        ))}
        <button type="button" className="flex items-center gap-1 hover:text-gray-900">
          Resources
          <ChevronDown className="size-4" />
        </button>
      </nav>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Toggle theme"
          className="flex size-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
        >
          <Moon className="size-4" />
        </button>
          <Button variant="secondary" size="sm" onClick={() => navigate("/login")}>
          Log in
        </Button>
        <Button variant="primary" size="sm" onClick={() => navigate("/register")}>
          Sign up
        </Button>
      </div>
    </header>
  );
}
