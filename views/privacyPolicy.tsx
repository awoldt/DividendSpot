import Footer from "../components/footer.tsx";
import Navbar from "../components/navbar.tsx";

export default function PrivacyPolicy() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <div class="container">
          <h1>Privacy Policy</h1>

          <p>
            At DividendSpot, we value your privacy and are committed to
            protecting your personal data. This Privacy Policy explains how we
            collect, use, and protect your information when you visit our
            website.
          </p>

          <h2>Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul>
            <li>
              <strong>Personal Identification Information:</strong> Name, email
              address, phone number, etc.
            </li>
            <li>
              <strong>Usage Data:</strong> Information on how you interact with
              our website, including your IP address, browser type, and pages
              visited.
            </li>
            <li>
              <strong>Cookies:</strong> Small data files stored on your device
              to enhance your browsing experience.
            </li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and maintain our services</li>
            <li>Improve and personalize your experience on our site</li>
            <li>
              Communicate with you, including sending updates or promotional
              content
            </li>
            <li>Analyze usage patterns to improve site functionality</li>
          </ul>

          <h2>How We Protect Your Data</h2>
          <p>
            We use a variety of security measures to protect your personal data.
            These measures include encryption, firewalls, and secure access
            protocols. However, no method of transmission over the internet or
            electronic storage is 100% secure, and we cannot guarantee absolute
            security.
          </p>

          <h2>Third-Party Services</h2>
          <p>
            We may use third-party services, such as analytics providers, to
            help us understand how our users engage with the website. These
            third parties may have access to your personal information to
            perform specific tasks on our behalf but are obligated to protect
            it.
          </p>

          <h2>Your Rights</h2>
          <p>You have the following rights concerning your personal data:</p>
          <ul>
            <li>The right to access your personal information</li>
            <li>The right to request corrections to any inaccurate data</li>
            <li>The right to request deletion of your personal information</li>
            <li>The right to opt-out of marketing communications</li>
          </ul>

          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page, and the "last updated" date at the top
            will reflect the changes. We encourage you to review this page
            periodically to stay informed about how we protect your information.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at:
          </p>
          <p>
            <strong>Email:</strong> privacy@dividendtracker.com
          </p>
          <p>
            <strong>Address:</strong> 123 Finance Street, New York, NY, 10001
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
