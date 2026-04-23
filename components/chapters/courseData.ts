export interface Course {
  title: string;
  instructor: string;
  duration: string;
  priceAed: number;
  /** Path to the thumbnail under /public. */
  image: string;
  /** Short alt text for a11y (visual-only decoration uses ""). */
  imageAlt: string;
  /** Branded gradient drawn OVER the image as a translucent wash. */
  gradient: string;
  pattern: "dots" | "grid" | "lines" | "waves";
}

export const COURSES: Record<string, Course[]> = {
  AI: [
    {
      title: "Applied Large Language Models",
      instructor: "Dr. Sana Al-Khouri",
      duration: "8 weeks",
      priceAed: 1890,
      image: "/courses/ai/1.jpg",
      imageAlt: "Abstract imagery evoking large language models",
      gradient:
        "linear-gradient(135deg, rgba(91,108,255,0.75) 0%, rgba(26,26,36,0.65) 55%, rgba(212,165,116,0.45) 110%)",
      pattern: "dots",
    },
    {
      title: "AI Fluency for Leaders",
      instructor: "Rahul Menon",
      duration: "4 weeks",
      priceAed: 1290,
      image: "/courses/ai/2.jpg",
      imageAlt: "AI imagery for business leaders",
      gradient:
        "linear-gradient(135deg, rgba(212,165,116,0.7) 0%, rgba(91,108,255,0.55) 85%)",
      pattern: "grid",
    },
    {
      title: "Generative AI for Product",
      instructor: "Leila Farag",
      duration: "6 weeks",
      priceAed: 1590,
      image: "/courses/ai/3.jpg",
      imageAlt: "Generative AI visualization for product teams",
      gradient:
        "linear-gradient(160deg, rgba(26,26,36,0.75) 0%, rgba(91,108,255,0.55) 80%)",
      pattern: "lines",
    },
    {
      title: "AI Safety & Alignment",
      instructor: "Prof. Jamil Haddad",
      duration: "10 weeks",
      priceAed: 2190,
      image: "/courses/ai/4.jpg",
      imageAlt: "Imagery evoking AI safety and alignment",
      gradient:
        "linear-gradient(200deg, rgba(10,10,15,0.7) 0%, rgba(212,165,116,0.5) 100%)",
      pattern: "waves",
    },
  ],
  "Data Science": [
    {
      title: "Statistics for Practitioners",
      instructor: "Dr. Alina Petrov",
      duration: "6 weeks",
      priceAed: 1490,
      image: "/courses/data-science/1.jpg",
      imageAlt: "Data science imagery with statistical motifs",
      gradient:
        "linear-gradient(135deg, rgba(26,26,36,0.7) 0%, rgba(91,108,255,0.55) 100%)",
      pattern: "grid",
    },
    {
      title: "SQL, From Query to Insight",
      instructor: "Kwame Boateng",
      duration: "5 weeks",
      priceAed: 990,
      image: "/courses/data-science/2.jpg",
      imageAlt: "Abstract visualization of structured data",
      gradient:
        "linear-gradient(135deg, rgba(91,108,255,0.7) 0%, rgba(212,165,116,0.5) 100%)",
      pattern: "lines",
    },
    {
      title: "Python for Data",
      instructor: "Maya Kapoor",
      duration: "8 weeks",
      priceAed: 1690,
      image: "/courses/data-science/3.jpg",
      imageAlt: "Code-like abstract data visualization",
      gradient:
        "linear-gradient(160deg, rgba(10,10,15,0.7) 0%, rgba(91,108,255,0.6) 80%)",
      pattern: "dots",
    },
    {
      title: "Visualization & Storytelling",
      instructor: "Giovanni Rossi",
      duration: "4 weeks",
      priceAed: 890,
      image: "/courses/data-science/4.jpg",
      imageAlt: "Data visualization storytelling imagery",
      gradient:
        "linear-gradient(200deg, rgba(212,165,116,0.7) 0%, rgba(26,26,36,0.6) 100%)",
      pattern: "waves",
    },
  ],
  Product: [
    {
      title: "Product Management Core",
      instructor: "Ayesha Farooq",
      duration: "10 weeks",
      priceAed: 2490,
      image: "/courses/product-management/1.jpg",
      imageAlt: "Imagery evoking product strategy",
      gradient:
        "linear-gradient(135deg, rgba(212,165,116,0.7) 0%, rgba(10,10,15,0.6) 100%)",
      pattern: "dots",
    },
    {
      title: "Discovery to Delivery",
      instructor: "Henry Nakamura",
      duration: "6 weeks",
      priceAed: 1490,
      image: "/courses/product-management/2.jpg",
      imageAlt: "Abstract imagery for product discovery workflow",
      gradient:
        "linear-gradient(135deg, rgba(91,108,255,0.7) 0%, rgba(26,26,36,0.6) 100%)",
      pattern: "lines",
    },
    {
      title: "Pricing & Growth",
      instructor: "Noura Al-Maktoum",
      duration: "5 weeks",
      priceAed: 1290,
      image: "/courses/product-management/3.jpg",
      imageAlt: "Imagery evoking pricing and growth strategy",
      gradient:
        "linear-gradient(160deg, rgba(212,165,116,0.7) 0%, rgba(91,108,255,0.55) 100%)",
      pattern: "grid",
    },
    {
      title: "Technical PM Essentials",
      instructor: "Marcus Lindqvist",
      duration: "8 weeks",
      priceAed: 1890,
      image: "/courses/product-management/4.jpg",
      imageAlt: "Imagery for technical product management",
      gradient:
        "linear-gradient(200deg, rgba(26,26,36,0.7) 0%, rgba(212,165,116,0.55) 100%)",
      pattern: "waves",
    },
  ],
};

export const CATEGORIES = Object.keys(COURSES) as (keyof typeof COURSES)[];
