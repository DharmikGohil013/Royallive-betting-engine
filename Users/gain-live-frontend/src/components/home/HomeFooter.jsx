const quickLinks = [
  { label: "Promotions", href: "/promotions" },
  { label: "VIP Club", href: "/games" },
  { label: "Refer a Friend", href: "/refer" },
  { label: "About Us", href: "/about" },
];

const categoryLinks = [
  { label: "Live Casino", href: "/live-casino" },
  { label: "Sports", href: "/sports" },
  { label: "Cricket", href: "/cricket" },
  { label: "All Games", href: "/games" },
];

const supportLinks = [
  { label: "Help Center", href: "/help" },
  { label: "Live Support", href: "/help" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/privacy" },
];

const socialLinks = [
  { icon: "instagram", href: "https://www.instagram.com", label: "Instagram" },
  { icon: "x", href: "https://www.twitter.com", label: "Twitter" },
  { icon: "facebook", href: "https://www.facebook.com", label: "Facebook" },
];

const SocialIcon = ({ name }) => {
  if (name === "instagram") {
    return (
      <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true" fill="none">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="3.8" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" />
      </svg>
    );
  }

  if (name === "facebook") {
    return (
      <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true" fill="currentColor">
        <path d="M13.7 21v-7.3h2.5l.4-3H13.7V8.8c0-.9.3-1.5 1.6-1.5h1.4V4.6c-.2 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.8v2.4H8.8v3h2.3V21h2.6z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true" fill="currentColor">
      <path d="M18.9 3h2.9l-6.3 7.2L23 21h-5.9l-4.6-6.1L7.2 21H4.3l6.8-7.8L2 3h6l4.1 5.4L18.9 3zm-1 16.2h1.6L7.2 4.7H5.5L17.9 19.2z" />
    </svg>
  );
};

const HomeFooter = () => {
  return (
    <footer className="mt-20 pt-10 pb-28 bg-[#0A0A0F] border-t-2 border-[#00F5FF]/20">
      <div className="px-6 space-y-12">
        <div className="space-y-4">
          <div className="flex items-center">
            <img
              src="/logos/gain-live-logo-banner-7.png"
              alt="Gain Live"
              className="h-20 md:h-24 w-auto object-contain"
            />
          </div>
          <p className="text-on-surface-variant font-body text-sm leading-relaxed max-w-xs">
            The next generation of high-fidelity interstellar gaming and tactical sportsbook experiences.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-y-10 gap-x-6">
          <div className="space-y-4">
            <h3 className="text-primary-container font-headline font-bold text-sm uppercase tracking-[0.15em]">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-on-surface/70 hover:text-primary-container transition-colors text-sm font-label"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-primary-container font-headline font-bold text-sm uppercase tracking-[0.15em]">
              Categories
            </h3>
            <ul className="space-y-3">
              {categoryLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-on-surface/70 hover:text-primary-container transition-colors text-sm font-label"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-primary-container font-headline font-bold text-sm uppercase tracking-[0.15em]">
              Support
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-on-surface/70 hover:text-primary-container transition-colors text-sm font-label"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-primary-container font-headline font-bold text-sm uppercase tracking-[0.15em]">
              Connect
            </h3>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                  className="w-10 h-10 rounded bg-surface-container border border-primary-container/20 flex items-center justify-center text-primary-container hover:bg-primary-container/10 transition-all active:scale-90"
                >
                  <SocialIcon name={link.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#00F5FF]/5 space-y-6">
          <div className="flex items-center justify-between gap-4 opacity-85">
            <div className="flex items-center gap-2 px-2 py-1 border border-on-surface/20 rounded">
              <span className="text-xs font-bold font-headline">18+</span>
            </div>
            
            <img
              src="/logos/gain-live-logo-blue-w-5.png"
              alt="Gain Live Blue"
              className="h-20 md:h-20 w-auto object-contain"
            />
          </div>
          <div className="space-y-4 text-center">
            <p className="text-[10px] text-on-surface-variant font-label leading-relaxed uppercase tracking-widest">
              Gain Live is operated under Interstellar License No. 8048/JAZ. All betting activities are
              monitored for procedural integrity. Play responsibly.
            </p>
            <p className="text-[10px] text-[#00F5FF]/40 font-label">
              © 2026 GAIN LIVE SYSTEMS. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
