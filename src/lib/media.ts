/**
 * Placeholder imagery is served from Unsplash. Swap `unsplash()` for your
 * own CDN/asset pipeline when real photography is available — every image
 * on the site is referenced by an `ImageAsset` so the change is one place.
 */
export interface ImageAsset {
  /** Unsplash photo id (the part after `photo-`). */
  id: string;
  /** Meaningful alt text — describe the subject, not the styling. */
  alt: string;
  /** Native width ÷ height. Lets layouts fit the photo instead of cropping it. */
  ratio?: number;
}

export const unsplash = (id: string, width: number, extra = ""): string =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=75&w=${width}${extra}`;

export const srcSet = (id: string, widths: readonly number[] = [480, 768, 1080, 1400]): string =>
  widths.map((w) => `${unsplash(id, w)} ${w}w`).join(", ");

/** Free-to-use placeholder clips (Mixkit). Replace with brand footage. */
export const VIDEO = {
  espressoExtraction: "https://assets.mixkit.co/videos/41865/41865-720.mp4",
  steamingCup: "https://assets.mixkit.co/videos/43935/43935-720.mp4",
  lattePour: "https://assets.mixkit.co/videos/41858/41858-720.mp4",
} as const;

export const cn = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(" ");
