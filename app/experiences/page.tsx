"use client"

import type React from "react"
import { useState } from "react"
import { Briefcase, Zap, GraduationCap, Heart, Award, Cpu } from "lucide-react"
import type { Experience } from "@/types"

const experiences: Experience[] = [
  {
    id: 1,
    role: "AI Trainer",
    company: "Handshake AI",
    period: "2025 – Present",
    description:
      "Training and refining AI models to ensure high-quality, accurate, and safe outputs. Collaborating with engineering teams to improve model performance through data annotation and feedback loops.",
  },
  {
    id: 2,
    role: "Event Staff",
    company: "Allied Universal",
    period: "2025 – Present",
    description:
      "Ensuring safety and security at large-scale events. Managing crowd control, access points, and providing customer service to attendees to ensure smooth operations.",
  },
  {
    id: 3,
    role: "Product Growth",
    company: "Databricks",
    period: "2022 - 2024",
    description:
      "Drove product adoption and user engagement strategies for data analytics platforms. Analyzed user behavior trends to optimize onboarding flows and feature usage.",
  },
  {
    id: 4,
    role: "Data Analyst",
    company: "County of Los Angeles",
    period: "2020 – 2022",
    description:
      "Conducted complex data analysis to support public health and administrative initiatives. Created visualizations and dashboards to communicate key insights to stakeholders.",
  },
  {
    id: 5,
    role: "Product - Growth Marketing",
    company: "Appen",
    period: "2015 – 2019",
    description:
      "Managed growth marketing campaigns to acquire high-quality data contributors. Optimized conversion funnels and collaborated with product teams to enhance user acquisition strategies.",
  },
]

const educationData = [
  {
    id: 1,
    school: "Harvard University",
    degree: "ALM, Digital Media Design",
    details: "Graduate Certificates: Design & Technology; Web Development",
  },
  {
    id: 2,
    school: "California State University, Los Angeles",
    degree: "EdD, Educational Leadership",
    details: null,
  },
  {
    id: 3,
    school: "University of Vermont",
    degree: "MEd, Education; BA, Business Administration",
    details: null,
  },
]

const volunteeringData = [
  "Foundation Board of Directors Committee",
  "Student Union Board of Directors Committee",
  "University Services Board Committee",
  "Peer Mentoring Program",
  "Ambassador Program",
]

const awardsData = ["National Engagement in Leadership Award", "Service and Leadership Award"]

const skillsData = [
  {
    category: "Marketing & Brand",
    skills: [
      "Campaign Coordination",
      "Content Strategy",
      "Social Media Management",
      "Brand Development",
      "Digital Advertising",
      "Reporting & Insights",
    ],
  },
  {
    category: "Technology",
    skills: [
      "Automation",
      "SQL",
      "AWS",
      "DevOps",
      "CRM Systems",
      "Microsoft 365",
      "Google Workspace",
      "Linux",
      "Git",
      "AI",
      "Zoom",
    ],
  },
  {
    category: "Design & Development",
    skills: [
      "UI/UX Design",
      "Web/App Development",
      "Adobe Creative Suite",
      "Canva",
      "Figma",
      "JavaScript",
      "React",
      "Python",
      "Node",
      "MongoDB",
    ],
  },
  {
    category: "Business & Analysis",
    skills: [
      "Data Visualization",
      "Process Improvement",
      "Project Management",
      "Budget Management",
      "Stakeholder Communication",
      "Salesforce",
      "PeopleSoft",
    ],
  },
]

const ExperienceItem: React.FC<{ exp: Experience }> = ({ exp }) => {
  const [summary, setSummary] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSummarize = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: exp.description }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate summary")
      }

      const { summary: text } = await response.json()
      setSummary(text)
    } catch (error) {
      console.error("Failed to summarize:", error)
      setSummary("Failed to generate summary. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <li className="relative pl-12 md:pl-0 mb-16 last:mb-0 group">
      <div className="md:flex items-start justify-between">
        <div className="absolute left-0 top-1.5 md:left-1/2 md:-ml-[9px] w-[18px] h-[18px] rounded-full bg-white border-4 border-slate-200 group-hover:border-blue-500 group-hover:scale-125 transition-all duration-300 z-10 shadow-sm"></div>

        <div className="hidden md:block w-1/2 pr-16 text-right pt-0.5">
          <time className="text-sm font-bold tracking-widest text-slate-400 uppercase group-hover:text-slate-600 transition-colors">
            {exp.period}
          </time>
        </div>

        <div className="md:hidden mb-1">
          <time className="text-xs font-bold tracking-widest text-slate-400 uppercase">{exp.period}</time>
        </div>

        <div className="md:w-1/2 md:pl-16">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">{exp.role}</h3>
          <p className="text-base md:text-lg text-blue-600 font-medium mb-3">{exp.company}</p>
          <p className="text-slate-600 leading-relaxed text-sm md:text-base">{exp.description}</p>

          <div className="mt-4">
            {!summary && !loading && (
              <button
                onClick={handleSummarize}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                aria-label="Generate AI summary"
              >
                <Zap size={12} className="fill-current" />
                AI Summarize
              </button>
            )}
            {loading && (
              <div className="inline-flex items-center gap-2 text-xs text-slate-400">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                Thinking...
              </div>
            )}
            {summary && (
              <div className="mt-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 text-sm text-slate-700 animate-fade-in-up">
                <span className="font-bold text-blue-700 block mb-1 text-xs uppercase tracking-wide">
                  Gemini Summary
                </span>
                {summary}
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  )
}

export default function Experiences() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in-up">
      <header className="text-center mb-24">
        <h1 className="text-5xl md:text-6xl font-bold font-heading text-slate-900 mb-6">Experience</h1>
        <p className="text-slate-500 text-xl font-light max-w-2xl mx-auto">
          A timeline of my professional journey and academic achievements.
        </p>
      </header>

      <section className="mb-32 max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px bg-slate-200 flex-1"></div>
          <div className="flex items-center gap-2 text-slate-300">
            <GraduationCap size={20} />
            <span className="text-sm font-bold uppercase tracking-widest">Education</span>
          </div>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {educationData.map((edu, i) => (
            <div
              key={edu.id}
              className={`bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col h-full delay-${i * 100}`}
            >
              <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug">{edu.school}</h3>
              <p className="text-slate-600 font-medium mb-4 flex-grow">{edu.degree}</p>
              {edu.details && (
                <p className="text-slate-400 text-xs mt-4 pt-4 border-t border-slate-50">{edu.details}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-32">
        <div className="flex items-center gap-4 mb-16">
          <div className="h-px bg-slate-200 flex-1"></div>
          <div className="flex items-center gap-2 text-slate-300">
            <Briefcase size={20} />
            <span className="text-sm font-bold uppercase tracking-widest">Career</span>
          </div>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="absolute left-[9px] top-0 bottom-0 w-px bg-slate-200 md:left-1/2 md:-ml-px"></div>

          <ul className="space-y-0 p-0 m-0">
            {experiences.map((exp) => (
              <ExperienceItem key={exp.id} exp={exp} />
            ))}
          </ul>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto mb-32">
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-pink-50 text-pink-500 rounded-lg">
              <Heart size={20} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Volunteering</h2>
          </div>
          <div className="space-y-4">
            {volunteeringData.map((role, index) => (
              <div
                key={index}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-pink-200 transition-colors flex items-center group"
              >
                <div className="w-2 h-2 bg-slate-200 rounded-full mr-4 flex-shrink-0 group-hover:bg-pink-400 transition-colors"></div>
                <p className="font-medium text-slate-700">{role}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
              <Award size={20} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Awards</h2>
          </div>
          <div className="space-y-4">
            {awardsData.map((award, index) => (
              <div
                key={index}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-yellow-200 transition-colors flex items-center group"
              >
                <div className="w-2 h-2 bg-slate-200 rounded-full mr-4 flex-shrink-0 group-hover:bg-yellow-500 transition-colors"></div>
                <p className="font-medium text-slate-700">{award}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px bg-slate-200 flex-1"></div>
          <div className="flex items-center gap-2 text-slate-300">
            <Cpu size={20} />
            <span className="text-sm font-bold uppercase tracking-widest">Skills & Tools</span>
          </div>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {skillsData.map((group, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-sm font-medium border border-slate-200/50 hover:bg-white hover:border-blue-200 hover:text-blue-600 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
