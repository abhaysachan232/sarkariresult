// components/ShareButtons.tsx
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
FaFacebookF,FaWhatsapp,FaTwitter,FaLinkedinIn,FaTelegramPlane,FaRedditAlien} from "react-icons/fa";

interface ShareButtonsProps {
  url?: string;
  title?: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title }) => {
  const pathname = usePathname();

  // Current URL & Title
  const currentUrl =
    url || (typeof window !== "undefined" ? window.location.origin + pathname : "");
  const pageTitle =
    title || (typeof document !== "undefined" ? document.title : "");

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(pageTitle);

  // Social Media Share Links
  const shareLinks = [
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <FaFacebookF />,
      color: "bg-blue-600",
    },
    {
      name: "Twitter",
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <FaTwitter />,
      color: "bg-blue-400",
    },
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
      icon: <FaLinkedinIn />,
      color: "bg-blue-700",
    },
    {
      name: "WhatsApp",
      url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      icon: <FaWhatsapp />,
      color: "bg-green-500",
    },
    {
      name: "Telegram",
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <FaTelegramPlane />,
      color: "bg-blue-500",
    },
    {
      name: "Reddit",
      url: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      icon: <FaRedditAlien />,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {shareLinks.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-1 px-3 py-2 text-white rounded hover:opacity-80 transition ${social.color}`}
        >
          {social.icon}
          <span className="hidden sm:inline">{social.name}</span>
        </a>
      ))}
    </div>
  );
};

export default ShareButtons;
