// ** Next, React And Locals Imports
import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

function Seo({ title }) {
  const router = useRouter();

  // Setting default title & desc
  const pageTitle = title ? title : "Fabyoh - Readymade Ecommerce Script";

  const pageDesc =
    "Fabyoh is a NextJs Based Seo Optimized Readymade eCommerce Script With Advanced Features Built For Small Business Owners And Entrepreneurs";

  const canonicalLink =
    process.env.NEXT_PUBLIC_CLIENT_URL + router.asPath.slice(1);

  // Favicon
  const siteSettings = useSelector((state) => state.siteSettings.siteSettings);

  const favicon = siteSettings?.favicon
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL + "logos/" + siteSettings.favicon}`
    : "/favicon.png";

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />
      <link rel="canonical" href={canonicalLink} />
      <link rel="icon" href={favicon} />
    </Head>
  );
}

export default Seo;
