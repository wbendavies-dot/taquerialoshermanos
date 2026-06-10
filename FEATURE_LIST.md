# Los Hermanos Redesign — Feature List, Ranked by Business Impact

Each feature is scored on **Revenue Impact**, **Effort**, and backed by the research data in `RESEARCH_REPORT.md`. Tiers are ordered: build Tier 1 before touching Tier 2.

---

## Tier 1 — Direct Revenue Drivers (build first)

### 1. Mobile-first, sub-2-second site architecture
**Impact: Critical · Effort: Medium (foundational)**
83% of restaurant searches are mobile; every extra second of load time loses 7% of orders; mobile-optimized sites capture +42% more orders. This isn't a feature — it's the foundation every other feature's ROI depends on. Compressed WebP/AVIF images, lazy loading, minimal JS, thumb-zone CTAs, sticky bottom "Order Now" bar on mobile.

### 2. Photographed, searchable HTML menu (no PDF)
**Impact: Critical · Effort: Medium**
80% of visitors come for the menu; switching from PDF to HTML menus drives up to +58% completed orders; photo menus convert 25% more; 84% of guests look at photos before ordering. Categories as large tappable blocks, item photos, prices, dietary tags (vegetarian, gluten-free, spice level), search/filter. Every item links into the ordering flow.

### 3. First-party online ordering with frictionless checkout
**Impact: Critical · Effort: High (integrate, don't build — Toast/ChowNow/Owner/Square)**
67% of consumers prefer ordering direct; every order moved off DoorDash recovers 15–30% commission. Requirements from the research: guest checkout, fewest possible steps, persistent visible cart, easy item editing, full pricing shown upfront (no surprise fees), Apple/Google Pay, immediate order confirmation. Optimized "Order Now" button placement alone is worth +34% conversion.

### 4. Catering funnel: dedicated page + multi-step inquiry form
**Impact: Critical (highest AOV — $300–$2,000+ orders) · Effort: Medium**
Dedicated catering page with real event photos, HTML catering menu with per-person pricing and dietary filters, and a multi-step form (event type → date/guests → contact). CTA above the fold within 2 seconds. Instant auto-confirmation email + alert to the owner's phone for **response within one business hour** — speed-to-lead is the #1 catering conversion factor. Leads logged to a CRM or spreadsheet automatically.

### 5. Above-the-fold conversion hero
**Impact: High · Effort: Low**
First screen answers everything in one glance: appetizing hero (photo or short video — video heroes drive +35% time on site), "Order Online" + "View Menu" + "Catering" CTAs, hours/location/phone one tap away. No carousel, no welcome paragraph.

---

## Tier 2 — Engagement & Retention (build second)

### 6. Email/SMS capture with first-order incentive
**Impact: High · Effort: Low**
The Talkin' Tacos playbook: a well-timed pop-up offering 10% off the first online order collected 40,000 contacts and helped reach $120K/month direct sales. Restaurants with direct customer databases grow 5–10x faster. Wire it to a simple email platform (Mailchimp/Klaviyo) from day one.

### 7. Local SEO + Google Business Profile alignment
**Impact: High · Effort: Low–Medium**
66% of guests find restaurants via Google; 89% of mobile searchers act within 24 hours. Schema.org Restaurant/Menu markup, location keywords ("Mexican restaurant [city]", "Mexican catering [city]"), GBP listing catering as a service, consistent hours/phone/address everywhere, `tel:` and native map links.

### 8. Reviews & social proof on-site
**Impact: High · Effort: Low**
74% of guests check reviews/offers on restaurant sites; on-site social proof reduces purchase friction. Pull best Google/Yelp reviews onto the homepage, add "most popular" badges in the menu/ordering flow, and a catering-specific testimonial block (offices, weddings, quinceañeras).

### 9. Family story / "Los Hermanos" brand page
**Impact: Medium-High · Effort: Low**
The differentiation moat. Tacombi-style heritage storytelling: the brothers, the recipes, the hometown. Warm terra cotta/gold/deep-red palette with hand-crafted accents — authentic, not clichéd. This converts first-timers into regulars and feeds every marketing channel.

### 10. Automated catering follow-up sequence
**Impact: Medium-High · Effort: Low (once #4 exists)**
For inquiries that don't book immediately: welcome → menu highlights → testimonials. Track cost per lead, inquiry→order rate, and average catering order value.

---

## Tier 3 — Optimization & Polish (build third)

### 11. Smart upsells in the ordering flow
**Impact: Medium-High · Effort: Medium**
"Add guac / churros / drinks" prompts at checkout — AI-assisted or simple rules-based pairing. Worth +15–25% average order value per the 2026 trend data.

### 12. Accessibility (WCAG 2.1 AA)
**Impact: Medium · Effort: Low if built-in from the start**
High contrast, readable type, screen-reader support, keyboard navigation. Larger audience + legal protection; cheap now, expensive to retrofit.

### 13. Instagram feed + UGC integration
**Impact: Medium · Effort: Low**
Live feed of real food/customer photos (the Tiki Chick pattern). Keeps the site fresh without manual updates and links engagement back to ordering.

### 14. Micro-animations & interactive feedback
**Impact: Medium (perceived quality) · Effort: Low–Medium**
Scroll-triggered reveals, button feedback, cart animations. Signals "premium" — but never at the cost of the 2-second load budget.

### 15. Events / specials module
**Impact: Medium · Effort: Low**
Taco Tuesday, happy hour, Cinco de Mayo, live music. Gives regulars a reason to return to the site and feeds the email list content.

### 16. Loyalty program integration
**Impact: Medium-High long-term · Effort: High**
85% more repeat customers for restaurants with loyalty/apps — but it depends on ordering volume existing first. Phase it in after first-party ordering has traction.

### 17. Analytics & conversion tracking
**Impact: Enabler · Effort: Low**
GA4 + ordering-platform analytics: track menu→cart→checkout funnels, catering form drop-off, mobile vs desktop conversion. This is how every feature above gets validated and tuned.

---

## What NOT to build

Based on the research, these are common money-wasters:
- **PDF menus** — directly suppress orders (up to 58% fewer completions)
- **Image carousels/sliders in the hero** — kill load time, dilute the CTA
- **Autoplay background music, splash screens, reservation-style friction for takeout**
- **Sending ordering traffic to third-party apps from your own site** — paying 15–30% commission on customers you already won
- **Generic stock photography** — 45% of visitors look for food photos first; fake ones destroy trust

---

## Suggested build order (90-day view)

| Phase | Features | Outcome |
|---|---|---|
| **Weeks 1–4** | #1, #2, #5 | Fast mobile site with a converting menu |
| **Weeks 5–8** | #3, #4, #7 | Online ordering live + catering funnel live + findable on Google |
| **Weeks 9–12** | #6, #8, #9, #10, #17 | Retention engine + brand story + measurement |
| **Ongoing** | #11–#16 | Optimize AOV, engagement, repeat rate |
