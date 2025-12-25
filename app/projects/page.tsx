"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import type { Project } from "@/types"
import { ArrowUpRight, Github } from "lucide-react"

const projectsData: Project[] = [
  {
    id: 4,
    title: "BrandAI",
    description: "Project creating engaging content and materials for digital learning experiences",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    tags: ["Content Creation", "Digital Learning", "AI"],
    repoUrl: "https://github.com/nduy1234/BrandAI",
    linkText: "Link",
    hideRepoIcon: true,
  },
  {
    id: 5,
    title: "My Healthcare App",
    description: "Project featuring a modern application interface design for healthcare appointments",
    image: "/images/healthcare-app.jpg",
    tags: ["UI/UX Design", "Healthcare", "Framer"],
    repoUrl: "https://github.com/nduy1234/AvaAI",
    linkText: "Link",
    hideRepoIcon: true,
  },
  {
    id: 6,
    title: "A Dance Lesson",
    description: "Project exploring innovative practices for digital storytelling and media techniques",
    image: "/images/line-dancing.jpg",
    tags: ["Digital Storytelling", "Media", "Video"],
    repoUrl: "https://youtu.be/ap32odJSwmY",
    linkText: "Link",
    hideRepoIcon: true,
  },
  {
    id: 7,
    title: "Exploring Tech Startups Hiring",
    description: "Project analyzing tech startup hiring trends using both relational and NoSQL database systems",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    tags: ["Data Analysis", "SQL", "NoSQL"],
    repoUrl: "https://youtu.be/l2uJ8AWFwkY",
    linkText: "Link",
    hideRepoIcon: true,
  },
  {
    id: 8,
    title: "Supporting Students with Disabilities",
    description: "Project creating accessible educational content and inclusive learning experiences",
    image: "/images/inclusive-learning.jpg",
    tags: ["Accessibility", "Inclusive Design", "Education"],
    repoUrl: "https://day.talentlms.com/plus/my/courses/126/units/2092/preview",
    linkText: "Link",
    hideRepoIcon: true,
  },
  {
    id: 9,
    title: "Lucky Restaurant",
    description: "A restaurant web showcasing fundamental web development skills with modern design and functionality",
    image: "/images/restaurant-website.jpg",
    tags: ["Web Development", "Design", "Restaurant"],
    repoUrl: "https://github.com/cscie12/final-project-nduy1234.git",
    linkText: "Link",
    hideRepoIcon: true,
  },
  {
    id: 10,
    title: "Fancy Salon",
    description: "Web app for salon management with booking system and customer management features",
    image: "/images/hair-salon.jpg",
    tags: ["Web App", "Booking System", "Management"],
    repoUrl: "https://github.com/HarvardDCENode/assignment7-final-nduy1234",
    linkText: "Link",
    hideRepoIcon: true,
  },
  {
    id: 11,
    title: "My Film List",
    description: "Web app for movie tracking and recommendations built with modern static site technologies",
    image: "/images/movie-theater.jpg",
    tags: ["Web App", "Static Site", "Movies"],
    repoUrl: "https://github.com/cscie114/csci-e-114-final-project-nduy1234.git",
    linkText: "Link",
    hideRepoIcon: true,
  },
  {
    id: 12,
    title: "My Favorite Seasons",
    description: "Project showcasing seasonal themes through creative visual storytelling",
    image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80",
    tags: ["Visual Storytelling", "Video", "Creative"],
    repoUrl: "https://vimeo.com/995440119/bd5ac7b72b?share=copy",
    linkText: "Link",
    hideRepoIcon: true,
  },
  {
    id: 13,
    title: "Connect",
    description:
      "Capstone project designed to help new startups network, collaborate, showcase projects, message others, and build meaningful connections to support early-stage growth",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    tags: ["Networking", "Startups", "Collaboration"],
    repoUrl: "https://github.com/nduy1234/connectapp",
    linkText: "Link",
    hideRepoIcon: true,
  },
  {
    id: 14,
    title: "Dissertation",
    description: "The Impact of Undergraduate Research Experience on Performance of Graduate Students in STEM",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80",
    tags: ["Research", "STEM", "Education"],
    repoUrl: "https://www.calstatela.edu/library",
    linkText: "Link",
    hideRepoIcon: true,
  },
  {
    id: 15,
    title: "Thesis",
    description: "My Story as a First-Generation Student from Vietnamese Immigrant Background",
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80",
    tags: ["Research", "Autoethnography", "Education"],
    repoUrl: "https://libraries.uvm.edu/home",
    linkText: "Link",
    hideRepoIcon: true,
  },
]

const useIntersectionObserver = (options = {}) => {
  const elementRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.disconnect()
      }
    }, options)

    const el = elementRef.current
    if (el) observer.observe(el)

    return () => {
      if (el) observer.unobserve(el)
    }
  }, [options])

  return [elementRef, isVisible] as const
}

interface ProjectCardProps {
  project: Project
  index: number
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const [titleRef, isTitleVisible] = useIntersectionObserver({ threshold: 0.1 })

  return (
    <article
      className={`flex flex-col md:flex-row gap-16 items-center ${index % 2 !== 0 ? "md:flex-row-reverse" : ""} group`}
      aria-labelledby={`project-title-${project.id}`}
    >
      <div className="w-full md:w-7/12 relative overflow-hidden rounded-[2rem] shadow-xl shadow-slate-200 transition-all duration-500 ease-out group-hover:shadow-2xl group-hover:shadow-blue-900/10 group-hover:-translate-y-2">
        <div className="aspect-video bg-slate-100 relative overflow-hidden group/image">
          <img
            src={project.image || "/placeholder.svg"}
            alt={`Screenshot of ${project.title}`}
            className="w-full h-full object-cover transform transition-transform duration-700 ease-in-out group-hover/image:scale-105"
          />
          <div
            className="absolute inset-0 bg-slate-900/0 group-hover/image:bg-slate-900/5 transition-colors duration-500"
            aria-hidden="true"
          ></div>
        </div>
      </div>

      <div className="w-full md:w-5/12 space-y-6">
        <div className="flex flex-col items-start">
          <span
            className="text-6xl font-bold text-slate-100 -mb-8 -ml-4 select-none z-0 relative transition-colors duration-500 group-hover:text-slate-200"
            aria-hidden="true"
          >
            {(index + 1).toString().padStart(2, "0")}
          </span>
          <h2
            id={`project-title-${project.id}`}
            ref={titleRef as React.RefObject<HTMLHeadingElement>}
            className={`text-3xl md:text-4xl font-bold text-slate-900 relative z-10 transition-all duration-1000 ease-out transform ${
              isTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            } group-hover:text-blue-600`}
          >
            {project.title}
          </h2>
        </div>

        <p className="text-slate-600 leading-relaxed text-lg">{project.description}</p>

        <ul className="flex flex-wrap gap-2 pt-2" aria-label={`Technologies used in ${project.title}`}>
          {project.tags.map((tag) => (
            <li key={tag}>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold tracking-wide uppercase border border-slate-200">
                {tag}
              </span>
            </li>
          ))}
        </ul>

        <div className="pt-6 flex flex-wrap gap-4 items-center">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-900 font-bold hover:text-blue-600 transition-colors group/btn focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-2 py-1 -ml-2"
              aria-label={`Live Demo for ${project.title} (opens in new tab)`}
            >
              Live Demo
              <ArrowUpRight
                size={20}
                className="transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform"
                aria-hidden="true"
              />
            </a>
          )}

          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-500 font-medium hover:text-slate-900 transition-colors mr-4 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 rounded-lg px-2 py-1"
              aria-label={`Source Code for ${project.title} (opens in new tab)`}
            >
              {!project.hideRepoIcon && <Github size={18} aria-hidden="true" />}
              {project.linkText || "Source Code"}
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(projectsData)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <header className="mb-20 animate-fade-in-up">
        <h1 className="text-5xl md:text-6xl font-bold font-heading text-slate-900 mb-6">Projects</h1>
        <p className="text-slate-500 text-xl font-light max-w-2xl">Selected works and creative experiments</p>
      </header>

      <section className="space-y-32" aria-label="Project List">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </section>
    </div>
  )
}
