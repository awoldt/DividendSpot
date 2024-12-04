import Footer from "../components/footer.tsx";
import Navbar from "../components/navbar.tsx";

export default function PrivacyPolicy() {
  return (
    <>
      <div class="container pt-5">
        <h1>Privacy Policy</h1>
        <div class="mb-4 text-muted">Last updated December 4th, 2024</div>
        <p>
          At DividendSpot, we value your privacy and are committed to protecting
          your personal data. This Privacy Policy explains how we collect, use,
          and protect your information when you visit our website.
        </p>

        <h2>Information We Collect</h2>
        <p>We do not collect any information on our users.</p>

        <h2>Third-Party Advertising</h2>
        <p>
          We use Google AdSense to serve ads on our website. Google, as a
          third-party vendor, uses cookies to serve ads based on your prior
          visits to our website or other websites. These cookies enable Google
          and its partners to serve ads based on your interests.
        </p>
        <p>
          You can learn more about how Google uses your data and manage your
          preferences by visiting{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google's Privacy Policy
          </a>
        </p>

        <h2>Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will
          be posted on this page, and the "last updated" date at the top will
          reflect the changes. We encourage you to review this page periodically
          to stay informed about how we protect your information.
        </p>
      </div>
    </>
  );
}
