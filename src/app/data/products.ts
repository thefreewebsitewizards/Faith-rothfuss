import { Product } from '@/app/types';

export const products: Product[] = [
  {
    id: 'homesteaders-blend',
    name: "Homesteader's Blend",
    category: 'core',
    description: "Rooted in the self‑reliant spirit of Alaska's early settlers, Homesteader's Blend is crafted for long days, early mornings, and work done by hand. This balanced, approachable coffee delivers steady warmth and comfort—strong enough to carry you through chores, yet smooth enough to savor by the fire. It's a dependable cup, inspired by cabins, wood stoves, and the quiet resilience of life off the grid.",
    tastingNotes: {
      aroma: 'Toasted grain, honeyed nuts, and fresh earth',
      flavor: 'Milk chocolate, caramelized sugar, and a hint of dried fruit',
      body: 'Medium, round, and comforting',
      finish: 'Smooth, clean, with a gentle sweetness'
    },
    price: 26.00,
    image: 'https://images.unsplash.com/photo-1579904380653-bca3242e4594?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBjdXAlMjBjYWJpbiUyMHdvb2R8ZW58MXx8fHwxNzY5OTg2MTk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    beanType: 'Whole Bean'
  },
  {
    id: 'crude-sludge',
    name: 'Crude Sludge Dark Roast',
    category: 'core',
    description: "Forged in the spirit of Alaska's rugged oil fields and long winter nights, Crude Sludge Dark Roast is bold, heavy, and unapologetically strong. Roasted deep to unlock rich oils and a commanding body, this coffee delivers the kind of warmth and intensity that cuts through cold mornings and fuels hard work under wide northern skies. It's a tribute to grit, resilience, and the raw power of the Last Frontier.",
    tastingNotes: {
      aroma: 'Smoldering spruce, dark cocoa, and wood smoke',
      flavor: 'Deep roasted chocolate, toasted molasses, and earthy undertones',
      body: 'Full, dense, and coating',
      finish: 'Long, smoky, with a lingering dark chocolate richness'
    },
    price: 26.00,
    image: 'https://images.unsplash.com/photo-1649777888193-e47833d91521?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwcm9hc3RlZCUyMGNvZmZlZSUyMGJlYW5zfGVufDF8fHx8MTc2OTk4NjE5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    beanType: 'Whole Bean'
  },
  {
    id: 'wild-blueberry',
    name: 'Wild Blueberry Coffee Blend',
    category: 'seasonal',
    description: "Inspired by the untamed landscapes of the North, this Wild Blueberry Coffee Blend brings a touch of Alaskan summer to every cup. Smooth, aromatic coffee is gently infused with the essence of ripe wild blueberries, creating a balanced brew that's both comforting and vibrant. The result is a naturally sweet, fruit‑forward cup that feels indulgent without overpowering the coffee's character.",
    tastingNotes: {
      aroma: 'Fresh-picked blueberries with a hint of warm pastry',
      flavor: 'Juicy wild blueberry up front, layered over mellow roasted coffee',
      body: 'Medium and silky',
      finish: 'Clean, lightly sweet, with a lingering berry note'
    },
    price: 26.00,
    image: 'https://images.unsplash.com/photo-1579904380653-bca3242e4594?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBjdXAlMjBjYWJpbiUyMHdvb2R8ZW58MXx8fHwxNzY5OTg2MTk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    beanType: 'Whole Bean'
  },
  {
    id: 'borealis-brulee',
    name: 'Borealis Brûlée',
    category: 'seasonal',
    description: "Inspired by the glow of the northern lights dancing across winter skies, Borealis Brûlée is a rich, indulgent blend that balances warmth and sweetness with a smooth, comforting depth. This coffee evokes crackling fires, snow‑covered cabins, and the quiet magic of Alaska's long nights—luxurious without losing its rugged soul.",
    tastingNotes: {
      aroma: 'Caramelized sugar, vanilla bean, and toasted cream',
      flavor: 'Silky custard sweetness layered with roasted coffee and a hint of warm spice',
      body: 'Medium‑full, velvety, and smooth',
      finish: 'Soft, lingering, with notes of brûlée sugar and gentle warmth'
    },
    price: 26.00,
    image: 'https://images.unsplash.com/photo-1579904380653-bca3242e4594?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBjdXAlMjBjYWJpbiUyMHdvb2R8ZW58MXx8fHwxNzY5OTg2MTk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    beanType: 'Whole Bean'
  },
  {
    id: 'snow-ma-bean',
    name: 'Snow‑Ma‑Bean',
    category: 'seasonal',
    description: "Playful in name, comforting in character, Snow‑Ma‑Bean is a winter‑ready blend inspired by fresh snowfall, quiet mornings, and the simple joy of a warm mug in cold hands. This coffee is smooth, gently sweet, and easy‑drinking—crafted to feel like a soft blanket on a snowy Alaskan day.",
    tastingNotes: {
      aroma: 'Vanilla cream, warm sugar, and fresh‑baked pastry',
      flavor: 'Light caramel sweetness with soft cocoa and a hint of marshmallow',
      body: 'Medium‑light, smooth, and cozy',
      finish: 'Clean, mellow, with a lingering sweetness'
    },
    price: 26.00,
    image: 'https://images.unsplash.com/photo-1579904380653-bca3242e4594?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBjdXAlMjBjYWJpbiUyMHdvb2R8ZW58MXx8fHwxNzY5OTg2MTk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    beanType: 'Whole Bean'
  },
  {
    id: 'tahitian-vanilla',
    name: 'Tahitian Vanilla',
    category: 'seasonal',
    description: "Smooth, aromatic, and quietly indulgent, Tahitian Vanilla is a comforting blend inspired by warmth in the cold—soft light through cabin windows, fresh snow outside, and a steady mug in hand. Delicate vanilla notes weave seamlessly into the coffee, enhancing its natural sweetness without overpowering the roast. The result is a refined, cozy cup that feels both familiar and elevated.",
    tastingNotes: {
      aroma: 'Creamy vanilla, warm sugar, and light floral tones',
      flavor: 'Soft vanilla sweetness layered over smooth roasted coffee',
      body: 'Medium, silky, and balanced',
      finish: 'Clean, mellow, with a gentle vanilla warmth'
    },
    price: 26.00,
    image: 'https://images.unsplash.com/photo-1579904380653-bca3242e4594?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBjdXAlMjBjYWJpbiUyMHdvb2R8ZW58MXx8fHwxNzY5OTg2MTk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    beanType: 'Whole Bean'
  }
];
