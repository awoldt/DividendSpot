import Footer from "../components/footer.tsx";
import Navbar from "../components/navbar.tsx";

export default function PrivacyPolicy() {
  return (
    <>
      <div class="container pt-5">
        <h1>Privacy Policy</h1>
        <div class="mb-4 text-muted">Last updated November 1st, 2024</div>
        <p>
          At DividendSpot, we value your privacy and are committed to protecting
          your personal data. This Privacy Policy explains how we collect, use,
          and protect your information when you visit our website.
        </p>

        <h2>Information We Collect</h2>
        <p>
          While we do not collect any personally identifiable information on our
          users, we use Umami Analytics to gather anonymous data about site
          usage. This data helps us understand how users interact with our site
          and improve our services. For more information on how Umami collects
          and processes this data, please review the{" "}
          <a
            href="https://umami.is/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Umami Privacy Policy
          </a>
          .
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
