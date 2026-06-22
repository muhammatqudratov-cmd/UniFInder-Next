import React, { useCallback, useEffect, useState } from 'react';
import {
	Stack,
	Typography,
	Checkbox,
	Button,
	OutlinedInput,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Tooltip,
	IconButton,
	Switch,
	Box,
} from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { UniversityLocation, UniversityType } from '../../enums/university.enum';
import { UniversitiesInquiry } from '../../types/university/university.input';
import { useRouter } from 'next/router';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { universityCampusSize } from '../../config';
import RefreshIcon from '@mui/icons-material/Refresh';

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

interface FilterType {
	searchFilter: UniversitiesInquiry;
	setSearchFilter: any;
	initialInput: UniversitiesInquiry;
}

const Filter = (props: FilterType) => {
	const { searchFilter, setSearchFilter, initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [universityLocation, setUniversityLocation] = useState<UniversityLocation[]>(Object.values(UniversityLocation));
	const [universityType, setUniversityType] = useState<UniversityType[]>(Object.values(UniversityType));
	const [searchText, setSearchText] = useState<string>('');
	const [showMore, setShowMore] = useState<boolean>(false);
	const [citySearchText, setCitySearchText] = useState<string>('');

	/** LIFECYCLE **/
	useEffect(() => {
		if (searchFilter?.search?.locationList?.length == 0) {
			delete searchFilter.search.locationList;
			setShowMore(false);
			router
				.push(
					`/university?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/university?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.typeList?.length == 0) {
			delete searchFilter.search.typeList;
			router
				.push(
					`/university?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/university?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.facultiesList?.length == 0) {
			delete searchFilter.search.facultiesList;
			router
				.push(
					`/university?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/university?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.options?.length == 0) {
			delete searchFilter.search.options;
			router
				.push(
					`/university?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/university?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.capacityList?.length == 0) {
			delete searchFilter.search.capacityList;
			router
				.push(
					`/university?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/university?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.locationList) setShowMore(true);
	}, [searchFilter]);

	/** HANDLERS **/
	const universityLocationSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/university?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, locationList: [...(searchFilter?.search?.locationList || []), value] },
						})}`,
						`/university?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, locationList: [...(searchFilter?.search?.locationList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.locationList?.includes(value)) {
					await router.push(
						`/university?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								locationList: searchFilter?.search?.locationList?.filter((item: string) => item !== value),
							},
						})}`,
						`/university?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								locationList: searchFilter?.search?.locationList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				if (searchFilter?.search?.typeList?.length == 0) {
					alert('error');
				}

				console.log('universityLocationSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, universityLocationSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const universityTypeSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/university?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
						})}`,
						`/university?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.typeList?.includes(value)) {
					await router.push(
						`/university?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
							},
						})}`,
						`/university?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				if (searchFilter?.search?.typeList?.length == 0) {
					alert('error');
				}

				console.log('universityTypeSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, universityTypeSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const universityRoomSelectHandler = useCallback(
		async (number: Number) => {
			try {
				if (number != 0) {
					if (searchFilter?.search?.facultiesList?.includes(number)) {
						await router.push(
							`/university?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									facultiesList: searchFilter?.search?.facultiesList?.filter((item: Number) => item !== number),
								},
							})}`,
							`/university?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									facultiesList: searchFilter?.search?.facultiesList?.filter((item: Number) => item !== number),
								},
							})}`,
							{ scroll: false },
						);
					} else {
						await router.push(
							`/university?input=${JSON.stringify({
								...searchFilter,
								search: { ...searchFilter.search, facultiesList: [...(searchFilter?.search?.facultiesList || []), number] },
							})}`,
							`/university?input=${JSON.stringify({
								...searchFilter,
								search: { ...searchFilter.search, facultiesList: [...(searchFilter?.search?.facultiesList || []), number] },
							})}`,
							{ scroll: false },
						);
					}
				} else {
					delete searchFilter?.search.facultiesList;
					setSearchFilter({ ...searchFilter });
					await router.push(
						`/university?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
							},
						})}`,
						`/university?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
							},
						})}`,
						{ scroll: false },
					);
				}

				console.log('universityRoomSelectHandler:', number);
			} catch (err: any) {
				console.log('ERROR, universityRoomSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const universityOptionSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/university?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, options: [...(searchFilter?.search?.options || []), value] },
						})}`,
						`/university?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, options: [...(searchFilter?.search?.options || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.options?.includes(value)) {
					await router.push(
						`/university?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								options: searchFilter?.search?.options?.filter((item: string) => item !== value),
							},
						})}`,
						`/university?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								options: searchFilter?.search?.options?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				console.log('universityOptionSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, universityOptionSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const universityBedSelectHandler = useCallback(
		async (number: Number) => {
			try {
				if (number != 0) {
					if (searchFilter?.search?.capacityList?.includes(number)) {
						await router.push(
							`/university?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									capacityList: searchFilter?.search?.capacityList?.filter((item: Number) => item !== number),
								},
							})}`,
							`/university?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									capacityList: searchFilter?.search?.capacityList?.filter((item: Number) => item !== number),
								},
							})}`,
							{ scroll: false },
						);
					} else {
						await router.push(
							`/university?input=${JSON.stringify({
								...searchFilter,
								search: { ...searchFilter.search, capacityList: [...(searchFilter?.search?.capacityList || []), number] },
							})}`,
							`/university?input=${JSON.stringify({
								...searchFilter,
								search: { ...searchFilter.search, capacityList: [...(searchFilter?.search?.capacityList || []), number] },
							})}`,
							{ scroll: false },
						);
					}
				} else {
					delete searchFilter?.search.capacityList;
					setSearchFilter({ ...searchFilter });
					await router.push(
						`/university?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
							},
						})}`,
						`/university?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
							},
						})}`,
						{ scroll: false },
					);
				}

				console.log('universityBedSelectHandler:', number);
			} catch (err: any) {
				console.log('ERROR, universityBedSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const universityCampusSizeHandler = useCallback(
		async (e: any, type: string) => {
			const value = e.target.value;

			if (type == 'start') {
				await router.push(
					`/university?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							squaresRange: { ...searchFilter.search.squaresRange, start: value },
						},
					})}`,
					`/university?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							squaresRange: { ...searchFilter.search.squaresRange, start: value },
						},
					})}`,
					{ scroll: false },
				);
			} else {
				await router.push(
					`/university?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							squaresRange: { ...searchFilter.search.squaresRange, end: value },
						},
					})}`,
					`/university?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							squaresRange: { ...searchFilter.search.squaresRange, end: value },
						},
					})}`,
					{ scroll: false },
				);
			}
		},
		[searchFilter],
	);

	const universityTuitionHandler = useCallback(
		async (value: number, type: string) => {
			if (type == 'start') {
				await router.push(
					`/university?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
						},
					})}`,
					`/university?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			} else {
				await router.push(
					`/university?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
						},
					})}`,
					`/university?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			}
		},
		[searchFilter],
	);

	const visibleLocations = universityLocation.filter((loc) => loc.toLowerCase().includes(citySearchText.toLowerCase()));
	const formatLocationLabel = (loc: string) => loc.replace('_', ' ');

	const refreshHandler = async () => {
		try {
			setSearchText('');
			await router.push(
				`/university?input=${JSON.stringify(initialInput)}`,
				`/university?input=${JSON.stringify(initialInput)}`,
				{ scroll: false },
			);
		} catch (err: any) {
			console.log('ERROR, refreshHandler:', err);
		}
	};

	if (device === 'mobile') {
		return <div>UNIVERSITIES FILTER</div>;
	} else {
		return (
			<Stack className={'filter-main'}>
				<Stack className={'find-your-home'} mb={'40px'}>
					<Typography className={'title-main'}>Find Your University</Typography>
					<Stack className={'input-box'}>
						<OutlinedInput
							value={searchText}
							type={'text'}
							className={'search-input'}
							placeholder={'What are you looking for?'}
							onChange={(e: any) => setSearchText(e.target.value)}
							onKeyDown={(event: any) => {
								if (event.key == 'Enter') {
									setSearchFilter({
										...searchFilter,
										search: { ...searchFilter.search, text: searchText },
									});
								}
							}}
							endAdornment={
								<>
									<CancelRoundedIcon
										onClick={() => {
											setSearchText('');
											setSearchFilter({
												...searchFilter,
												search: { ...searchFilter.search, text: '' },
											});
										}}
									/>
								</>
							}
						/>
						<img src={'/img/icons/search_icon.png'} alt={''} />
						<Tooltip title="Reset">
							<IconButton onClick={refreshHandler}>
								<RefreshIcon />
							</IconButton>
						</Tooltip>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Stack direction="row" justifyContent="space-between" alignItems="center">
						<Typography className={'title'} sx={{ textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.5px' }}>
							Location
						</Typography>
						{!!searchFilter?.search?.locationList?.length && (
							<Typography sx={{ fontSize: '11px', color: '#8E8C83' }}>
								{searchFilter.search.locationList.length} selected
							</Typography>
						)}
					</Stack>
					<OutlinedInput
						value={citySearchText}
						onChange={(e: any) => setCitySearchText(e.target.value)}
						placeholder={'Search city'}
						className={'city-search-input'}
						fullWidth
					/>
					<Stack
						className={`university-location`}
						onMouseEnter={() => setShowMore(true)}
						onMouseLeave={() => {
							if (!searchFilter?.search?.locationList) {
								setShowMore(false);
							}
						}}
					>
						{visibleLocations.map((location: string) => {
							const isSelected = (searchFilter?.search?.locationList || []).includes(location as UniversityLocation);
							return (
								<Box component={'div'} key={location} sx={{ position: 'relative' }}>
									<Checkbox
										id={location}
										className="university-checkbox"
										color="default"
										size="small"
										value={location}
										checked={isSelected}
										onChange={universityLocationSelectHandler}
										sx={{ position: 'absolute', opacity: 0, width: 0, height: 0, padding: 0 }}
									/>
									<label
										htmlFor={location}
										className={`pill-label${isSelected ? ' pill-active' : ''}`}
										style={{ cursor: 'pointer' }}
									>
										{formatLocationLabel(location)}
									</label>
								</Box>
							);
						})}
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Stack direction="row" justifyContent="space-between" alignItems="center">
						<Typography className={'title'} sx={{ textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.5px' }}>
							University Type
						</Typography>
						{!!searchFilter?.search?.typeList?.length && (
							<Typography sx={{ fontSize: '11px', color: '#8E8C83' }}>
								{searchFilter.search.typeList.length} selected
							</Typography>
						)}
					</Stack>
					<Stack className={'pill-group'}>
						{universityType.map((type: string) => {
							const isSelected = (searchFilter?.search?.typeList || []).includes(type as UniversityType);
							return (
								<Box component={'div'} key={type} sx={{ position: 'relative' }}>
									<Checkbox
										id={type}
										className="university-checkbox"
										color="default"
										size="small"
										value={type}
										onChange={universityTypeSelectHandler}
										checked={isSelected}
										sx={{ position: 'absolute', opacity: 0, width: 0, height: 0, padding: 0 }}
									/>
									<label
										htmlFor={type}
										className={`pill-label${isSelected ? ' pill-active' : ''}`}
										style={{ cursor: 'pointer' }}
									>
										{type}
									</label>
								</Box>
							);
						})}
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Faculties</Typography>
					<Stack className="button-group">
						<Button
							sx={{
								borderRadius: '20px',
								marginRight: '6px',
								backgroundColor: !searchFilter?.search?.facultiesList ? '#E8856A' : 'transparent',
								color: !searchFilter?.search?.facultiesList ? '#fff' : '#1C1B18',
								border: !searchFilter?.search?.facultiesList ? 'none' : '1px solid #E8E8E4',
							}}
							onClick={() => universityRoomSelectHandler(0)}
						>
							Any
						</Button>
						<Button
							sx={{
								borderRadius: '20px',
								marginRight: '6px',
								backgroundColor: searchFilter?.search?.facultiesList?.includes(1) ? '#E8856A' : 'transparent',
								color: searchFilter?.search?.facultiesList?.includes(1) ? '#fff' : '#1C1B18',
								border: searchFilter?.search?.facultiesList?.includes(1) ? 'none' : '1px solid #E8E8E4',
							}}
							onClick={() => universityRoomSelectHandler(1)}
						>
							1
						</Button>
						<Button
							sx={{
								borderRadius: '20px',
								marginRight: '6px',
								backgroundColor: searchFilter?.search?.facultiesList?.includes(2) ? '#E8856A' : 'transparent',
								color: searchFilter?.search?.facultiesList?.includes(2) ? '#fff' : '#1C1B18',
								border: searchFilter?.search?.facultiesList?.includes(2) ? 'none' : '1px solid #E8E8E4',
							}}
							onClick={() => universityRoomSelectHandler(2)}
						>
							2
						</Button>
						<Button
							sx={{
								borderRadius: '20px',
								marginRight: '6px',
								backgroundColor: searchFilter?.search?.facultiesList?.includes(3) ? '#E8856A' : 'transparent',
								color: searchFilter?.search?.facultiesList?.includes(3) ? '#fff' : '#1C1B18',
								border: searchFilter?.search?.facultiesList?.includes(3) ? 'none' : '1px solid #E8E8E4',
							}}
							onClick={() => universityRoomSelectHandler(3)}
						>
							3
						</Button>
						<Button
							sx={{
								borderRadius: '20px',
								marginRight: '6px',
								backgroundColor: searchFilter?.search?.facultiesList?.includes(4) ? '#E8856A' : 'transparent',
								color: searchFilter?.search?.facultiesList?.includes(4) ? '#fff' : '#1C1B18',
								border: searchFilter?.search?.facultiesList?.includes(4) ? 'none' : '1px solid #E8E8E4',
							}}
							onClick={() => universityRoomSelectHandler(4)}
						>
							4
						</Button>
						<Button
							sx={{
								borderRadius: '20px',
								marginRight: '6px',
								backgroundColor: searchFilter?.search?.facultiesList?.includes(5) ? '#E8856A' : 'transparent',
								color: searchFilter?.search?.facultiesList?.includes(5) ? '#fff' : '#1C1B18',
								border: searchFilter?.search?.facultiesList?.includes(5) ? 'none' : '1px solid #E8E8E4',
							}}
							onClick={() => universityRoomSelectHandler(5)}
						>
							5+
						</Button>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Dormitory</Typography>
					<Stack className={'input-box'} direction="row" justifyContent="space-between" alignItems="center">
						<label htmlFor={'Dormitory'} style={{ cursor: 'pointer' }}>
							<Typography className="university-type">Has Dormitory</Typography>
						</label>
						<Switch
							id={'Dormitory'}
							value={'universityDormitory'}
							checked={(searchFilter?.search?.options || []).includes('universityDormitory')}
							onChange={universityOptionSelectHandler}
						/>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Scholarship</Typography>
					<Stack className={'input-box'} direction="row" justifyContent="space-between" alignItems="center">
						<label htmlFor={'Scholarship'} style={{ cursor: 'pointer' }}>
							<Typography className="university-type">Has Scholarship</Typography>
						</label>
						<Switch
							id={'Scholarship'}
							value={'universityScholarship'}
							checked={(searchFilter?.search?.options || []).includes('universityScholarship')}
							onChange={universityOptionSelectHandler}
						/>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Campus Size</Typography>
					<Stack className="square-year-input">
						<FormControl>
							<InputLabel id="demo-simple-select-label">Min</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={searchFilter?.search?.squaresRange?.start ?? 0}
								label="Min"
								onChange={(e: any) => universityCampusSizeHandler(e, 'start')}
								MenuProps={MenuProps}
								sx={{ borderRadius: '8px', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E8E8E4' } }}
							>
								{universityCampusSize.map((square: number) => (
									<MenuItem
										value={square}
										disabled={(searchFilter?.search?.squaresRange?.end || 0) < square}
										key={square}
									>
										{square.toLocaleString()} m²
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<div className="central-divider"></div>
						<FormControl>
							<InputLabel id="demo-simple-select-label">Max</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={searchFilter?.search?.squaresRange?.end ?? 1600000}
								label="Max"
								onChange={(e: any) => universityCampusSizeHandler(e, 'end')}
								MenuProps={MenuProps}
								sx={{ borderRadius: '8px', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E8E8E4' } }}
							>
								{universityCampusSize.map((square: number) => (
									<MenuItem
										value={square}
										disabled={(searchFilter?.search?.squaresRange?.start || 0) > square}
										key={square}
									>
										{square.toLocaleString()} m²
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'}>
					<Typography className={'title'}>Tuition Range</Typography>
					<Stack className="square-year-input">
						<input
							type="number"
							placeholder="$ min"
							min={0}
							value={searchFilter?.search?.pricesRange?.start ?? 0}
							onChange={(e: any) => {
								if (e.target.value >= 0) {
									universityTuitionHandler(e.target.value, 'start');
								}
							}}
						/>
						<div className="central-divider"></div>
						<input
							type="number"
							placeholder="$ max"
							value={searchFilter?.search?.pricesRange?.end ?? 0}
							onChange={(e: any) => {
								if (e.target.value >= 0) {
									universityTuitionHandler(e.target.value, 'end');
								}
							}}
						/>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Filter;
