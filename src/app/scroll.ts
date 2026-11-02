/** Smooth-scroll to a section id (used by nav + CTA buttons). */
export function scrollToSection(id: string, ev?: Event) {
  ev?.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
