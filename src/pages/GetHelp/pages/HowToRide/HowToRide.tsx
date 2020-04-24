import { FullPage, GreenButton } from 'components';
import { IonSlides } from '@ionic/react';
import { Slide } from 'components/Slide';
import { makeStyles } from '@material-ui/styles';
import { slides } from './slide-data';
import { styles } from './HowToRide.styles';
import React from 'react';

const slideOpts = {
	initialSlide: 0,
	speed: 1000
};

const useStyles = makeStyles(styles);

export const HowToRide: React.FunctionComponent = () => {
	const classes = useStyles();

	return (
		<FullPage canGoBack pageHeaderClassName={classes.pageHeader}>
			<div className={classes.pageContent}>
				<div>
					<IonSlides pager options={slideOpts}>
						{slides.map((slide, index) => (
							<Slide key={index} slide={slide} />
						))}
					</IonSlides>
				</div>
				<div className={classes.footer}>
					<GreenButton compact iconName="well-done-checked" className={classes.skipButton}>
						Got it
					</GreenButton>
				</div>
			</div>
		</FullPage>
	);
};