"use client"

import Link from "next/link"
import { Heart, Instagram, Twitter, Facebook, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#242228] text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4 inline-flex hover:opacity-90 transition-opacity">
              <img
                src="/datinglogo.jpeg"
                alt="SG Dating App logo"
                className="w-12 h-12 rounded-full object-cover border border-white/20 shadow-sm"
              />
              <span className="text-2xl font-bold text-[#c5c4c4]">SG Dating App</span>
            </Link>
            <p className="text-[#c5c4c4]/80 leading-relaxed">
              Where meaningful connections turn into beautiful love stories. 💕
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-[#c5c4c4]">Company</h4>
            <ul className="space-y-2 text-[#c5c4c4]/80">
              <li>
                <Link href="/about" className="hover:text-[#a22929] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-[#a22929] transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#a22929] transition-colors">
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#a22929] transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-[#c5c4c4]">Support</h4>
            <ul className="space-y-2 text-[#c5c4c4]/80">
              <li>
                <a href="#" className="hover:text-[#a22929] transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <Link href="/safety" className="hover:text-[#a22929] transition-colors">
                  Safety Tips
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-[#a22929] transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#a22929] transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-[#c5c4c4]">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-[#c5c4c4]/10 rounded-full flex items-center justify-center hover:bg-[#a22929] transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#c5c4c4]/10 rounded-full flex items-center justify-center hover:bg-[#a22929] transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#c5c4c4]/10 rounded-full flex items-center justify-center hover:bg-[#a22929] transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#c5c4c4]/10 rounded-full flex items-center justify-center hover:bg-[#a22929] transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <p className="text-[#c5c4c4]/80 mt-4 text-sm">Get updates on success stories and dating tips! 💌</p>
          </div>
        </div>

        <div className="border-t border-[#c5c4c4]/15 pt-8 text-center text-[#c5c4c4]/80">
          <p>© 2025 SG Dating App. Developed by Guardian Angel Studios</p>
        </div>
      </div>
    </footer>
  )
}
