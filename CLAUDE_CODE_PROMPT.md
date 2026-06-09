# Claude Code — Visual Redesign Prompt

Bu promptni to'g'ridan-to'g'ri **Claude Code** terminaliga yoki chat oynasiga paste qiling.

---

## PROMPT (copy qiling va Claude Code ga bering):

```
Your task is to redesign the VISUAL LAYER ONLY of this Next.js project (Uni-Finder).
Do not change any logic. Only change CSS/SCSS styles, colors, fonts, and the MUI theme.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚫 ABSOLUTE DO NOT TOUCH (zero exceptions):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Any .tsx or .ts file EXCEPT: scss/MaterialTheme/index.ts and scss/MaterialTheme/typography.ts
- Any Apollo queries/mutations: apollo/**/*.ts
- Any type definitions: libs/types/**/*.ts
- Any enums: libs/enums/**/*.ts
- Any hooks: libs/hooks/**/*.ts
- Any auth logic: libs/auth/index.ts
- Any utility functions: libs/utils.ts, libs/sweetAlert.ts, libs/config.ts
- Any page components: pages/**/*.tsx
- Any component logic: libs/components/**/*.tsx
- next.config.js, tsconfig.json, package.json

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ YOU MAY ONLY CHANGE THESE FILES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- scss/variables.scss
- scss/reset.scss
- scss/app.scss
- scss/MaterialTheme/index.ts
- scss/MaterialTheme/typography.ts
- scss/MaterialTheme/shadow.ts
- scss/pc/general.scss
- scss/pc/main.scss
- scss/pc/homepage/homepage.scss
- scss/pc/university/university.scss
- scss/pc/university/detail.scss
- scss/pc/agent/agent.scss
- scss/pc/agent/detail.scss
- scss/pc/community/community.scss
- scss/pc/community/detail.scss
- scss/pc/community/write.scss
- scss/pc/mypage/mypage.scss
- scss/pc/mypage/addNewUniversity.scss
- scss/pc/mypage/myUniversities.scss
- scss/pc/mypage/myFavorites.scss
- scss/pc/mypage/myProfile.scss
- scss/pc/mypage/myArticles.scss
- scss/pc/mypage/writeArticle.scss
- scss/pc/cs/cs.scss
- scss/pc/about/about.scss
- scss/pc/account/join.scss
- scss/pc/admin/admin.scss
- scss/pc/member/memberPage.scss
- scss/pc/member/memberArticles.scss
- scss/pc/member/memberFollows.scss
- scss/pc/member/memberUniversities.scss

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 NEW DESIGN SYSTEM TOKENS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COLORS:
  --bg-base:            #171309   (page background — very dark warm charcoal)
  --bg-surface:         #1f1b11   (card/section background)
  --bg-surface-mid:     #231f15   (elevated cards)
  --bg-surface-high:    #2e2a1f   (hover state cards)
  --bg-surface-bright:  #3e392d   (active/selected)
  --text-primary:       #ebe1d1   (main body text)
  --text-secondary:     #d1c5ac   (muted/secondary text)
  --text-tertiary:      #9a9078   (placeholder, labels)
  --border-default:     #4e4633   (card borders)
  --border-subtle:      rgba(255,255,255,0.08)  (glass borders)
  --accent-gold:        #f5c518   (PRIMARY — buttons, badges, active states)
  --accent-gold-soft:   #ffe5a0   (hover text color)
  --accent-gold-dark:   #3d2f00   (text ON gold background)
  --accent-gold-dim:    #695200   (secondary text ON gold)
  --accent-teal:        #bdefff   (tertiary accent)
  --error:              #ffb4ab   (error states)

TYPOGRAPHY:
  Font: 'Plus Jakarta Sans', sans-serif  (replaces Poppins)
  Google Fonts URL: https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap

  Scale:
    Headline XL:  48px / weight 800 / letter-spacing -0.02em / line-height 1.1
    Headline LG:  32px / weight 700 / letter-spacing -0.01em / line-height 1.2
    Headline MD:  24px / weight 600 / line-height 1.3
    Body LG:      18px / weight 400 / line-height 1.6
    Body MD:      16px / weight 400 / line-height 1.6
    Label Caps:   12px / weight 700 / letter-spacing 0.15em / UPPERCASE
    Label SM:     14px / weight 500 / line-height 1.4

SPACING (8px base grid):
  xs: 4px | sm: 12px | md: 24px | lg: 48px | xl: 80px

BORDER RADIUS:
  sm: 6px | md: 8px | lg: 12px | xl: 16px | pill: 9999px

GLASS CARD:
  background: rgba(255, 255, 255, 0.04)
  border: 1px solid rgba(255, 255, 255, 0.08)
  backdrop-filter: blur(12px)
  border-radius: 12px
  Hover: border-color rgba(255,255,255,0.2), transform translateY(-4px)

PRIMARY BUTTON:
  background: #f5c518
  color: #3d2f00
  border-radius: 8px
  Hover glow: box-shadow 0 0 15px rgba(245, 197, 24, 0.5)

SECONDARY BUTTON:
  background: transparent
  border: 1px solid rgba(255, 255, 255, 0.2)
  color: #ebe1d1

INPUT FIELD:
  background: rgba(0, 0, 0, 0.25)
  border: 1px solid rgba(255, 255, 255, 0.1)
  color: #ebe1d1
  border-radius: 8px
  Focus: border-color #f5c518, box-shadow 0 0 0 2px rgba(245,197,24,0.2)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 STEP-BY-STEP INSTRUCTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1 — scss/variables.scss:
Replace the entire file with:
  - Change Google Fonts import: Poppins → Plus Jakarta Sans (weights 400;500;600;700;800)
  - Change $font variable: 'Poppins' → 'Plus Jakarta Sans'
  - ADD all design tokens as SCSS variables:
    $bg-base, $bg-surface, $text-primary, $text-secondary, $accent-gold, etc.
  - ADD CSS custom properties in :root {} block matching the token list above

STEP 2 — scss/MaterialTheme/index.ts:
Update ONLY the color values in the `light` object (keep all component structure/keys):
  - background.default: '#171309'
  - background.paper: '#1f1b11'
  - primary.main: '#f5c518'
  - primary.contrastText: '#3d2f00'
  - secondary.main: '#bdefff'
  - text.primary: '#ebe1d1'
  - text.secondary: '#d1c5ac'
  - MuiCssBaseline html+body background: '#171309'
  - MuiOutlinedInput backgroundColor: '#1f1b11', border: '1px solid rgba(255,255,255,0.1)'
  - MuiButton color: '#ebe1d1'
  - MuiChip border: '1px solid rgba(255,255,255,0.12)', color: '#ebe1d1'
  - MuiDivider borderColor: '#4e4633'
  - MuiLink color: '#d1c5ac'
  Keep ALL component keys (MuiTypography, MuiButton, etc.) — only change color hex values.

STEP 3 — scss/MaterialTheme/typography.ts:
  - Change fontFamily to: '"Plus Jakarta Sans", sans-serif'
  - Update h1-h4 font weights to 700-800
  - Keep all other typography structure intact

STEP 4 — scss/reset.scss:
  - body: add background: #171309; color: #ebe1d1;
  - Keep all CSS reset rules unchanged

STEP 5 — scss/pc/general.scss (UniversityBigCard, AgentCard, CommunityCard):
Apply dark glass theme to all cards:
  .university-big-card-box:
    .info: background → #231f15, border → 1px solid #4e4633
    .title: color → #ebe1d1
    .desc: color → #9a9078
    .options span: color → #d1c5ac
    div.status: background → #f5c518, color → #3d2f00
    div.price: background → #1f1b11, color → #ebe1d1, border → 1px solid #4e4633

  .agent-general-card:
    .agent-info strong: color → #ebe1d1
    .agent-info span: color → #d1c5ac
    div (badge): background → #f5c518, color → #3d2f00

  .community-general-card-config:
    .desc-box .title: color → #9a9078
    .desc-box .desc: color → #ebe1d1
    .date-box: background → #231f15, border → 1px solid #4e4633
    .date-box .month/.day: color → #ebe1d1

STEP 6 — scss/pc/homepage/homepage.scss:
  - All color: #181a20 → color: #ebe1d1
  - All background: #fff → background: #171309 or #1f1b11 (for sections)
  - All border: #ddd or #eee → border: #4e4633
  - Swiper pagination bullets: background: #f5c518 (active)
  - Any button backgrounds: use #f5c518 for primary, rgba(255,255,255,0.08) for secondary
  - Section labels/eyebrows: color: #ffe5a0, font-size: 12px, letter-spacing: 0.15em, text-transform: uppercase

STEP 7 — All remaining SCSS files (university, agent, community, mypage, cs, admin, member):
Apply these universal rules to EVERY SCSS file:
  a) Replace ALL instances of:
     #181a20, #212121, #333 → #ebe1d1  (primary text)
     #717171, #757575, #616161 → #9a9078  (secondary text)
     #fff, white → #1f1b11  (card backgrounds) or #171309 (page bg)
     background: #f4f6f8, #fafafa, #f5f5f5 → #171309
     border: #ddd, #eee, #e0e0e0 → #4e4633
     #e92c28, #eb6753 (old red accent) → #f5c518  (new gold accent)
     #1646c1 (old blue) → #bdefff

  b) Cards and boxes: add backdrop-filter: blur(12px) where appropriate
  c) Input fields: dark recessed look (see INPUT FIELD tokens above)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ VERIFICATION AFTER EACH STEP:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
After editing each file:
1. Run: yarn lint — must pass with 0 errors
2. Confirm NO .tsx or .ts logic files were modified (only the exceptions listed above)
3. Confirm $font variable is still used in all SCSS files (not hardcoded 'Plus Jakarta Sans')
4. Confirm no event handlers, useState, useQuery, useMutation were touched

Do NOT run yarn build — only lint check is needed.
Process all files in the order listed in STEP 1–7.
Start immediately with STEP 1.
```
