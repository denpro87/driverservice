import { FaqFooter } from '../../components';
import { Page } from 'components';
import { Paper, Typography, makeStyles } from '@material-ui/core';
import { styles } from './Faq.styles';
import clsx from 'clsx';

import React from 'react';

const useStyles = makeStyles(styles);

export const FaqLock: React.FunctionComponent = () => {
	const classes = useStyles();

	return (
		<Page title="I am done with the parking. How do I lock?" titleSize="medium">
			<Paper elevation={0} className={classes.container}>
				<Typography variant="h6" className={clsx(classes.text, classes.content)}>
					Scooter: Locking the scooter is as easy as locking your phone. Simply, tap Lock on your app that appears after you have finished
					the ride. Please note that the parking pins that appear on the map are preferred parking spaces and function as a parking guide
					for riders.
					<br />
					<br />
					Bikes: For Bikes, simply push down the rear wheel lever. If done correctly, you will hear a sound indicating that the bike has
					been locked.
				</Typography>
			</Paper>
			<FaqFooter />
		</Page>
	);
};