export interface ExperienceHighlight {
  title: string;
  location: string;
  description: string;
  image: string;
}

export interface Experience {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  tagline: string;
  heroImage: string;
  overview: string[];
  durationRecommended: string;
  bestTimeToVisit: string;
  weatherNotes: string;
  highlights: ExperienceHighlight[];
  curatedActivities: string[];
  travelTips: string[];
  galleryImages: string[];
  relatedPackageSlugs: { title: string; slug: string; duration: string }[];
}

export const experiencesData: Experience[] = [
  {
    id: "ancient-heritage",
    slug: "ancient-heritage",
    title: "Ancient Heritage & Sacred Kingdoms",
    shortTitle: "ANCIENT HERITAGE",
    subtitle: "Journey Through 2,500 Years of Royal Dynasties, Sacred Relics & Rock Citadels",
    tagline: "Uncover towering rock fortresses, subterranean cave monasteries, and monumental stupas carved into the heart of Sri Lanka's Cultural Triangle.",
    heroImage: "/images/exp_ancient_heritage.jpg",
    overview: [
      "Sri Lanka’s Cultural Triangle is a sacred landscape where time stands still among towering stone stupas, monolithic Buddha statues, and the ruins of ancient royal capitals that flourished over two millennia ago. Founded upon sophisticated hydraulic engineering and deeply rooted Buddhist philosophy, the kingdoms of Anuradhapura and Polonnaruwa once stood as global centers of trade, spirituality, and artistic brilliance.",
      "Rising dramatically 200 meters above the central jungle canopy is the legendary 5th-century Sigiriya Rock Fortress, also known as the Lion Rock. Built by King Kashyapa as both an impregnable citadel and an earthly palace of pleasure, Sigiriya boasts frescoed celestial maidens, reflective mirror walls inscribed with ancient graffiti, and water gardens with gravity-fed fountains that still function during the monsoon.",
      "Just south lies Dambulla, a sprawling complex of five pilgrimage cave monasteries adorned with over 150 gilded Buddha statues and 2,000 square meters of exquisite ceiling frescoes dating from the 1st century BCE. In the hill capital of Kandy, the revered Temple of the Sacred Tooth Relic enshrines the palladium of Sri Lankan royalty, accompanied by the hypnotic beat of traditional drumming and offerings of fragrant jasmine."
    ],
    durationRecommended: "3 – 5 Days",
    bestTimeToVisit: "December to April & July to September",
    weatherNotes: "The Cultural Triangle enjoys warm, dry weather for most of the year. Early mornings and late afternoons are the most comfortable times to explore the ruins.",
    highlights: [
      {
        title: "Sigiriya Rock Citadel",
        location: "Matale District",
        description: "Climb the ancient fifth-century palace in the sky, passing through the monumental lion paws and admiring the legendary Sigiriya Frescoes.",
        image: "/images/sigiriya_hero_bg.jpg",
      },
      {
        title: "Dambulla Royal Cave Monasteries",
        location: "Dambulla",
        description: "Explore five immense naturally carved caves filled with painted murals and reclining Buddha statues overlooking the sweeping plains.",
        image: "/images/exp_ancient_heritage.jpg",
      },
      {
        title: "Temple of the Sacred Tooth Relic",
        location: "Kandy",
        description: "Witness the sacred puja ceremonies at Sri Dalada Maligawa, nestled on the shores of Kandy Lake amidst misty forested hills.",
        image: "/images/stop_kandy_temple.jpg",
      },
      {
        title: "Ancient Kingdom of Anuradhapura",
        location: "North Central Province",
        description: "Marvel at monumental stupas like Ruwanwelisaya and the Jaya Sri Maha Bodhi, the oldest historically recorded tree planted by human hands.",
        image: "/images/exp_ancient_heritage.jpg",
      },
    ],
    curatedActivities: [
      "Private guided sunrise ascent of Sigiriya before the morning heat",
      "Traditional bullock cart and catamaran village lunch in Hiriwadunna",
      "Private blessing ceremony by senior Buddhist monks at a quiet forest hermitage",
      "Bicycle tour through the shaded royal palace ruins of Polonnaruwa",
      "Sunset view of Sigiriya from the neighboring summit of Pidurangala Rock",
    ],
    travelTips: [
      "Modest attire covering shoulders and knees is mandatory when entering all sacred temples and stupa grounds.",
      "Shoes and hats must be removed before stepping onto temple grounds; carrying a pair of thick socks helps on sun-warmed stone surfaces.",
      "Start climbing Sigiriya by 7:00 AM or 4:00 PM for cooler temperatures and the best photographic light.",
      "Always engage a certified chauffeur-guide to understand the fascinating royal court intrigues behind the architecture.",
    ],
    galleryImages: [
      "/images/sigiriya_hero_bg.jpg",
      "/images/exp_ancient_heritage.jpg",
      "/images/stop_kandy_temple.jpg",
    ],
    relatedPackageSlugs: [
      {
        title: "Relaxed 10-Days Private Tour",
        slug: "10-days-relaxed-private-tour",
        duration: "09 Nights / 10 Days",
      },
      {
        title: "Colombo City Cultural Excursion",
        slug: "colombo-city-tour",
        duration: "Full Day Tour",
      },
    ],
  },
  {
    id: "hill-country",
    slug: "hill-country",
    title: "Misty Hill Country & Ceylon Tea",
    shortTitle: "HILL COUNTRY",
    subtitle: "Emerald Tea Valleys, Colonial Charm, Roaring Waterfalls & Alpine Air",
    tagline: "Wander through rolling tea plantations, cross historic stone viaducts, and breathe crisp mountain air in Sri Lanka's cool interior highlands.",
    heroImage: "/images/nine_arch_bridge_train.jpg",
    overview: [
      "Rising from the tropical lowlands into a world of undulating jade hills, cool alpine breezes, and cascading waterfalls, Sri Lanka’s Central Highlands represent one of the world's premier tea-growing regions. Developed during the 19th century British colonial era, this picturesque landscape is dotted with stone bungalows, manicured gardens, and endless hills carpeted with emerald Camellia sinensis.",
      "The scenic railway journey between Kandy, Nanu Oya (Nuwara Eliya), and Ella is celebrated globally as one of the most romantic train rides on earth. As the vintage locomotive snakes through mist-shrouded mountain passes, passengers gaze across deep ravines, terraced vegetable valleys, and smiling tea pluckers dressed in vibrant sarees.",
      "In Ella, the iconic Nine Arch Bridge—an architectural wonder constructed entirely of stone bricks and cement without steel reinforcement—stands secluded inside dense jungle foliage. Further uphill, Nuwara Eliya, affectionately nicknamed 'Little England', showcases Tudor-style architecture, post offices, golf courses, and working tea factories where you can witness the traditional orthodox process of manufacturing the world's finest Ceylon Tea."
    ],
    durationRecommended: "3 – 4 Days",
    bestTimeToVisit: "December to May (Clear skies & cool mountain weather)",
    weatherNotes: "Temperatures in Nuwara Eliya and Horton Plains can drop to 10°C (50°F) in the evening. A warm jacket, fleece, and rain layer are highly recommended.",
    highlights: [
      {
        title: "The Nine Arch Bridge & Ella Gap",
        location: "Ella",
        description: "Watch the blue passenger train emerge through the emerald forest as it crosses the majestic 30-meter high colonial stone viaduct.",
        image: "/images/nine_arch_bridge_train.jpg",
      },
      {
        title: "Authentic Ceylon Tea Plantation & Factory",
        location: "Nuwara Eliya / Ramboda",
        description: "Walk alongside tea pluckers to harvest two leaves and a bud, followed by a guided masterclass on rolling, fermentation, and tasting.",
        image: "/images/tea_country_estate.jpg",
      },
      {
        title: "Little England & Colonial Heritage",
        location: "Nuwara Eliya",
        description: "Stroll through Victoria Park, Lake Gregory, and the red-brick colonial post office surrounded by misty cypress trees.",
        image: "/images/tea_country_estate.jpg",
      },
      {
        title: "Little Adam’s Peak & Ravana Falls",
        location: "Ella",
        description: "Hike through gentle tea slopes to a panoramic mountain ridge overlooking the Southern plains and thunderous waterfalls.",
        image: "/images/nine_arch_bridge_train.jpg",
      },
    ],
    curatedActivities: [
      "First-class reserved seat aboard the iconic scenic blue mountain train",
      "Private tea cupping tasting session with a master factory tea maker",
      "Dawn expedition to Horton Plains National Park and the sheer precipice of World's End",
      "Afternoon high tea served on the lawns of a restored colonial tea planter's bungalow",
      "Scenic hike to Little Adam's Peak followed by sunset cocktails in Ella",
    ],
    travelTips: [
      "Train tickets sell out weeks in advance; booking early through our dedicated concierge ensures first-class observation or reserved seating.",
      "Pack warm layers for Nuwara Eliya and Ella evenings, which are significantly cooler than coastal Sri Lanka.",
      "Carry sturdy walking shoes with good tread for tea garden walks and waterfall trails.",
      "Bring along a small thermos or enjoy freshly brewed hot ginger tea along the mountain roadside viewpoints.",
    ],
    galleryImages: [
      "/images/nine_arch_bridge_train.jpg",
      "/images/tea_country_estate.jpg",
    ],
    relatedPackageSlugs: [
      {
        title: "Relaxed 10-Days Private Tour",
        slug: "10-days-relaxed-private-tour",
        duration: "09 Nights / 10 Days",
      },
    ],
  },
  {
    id: "wildlife-safaris",
    slug: "wildlife-safaris",
    title: "Wildlife Safaris & Nature Reserves",
    shortTitle: "WILDLIFE SAFARIS",
    subtitle: "High-Density Leopard Territories, Great Elephant Herds & Exotic Birdlife",
    tagline: "Track elusive Sri Lankan leopards, witness hundreds of wild elephants gathering at sunset, and encounter sloth bears in pristine protected wilderness.",
    heroImage: "/images/exp_wildlife_safaris.jpg",
    overview: [
      "Sri Lanka is one of the world's most bio-diverse island ecosystems, recognized as a top global wildlife hotspot. Despite its compact footprint, the island shelters an astonishing variety of megafauna—from the endangered Asian elephant and the elusive Sri Lankan leopard (*Panthera pardus kotiya*) to sloth bears, mugger crocodiles, and over 400 species of resident and migratory birds.",
      "In the arid scrublands and coastal lagoons of Yala National Park, Sri Lanka boasts one of the highest densities of wild leopards in the world. Early morning and late afternoon game drives offer unforgettable encounters as these apex predators lounge on sun-warmed granite boulders or stalk spotted deer through thorny thickets.",
      "In the central dry zone, Minneriya and Kaudulla National Parks host 'The Gathering'—hailed by National Geographic as one of the world's greatest animal spectacles. As ancient man-made reservoirs recede during the dry months, hundreds of wild elephants congregate on the lush open grasslands to feed, socialize, and bathe, creating an awe-inspiring natural tableau found nowhere else on earth."
    ],
    durationRecommended: "2 – 4 Days",
    bestTimeToVisit: "February to October (Yala Leopards) & July to October (Elephant Gathering)",
    weatherNotes: "National parks are predominantly situated in the dry zone. Game drives are scheduled at dawn and late afternoon when animal activity peaks.",
    highlights: [
      {
        title: "Yala National Park Safari",
        location: "Southern Province",
        description: "Private 4x4 jeep safari tracking the elusive leopard, sloth bear, wild water buffalo, and marsh crocodiles across rugged coastal terrain.",
        image: "/images/stop_yala_safari.jpg",
      },
      {
        title: "The Great Elephant Gathering",
        location: "Minneriya & Kaudulla",
        description: "Witness herds of up to 300 wild elephants, including playful calves, gathering at the edges of ancient 3rd-century reservoirs.",
        image: "/images/exp_wildlife_safaris.jpg",
      },
      {
        title: "Udawalawe Elephant Sanctuary",
        location: "Sabaragamuwa Province",
        description: "Often compared to the East African savannah, guaranteed wild elephant sightings year-round along with herds of spotted deer and raptors.",
        image: "/images/exp_wildlife_safaris.jpg",
      },
      {
        title: "Mirissa Marine Whale Watching",
        location: "Southern Ocean",
        description: "Embark on an offshore excursion into deep Indian Ocean waters to spot Blue Whales—the largest creatures on Earth—and playful spinner dolphins.",
        image: "/images/coastal_haven_galle.jpg",
      },
    ],
    curatedActivities: [
      "Exclusive private customized 4x4 open-top safari jeeps with specialized wildlife trackers",
      "Dawn safari game drives for the highest probability of leopard sightings",
      "Quiet sunset boat safari along coastal lagoons teeming with wading storks and kingfishers",
      "Visit to the Udawalawe Elephant Transit Home to observe orphaned baby elephants feeding",
      "Responsible ethical whale-watching aboard licensed luxury catamarans",
    ],
    travelTips: [
      "Wear neutral, earth-toned clothing (khaki, olive, beige) to blend into the wilderness without agitating animals.",
      "Bring binoculars and a telephoto lens (200mm – 500mm) for prime wildlife and bird photography.",
      "Pack sunglasses, high-SPF sunscreen, and a light scarf or buff to protect against track dust during open jeep drives.",
      "Always maintain silence inside national parks to avoid disturbing animals and increase sighting opportunities.",
    ],
    galleryImages: [
      "/images/exp_wildlife_safaris.jpg",
      "/images/stop_yala_safari.jpg",
    ],
    relatedPackageSlugs: [
      {
        title: "Relaxed 10-Days Private Tour",
        slug: "10-days-relaxed-private-tour",
        duration: "09 Nights / 10 Days",
      },
    ],
  },
  {
    id: "beach-paradise",
    slug: "beach-paradise",
    title: "Tropical Beaches & Coastal Havens",
    shortTitle: "BEACH PARADISE",
    subtitle: "Golden Sands, Turquoise Swells, Heritage Forts & Palm-Fringed Shores",
    tagline: "Unwind on sun-drenched tropical beaches, explore 17th-century ramparts, and savor fresh seafood beneath swaying coconut groves.",
    heroImage: "/images/coastal_haven_galle.jpg",
    overview: [
      "Encircling the island is a coastline of sublime tropical beauty, where turquoise Indian Ocean waters lap against warm golden sands framed by coconut palm groves. From lively surf bays and secluded coves to tranquil river estuaries, Sri Lanka’s southern and western coasts offer the quintessential paradise retreat.",
      "Anchoring the southern coast is the UNESCO World Heritage site of Galle Fort. First built by the Portuguese in 1588 and extensively fortified by the Dutch in the 17th century, this living fortress is an enchanting labyrinth of cobblestone streets, colonial merchant mansions, boutique art galleries, chic jewelry shops, and oceanfront ramparts where travelers gather each evening to watch the sun sink into the sea.",
      "Further along the coastline, Bentota beckons with sweeping calm beaches and luxury villa resorts, ideal for peaceful water sports and serene sunset walks. In Mirissa, crescent-shaped bays provide world-class breaks for beginner and experienced surfers, while the secluded cliffs of Tangalle showcase untouched coves, private pool villas, and nesting sea turtles under starlit skies."
    ],
    durationRecommended: "3 – 6 Days",
    bestTimeToVisit: "November to April (South & West Coasts) & May to September (East Coast)",
    weatherNotes: "The south coast enjoys brilliant sunshine and gentle waters between December and April, making it the peak season for beach lovers and swimmers.",
    highlights: [
      {
        title: "Galle Dutch Fort UNESCO Heritage",
        location: "Galle",
        description: "Walk atop the ocean-facing stone bastions, visit the iconic lighthouse, and wander through historic colonial alleys lined with cafes.",
        image: "/images/stop_galle_fort.jpg",
      },
      {
        title: "Bentota Golden Beach & Water Sanctuary",
        location: "Bentota",
        description: "Miles of golden sand where the Bentota River meets the Indian Ocean, offering jet skiing, kayaking, and quiet beach walks.",
        image: "/images/coastal_haven_galle.jpg",
      },
      {
        title: "Madu River Mangrove Boat Safari",
        location: "Balapitiya",
        description: "Glide through labyrinthine mangrove tunnels, visit Cinnamon Island to watch traditional bark processing, and see fish therapy spas.",
        image: "/images/coastal_haven_galle.jpg",
      },
      {
        title: "Mirissa Crescent Bay & Coconut Tree Hill",
        location: "Mirissa",
        description: "Relax on palm-lined shores, capture photos at the famous promontory, and enjoy fresh grilled lobster and jumbo prawns right by the water.",
        image: "/images/coastal_haven_galle.jpg",
      },
    ],
    curatedActivities: [
      "Sunset champagne walk along the centuries-old ramparts of Galle Fort",
      "Private boat cruise through the dense mangrove biodiversity of the Madu River",
      "Guided sea turtle conservation visit along coastal hatcheries in Kosgoda",
      "Private beachfront seafood candlelit dinner beneath illuminated palms",
      "Ayurvedic herbal oil massage and wellness therapy at a luxury boutique spa",
    ],
    travelTips: [
      "Swimming is safest within designated coral reef lagoons and bays; always heed local beach safety flags.",
      "Stroll Galle Fort during the late afternoon (4:00 PM – 6:30 PM) for comfortable temperatures and the most magical golden hour light.",
      "Try local King Coconut (Thambili) water from roadside vendors for the ultimate natural hydration.",
      "Support ethical sea turtle conservation projects that do not handle hatchlings inappropriately.",
    ],
    galleryImages: [
      "/images/coastal_haven_galle.jpg",
      "/images/stop_galle_fort.jpg",
    ],
    relatedPackageSlugs: [
      {
        title: "Relaxed 10-Days Private Tour",
        slug: "10-days-relaxed-private-tour",
        duration: "09 Nights / 10 Days",
      },
    ],
  },
  {
    id: "culture-people",
    slug: "culture-people",
    title: "Living Culture & Island Hospitality",
    shortTitle: "CULTURE & PEOPLE",
    subtitle: "Sacred Ceremonies, Traditional Arts, Aromatic Spices & Genuine Warmth",
    tagline: "Immerse yourself in centuries of living traditions, vibrant drumming festivals, culinary secrets, and the legendary warmth of the Sri Lankan smile.",
    heroImage: "/images/exp_culture_people.jpg",
    overview: [
      "The true essence of Sri Lanka lies not merely in its ancient monuments or tropical scenery, but in the radiant warmth, deep spiritual devotion, and effortless hospitality of its people. Sri Lanka has long welcomed travelers with open arms and the graceful, palms-together greeting of 'Ayubowan'—a heartfelt wish for long life and well-being.",
      "The island’s cultural heritage is a kaleidoscope of Sinhalese, Tamil, Muslim, and Burgher influences woven over thousands of years. In the hill capital of Kandy, traditional arts reach their zenith through Kandyan dancing—an athletic, sacred art form accompanied by the thunderous rhythm of the Geta Beraya drums, acrobatic somersaults, and the shimmering metal costumes of the Ves dancers.",
      "Cuisine forms an integral gateway into local life. From fiery clay-pot black curries and freshly scraped coconut sambols to sweet hopper pancakes and aromatic cinnamon from coastal estates, Sri Lankan food is an explosion of multi-layered flavors. Strolling through busy spice gardens and local village markets reveals a rich tradition of indigenous Ayurvedic medicine and sustainable culinary mastery handed down through generations."
    ],
    durationRecommended: "Integrated Throughout Any Tour",
    bestTimeToVisit: "Year-Round (Esala Perahera Festival in July / August)",
    weatherNotes: "Cultural celebrations and culinary experiences are weather-independent and provide rewarding, meaningful moments year-round.",
    highlights: [
      {
        title: "Traditional Kandyan Dance & Drumming",
        location: "Kandy",
        description: "Experience the vibrant choreography, fire walking, and sacred percussion rhythms that have been performed for royalty for over 500 years.",
        image: "/images/exp_culture_people.jpg",
      },
      {
        title: "Village Life & Authentic Culinary Masterclass",
        location: "Central & Southern Regions",
        description: "Pick organic vegetables from village plots, grind fresh spices on a granite stone, and cook authentic curries in traditional clay pots over open wood fires.",
        image: "/images/exp_ancient_heritage.jpg",
      },
      {
        title: "Cinnamon Cultivation & Indigenous Spices",
        location: "Matale & Southern Belt",
        description: "Discover why Sri Lanka produces 90% of the world's pure True Ceylon Cinnamon (Cinnamomum verum) and learn about cardamom, clove, and nutmeg processing.",
        image: "/images/tea_country_estate.jpg",
      },
      {
        title: "Iconic Stilt Fishermen Tradition",
        location: "Ahangama & Weligama",
        description: "Observe the unique, age-old artisanal method where fishermen balance on slender wooden poles anchored into coral reefs to catch spotted herrings.",
        image: "/images/coastal_haven_galle.jpg",
      },
    ],
    curatedActivities: [
      "Private VIP seating at the world-famous Kandy Esala Perahera festival pageant (seasonal)",
      "Hands-on cooking masterclass with a local family inside an authentic village homestead",
      "Guided walk through Pettah's bustling bazaar and historic heritage quarters in Colombo",
      "Traditional mask-carving workshop with master craftsmen in Ambalangoda",
      "Visit to an authentic Ayurvedic herbal retreat for customized consultation with an indigenous doctor",
    ],
    travelTips: [
      "Always accept offerings or tea with your right hand, which is customary in local etiquette.",
      "Ask for permission with a polite smile before photographing individuals, monks, or working craftsmen.",
      "Let your chauffeur-guide or chef know your preferred spice tolerance ('mild', 'medium', or 'authentic Sri Lankan spicy').",
      "Embrace spontaneous conversations—Sri Lankans love sharing stories about their island with genuine curiosity and warmth.",
    ],
    galleryImages: [
      "/images/exp_culture_people.jpg",
      "/images/stop_kandy_temple.jpg",
      "/images/stop_colombo.jpg",
    ],
    relatedPackageSlugs: [
      {
        title: "Relaxed 10-Days Private Tour",
        slug: "10-days-relaxed-private-tour",
        duration: "09 Nights / 10 Days",
      },
      {
        title: "Colombo City Cultural Excursion",
        slug: "colombo-city-tour",
        duration: "Full Day Tour",
      },
    ],
  },
];

export function getExperienceBySlug(slug: string): Experience | undefined {
  return experiencesData.find((exp) => exp.slug === slug);
}
