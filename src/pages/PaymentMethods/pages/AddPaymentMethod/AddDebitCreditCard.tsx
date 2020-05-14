import { Box, makeStyles } from '@material-ui/core';
import { CheckBox, GreenButton, Page, TextField } from 'components';
import { ICreditCardProps } from './AddPaymentMethod.types';
import { styles } from './AddPaymentMethod.styles';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import React from 'react';

const useStyles = makeStyles(styles);
const initialCardState: ICreditCardProps = {
	name: '',
	cardNumber: '',
	expireDate: '',
	cvc: '',
	cardCountry: '',
	zipCode: ''
};

export const AddDebitCreditCard: React.FunctionComponent = () => {
	const classes = useStyles();
	const history = useHistory();
	const { formatMessage } = useIntl();
	const [cardState, setCardState] = React.useState<ICreditCardProps>(initialCardState);
	const [checked, setChecked] = React.useState<boolean>(false);

	const handleStateChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		event.persist();
		setCardState(prevState => ({ ...prevState, [event.target.name]: event.target.value }));
	};

	const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.persist();
		setChecked(event.target.checked);
	};

	const handleNextClick = (): void => history.push('/payment-methods', { data: [cardState] });

	return (
		<Page title={formatMessage({ id: 'payment_methods.add_payment_method.card' })} titleSize="medium">
			<Box className={classes.cardInputWrapper}>
				<TextField
					name="name"
					label={formatMessage({ id: 'wallets.add_credit_card.card_owner_name' })}
					value={cardState.name}
					onValueChange={handleStateChange}
				/>
				<TextField
					name="cardNumber"
					label={formatMessage({ id: 'wallets.add_credit_card.card_number' })}
					value={cardState.cardNumber}
					onValueChange={handleStateChange}
				/>
				<Box className={classes.cardCredentialWrapper}>
					<TextField name="expireDate" label="MM / YY" value={cardState.expireDate} onValueChange={handleStateChange} />
					<TextField
						name="cvc"
						label={formatMessage({ id: 'wallets.add_credit_card.cvc' })}
						value={cardState.cvc}
						onValueChange={handleStateChange}
					/>
				</Box>
				<TextField
					name="cardCountry"
					label={formatMessage({ id: 'wallets.add_credit_card.card_country' })}
					value={cardState.cardCountry}
					onValueChange={handleStateChange}
				/>
				<TextField
					name="zipCode"
					label={formatMessage({ id: 'wallets.add_credit_card.zip_code' })}
					value={cardState.zipCode}
					onValueChange={handleStateChange}
				/>
			</Box>
			<Box className={classes.footer}>
				<CheckBox
					checked={checked}
					label={formatMessage({ id: 'wallets.add_credit_card.save_payment_method' })}
					onValueChange={handleCheckChange}
				/>
				<GreenButton iconName="add" compact onClick={handleNextClick}>
					{formatMessage({ id: 'button.add_payment_method' })}
				</GreenButton>
			</Box>
		</Page>
	);
};