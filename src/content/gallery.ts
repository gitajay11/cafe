import type { ImageAsset } from "../lib/media";

export interface GalleryImage extends ImageAsset {
  caption: string;
  /** Grid spans: 2-column layout below `lg`, 4-column at `lg+`. Both tile with no gaps. */
  span: string;
}

export const gallery: GalleryImage[] = [
  {
    id: "1522992319-0365e5f11656",
    alt: "Coffee being poured into a white cup, steam rising",
    caption: "Espresso",
    span: "col-span-2 row-span-1 lg:row-span-2",
  },
  {
    id: "1447933601403-0c6688de566e",
    alt: "Freshly roasted coffee beans filling the frame",
    caption: "Beans",
    span: "col-span-1 row-span-2 lg:row-span-1",
  },
  {
    id: "1442512595331-e89e73853f31",
    alt: "Barista brewing pour-over coffee behind the bar",
    caption: "Barista",
    span: "col-span-1 row-span-1 lg:row-span-2",
  },
  {
    id: "1493857671505-72967e2e2760",
    alt: "Café interior with a chalkboard menu and bicycle",
    caption: "Interior",
    span: "col-span-1 row-span-1",
  },
  {
    id: "1555507036-ab1f4038808a",
    alt: "Almond croissants dusted with icing sugar",
    caption: "Pastries",
    span: "col-span-2 row-span-1 lg:col-span-1 lg:row-span-2",
  },
  {
    id: "1495474472287-4d71bcdd2085",
    alt: "Two friends toasting with latte cups",
    caption: "Good company",
    span: "col-span-1 row-span-1 lg:col-span-2",
  },
  {
    id: "1541167760496-1628856ab772",
    alt: "Steamed milk poured into a coffee cup",
    caption: "Pouring",
    span: "col-span-1 row-span-2",
  },
  {
    id: "1523942839745-7848c839b661",
    alt: "Close-up of rosetta latte art",
    caption: "Latte art",
    span: "col-span-1 row-span-1 lg:col-span-2",
  },
];
