'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Company',
      links: [
        { label: 'About StyleLink', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Press', href: '/press' },
        { label: 'Blog', href: '/blog' },
      ]
    },
    {
      title: 'Customer Care',
      links: [
        { label: 'Contact Us', href: '/contact' },
        { label: 'Help Center', href: '/help' },
        { label: 'Size Guide', href: '/size-guide' },
        { label: 'Shipping & Returns', href: '/shipping' },
        { label: 'Track Your Order', href: '/track-order' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Cookie Policy', href: '/cookies' },
        { label: 'Accessibility', href: '/accessibility' },
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/stylelink', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com/stylelink', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com/stylelink', label: 'Twitter' },
    { icon: Youtube, href: 'https://youtube.com/stylelink', label: 'YouTube' },
  ];

  return (
    <footer className="bg-[var(--header-bg)] text-[var(--header-text)] mt-16 sm:mt-20">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">Stay In Style</h3>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Get the latest fashion trends, style tips, and exclusive offers delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40"
              />
              <button className="px-6 py-3 bg-white text-[var(--header-bg)] rounded-lg font-medium hover:bg-white/90 transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-sm text-white/60 mt-4">
              By subscribing, you agree to our Privacy Policy and consent to receive updates.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-wider mb-4">
                STYL
                <span className="inline-block transform scale-x-[-1]">E</span>
                LINK
              </h2>
              <p className="text-white/80 leading-relaxed">
                Where fashion meets intelligence. Discover your perfect style with our AI-powered fashion platform 
                that connects you with the latest trends from top retailers worldwide.
              </p>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-white/60" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-white/60" />
                <span>hello@stylelink.com</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-white/60 mt-0.5" />
                <span>123 Fashion Avenue<br />New York, NY 10001</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="text-sm text-white/60">
              © {currentYear} StyleLink. All rights reserved.
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-white/60 mr-2">Follow us:</span>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
