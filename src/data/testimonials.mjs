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
 * The attribution lines carry the state only, matching the rule for projects —
 * that is our label for where the job was, not words the customer said.
 *
 * ACTION: get names and locations for the five unnamed reviews below.
 */
export const testimonials = [
  {
    quote:
      'They sat with us for the plan three times before drawing a line. The house works exactly as promised.',
    name: 'Rajesh Bansal',
    project: 'Residence · Haryana',
    rating: 5,
  },
  {
    quote:
      'Our Chandigarh office was handed over on the date they promised, snag list closed in a week.',
    name: 'Naveen Gupta',
    project: 'Office fit-out · Chandigarh',
    rating: 5,
  },

  /* ------------------------------------------------------------------
     Supplied by the client as the substance of what their customers say.
     The wording is written up from their notes; the Hinglish one is kept in
     Hinglish because that is how it was given and how it reads true.

     NO NAMES: the client has not said who said these, and inventing a
     customer to sign a five-star review would be fabricating an endorsement.
     They render without an attribution line until real names and locations
     arrive — unnamed reviews are weaker, so these are worth chasing.
     ------------------------------------------------------------------ */
  {
    quote:
      'Whatever material they said would go into our home is what went in. Nothing cheap, nothing substituted quietly.',
    name: '',
    project: '',
    rating: 5,
  },
  {
    quote:
      'Proper safety on our site from start to finish, and their staff behaved well with everyone in the house.',
    name: '',
    project: '',
    rating: 5,
  },
  {
    quote:
      'They work to proper technical method — vibrators used in every casting, nothing left to guesswork.',
    name: '',
    project: '',
    rating: 5,
  },
  {
    quote: 'The quality of their work is better than anyone else we looked at before deciding.',
    name: '',
    project: '',
    rating: 5,
  },
  {
    quote:
      'Hum rates ko lekar thoda skeptical the, lekin quality of work aur material ek dum justified hai.',
    name: '',
    project: '',
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
