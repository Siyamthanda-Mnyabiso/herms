import Button from "../common/Button";
import hermsLogo from "../../assets/images/herms-logo.png";
import { Link } from "react-router-dom";

const NAV_LINKS = [
  { label: "Professionals", href: "#for-professionals" },
  { label: "Organizations", href: "#for-organizations" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  return (
    <header className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4 lg:px-10">
      <a href="/" className="flex items-center">
        <img src={hermsLogo} alt="HERMS" className="h-12 w-auto" />
      </a>

      <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 lg:flex">
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="hover:text-gray-900"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-5">
        <Link to="/login" className="hidden text-sm font-medium text-gray-600 hover:text-gray-900 sm:block">
          Log In
        </Link>

        <Link to="/account">
          <Button className="!bg-gray-900 !text-white hover:!bg-gray-800" size="sm">
            Get Started
          </Button>
        </Link>
      </div>
    </header>
  );
}
