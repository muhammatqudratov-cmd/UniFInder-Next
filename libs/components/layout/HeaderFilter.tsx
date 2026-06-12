import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Stack, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { UniversityLocation, UniversityType } from '../../enums/university.enum';
import { UniversitiesInquiry } from '../../types/university/university.input';

const locations = Object.values(UniversityLocation);
const types = Object.values(UniversityType);
const faculties = [1, 2, 3, 4, 5];

const HeaderFilter = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const locationRef = useRef<any>();
	const typeRef = useRef<any>();
	const facultyRef = useRef<any>();

	const [searchFilter, setSearchFilter] = useState<UniversitiesInquiry>({
		page: 1,
		limit: 9,
		search: {},
	});
	const [openLocation, setOpenLocation] = useState(false);
	const [openType, setOpenType] = useState(false);
	const [openFaculty, setOpenFaculty] = useState(false);

	/** LIFECYCLES **/
	useEffect(() => {
		const clickHandler = (event: MouseEvent) => {
			if (!locationRef?.current?.contains(event.target)) setOpenLocation(false);
			if (!typeRef?.current?.contains(event.target)) setOpenType(false);
			if (!facultyRef?.current?.contains(event.target)) setOpenFaculty(false);
		};
		document.addEventListener('mousedown', clickHandler);
		return () => document.removeEventListener('mousedown', clickHandler);
	}, []);

	/** HANDLERS **/
	const locationHandler = () => {
		setOpenLocation((prev) => !prev);
		setOpenType(false);
		setOpenFaculty(false);
	};

	const typeHandler = () => {
		setOpenType((prev) => !prev);
		setOpenLocation(false);
		setOpenFaculty(false);
	};

	const facultyHandler = () => {
		setOpenFaculty((prev) => !prev);
		setOpenLocation(false);
		setOpenType(false);
	};

	const selectLocation = useCallback(
		(value: UniversityLocation) => {
			setSearchFilter((prev) => ({
				...prev,
				search: { ...prev.search, locationList: [value] },
			}));
			setOpenLocation(false);
			setOpenType(true);
		},
		[],
	);

	const selectType = useCallback(
		(value: UniversityType) => {
			setSearchFilter((prev) => ({
				...prev,
				search: { ...prev.search, typeList: [value] },
			}));
			setOpenType(false);
		},
		[],
	);

	const selectFaculty = useCallback(
		(value: number) => {
			setSearchFilter((prev) => ({
				...prev,
				search: { ...prev.search, facultiesList: [value] },
			}));
			setOpenFaculty(false);
		},
		[],
	);

	const pushSearch = async () => {
		try {
			const filter = { ...searchFilter };
			if (filter.search.locationList?.length === 0) delete filter.search.locationList;
			if (filter.search.typeList?.length === 0) delete filter.search.typeList;
			if (filter.search.facultiesList?.length === 0) delete filter.search.facultiesList;
			await router.push(
				`/university?input=${JSON.stringify(filter)}`,
				`/university?input=${JSON.stringify(filter)}`,
			);
		} catch (err: any) {
			console.log('ERROR, pushSearch:', err);
		}
	};

	return (
		<Stack
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				background: 'white',
				borderRadius: '16px',
				padding: '5px 6px',
				boxShadow: '0 6px 24px rgba(0,0,0,0.09)',
				width: '820px',
				maxWidth: '92vw',
				position: 'relative',
				overflow: 'visible',
				gap: 0,
			}}
		>
			{/* LOCATION */}
			<Box
				ref={locationRef}
				onClick={locationHandler}
				style={{ flex: 1, padding: '8px 14px', borderRight: '1px solid #E9E7E0', cursor: 'pointer', position: 'relative' }}
			>
				<div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8E8C83', marginBottom: '2px' }}>
					📍 {t('Location')}
				</div>
				<div style={{ fontSize: '13px', fontWeight: 500, color: '#1C1B18', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
					{searchFilter.search.locationList?.[0] ?? t('All of Korea')}
					<ExpandMoreIcon style={{ fontSize: 16, color: '#8E8C83' }} />
				</div>
				{openLocation && (
					<div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, background: 'white', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 9999, minWidth: '220px', padding: '8px' }}>
						{locations.map((loc) => (
							<div
								key={loc}
								onClick={(e) => { e.stopPropagation(); selectLocation(loc); }}
								style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', cursor: 'pointer', borderRadius: '8px', fontSize: '13px' }}
								onMouseOver={(e) => (e.currentTarget.style.background = '#FAFAF8')}
								onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
							>
								<img
									src={`/img/banner/cities/${loc}.webp`}
									alt={loc}
									style={{ width: '40px', height: '28px', borderRadius: '6px', objectFit: 'cover' }}
								/>
								<span>{loc}</span>
							</div>
						))}
					</div>
				)}
			</Box>

			{/* UNIVERSITY TYPE */}
			<Box
				ref={typeRef}
				onClick={typeHandler}
				style={{ flex: 1, padding: '8px 14px', borderRight: '1px solid #E9E7E0', cursor: 'pointer', position: 'relative' }}
			>
				<div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8E8C83', marginBottom: '2px' }}>
					🎓 {t('University Type')}
				</div>
				<div style={{ fontSize: '13px', fontWeight: 500, color: '#1C1B18', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
					{searchFilter.search.typeList?.[0] ?? t('Any type')}
					<ExpandMoreIcon style={{ fontSize: 16, color: '#8E8C83' }} />
				</div>
				{openType && (
					<div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, background: 'white', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 9999, minWidth: '200px', padding: '8px' }}>
						{types.map((type) => (
							<div
								key={type}
								onClick={(e) => { e.stopPropagation(); selectType(type); }}
								style={{ padding: '10px 12px', cursor: 'pointer', borderRadius: '8px', fontSize: '13px' }}
								onMouseOver={(e) => (e.currentTarget.style.background = '#FAFAF8')}
								onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
							>
								{type}
							</div>
						))}
					</div>
				)}
			</Box>

			{/* FACULTIES */}
			<Box
				ref={facultyRef}
				onClick={facultyHandler}
				style={{ flex: 1, padding: '8px 14px', cursor: 'pointer', position: 'relative' }}
			>
				<div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8E8C83', marginBottom: '2px' }}>
					📚 {t('Faculties')}
				</div>
				<div style={{ fontSize: '13px', fontWeight: 500, color: '#1C1B18', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
					{searchFilter.search.facultiesList?.[0] != null
						? `${searchFilter.search.facultiesList[0]} ${Number(searchFilter.search.facultiesList[0]) > 1 ? 'faculties' : 'faculty'}`
						: t('All faculties')}
					<ExpandMoreIcon style={{ fontSize: 16, color: '#8E8C83' }} />
				</div>
				{openFaculty && (
					<div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, background: 'white', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 9999, minWidth: '200px', padding: '8px' }}>
						{faculties.map((num) => (
							<div
								key={num}
								onClick={(e) => { e.stopPropagation(); selectFaculty(num); }}
								style={{ padding: '10px 12px', cursor: 'pointer', borderRadius: '8px', fontSize: '13px' }}
								onMouseOver={(e) => (e.currentTarget.style.background = '#FAFAF8')}
								onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
							>
								{num} {num > 1 ? 'faculties' : 'faculty'}
							</div>
						))}
					</div>
				)}
			</Box>

			{/* SEARCH BUTTON */}
			<button
				onClick={pushSearch}
				style={{
					padding: '11px 20px',
					background: '#E8856A',
					color: 'white',
					border: 'none',
					borderRadius: '12px',
					fontSize: '13px',
					fontWeight: 600,
					cursor: 'pointer',
					whiteSpace: 'nowrap',
					marginLeft: '6px',
					flexShrink: 0,
				}}
			>
				🔍 {t('Search')}
			</button>
		</Stack>
	);
};

export default HeaderFilter;
