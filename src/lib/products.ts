export interface Product {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  notes: { top: string[]; heart: string[]; base: string[] };
  price: number;
  volume: string;
  image: string;
  stripePriceId?: string;
}

export const products: Product[] = [
  {
    id: "oud-noir",
    name: "Oud Noir",
    subtitle: "La oscuridad que seduce",
    description: "Un oud profundo envuelto en especias negras y resinas ancestrales. La fragancia que domina sin hablar.",
    notes: {
      top: ["Pimienta Negra", "Cardamomo"],
      heart: ["Oud Cambodiano", "Rosa Turca"],
      base: ["Ámbar Negro", "Almizcle", "Pachulí"],
    },
    price: 1299,
    volume: "30ml",
    image: "/perfumes/oud-noir.jpg",
    stripePriceId: "price_XXXX",
  },
  {
    id: "al-malikah",
    name: "Al Malikah",
    subtitle: "La reina del desierto",
    description: "Una composición floral de rosa y azafrán sobre un lecho de sándalo blanco. Para quien gobierna sin corona.",
    notes: {
      top: ["Azafrán", "Bergamota"],
      heart: ["Rosa de Taif", "Jazmín"],
      base: ["Sándalo Blanco", "Almizcle Blanco", "Vainilla"],
    },
    price: 1599,
    volume: "30ml",
    image: "/perfumes/al-malikah.jpg",
    stripePriceId: "price_XXXX",
  },
  {
    id: "dukhan",
    name: "Dukhān",
    subtitle: "El humo sagrado",
    description: "Incienso y maderas ahumadas transportadas desde los zocos del Oriente. Misterio puro.",
    notes: {
      top: ["Incienso", "Mirra"],
      heart: ["Madera de Agar", "Geranio"],
      base: ["Ámbar Gris", "Vetiver", "Cedro"],
    },
    price: 1199,
    volume: "30ml",
    image: "/perfumes/dukhan.jpg",
    stripePriceId: "price_XXXX",
  },
  {
    id: "al-ambar",
    name: "Al Ambar",
    subtitle: "Oro líquido",
    description: "La dulzura cálida del ámbar árabe con una espiral de vainilla y especias doradas. Irresistible.",
    notes: {
      top: ["Naranja Dulce", "Canela"],
      heart: ["Ámbar Dorado", "Benjuí"],
      base: ["Vainilla Tahití", "Almizcle Dorado", "Madera de Cachemira"],
    },
    price: 1399,
    volume: "30ml",
    image: "/perfumes/al-ambar.jpg",
    stripePriceId: "price_XXXX",
  },
  {
    id: "zafar",
    name: "Zafar",
    subtitle: "La victoria",
    description: "Fresco y poderoso. Almizcle blanco, cedro y notas marinas que evocan conquista y presencia.",
    notes: {
      top: ["Bergamota", "Limón Siciliano"],
      heart: ["Cedro del Atlas", "Iris"],
      base: ["Almizcle Blanco", "Vetiver", "Ambroxan"],
    },
    price: 1299,
    volume: "30ml",
    image: "/perfumes/zafar.jpg",
    stripePriceId: "price_XXXX",
  },
  {
    id: "layl",
    name: "Layl",
    subtitle: "La noche eterna",
    description: "Una noche de terciopelo negro con notas de rosa, oud y almizcle oscuro. El perfume de los elegidos.",
    notes: {
      top: ["Grosella Negra", "Pimienta Rosa"],
      heart: ["Rosa Negra", "Oud Sintético"],
      base: ["Almizcle Oscuro", "Ámbar", "Cuero"],
    },
    price: 1499,
    volume: "30ml",
    image: "/perfumes/layl.jpg",
    stripePriceId: "price_XXXX",
  },
  {
    id: "liam-blue-shine",
    name: "Liam Blue Shine",
    subtitle: "Elegancia sin límites",
    description: "Una explosión de frescura mediterránea con corazón especiado y una base amaderada de larga duración. Sofisticación árabe en cada spray.",
    notes: {
      top: ["Bergamota", "Limón", "Manzana Verde"],
      heart: ["Cardamomo", "Lavanda", "Geranio"],
      base: ["Sándalo", "Almizcle Blanco", "Ámbar", "Cedro"],
    },
    price: 1300,
    volume: "100ml",
    image: "/perfumes/liam-blue-shine.png",
    stripePriceId: "price_XXXX",
  },
];
