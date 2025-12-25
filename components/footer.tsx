import { Github, Linkedin, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-16 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h3 className="text-lg font-bold font-heading text-slate-900">Day Nguyen</h3>
          <p className="text-slate-400 text-sm mt-1">Building digital experiences.</p>
        </div>
        <div className="flex space-x-6">
          <a
            href="https://www.linkedin.com/in/daynguyen"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-slate-400 hover:text-slate-900 transition-colors p-2 hover:bg-slate-50 rounded-full"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="https://github.com/nduy1234"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-slate-400 hover:text-slate-900 transition-colors p-2 hover:bg-slate-50 rounded-full"
          >
            <Github size={20} />
          </a>
          <a
            href="mailto:nduy1234@gmail.com"
            aria-label="Email"
            className="text-slate-400 hover:text-slate-900 transition-colors p-2 hover:bg-slate-50 rounded-full"
          >
            <Mail size={20} />
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-slate-50 text-center text-slate-400 text-xs">
        © {new Date().getFullYear()} Day Nguyen. All rights reserved.
      </div>
    </footer>
  )
}
