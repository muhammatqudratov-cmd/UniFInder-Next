# Uni-Finder Frontend — Skills (Repeatable Workflows)

## 1. How to Create a New Page

### Step 1 — Create the page file

Create `pages/{section}/index.tsx` (or `detail.tsx` for a detail page).

```tsx
// pages/myfeature/index.tsx
import { NextPage } from 'next';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const MyFeaturePage: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <div>MY FEATURE MOBILE</div>;
	}

	return (
		<Stack id="my-feature-page">
			<div className="container">{/* page content */}</div>
		</Stack>
	);
};

MyFeaturePage.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withLayoutBasic(MyFeaturePage);
```

**Layout HOC options:**

- `withLayoutMain` — homepage (with 3D hero canvas + HeaderFilter)
- `withLayoutBasic` — all inner pages (with banner header, bg image auto-selected by route)
- `withLayoutFull` — detail pages (full-width, no banner)
- `withLayoutAdmin` — admin panel pages

### Step 2 — Add the banner title to LayoutBasic

Open `libs/components/layout/LayoutBasic.tsx`. Inside the `switch(router.pathname)` block, add your route:

```tsx
case '/myfeature':
  title = 'My Feature';
  desc = 'We are glad to see you again!';
  bgImage = '/img/banner/korea2.jpg';
  break;
```

### Step 3 — Create the SCSS file

Create `scss/pc/myfeature/myfeature.scss`:

```scss
#my-feature-page {
	padding: 50px 0;
	.container {
		flex-direction: column;
	}
}
```

### Step 4 — Import the SCSS

Open `scss/pc/main.scss` and add the import:

```scss
@import '/scss/pc/myfeature/myfeature.scss';
```

### Step 5 — Add i18n string (if the banner title should be translated)

Add the key to all three locale files:

- `public/locales/en/common.json`: `"My Feature": "My Feature"`
- `public/locales/kr/common.json`: `"My Feature": "내 기능"`
- `public/locales/ru/common.json`: `"My Feature": "Мой раздел"`

---

## 2. How to Create an Apollo GraphQL Query

### Step 1 — Define the GQL document

Open `apollo/user/query.ts` (or `apollo/admin/query.ts` for admin operations). Add:

```ts
import { gql } from '@apollo/client';

/**************************
 *      MY DOMAIN         *
 *************************/

export const GET_MY_ITEMS = gql`
	query GetMyItems($input: MyItemsInquiry!) {
		getMyItems(input: $input) {
			list {
				_id
				itemName
				itemStatus
				createdAt
				updatedAt
				memberData {
					_id
					memberNick
					memberImage
				}
			}
			metaCounter {
				total
			}
		}
	}
`;
```

### Step 2 — Define TypeScript types

Create `libs/types/myitem/myitem.ts`:

```ts
export interface MyItem {
	_id: string;
	itemName: string;
	itemStatus: string;
	createdAt: Date;
	updatedAt: Date;
	memberData?: Member;
}

export interface MyItems {
	list: MyItem[];
	metaCounter: TotalCounter[];
}
```

Create `libs/types/myitem/myitem.input.ts`:

```ts
import { Direction } from '../../enums/common.enum';

interface MyItemSearch {
	text?: string;
}

export interface MyItemsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: MyItemSearch;
}
```

### Step 3 — Use in a page component

```tsx
import { useQuery } from '@apollo/client';
import { GET_MY_ITEMS } from '../../apollo/user/query';
import { MyItem } from '../../libs/types/myitem/myitem';
import { MyItemsInquiry } from '../../libs/types/myitem/myitem.input';
import { T } from '../../libs/types/common';

const MyPage: NextPage = ({ initialInput, ...props }: any) => {
	const [items, setItems] = useState<MyItem[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchFilter, setSearchFilter] = useState<MyItemsInquiry>(initialInput);

	/** APOLLO REQUESTS **/
	const {
		loading,
		data,
		error,
		refetch: getMyItemsRefetch,
	} = useQuery(GET_MY_ITEMS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setItems(data?.getMyItems?.list);
			setTotal(data?.getMyItems?.metaCounter[0]?.total ?? 0);
		},
	});

	// ...
};
```

### Using a mutation

```ts
// apollo/user/mutation.ts
export const CREATE_MY_ITEM = gql`
	mutation CreateMyItem($input: MyItemInput!) {
		createMyItem(input: $input) {
			_id
			itemName
			itemStatus
			createdAt
			updatedAt
		}
	}
`;
```

```tsx
import { useMutation } from '@apollo/client';
import { CREATE_MY_ITEM } from '../../apollo/user/mutation';
import { Message } from '../../libs/enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';

const [createMyItem] = useMutation(CREATE_MY_ITEM);

/** HANDLERS **/
const createItemHandler = async () => {
	try {
		if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

		await createMyItem({ variables: { input: { itemName: 'Test' } } });
		await getMyItemsRefetch({ input: searchFilter });
		await sweetTopSmallSuccessAlert('Created successfully!', 800);
	} catch (err: any) {
		console.log('ERROR, createItemHandler:', err.message);
		sweetMixinErrorAlert(err.message).then();
	}
};
```

---

## 3. How to Create a Component with SCSS

### Step 1 — Create the component file

```tsx
// libs/components/myfeature/MyItemCard.tsx
import React from 'react';
import { Stack, Typography } from '@mui/material';
import { MyItem } from '../../types/myitem/myitem';
import { REACT_APP_API_URL } from '../../config';

interface MyItemCardProps {
	item: MyItem;
	onLike: (id: string) => void;
}

const MyItemCard = ({ item, onLike }: MyItemCardProps) => {
	return (
		<Stack className={'my-item-card'}>
			<Stack className={'image-box'}>
				<img src={item.imageUrl ? `${REACT_APP_API_URL}/${item.imageUrl}` : '/img/default.png'} alt={item.itemName} />
			</Stack>
			<Stack className={'info-box'}>
				<Typography className={'item-name'}>{item.itemName}</Typography>
				<Stack className={'bottom-box'}>
					<span onClick={() => onLike(item._id)}>Like</span>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default MyItemCard;
```

### Step 2 — Add SCSS for the component

The component SCSS lives in the page SCSS file (e.g., `scss/pc/myfeature/myfeature.scss`):

```scss
.my-item-card {
	width: 320px;
	border-radius: 12px;
	border: 1px solid #eee;
	overflow: hidden;
	cursor: pointer;

	.image-box {
		width: 100%;
		height: 200px;
		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	.info-box {
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 8px;

		.item-name {
			color: #181a20;
			font-family: $font;
			font-size: 16px;
			font-weight: 600;
		}

		.bottom-box {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}
	}
}
```

### Step 3 — Use the component in a page

```tsx
import MyItemCard from '../../libs/components/myfeature/MyItemCard';

// inside JSX:
{
	items.map((item: MyItem) => <MyItemCard item={item} onLike={likeItemHandler} key={item._id} />);
}
```

### Key SCSS conventions

- Font: always `font-family: $font;` (from `variables.scss`)
- Container width: `.container { width: 1300px; margin: 0 auto; display: flex; }`
- Class naming: hyphen-case, descriptive (`.info-box`, `.left-config`, `.option-includes`)
- No inline styles — use SCSS classes. Exception: dynamic values like `backgroundImage`.

---

## 4. How to Add i18n Translation

### Step 1 — Add the key to all locale files

`public/locales/en/common.json`:

```json
{
	"University Search": "University Search",
	"My New Key": "My New Value"
}
```

`public/locales/kr/common.json`:

```json
{
	"University Search": "대학교 검색",
	"My New Key": "내 새 값"
}
```

`public/locales/ru/common.json`:

```json
{
	"University Search": "Поиск университетов",
	"My New Key": "Моё новое значение"
}
```

### Step 2 — Load translations in `getStaticProps`

Every page that uses translations must export this:

```tsx
export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});
```

### Step 3 — Use the `t` function in a component

```tsx
import { useTranslation } from 'next-i18next';

const MyComponent = () => {
	const { t } = useTranslation('common');

	return (
		<div>
			<h1>{t('University Search')}</h1>
			<p>{t('My New Key')}</p>
		</div>
	);
};
```

**Real example from `LayoutBasic.tsx`:**

```tsx
const { t } = useTranslation('common');
// ...
<strong>{t(memoizedValues.title)}</strong>
<span>{t(memoizedValues.desc)}</span>
```

### Step 4 — Language switching

The language switcher is in `libs/components/Top.tsx`. It uses Next.js built-in i18n routing (configured in `next-i18next.config.js` + `next.config.js`).

Supported locales: `en` (default), `kr`, `ru`. `localeDetection` is set to `false`.

### Notes on translation scope

Only strings that appear in:

- The global navbar (`Top.tsx`)
- Banner headers in `LayoutBasic.tsx`
- Filter labels in `HeaderFilter.tsx`

...are currently translated. Static content inside page bodies is in English only. Add to `common.json` whenever you add a user-visible label that should be translatable.
