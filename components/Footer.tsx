import Link from "next/link";
export default function Footer() {
   const menuItems = [
    { name: "Home", href: "/" ,target:''},
    { name: "Latest Jobs", href: "/latest-jobs",target:'_blank' },
    { name: "Results", href: "/results" ,target:'_blank'},
    { name: "Admit Card", href: "/admit-card" ,target:'_blank'},
    { name: "Answer Key", href: "/answer-key" ,target:'_blank'},
    { name: "Syllabus", href: "/syllabus",target:'_blank' },
    { name: "Admission", href: "/admission" ,target:'_blank'},
    { name: "Certificate Verification", href: "/certificate-verification",target:'_blank' },
    { name: "Important", href: "/important",target:'_blank' },
  ]
  return (
    <>
          <footer className="border-t bg-muted/50">
        <div className="container py-8 md:py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {menuItems.map((link) => (
                  <li key={link.name}>
                    <Link  href={`${link.href}`} className="text-sm hover:underline">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4"></h3>
              <ul className="space-y-2">
                {["about", "contact", "disclaimer", "faq", "privacy","terms"].map((portal) => (
                  <li key={portal}>
                    <Link  href={`/${portal}`} className="text-sm hover:underline">
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
                    <li className={category} key={category}>
                      <Link  href={`/${category}`} className="text-sm hover:underline">
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
                <li className="text-sm">Email: abhaysachan232@gmail.com</li>
                <li className="text-sm">Phone: +91 9580311217</li>
                <li className="flex items-center gap-2 mt-4">
                  {["facebook", "twitter", "instagram", "youtube"].map((social) => (
                    <Link key={social} href={`/${social}`}  className="rounded-full bg-background p-2 hover:bg-accent">
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
              © {new Date().getFullYear()} SarkariResult.rest - All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>

  );
}