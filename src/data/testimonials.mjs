/**
 * Client testimonials. Rendered once, then duplicated programmatically by the
 * marquee (the duplicate sets are aria-hidden) — never hand-write copies.
 *
 * REPOSITIONING NOTE
 * The handoff carried six quotes written for an architecture practice. Four of
 * them sell services the company no longer offers, or credit an individual
 * rather than the company. They are NOT rendered — they are parked in
 * `pendingTestimonials` below rather than reworded, because putting new words
 * into a named client's mouth would be fabricating a testimonial.
 *
 * The two live quotes have one change each: "he" → "they", since the referent
 * is now a company rather than a person. Even that needs the client's nod.
 *
 * ACTION: ask the client for three or four construction testimonials.
 */
export const testimonials = [
  {
    quote:
      'They sat with us for the plan three times before drawing a line. The house works exactly as promised.',
    name: 'Rajesh Bansal',
    project: 'Residence · Sector 17, Jagadhri',
    rating: 5,
  },
  {
    quote:
      'Our Chandigarh office was handed over on the date they promised, snag list closed in a week.',
    name: 'Naveen Gupta',
    project: 'Office fit-out · Chandigarh',
    rating: 5,
  },
];

/**
 * Held back — each needs the client to supply a replacement, or to confirm a
 * reworded version with the person who said it.
 *
 *   Simran Kaur    — sells 3D renders (service dropped)
 *   Vikram Sethi   — sells a valuation report (service dropped)
 *   Meenakshi Rana — sells a walkthrough video (service dropped)
 *   Harpreet Singh — praises whoever supervised "the contractor"; incoherent
 *                    now that the company *is* the contractor
 */
export const pendingTestimonials = [
  {
    quote:
      'Renders matched the finished showroom so closely that our vendors used them as reference.',
    name: 'Simran Kaur',
    project: 'Retail interior · Ambala',
    rating: 5,
  },
  {
    quote:
      'Valuation report was accepted by the bank without a single query. Handed over in four days.',
    name: 'Vikram Sethi',
    project: 'Valuation · Yamunanagar',
    rating: 5,
  },
  {
    quote: 'The walkthrough convinced my whole family. What was built looks exactly like that video.',
    name: 'Meenakshi Rana',
    project: 'Residence · Radaur',
    rating: 5,
  },
  {
    quote:
      'Every site visit came with a written instruction sheet. The contractor never had an excuse.',
    name: 'Harpreet Singh',
    project: 'Institutional · Yamunanagar',
    rating: 5,
  },
];
