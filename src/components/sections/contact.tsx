import type { Content, Locale } from "@/content/types";
import { GITHUB_URL, LINKEDIN_URL, resumeHref } from "@/content";
import { ButtonLink } from "../ui";

type Props = { contact: Content["contact"]; footer: string; whatsapp: string; locale: Locale };

export function ContactSection({ contact, footer, whatsapp, locale }: Props) {
  const other: Locale = locale === "pt" ? "en" : "pt";
  const links = [
    { label: "LinkedIn", href: LINKEDIN_URL },
    { label: "GitHub", href: GITHUB_URL },
    { label: contact.resumeAlt, href: resumeHref(other) },
  ];
  return (
    <section id="contato" data-stage="sphere" aria-labelledby="contact-title" className="flex min-h-[100svh] scroll-mt-16 flex-col justify-center pt-28">
      <div className="wrap flex-1 content-center">
        <div className="max-w-2xl">
          <p className="eyebrow">{contact.eyebrow}</p>
          <h2 id="contact-title" className="mt-4 text-balance font-display text-5xl font-extrabold leading-[0.98] tracking-tight sm:text-7xl">
            {contact.title}
          </h2>
          <p className="mt-6 max-w-lg text-pretty text-lg leading-relaxed text-muted">{contact.body}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href={whatsapp} target="_blank" rel="noopener noreferrer">
              {contact.whatsapp}
            </ButtonLink>
            <ButtonLink href={`mailto:${contact.email}`} variant="secondary">
              {contact.email}
            </ButtonLink>
            <ButtonLink href={resumeHref(locale)} variant="secondary">
              {contact.resume}
            </ButtonLink>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="link-draw inline-flex min-h-11 items-center text-muted hover:text-ink">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <footer className="wrap mt-16 flex flex-col gap-2 border-t border-line py-6 text-sm text-faint sm:flex-row sm:justify-between">
        <span>{contact.note}</span>
        <span>{footer}</span>
      </footer>
    </section>
  );
}
