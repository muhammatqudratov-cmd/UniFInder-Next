# Uni-Finder — Stitch AI Prompts (Barcha Sahifalar)

> Stitch tahlili: **Premium Tech-Editorial Dark** stil — Glassmorphism + Golden Yellow accent.
> Font: **Plus Jakarta Sans** | Background: `#171309` | Accent: `#f5c518`
> Har bir promptni ishlatishdan oldin **BASE SYSTEM PROMPT**ni qo'shing.

---

## 🔧 BASE SYSTEM PROMPT
*(Har bir promptning boshiga qo'shing)*

```
⚠️ CRITICAL RULE — DESIGN ONLY, NO LOGIC CHANGES:
You are redesigning the VISUAL LAYER ONLY. Do NOT touch, move, rename, or remove:
- Any event handlers (onClick, onChange, onSubmit, etc.)
- Any GraphQL queries or mutations (useQuery, useMutation, gql)
- Any state variables (useState, useReactiveVar, userVar, searchFilter, etc.)
- Any TypeScript interfaces, types, or enums
- Any Apollo Client calls or refetch logic
- Any authentication logic (logIn, logOut, getJwtToken, updateUserInfo)
- Any routing logic (router.push, router.query)
- Any utility functions (sweetAlert, likeTargetHandler, formatterStr, etc.)
- Any props passed between components
- Any API URLs or environment variables

You MAY only change:
✅ CSS class names and inline styles
✅ Colors, backgrounds, gradients, border colors
✅ Font sizes, font weights, letter-spacing, line-height
✅ Padding, margin, gap, border-radius
✅ Box shadows, backdrop-filter, opacity
✅ Layout structure (flexbox/grid arrangement) — as long as all elements remain present
✅ Animation and transition properties
✅ Icon choices (visual only)
✅ Image placeholder descriptions (data-alt attributes)

If a component currently shows data from a variable (e.g. {university.universityName}), keep that exact expression. Only wrap it in new styling.

---

Design system "Uni-Finder Premium Dark" — a South Korean university discovery platform.

COLORS (Material Design 3 dark scheme):
- Background / Surface: #171309 (very dark warm charcoal)
- Surface Container Low: #1f1b11 | Container: #231f15 | High: #2e2a1f
- Primary text (on-surface): #ebe1d1 | Secondary text: #d1c5ac
- Outline: #9a9078 | Outline Variant: #4e4633
- PRIMARY ACCENT: #f5c518 (golden yellow) — used for CTA buttons, active states, rank badges
- Primary (soft): #ffe5a0 — for hover text color
- On-Primary-Container: #695200 (dark text on gold)
- Error: #ffb4ab | Tertiary: #bdefff

TYPOGRAPHY — Plus Jakarta Sans (Google Fonts):
- Headline XL: 48px / 800 weight / -0.02em tracking / 1.1 line-height
- Headline LG: 32px / 700 weight / -0.01em tracking / 1.2 line-height
- Headline MD: 24px / 600 weight / 1.3 line-height
- Body LG: 18px / 400 / 1.6 lh | Body MD: 16px / 400 / 1.6 lh
- Label Caps: 12px / 700 / 0.15em letter-spacing / UPPERCASE
- Label SM: 14px / 500 / 1.4 lh

COMPONENTS:
- Glass card: backdrop-filter blur(12px), bg rgba(255,255,255,0.04), border 1px solid rgba(255,255,255,0.08), radius 12px. Hover: border rgba(255,255,255,0.2), translateY(-4px)
- Glass Dark: bg rgba(0,0,0,0.4), blur 12px, same border
- Primary button: bg #f5c518, text #3d2f00, radius 8px, hover glow: box-shadow 0 0 15px rgba(245,197,24,0.5)
- Secondary button: transparent, border 1px solid rgba(255,255,255,0.2), white text
- Input: bg rgba(0,0,0,0.2), border rgba(255,255,255,0.1), radius 8px. Focus: border #f5c518 with 2px glow
- Pill/chip: radius 999px, bg rgba(255,255,255,0.08), Label Caps font
- Section pattern: Label Caps in #ffe5a0 as eyebrow → Headline LG as title
- Rank badge: filled gold circle (#f5c518) with bold dark number
- Layout: max-width 1200px centered, 64px desktop margins, 8px base grid

STYLE NOTES:
- Dark background breathes — use generous whitespace (80px between sections)
- University card images: dark editorial photography at 60% opacity over gradient
- Hover on cards: scale-110 image with translateY(-4px) card lift
- All interactive elements: 200ms ease-in-out transitions
- App name: "Uni-Finder" (NOT Nestar)
```

---

## 1. 🏠 HOMEPAGE (`/`)

```
[BASE SYSTEM PROMPT]

Design the HOMEPAGE for Uni-Finder. Full desktop layout, dark mode.

NAVBAR (fixed, transparent → glass on scroll):
- Left: "Uni-Finder" in Headline LG / 800 weight / #ebe1d1
- Center nav links (Label Caps): Home (active, #f5c518 underline) | Universities | Agents | Community | My Page | CS
- Right: Language switcher (EN/KR/RU flags) | "Login / Register" pill button in #f5c518

HERO SECTION (full-height 100vh):
- WebGL/shader animated background: 20 small glowing orbs floating upward — colors: blue, green, gold (#f5c518), red, purple. Radial dark vignette over the animation (opacity 40%)
- Center content stack:
  - Label Caps pill in glass: "THE ULTIMATE GUIDE TO UNIVERSITIES"
  - Headline XL: "Find Your " + animated rotating word in #f5c518 (Future / Dream / University / Career / Path) — fade transition every 3 seconds
  - Body LG in #d1c5ac / max-width 640px: "Explore prestigious institutions across South Korea. Your academic excellence starts with a single search."
  - Primary CTA button: "Explore Universities →" with golden glow on hover
- FLOATING SEARCH BAR (bottom of hero, overlapping next section, glass-dark style):
  - 3 dropdowns: LOCATION (Seoul / Busan / Incheon...) | UNIVERSITY TYPE (National / Private / Science...) | FACULTIES (Engineering / Business / Liberal Arts)
  - Tune icon button + circular gold Search button
  - Width: 1000px max, centered, rounded-xl

TOP PERFORMING UNIVERSITIES (bento grid, section below hero):
- Eyebrow: "PREMIUM SELECTION" in Label Caps / #ffe5a0
- Title: "Top Performing Universities" Headline LG
- "VIEW ALL →" link right-aligned
- Bento grid (3-col): 
  - Card 1 (2-col wide, 400px tall): Seoul National University, Rank #1, Gwanak-gu Seoul — full cinematic campus photo (dusk, indigo sky, golden lights)
  - Card 2 (1-col, 400px): KAIST, Rank #2, Daejeon — futuristic metallic architecture, blue-toned
  - Card 3 (1-col, 400px): Korea University, Rank #3 — autumn foliage, gothic stone buildings
  - Card 4 (2-col wide, 400px): Yonsei University, Rank #4 — morning sunlight campus
  - Each card: photo at 60% opacity, gradient from-black/90 at bottom, rank pill badge, name, location, heart button

TRENDING THIS WEEK (horizontal scroll):
- Title: "Trending This Week" Headline LG
- Horizontally scrollable row of glass cards (320px wide each, no scrollbar):
  - Sungkyunkwan University — Private Research — 1.2k likes
  - Hanyang University — Engineering Leader — 942 likes
  - POSTECH — Science & Tech — 870 likes
  - Ewha Womans University — Global Women's Edu — 756 likes
  - Each: campus photo (200px tall), rank badge circle, name, type, like count with filled heart

CONSULT WITH EXCELLENCE (full-width cream section, bg #e8e0d5):
- Left: Headline MD "Consult with Excellence" in dark | Body describing verified admissions experts
- Right: 4 overlapping agent avatars (circles, -16px overlap) + "+24" count circle
- "Find an Agent" dark button

COMMUNITY INSIGHTS (3-column grid):
- Title: "Community Insights" Headline LG
- 3 articles with: 16:9 image, category badge (ADMISSION TIPS / STUDENT LIFE / NEWS), title hovering to #f5c518, 2-line excerpt
  1. "How to Ace Your University Interview" — students in Seoul
  2. "Living on a Student Budget in Seoul" — Korean street food night market
  3. "New GKS Scholarship Quotas Announced" — graduation caps tossed

ACADEMIC CALENDAR & EVENTS (glass container, golden glow blur in corner):
- Title: "Academic Calendar & Events"
- 2-column grid of event cards (each has: date block in gold OR surface-variant, title, description):
  - OCT 24: Spring Admissions Fair at COEX
  - NOV 08: Global Tech Symposium at SNU
- Event cards: bg surface/40, border outline-variant, hover border primary/30, cursor pointer

CTA BANNER:
- Full-width cinematic image (light beam through dark clouds) at 50% opacity
- Golden overlay mix-blend
- Center: Headline XL "Unlock Your Potential", Body, "Start Your Journey" gold pill button

FOOTER (4-column dark, bg surface-container-lowest):
- Logo + tagline + social icons (globe, group, share)
- Discover: Location | University Type | Faculties | Discover Korea
- Support: Terms | Privacy | Popular Searches | CS Center
- Stay Updated: email input + Subscribe Now button
- Bottom bar: © 2024 Uni-Finder | Language switcher (Korean / English active / Chinese)
```

---

## 2. 🎓 UNIVERSITY LIST (`/university`)

```
[BASE SYSTEM PROMPT]

Design the UNIVERSITY LIST PAGE for Uni-Finder. Dark mode.

LAYOUT: Two-column — left sidebar filter (320px fixed) + right content area (fluid)

LEFT FILTER SIDEBAR (glass-dark panel, sticky):
- Title: "Filter" in Headline MD
- Reset All button (secondary, text-only)
- SECTIONS separated by outline-variant dividers:
  1. LOCATION (Label Caps) — 9 city checkboxes with flag pills: Seoul · Busan · Incheon · Daegu · Gyeongju · Gwangju · Chonju · Daejon · Jeju — each checkbox styled: rounded, checked state fills #f5c518
  2. UNIVERSITY TYPE — 5 checkboxes: National | Private | Science | Art | Polytechnic
  3. TUITION RANGE — dual-handle range slider (#f5c518 track fill) with ₩ min/max inputs below
  4. CAMPUS SIZE — range slider (m²)
  5. CAPACITY — range slider (students)
  6. FACULTIES — range slider (count)
  7. OPTIONS — two large toggles: "Scholarship Available" | "Dormitory Available" (glass toggle pills, active = gold)
  8. SORT BY — select dropdown: Created | Tuition | Rank
  9. APPLY FILTERS primary button (full-width gold)

RIGHT CONTENT AREA:
- Top bar: "312 Universities Found" | Sort direction ASC/DESC toggle
- Grid: 3-column card grid, gap 24px
- UNIVERSITY CARD (glass, hover lift + border brighten):
  - Image (200px tall, border-radius 8px top) — campus photo at 60% opacity
  - Top-left on image: like button (heart icon, glass pill)
  - Top-right: rank badge circle in gold
  - Card body (padding 16px):
    - University name: Headline MD
    - Location pill + Type pill (glass chips)
    - Stats row: 💰 Tuition: ₩3.2M/yr | 🏫 5 Faculties | 👥 2,000 capacity
    - Feature badges row: "Scholarship ✓" green pill | "Dormitory ✓" blue pill (or gray ✗)
    - Agent avatar (24px circle) + agent name | Views count
  - Hover: card lifts 4px, border brightens, image scales 110%
- PAGINATION: centered row of numbered buttons (glass pills, active = gold filled, 10 items/page)

PAGE HEADER (above sidebar+content, full-width):
- Breadcrumb: Home > Universities
- Title: "Discover Universities" Headline LG
- Stats chips: "9 Cities · 5 Types · 500+ Universities"
```

---

## 3. 🏛️ UNIVERSITY DETAIL (`/university/detail`)

```
[BASE SYSTEM PROMPT]

Design the UNIVERSITY DETAIL PAGE for Uni-Finder. Dark mode.

BREADCRUMB: Home > Universities > [University Name]

HERO IMAGE GALLERY (full-width, 560px tall):
- Main large image (70% width, left): high-quality campus photo
- Right column (30%): 4 smaller sub-images in a 2×2 grid
- Bottom-right overlay: "View All Photos" glass button
- Top-right overlay: share icon + heart (like) button — glass pill

CONTENT AREA (two-column: 65% left + 35% right sidebar):

LEFT COLUMN:
- University name: Headline XL
- Row of info chips (glass pills): 📍 Seoul | 🏫 National | ⭐ Rank #1 | 👁 1,240 views
- STATS BAR (4-column glass card row):
  - Annual Tuition: ₩3,200,000 (Headline MD in gold) + label
  - Campus Size: 890,000 m²
  - Student Capacity: 28,000
  - Faculties: 16 departments
- FEATURES row (large glass toggles, non-interactive):
  - "Scholarship Available" — gold badge if true
  - "Dormitory Available" — teal badge if true
- DESCRIPTION (Body MD, #d1c5ac, 4–6 paragraphs with rich text formatting)
- Founded: [Year] | Address: full Korean address
- LOCATION MAP PLACEHOLDER (glass container 400px tall, rounded-xl, with a map icon and address)

REVIEW / COMMENTS SECTION:
- Title: "Student Reviews" Headline LG + review count badge
- Write review input (glass dark, multiline, "Share your experience...") + Submit button
- Review cards (glass, author avatar + name + date + body text + like count)
- Pagination for comments

SIMILAR UNIVERSITIES (below main content, full-width):
- Title: "Similar Universities" 
- Horizontal scroll row of 4 University Cards (same card design as list page, 280px wide)

RIGHT SIDEBAR:
- AGENT CARD (glass, sticky):
  - Agent avatar (80px circle) + "Listed by"
  - Agent name: Headline MD
  - Stats: # universities | # likes | # followers
  - "View Profile" secondary button
  - "Contact Agent" primary gold button
- QUICK STATS glass card:
  - Posted date | Last updated | Total likes | Total views
- SHARE card: social share buttons (glass pills)
```

---

## 4. 🔐 LOGIN / REGISTER (`/account/join`)

```
[BASE SYSTEM PROMPT]

Design the LOGIN / REGISTER PAGE for Uni-Finder. Dark mode, full-screen.

LAYOUT: Two-panel split (50/50)

LEFT PANEL (decorative):
- Full Korean university campus image — Seoul National University at golden hour — at 70% opacity
- Gradient overlay: from-#171309/80 via-transparent to-#171309/60
- Center overlay content:
  - "Uni-Finder" logo in Headline LG
  - Tagline: "Discover Korea's Best Universities" in Body LG / #d1c5ac
  - 3 stats chips (glass pills, horizontal row): "500+ Universities" | "9 Cities" | "3 Languages"
- Bottom: row of 3 university thumbnail images (circle, 48px) with "Join 12,000+ students"

RIGHT PANEL (auth form, bg #1f1b11):
- Tab switcher: "Login" | "Register" — active tab gets #f5c518 underline, 2px
- Centered card (max-width 400px, glass-dark, padding 40px, radius 16px)

LOGIN TAB:
- Title: "Welcome Back" Headline LG
- Subtitle: "Sign in to your account" Body MD / #d1c5ac
- Input: "Nickname" (user icon prefix)
- Input: "Password" (lock icon, eye toggle)
- "Forgot Password?" link right-aligned in #ffe5a0
- Primary button (full-width): "Sign In →"
- Divider: "— or —"
- Telegram login button (glass pill, Telegram blue icon + "Continue with Telegram")

REGISTER TAB:
- Title: "Create Account" Headline LG
- Input: "Nickname"
- Input: "Phone Number" (flag + dial code prefix)
- Input: "Password"
- Input: "Confirm Password"
- Account type selector (two large glass cards side-by-side):
  - 👤 "Student / User" — browse and save universities
  - 🏢 "University Agent" — list and manage universities
  - Selected card: border #f5c518, subtle gold glow
- Terms checkbox (small, with link)
- Primary button (full-width): "Create Account →"
- Divider + Telegram register option

BACKGROUND: Animated floating orbs shader (same as homepage hero, opacity 15%)
```

---

## 5. 👤 MY PAGE (`/mypage`)

```
[BASE SYSTEM PROMPT]

Design the MY PAGE (user dashboard) for Uni-Finder. Dark mode.

LAYOUT: Left sidebar menu (260px) + Right content area

TOP PROFILE HEADER (full-width glass card, above sidebar):
- User avatar (96px circle with golden ring border) + Edit photo icon overlay
- Name: Headline MD | Member type badge (glass pill: "Student" or "Agent")
- Stats row: X Universities | X Articles | X Followers | X Following | X Points
- "Edit Profile" button (secondary)

LEFT SIDEBAR MENU:
- Glass-dark panel, sticky
- Menu items (each 48px tall, full-width):
  - 👤 My Profile (active state: bg surface-bright, left border 3px #f5c518)
  - 🏛️ My Universities (agent only — grayed for users)
  - ➕ Add New University (agent only)
  - ❤️ My Favorites
  - 🕐 Recently Visited
  - 📝 My Articles
  - ✏️ Write Article
- Bottom: Logout button in error color (#ffb4ab)

RIGHT CONTENT — MY PROFILE VIEW:
- Section: "Profile Information" Headline MD
- Form card (glass):
  - Avatar upload area (large dashed circle, "Click to upload")
  - Fields: Full Name | Phone | Address | Bio (textarea)
  - Language preference (3 flag toggles: EN/KR/RU)
  - Save Changes button (gold, full-width)

RIGHT CONTENT — ADD NEW UNIVERSITY VIEW:
- Title: "List a New University" Headline LG
- Multi-step form (progress bar in gold, 4 steps):
  Step 1 — Basic Info: Type (5 chips), Location (9 city pills, select), Address, Name
  Step 2 — Details: Tuition input (₩), Campus Size, Capacity, Faculties (number inputs)
  Step 3 — Features: Scholarship toggle | Dormitory toggle | Construction Year picker | Description (rich text editor)
  Step 4 — Images: drag-drop upload zone (glass dashed border) supporting multiple images, preview thumbnails
- Back / Next buttons, final "Submit for Review" gold button

RIGHT CONTENT — MY FAVORITES VIEW:
- Grid of University Cards (same as list page design, 3-col)
- Empty state: illustration + "No favorites yet. Explore universities →" gold link

RIGHT CONTENT — MY ARTICLES VIEW:
- List of article cards (horizontal layout, image left + content right)
- Each: article image, category badge, title, date, stats (views/likes/comments), Edit | Delete actions
```

---

## 6. 🤝 AGENT LIST (`/agent`)

```
[BASE SYSTEM PROMPT]

Design the AGENT LIST PAGE for Uni-Finder. Dark mode.

HERO HEADER:
- Full-width glass header strip (bg surface-container-high)
- Title: "University Agents" Headline LG
- Subtitle: "Connect with certified admissions experts across South Korea" Body MD / #d1c5ac
- Search bar: "Search agents by name or specialty..." (glass input, search icon)

AGENT CARD GRID (3-column, gap 24px):
AGENT CARD design (glass, hover lift):
- Top: agent avatar circle (96px) centered + online indicator dot (green)
- Name: Headline MD centered
- Type badge: "Certified Agent" gold pill
- Stats row (3 cols): Universities listed | Total Likes | Followers
- Specialty chips (glass pills): e.g., "SNU Expert" | "Engineering"
- Short bio: 2 lines / #d1c5ac / Body SM
- Two buttons (full-width row): "View Profile" secondary | "Follow" primary gold
- Hover: card lifts, avatar slightly scales

TOP AGENTS SPOTLIGHT (above the grid):
- Full-width AnimatedTooltip row — 8 large avatar circles (64px) with slight overlap
- On hover: tooltip above showing "Name — X universities"
- Title: "TOP AGENTS THIS MONTH" Label Caps / #ffe5a0

PAGINATION: numbered buttons (glass pills, gold active)
```

---

## 7. 🤝 AGENT DETAIL (`/agent/detail`)

```
[BASE SYSTEM PROMPT]

Design the AGENT DETAIL PAGE for Uni-Finder. Dark mode.

PROFILE HERO (glass-dark section, full-width, padding 60px):
- Agent avatar (120px circle, golden ring border)
- Name: Headline XL
- Verified badge (✓ gold pill)
- Stats row (4 metrics in glass mini-cards): Universities | Articles | Followers | Likes
- "Follow" primary gold button + "Message" secondary button
- Short bio paragraph: Body LG / #d1c5ac

CONTENT TABS (below hero, sticky tab bar in glass):
- "Universities" (active) | "Articles" | "Reviews" | "Followers" | "Following"

TAB — UNIVERSITIES:
- 3-column grid of University Cards (same design as list page)
- Each card shows this agent's listings

TAB — REVIEWS:
- Review cards (glass): reviewer avatar + name + date + star rating (gold stars) + comment body
- Average rating display: large gold number + star row + total count
- Write a review form (textarea + star selector + Submit gold button)

TAB — FOLLOWERS/FOLLOWINGS:
- Grid of member avatar cards (64px circle, name, type badge, Follow button)
```

---

## 8. 📰 COMMUNITY LIST (`/community`)

```
[BASE SYSTEM PROMPT]

Design the COMMUNITY PAGE for Uni-Finder. Dark mode.

HERO STRIP (glass-dark, full-width):
- Title: "Community" Headline LG
- Subtitle: "Insights, tips and stories from Korean university students"
- "Write Article +" primary gold button (right-aligned)

CATEGORY TABS (sticky, glass tab bar):
- All | Free Board | Q&A | Admission Tips | Student Life | News | Recommendations
- Active tab: #f5c518 underline + text color

FEATURED ARTICLE (full-width glass card, horizontal layout, 280px tall):
- Large image left (40%)
- Right: "FEATURED" label (Label Caps gold) | Headline LG title | 3-line excerpt | Author avatar + name + date + stats

ARTICLE LIST (below featured, 2 layouts toggleable):

CARD LAYOUT (3-col grid):
- Article card (glass):
  - 16:9 image with category badge overlay (top-left pill)
  - Category + Date row (Label Caps)
  - Title: Headline MD (hover → #f5c518)
  - 2-line excerpt: Body SM / #d1c5ac
  - Footer: Author avatar (32px) + name + view icon + count + heart icon + count + comment icon + count

LIST LAYOUT (single column):
- Horizontal card: small thumbnail left (120px) + content right + stats right

PAGINATION: gold numbered pills
```

---

## 9. 📄 COMMUNITY ARTICLE DETAIL (`/community/detail`)

```
[BASE SYSTEM PROMPT]

Design the COMMUNITY ARTICLE DETAIL PAGE for Uni-Finder. Dark mode.

ARTICLE HEADER (max-width 800px, centered):
- Category pill (Label Caps, glass)
- Title: Headline XL (tight line-height 1.1)
- Subtitle / excerpt: Body LG / #d1c5ac
- Author row: avatar (48px) + name + "by" label + date + read time + view/like counts
- Tags: glass pills row

HERO IMAGE (full-width, 480px tall, rounded-xl):
- High-quality editorial photo
- Gradient overlay bottom

ARTICLE BODY (max-width 720px, centered, Body LG / #ebe1d1):
- Rich text content (paragraphs, headings in Headline MD, blockquotes with gold left border, code blocks in surface-container-high)

INTERACTION BAR (sticky bottom or floating):
- Heart (like) button — glass pill, count — active state fills gold
- Share button — glass pill
- Comment count chip

COMMENTS SECTION:
- Title: "X Comments" Headline MD
- Write comment input (glass-dark, multiline) + Submit gold button
- Comment cards (glass):
  - Author avatar (40px) + name + date
  - Comment body: Body MD
  - Like button + count | Reply button
  - Nested replies (indented)
- Pagination

RELATED ARTICLES (3-col grid at bottom):
- Same card design as community list page
```

---

## 10. 🙋 CUSTOMER SUPPORT (`/cs`)

```
[BASE SYSTEM PROMPT]

Design the CUSTOMER SUPPORT (CS) PAGE for Uni-Finder. Dark mode.

HERO STRIP:
- Title: "Customer Support" Headline LG
- Subtitle: "How can we help you today?"
- 3 quick-action cards (glass, horizontal row, icons):
  - 📋 FAQ — "Find instant answers"
  - 📢 Notices — "Platform updates & news"
  - ✉️ Contact Us — "Send an inquiry"

TAB BAR (sticky, glass): FAQ | Notices | Contact Us

TAB — FAQ:
- Search input (glass, "Search FAQ...") at top
- Category filter pills (glass): General | Admissions | Accounts | Payment | Technical
- Accordion items (glass cards):
  - Each: question in Label SM / bold | expand icon
  - Open state: answer body in Body MD / #d1c5ac slides down
  - Open item: border-left 3px #f5c518

TAB — NOTICES:
- Notice list (glass cards, horizontal):
  - Date badge (gold, Label Caps) | Title: Headline MD | 2-line preview | "Read more →" link
  - Pinned notices: "📌 PINNED" badge at top
- Detail view (same article layout as community detail, simpler)

TAB — CONTACT US:
- Inquiry form (glass card, max-width 640px centered):
  - Select: Category (General / Admissions / Technical / Report)
  - Input: Subject
  - Textarea: Message (200px min-height)
  - File attachment drop zone (glass dashed)
  - Submit button (gold, full-width)
  - Note: "We respond within 24 hours" Label SM / #d1c5ac
```

---

## 11. 👥 MEMBER PROFILE (`/member`)

```
[BASE SYSTEM PROMPT]

Design the PUBLIC MEMBER PROFILE PAGE for Uni-Finder. Dark mode.

PROFILE HERO (glass-dark section, full-width):
- Background: subtle animated gradient or static campus blur image
- Avatar (100px circle, golden ring if agent)
- Name: Headline LG | Member type badge (Student / Agent)
- Stats row: X Universities | X Articles | X Followers | X Followings | X Likes
- "Follow / Following" toggle button (gold primary when not following, glass when following)
- Bio text: Body MD / #d1c5ac

CONTENT TABS (glass sticky bar):
Universities | Articles | Followers | Followings

TAB — UNIVERSITIES (3-col card grid, same as list page cards)

TAB — ARTICLES (3-col card grid, same as community list cards)

TAB — FOLLOWERS / FOLLOWINGS:
- Grid of member mini-cards (glass):
  - Avatar circle (64px) + name + type badge + "Follow" button
  - 4-col grid
```

---

## 12. ⚙️ ADMIN PANEL (`/_admin`)

```
[BASE SYSTEM PROMPT]

Design the ADMIN PANEL for Uni-Finder. Dark mode. Sidebar navigation layout.

LAYOUT:
- Left sidebar (240px, bg surface-container-lowest, fixed)
- Top header bar (full-width, glass)
- Main content area (fluid)

LEFT SIDEBAR:
- "Uni-Finder Admin" logo at top
- Admin avatar (48px) + "Administrator" label
- Divider
- Navigation sections:
  DASHBOARD: 📊 Overview
  CONTENT: 🏛️ Universities | 👥 Users | 📰 Community
  SUPPORT: ❓ FAQ | 📢 Notices | ✉️ Inquiries
- Bottom: ← Back to Site | Logout

DASHBOARD (overview):
- 4 stat cards (surface-container-high, no border):
  - Total Universities: large gold number + subtitle "↑ 12 this week"
  - Total Users: number + trend
  - Community Articles: number + trend
  - Pending Reviews: number in error color if > 0
- Recent activity feed (glass card): latest 5 actions with timestamp

UNIVERSITIES TABLE (glass container):
- Header: "All Universities" + "Filter" dropdown + CSV export button
- Table columns: Thumbnail | Name | Type | Location | Agent | Status (pill: Active=green/Inactive=gray/Delete=red) | Created | Actions
- Each row: hover surface-container-high
- Status pill: Active (#4caf50 text on surface) | Inactive (gray) | Delete (error)
- Actions: Edit (pencil icon) | Delete (trash icon) — icon buttons
- Pagination at bottom

USERS TABLE:
- Columns: Avatar | Nickname | Type (Student/Agent/Admin pill) | Status | Universities | Articles | Warnings | Actions
- Actions: Change Type | Block | Delete

COMMUNITY TABLE:
- Columns: Image | Title | Author | Category | Status | Views | Likes | Created | Actions

FAQ / NOTICE CRUD:
- List table + "Add New" gold button
- Inline edit row OR modal form (glass-dark modal, centered)

All tables: 
- bg glass (rgba(255,255,255,0.04))
- Header row: surface-container-high bg, Label Caps text
- Row hover: surface-container bg
- 12px radius on container
```

---

## 📌 QISQA FOYDALANISH QO'LLANMASI

1. **Yangi sahifa uchun:** BASE SYSTEM PROMPT + tegishli sahifa promptini Stitch ga bering
2. **Animatsiya uchun:** Homepage promptida shader animation tavsifi bor — Stitch WebGL animatsiya yozadi
3. **Komponentni o'zgartirish uchun:** Faqat o'sha qismni qayta so'rang, Design systemni boshida eslating
4. **Rang o'zgartirmoqchi bo'lsangiz:** BASE PROMPTdagi PRIMARY ACCENT: #f5c518 qatorini o'zgartiring

**Muhim:** Stitch da har safar "Continue this design" o'rniga yangi chat boshlasangiz, BASE SYSTEM PROMPTni albatta qo'shing — aks holda stil buziladi.
