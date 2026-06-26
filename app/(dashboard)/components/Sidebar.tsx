"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
  const activeIndex = navItems.findIndex((item) => item.href === pathname);

  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const prevIndexRef = useRef(activeIndex);

  const [pillTranslateY, setPillTranslateY] = useState(0);
  const [pillHeight, setPillHeight] = useState(0);
  const [pillReady, setPillReady] = useState(false);

  // Measure the active link's position relative to the nav so the pill sits
  // exactly behind it regardless of font-size, line-height, or gap values.
  useEffect(() => {
    if (!navRef.current) return;
    const links = navRef.current.querySelectorAll<HTMLElement>("a");
    if (activeIndex >= 0 && links[activeIndex]) {
      const navTop = navRef.current.getBoundingClientRect().top;
      const linkRect = links[activeIndex].getBoundingClientRect();
      setPillTranslateY(linkRect.top - navTop);
      setPillHeight(linkRect.height);
      setPillReady(true);
    } else {
      setPillReady(false);
    }
  }, [activeIndex]);

  // Restart the squish keyframe each time the active item changes.
  useEffect(() => {
    if (!pillRef.current || activeIndex === prevIndexRef.current) return;
    prevIndexRef.current = activeIndex;
    const el = pillRef.current;
    el.classList.remove("nav-pill-squish");
    void el.offsetWidth; // force reflow to restart animation
    el.classList.add("nav-pill-squish");
  }, [activeIndex]);

  return (
    <aside className="w-64 h-screen p-6 flex flex-col justify-between sticky top-0 shrink-0 z-10 sidebar-glass">
      <nav ref={navRef} className="space-y-2 mt-4 relative">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                active
                  ? "relative z-10 flex items-center gap-3 px-4 py-3 rounded-xl text-white font-semibold"
                  : "relative z-10 flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-500 hover:bg-[rgba(255,255,255,0.04)] transition-colors duration-200"
              }
            >
              <svg
                className={`w-5 h-5 ${active ? "text-white" : "text-neutral-500"}`}
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

        {/* Shared sliding glass pill — rendered last so links sit above it via z-10 */}
        {pillReady && (
          <div
            ref={pillRef}
            className="absolute inset-x-0 z-0 rounded-xl nav-item-active-glass nav-pill-slide"
            style={{
              height: pillHeight,
              transform: `translateY(${pillTranslateY}px)`,
            }}
          />
        )}
      </nav>
    </aside>
  );
}
