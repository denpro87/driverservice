import { Box, InputAdornment, MenuItem, makeStyles } from '@material-ui/core';
import { Button, GreenButton, IconButton, Page, Select, Text, TextField } from 'components';
import { ITemplateDataProps } from '../Template/Template.types';
import { ITransferProps } from './Transfer.types';
import { RulerButton } from '../../components';
import { rulerPriceBonusData, walletTypes } from '../../Wallets.data';
import { styles } from './Transfer.styles';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { validateNumber } from 'utils';
import React from 'react';
import clsx from 'clsx';
const useStyles = makeStyles(styles);

export const Transfer: React.FunctionComponent<ITransferProps> = props => {
	const classes = useStyles();
	const history = useHistory();
	const { formatMessage } = useIntl();
	const [walletType, setWalletType] = React.useState<string>('');
	const [amount, setAmount] = React.useState<string>('');
	const [walletAddress, setWalletAddress] = React.useState<string>('');
	const [numberValid, setNumberValid] = React.useState(true);
	const [templateName, setTemplateName] = React.useState<string>('');
	const params: any = props.location.state;
	const paymentTemplate = params && params.data ? params.data : null;
	console.log('paymentTemplate', paymentTemplate);
	React.useEffect(() => {
		setWalletType('');
		setAmount('');
		setTemplateName('');
		setWalletAddress('');
		// const params: any = props.location.state;
		// const data = params && params.data ? params.data : null;
		// console.log('ddddd', data);
		// setAmount(data && '');
		// setTemplateName(data ? params.data.templateName : '');
	}, [props.location.state]);

	const handleWalletTypeChange = (event: React.ChangeEvent<{ name?: string | undefined; value: string }>): void =>
		setWalletType(event.target.value);

	const handleRulerButtonClick = (amount: string): void => setAmount(amount);

	const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const amount = event.target.value;

		if (amount.includes(' ')) {
			const trimAmount = amount.replace(/\s/g, '');
			setAmount(trimAmount);
			setNumberValid(validateNumber(trimAmount));
		} else {
			setAmount(amount);
			setNumberValid(validateNumber(amount));
		}
	};

	const handleWalletAddressChange = (event: React.ChangeEvent<HTMLInputElement>): void => setWalletAddress(event.target.value);

	const handleQrClick = (): void => {};

	const handleNextClick = (): void =>
		history.push('/wallets/confirmation', { walletType: walletType, amount: amount, walletAddress: walletAddress });

	const handleTemplateClick = (template: ITemplateDataProps): void => {
		setTemplateName(template.templateName);
		setWalletType(template.walletType);
		setAmount(template.amount);
		setWalletAddress(template.walletAddress);
	};

	return (
		<Page title={formatMessage({ id: 'wallets.transfer.title' })} titleSize="medium">
			<Box className={classes.addFundsWrapper}>
				<Text className={classes.helperText}>{formatMessage({ id: 'wallets.payment_templates' })}</Text>
				<Box className={classes.TemplateButtonsWrapper}>
					{paymentTemplate?.map((template: ITemplateDataProps, index: number) => (
						<Button
							className={clsx({ active: template.templateName === templateName }, { [classes.paymentTemplateButton]: true })}
							key={index}
							onClick={(): void => handleTemplateClick(template)}
						>
							{template.templateName}
						</Button>
					))}
				</Box>
				<Select
					name="rulerToken"
					className={classes.walletType}
					label={formatMessage({ id: 'wallets.transfer.helper_text.wallet' })}
					value={walletType}
					onValueChange={handleWalletTypeChange}
				>
					{walletTypes.map(type => (
						<MenuItem key={type.value} className={classes.selectItem} value={type.value}>
							{formatMessage({ id: type.label })}
						</MenuItem>
					))}
				</Select>
				<Text className={clsx(classes.helperText, classes.textCenter)}>
					{formatMessage({ id: 'wallets.add_funds.helper_text.ruler_bonus' })}
				</Text>
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
					onValueChange={handleAmountChange}
				/>
				<TextField
					name="walletAddress"
					label={formatMessage({ id: 'wallets.transfer.wallet_address_description' })}
					inputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton iconProps={{ iconName: 'qr', secondaryColor: '#f8ca06' }} onClick={handleQrClick} />
							</InputAdornment>
						)
					}}
					value={walletAddress}
					onValueChange={handleWalletAddressChange}
				/>
			</Box>
			<GreenButton disabled={!walletType || !amount || !walletAddress || !numberValid} onClick={handleNextClick}>
				{formatMessage({ id: 'button.next' })}
			</GreenButton>
		</Page>
	);
};
