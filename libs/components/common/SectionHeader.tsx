import React from 'react';

interface SectionHeaderProps {
	title: string;
	subtitle: string;
	showTicker?: boolean;
	tickerItems?: string[];
	rightSlot?: React.ReactNode;
}

const SectionHeader = ({ title, subtitle, showTicker, tickerItems, rightSlot }: SectionHeaderProps) => {
	const label = showTicker ? 'Live ranking' : 'Featured';

	const tickerContent: string[] =
		tickerItems && tickerItems.length > 0
			? [...tickerItems, ...tickerItems]
			: ['Trend Universities', 'Top Universities', 'Popular Universities', 'Trend Universities', 'Top Universities', 'Popular Universities'];

	return (
		<div className="section-header">
			<div className="section-header__inner">
				<div className="section-header__left">
					<div className="section-header__label">
						<span className="section-header__dot" />
						<span className="section-header__label-text">{label}</span>
					</div>
					<h2 className="section-header__title">{title}</h2>
					<p className="section-header__subtitle">{subtitle}</p>
				</div>
				<div className="section-header__right">
					{rightSlot ?? (
						<div className="section-header__badge">
							<span>↑</span>
							<span>Top ranked</span>
						</div>
					)}
				</div>
			</div>
			{showTicker && (
				<div className="section-header__ticker-wrap">
					<div className="section-header__ticker">
						{tickerContent.map((item, i) => (
							<span key={i} className="section-header__ticker-item">
								{item}
							</span>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default SectionHeader;
