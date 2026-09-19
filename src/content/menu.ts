import type { ImageAsset } from "../lib/media";

/**
 * Approximate per-serving values. PLACEHOLDER — replace with figures from
 * your actual recipes before publishing.
 */
export interface Nutrition {
  kcal: number;
  /** mg */
  caffeine: number;
  /** g */
  protein: number;
  /** g */
  sugar: number;
  /** g */
  fat: number;
}

export interface MenuItem {
  name: string;
  description: string;
  price: string;
  image?: ImageAsset;
  note?: string;
  serving: string;
  nutrition: Nutrition;
  /** Short, modest wellness notes — no medical claims. */
  benefits: string[];
  /** Dietary tags shown as pills. */
  tags: string[];
  allergens: string[];
}

export interface MenuCategory {
  id: "coffee" | "signature" | "bakery";
  label: string;
  blurb: string;
  items: MenuItem[];
}

const MILK_NOTE = "Made with whole milk — oat or almond on request.";

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
        serving: "Double shot · 60 ml",
        nutrition: { kcal: 5, caffeine: 126, protein: 0.3, sugar: 0, fat: 0 },
        benefits: [
          "Naturally rich in antioxidants (chlorogenic acids)",
          "Sharpens focus and alertness within 20 minutes",
          "Virtually calorie- and sugar-free",
          "Source of magnesium and vitamin B3",
        ],
        tags: ["Vegan", "Sugar-free", "Dairy-free"],
        allergens: [],
      },
      {
        name: "Americano",
        description: "Espresso lengthened with soft water. Clean, cocoa-toned, unhurried.",
        price: "₹200",
        image: { id: "1514432324607-a09d9b4aefdd", alt: "Black coffee with fine crema seen from above" },
        serving: "240 ml",
        nutrition: { kcal: 10, caffeine: 126, protein: 0.5, sugar: 0, fat: 0 },
        benefits: [
          "Hydrating — mostly water, all the flavour",
          "Antioxidant-rich with zero added sugar",
          "Gentler on the stomach than straight espresso",
          "Steady, long-lasting energy",
        ],
        tags: ["Vegan", "Sugar-free", "Dairy-free"],
        allergens: [],
      },
      {
        name: "Cappuccino",
        description: "Velvet foam over a double shot. Dusted with cocoa on request.",
        price: "₹240",
        image: { id: "1517256064527-09c73fc73e38", alt: "Cappuccino with cocoa-dusted foam" },
        serving: "180 ml",
        nutrition: { kcal: 120, caffeine: 126, protein: 6, sugar: 9, fat: 6 },
        benefits: [
          "Calcium and protein from steamed milk",
          "Vitamin B12 for energy and nerve health",
          "Natural milk sugars only — nothing added",
          "A balanced, satisfying morning cup",
        ],
        tags: ["Vegetarian", "No added sugar"],
        allergens: ["Milk"],
      },
      {
        name: "Flat White",
        description: "Ristretto and silky microfoam in a small cup. Strong, smooth, honest.",
        price: "₹260",
        image: { id: "1485808191679-5f86510681a2", alt: "Flat white with latte art on a blue saucer" },
        serving: "160 ml",
        nutrition: { kcal: 140, caffeine: 130, protein: 7, sugar: 10, fat: 7 },
        benefits: [
          "High coffee-to-milk ratio — more antioxidants per sip",
          "Protein and calcium from whole milk",
          "Less foam, so it's easy on the stomach",
          MILK_NOTE,
        ],
        tags: ["Vegetarian", "No added sugar"],
        allergens: ["Milk"],
      },
      {
        name: "Café Latte",
        description: "Our gentlest cup — steamed milk, a whisper of sweetness, plenty of comfort.",
        price: "₹250",
        image: { id: "1544787219-7f47ccb76574", alt: "Milky latte in a white mug beside two cookies" },
        serving: "300 ml",
        nutrition: { kcal: 190, caffeine: 126, protein: 10, sugar: 15, fat: 9 },
        benefits: [
          "10 g of protein — a light breakfast in a cup",
          "Rich in calcium, potassium and vitamin D",
          "Milder caffeine hit, thanks to the milk",
          MILK_NOTE,
        ],
        tags: ["Vegetarian"],
        allergens: ["Milk"],
      },
      {
        name: "Mocha",
        description: "Single-origin dark chocolate melted into espresso and warm milk.",
        price: "₹280",
        image: { id: "1502462041640-b3d7e50d0662", alt: "Mocha with heart-shaped latte art on dark wood" },
        serving: "300 ml",
        nutrition: { kcal: 290, caffeine: 140, protein: 10, sugar: 27, fat: 12 },
        benefits: [
          "Cocoa flavanols support healthy circulation",
          "Iron and magnesium from 70% dark chocolate",
          "A gentle, mood-lifting treat",
          "Calcium and protein from steamed milk",
        ],
        tags: ["Vegetarian"],
        allergens: ["Milk", "Soy"],
      },
      {
        name: "Cold Brew",
        description: "Steeped 18 hours, served over ice. Mellow, sweet and dangerously easy.",
        price: "₹260",
        image: { id: "1504753793650-d4a2b783c15e", alt: "Tall glass of iced coffee with milk swirling" },
        serving: "350 ml",
        nutrition: { kcal: 5, caffeine: 200, protein: 0, sugar: 0, fat: 0 },
        benefits: [
          "Up to 60% less acidity than hot coffee",
          "Smooth on sensitive stomachs",
          "Our most caffeinated cup — sip slowly",
          "Hydrating and sugar-free over ice",
        ],
        tags: ["Vegan", "Sugar-free", "Dairy-free"],
        allergens: [],
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
        serving: "300 ml",
        nutrition: { kcal: 260, caffeine: 126, protein: 9, sugar: 26, fat: 9 },
        benefits: [
          "House caramel made from cane sugar and cream — no syrups",
          "Protein and calcium from steamed milk",
          "Slow-release energy from the milk-and-espresso pairing",
          MILK_NOTE,
        ],
        tags: ["Vegetarian"],
        allergens: ["Milk"],
      },
      {
        name: "Vanilla Bean Cloud",
        description: "Espresso beneath a slow-poured cloud of vanilla-bean cold foam.",
        price: "₹330",
        image: { id: "1541167760496-1628856ab772", alt: "Milk being poured into a coffee cup" },
        serving: "240 ml",
        nutrition: { kcal: 150, caffeine: 126, protein: 4, sugar: 14, fat: 6 },
        benefits: [
          "Real vanilla bean — naturally calming aroma",
          "Lighter than a latte: foam, not a full pour of milk",
          "Antioxidants from a fresh double shot",
          "Available with oat milk foam",
        ],
        tags: ["Vegetarian"],
        allergens: ["Milk"],
      },
      {
        name: "Hazelnut Espresso",
        description: "A double shot with toasted hazelnut and a touch of raw sugar. Small, intense.",
        price: "₹300",
        image: { id: "1510591509098-f4fdc6d0ff04", alt: "Espresso shot with thick crema seen from above" },
        serving: "90 ml",
        nutrition: { kcal: 60, caffeine: 126, protein: 1, sugar: 9, fat: 2 },
        benefits: [
          "Hazelnuts bring vitamin E and healthy fats",
          "Low-calorie way to enjoy a sweeter espresso",
          "Antioxidants from both the coffee and the nuts",
          "Dairy-free",
        ],
        tags: ["Vegan", "Dairy-free"],
        allergens: ["Tree nuts"],
      },
      {
        name: "Cinnamon Cream Cold Brew",
        description: "Our 18-hour cold brew under sweet cinnamon cream. Best on a warm afternoon.",
        price: "₹340",
        image: { id: "1461023058943-07fcbe16d735", alt: "Iced coffee with cream cascading into the glass" },
        serving: "350 ml",
        nutrition: { kcal: 140, caffeine: 200, protein: 2, sugar: 12, fat: 8 },
        benefits: [
          "Ceylon cinnamon is traditionally used to support steady blood sugar",
          "Low-acid cold brew base",
          "Anti-inflammatory spice, real cream — nothing artificial",
          "Refreshing and hydrating over ice",
        ],
        tags: ["Vegetarian"],
        allergens: ["Milk"],
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
        serving: "1 piece · 70 g",
        nutrition: { kcal: 270, caffeine: 0, protein: 5, sugar: 5, fat: 15 },
        benefits: [
          "Quick, clean energy from slow-fermented dough",
          "Cultured butter — no margarine, no additives",
          "B vitamins from stone-milled flour",
          "Naturally low in sugar for a pastry",
        ],
        tags: ["Vegetarian"],
        allergens: ["Gluten", "Milk", "Egg"],
      },
      {
        name: "Almond Croissant",
        description: "Twice-baked with frangipane, flaked almonds and a snowfall of sugar.",
        price: "₹190",
        image: { id: "1555507036-ab1f4038808a", alt: "Almond croissants dusted with icing sugar" },
        serving: "1 piece · 110 g",
        nutrition: { kcal: 400, caffeine: 0, protein: 9, sugar: 18, fat: 22 },
        benefits: [
          "Almonds: vitamin E, magnesium and plant protein",
          "Healthy monounsaturated fats",
          "9 g of protein — more filling than it looks",
          "Real frangipane, made in-house each morning",
        ],
        tags: ["Vegetarian"],
        allergens: ["Gluten", "Milk", "Egg", "Tree nuts"],
      },
      {
        name: "Chocolate Danish",
        description: "Dark chocolate wrapped in flaky pastry, finished with sea salt.",
        price: "₹200",
        image: { id: "1509365465985-25d11c17e812", alt: "Chocolate pastry swirls dusted with sugar" },
        serving: "1 piece · 95 g",
        nutrition: { kcal: 330, caffeine: 10, protein: 6, sugar: 17, fat: 18 },
        benefits: [
          "70% dark chocolate — flavanols and a little iron",
          "Sea salt finish means less sugar is needed",
          "Slow-fermented dough for easier digestion",
          "Pairs with an Americano for a balanced bite",
        ],
        tags: ["Vegetarian"],
        allergens: ["Gluten", "Milk", "Egg", "Soy"],
      },
      {
        name: "Banana Bread",
        description: "Dense, dark, and made with very ripe bananas. Toasted, with salted butter.",
        price: "₹180",
        image: { id: "1606101273945-e9eba91c0dc4", alt: "Sliced banana bread with pecans" },
        serving: "1 slice · 90 g",
        nutrition: { kcal: 300, caffeine: 0, protein: 5, sugar: 22, fat: 11 },
        benefits: [
          "Potassium and vitamin B6 from ripe bananas",
          "Fibre from whole-wheat flour",
          "Pecans add healthy fats and a little zinc",
          "Sweetened mostly by the fruit itself",
        ],
        tags: ["Vegetarian", "Nut-free on request"],
        allergens: ["Gluten", "Milk", "Egg", "Tree nuts"],
      },
    ],
  },
];
