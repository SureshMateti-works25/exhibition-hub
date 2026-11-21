# Exhibition Stalls Application: Proposed Approach

A platform where vendors apply for stalls, showcase products daily, and take orders online or directly. Prepared for the Numaish / Exhibition Society stall model (exhibitionsociety.com/stalls).

## Context

The Exhibition Society stalls page lists 10 categories: Handlooms, Handicrafts, Ready-Made Garments, Home Furnishings, Crockery & Home Essentials, Jewelry & Accessories, Leather Goods & Footwear, Electronics & Appliances, and Dry Fruits & Food Items. Each has sub-types (for example Pochampally Ikat, Banarasi Silk and Chikankari under Handlooms). Stall applications are currently a downloadable PDF form, and the page shows a 15 Nov 2026 deadline for Numaish 2027. This app would replace the paper process and add a digital showcase and order flow.

## 1. Users and roles

| Role | What they do |
| --- | --- |
| **Vendor** | Applies for a stall, pays fees, manages the catalog, posts daily updates, handles orders |
| **Society admin / reviewer** | Reviews applications, approves or rejects, allots stall numbers, monitors compliance |
| **Customer** | Browses by category or stall, follows vendors, orders online or contacts the vendor |
| **Auditor / super admin** | Read-only access to audit logs and reports; manages roles |

## 2. Core modules

### A. Vendor onboarding and stall application

- Sign-up with mobile OTP, then business details, with a category and sub-category picker taken from the society's list.
- Document uploads: ID, GST (if applicable), and FSSAI licence for food vendors. Handloom vendors can add craft certifications such as Handloom Mark or GI tags.
- Admin workflow: Submitted → Under review → Approved / Rejected / Needs changes → Fee paid → Stall allotted. Each status change sends an SMS, WhatsApp or email.
- An optional stall map where admin assigns or vendors pick a location.

### B. Product showcase

- Products have multiple images (compressed automatically), specifications, MRP, discount (% or flat), stock, and variants such as size, colour or weight.
- The specification form changes by category. Handloom asks for fabric, weave and care. Food asks for weight, ingredients, expiry and veg/non-veg. Footwear asks for size and material. Use a flexible JSON attribute schema per category so new categories need no code changes.
- A **"Today's Update" feed**: a quick mobile flow where the vendor snaps photos, adds a caption and price tag, and publishes in under a minute. Add a daily reminder notification and a "last updated" badge so customers see fresh stalls first.

### C. Customer experience

- Browse by category, stall, offers or "new today", with search and filters.
- Product page with a **"Buy online"** button and a **"Visit stall / Contact vendor"** button showing stall number, directions, call and WhatsApp.
- Wishlist, follow-a-stall, and share links (important for WhatsApp virality).

### D. Orders: the customer's choice

1. **Online order:** cart (single-vendor or multi-vendor), UPI or card payment through Razorpay or PhonePe, delivery or pickup at the stall, and order tracking.
2. **Direct enquiry or reserve:** the customer sends an enquiry, the vendor confirms, and the customer pays at the stall or reserves for pickup. It is tracked in the system so the society still has data.
3. Vendors choose which modes they offer. Small vendors may not want to ship.

The key decision is **who handles payments and delivery**. A marketplace model, where the society collects and settles to vendors via Razorpay Route, gives control and commission options but adds compliance work (TCS/GST). A lighter model, where the vendor receives the payment directly, is simpler to start with.

### E. Admin and analytics

- Application queue, bulk actions, and stall allocation.
- Reports on vendors by category, daily uploads, orders, footfall conversion, and vendors who have not updated recently.
- Content moderation: flag or remove inappropriate images or listings.

## 3. Recommended tech stack

- **Frontend:** Next.js (React) + TypeScript + Tailwind, built as a **PWA**. Vendors and customers get an installable app with offline-tolerant uploads and push notifications, without maintaining separate Android and iOS apps at first. Add multilingual support (English, Telugu, Hindi, Urdu), which matters for Hyderabad.
- **Backend:** Node.js (NestJS) or Python (FastAPI) exposing REST/GraphQL APIs.
- **Database:** PostgreSQL (relational data and JSONB for category attributes), Redis for cache and queues, and OpenSearch or Postgres full-text for search.
- **Media:** S3-compatible object storage + CDN, with image resizing to WebP/AVIF on upload. Virus scanning and EXIF/GPS stripping are needed.
- **Auth:** OTP-based login (MSG91/Twilio), JWT with refresh tokens, and role-based access control. Add MFA for admin accounts.
- **Payments:** Razorpay or Cashfree (UPI, cards, split settlements).
- **Notifications:** WhatsApp Business API, SMS and FCM push.
- **Hosting:** AWS or Azure Mumbai/Hyderabad region (data residency), containerised with CI/CD, auto-scaling for the exhibition peak, and monitoring with Grafana or Sentry.

Use a **modular monolith** first. Microservices are overkill for a seasonal event app, and splitting later is easy if needed.

## 4. Privacy, security and auditing

### Privacy (India's DPDP Act 2023 applies)

- Explicit consent at sign-up, with a clear privacy notice and purpose limitation.
- Collect only what is needed. Vendor KYC documents go in encrypted storage visible only to admins, and customer phone numbers are masked from vendors until an order exists.
- Rights to access, correct and delete data; a retention policy so documents are deleted after the event window; a grievance officer contact.

### Security

- TLS everywhere, encryption at rest, and secrets in a vault.
- OWASP Top 10 controls: input validation, rate limiting, CSRF/XSS protection, and signed upload URLs.
- Do not store card data (the payment gateway handles PCI compliance), and run VAPT before launch.
- Daily backups with tested restore.

### Auditing

- An append-only audit log recording who did what, when, from where, and the before/after values. It covers application status changes, price and discount edits, order changes, role changes and document views.
- Tamper-evidence through hash-chaining or write-once storage, with exportable reports for auditors.
- Soft deletes only, so records can be reconstructed.

## 5. Trust and quality features

- A verified-vendor badge after admin approval.
- Rules on discount honesty (for example, no inflated MRP) and counterfeit controls such as a takedown process.
- Ratings and reviews only from verified purchasers.
- Returns and refund policy per category (food and innerwear are usually non-returnable).

## 6. Suggested phases

1. **MVP (6–8 weeks):** vendor registration and application workflow, admin approval, product catalog, daily updates, public browsing, enquiry or "contact vendor", and audit logs.
2. **Phase 2:** online cart and payments, order management, delivery integration (Shiprocket, Delhivery), WhatsApp notifications, and analytics.
3. **Phase 3:** stall map and navigation, AI help (auto-categorising photos, suggesting titles and descriptions from images, translating listings), and a native app if usage justifies it.

Given the stall deadline has just passed and Numaish typically opens around New Year, a lean MVP focused on approved vendors' showcases and enquiries is the realistic target, with online payments following once it is stable.

## 7. Decisions to settle early

- **Payment model:** society-collected marketplace or vendor-direct.
- **Delivery:** pickup-only at the stall, or shipping across India.
- **Fees:** whether stall fees are paid inside the app.
- **Ownership:** who operates the platform, and the terms and conditions for vendors.
