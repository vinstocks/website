import { useEffect } from "react";

const PrivacyPolicy = () => {
  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.setProperty("background", "var(--paper)", "important");
    return () => { document.body.style.background = prev; };
  }, []);

  return (
  <div
    style={{
      fontFamily: '"Literata", Georgia, "Times New Roman", serif',
      fontSize: "1.0625rem",
      lineHeight: 1.7,
      background: "var(--paper)",
      color: "var(--ink)",
      minHeight: "100vh",
      width: "100%",
    }}
  >
    <style>{`
      :root {
        --paper: #FBFBF8; --ink: #1C2430; --muted: #5A6472;
        --accent: #1F5E5A; --rule: #E3E1DA; --note: #EEF4F3;
      }
      @media (prefers-color-scheme: dark) {
        :root:not([data-theme="light"]) {
          --paper: #12171E; --ink: #E6E9ED; --muted: #9AA4B1;
          --accent: #6FBDB5; --rule: #2A323D; --note: #18242A;
        }
      }
      :root[data-theme="dark"] {
        --paper: #12171E; --ink: #E6E9ED; --muted: #9AA4B1;
        --accent: #6FBDB5; --rule: #2A323D; --note: #18242A;
      }
      .pp-main { margin: 0 auto; padding: 3.5rem 5% 5rem; text-align: left; }
      .pp-header { border-bottom: 1px solid var(--rule); padding-bottom: 1.75rem; margin-bottom: 2.25rem; }
      .pp-brand { font-family: "IBM Plex Sans", system-ui, sans-serif; font-weight: 600; color: var(--accent); font-size: 1rem; margin: 0 0 1.25rem; }
      .pp-main h1 { font-family: "IBM Plex Sans", system-ui, sans-serif; font-weight: 600; font-size: clamp(2rem, 5vw, 2.75rem); line-height: 1.15; margin: 0 0 .75rem; letter-spacing: -0.01em; color: var(--ink); }
      .pp-updated { color: var(--muted); margin: 0; font-size: .95rem; }
      .pp-main h2 { font-family: "IBM Plex Sans", system-ui, sans-serif; font-weight: 600; font-size: 1.25rem; line-height: 1.3; margin: 2.75rem 0 .75rem; color: var(--ink); }
      .pp-main h2 span { color: var(--accent); margin-right: .5rem; }
      .pp-main p, .pp-main ul { margin: 0 0 1rem; }
      .pp-main ul { padding-left: 1.25rem; }
      .pp-main li { margin-bottom: .4rem; }
      .pp-main a { color: var(--accent); text-underline-offset: 3px; }
      .pp-main a:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 2px; }
      .pp-contact p { margin: 0 0 .25rem; }
      .pp-footer { margin-top: 3.5rem; padding-top: 1.5rem; border-top: 1px solid var(--rule); color: var(--muted); font-size: .9rem; }
    `}</style>
    <main className="pp-main">
      <header className="pp-header">
        <p className="pp-brand">Vinstocks</p>
        <h1>Privacy Policy</h1>
        <p className="pp-updated">Last updated: 23 September 2026</p>
      </header>

      <p>
        This Privacy Policy explains how Ritik Anil Soni, operating under the brand Vinstocks
        ("we", "us", "our"), collects, uses, stores and protects your personal information when
        you visit vinstocks.com, contact us through our social media pages (including Instagram
        and Facebook), respond to our advertisements, or use our research and advisory services.
      </p>
      <p>
        We are a SEBI-registered Investment Adviser (Registration No. INA000021766). We process
        personal data in line with the Digital Personal Data Protection Act, 2023, the Information
        Technology Act, 2000 and its rules, and applicable SEBI regulations.
      </p>

      <h2><span>1.</span>Information we collect</h2>
      <p>We collect only what we need to respond to you and provide our services:</p>
      <ul>
        <li><strong>Contact details:</strong> your name, phone number, email address and social media username.</li>
        <li><strong>Enquiry details:</strong> answers you give in our forms or messages, such as your investment interests, approximate investment amount and preferred way to be contacted.</li>
        <li><strong>Client information:</strong> if you become a client, information required under SEBI regulations, including KYC details, financial information, investment objectives and risk profile.</li>
        <li><strong>Technical information:</strong> when you visit our website, basic data such as browser type, device, pages visited and approximate location, collected through cookies and analytics tools.</li>
      </ul>
      <p>If you contact us through a Meta advertisement or Instagram message, Meta Platforms shares with us the information you choose to submit. Meta's own handling of your data is governed by its privacy policy.</p>

      <h2><span>2.</span>How we use your information</h2>
      <ul>
        <li>To respond to your enquiry and arrange a conversation with our advisers.</li>
        <li>To understand whether our services suit your needs.</li>
        <li>To provide research, advisory services and client support if you engage us.</li>
        <li>To carry out KYC, risk profiling and suitability assessment as required by SEBI.</li>
        <li>To send you service updates, and marketing communication only where you have agreed to receive it.</li>
        <li>To improve our website and content.</li>
        <li>To meet legal, regulatory and audit obligations.</li>
      </ul>

      <h2><span>3.</span>Consent</h2>
      <p>By submitting your details through our website, forms, advertisements or messages, you consent to us processing your personal data for the purposes described here. You can withdraw consent at any time by writing to us (see section 10). Withdrawal does not affect processing already carried out, or processing we must continue to meet legal or regulatory requirements.</p>

      <h2><span>4.</span>Sharing your information</h2>
      <p>We do not sell or rent your personal information. We share it only with:</p>
      <ul>
        <li>Service providers who help us operate, such as hosting, email, messaging, CRM and payment providers, bound to keep your data confidential.</li>
        <li>KYC registration agencies and other entities where required for client onboarding.</li>
        <li>SEBI, stock exchanges, auditors, courts or other authorities where required by law.</li>
      </ul>

      <h2><span>5.</span>Cookies and analytics</h2>
      <p>Our website may use cookies and similar tools, including analytics and advertising tools such as Google Analytics and the Meta Pixel, to understand how visitors use the site and to measure our advertising. You can disable cookies in your browser settings, though some parts of the site may not work as intended.</p>

      <h2><span>6.</span>How long we keep your data</h2>
      <p>Enquiry data from people who do not become clients is kept for up to 12 months and then deleted, unless you ask us to delete it sooner. Client records are kept for at least five years, or longer if SEBI regulations or other laws require it.</p>

      <h2><span>7.</span>How we protect your data</h2>
      <p>We use reasonable technical and organisational safeguards, including access controls and secure storage, to protect your information from unauthorised access, loss or misuse. No method of transmission or storage is completely secure, but we work to protect your data and will notify you and the relevant authorities of any breach as required by law.</p>

      <h2><span>8.</span>Your rights</h2>
      <p>Subject to applicable law, you have the right to:</p>
      <ul>
        <li>Request a summary of the personal data we hold about you.</li>
        <li>Ask us to correct, complete or update your data.</li>
        <li>Ask us to delete your data, except where we must keep it by law.</li>
        <li>Withdraw your consent.</li>
        <li>Nominate another person to exercise these rights in the event of your death or incapacity.</li>
        <li>Raise a grievance with us, and escalate it to the Data Protection Board of India if unresolved.</li>
      </ul>
      <p>To exercise any of these rights, write to us at the email in section 10. We will respond within 30 days.</p>

      <h2><span>9.</span>Children</h2>
      <p>Our services are meant for individuals aged 18 and above. We do not knowingly collect personal data from anyone under 18. If you believe a minor has shared data with us, please contact us and we will delete it.</p>

      <h2><span>10.</span>Contact and grievance officer</h2>
      <div className="pp-contact">
        <p><strong>Grievance Officer:</strong> Ritik Anil Soni</p>
        <p><strong>Entity:</strong> Ritik Anil Soni</p>
        <p><strong>Email:</strong> <a href="mailto:vinstocks.help@gmail.com">vinstocks.help@gmail.com</a></p>
        <p><strong>Phone:</strong> +91 79775 24553</p>
        <p><strong>Address:</strong> Vastuvinayak building, Lodha Heritage, Dombivli</p>
      </div>
      <p style={{ marginTop: "1rem" }}>For complaints about our advisory services, you may also use SEBI's SCORES portal at <a href="https://scores.sebi.gov.in" target="_blank" rel="noopener noreferrer">scores.sebi.gov.in</a>.</p>

      <h2><span>11.</span>Changes to this policy</h2>
      <p>We may update this policy from time to time. The latest version will always be on this page with the updated date shown at the top.</p>

      <footer className="pp-footer">
        <p>Ritik Anil Soni · SEBI Registered Investment Adviser · Reg. No. INA000021766</p>
        <p>Investments in securities are subject to market risks. Read all related documents carefully before investing.</p>
      </footer>
    </main>
  </div>
  );
};

export default PrivacyPolicy;
