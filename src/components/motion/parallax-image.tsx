"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import type { Photo } from "@/content/images";
import { cn } from "@/lib/utils";

type ParallaxImageProps = {
  photo: Photo;
  /** How far (in %) the image drifts inside its frame while scrolling. */
  strength?: number;
  sizes: string;
  className?: string;
  imageClassName?: string;
  preload?: boolean;
};

/** An image that drifts slightly slower than the page, inside a clipped frame. */
export function ParallaxImage({ photo, strength = 12, sizes, className, imageClassName, preload }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div className="absolute -inset-y-[15%] inset-x-0" style={{ y: reduceMotion ? 0 : y }}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={sizes}
          placeholder="blur"
          preload={preload}
          className={cn("object-cover", imageClassName)}
        />
      </motion.div>
    </div>
  );
}
