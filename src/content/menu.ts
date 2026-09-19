import type { ImageAsset } from "../lib/media";

export interface MenuItem {
  name: string;
  description: string;
  price: string;
  image?: ImageAsset;
  note?: string;
}

export interface MenuCategory {
  id: "coffee" | "signature" | "bakery";
  label: string;
  blurb: string;
  items: MenuItem[];
}

export const menu: MenuCategory[] = [
  {
    id: "coffee",
    label: "Coffee",
    blurb: "Classics, pulled on a rotating single origin.",
    items: [
      {
        name: "Espresso",
        description: "A 30 ml double, syrupy and bright, from this week's single origin.",
        price: "₹180",
        image: { id: "1506619216599-9d16d0903dfd", alt: "A small cup of espresso on a warm beige table" },
      },
      {
        name: "Americano",
        description: "Espresso lengthened with soft water. Clean, cocoa-toned, unhurried.",
        price: "₹200",
        image: { id: "1514432324607-a09d9b4aefdd", alt: "Black coffee with fine crema seen from above" },
      },
      {
        name: "Cappuccino",
        description: "Velvet foam over a double shot. Dusted with cocoa on request.",
        price: "₹240",
        image: { id: "1517256064527-09c73fc73e38", alt: "Cappuccino with cocoa-dusted foam" },
      },
      {
        name: "Flat White",
        description: "Ristretto and silky microfoam in a small cup. Strong, smooth, honest.",
        price: "₹260",
        image: { id: "1485808191679-5f86510681a2", alt: "Flat white with latte art on a blue saucer" },
      },
      {
        name: "Café Latte",
        description: "Our gentlest cup — steamed milk, a whisper of sweetness, plenty of comfort.",
        price: "₹250",
        image: { id: "1544787219-7f47ccb76574", alt: "Milky latte in a white mug beside two cookies" },
      },
      {
        name: "Mocha",
        description: "Single-origin dark chocolate melted into espresso and warm milk.",
        price: "₹280",
        image: { id: "1502462041640-b3d7e50d0662", alt: "Mocha with heart-shaped latte art on dark wood" },
      },
      {
        name: "Cold Brew",
        description: "Steeped 18 hours, served over ice. Mellow, sweet and dangerously easy.",
        price: "₹260",
        image: { id: "1504753793650-d4a2b783c15e", alt: "Tall glass of iced coffee with milk swirling" },
      },
    ],
  },
  {
    id: "signature",
    label: "Signature",
    blurb: "House recipes you won't find anywhere else.",
    items: [
      {
        name: "Smoked Caramel Latte",
        description: "House caramel, smoked over oak, folded into a double shot and steamed milk.",
        price: "₹320",
        image: { id: "1534778101976-62847782c213", alt: "Latte with layered art in a ceramic cup" },
        note: "House favourite",
      },
      {
        name: "Vanilla Bean Cloud",
        description: "Espresso beneath a slow-poured cloud of vanilla-bean cold foam.",
        price: "₹330",
        image: { id: "1541167760496-1628856ab772", alt: "Milk being poured into a coffee cup" },
      },
      {
        name: "Hazelnut Espresso",
        description: "A double shot with toasted hazelnut and a touch of raw sugar. Small, intense.",
        price: "₹300",
        image: { id: "1510591509098-f4fdc6d0ff04", alt: "Espresso shot with thick crema seen from above" },
      },
      {
        name: "Cinnamon Cream Cold Brew",
        description: "Our 18-hour cold brew under sweet cinnamon cream. Best on a warm afternoon.",
        price: "₹340",
        image: { id: "1461023058943-07fcbe16d735", alt: "Iced coffee with cream cascading into the glass" },
      },
    ],
  },
  {
    id: "bakery",
    label: "Bakery",
    blurb: "Baked before sunrise, gone by noon.",
    items: [
      {
        name: "Butter Croissant",
        description: "Laminated for three days with cultured butter. Shatteringly crisp.",
        price: "₹160",
        image: { id: "1530610476181-d83430b64dcd", alt: "Golden butter croissants on a tray" },
      },
      {
        name: "Almond Croissant",
        description: "Twice-baked with frangipane, flaked almonds and a snowfall of sugar.",
        price: "₹190",
        image: { id: "1555507036-ab1f4038808a", alt: "Almond croissants dusted with icing sugar" },
      },
      {
        name: "Chocolate Danish",
        description: "Dark chocolate wrapped in flaky pastry, finished with sea salt.",
        price: "₹200",
        image: { id: "1509365465985-25d11c17e812", alt: "Chocolate pastry swirls dusted with sugar" },
      },
      {
        name: "Banana Bread",
        description: "Dense, dark, and made with very ripe bananas. Toasted, with salted butter.",
        price: "₹180",
        image: { id: "1606101273945-e9eba91c0dc4", alt: "Sliced banana bread with pecans" },
      },
    ],
  },
];
