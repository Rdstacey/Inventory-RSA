'use client';

import Link from 'next/link';

export default function Header() {
  const navLinks = [
    { href: 'https://rsautomation.net', label: 'Home' },
    { href: 'https://rsautomation.net/about/', label: 'About RSA' },
    { href: 'https://rsautomation.net/contact/', label: 'Contact RSA' },
    { href: 'https://rsautomation.net/careers/', label: 'Careers' },
    { href: 'https://rsautomation.net/portfolio/', label: 'Portfolio' },
  ];

  return (
    <header className="bg-white border-b-2 border-gray-300 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center py-4">
          {/* Logo and Branding */}
          <div className="flex-shrink-0 mb-4 md:mb-0">
            <Link href="https://rsautomation.net" className="block">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                RS Automation
              </h1>
              <p className="text-sm md:text-base text-gray-600 italic mt-1">
                Engineering innovative solutions for today's manufacturing needs
              </p>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-2 md:gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm md:text-base font-medium text-gray-700 hover:text-primary-blue hover:underline transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/"
              className="px-3 py-2 text-sm md:text-base font-medium text-primary-blue border-b-2 border-primary-blue"
            >
              Inventory
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

