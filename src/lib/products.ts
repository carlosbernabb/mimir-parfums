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
    id: "game-of-spades-boston",
    name: "Game of Spades Boston",
    subtitle: "El as más oscuro del tablero",
    description:
      "Creado por Jo Milano Paris, Game of Spades Boston es una oda al poder y la audacia. Inspirado en el naipe más temido, abre con bergamota chispeante que cede paso a un corazón especiado de pimienta negra y cuero fino. La base de oud y sándalo oscuro lo convierte en una firma implacable para quien juega —y gana— en grande.",
    notes: {
      top: ["Bergamota", "Pomelo", "Pimienta Negra"],
      heart: ["Cuero Fino", "Madera de Oud", "Cardamomo"],
      base: ["Sándalo Oscuro", "Almizcle Negro", "Ámbar", "Vetiver"],
    },
    price: 1575,
    volume: "100ml",
    image: "/perfumes/game-of-spades-boston.png",
    stripePriceId: "price_XXXX",
  },
  {
    id: "afnan-supremacy",
    name: "Afnan Supremacy Collector's Edition",
    subtitle: "La edición que define el dominio",
    description:
      "Afnan Perfumes, joya de los Emiratos Árabes fundada en 1995, creó la línea Supremacy para quienes exigen lo extraordinario. Esta Collector's Edition eleva el original con una concentración reforzada: abre con notas frescas de bergamota siciliana y lavanda provenzal, evoluciona hacia un corazón almizcleado de violeta y geranio, y cierra con una base cálida de cedro del Atlas y ámbar blanco. Hasta 12 horas de proyección.",
    notes: {
      top: ["Bergamota Siciliana", "Lavanda", "Manzana"],
      heart: ["Violeta", "Geranio Rosa", "Jazmín Blanco"],
      base: ["Cedro del Atlas", "Ámbar Blanco", "Almizcle", "Madera de Cachemira"],
    },
    price: 1090,
    volume: "100ml",
    image: "/perfumes/afnan-supremacy.png",
    stripePriceId: "price_XXXX",
  },
  {
    id: "armaf-arabian-sky",
    name: "Armaf Eter Arabian Sky",
    subtitle: "El horizonte infinito del desierto",
    description:
      "Armaf, la maison de lujo india fundada en Dubai, captura en Arabian Sky la inmensidad del cielo árabe. Una apertura acuática y fresca de notas marinas y cítricos mediterráneos transiciona hacia un corazón floral-especiado de lavanda y rosa. La base amaderada de sándalo cremoso y almizcle blanco es tan etérea como un atardecer sobre las dunas. Unisex en esencia, universal en presencia.",
    notes: {
      top: ["Notas Marinas", "Bergamota", "Pomelo"],
      heart: ["Lavanda", "Rosa Turca", "Cardamomo"],
      base: ["Sándalo Cremoso", "Almizcle Blanco", "Ámbar Gris", "Cedro"],
    },
    price: 990,
    volume: "100ml",
    image: "/perfumes/armaf-arabian-sky.png",
    stripePriceId: "price_XXXX",
  },
  {
    id: "afnan-rare-reef",
    name: "Afnan Rare Reef XDP",
    subtitle: "Las profundidades del mar en tu piel",
    description:
      "XDP —la concentración más alta de la perfumería árabe moderna— garantiza una sillage que persiste toda la jornada. Afnan Rare Reef captura la esencia de arrecifes coralinos vírgenes: una obertura de sal marina y cítricos frescos se sumerge en un corazón acuático con toque de musgo y algas marinas, antes de anclar en una base cálida de ámbar y madera de oud. La rareza, embotellada.",
    notes: {
      top: ["Sal Marina", "Bergamota", "Lima"],
      heart: ["Acuático Marino", "Musgo", "Jazmín Marino"],
      base: ["Ámbar Marino", "Oud Suave", "Almizcle", "Cedro"],
    },
    price: 989,
    volume: "100ml",
    image: "/perfumes/afnan-rare-reef.png",
    stripePriceId: "price_XXXX",
  },
  {
    id: "armaf-cool-ace",
    name: "Armaf Cool Ace",
    subtitle: "Frescura que conquista sin esfuerzo",
    description:
      "Cool Ace nació de la filosofía de Armaf: lujo accesible sin compromisos en calidad. Una explosión helada de menta ártica y bergamota italiana inaugura esta fragancia masculina, mientras el corazón de lavanda y sándalo blanco añade profundidad. La base de almizcle limpio y cedro ahumado garantiza una presencia discreta pero memorable. El perfume del hombre que siempre tiene la situación bajo control.",
    notes: {
      top: ["Menta Ártica", "Bergamota", "Limón"],
      heart: ["Lavanda", "Sándalo Blanco", "Geranio"],
      base: ["Almizcle Limpio", "Cedro", "Ámbar Suave"],
    },
    price: 800,
    volume: "100ml",
    image: "/perfumes/armaf-cool-ace.png",
    stripePriceId: "price_XXXX",
  },
  {
    id: "rome-ivory",
    name: "Rome Ivory Pour Homme",
    subtitle: "La elegancia eterna de la Ciudad Eterna",
    description:
      "Inspirado en los mármoles y jardines imperiales de Roma, Rome Ivory Pour Homme de Mast Perfume es un clásico contemporáneo. La apertura espumosa de bergamota y pomelo da paso a un corazón especiado de pimienta blanca y nuez moscada. Los tonos marfileños de su base —sándalo, almizcle blanco y vainilla suave— evocan la sofisticación atemporal de la arquitectura romana. Una fragancia para quien viste la historia.",
    notes: {
      top: ["Bergamota", "Pomelo", "Limón Italiano"],
      heart: ["Pimienta Blanca", "Nuez Moscada", "Iris"],
      base: ["Sándalo", "Almizcle Blanco", "Vainilla Suave", "Cedro"],
    },
    price: 799,
    volume: "100ml",
    image: "/perfumes/rome-ivory.png",
    stripePriceId: "price_XXXX",
  },
  {
    id: "afnan-zimaya-mazaaj",
    name: "Afnan Zimaya Mazaaj Infused",
    subtitle: "El estado de ánimo que te define",
    description:
      "Zimaya —sublínea premium de Afnan creada en Dubai— lanza Mazaaj, cuyo nombre en árabe significa 'estado de ánimo'. Infused con aceites esenciales de primer nivel, esta fragancia masculina comienza con una obertura dulce-especiada de canela y azafrán iraní. El corazón amaderado de oud cambodiano y rosa negra crea un dúo hipnótico, mientras la base de ámbar negro y vainilla tahití deja una estela cálida que transforma cada habitación que pisas.",
    notes: {
      top: ["Azafrán Iraní", "Canela", "Cardamomo"],
      heart: ["Oud Cambodiano", "Rosa Negra", "Sándalo"],
      base: ["Ámbar Negro", "Vainilla Tahití", "Almizcle Oscuro", "Pachulí"],
    },
    price: 860,
    volume: "100ml",
    image: "/perfumes/afnan-zimaya-mazaaj.png",
    stripePriceId: "price_XXXX",
  },
  {
    id: "maison-alhambra-jean-lowe",
    name: "Maison Alhambra Jean Lowe",
    subtitle: "La maison que desafía al lujo europeo",
    description:
      "Maison Alhambra, la marca de alta perfumería perteneciente a Lattafa (Dubai, 2018), creó Jean Lowe como su declaración de guerra al lujo occidental. Con una concentración EDP superior, esta fragancia masculina es un orientalwood moderno: bergamota italiana y frutos rojos en apertura, seguidos de un corazón de cedro y vetiver haitiano. La base de oud y ámbar gris otorga una elegancia oscura que rivaliza con casas europeas de triple precio.",
    notes: {
      top: ["Bergamota Italiana", "Frutos Rojos", "Pimienta Rosada"],
      heart: ["Cedro del Atlas", "Vetiver Haitiano", "Pachulí"],
      base: ["Oud Árabe", "Ámbar Gris", "Almizcle", "Madera de Sándalo"],
    },
    price: 749,
    volume: "100ml",
    image: "/perfumes/maison-alhambra-jean-lowe.png",
    stripePriceId: "price_XXXX",
  },
  {
    id: "liam-blue-shine",
    name: "Lattafa Liam Blue Shine",
    subtitle: "Elegancia sin límites",
    description:
      "Lattafa Perfumes —fundada en Dubai en 2005— creó Liam Blue Shine como tributo a la elegancia mediterránea con alma árabe. Su frasco azul cobalto anuncia lo que promete: una explosión de bergamota y cítricos sicilianos que evoluciona hacia un corazón especiado de cardamomo y lavanda provenzal. La base amaderada de sándalo y almizcle blanco proyecta durante horas esa sofisticación que no necesita presentación.",
    notes: {
      top: ["Bergamota", "Limón Siciliano", "Manzana Verde"],
      heart: ["Cardamomo", "Lavanda", "Geranio"],
      base: ["Sándalo", "Almizcle Blanco", "Ámbar", "Cedro"],
    },
    price: 749,
    volume: "100ml",
    image: "/perfumes/liam-blue-shine.png",
    stripePriceId: "price_XXXX",
  },
];
