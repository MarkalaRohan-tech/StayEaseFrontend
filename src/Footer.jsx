import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-200 text-gray-700 pt-10 pb-6 px-6 md:px-20">
      <div className="max-w-6xl mx-auto text-center">
        {/* About StayEase */}
        <h2 className="text-2xl font-bold text-yellow-400 mb-2">StayEase</h2>
        <p className="text-sm max-w-xl mx-auto mb-4">
          StayEase is your go-to platform for comfortable, affordable, and
          reliable stays. We’re committed to making your travel and
          accommodation experience smooth and worry-free.
        </p>

        {/* Social Media */}
        <div className="flex justify-center space-x-4 text-xl text-gray-600 my-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook className="hover:text-yellow-400" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="hover:text-yellow-400" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter className="hover:text-yellow-400" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin className="hover:text-yellow-400" />
          </a>
        </div>

        {/* Legal Links */}
        <div className="text-sm space-x-4 mb-4">
          <a href="/terms" className="hover:text-yellow-400">
            Terms & Conditions
          </a>
          <a href="/privacy" className="hover:text-yellow-400">
            Privacy Policy
          </a>
        </div>

        {/* Copyright */}
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} StayEase. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
