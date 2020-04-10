import { BlackIcon, IconButton } from 'components';
import { IPasswordInputProps } from './PasswordInput.types';
import { InputAdornment, TextField, makeStyles } from '@material-ui/core';
import { styles } from './PasswordInput.styles';

import React from 'react';

const useStyles = makeStyles(styles);

export const PasswordInput: React.FunctionComponent<IPasswordInputProps> = ({ onChange, placeholder }) => {
	const classes = useStyles();

	const [passwordIsMasked, setPasswordIsMasked] = React.useState(true);

	const togglePasswordMask = () => {
		setPasswordIsMasked(!passwordIsMasked);
	};

	return (
		<TextField
			variant="standard"
			fullWidth
			placeholder={placeholder}
			type={passwordIsMasked ? 'password' : 'text'}
			// {...props}
			InputProps={{
				endAdornment: (
					<InputAdornment position="end">
						{<IconButton iconName="eye" onClick={togglePasswordMask} className={classes.eyeIcon} />}
					</InputAdornment>
				)
			}}
		/>
	);
};
