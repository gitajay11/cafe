import type { ImageAsset } from "../lib/media";

export interface ProcessStage {
  number: string;
  title: string;
  description: string;
  image: ImageAsset;
}

export const process: ProcessStage[] = [
  {
    number: "01",
    title: "Source",
    description:
      "We buy directly from small farms in Coorg, Chikmagalur and the Nilgiris — growers we know by name, paid well above market for lots we taste before they leave the estate.",
    image: { id: "1524350876685-274059332603", alt: "Green coffee beans spilling from a burlap sack" },
  },
  {
    number: "02",
    title: "Roast",
    description:
      "Small batches, roasted a few kilometres from the counter, developed to let each origin speak — never past the point where the farm disappears behind the roast.",
    image: { id: "1447933601403-0c6688de566e", alt: "Freshly roasted coffee beans" },
  },
  {
    number: "03",
    title: "Grind",
    description:
      "Rested for a week, then ground to order, seconds before it meets water. Nothing sits in a hopper. Nothing waits.",
    image: { id: "1497935586351-b67a49e012bf", alt: "A portafilter filled with freshly ground coffee" },
  },
  {
    number: "04",
    title: "Brew",
    description:
      "Nine bars, twenty-eight seconds, water measured to the gram. Or a slow pour-over if the bean asks for patience. We let the coffee decide.",
    image: { id: "1522992319-0365e5f11656", alt: "Coffee streaming into a white cup with rising steam" },
  },
  {
    number: "05",
    title: "Serve",
    description:
      "Steamed milk poured by hand, a warm cup, your name on the order. The last step is the one we care about most — it's where the coffee becomes yours.",
    image: { id: "1509042239860-f550ce710b93", alt: "Latte with rosetta art on a wooden counter" },
  },
];
