"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { MapPin } from "lucide-react";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { APP_NAME } from "@/config/site";
import { PHOTOS, type Photo } from "@/content/images";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Tile = { photo: Photo; shape: "portrait" | "landscape" };

const ROW_ONE: Tile[] = [
  { photo: PHOTOS.cinqueTerre, shape: "portrait" },
  { photo: PHOTOS.rothenburg, shape: "landscape" },
  { photo: PHOTOS.bangkok, shape: "landscape" },
  { photo: PHOTOS.santorini, shape: "portrait" },
  { photo: PHOTOS.dinant, shape: "landscape" },
];

const ROW_TWO: Tile[] = [
  { photo: PHOTOS.dubai, shape: "landscape" },
  { photo: PHOTOS.rialto, shape: "portrait" },
  { photo: PHOTOS.venice, shape: "landscape" },
  { photo: PHOTOS.prague, shape: "landscape" },
  { photo: PHOTOS.hongKong, shape: "landscape" },
];

/**
 * Two rows of city photography that slide in opposite directions as the
 * section scrolls through the viewport.
 */
export function Showcase() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rowOneX = useTransform(scrollYProgress, [0, 1], ["4%", "-18%"]);
  const rowTwoX = useTransform(scrollYProgress, [0, 1], ["-22%", "0%"]);

  return (
    <section ref={ref} aria-labelledby="showcase-title" className="overflow-hidden py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Around the world"
          title="Built for teams in every city."
          description={`From Venice to Bangkok, ${APP_NAME} powers the teams designing, building and running the places we love.`}
        />
      </Container>

      <div className="mt-16 space-y-4 sm:space-y-6">
        <GalleryRow tiles={ROW_ONE} x={reduceMotion ? undefined : rowOneX} />
        <GalleryRow tiles={ROW_TWO} x={reduceMotion ? undefined : rowTwoX} />
      </div>
    </section>
  );
}

function GalleryRow({ tiles, x }: { tiles: Tile[]; x?: MotionValue<string> }) {
  return (
    <motion.ul style={{ x }} className="flex w-max gap-4 px-4 will-change-transform sm:gap-6">
      {tiles.map((tile, i) => (
        <GalleryTile key={tile.photo.alt} tile={tile} index={i} />
      ))}
    </motion.ul>
  );
}

function GalleryTile({ tile, index }: { tile: Tile; index: number }) {
  const { photo, shape } = tile;

  return (
    <motion.li
      data-cursor={photo.city}
      initial={{ opacity: 0, clipPath: "inset(12% 12% 12% 12% round 24px)" }}
      whileInView={{ opacity: 1, clipPath: "inset(0% 0% 0% 0% round 24px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1, delay: index * 0.08, ease: EASE.out }}
      className={cn(
        "group relative h-56 shrink-0 overflow-hidden rounded-3xl bg-muted sm:h-80",
        shape === "portrait" ? "w-44 sm:w-60" : "w-80 sm:w-[30rem]",
      )}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        placeholder="blur"
        sizes={shape === "portrait" ? "(min-width: 640px) 240px, 176px" : "(min-width: 640px) 480px, 320px"}
        className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 text-white sm:p-5">
        <div className="translate-y-1 transition-transform duration-500 group-hover:translate-y-0">
          <p className="text-base font-semibold tracking-tight sm:text-lg">{photo.city}</p>
          <p className="flex items-center gap-1 text-xs text-white/75">
            <MapPin className="size-3" aria-hidden /> {photo.country}
          </p>
        </div>
      </div>
    </motion.li>
  );
}
