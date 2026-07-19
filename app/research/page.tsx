import type { Metadata } from "next";
import { PageBanner } from "@/components/PageBanner";
import { PublicationsSections } from "@/components/PublicationsSections";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Published research by Felipe M. Affonso on consumer decision-making, human-technology interactions, and marketing.",
  alternates: { canonical: "/research/" },
};

// Machine-readable metadata for LLMs and bots — carried over verbatim.
const collectionLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Research — Felipe M. Affonso",
  description: "Published research with machine-readable versions available for AI tools.",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "ScholarlyArticle",
        name: "When Consumers Prefer Point Versus Range Estimates of Product Performance",
        author: ["Amin Shiri", "Felipe M. Affonso", "Keith Wilcox"],
        isPartOf: { "@type": "Periodical", name: "Journal of Marketing Research" },
      },
      {
        "@type": "ScholarlyArticle",
        name: "Credibility of More vs. Less Precise Predictions Depends on the Perceived Nature of Uncertainty",
        author: ["Eitan D. Rude", "Amin Shiri", "Felipe M. Affonso", "Hal E. Hershfield", "Craig R. Fox"],
        isPartOf: { "@type": "Periodical", name: "Journal of Experimental Psychology: General" },
      },
      {
        "@type": "ScholarlyArticle",
        name: "Brief Commentary: A Framework for Detecting AI Agents in Online Research",
        author: "Felipe M. Affonso",
        isPartOf: { "@type": "Periodical", name: "Journal of Consumer Research" },
        sameAs: "https://doi.org/10.1093/jcr/ucag006",
      },
      {
        "@type": "ScholarlyArticle",
        name: "Concealing Prices: How Delayed Price Disclosure Influences Consumer Purchase Decisions",
        author: ["Felipe M. Affonso", "Amin Shiri", "Diego Aparicio", "Minzhe Xu", "Xiang Wang", "Chris Janiszewski", "Marco Bertini"],
        isPartOf: { "@type": "Periodical", name: "Journal of Consumer Research" },
        sameAs: "https://doi.org/10.1093/jcr/ucaf051",
        encoding: { "@type": "MediaObject", contentUrl: "/files/papers/concealing-prices.md", encodingFormat: "text/markdown" },
      },
      {
        "@type": "ScholarlyArticle",
        name: "Behavioral Micro-Foundations for the Space Commons: A Policy Toolkit",
        author: "Felipe M. Affonso",
        datePublished: "2026",
        isPartOf: { "@type": "Periodical", name: "Research Policy" },
        sameAs: "https://doi.org/10.1016/j.respol.2026.105511",
      },
      {
        "@type": "ScholarlyArticle",
        name: "Simple is Eco-Friendly but Complex is Effective: Inferences from Visual Complexity in Package Design",
        author: ["Soo Yon Ryu", "Felipe M. Affonso", "Aner Sela"],
        datePublished: "2026",
        isPartOf: { "@type": "Periodical", name: "Journal of Advertising" },
        sameAs: "https://doi.org/10.1080/00913367.2025.2593659",
        encoding: { "@type": "MediaObject", contentUrl: "/files/papers/simple-eco-friendly.md", encodingFormat: "text/markdown" },
      },
      {
        "@type": "ScholarlyArticle",
        name: "Consumer Responses to Infectious Disease Cues: An Integrative Framework and Research Agenda",
        author: "Felipe M. Affonso",
        datePublished: "2025",
        isPartOf: { "@type": "Periodical", name: "European Journal of Marketing" },
        sameAs: "https://doi.org/10.1108/EJM-01-2024-0070",
        encoding: { "@type": "MediaObject", contentUrl: "/files/papers/disease-cues.md", encodingFormat: "text/markdown" },
      },
      {
        "@type": "ScholarlyArticle",
        name: "Marketing by Design: The Influence of Perceptual Structure on Brand Performance",
        author: ["Felipe M. Affonso", "Chris Janiszewski"],
        datePublished: "2023",
        isPartOf: { "@type": "Periodical", name: "Journal of Marketing" },
        sameAs: "https://doi.org/10.1177/00222429221142281",
        encoding: { "@type": "MediaObject", contentUrl: "/files/papers/marketing-by-design.md", encodingFormat: "text/markdown" },
      },
      {
        "@type": "ScholarlyArticle",
        name: "Serendipity: Chance Encounters in the Marketplace Enhance Consumer Satisfaction",
        author: ["Aekyoung Kim", "Felipe M. Affonso", "Juliano Laran", "Kristina Durante"],
        datePublished: "2021",
        isPartOf: { "@type": "Periodical", name: "Journal of Marketing" },
        sameAs: "https://doi.org/10.1177/00222429211000344",
        encoding: { "@type": "MediaObject", contentUrl: "/files/papers/serendipity.md", encodingFormat: "text/markdown" },
      },
      {
        "@type": "ScholarlyArticle",
        name: "Boundaries of Constructive Choice: On the Accessibility of Maximize Accuracy and Minimize Effort Goals",
        author: ["Felipe M. Affonso", "Chris Janiszewski", "James R. Bettman"],
        datePublished: "2021",
        isPartOf: { "@type": "Periodical", name: "Journal of Consumer Psychology" },
        sameAs: "https://doi.org/10.1002/jcpy.1184",
        encoding: { "@type": "MediaObject", contentUrl: "/files/papers/constructive-choice.md", encodingFormat: "text/markdown" },
      },
      {
        "@type": "ScholarlyArticle",
        name: "The Importance of Advertising Skepticism for Brand Extension Appeals",
        author: ["José Mauro da Costa Hernandez", "Scott A. Wright", "Felipe M. Affonso"],
        datePublished: "2019",
        isPartOf: { "@type": "Periodical", name: "Psychology & Marketing" },
        sameAs: "https://doi.org/10.1002/mar.21205",
        encoding: { "@type": "MediaObject", contentUrl: "/files/papers/ad-skepticism.md", encodingFormat: "text/markdown" },
      },
    ],
  },
};

export default function ResearchPage() {
  return (
    <>
      <PageBanner title="Research" />
      <main className="page research-page">
        <PublicationsSections />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      </main>
    </>
  );
}
