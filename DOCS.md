# Uni-Finder Frontend — Documentation

## Project Setup Guide

### Prerequisites
- Node.js 18+ (the project uses Next.js 14)
- A running Uni-Finder backend (NestJS + GraphQL) on port 3004

### 1. Install dependencies
```bash
yarn install
```

### 2. Configure environment

Copy `.env.development` and update if your backend runs on a different host/port:
```env
REACT_APP_API_URL=http://localhost:3004
REACT_APP_API_GRAPHQL_URL=http://localhost:3004/graphql
REACT_APP_API_WS=ws://localhost:3004
```

For production, set `NEXT_PUBLIC_API_GRAPHQL_URL` — the Apollo client reads this env var for the HTTP upload link:
```ts
// apollo/client.ts
uri: process.env.NEXT_PUBLIC_API_GRAPHQL_URL,
```

The REST API URL for image prefixing (`REACT_APP_API_URL`) is exposed via `next.config.js → env` and consumed in `libs/config.ts`.

### 3. Run development server
```bash
yarn dev      # starts on http://localhost:3000
```

### 4. Build for production
```bash
yarn build
yarn start
```

### 5. Lint
```bash
yarn lint
```

---

## Folder Structure Guide

See **AGENTS.md → Folder Structure** for the full annotated tree. Key points:

| Directory | Purpose |
|---|---|
| `pages/` | Next.js file-based routing. One file = one URL route. |
| `pages/_admin/` | Admin-only panel. Guarded at the component level by `MemberType.ADMIN`. |
| `libs/` | All shared code: auth, types, enums, hooks, utils, alerts, components. |
| `apollo/` | Apollo Client factory + all GraphQL queries and mutations. |
| `scss/` | Global SCSS styles. Imported once in `pages/_app.tsx`. |
| `public/locales/` | i18n translation files (`en`, `kr`, `ru`). |
| `public/img/` | Static images (banners, icons, logos, placeholder images). |

### How routing works

```
pages/index.tsx             → /
pages/university/index.tsx  → /university
pages/university/detail.tsx → /university/detail?id={id}
pages/account/join.tsx      → /account/join
pages/_admin/index.tsx      → /_admin
```

Detail pages receive the entity `id` through `router.query.id` and set it via `useEffect([router])`.

### How authentication works

1. User logs in via `libs/auth/index.ts → logIn()`.
2. `logIn` calls the `LOGIN` GraphQL mutation and gets back `accessToken`.
3. Token is stored in `localStorage` as `accessToken`.
4. On every page load, the layout HOC calls `updateUserInfo(jwt)` which decodes the JWT and populates `userVar` (Apollo reactive var).
5. Components read `const user = useReactiveVar(userVar)`.
6. `user._id === ''` means no authenticated user.
7. Apollo's `authLink` (in `apollo/client.ts`) reads the token from `localStorage` via `getHeaders()` and attaches it as `Authorization: Bearer {token}` on every request.

### How image uploads work

The project uses `apollo-upload-client`. The upload link is created with `createUploadLink` pointing at `NEXT_PUBLIC_API_GRAPHQL_URL`. Mutations that upload images accept a `file: Upload` argument on the backend.

---

## API / GraphQL Schema Documentation

The frontend consumes a NestJS GraphQL backend. Below is the complete set of operations used by the frontend, derived from `apollo/user/query.ts`, `apollo/user/mutation.ts`, `apollo/admin/query.ts`, and `apollo/admin/mutation.ts`.

### Domain: Member

**Queries**
| Operation | Variables | Returns | File |
|---|---|---|---|
| `GetAgents` | `AgentsInquiry!` | `{ list: Member[], metaCounter: [{ total }] }` | user/query |
| `GetMember` | `memberId: String!` | `Member` | user/query |
| `GetAllMembersByAdmin` | `MembersInquiry!` | `{ list: Member[], metaCounter }` | admin/query |

**Mutations**
| Operation | Variables | Returns | File |
|---|---|---|---|
| `Signup` | `MemberInput!` | `Member` (with `accessToken`) | user/mutation |
| `Login` | `LoginInput!` | `Member` (with `accessToken`) | user/mutation |
| `UpdateMember` | `MemberUpdate!` | `Member` | user/mutation |
| `LikeTargetMember` | `memberId: String!` | `Member` | user/mutation |
| `UpdateMemberByAdmin` | `MemberUpdate!` | `Member` | admin/mutation |

**Member fields returned:**
```
_id, memberType, memberStatus, memberAuthType, memberPhone, memberNick,
memberFullName, memberImage, memberAddress, memberDesc, memberWarnings,
memberBlocks, memberUniversities, memberRank, memberArticles, memberPoints,
memberLikes, memberViews, memberFollowings, memberFollowers,
deletedAt, createdAt, updatedAt, accessToken,
meFollowed { followingId, followerId, myFollowing }
```

**Member enums:**
```ts
MemberType:   USER | AGENT | ADMIN
MemberStatus: ACTIVE | BLOCK | DELETE
MemberAuthType: PHONE | EMAIL | TELEGRAM
```

**MemberInput (signup):**
```ts
{ memberNick, memberPassword, memberPhone, memberType }
```

**LoginInput:**
```ts
{ memberNick, memberPassword }
```

---

### Domain: University

**Queries**
| Operation | Variables | Returns | File |
|---|---|---|---|
| `GetUniversity` | `universityId: String!` | `University` | user/query |
| `GetUniversities` | `UniversitiesInquiry!` | `{ list: University[], metaCounter }` | user/query |
| `GetAgentUniversities` | `AgentUniversitiesInquiry!` | `{ list: University[], metaCounter }` | user/query |
| `myFavorites` | `OrdinaryInquiry!` | `{ list: University[], metaCounter }` | user/query |
| `myVisited` | `OrdinaryInquiry!` | `{ list: University[], metaCounter }` | user/query |
| `GetAllUniversitiesByAdmin` | `AllUniversitiesInquiry!` | `{ list: University[], metaCounter }` | admin/query |

**Mutations**
| Operation | Variables | Returns | File |
|---|---|---|---|
| `CreateUniversity` | `UniversityInput!` | `University` | user/mutation |
| `UpdateUniversity` | `UniversityUpdate!` | `University` | user/mutation |
| `LikeTargetUniversity` | `universityId: String!` | `University` | user/mutation |
| `UpdateUniversityByAdmin` | `UniversityUpdate!` | `University` | admin/mutation |
| `RemoveUniversityByAdmin` | `universityId: String!` | `University` | admin/mutation |

**University fields:**
```
_id, universityType, universityStatus, universityLocation, universityAddress,
universityName, universityTuition, universityCampusSize, universityCapacity,
universityFaculties, universityViews, universityLikes, universityComments,
universityRank, universityImages, universityDesc, universityScholarship,
universityDormitory, memberId, soldAt, deletedAt, constructedAt, createdAt, updatedAt,
meLiked { memberId, likeRefId, myFavorite },
memberData { ...Member fields }
```

**University enums:**
```ts
UniversityType:
  NATIONAL | PRIVATE | SCIENCE | ART | POLYTECHNIC

UniversityStatus:
  ACTIVE | INACTIVE | DELETE

UniversityLocation:
  SEOUL | BUSAN | INCHEON | DAEGU | GYEONGJU | GWANGJU | CHONJU | DAEJON | JEJU
```

**UniversityInput:**
```ts
{
  universityType: UniversityType;
  universityLocation: UniversityLocation;
  universityAddress: string;
  universityName: string;
  universityTuition: number;
  universityCampusSize: number;
  universityCapacity: number;       // "beds"
  universityFaculties: number;      // "rooms"
  universityImages: string[];
  universityDesc?: string;
  universityScholarship?: boolean;  // "barter" option
  universityDormitory?: boolean;    // "rent" option
  memberId?: string;
  constructedAt?: Date;
}
```

**UniversitiesInquiry (search/filter input):**
```ts
{
  page: number;
  limit: number;
  sort?: string;           // e.g. 'createdAt', 'universityTuition', 'universityRank'
  direction?: Direction;   // ASC | DESC
  search: {
    memberId?: string;
    locationList?: UniversityLocation[];
    typeList?: UniversityType[];
    facultiesList?: Number[];
    options?: string[];              // e.g. ['universityScholarship', 'universityDormitory']
    capacityList?: Number[];
    pricesRange?: { start: number; end: number };
    squaresRange?: { start: number; end: number };
    periodsRange?: { start: Date|number; end: Date|number };
    text?: string;
  };
}
```

---

### Domain: Board Article (Community)

**Queries**
| Operation | Variables | Returns | File |
|---|---|---|---|
| `GetBoardArticle` | `articleId: String!` | `BoardArticle` | user/query |
| `GetBoardArticles` | `BoardArticlesInquiry!` | `{ list: BoardArticle[], metaCounter }` | user/query |
| `GetAllBoardArticlesByAdmin` | `AllBoardArticlesInquiry!` | `{ list: BoardArticle[], metaCounter }` | admin/query |

**Mutations**
| Operation | Variables | File |
|---|---|---|
| `CreateBoardArticle` | `BoardArticleInput!` | user/mutation |
| `UpdateBoardArticle` | `BoardArticleUpdate!` | user/mutation |
| `LikeTargetBoardArticle` | `articleId: String!` | user/mutation |
| `UpdateBoardArticleByAdmin` | `BoardArticleUpdate!` | admin/mutation |
| `RemoveBoardArticleByAdmin` | `articleId: String!` | admin/mutation |

**BoardArticle fields:**
```
_id, articleCategory, articleStatus, articleTitle, articleContent,
articleImage, articleViews, articleLikes, articleComments,
memberId, createdAt, updatedAt,
meLiked { memberId, likeRefId, myFavorite },
memberData { ...Member fields }
```

---

### Domain: Comment

**Queries**
| Operation | Variables | Returns | File |
|---|---|---|---|
| `GetComments` | `CommentsInquiry!` | `{ list: Comment[], metaCounter }` | user/query & admin/query |

**Mutations**
| Operation | Variables | File |
|---|---|---|
| `CreateComment` | `CommentInput!` | user/mutation |
| `UpdateComment` | `CommentUpdate!` | user/mutation |
| `RemoveCommentByAdmin` | `commentId: String!` | admin/mutation |

**Comment fields:**
```
_id, commentStatus, commentGroup, commentContent, commentRefId,
memberId, createdAt, updatedAt,
memberData { ...Member fields }
```

**CommentInput:**
```ts
{
  commentGroup: CommentGroup;   // UNIVERSITY | ARTICLE
  commentContent: string;
  commentRefId: string;         // ID of the university or article being commented on
}
```

**CommentsInquiry:**
```ts
{
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: { commentRefId: string };
}
```

---

### Domain: Follow

**Queries**
| Operation | Variables | Returns | File |
|---|---|---|---|
| `GetMemberFollowers` | `FollowInquiry!` | `{ list: Follow[], metaCounter }` | user/query |
| `GetMemberFollowings` | `FollowInquiry!` | `{ list: Follow[], metaCounter }` | user/query |

**Mutations**
| Operation | Variables | File |
|---|---|---|
| `Subscribe` | `input: String!` (followingId) | user/mutation |
| `Unsubscribe` | `input: String!` (followingId) | user/mutation |

**Follow fields:**
```
_id, followingId, followerId, createdAt, updatedAt,
followerData { ...Member fields },
followingData { ...Member fields },
meLiked { memberId, likeRefId, myFavorite },
meFollowed { followingId, followerId, myFollowing }
```

---

### Common Types

**Direction enum:**
```ts
Direction.ASC = 'ASC'
Direction.DESC = 'DESC'
```

**TotalCounter:**
```ts
{ total: number }
```

**MeLiked:**
```ts
{ memberId: string; likeRefId: string; myFavorite: boolean; }
```

**OrdinaryInquiry** (for favourites / visited history):
```ts
{ page: number; limit: number; sort?: string; direction?: Direction; }
```

---

## Apollo Client Architecture

```
createIsomorphicLink()
  └─ from([errorLink, tokenRefreshLink, splitLink])
       ├─ subscription requests → wsLink (WebSocketLink)
       │    └─ LoggingWebSocket (attaches JWT as ?token= query param)
       └─ all other requests → authLink.concat(uploadLink)
            └─ authLink: sets Authorization: Bearer {token} header
            └─ uploadLink: createUploadLink → NEXT_PUBLIC_API_GRAPHQL_URL
```

- `initializeApollo(initialState?)` — SSR-safe singleton. Call once per request on the server; reuses the singleton on the client.
- `useApollo(initialApolloState)` — React hook that wraps `initializeApollo` in `useMemo`. Used in `pages/_app.tsx`.

---

## Reactive State (Apollo Store)

Defined in `apollo/store.ts`:

| Variable | Type | Purpose |
|---|---|---|
| `userVar` | `CustomJwtPayload` | Currently logged-in user. Reset to empty object on logout. |
| `socketVar` | `WebSocket` | Active WebSocket connection (set by `LoggingWebSocket` constructor). |
| `themeVar` | `{}` | MUI theme toggle (unused in current code). |

Read reactively in any component:
```tsx
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';

const user = useReactiveVar(userVar);
```

---

## SweetAlert Utility Reference (`libs/sweetAlert.ts`)

| Function | Use case |
|---|---|
| `sweetErrorHandling(err)` | Catch-block for GraphQL errors — shows `err.message` |
| `sweetTopSmallSuccessAlert(msg, duration?)` | Toast notification (top-right) for successful actions |
| `sweetMixinSuccessAlert(msg, duration?)` | Centered success popup |
| `sweetMixinErrorAlert(msg, duration?)` | Centered error popup |
| `sweetErrorAlert(msg, duration?)` | Error popup with icon |
| `sweetConfirmAlert(msg)` | Yes/No confirm dialog — returns `Promise<boolean>` |
| `sweetLoginConfirmAlert(msg)` | Confirm with "Login" button — returns `Promise<boolean>` |
| `sweetContactAlert(msg, duration?)` | Info popup (long duration) |
| `sweetBasicAlert(text)` | Bare SweetAlert2 fire |
| `sweetErrorHandlingForAdmin(err)` | Admin-specific error (falls back to `Messages.error1`) |
