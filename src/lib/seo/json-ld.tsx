import { siteConfig } from "@/data/site-config";

/** Renders a JSON-LD script. Content is built from our own data, never user input. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function personJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.fullName,
    url: siteConfig.baseUrl,
    email: siteConfig.email,
    jobTitle: "Full-Stack & AI Developer",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Istanbul",
      addressCountry: "TR",
    },
    sameAs: [siteConfig.github, siteConfig.linkedin],
  };
}

export function websiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.baseUrl,
  };
}

export function blogPostingJsonLd(input: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description,
    url: input.url,
    datePublished: input.datePublished,
    dateModified: input.datePublished,
    author: {
      "@type": "Person",
      name: siteConfig.fullName,
      url: siteConfig.baseUrl,
    },
    mainEntityOfPage: input.url,
  };
}
