export interface ItineraryDay {
  dayNumber: number;
  title: string;
  subtitle?: string;
  stopLocation: string;
  description: string[];
  overnightStay: string;
  highlights?: string[];
  image: string;
  imageAlt?: string;
}

export interface TourHighlightCategory {
  category: string;
  iconName: string;
  items: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface PackageRouteStop {
  name: string;
  night: string;
  keyHighlight: string;
}

export interface LongDayPackage {
  id: string;
  slug: string;
  title: string;
  durationTag: string;
  durationNightsDays: string;
  subtitle: string;
  overview: string[];
  idealFor: string;
  pace: string;
  heroImage: string;
  posterImage?: string;
  routeMapStops: PackageRouteStop[];
  highlights: TourHighlightCategory[];
  itinerary: ItineraryDay[];
  includes: string[];
  excludes: string[];
  accommodation: {
    title: string;
    description: string[];
    hotelTiers: {
      name: string;
      desc: string;
    }[];
  };
  faqs: FAQItem[];
  whyChooseThisJourney: {
    title: string;
    paragraphs: string[];
    bulletPoints: string[];
  };
  customTourCTA: {
    title: string;
    subtitle: string;
    description: string;
    quoteNotice: string;
  };
}

export const longDayPackages: LongDayPackage[] = [
  {
    id: "10-days-relaxed-private-tour",
    slug: "10-days-relaxed-private-tour",
    title: "Relaxed 09 Nights / 10 Days Private Tour",
    durationTag: "10 DAYS",
    durationNightsDays: "09 Nights / 10 Days",
    subtitle: "Experience Sri Lanka at a Comfortable but Active Pace",
    heroImage: "/images/sigiriya_hero_bg.jpg",
    posterImage: "/images/sigiriya_hero_bg.jpg",
    pace: "Comfortable & Balanced",
    idealFor: "Couples, Honeymooners, Families & Small Private Groups",
    routeMapStops: [
      { name: "Negombo / Airport", night: "Night 1", keyHighlight: "Arrival & Coastal Gateway" },
      { name: "Sigiriya & Dambulla", night: "Nights 2 & 3", keyHighlight: "Lion Rock & Anuradhapura" },
      { name: "Kandy", night: "Night 4", keyHighlight: "Tooth Relic & Cultural Show" },
      { name: "Nuwara Eliya", night: "Night 5", keyHighlight: "Ceylon Tea Country" },
      { name: "Ella", night: "Night 6", keyHighlight: "Nine Arches & Scenic Rail" },
      { name: "Yala National Park", night: "Night 7", keyHighlight: "Wild Leopard Safari" },
      { name: "Galle & Bentota", night: "Night 8", keyHighlight: "Dutch Fort & Beach Sanctuary" },
      { name: "Colombo", night: "Night 9", keyHighlight: "Madu River & Capital City" },
      { name: "Airport Departure", night: "Day 10", keyHighlight: "Farewell Sri Lanka" },
    ],
    overview: [
      "Discover the very best of Sri Lanka on this carefully designed 10-day private journey, created for travelers who seek comfort, authenticity, and unforgettable experiences. Blending ancient heritage, breathtaking landscapes, wildlife adventures, and relaxing coastal escapes, this itinerary offers the perfect balance between exploration and leisure.",
      "Travel through Sri Lanka’s magnificent Cultural Triangle, scenic tea country, misty mountains, wildlife-rich national parks, and beautiful southern coastline, while enjoying the comfort of private transportation, carefully selected accommodation, and personalized service throughout your journey.",
      "Whether you are traveling as a couple, honeymooner, family, or small private group, this tour offers a memorable Sri Lankan experience at a relaxed pace without feeling rushed."
    ],
    highlights: [
      {
        category: "Ancient Heritage",
        iconName: "Landmark",
        items: [
          "Dambulla Royal Cave Temple",
          "Sigiriya Rock Fortress",
          "Ancient City of Anuradhapura",
          "Optional Polonnaruwa Ancient City",
          "Temple of the Sacred Tooth Relic"
        ]
      },
      {
        category: "Nature & Scenic Landscapes",
        iconName: "Trees",
        items: [
          "Hiriwadunna Village Experience",
          "Ramboda Waterfall",
          "Tea Plantation & Tea Factory",
          "Nuwara Eliya (Little England)",
          "Scenic Train Experience (Subject to Availability)",
          "Ella & Nine Arches Bridge",
          "Little Adam’s Peak Hike",
          "Ravana Falls"
        ]
      },
      {
        category: "Wildlife Experiences",
        iconName: "Compass",
        items: [
          "Minneriya National Park Jeep Safari (Seasonal Elephant Gathering)",
          "Yala National Park Jeep Safari (Leopards, Bears & Elephants)"
        ]
      },
      {
        category: "Southern Coast Experiences",
        iconName: "Sun",
        items: [
          "Mirissa Coastal Photo Stops",
          "Galle Dutch Fort UNESCO Heritage Walk",
          "Bentota Golden Beach Sanctuary",
          "Madu River Boat Safari & Mangroves",
          "Colombo City Experience (Time Permitting)"
        ]
      }
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: "Welcome to Sri Lanka",
        subtitle: "Ayubowan! Welcome to the Pearl of the Indian Ocean",
        stopLocation: "Negombo / Bandaranaike Airport",
        image: "/images/stop_negombo.jpg",
        imageAlt: "Negombo beach sunset coastal gateway - SunHaven Lanka",
        description: [
          "Upon arrival at Bandaranaike International Airport, your personal chauffeur-guide will warmly welcome you and assist with your luggage before beginning your unforgettable Sri Lankan journey.",
          "Depending on your arrival time, your chauffeur-guide will recommend either a relaxing overnight stay in Negombo or a comfortable transfer to the Cultural Triangle, ensuring the most enjoyable start to your holiday.",
          "Guests arriving early may continue directly to Dambulla, while those arriving on late-night flights may prefer to relax in Negombo before beginning the tour the following morning.",
          "Spend the remainder of the day at leisure and prepare for the adventures ahead."
        ],
        overnightStay: "Negombo or Dambulla",
        highlights: ["VIP Airport Meet & Greet", "Comfortable Executive Chauffeur Transfer", "Relaxed Leisure Evening"]
      },
      {
        dayNumber: 2,
        title: "Dambulla, Sigiriya & Authentic Village Life",
        subtitle: "Ancient Cave Temples, The 5th Century Citadel & Traditional Village Hospitality",
        stopLocation: "Sigiriya & Dambulla",
        image: "/images/sigiriya_hero_bg.jpg",
        imageAlt: "Sigiriya Lion Rock Citadel sunrise - SunHaven Lanka",
        description: [
          "After breakfast, begin your journey by visiting the magnificent Dambulla Royal Cave Temple, one of Sri Lanka’s most treasured UNESCO World Heritage Sites. Explore beautifully preserved cave shrines filled with ancient Buddhist murals and over one hundred magnificent Buddha statues.",
          "Continue to the legendary Sigiriya Rock Fortress, the iconic symbol of Sri Lanka and one of Asia’s most remarkable archaeological masterpieces. Climb through the ancient palace complex and enjoy breathtaking panoramic views across the Cultural Triangle.",
          "Later, immerse yourself in authentic rural life during the Hiriwadunna Village Experience. Travel by traditional bullock cart, enjoy a peaceful canoe ride across the village lake, and experience genuine Sri Lankan hospitality with a freshly prepared village lunch served by a local family.",
          "This carefully balanced day combines history, culture, nature, and local traditions into one unforgettable experience."
        ],
        overnightStay: "Sigiriya / Dambulla",
        highlights: ["Dambulla Royal Cave Temple", "Sigiriya Lion Rock Citadel", "Hiriwadunna Village Canoe & Bullock Cart", "Traditional Home-cooked Village Lunch"]
      },
      {
        dayNumber: 3,
        title: "Ancient Kingdoms & Wildlife Encounters",
        subtitle: "Sacred City of Anuradhapura & Minneriya Wild Elephant Safari",
        stopLocation: "Anuradhapura & Minneriya National Park",
        image: "/images/exp_wildlife_safaris.jpg",
        imageAlt: "Minneriya wild elephants gathering safari - SunHaven Lanka",
        description: [
          "After breakfast, travel to the sacred city of Anuradhapura, Sri Lanka’s first ancient capital and one of the country’s most significant UNESCO World Heritage Sites.",
          "Discover over two thousand years of history as you visit the sacred Sri Maha Bodhi Tree, the magnificent Ruwanwelisaya, Jetavanaramaya, Thuparamaya, and many other remarkable monuments that continue to inspire visitors from around the world.",
          "For travelers wishing to explore even further, an optional visit to Polonnaruwa Ancient City can be arranged depending on your interests and available time.",
          "Later in the afternoon, embark on an exciting Minneriya National Park Jeep Safari, renowned for its seasonal elephant gathering and rich diversity of wildlife, including deer, monkeys, crocodiles, and a variety of bird species.",
          "Return to your hotel after a rewarding day filled with history and nature."
        ],
        overnightStay: "Sigiriya / Dambulla",
        highlights: ["Sacred Anuradhapura Ancient City", "Sri Maha Bodhi & Ruwanwelisaya", "Minneriya National Park 4x4 Jeep Safari", "Wild Asian Elephant Herds"]
      },
      {
        dayNumber: 4,
        title: "Spice Gardens & The Cultural Capital",
        subtitle: "Ayurvedic Spice Gardens, Sacred Tooth Relic Temple & Kandyan Cultural Show",
        stopLocation: "Matale Spice Groves & Kandy Royal Capital",
        image: "/images/stop_kandy_temple.jpg",
        imageAlt: "Temple of the Sacred Tooth Relic and Kandy Lake - SunHaven Lanka",
        description: [
          "Following breakfast, leave the Cultural Triangle behind and journey towards the beautiful hill capital of Kandy.",
          "En route, stop at a traditional Spice Garden, where you will discover Sri Lanka’s world-famous spices and learn about centuries-old Ayurvedic traditions.",
          "Upon arrival in Kandy, visit the revered Temple of the Sacred Tooth Relic, one of the island’s most important Buddhist pilgrimage sites.",
          "Enjoy a leisurely walk around the picturesque Kandy Lake, browse local handicraft shops, and soak up the charming atmosphere of this historic city.",
          "As evening falls, experience the vibrant Kandyan Cultural Dance Performance, showcasing Sri Lanka’s rich traditions through music, dance, and fire performances."
        ],
        overnightStay: "Kandy",
        highlights: ["Traditional Ayurvedic Spice Garden", "Temple of the Sacred Tooth Relic", "Scenic Kandy Lake Stroll", "Kandyan Cultural Dance & Fire Performance"]
      },
      {
        dayNumber: 5,
        title: "Journey Through Sri Lanka’s Tea Country",
        subtitle: "Ramboda Falls, Ceylon Tea Estates & Colonial 'Little England'",
        stopLocation: "Ramboda & Nuwara Eliya Highlands",
        image: "/images/tea_country_estate.jpg",
        imageAlt: "Misty Ceylon tea plantation hill country - SunHaven Lanka",
        description: [
          "After breakfast, continue your journey through the breathtaking landscapes of Sri Lanka’s central highlands.",
          "Travel along winding mountain roads surrounded by endless tea plantations while stopping at the spectacular Ramboda Waterfall.",
          "Visit a working Tea Plantation and Tea Factory, where you’ll discover how world-famous Ceylon Tea is carefully cultivated and produced before enjoying a freshly brewed cup overlooking the lush green hills.",
          "Arrive in the charming colonial town of Nuwara Eliya, affectionately known as “Little England,” where cool mountain air, elegant gardens, and British colonial architecture create a unique atmosphere unlike anywhere else on the island.",
          "Spend the remainder of the day relaxing and enjoying the peaceful surroundings."
        ],
        overnightStay: "Nuwara Eliya",
        highlights: ["Ramboda Waterfall", "Working Ceylon Tea Factory & Tea Tasting", "Nuwara Eliya Colonial Town & Gregory Lake", "Misty Mountain Panoramas"]
      },
      {
        dayNumber: 6,
        title: "Scenic Journey to Ella",
        subtitle: "Observation Train Journey, Nine Arches Bridge & Little Adam's Peak",
        stopLocation: "Ella & Demodara Viaduct",
        image: "/images/nine_arch_bridge_train.jpg",
        imageAlt: "Nine Arch Bridge Scenic Train in Ella - SunHaven Lanka",
        description: [
          "After breakfast, continue your journey towards Ella, one of Sri Lanka’s most picturesque hill-country destinations.",
          "For guests who wish to experience one of the world’s most scenic railway journeys, the famous train ride from Nanu Oya to Ella can be arranged, subject to ticket availability. Alternatively, travel by your private vehicle while enjoying spectacular mountain viewpoints and photo stops along the way.",
          "Upon arrival in Ella, visit the iconic Nine Arches Bridge, surrounded by lush jungle and tea plantations. Continue with a gentle hike to Little Adam’s Peak, where breathtaking panoramic views reward your efforts. Before the day ends, stop at the beautiful Ravana Falls, one of Sri Lanka’s most famous waterfalls.",
          "This day offers the perfect blend of spectacular scenery, light adventure, and unforgettable memories."
        ],
        overnightStay: "Ella",
        highlights: ["Nanu Oya to Ella Scenic Train (Subject to Availability)", "Iconic Nine Arches Bridge", "Little Adam's Peak Sunset Hike", "Ravana Waterfall"]
      },
      {
        dayNumber: 7,
        title: "From the Highlands to Sri Lanka’s Wild South",
        subtitle: "Descent from Misty Mountains to Wildlife Sanctuaries",
        stopLocation: "Southern Foothills to Yala Wilderness",
        image: "/images/stop_yala_safari.jpg",
        imageAlt: "Yala wild leopard in natural habitat - SunHaven Lanka",
        description: [
          "After a relaxed breakfast, leave the cool mountains behind as you journey towards Yala National Park, passing through changing landscapes of forests, villages, and open countryside.",
          "Upon arrival, enjoy a leisurely afternoon to relax at your hotel, swim in the pool, or simply unwind before the following morning’s wildlife adventure.",
          "This slower-paced day allows you to fully appreciate the transition from Sri Lanka’s hill country to its southern wilderness."
        ],
        overnightStay: "Yala / Tissamaharama",
        highlights: ["Scenic Mountain Descent", "Southern Countryside Landscapes", "Luxury Safari Resort Relaxation"]
      },
      {
        dayNumber: 8,
        title: "Yala Safari & Southern Coastal Elegance",
        subtitle: "Dawn Leopard Safari, Mirissa Coast & Historic Galle Dutch Fort",
        stopLocation: "Yala National Park to Mirissa & Galle Fort",
        image: "/images/stop_galle_fort.jpg",
        imageAlt: "Galle Dutch Fort UNESCO Heritage Ramparts - SunHaven Lanka",
        description: [
          "Rise early for an unforgettable Jeep Safari in Yala National Park, one of the best places in Asia to observe wildlife in its natural habitat.",
          "Keep your camera ready as you search for elusive Sri Lankan leopards, majestic elephants, sloth bears, crocodiles, spotted deer, water buffalo, and an incredible variety of birdlife.",
          "After your safari, continue towards Sri Lanka’s stunning southern coastline.",
          "Pause in Mirissa for scenic coastal photo stops before arriving at the historic Galle Dutch Fort, a UNESCO World Heritage Site where centuries-old colonial architecture blends beautifully with boutique cafés, charming streets, and panoramic ocean views.",
          "Enjoy a relaxing evening beside the Indian Ocean."
        ],
        overnightStay: "Galle or Bentota",
        highlights: ["Yala National Park Morning Safari", "Leopard & Sloth Bear Tracking", "Mirissa Coastal Views", "Galle Dutch Fort UNESCO Heritage Stroll"]
      },
      {
        dayNumber: 9,
        title: "Bentota, Madu River & Colombo",
        subtitle: "Madu River Mangrove Boat Safari & Colombo Commercial Capital",
        stopLocation: "Bentota & Madu Ganga River to Colombo",
        image: "/images/coastal_haven_galle.jpg",
        imageAlt: "Bentota palm fringed beach and ocean - SunHaven Lanka",
        description: [
          "After breakfast, continue to Bentota, one of Sri Lanka’s most popular beach destinations.",
          "Enjoy a peaceful Madu River Boat Safari, gliding through mangrove forests, hidden waterways, and small river islands while discovering the region’s unique biodiversity and tranquil scenery.",
          "Later, travel to Colombo, Sri Lanka’s vibrant commercial capital.",
          "Depending on your available time, enjoy a relaxed city experience featuring Independence Square, Galle Face Green, historic colonial buildings, shopping opportunities, and local cuisine before your final evening on the island."
        ],
        overnightStay: "Colombo",
        highlights: ["Madu River Mangrove Boat Safari", "Bentota Golden Beach", "Colombo City Tour", "Galle Face Green & Independence Square"]
      },
      {
        dayNumber: 10,
        title: "Farewell Sri Lanka",
        subtitle: "End of an Unforgettable Journey Across the Paradise Island",
        stopLocation: "Colombo to Bandaranaike Airport (CMB)",
        image: "/images/stop_colombo.jpg",
        imageAlt: "Colombo skyline and coastal promenade - SunHaven Lanka",
        description: [
          "Enjoy a relaxed breakfast before checking out of your hotel.",
          "At the appropriate time, your private chauffeur-guide will transfer you comfortably to Bandaranaike International Airport for your departure flight.",
          "As your unforgettable Sri Lankan journey comes to an end, take with you lasting memories of ancient heritage, breathtaking landscapes, incredible wildlife, warm hospitality, and unforgettable experiences.",
          "We look forward to welcoming you back to Sri Lanka again."
        ],
        overnightStay: "Departure",
        highlights: ["Comfortable Airport Transfer", "Assistance with Flight Check-in", "Cherished Memories of Sri Lanka"]
      }
    ],
    includes: [
      "Airport Meet & Greet service with cold towels & assistance",
      "Private Air-Conditioned Luxury Vehicle throughout the entire journey",
      "Professional, Certified English-Speaking Chauffeur-Guide",
      "All Airport Pickups & Drop-offs",
      "All Government Taxes & Highway Tolls",
      "Complimentary Bottled Mineral Water throughout the tour",
      "Carefully selected Accommodation arranged according to your preferred hotel category",
      "Meal Plan (Bed & Breakfast / Half Board) according to your selected package",
      "Entrance Tickets to key UNESCO sites & attractions (included in selected packages)",
      "Dedicated 4x4 Jeep Safari Experiences with experienced park trackers"
    ],
    excludes: [
      "International Airfare tickets",
      "Sri Lanka Electronic Travel Authorization (ETA Visa Fees)",
      "Comprehensive Travel & Medical Insurance",
      "Personal Expenses (Laundry, phone calls, room service)",
      "Meals not mentioned in your confirmed itinerary",
      "Alcoholic and non-alcoholic drinks / snacks",
      "Tips & Gratuities for Chauffeur-Guide and hotel staff",
      "Optional activities and camera permits not included in your final quotation"
    ],
    accommodation: {
      title: "Carefully Selected Accommodations",
      description: [
        "Every hotel is carefully selected based on comfort, location, cleanliness, service standards, and guest reviews to ensure a relaxing and enjoyable stay throughout your journey.",
        "Accommodation can be arranged in carefully selected 3-star, 4-star, or 5-star hotels, depending on your preferred travel style and budget.",
        "Boutique hotels, heritage colonial planter villas, and internationally recognized luxury properties (such as Relais & Châteaux, Heritance, and luxury safari lodges) are also available for guests seeking a more exclusive experience.",
        "Final hotel selections will be confirmed at the time of booking, subject to availability."
      ],
      hotelTiers: [
        {
          name: "Luxury Boutique & 5-Star",
          desc: "World-class luxury villas, colonial tea bungalows, and luxury safari tented suites with private butler service."
        },
        {
          name: "Premium 4-Star",
          desc: "Handpicked 4-star resorts and stylish boutique hotels with swimming pools, excellent cuisine, and scenic views."
        },
        {
          name: "Comfort 3-Star",
          desc: "Charming, comfortable, and spotless 3-star accommodations offering genuine hospitality and prime locations."
        }
      ]
    },
    faqs: [
      {
        question: "Can this itinerary be customized?",
        answer: "Absolutely. Every tour can be tailored to match your travel dates, interests, preferred attractions, hotel category, and pace of travel. Whether you want to add beach days, skip ancient cities, or stay in specific boutique resorts, our travel designers will tailor it for you."
      },
      {
        question: "Is the scenic train ride included?",
        answer: "The scenic train journey (such as Nanu Oya to Ella) can be arranged upon request and is subject to ticket availability. We recommend booking early so we can secure first-class or second-class observation tickets for your dates."
      },
      {
        question: "Can I upgrade my hotels?",
        answer: "Yes. We offer carefully selected 3-star, 4-star, 5-star, boutique, and luxury hotels throughout Sri Lanka. You can mix and match—for example, 4-star hotels in the cultural triangle and luxury tea bungalows in the hill country."
      },
      {
        question: "Is this tour suitable for families?",
        answer: "Yes. This itinerary is ideal for couples, honeymooners, families, friends, and private groups seeking a comfortable and well-balanced holiday. We provide family-friendly vehicles with child safety seats and customize daily timing for children."
      },
      {
        question: "What vehicle is provided for this private tour?",
        answer: "We provide modern, fully air-conditioned private vehicles tailored to your group size: executive sedans for 1-3 guests, luxury minivans for 4-6 guests, and spacious high-roof vans or mini-coaches for larger groups, all piloted by certified English-speaking chauffeur-guides."
      }
    ],
    whyChooseThisJourney: {
      title: "Why Choose This Journey?",
      paragraphs: [
        "This itinerary has been thoughtfully designed for travelers who wish to experience the very best of Sri Lanka while enjoying a comfortable yet active pace.",
        "Combining ancient heritage, spectacular landscapes, wildlife adventures, scenic hill country, and relaxing coastal experiences, the route has been carefully planned to minimize unnecessary travel while allowing ample time to enjoy every destination.",
        "With private transportation, personalized service, carefully selected accommodation, and flexible travel options, this journey offers an unforgettable Sri Lankan holiday tailored to your interests and travel style."
      ],
      bulletPoints: [
        "Carefully planned route to minimize driving time and maximize experiential moments",
        "100% private travel with dedicated certified chauffeur-guide at your service",
        "Handpicked hotels meeting high standards of comfort, hygiene, and authentic charm",
        "Seamless 24/7 on-ground concierge support via WhatsApp throughout your stay"
      ]
    },
    customTourCTA: {
      title: "Need a Custom Tour?",
      subtitle: "Handcrafted Just For You",
      description: "Every traveler is unique, and so is every journey. If you are looking for something more personalized, we will be delighted to create a tailor-made itinerary based on your travel dates, preferred hotel category, special interests, group size, and budget. Our travel specialists will work with you to design a seamless Sri Lankan holiday that perfectly matches your travel style.",
      quoteNotice: "Instead of offering fixed prices, we prepare personalized quotations based on your travel dates, group size, preferred accommodation, meal plan, and travel preferences. This ensures you receive the most suitable itinerary and the best possible value for your Sri Lankan holiday."
    }
  }
];

export const getPackageBySlug = (slug: string): LongDayPackage | undefined => {
  return longDayPackages.find((pkg) => pkg.slug === slug);
};
