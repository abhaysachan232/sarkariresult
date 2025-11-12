"use client";
import Image from "next/image";

export default function JobImage({ slug }: { slug: string }) {
  return (
    <Image
      src={`/api/job-image?slug=${slug}`} // relative path
      alt={`Image for ${slug}`}
      width={1200}
      height={675}
      unoptimized // Dev/testing ke liye
    />
  );
}
