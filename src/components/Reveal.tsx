"use client";

import React, { useEffect, useRef, useState } from "react";

function useInViewOnce(margin = "-40px") {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin: margin, threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [margin]);

  return { ref, visible };
}

export function HeadingReveal({
  children,
  className = "",
  delayMs = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const { ref, visible } = useInViewOnce("-40px");
  return (
    <div
      ref={ref}
      className={`or-reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}

export function ScrollTextReveal({
  text,
  emphasisWord,
}: {
  text: string;
  emphasisWord?: string;
}) {
  const { ref, visible } = useInViewOnce("-40px");
  const words = text.split(" ");

  return (
    <span ref={ref} className={`or-statement-words ${visible ? "is-visible" : ""}`}>
      {words.map((word, index) => {
        const clean = word.replace(/[.,—–]/g, "");
        const isEm =
          emphasisWord &&
          emphasisWord
            .toLowerCase()
            .split(" ")
            .includes(clean.toLowerCase());
        return (
          <span
            key={`${word}-${index}`}
            className={`or-word ${isEm ? "or-word-accent" : ""}`}
            style={{ transitionDelay: `${Math.min(index * 16, 380)}ms` }}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
}
