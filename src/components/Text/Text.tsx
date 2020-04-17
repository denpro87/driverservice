import { ITextProps, ParagraphProps, TextStyles, TitleProps } from './Text.types';
import { Typography, makeStyles } from '@material-ui/core';
import { styles } from './Text.styles';
import React from 'react';
import clsx from 'clsx';

export const createTextStyles = (textStyles: TextStyles): TextStyles => textStyles;

export const Title: React.FunctionComponent<TitleProps> = props => <Text block {...props} />;

Title.defaultProps = {
	component: 'h1'
};

export const Paragraph: React.FunctionComponent<ParagraphProps> = props => <Text component="p" block {...props} />;

export const Text: React.FunctionComponent<ITextProps> = React.memo(({ textStyles, ...restProps }) => {
	const props = { ...textStyles, ...restProps };
	const {
		component,
		block,
		inline,
		align,
		display = block ? (inline ? ('inline-block' as 'block') : 'block') : inline ? 'inline' : undefined,
		gutterBottom,
		noWrap,
		paragraph,
		variant,
		variantMapping,
		fontStretch,
		fontStyle,
		fontVariant,
		fontWeight,
		fontSize,
		lineHeight,
		fontFamily,
		letterSpacing,
		color,
		inheritStyles,
		className,
		children
	} = props;

	const _makeStyles = React.useCallback((inheritStyles: boolean = false) => makeStyles(styles(inheritStyles)), [inheritStyles]);
	const useStyles = _makeStyles();

	const classes = useStyles({
		fontStretch,
		fontStyle,
		fontVariant,
		fontWeight,
		fontSize,
		lineHeight,
		fontFamily,
		letterSpacing,
		color
	});

	const isParagraph = component === 'p' || paragraph;

	return (
		<Typography
			component={component as any}
			align={align}
			display={display}
			gutterBottom={gutterBottom}
			noWrap={noWrap}
			paragraph={paragraph}
			variant={variant}
			variantMapping={variantMapping}
			className={clsx(
				classes.text,
				{
					[classes.paragraph]: isParagraph
				},
				className
			)}
		>
			{children}
		</Typography>
	);
});

Text.defaultProps = {
	component: 'span'
};
