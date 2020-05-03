import { Box, makeStyles } from '@material-ui/core';
import { CheckBox, Dialog, GreenButton, IconButton, Page, Text, TextField } from 'components';
import { styles } from './Confirmation.styles';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import React from 'react';
import clsx from 'clsx';

const copy = require('clipboard-copy');
const useStyles = makeStyles(styles);

export const Confirmation: React.FunctionComponent = () => {
	const history = useHistory();
	const { formatMessage } = useIntl();
	const [checked, setChecked] = React.useState<boolean>(false);
	const classes = useStyles({ checked });
	const [showDialog, setShowDialog] = React.useState<boolean>(false);
	const [templateName, setTemplateName] = React.useState<string>('');
	const transactionHash = 'a1075db55d416d3ca199f55b1BvBM3sdelkfdjsl';
	const from = 'wallets.create_wallet.ruler_token';
	const to = 'dsdslfdslfjldksfjlsdjdfsdfsdfsdfsdfsdfsdfsdfsd';

	const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.persist();
		setChecked(event.target.checked);
	};

	const handleTemplateNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTemplateName(event.target.value);
	};

	const handleCopyClick = () => copy(transactionHash);

	const handlePayClick = () => {
		setShowDialog(true);
	};

	const handleDialogClose = () => {
		setShowDialog(false);
		history.replace('/wallets');
	};

	return (
		<Page
			pageHeaderClassName={classes.pageHeader}
			title={formatMessage({ id: 'wallets.confirmation.title' })}
			titleSize="medium"
			noHorizontalContentPadding
		>
			<Box className={classes.headerWrapper}>
				<Box className={classes.amountWrapper}>
					<Box className={classes.amountBox}>
						<Text className={classes.amountHelperText}>{formatMessage({ id: 'wallets.confirmation.credited' })}</Text>
						<Text className={classes.amountText}>€ 10.00</Text>
					</Box>
					<Box className={classes.amountBox}>
						<Text className={classes.amountHelperText}>{formatMessage({ id: 'wallets.confirmation.transaction_fee' })}</Text>
						<Text className={clsx(classes.amountText, classes.feeText)}>€ 0.20</Text>
					</Box>
				</Box>
				<Text className={classes.amountHelperText}>{formatMessage({ id: 'wallets.confirmation.transaction_hash' })}</Text>
				<Box className={classes.hashWrapper}>
					<Text className={classes.hashText}>{transactionHash}</Text>
					<IconButton className={classes.copyButton} iconProps={{ iconName: 'copy', color: '#ffffff' }} onClick={handleCopyClick} />
				</Box>
			</Box>
			<Box className={classes.infoWrapper}>
				<Box className={classes.infoBox}>
					<Text className={classes.amountHelperText}>{formatMessage({ id: 'wallets.confirmation.from' })}</Text>
					<Text className={classes.amountHelperText}>{formatMessage({ id: from })}</Text>
				</Box>
				<Box className={classes.infoBox}>
					<Text className={classes.amountHelperText}>{formatMessage({ id: 'wallets.confirmation.to' })}</Text>
					<Text className={classes.amountHelperText}>{to}</Text>
				</Box>
			</Box>
			<Box className={classes.footer}>
				<Box className={classes.templateWrapper}>
					<CheckBox
						checked={checked}
						label={formatMessage({ id: 'wallets.confirmation.save_payment_template' })}
						onValueChange={handleCheckChange}
					/>
					<TextField
						className={classes.templateName}
						name="templateName"
						label={formatMessage({ id: 'wallets.template.helper_text.payment_template' })}
						value={templateName}
						onValueChange={handleTemplateNameChange}
					/>
				</Box>
				<GreenButton iconName="add-payment" compact onClick={handlePayClick}>
					{formatMessage({ id: 'button.pay' })}
				</GreenButton>
			</Box>
			<Dialog
				open={showDialog}
				hasClose={true}
				illustrationName="superman"
				onClose={handleDialogClose}
				aria-labelledby="form-dialog-title"
				title={formatMessage({ id: 'wallets.confirmation.dialog.title' })}
			>
				<Text className={classes.dialogContentText}>{formatMessage({ id: 'wallets.confirmation.dialog.description' })}</Text>
			</Dialog>
		</Page>
	);
};