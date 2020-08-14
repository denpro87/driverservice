import { CSSProperties, CreateCSSProperties } from '@material-ui/styles';
import { createStyles } from '@material-ui/core';
import { font, pxToRem } from 'styles';

const paymentMethodItemContainer: CSSProperties = {
	padding: `${pxToRem(15)} 0 ${pxToRem(5)}`
};

const paymentMethodItem: CreateCSSProperties = {
	borderRadius: pxToRem(15),
	backgroundColor: (props: any) => (props.isDarkMode ? '#fff' : '#181c19'),
	position: 'relative',
	padding: `${pxToRem(25)} ${pxToRem(30)}`,
	display: 'flex',
	flexDirection: 'column',
	'& span': {
		color: (props: any) => (props.isDarkMode ? '#181c19' : '#fff')
	}
};

const trashIcon: CSSProperties = {
	position: 'absolute',
	top: pxToRem(10),
	right: pxToRem(10),
	backgroundColor: 'transparent',
	padding: 0,
	boxShadow: 'none',
	'&:hover': {
		backgroundColor: 'transparent',
		opacity: 0.7
	}
};

const cardNumberText: CSSProperties = {
	...font({
		fontWeight: 600,
		lineHeight: 1.33,
		letterSpacing: pxToRem(6.3)
		// color: '#ffffff'
	}),
	fontSize: pxToRem(15),
	paddingTop: pxToRem(12)
};

const cardTypeText: CreateCSSProperties = {
	...font({
		fontWeight: 600,
		lineHeight: 1.67
	}),
	color: (props: any) => (props.isDarkMode ? '#181c19' : '#fff'),
	fontSize: pxToRem(15)
};
export const styles = createStyles({
	paymentMethodItemContainer,
	paymentMethodItem,
	cardTypeText,
	cardNumberText,
	trashIcon
});
