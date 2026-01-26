"use client";
import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "./theme-toggle";
import { Button } from "./ui/button";
import { Bell } from "lucide-react";

export default function Navbar() {
      const [isOpen, setIsOpen] = useState(false)
  const menuItems = [
    { name: "Home", href: "/" ,target:''},
    { name: "Latest Jobs", href: "/latest-jobs",target:'_blank' },
    { name: "Sarkari Results", href: "/results" ,target:'_blank'},
    { name: "Admit Card", href: "/admit-card" ,target:'_blank'},
    { name: "Answer Key", href: "/answer-key" ,target:'_blank'},
    // { name: "Syllabus", href: "/syllabus",target:'_blank' },
    { name: "Admission", href: "/admission" ,target:'_blank'},
    // { name: "Certificate Verification", href: "/certificate-verification",target:'_blank' },
    { name: "Important", href: "/important",target:'_blank' },
  ]
  return (
<>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Sarkari Result
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
         {menuItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          target={''}   // नया tab में खुलेगा
          rel="canonical"
        
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          {item.name}
        </Link>
      ))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="icon" className="hidden md:flex">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>

   <Button
          variant="outline"
          size="icon"
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
          <span className="sr-only">Menu</span>
        </Button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-background border-t shadow-md md:hidden">
          <nav className="flex flex-col space-y-3 p-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                target={''}
                rel="canonical"
                className="text-sm font-medium hover:text-primary px-2 py-1 rounded-md hover:bg-accent"
                 onClick={() => setIsOpen(!isOpen)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
        </div>
      </header>
</>
  );
}
