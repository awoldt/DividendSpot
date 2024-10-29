import Footer from "../components/footer.tsx";
import Navbar from "../components/navbar.tsx";

export default function PrivacyPolicy() {
  return (
    <>
      <div class="container pt-5">
        <h1>Privacy Policy</h1>
        <span>Last updated October 27th, 2024</span>
        <p>
          At DividendSpot, we value your privacy and are committed to protecting
          your personal data. This Privacy Policy explains how we collect, use,
          and protect your information when you visit our website.
        </p>

        <h2>Information We Collect</h2>
        <p>
          While we do not collect any personally identifiable information on our
          users, we use Google Analytics to gather anonymous data about site
          usage. Google Analytics may collect information such as your IP
          address, browser type, and pages visited. This data helps us
          understand how users interact with our site and improve our services.
          For more information on how Google collects and processes this data,
          please review the{" "}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Privacy & Terms site
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
