"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type ToolCardProps = {
  title: string;
  description: string;
  href: string;
  accent: string;
  delay?: number;
};

export function ToolCard({ title, description, href, accent, delay = 0 }: ToolCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay }}>
      <Link
        href={href}
        className="group glass block rounded-3xl p-6 shadow-glow transition duration-300 hover:-translate-y-1 hover:border-sky-400/30"
      >
        <div className={`mb-5 h-12 w-12 rounded-2xl bg-gradient-to-br ${accent} opacity-90`} />
        <h3 className="text-xl font-semibold text-slate-100">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>
        <div className="mt-6 text-sm font-medium text-sky-300 transition group-hover:translate-x-1">
          Open tool →
        </div>
      </Link>
    </motion.div>
  );
}
