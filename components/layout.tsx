// deno-lint-ignore-file no-explicit-any
import Footer from "./footer.tsx";
import Navbar from "./navbar.tsx";

export default function Layout(props: {
  body: any;
  title: string;
  styles: string[] | null;
  metaDescription: string;
  canonicalLink: string;
  ogData: {
    title: string;
    url: string;
    image: string;
    description: string;
  } | null;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{props.title}</title>
        <meta name="description" content={props.metaDescription} />
        <link rel="canonical" href={props.canonicalLink} />
        <link
          rel="icon"
          type="image/png"
          href="/public/favicon-48x48.png"
          sizes="48x48"
        />
        <link rel="icon" type="image/svg+xml" href="/public/favicon.svg" />
        <link rel="shortcut icon" href="/public/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/public/apple-touch-icon.png"
        />

        <link rel="stylesheet" href="/public/styles/global.css" />
        {props.ogData !== null && (
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
        {props.styles !== null && (
          <>
            {props.styles.map((x) => {
              return <link rel="stylesheet" href={x} />;
            })}
          </>
        )}
      </head>
      <body>
        <header>
          <Navbar />
        </header>
        <main>{props.body}</main>
        <Footer />
      </body>
    </html>
  );
}
