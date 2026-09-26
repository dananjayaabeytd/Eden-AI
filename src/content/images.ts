/**
 * Photography registry. Static imports give next/image intrinsic sizes and
 * blur placeholders at build time. Photos are from Unsplash (Unsplash License).
 */
import type { StaticImageData } from "next/image";

import bangkok from "@/assets/architecture/bangkok.jpg";
import cinqueTerre from "@/assets/architecture/cinque-terre.jpg";
import dinant from "@/assets/architecture/dinant.jpg";
import dubai from "@/assets/architecture/dubai.jpg";
import hongKong from "@/assets/architecture/hong-kong.jpg";
import newYork from "@/assets/architecture/new-york.jpg";
import prague from "@/assets/architecture/prague.jpg";
import rialto from "@/assets/architecture/rialto.jpg";
import rothenburg from "@/assets/architecture/rothenburg.jpg";
import santorini from "@/assets/architecture/santorini.jpg";
import venice from "@/assets/architecture/venice.jpg";

export type Photo = {
  src: StaticImageData;
  alt: string;
  city: string;
  country: string;
};

export const PHOTOS = {
  cinqueTerre: { src: cinqueTerre, alt: "Pastel houses stacked on the cliffs of Manarola", city: "Cinque Terre", country: "Italy" },
  rothenburg: { src: rothenburg, alt: "Half-timbered houses and a clock tower on a cobbled street", city: "Rothenburg", country: "Germany" },
  bangkok: { src: bangkok, alt: "Neon signs and tuk-tuks on a rainy night street", city: "Bangkok", country: "Thailand" },
  dinant: { src: dinant, alt: "Colourful riverside buildings reflected in calm water", city: "Dinant", country: "Belgium" },
  prague: { src: prague, alt: "Green domes and red rooftops across the old town", city: "Prague", country: "Czechia" },
  dubai: { src: dubai, alt: "Skyscrapers and highways glowing at sunrise", city: "Dubai", country: "UAE" },
  venice: { src: venice, alt: "Pastel palazzi lining the Grand Canal at dusk", city: "Venice", country: "Italy" },
  hongKong: { src: hongKong, alt: "Dense skyline and harbour under a vivid sunset", city: "Hong Kong", country: "China" },
  santorini: { src: santorini, alt: "Whitewashed stairs overlooking a deep blue sea", city: "Santorini", country: "Greece" },
  newYork: { src: newYork, alt: "Manhattan skyline at dusk with pink and blue sky", city: "New York", country: "USA" },
  rialto: { src: rialto, alt: "Gondola passing the Rialto Bridge", city: "Venice", country: "Italy" },
} satisfies Record<string, Photo>;
