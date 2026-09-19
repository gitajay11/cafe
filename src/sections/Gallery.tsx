import { gallery } from "../content/gallery";
import { GalleryItem } from "../components/GalleryItem";
import { SectionHeading } from "../components/SectionHeading";

export function Gallery() {
  return (
    <section id="gallery" aria-labelledby="gallery-heading" className="relative py-24 sm:py-32 lg:py-40">
      <div className="container-x">
        <SectionHeading
          id="gallery-heading"
          label="Gallery"
          title={"A little warmth\nin every frame."}
          align="center"
        />

        <div
          className="mt-14 grid auto-rows-[150px] grid-cols-2 gap-3 [grid-auto-flow:dense] sm:auto-rows-[190px] sm:gap-4 lg:auto-rows-[220px] lg:grid-cols-4 lg:gap-5 xl:auto-rows-[250px]">
          {gallery.map((image, index) => (
            <GalleryItem key={image.id} image={image} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
