"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type Project = {
  number: string;
  title: string;
  description: string;
  href: string;
  accent: string;
  links?: Array<{ label: string; href: string }>;
};

export function HomeProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project, index) => (
        <motion.div
          key={project.title}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.08 }}
          className="glass rounded-3xl p-6 shadow-glow"
        >
          <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${project.accent} text-base font-semibold text-slate-950`}>
            {project.number}
          </div>
          <h2 className="text-2xl font-semibold text-white">{project.title}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">{project.description}</p>

          {project.links ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {project.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-slate-700 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-sky-400 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ) : null}

          <Link
            href={project.href}
            className="mt-6 inline-flex rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-sky-300 transition hover:border-sky-400 hover:text-white"
          >
            Open project →
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
