import Link from "next/link";
export default function Footer() {
  return (
    <>
          <footer className="border-t bg-muted/50">
        <div className="container py-8 md:py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {["Home", "Latest Jobs", "Results", "Admit Card", "Answer Key"].map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-sm hover:underline">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Government Portals</h3>
              <ul className="space-y-2">
                {["UPSC", "SSC", "Railway", "Banking", "Police"].map((portal) => (
                  <li key={portal}>
                    <Link href="#" className="text-sm hover:underline">
                      {portal}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Job Categories</h3>
              <ul className="space-y-2">
                {["Central Govt Jobs", "State Govt Jobs", "Banking Jobs", "Teaching Jobs", "Railway Jobs"].map(
                  (category) => (
                    <li key={category}>
                      <Link href="#" className="text-sm hover:underline">
                        {category}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2">
                <li className="text-sm">Email: info@sarkariresult.com</li>
                <li className="text-sm">Phone: +91 1234567890</li>
                <li className="flex items-center gap-2 mt-4">
                  {["facebook", "twitter", "instagram", "youtube"].map((social) => (
                    <Link key={social} href="#" className="rounded-full bg-background p-2 hover:bg-accent">
                      <span className="sr-only">{social}</span>
                      <div className="h-4 w-4" />
                    </Link>
                  ))}
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SarkariResult.com - All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>

  );
}