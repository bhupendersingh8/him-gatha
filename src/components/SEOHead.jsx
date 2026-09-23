import { useEffect } from 'react';

export default function SEOHead({ title, description, imageUrl, canonicalUrl, deityData }) {
  const defaultTitle = "HIM GATHA — Himalayan Cultural & Deity Archive";
  const defaultDesc = "Definitive digital archive preserving the folk deities, oracle traditions, and living heritage of Himachal Pradesh. Explore the sacred Dev-Yatras, lineages, and histories.";
  const defaultImage = "/images/sanctuary.png";
  const siteUrl = "https://himgatha.netlify.app";

  const seoTitle = title ? `${title} — HIM GATHA` : defaultTitle;
  const seoDesc = description ? description.substring(0, 160) : defaultDesc;
  const seoImage = imageUrl || defaultImage;
  const seoUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl;

  useEffect(() => {
    document.title = seoTitle;
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = seoDesc;
  }, [seoTitle, seoDesc]);

  return (
    <>
      {/* Basic Metadata */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDesc} />
      <link rel="canonical" href={seoUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={deityData ? "article" : "website"} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDesc} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:site_name" content="HIM GATHA" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDesc} />
      <meta name="twitter:image" content={seoImage} />

      {/* JSON-LD Structured Data for search engines */}
      {deityData && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Place",
            "name": deityData.name,
            "description": deityData.description || deityData.history || seoDesc,
            "image": deityData.images && deityData.images.length > 0 ? deityData.images : [seoImage],
            ...(deityData.coordinates && deityData.coordinates.lat ? {
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": deityData.coordinates.lat,
                "longitude": deityData.coordinates.lng
              }
            } : {}),
            "address": {
              "@type": "PostalAddress",
              "addressLocality": deityData.village,
              "addressRegion": `${deityData.district}, Himachal Pradesh`,
              "addressCountry": "IN"
            },
            "isPartOf": {
              "@type": "WebSite",
              "name": "HIM GATHA Digital Heritage Archive",
              "url": siteUrl
            }
          })}
        </script>
      )}
    </>
  );
}
