import { profile } from "./profile";

const whatsappNumber = "923021848264";
const whatsappMessage = "Hi Ali, I came across your portfolio and would like to discuss a project.";

export const emailContact = {
  name: "EMAIL",
  href: `mailto:${profile.email}`,
  external: false,
  cursorState: "contact",
  ariaLabel: "Email Ali Khan",
};

export const socialLinks = [
  {
    name: "GITHUB",
    href: "https://github.com/alikhanglobedev777",
    external: true,
    cursorState: "code",
    ariaLabel: "Visit Ali Khan on GitHub, opens in a new tab",
  },
  {
    name: "LINKEDIN",
    href: "https://linkedin.com/in/ali-khan-mern",
    external: true,
    cursorState: "connect",
    ariaLabel: "Connect with Ali Khan on LinkedIn, opens in a new tab",
  },
  {
    name: "WHATSAPP",
    href: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`,
    external: true,
    cursorState: "chat",
    ariaLabel: "Message Ali Khan on WhatsApp, opens in a new tab",
  },
];

export const githubProfileUrl = socialLinks.find((social) => social.name === "GITHUB").href;
