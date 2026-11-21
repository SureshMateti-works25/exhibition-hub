# 🎪 Numaish Bazaar 2027 (Exhibition Society Digital Platform)

A trendy, mobile-first Progressive Web Application (PWA) built for the **Numaish / All India Industrial Exhibition Society** (Hyderabad). This platform replaces the legacy downloadable PDF stall application form with a digital onboarding pipeline, daily live story drops, an interactive exhibition grounds map, and zero-waiting stall pickup or home delivery ordering.

---

## 📱 Key Highlights & Architecture

### 1. Role-Based Experience (Switch via Top Bar or Mobile Bottom Nav)
- **🛍️ Shopper / Customer View**:
  - **Live "Today's Update" Stories Reel**: 60-second video/photo drops from vendors featuring flash discounts and fresh batches (e.g. fresh Haleem out of the deg, 50% discount on last 10 Banarasi sarees).
  - **10 Official Society Categories**: Handlooms, Handicrafts, Ready-Made Garments, Home Furnishings, Crockery & Home Essentials, Jewelry & Accessories, Leather Goods & Footwear, Electronics & Appliances, Dry Fruits & Food Items, and Amusement & Attractions.
  - **Interactive Grounds Map**: Clickable SVG floor plan of Nampally Exhibition Grounds with 3 main gates (Ajanta Gate, Gandhi Bhavan Gate, Goshamahal Gate), pavilions, and stall pinpoint navigation.
  - **Dual Ordering Choice**:
    - **Zero-Wait Stall Pickup**: Order online and show a 4-digit token at the physical booth to skip the long evening queue.
    - **Home Delivery**: Nationwide doorstep courier delivery.
  - **WhatsApp Virality**: One-tap direct chat pre-filled with product title and stall booth number for immediate customer-vendor communication.
  - **Multilingual Support**: Switch seamlessly between English, Telugu (తెలుగు), Hindi (हिंदी), and Urdu (اردو).
  - **Device Frame Toggle**: Switch between an authentic iPhone 16 Pro mockup frame and a fluid responsive desktop experience.

- **🏪 Vendor Portal**:
  - **Digital Stall Application Wizard**: 5-step digital onboarding replacing the PDF form: Mobile OTP verification, business profile, category picker, mandatory KYC/FSSAI/Handloom Mark upload, stall size preference (Standard, Prime Corner, Food Stall), and real-time status tracker (*Submitted → Under Review → Approved → Fee Paid → Stall Allotted*).
  - **60-Second "Live Drop" Publisher**: Quickly take a photo, add a caption, attach a flash discount tag, and publish directly to the live feed.
  - **Dynamic Catalog Schema**: Category-aware attributes form that adapts fields dynamically (Fabric/Weave for Handlooms; Dietary/FSSAI for Food; Material/Sizes for Footwear).
  - **Digital Booth QR Kit**: Standee view with printable QR code for physical stall tables, allowing visitors to scan and browse the full catalog.
  - **Order & Pickup Manager**: Verify 4-digit pickup codes from customers and manage sales.

- **🏛️ Society Admin & Audit Console**:
  - **Application Review Queue**: Filter applications, verify KYC and GI/FSSAI certificates, request revisions, approve, and allot booth codes (e.g., H-14, FD-02).
  - **Automated Alerts**: Preview SMS/WhatsApp notifications sent to vendors upon status changes.
  - **DPDP Act 2023 Compliance & Security Trail**: Tamper-evident append-only audit log with cryptographic hash verification and before/after state diffs for regulatory transparency.

---

## 🚀 Running the Project

The dev server is currently running:
- **Local Browser:** [http://localhost:3000](http://localhost:3000)
- **Local Mobile Devices (Same Wi-Fi):** `http://<your-lan-ip>:3000`

To start or rebuild manually:
```bash
# Start Vite development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
