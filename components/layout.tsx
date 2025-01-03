import Footer from "./footer.tsx";
import Navbar from "./navbar.tsx";

interface LayoutProps {
  body: any;
  title: string;
  metaDescription: string | null;
  canonicalLink: string;
  ogData: {
    title: string;
    url: string;
    image: string;
    description: string;
  } | null;
  includeAds: boolean;
}

export default function Layout(props: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{props.title}</title>

        {props.metaDescription && (
          <meta name="description" content={props.metaDescription} />
        )}
        <link rel="canonical" href={props.canonicalLink} />
        <link
          rel="icon"
          type="image/png"
          href="/public/favicon-48x48.png"
          sizes="48x48"
        />
        <link rel="shortcut icon" href="/public/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/public/apple-touch-icon.png"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
          crossOrigin="anonymous"
        />

        {props.ogData && (
          <>
            <meta property="og:title" content={props.ogData.title} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={props.ogData.url} />
            <meta property="og:image" content={props.ogData.image} />
            <meta
              property="og:description"
              content={props.ogData.description}
            />
            <meta property="og:site_name" content="DividendSpot" />
          </>
        )}
        {props.includeAds && (
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4106301283765460"
            crossorigin="anonymous"
          ></script>
        )}
      </head>

      <body className="d-flex flex-column min-vh-100">
        <Navbar />
        <main id="content" className="flex-grow-1">
          {props.body}
        </main>
        <Footer />

        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
          crossOrigin="anonymous"
        ></script>
      </body>
    </html>
  );
}
