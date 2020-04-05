import { Box, makeStyles } from '@material-ui/core';
import { DEFAULT_PAGE_BACKGROUND, styles } from './Page.styles';
import { IPageProps } from './Page.types';
import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import clsx from 'clsx';

const useStyles = makeStyles(styles);

export const Page: React.FunctionComponent<IPageProps> = React.memo(({ background, backgroundColor, className, onClick, children }) => {
	const classes = useStyles({
		background,
		backgroundColor
	});

	return (
		<IonPage>
			<IonContent>
				<Box className={clsx(classes.page, className)} onClick={onClick}>
					{children}
				</Box>
			</IonContent>
		</IonPage>
	);
});

Page.defaultProps = {
	background: DEFAULT_PAGE_BACKGROUND
};