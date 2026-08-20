import { TourHighlightCategory, FAQItem } from "./longDayPackages";

export interface OneDayItineraryBlock {
  timeOfDay: string;
  title: string;
  description: string[];
}

export interface OneDayPackage {
  id: string;
  slug: string;
  title: string;
  durationTag: string;
  subtitle: string;
  overview: string[];
  idealFor: string;
  pace: string;
  heroImage: string;
  posterImage?: string;
  highlights: TourHighlightCategory[];
  itinerary: OneDayItineraryBlock[];
  includes: string[];
  excludes: string[];
  faqs?: FAQItem[];
  whyChooseThisJourney: {
    title: string;
    paragraphs: string[];
  };
  customTourCTA: {
    title: string;
    subtitle: string;
    description: string;
    quoteNotice: string;
  };
}

export const oneDayPackages: OneDayPackage[] = [
  {
    id: "colombo-city-tour",
    slug: "colombo-city-tour",
    title: "Colombo City Tour",
    durationTag: "FULL DAY",
    subtitle: "Discover Colombo — Where Sri Lanka’s Past Meets Its Modern Spirit",
    heroImage: "/images/stop_colombo.jpg",
    posterImage: "/images/stop_colombo.jpg",
    pace: "Relaxed",
    idealFor: "First-time visitors, couples, families, and travellers with limited time",
    overview: [
      "Experience the vibrant capital of Sri Lanka on a private city journey combining colonial heritage, religious landmarks, local culture, shopping, and modern Colombo.",
      "Perfect for first-time visitors, couples, families, and travellers with limited time, this private experience offers a relaxed introduction to Sri Lanka’s commercial capital with the flexibility to explore at your own pace."
    ],
    highlights: [
      {
        category: "Heritage & Culture",
        iconName: "Landmark",
        items: [
          "Gangaramaya Temple",
          "Independence Memorial Hall",
          "Colombo Fort & Old Parliament area",
          "Colonial-era architecture"
        ]
      },
      {
        category: "City Experiences",
        iconName: "Compass",
        items: [
          "Galle Face Green",
          "Colombo Harbour & Port City viewpoints",
          "Pettah market area",
          "Local streets and city life"
        ]
      },
      {
        category: "Shopping & Leisure",
        iconName: "Sun",
        items: [
          "Local handicrafts and souvenirs",
          "Modern shopping malls",
          "Optional café or restaurant stop"
        ]
      },
      {
        category: "Private Travel Experience",
        iconName: "Car",
        items: [
          "Hotel Pickup & Drop-off",
          "Private Air-Conditioned Vehicle",
          "Professional English-Speaking Chauffeur-Guide"
        ]
      }
    ],
    itinerary: [
      {
        timeOfDay: "Morning",
        title: "Discover Colombo’s Heritage",
        description: [
          "Your private chauffeur-guide will collect you from your hotel and begin your Colombo city experience.",
          "Visit Gangaramaya Temple, one of Colombo’s most fascinating Buddhist temples, followed by the Independence Memorial Hall and surrounding heritage areas.",
          "Continue towards Colombo Fort to discover the city’s colonial history and changing skyline."
        ]
      },
      {
        timeOfDay: "Afternoon",
        title: "Modern Colombo & Local Life",
        description: [
          "Explore Pettah, one of Colombo’s busiest commercial districts, where traditional markets, shops and everyday Sri Lankan life come together.",
          "Continue to Galle Face Green, a popular seaside promenade overlooking the Indian Ocean.",
          "Depending on your interests, enjoy free time for shopping, a café stop, or a relaxed meal before returning to your hotel."
        ]
      }
    ],
    includes: [
      "Hotel Pickup & Drop-off",
      "Private Air-Conditioned Vehicle",
      "Professional English-Speaking Chauffeur-Guide",
      "Complimentary Bottled Water",
      "Government Taxes"
    ],
    excludes: [
      "Entrance Tickets",
      "Meals & Beverages",
      "Personal Expenses",
      "Tips & Gratuities"
    ],
    whyChooseThisJourney: {
      title: "Why Choose This Journey?",
      paragraphs: [
        "A private Colombo experience allows you to discover the city without the pressure of a fixed group itinerary.",
        "Your chauffeur-guide can adjust the pace according to your interests, whether you prefer history, culture, shopping, photography, or local experiences."
      ]
    },
    customTourCTA: {
      title: "Need a Custom City Tour?",
      subtitle: "Handcrafted Just For You",
      description: "Combine Colombo with Negombo, Kelaniya Temple, Mount Lavinia, or other nearby attractions according to your available time.",
      quoteNotice: "Instead of offering fixed prices, we prepare personalized quotations based on your travel dates, group size, and travel preferences."
    }
  }
];

export const getOneDayPackageBySlug = (slug: string): OneDayPackage | undefined => {
  return oneDayPackages.find((pkg) => pkg.slug === slug);
};
