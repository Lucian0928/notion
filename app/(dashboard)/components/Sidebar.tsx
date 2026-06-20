"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/finance",
    label: "Overview",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z"
      />
    ),
  },
  {
    href: "/analysis",
    label: "Analysis",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm6 0V9a2 2 0 00-2-2h-2a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2zm6 0V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v14a2 2 0 002 2h2a2 2 0 002-2z"
      />
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen border-r border-white/5 p-6 flex flex-col justify-between sticky top-0 shrink-0 z-10 bg-[#08080a]/60 backdrop-blur-xl">
      <nav className="space-y-2 mt-4">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                active
                  ? "flex items-center gap-3 px-4 py-3 rounded-xl bg-[#141417]/80 text-brand border border-white/5 font-semibold shadow-[0_0_10px_rgba(255,122,0,0.02)]"
                  : "flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-500 hover:bg-white/5 transition-all duration-200"
              }
            >
              <svg
                className={`w-5 h-5 ${active ? "text-brand" : "text-neutral-500"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {item.icon}
              </svg>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
