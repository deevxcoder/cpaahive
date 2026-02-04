# CPAHive – Product Requirements Document (FINAL)

> **Last Updated:** February 3, 2026  
> **Version:** 2.0  
> **Status:** Active Development  
> **Design System:** Bluish Dark (Blue + Black)

---

## 📌 Project Overview

**CPAHive** is a professional visual page builder platform built for CPA (Cost Per Action) marketers and content-locker creators.  
It allows users to create high-converting landing pages and offer walls using a drag-and-drop builder, CPA-specific elements, and instant SEO-ready publishing.

This version upgrades the platform to **Next.js** and introduces a **Bluish Dark design system**, while keeping all existing features, logic, and schema unchanged.

---

## 🧱 Final Tech Stack

| Layer | Technology |
|------|------------|
| Framework | **Next.js 14 (App Router)** |
| Language | TypeScript |
| Styling | Tailwind CSS 3 |
| UI Components | shadcn/ui |
| Animations | Framer Motion |
| State Management | Zustand |
| Database & Auth | InstantDB |
| Charts | Recharts |
| Drag & Drop | @dnd-kit |
| Deployment | Vercel (Edge + ISR) |

---

## 🎨 Brand Design System – Bluish Dark

### 🎯 Design Goals
- Professional & premium look  
- Trust-oriented UI for CPA traffic  
- Dark UI optimized for Android / APK users  
- High readability & conversion focus  

Single consistent theme.  
No Bullish / Bearish modes.

---

### 🎨 Color Tokens

```txt
Background (App):        #0A0D14
Background (Surface):    #0F1420
Background (Elevated):   #151B2E

Primary Blue:             #3B82F6
Primary Hover:            #2563EB
Primary Glow:             rgba(59,130,246,0.35)

Accent Cyan:              #22D3EE
Accent Indigo:            #6366F1

Text Primary:             #E5E7EB
Text Secondary:           #9CA3AF
Text Muted:               #6B7280

Border Subtle:            #1F2937
Border Strong:            #27324A

Success:                  #22C55E
Warning:                  #FACC15
Danger:                   #EF4444
```

### 🧩 UI Rules
**Buttons**
- Primary: Blue background + soft blue glow
- Secondary: Transparent with blue border
- CTA buttons use subtle Framer Motion pulse

**Cards / Panels**
- Dark elevated surfaces
- Soft shadows
- Rounded corners (shadcn defaults)
- Hover lift (2–4px)

**Lockers / Blurred Content**
- Blur + dark overlay
- Blue glow around lock icon
- CTA highlighted

### 🌙 Theme System
- Theme: Bluish Dark (Default)
- Scope: Dashboard, Builder, Preview, Published Pages
- Persistence: LocalStorage + InstantDB Profile

### 🧠 Animation Guidelines (Framer Motion)
| Area | Animation |
|------|-----------|
| CTA Buttons | Soft pulse |
| Offer Cards | Hover lift |
| Progress Bars | Smooth fill |
| Live Counter | Count-up |
| Timer | Subtle shake in last seconds |
| Modals | Fade + scale |

Animations must remain CPA-approval safe & performance friendly.

---

## 🧩 Visual Page Builder – Supported Elements (19)
The CPAHive builder provides 19 production-ready elements optimized for CPA marketing and content lockers.

### 🧱 Layout Elements
**1. Row**
- 1–3 column layout
- Background: color / gradient / image
- Overlay & opacity
- Padding & responsive stacking

**2. Spacer**
- Adjustable vertical spacing
- Responsive visibility control

### 📝 Content Elements
**3. Header**
- H1–H4 sizes
- Subtitle support
- Optional icon
- Alignment control

**4. Text**
- Rich text (paragraph, bold, italic)
- Line height & spacing
- Color override

**5. Image**
- Full-width or custom size
- Border radius
- Shadow
- Lazy loading

**6. Button**
- Text + optional icon
- Shape: square / rounded / pill
- Click URL
- Target (_self / _blank)
- Animation support

**7. Link**
- Styled anchor text
- URL configuration
- Target control

### 🎯 CPA-Specific Elements
**8. Offer List**
- List or grid layout
- Badges (FREE / POPULAR)
- Ratings & descriptions
- CTA per offer
- OGAds ready

**9. Single Offer**
- Highlighted CPA offer card
- Custom CTA
- Emphasis styling

**10. Progress Bar**
- Percentage-based
- Animated fill
- Custom labels

**11. Countdown Timer**
- Countdown display
- Auto-expire support
- Urgency animation

**12. Task Tracker**
- “X of Y tasks completed”
- Dynamic progress
- Locker-friendly UI

### 💥 Engagement & Trust Elements
**13. Live Counter**
- Animated count-up
- Custom labels
- Loop option

**14. Trust Badge**
- Security / verified icons
- Custom text

**15. Step Indicator**
- Multi-step visualization
- Active step highlight

**16. Blurred Preview**
- Locked content teaser
- Blur + CTA overlay

**17. Sticky CTA**
- Fixed top/bottom CTA
- Mobile optimized

**18. Username Finder**
- Interactive input
- Loading animation
- Success / error states

**19. Social Buttons**
- Multiple platforms
- Icon-based
- External links

### 📌 Element Rules
All elements support:
- Drag & drop
- Reorder
- Visibility control
- Style customization

Clickable elements support:
- URL linking
- Target selection
- Click tracking (future)

---

## 🗂️ App Router Structure (Next.js)
```
app/
├── (auth)/
│   └── login/
├── dashboard/
│   ├── page.tsx
│   ├── projects/
│   ├── analytics/
│   ├── settings/
│   └── builder/
│       └── [pageId]/
├── p/
│   └── [slug]/        # Published CPA pages (SEO)
├── api/
│   ├── analytics/
│   ├── ogads/
│   └── publish/
├── layout.tsx
├── providers.tsx
└── globals.css
```

## ✅ Existing Features (Unchanged)
- Magic link + OTP authentication
- Visual builder with 19 elements
- Global theme settings
- Device preview (mobile / tablet / desktop)
- Publishing system with slugs
- Project management
- Dashboard stats
- OGAds API settings
- Analytics mockups
- Zustand state architecture
- InstantDB schema

❗ No feature removal or logic rewrite.

---

## 🚀 Improvement Roadmap

### High Priority
- Real-time analytics (OGAds API)
- Clickable elements & tracking
- Templates library
- Undo / Redo system
- A/B testing

### Medium Priority
- Custom domains
- Dynamic offer fetching
- Mobile preview & PWA
- Copy / paste elements
- Collaboration

### Low Priority
- AI features
- Performance optimization
- SEO tools
- Localization
- Advanced targeting

---

## 📊 Metrics to Track
| Metric | Source |
|--------|--------|
| Pages Created | InstantDB |
| Published Pages | InstantDB |
| Page Views | Analytics API |
| Offer Clicks | OGAds API |
| Conversions | OGAds API |
| Revenue | OGAds API |
| Session Duration | Analytics API |
| Bounce Rate | Analytics API |
