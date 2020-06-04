import { Box, InputAdornment, MenuItem, makeStyles } from '@material-ui/core';
import { GreenButton, Page, Select, Text, TextField } from 'components';
import { RulerButton } from '../../components';
import { paymentMethodTypes, rulerPriceBonusData, walletTypes } from '../../Wallets.data';
import { styles } from './AddFunds.styles';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { validateNumber } from 'utils';
import React from 'react';

const useStyles = makeStyles(styles);

export const AddFunds: React.FunctionComponent = () => {
	const classes = useStyles();
	const history = useHistory();
	const { formatMessage } = useIntl();
	const [walletType, setWalletType] = React.useState<string>('ruler_token');
	const [paymentMethodType, setPaymentMethodType] = React.useState<string>('credit_card');
	const [amount, setAmount] = React.useState<string>('10');
	const [numberValid, setNumberValid] = React.useState(true);

	const handleWalletTypeChange = (event: React.ChangeEvent<{ name?: string | undefined; value: string }>): void =>
		setWalletType(event.target.value);

	const handlePaymentMethodTypeChange = (event: React.ChangeEvent<{ name?: string | undefined; value: string }>): void =>
		setPaymentMethodType(event.target.value);

	const handleRulerButtonClick = (amount: string): void => setAmount(amount);

	const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		setAmount(event.target.value);
		setNumberValid(validateNumber(event.target.value));
	};

	const handleNextClick = (): void => history.push('/wallets/add-funds/add-credit-card');

	return (
		<Page title={formatMessage({ id: 'wallets.add_funds.title' })} titleSize="large">
			<Box className={classes.addFundsWrapper}>
				<Select
					name="rulerToken"
					className={classes.walletType}
					label={formatMessage({ id: 'wallets.add_funds.helper_text.wallet_type' })}
					value={walletType}
					onValueChange={handleWalletTypeChange}
				>
					{walletTypes.map(type => (
						<MenuItem key={type.value} className={classes.selectItem} value={type.value}>
							{formatMessage({ id: type.label })}
						</MenuItem>
					))}
				</Select>
				<Text className={classes.helperText}>{formatMessage({ id: 'wallets.add_funds.helper_text.ruler_bonus' })}</Text>
				<Box className={classes.rulerPriceBonusButtonGroup}>
					{rulerPriceBonusData.map((data, index) => (
						<RulerButton
							key={index}
							price={data.rulerPrice}
							bonus={data.rulerBonus}
							active={data.rulerPrice === amount}
							onRulerButtonClick={handleRulerButtonClick}
						/>
					))}
				</Box>
				<TextField
					name="insertAmount"
					error={!numberValid}
					helperText={!numberValid ? formatMessage({ id: 'wallets.number_helper_text' }) : ''}
					className={classes.insertAmount}
					label={formatMessage({ id: 'wallets.add_funds.helper_text.amount_description' })}
					inputProps={{
						startAdornment: <InputAdornment position="start">€</InputAdornment>
					}}
					value={amount}
					onValueChange={handlePriceChange}
				/>
				<Select
					name="paymentMethod"
					label={formatMessage({ id: 'wallets.add_funds.helper_text.payment_method' })}
					value={paymentMethodType}
					onValueChange={handlePaymentMethodTypeChange}
				>
					{paymentMethodTypes.map(type => (
						<MenuItem key={type.value} className={classes.selectItem} value={type.value}>
							{formatMessage({ id: type.label })}
						</MenuItem>
					))}
				</Select>
			</Box>
			<GreenButton onClick={handleNextClick} disabled={!amount || !numberValid}>
				{formatMessage({ id: 'button.next' })}
			</GreenButton>
		</Page>
	);
};
