import { ITextFieldProps } from './TextField.types';
import { Icon, IconButton } from 'components';
import { InputAdornment, TextField as MuiTextField, makeStyles } from '@material-ui/core';
import { styles } from './TextField.styles';
import React from 'react';
import clsx from 'clsx';

const useStyles = makeStyles(styles);

export const TextField: React.FunctionComponent<ITextFieldProps> = ({
	name,
	className,
	value,
	label,
	type,
	error,
	helperText,
	select,
	children,
	onValueChange,
	inputProps,
	selectProps,
	...rest
}) => {
	const classes = useStyles();

	return (
		<MuiTextField
			classes={{ root: clsx(classes.textFieldRoot, className) }}
			type={type}
			error={error}
			helperText={helperText}
			fullWidth
			select={select}
			label={label}
			name={name}
			value={value}
			SelectProps={selectProps}
			InputProps={inputProps}
			onChange={onValueChange}
			{...rest}
		>
			{children}
		</MuiTextField>
	);
};

export const PasswordInput: React.FunctionComponent<ITextFieldProps> = props => {
	const [passwordIsMasked, setPasswordIsMasked] = React.useState(true);

	const togglePasswordMask = (): void => {
		setPasswordIsMasked(!passwordIsMasked);
	};

	return (
		<TextField
			{...props}
			type={passwordIsMasked ? 'password' : 'text'}
			inputProps={{
				endAdornment: (
					<InputAdornment position="end">
						<IconButton iconName="eye" onClick={togglePasswordMask} />
					</InputAdornment>
				)
			}}
		/>
	);
};

export const Select: React.FunctionComponent<ITextFieldProps> = ({ children, ...rest }) => {
	const classes = useStyles();

	const iconComponent = (): JSX.Element => {
		return <Icon className={classes.selectIcon} iconName="down" />;
	};

	return (
		<TextField {...rest} select selectProps={{ IconComponent: iconComponent }}>
			{children}
		</TextField>
	);
};
