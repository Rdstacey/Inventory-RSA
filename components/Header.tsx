'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const navLinks = [
    { href: 'https://rsautomation.net', label: 'Home' },
    { href: 'https://rsautomation.net/about/', label: 'About RSA' },
    { href: 'https://rsautomation.net/contact/', label: 'Contact RSA' },
    { href: 'https://rsautomation.net/careers/', label: 'Careers' },
    { href: 'https://rsautomation.net/portfolio/', label: 'Portfolio' },
  ];

  return (
    <header className="bg-primary-dark border-b-2 border-accent-teal shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center py-4">
          <div className="flex items-center gap-4 flex-shrink-0 mb-4 md:mb-0">
            <Link href="https://rsautomation.net" className="flex items-center gap-4">
              <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
                <Image
                  src="/LOGO.png"
                  alt="RS Automation Logo"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 80px, 96px"
                  priority
                />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  RS Automation
                </h1>
                <p className="text-xs md:text-sm text-accent-light mt-0.5">
                  Used Food Process &amp; Plant Automation Equipment
                </p>
              </div>
            </Link>
          </div>

          <nav className="flex flex-wrap justify-center gap-1 md:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-steel-300 hover:text-white hover:bg-primary-blue rounded transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/"
              className="px-3 py-2 text-sm font-medium text-white bg-accent-teal/20 border border-accent-teal rounded"
            >
              Inventory
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
