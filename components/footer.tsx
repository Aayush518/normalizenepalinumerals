import { Github, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} नेपाली संख्या रूपान्तरक - सिर्जनाकर्ता: आयुष अधिकारी
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Aayush518"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-4 w-4" />
              गिटहब
            </a>
            <a
              href="https://www.linkedin.com/in/aayush518"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="h-4 w-4" />
              लिंक्डइन
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}