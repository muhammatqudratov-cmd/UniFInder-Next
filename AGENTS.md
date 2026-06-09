Go outside of project and read uni-finder/docs.md first

# Uni-Finder Frontend — Agent Reference

## What is Uni-Finder?

Uni-Finder is a **university discovery and listing platform** focused on South Korea. It is a Next.js 14 (Pages Router) frontend that connects to a NestJS GraphQL backend. Users browse universities by location, type, tuition range, and facilities; bookmark favourites; leave reviews; follow other members; and write community articles. Agents (university brokers) manage their own listings. Admins manage users, universities, articles, and CS content through a separate admin panel at `/pages/_admin/`.

The codebase was originally a real-estate platform (Nestar). University fields (`universityTuition`, `universityCampusSize`, `universityCapacity`, `universityFaculties`, `universityDormitory`, `universityScholarship`) are direct domain-concept renames from property fields. Treat them as university domain concepts.

---

## Full Tech Stack

| Layer             | Technology                                                                   |
| ----------------- | ---------------------------------------------------------------------------- |
| Framework         | Next.js 14.2.0 — **Pages Router** (no App Router)                            |
| Language          | TypeScript 4.6.2, strict mode                                                |
| UI components     | MUI v5 (`@mui/material`, `@mui/icons-material`, `@mui/lab`)                  |
| Styling           | SCSS (global files) + MUI ThemeProvider (`scss/MaterialTheme/`)              |
| GraphQL client    | Apollo Client v3 with reactive vars (`makeVar`)                              |
| File upload       | `apollo-upload-client`                                                       |
| Real-time         | WebSocket via `subscriptions-transport-ws` + custom `LoggingWebSocket` class |
| Auth              | JWT in `localStorage` (`accessToken`), decoded with `jwt-decode`             |
| i18n              | `next-i18next` 14 — locales: `en`, `kr`, `ru`                                |
| Alerts            | SweetAlert2 (`libs/sweetAlert.ts` wrappers)                                  |
| Carousel          | Swiper 8                                                                     |
| Rich text         | `@toast-ui/react-editor`                                                     |
| 3D hero           | `@react-three/fiber`, `@react-three/drei`, `three`                           |
| Date formatting   | `moment`                                                                     |
| Number formatting | `numeral`                                                                    |
| Linting           | ESLint + `eslint-config-next`                                                |
| Formatting        | Prettier — tabs, singleQuote, trailingComma all, printWidth 120              |

**Environment variables** (`.env.development`, exposed in `next.config.js`):

```
REACT_APP_API_URL=http://localhost:3004
REACT_APP_API_GRAPHQL_URL=http://localhost:3004/graphql
REACT_APP_API_WS=ws://localhost:3004
```

---

## Folder Structure

```
/
├── pages/                       # Next.js pages — 1 file = 1 route
│   ├── _app.tsx                 # Root: ApolloProvider + ThemeProvider + i18n + global SCSS
│   ├── _document.tsx            # HTML shell with SEO meta tags
│   ├── index.tsx                # Homepage (/)
│   ├── university/
│   │   ├── index.tsx            # University list + filter + pagination
│   │   └── detail.tsx           # Single university: images, comments, similar listings
│   ├── agent/
│   │   ├── index.tsx
│   │   └── detail.tsx
│   ├── community/
│   │   ├── index.tsx
│   │   └── detail.tsx
│   ├── member/index.tsx         # Public member profile
│   ├── mypage/index.tsx         # Authenticated user's own page
│   ├── about/index.tsx
│   ├── account/join.tsx         # Login / Sign up
│   ├── cs/index.tsx             # Customer Support (FAQ, Notice, Inquiry tabs)
│   └── _admin/                  # Admin panel (MemberType.ADMIN only)
│       ├── index.tsx
│       ├── universities/index.tsx
│       ├── users/index.tsx
│       ├── community/index.tsx
│       └── cs/{faq,notice,inquiry}.tsx
│
├── libs/                        # All shared frontend logic
│   ├── auth/index.ts            # JWT helpers: getJwtToken, logIn, signUp, logOut, updateUserInfo
│   ├── config.ts                # Constants: REACT_APP_API_URL, Messages, universityYears, topUniversityRank
│   ├── utils.ts                 # formatterStr (numeral), likeTarget*Handler helpers
│   ├── sweetAlert.ts            # SweetAlert2 wrappers (sweetErrorAlert, sweetTopSmallSuccessAlert, etc.)
│   ├── hooks/
│   │   └── useDeviceDetect.ts   # Returns 'mobile' | 'desktop' from navigator.userAgent
│   ├── types/                   # TypeScript interfaces — mirror the GraphQL schema
│   │   ├── common.ts            # T = any  (use only for Apollo onCompleted data)
│   │   ├── customJwtPayload.ts
│   │   ├── university/
│   │   │   ├── university.ts          # University, Universities, MeLiked, TotalCounter
│   │   │   ├── university.input.ts    # UniversityInput, UniversitiesInquiry, AgentUniversitiesInquiry
│   │   │   └── university.update.ts
│   │   ├── member/
│   │   │   ├── member.ts
│   │   │   ├── member.input.ts
│   │   │   └── member.update.ts
│   │   ├── board-article/
│   │   ├── comment/               # CommentInput, CommentsInquiry, Comment
│   │   ├── follow/
│   │   ├── like/
│   │   └── view/
│   ├── enums/                   # TypeScript enums — must match the backend exactly
│   │   ├── university.enum.ts     # UniversityType, UniversityStatus, UniversityLocation
│   │   ├── member.enum.ts         # MemberType, MemberStatus, MemberAuthType
│   │   ├── common.enum.ts         # Message (error strings), Direction (ASC | DESC)
│   │   ├── comment.enum.ts        # CommentGroup (UNIVERSITY | ARTICLE)
│   │   ├── board-article.enum.ts
│   │   ├── like.enum.ts
│   │   ├── notice.enum.ts
│   │   ├── notification.enum.ts
│   │   └── view.enum.ts
│   └── components/
│       ├── layout/
│       │   ├── LayoutHome.tsx   # HOC: Top + FiberCanvas + HeaderFilter + Chat + Footer
│       │   ├── LayoutBasic.tsx  # HOC: Top + banner header (route-based bg image) + Chat + Footer
│       │   ├── LayoutFull.tsx   # HOC: Top + full-width header + Chat + Footer
│       │   └── LayoutAdmin.tsx  # HOC: AdminMenuList + content area
│       ├── Top.tsx              # Fixed navbar with language switcher + user avatar
│       ├── Footer.tsx
│       ├── Chat.tsx             # WebSocket chat widget (shown only when user._id exists)
│       ├── common/              # Shared cards: UniversityBigCard, AgentCard, CommunityCard, HeroCanvas
│       ├── homepage/            # Homepage sections: TrendUniversities, PopularUniversities, TopAgents, etc.
│       ├── university/          # Filter.tsx, Review.tsx, UniversityCard.tsx
│       ├── agent/               # ReviewCard.tsx
│       ├── community/           # Teditor.tsx (write), TViewer.tsx (read)
│       ├── cs/                  # Faq.tsx, Inquiry.tsx, Notice.tsx
│       ├── member/              # MemberMenu, MemberArticles, MemberFollowers, MemberFollowings, MemberUniversities
│       ├── mypage/              # MyProfile, MyUniversities, AddNewUniversity, MyFavorites, MyArticles, WriteArticle, etc.
│       └── admin/               # Admin table components for each domain
│
├── apollo/                      # Apollo Client setup + all GQL operations
│   ├── client.ts                # initializeApollo, useApollo — SSR-safe client with upload + WS split link
│   ├── store.ts                 # Reactive vars: userVar (CustomJwtPayload), socketVar (WebSocket), themeVar
│   ├── user/
│   │   ├── query.ts             # GET_UNIVERSITIES, GET_UNIVERSITY, GET_AGENTS, GET_MEMBER,
│   │   │                        #   GET_BOARD_ARTICLES, GET_BOARD_ARTICLE, GET_COMMENTS,
│   │   │                        #   GET_FAVORITES, GET_VISITED, GET_MEMBER_FOLLOWERS, GET_MEMBER_FOLLOWINGS
│   │   └── mutation.ts          # LOGIN, SIGN_UP, UPDATE_MEMBER, LIKE_TARGET_MEMBER,
│   │                            #   CREATE_UNIVERSITY, UPDATE_UNIVERSITY, LIKE_TARGET_UNIVERSITY,
│   │                            #   CREATE_BOARD_ARTICLE, UPDATE_BOARD_ARTICLE, LIKE_TARGET_BOARD_ARTICLE,
│   │                            #   CREATE_COMMENT, UPDATE_COMMENT, SUBSCRIBE, UNSUBSCRIBE
│   └── admin/
│       ├── query.ts             # GET_ALL_MEMBERS_BY_ADMIN, GET_ALL_UNIVERSITIES_BY_ADMIN,
│       │                        #   GET_ALL_BOARD_ARTICLES_BY_ADMIN, GET_COMMENTS
│       └── mutation.ts          # UPDATE_MEMBER_BY_ADMIN, UPDATE_UNIVERSITY_BY_ADMIN,
│                                #   REMOVE_UNIVERSITY_BY_ADMIN, UPDATE_BOARD_ARTICLE_BY_ADMIN,
│                                #   REMOVE_BOARD_ARTICLE_BY_ADMIN, REMOVE_COMMENT_BY_ADMIN
│
├── scss/
│   ├── app.scss                 # Entry point: imports variables + reset; base element styles
│   ├── variables.scss           # $font: 'Poppins'; Google Fonts @import
│   ├── reset.scss               # CSS reset
│   ├── pc/
│   │   ├── main.scss            # Imports ALL pc/*.scss files + navbar/header/footer/chat styles
│   │   ├── general.scss         # Shared pc utility classes
│   │   └── {page}/              # One SCSS file per page (homepage, university, agent, mypage,
│   │                            #   community, cs, about, account, admin, member)
│   ├── mobile/
│   │   ├── main.scss
│   │   └── general.scss
│   └── MaterialTheme/
│       ├── index.ts             # exports `light` theme object with full MUI component overrides
│       ├── shadow.ts
│       ├── typography.ts
│       └── styled.ts
│
└── public/
    ├── locales/
    │   ├── en/common.json
    │   ├── kr/common.json
    │   └── ru/common.json
    └── img/                     # Static images (banner, icons, logo, profile, university)
```

---

## Coding Conventions

### TypeScript

- Strict mode is enabled. Use `T` from `libs/types/common.ts` only for Apollo `onCompleted(data: T)` callbacks.
- All interfaces mirror the GraphQL schema. Put them in `libs/types/{domain}/`.
- All enums mirror the backend. Put them in `libs/enums/{domain}.enum.ts`.
- Use `// @ts-ignore` sparingly with an explanatory comment.

### Page components

- Every page is a `NextPage` functional component.
- Wrap with a layout HOC as the default export: `export default withLayoutBasic(MyPage);`
- Use `useDeviceDetect()` to branch mobile vs desktop. Mobile branches may return a placeholder — that is intentional.
- Use `useReactiveVar(userVar)` to read the current user — never thread user as a prop.
- Export `getStaticProps` with `serverSideTranslations` on every public page.
- Set `defaultProps` on the page component for initial query filters.

### Section structure inside pages

Keep these comment-delimited sections in every page component:

```tsx
/** APOLLO REQUESTS **/
/** LIFECYCLE **/
/** HANDLERS **/
```

### Apollo

- Queries → `apollo/user/query.ts` or `apollo/admin/query.ts`. Never inline `gql` inside components.
- `fetchPolicy: 'network-only'` for mutations and any query that must always be fresh.
- `fetchPolicy: 'cache-and-network'` for secondary queries inside detail pages.
- Always include `notifyOnNetworkStatusChange: true` on queries that have a `refetch`.
- After a mutation that changes a list, call the list query's `refetch`.

### SCSS

- New page SCSS files go in `scss/pc/{page}/{name}.scss` and must be imported in `scss/pc/main.scss`.
- Always use `font-family: $font;` (never hardcode `'Poppins'`).
- `.container` = `width: 1300px; margin: 0 auto; display: flex;` — used on every page.
- Class naming: hyphen-case BEM-style (`.university-info-config`, `.left-box`, `.option-includes`).
- No inline styles except for dynamic values (e.g., `backgroundImage` from a prop).

### Naming conventions

| Thing           | Convention                                                             |
| --------------- | ---------------------------------------------------------------------- |
| Page files      | `index.tsx` for lists, `detail.tsx` for detail                         |
| Components      | PascalCase (`UniversityCard.tsx`)                                      |
| GQL const       | SCREAMING_SNAKE (`GET_UNIVERSITIES`)                                   |
| GQL operation   | PascalCase (`GetUniversities`)                                         |
| Event handlers  | camelCase + `Handler` (`likeUniversityHandler`, `sortingClickHandler`) |
| State variables | camelCase, descriptive (`searchFilter`, `universities`, `currentPage`) |

### Prettier (from `.prettierrc`)

- Tabs, tabWidth 2
- Single quotes
- Trailing commas everywhere
- Semicolons on
- Print width 120

---

## Rules You Must Follow

1. **Pages Router only.** All pages go in `pages/`. There is no `app/` directory. Never create one.
2. **Every page needs a layout HOC** (`withLayoutBasic`, `withLayoutMain`, `withLayoutFull`, or `withLayoutAdmin`) as the default export wrapper.
3. **Every public page must export `getStaticProps`** calling `serverSideTranslations(locale, ['common'])`.
4. **All GQL operations go in `apollo/user/` or `apollo/admin/`** — never inline `gql` inside a component file.
5. **All new TypeScript interfaces go in `libs/types/`**, following the domain subfolder structure.
6. **New SCSS files must be imported in `scss/pc/main.scss`** (or `scss/mobile/main.scss` for mobile).
7. **Use `userVar` from `apollo/store.ts`** via `useReactiveVar` for the current user.
8. **Auth guard in handlers:** `if (!user._id) throw new Error(Message.NOT_AUTHENTICATED)` before calling any mutation that requires login.
9. **Error handling:** Wrap all async handlers in `try/catch`, log the error, and call the appropriate `sweet*Alert` from `libs/sweetAlert.ts`.
10. **Image URLs from the API** must be prefixed: `` `${REACT_APP_API_URL}/${image}` `` using the constant from `libs/config.ts`.
11. **Do not modify `apollo/client.ts`** unless changing transport configuration.
12. **i18n strings:** Any string appearing in the navbar, banner headers, or filter labels must have a key in all three locale files (`en`, `kr`, `ru`).
