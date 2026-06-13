"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export const stagger = (i: number) => ({ delay: i * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] as const });

export function FadeUp({
  children,
  className,
  delay = 0,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function Pressable({
  children,
  className,
  ...props
}: HTMLMotionProps<"button">) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={cn("cursor-pointer", className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function PulseDot({ className }: { className?: string }) {
  return (
    <span className={cn("relative flex h-2 w-2", className)}>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-60" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
    </span>
  );
}
