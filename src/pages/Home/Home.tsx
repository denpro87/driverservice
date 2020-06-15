import { AreasListItem, PaymentMethodItem } from './components';
import { BarcodeScanResult, BarcodeScanner } from '@ionic-native/barcode-scanner';
import {
	BlackButton,
	BottomSheet,
	Button,
	Dialog,
	Divider,
	FullPage,
	GreenButton,
	Icon,
	IconButton,
	Image,
	LightGreenButton,
	Link,
	Menu,
	SwitchListItem,
	Text,
	TextField
} from 'components';
import { Box, Collapse, Input, List, Slider, Typography } from '@material-ui/core';
import { ICreditCardProps } from '../PaymentMethods/pages/AddPaymentMethod/AddPaymentMethod.types';
import { IHomeProps } from './Home.types';
import { IonImg, IonSlide, IonSlides } from '@ionic/react';
import {
	areasListItems,
	carInfo,
	damagedVehicleTypes,
	finishedRideVehicleInfo,
	markerList,
	pausedCarInfo,
	pausedScooterInfo,
	scooterInfo,
	vehicleButtons
} from './Home.data';
import { makeStyles } from '@material-ui/styles';
import { mapViewer, styles } from './Home.styles';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import Fab from '@material-ui/core/Fab';
import MapGL, { Marker, NavigationControl, ViewState } from 'react-map-gl';
import React from 'react';
import bike from './images/bike.png';
import bird from './images/bird.png';
import car from './images/car.png';
import circ from './images/circ.png';
import clsx from 'clsx';
import lime from './images/lime.png';
import rateImage from './images/rate.svg';
import spin from './images/spin.png';
import tier from './images/tier.png';
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
const useStyles = makeStyles(styles);
const QRCode = require('qrcode-react');
const slideOpts = {
	initialSlide: 0,
	speed: 1000,
	autoHeight: true
};

// const reserveSlideOpts = {
// 	initialSlide: 0,
// 	speed: 1000
// };

export const Home: React.FunctionComponent<IHomeProps> = props => {
	const classes = useStyles();
	const history = useHistory();
	const { formatMessage } = useIntl();
	const initialState = {
		selectAll: false,
		lime: true,
		bird: false,
		spin: true,
		circ: false,
		tier: false,
		electrical: false,
		internalCombustion: false
	};
	const hasAccount = true;
	const hasValidatedDriverLicence = true;
	const [viewport, setViewport] = React.useState<ViewState>({
		latitude: 17.44212,
		longitude: 78.391384,
		zoom: 14,
		bearing: 0,
		pitch: 0
	});
	const [vehicleSelectionExpanded, setVehicleSelectionExpanded] = React.useState(false);
	const [rateRulerModal, setRateRulerModal] = React.useState(false);
	const [open, setOpen] = React.useState(false);
	const [showInviteFriends, setShowInviteFriends] = React.useState<boolean>(false);
	const [showReport, setShowReport] = React.useState(false);
	const [showAreas, setShowAreas] = React.useState(false);
	const [showFilter, setShowFilter] = React.useState(false);
	const [paidSuccess, setPaidSuccess] = React.useState(false);
	const [showWrongCode, setShowWrongCode] = React.useState(false);
	const [reportSubmitModal, setReportSubmitModal] = React.useState(false);
	const [rideStart, setRideStart] = React.useState(false);
	const [ridingStart, setRidingStart] = React.useState(true);
	// const [enteredQrCode, setEnteredQrCode] = React.useState(false);
	const [reservation, setReservation] = React.useState(false);
	// const [selectedVehicle, setSelectedVehicle] = React.useState('');
	// const [showDischargedVehicle, setShowDischargedVehicle] = React.useState(false);
	const [activeVehicle, setActiveVehicle] = React.useState('');
	const [placeHolder, setPlaceHolder] = React.useState('');
	const [buttonLabel, setButtonLabel] = React.useState('Car');
	const [qrCode, setQrCode] = React.useState('123456');
	const [qrCodeInput, setQrCodeInput] = React.useState('');
	const [scanEnterButtonLabel, setScanEnterButtonLabel] = React.useState('Scan code');
	const [switchState, setSwitchState] = React.useState(initialState);
	const [batteryLevel, setBatteryLevel] = React.useState<number[]>([35, 100]);
	const [showScanEnterCode, setShowScanEnterCode] = React.useState(false);
	const [showVehicleRide, setShowVehicleRide] = React.useState(false);
	const [cardData, setCardData] = React.useState<ICreditCardProps[]>([]);
	const [paidModal, setPaidModal] = React.useState(false);
	const [finishRidingModal, setFinishRidingModal] = React.useState(false);
	const [showFinishedRide, setShowFinishedRide] = React.useState(false);
	const [rideReview, setRideReview] = React.useState('');
	const [checked, setChecked] = React.useState(false);
	React.useEffect(() => {
		const params: any = props.location.state;
		const data = params && params.data ? params.data : null;
		const index = params && params.index > -1 ? params.index : -1;
		const checked = params && params.checked;
		setChecked(checked);

		if (data) {
			if (index > -1) {
				const temp = cardData;
				temp.splice(index, 1, data);
				setCardData([...temp]);
			} else {
				// add
				const temp = cardData;
				const foundIndex = temp.findIndex(dt => dt.name === data.name);

				if (foundIndex > -1) {
					// if newly created card owner name already exists... please replace
					temp.splice(foundIndex, 1, data);
					setCardData([...temp]);
				} else {
					setCardData(prevData => [...prevData, data]);
				}
			}
		}
	}, [props.location.state]);
	React.useEffect(() => {
		let placeHolderStr = '';

		if (qrCode !== undefined) {
			for (let i = 0; i < qrCode.length; i++) {
				placeHolderStr += '_';
			}
			setPlaceHolder(placeHolderStr);
		}
	}, [qrCode]);

	const handleItemClick = (index: number, cardData: any) => (event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
		history.push('/payment-methods/add-payment-method/card', { data: cardData, selectedIndex: index, checked: checked });
	};

	const handleDrawerClick = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent): void => {
		if (
			event &&
			event.type === 'keydown' &&
			((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
		) {
			return;
		}
		setOpen(open);
	};

	const handleReportBottomSheetChange = (isOpen: boolean): void => {
		setShowReport(isOpen);
	};

	const handleAreasBottomSheetChange = (isOpen: boolean): void => {
		setShowAreas(isOpen);
	};

	const handleInviteFriendsBottomSheetChange = (isOpen: boolean): void => {
		setShowInviteFriends(isOpen);
	};

	const handleFilterBottomSheetChange = (isOpen: boolean): void => {
		setShowFilter(isOpen);
	};

	const handleScanEnterCodeBottomSheetChange = (isOpen: boolean): void => {
		setShowScanEnterCode(isOpen);
	};

	const handleBadlyClick = (): void => {
		setShowReport(false);
		history.push('/my-rides/badly-parked-vehicle');
	};

	const handleDamagedClick = (): void => {
		setShowReport(false);
		history.push('/my-rides/damaged-vehicle');
	};

	const handleContactClick = (): void => {
		setShowReport(false);
		history.push('/my-rides/report');
	};

	const handleRateRulerDialogClose = (): void => {
		setRateRulerModal(false);
	};

	const handlePaidDialogClose = (): void => {
		setPaidModal(false);
		setPaidSuccess(true);
	};

	const handleRideReivewChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		setRideReview(event?.target.value);
	};

	const handleStateChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		event.persist();

		if (event.target.name === 'selectAll') {
			if (event.target.checked) {
				const temp = {
					selectAll: true,
					lime: true,
					bird: true,
					spin: true,
					circ: true,
					tier: true,
					electrical: true,
					internalCombustion: true
				};
				setSwitchState(temp);
			} else {
				const temp = {
					selectAll: false,
					lime: false,
					bird: false,
					spin: false,
					circ: false,
					tier: false,
					electrical: false,
					internalCombustion: false
				};
				setSwitchState(temp);
			}
		} else {
			setSwitchState(prevState => ({ ...prevState, [event.target.name]: event.target.checked }));
		}
	};

	const handleBatteryLevelChange = (event: any, newValue: number | number[]): void => {
		setBatteryLevel(newValue as number[]);
	};

	const handleFlashButtonClick = (): void => {};

	const handleScanButtonClick = async () => {
		setScanEnterButtonLabel(formatMessage({ id: 'button.scan_code' }));

		const barCodeData: BarcodeScanResult = await BarcodeScanner.scan({
			resultDisplayDuration: 3000
		});
		const barCodeText = barCodeData.text ?? '';
		setQrCode(barCodeText);
	};

	const handleEnterButtonClick = (): void => {
		setScanEnterButtonLabel(formatMessage({ id: 'button.enter_code' }));
		setQrCodeInput('');
	};

	const handleQrCodeChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		if (qrCode.includes(event.target.value)) {
			const qrCodeInputValue = event.target.value;
			setQrCodeInput(qrCodeInputValue);

			if (qrCode === event.target.value) {
				// setEnteredQrCode(true);
				// setShowDischargedVehicle(true);
				setShowScanEnterCode(false);
				setScanEnterButtonLabel(formatMessage({ id: 'button.scan_code' }));
				// setShowDischargedVehicle(false);
				setShowVehicleRide(true);
			}
		} else {
			const qrCodeInputValue = event.target.value;
			setQrCodeInput(qrCodeInputValue);
			setShowWrongCode(true);

			if (event.target.value.length === 6) {
				setShowWrongCode(false);
				setQrCodeInput('');
			}
		}
	};

	const handleVehicleRideBottomSheetChange = (isOpen: boolean): void => {
		setShowVehicleRide(isOpen);
	};

	const handleFinishRideBottomSheetChange = (isOpen: boolean): void => {
		setShowFinishedRide(isOpen);
	};

	const handleMarkerClick = (index: number, vehicleNumber: number, iconName: string) => (
		event: React.MouseEvent<HTMLElement, MouseEvent>
	): void => {
		if (vehicleNumber === 0) {
			setShowVehicleRide(true);
			setActiveVehicle(iconName);
		}
	};

	const handleVehicleRideCloseButtonClick = (): void => {
		setShowVehicleRide(false);
		setActiveVehicle('');
	};

	const handleAddPaymentMethodClick = (): void => {
		history.push('/payment-methods/add-payment-method', { pageName: 'home', selectedIndex: -1 });
	};

	const handleReportSubmitDialogClose = (): void => {
		setReportSubmitModal(false);
	};

	const handleVehicleTypeClick = (iconName: string) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
		// setVehicleSelectionExpanded(false);
		// setShowVehicleInfo(true);
		// setSelectedVehicle(iconName);
	};

	const handleFinishRidingClick = (): void => {
		setFinishRidingModal(false);
		setShowVehicleRide(false);
		setShowFinishedRide(true);
	};

	const handleMenuItemClick = (href: string): void => {
		if (href === 'home') {
			setShowInviteFriends(true);
		} else {
			history.push(`/${href}`);
		}
	};

	const handleTrashButtonClick = (index: number) => (event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
		const temp = cardData;
		temp.splice(index, 1);
		setCardData([...temp]);
	};

	const renderVehicleInfo = (info: any, index: number): JSX.Element => {
		return (
			<Box key={index} className={classes.infoWrapper}>
				{index === 0 ? (
					<Image src={require(`${info.iconName}`)} width={30} height={30} />
				) : (
					<Icon iconName={info.iconName} colorType="green" />
				)}
				<Text className={classes.propertyText}>{info.property}</Text>
				<Text className={classes.descriptionText}>{info.description}</Text>
			</Box>
		);
	};

	return (
		<FullPage>
			<MapGL
				{...viewport}
				width="100%"
				height="100%"
				style={mapViewer}
				mapStyle="mapbox://styles/mapbox/streets-v11"
				onViewportChange={setViewport}
				mapboxApiAccessToken={MAPBOX_TOKEN}
			>
				<IconButton
					className={classes.reportButton}
					iconProps={{ iconName: 'report', primaryColor: 'black', secondaryColor: 'red' }}
					onClick={(): void => setShowReport(true)}
				/>
				<Box className={classes.navControl}>
					<NavigationControl onViewportChange={setViewport} />
				</Box>
				{markerList.map((marker, index) => {
					return (
						<Marker longitude={marker.long} key={index} latitude={marker.lat}>
							<Box
								className={clsx(
									{ [classes.circleWithVehicleNumber]: marker.vehicleNumber > 0 },
									{ [clsx(classes.circleWithVehicleIcon, classes.vehicleIconInActive)]: marker.vehicleNumber === 0 },
									{
										[clsx(classes.circleWithVehicleIcon, classes.vehicleIconActive)]:
											marker.vehicleNumber === 0 && marker.iconName === activeVehicle
									}
								)}
								onClick={handleMarkerClick(index, marker.vehicleNumber, marker.iconName)}
							>
								{marker.iconName ? (
									<>
										<Icon iconName={marker.iconName} colorType="black" />
										<Box className={classes.iconDecorator}>
											<Image src={require(`${marker.decorator}`)} />
										</Box>
									</>
								) : (
									// <Box className={classes.iconWrapper}>
									<Text className={classes.markerNumberText}>{marker.vehicleNumber}</Text>
									// </Box>
								)}
							</Box>
						</Marker>
					);
				})}
				<IconButton className={classes.zonesButton} iconName="zones" colorType="black" onClick={(): void => setShowAreas(true)} />
				<Box className={classes.vehicleButtonGroup}>
					<Collapse in={vehicleSelectionExpanded}>
						<Box className={classes.vehicleButtonGroupWrapper}>
							{vehicleButtons.map(
								(button, index): JSX.Element => {
									return (
										<IconButton
											noShadow
											key={index}
											label={formatMessage({ id: button.label })}
											iconName={button.iconName}
											colorType="black"
											style={button.style}
											onClick={handleVehicleTypeClick(button.iconName)}
										/>
									);
								}
							)}
						</Box>
					</Collapse>
				</Box>
				<IconButton
					noShadow
					iconName={vehicleSelectionExpanded ? 'close' : 'vehicle'}
					className={clsx(
						{ [classes.closeIconButton]: vehicleSelectionExpanded },
						{ [classes.vehicleIconButton]: !vehicleSelectionExpanded }
					)}
					colorType="black"
					onClick={(): void => setVehicleSelectionExpanded(!vehicleSelectionExpanded)}
				/>
				<Text className={clsx(classes.iconButtonText, classes.positionVehicleText)}>{formatMessage({ id: 'home.text.vehicle' })}</Text>
				<IconButton className={classes.findMeButton} iconName="find-me" colorType="black" />
				<Text className={clsx(classes.iconButtonText, classes.positionLocationText)}>{formatMessage({ id: 'home.text.location' })}</Text>
				<Box className={classes.homeButtons}>
					<IconButton className={classes.menuButton} iconName="menu" colorType="black" noShadow onClick={handleDrawerClick(true)} />
					<Fab aria-label="add" className={classes.qrButton} onClick={(): void => setShowScanEnterCode(true)}>
						<Icon colorType="black" iconName="qr" primaryColor="white" secondaryColor="white" />
					</Fab>
					<IconButton
						className={classes.filterButton}
						iconName="filter"
						colorType="black"
						noShadow
						onClick={(): void => setShowFilter(true)}
					/>
				</Box>
				<Box className={classes.homeButtonsText}>
					<Text className={classes.iconButtonText}>{formatMessage({ id: 'home.text.menu' })}</Text>
					<Text className={classes.iconButtonText}>{formatMessage({ id: 'home.text.filter' })}</Text>
				</Box>
			</MapGL>
			<Dialog
				title={formatMessage({ id: 'home.rate_ruler.dialog.title' })}
				open={rateRulerModal}
				hasClose
				illustrationName="rate"
				onClose={handleRateRulerDialogClose}
				aria-labelledby="form-dialog-title"
			>
				<Text className={classes.dialogContentText}>{formatMessage({ id: 'home.rate_ruler.dialog.description' })}</Text>
				<Box className={classes.rateImageWrapper}>
					<IonImg className={classes.rateImage} src={rateImage} />
				</Box>
			</Dialog>
			<Menu open={open} onOpen={handleDrawerClick(true)} onClose={handleDrawerClick(false)} menuItemClick={handleMenuItemClick} />
			<BottomSheet
				title={formatMessage({ id: 'home.invite_friends_sheet.title' })}
				description={formatMessage({ id: 'home.invite_friends_sheet.description' })}
				open={showInviteFriends}
				onBottomSheetChange={handleInviteFriendsBottomSheetChange}
			>
				<GreenButton className={classes.shareButton} iconName="share">
					{formatMessage({ id: 'home.invite_friends_sheet.button.text' })}
				</GreenButton>
			</BottomSheet>
			<BottomSheet
				hasCloseButton
				onCloseButtonClick={(): void => setShowReport(false)}
				title={formatMessage({ id: 'get_help.add_report_sheet.title' })}
				open={showReport}
				onBottomSheetChange={handleReportBottomSheetChange}
			>
				<Typography className={classes.sheetText}>{formatMessage({ id: 'get_help.add_report_sheet.description' })}</Typography>
				<LightGreenButton className={classes.sheetButton} iconName="badly-parked-vehicle" onClick={handleBadlyClick}>
					{formatMessage({ id: 'home.add_report_sheet.button.badly_parked_vehicle' })}
				</LightGreenButton>
				<LightGreenButton className={classes.sheetButton} iconName="damaged-vehicle" onClick={handleDamagedClick}>
					{formatMessage({ id: 'get_help.add_report_sheet.button.damaged_vehicle' })}
				</LightGreenButton>
				<LightGreenButton className={classes.sheetButton} iconName="support" onClick={handleContactClick}>
					{formatMessage({ id: 'get_help.add_report_sheet.button.support' })}
				</LightGreenButton>
			</BottomSheet>
			<BottomSheet
				hasCloseButton
				onCloseButtonClick={(): void => setShowAreas(false)}
				title={formatMessage({ id: 'home.areas_sheet.title' })}
				open={showAreas}
				onBottomSheetChange={handleAreasBottomSheetChange}
			>
				<List className={classes.areasList}>
					{areasListItems.map((listItem, index) => {
						return <AreasListItem key={index} {...listItem} />;
					})}
				</List>
			</BottomSheet>
			<BottomSheet
				outDecorator
				onCloseButtonClick={(): void => setShowFilter(false)}
				open={showFilter}
				onBottomSheetChange={handleFilterBottomSheetChange}
			>
				<Box className={classes.buttonGroupWrapper}>
					{damagedVehicleTypes.map((damagedVehicleType, index) => {
						return (
							<Button
								className={clsx(
									{ [classes.button]: true },
									{ [classes.activeBackground]: buttonLabel === formatMessage({ id: damagedVehicleType.label }) },
									{ [classes.inActiveBackground]: buttonLabel !== formatMessage({ id: damagedVehicleType.label }) }
								)}
								key={index}
								onClick={(): void => setButtonLabel(formatMessage({ id: damagedVehicleType.label }))}
							>
								<Icon iconName={damagedVehicleType.iconName} colorType="black" />
								<Text className={classes.smallText}>{formatMessage({ id: damagedVehicleType.label })}</Text>
							</Button>
						);
					})}
				</Box>
				<Text className={classes.smallText}>{formatMessage({ id: 'home.filter_sheet.text.companies' })}</Text>
				<List className={classes.filterList}>
					<SwitchListItem
						title={formatMessage({ id: 'home.text.all' })}
						iconName="well-done-checked"
						name="selectAll"
						checked={switchState.selectAll}
						onChange={handleStateChange}
					/>
					<Divider />
					<SwitchListItem
						title={formatMessage({ id: 'service_providers.lime.name' })}
						imageUrl={lime}
						name="lime"
						checked={switchState.lime}
						onChange={handleStateChange}
					/>
					<Divider />
					<SwitchListItem
						title={formatMessage({ id: 'service_providers.bird.name' })}
						imageUrl={bird}
						name="bird"
						checked={switchState.bird}
						onChange={handleStateChange}
					/>
					<Divider />
					<SwitchListItem
						title={formatMessage({ id: 'service_providers.spin.name' })}
						imageUrl={spin}
						name="spin"
						checked={switchState.spin}
						onChange={handleStateChange}
					/>
					<Divider />
					<SwitchListItem
						title={formatMessage({ id: 'service_providers.circ.name' })}
						imageUrl={circ}
						name="circ"
						checked={switchState.circ}
						onChange={handleStateChange}
					/>
					<Divider />
					<SwitchListItem
						title={formatMessage({ id: 'service_providers.tier.name' })}
						imageUrl={tier}
						name="tier"
						checked={switchState.tier}
						onChange={handleStateChange}
					/>
					<Box className={classes.batteryLevelText}>
						<Text className={classes.smallText}>{formatMessage({ id: 'home.filter_sheet.text.battery_level' })}</Text>
					</Box>
					<Slider
						value={batteryLevel}
						onChange={handleBatteryLevelChange}
						aria-labelledby="battery-level-slider"
						ThumbComponent={(props: any) => (
							<span {...props}>
								<Icon iconName="buble" colorType="green" />
							</span>
						)}
						classes={{ root: classes.sliderContainer, rail: classes.railPart, track: classes.trackPart }}
					/>
					<Box className={classes.percentageTextWrapper}>
						<Text className={classes.percentageText}>{`${batteryLevel[0]}%`}</Text>
						<Text className={classes.percentageText}>{`${batteryLevel[1]}%`}</Text>
					</Box>
					<Box className={classes.engineTypeText}>
						<Text className={classes.smallText}>{formatMessage({ id: 'home.filter_sheet.text.engine_type' })}</Text>
					</Box>
					<SwitchListItem
						title={formatMessage({ id: 'home.filter_sheet.text.electrical' })}
						name="electrical"
						checked={switchState.electrical}
						onChange={handleStateChange}
					/>
					<Divider />
					<SwitchListItem
						title={formatMessage({ id: 'home.filter_sheet.text.internal_combustion' })}
						name="internalCombustion"
						checked={switchState.internalCombustion}
						onChange={handleStateChange}
					/>
				</List>
				<Button iconName="reset" compact className={classes.resetButton} onClick={(): void => setSwitchState(initialState)}>
					{formatMessage({ id: 'button.reset' })}
				</Button>
			</BottomSheet>
			<BottomSheet
				title={
					scanEnterButtonLabel === formatMessage({ id: 'button.scan_code' })
						? formatMessage({ id: 'home.qr_code_sheet.scan_title' })
						: formatMessage({ id: 'home.qr_code_sheet.enter_title' })
				}
				description={
					scanEnterButtonLabel === formatMessage({ id: 'button.scan_code' })
						? formatMessage({ id: 'home.qr_code_sheet.scan_description' })
						: formatMessage({ id: 'home.qr_code_sheet.enter_description' })
				}
				open={showScanEnterCode}
				darkMode
				onBottomSheetChange={handleScanEnterCodeBottomSheetChange}
			>
				{scanEnterButtonLabel === formatMessage({ id: 'button.scan_code' }) ? (
					<Box className={classes.QRcodePhotoContainer}>
						<Box className={classes.QRcodePhotoAspectRatioBox}>
							<Box className={classes.QRcodePhotoAspectRatioBoxInside}>
								{qrCode !== undefined && (
									<Box className={classes.QRcodeImageContainer}>
										<QRCode value={qrCode} size={255} />
									</Box>
								)}
							</Box>
						</Box>
					</Box>
				) : (
					<Box
						className={clsx(
							{ [classes.inputWrapper]: true },
							{ [classes.inputWrapperSmallMarin]: showWrongCode },
							{ [classes.inputWrapperLargeMargin]: !showWrongCode }
						)}
					>
						<Box className={classes.wrongCodeTextWrapper}>
							{showWrongCode && (
								<Text className={classes.wrongCodeText}>{formatMessage({ id: 'home.qr_code_sheet.text.wrong_code' })}</Text>
							)}
							{/* {showDischargedVehicle && (
								<Text className={classes.wrongCodeText}>{formatMessage({ id: 'home.qr_code_sheet.text.discharged_vehicle' })}</Text>
							)} */}
						</Box>
						<Input
							disableUnderline
							placeholder={placeHolder}
							value={qrCodeInput}
							onChange={handleQrCodeChange}
							className={classes.qrCodeInput}
						/>
					</Box>
				)}
				<Box
					className={clsx(
						{ [classes.footer]: true },
						{ [classes.scanPadding]: scanEnterButtonLabel === formatMessage({ id: 'button.scan_code' }) },
						{ [classes.enterPadding]: scanEnterButtonLabel !== formatMessage({ id: 'button.scan_code' }) }
					)}
				>
					<Box className={classes.scanEnterButtonGroupWrapper}>
						<Button
							className={clsx(
								{ [classes.scanEnterCodeButton]: true },
								{ [classes.scanEnterCodeButtonActive]: scanEnterButtonLabel === formatMessage({ id: 'button.scan_code' }) },
								{ [classes.scanEnterCodeButtonInActive]: scanEnterButtonLabel !== formatMessage({ id: 'button.scan_code' }) }
							)}
							onClick={handleScanButtonClick}
						>
							{formatMessage({ id: 'button.scan_code' })}
						</Button>
						<Button
							disabled={qrCode === undefined}
							className={clsx(
								{ [classes.scanEnterCodeButton]: true },
								{ [classes.scanEnterCodeButtonActive]: scanEnterButtonLabel === formatMessage({ id: 'button.enter_code' }) },
								{ [classes.scanEnterCodeButtonInActive]: scanEnterButtonLabel !== formatMessage({ id: 'button.enter_code' }) }
							)}
							onClick={handleEnterButtonClick}
						>
							{formatMessage({ id: 'button.enter_code' })}
						</Button>
					</Box>
					<IconButton
						className={classes.flashButton}
						iconProps={{ iconName: 'flashlight', color: '#181c19' }}
						onClick={handleFlashButtonClick}
					/>
				</Box>
			</BottomSheet>
			<BottomSheet
				open={showVehicleRide}
				hasCloseButton
				hasFindMeButton
				onCloseButtonClick={handleVehicleRideCloseButtonClick}
				onBottomSheetChange={handleVehicleRideBottomSheetChange}
			>
				<IonSlides options={slideOpts}>
					<IonSlide className={classes.slide}>
						<Box className={classes.vehicleInfo}>
							{activeVehicle === 'car' &&
								ridingStart &&
								carInfo.map(
									(info, index): JSX.Element => {
										return renderVehicleInfo(info, index);
									}
								)}
							{activeVehicle === 'car' &&
								!ridingStart &&
								pausedCarInfo.map(
									(info, index): JSX.Element => {
										return renderVehicleInfo(info, index);
									}
								)}
							{activeVehicle === 'scooter' &&
								ridingStart &&
								scooterInfo.map(
									(info, index): JSX.Element => {
										return renderVehicleInfo(info, index);
									}
								)}
							{activeVehicle === 'scooter' &&
								!ridingStart &&
								pausedScooterInfo.map(
									(info, index): JSX.Element => {
										return renderVehicleInfo(info, index);
									}
								)}
						</Box>
						{!hasAccount && (
							<Box className={classes.vehicleInfoFooter}>
								<GreenButton iconName="create-account" compact onClick={(): void => history.push('/welcome/create-account')}>
									{formatMessage({ id: 'welcome.button.create_account' })}
								</GreenButton>
								<Text className={classes.swipeText}>
									{formatMessage({ id: 'home.vehicle_info_sheet.text.description_create_account' })}
								</Text>
							</Box>
						)}
						{hasAccount && !hasValidatedDriverLicence && (
							<Box className={classes.vehicleInfoFooter}>
								<GreenButton iconName="driver-licence" compact onClick={(): void => history.push('/driver-licence')}>
									{formatMessage({ id: 'button.add_driver_licence' })}
								</GreenButton>
								<Text className={classes.swipeText}>
									{formatMessage({ id: 'home.vehicle_info_sheet.text.description_driver_licence' })}
								</Text>
							</Box>
						)}
						{hasAccount && hasValidatedDriverLicence && !paidSuccess && (
							<Box className={classes.vehicleInfoFooter}>
								<GreenButton iconName="add-payment" compact onClick={handleAddPaymentMethodClick}>
									{formatMessage({ id: 'button.add_payment_method' })}
								</GreenButton>
								<Text className={classes.swipeText}>
									{formatMessage({ id: 'home.vehicle_info_sheet.text.description_payment_method' })}
								</Text>
							</Box>
						)}
						{hasAccount && hasValidatedDriverLicence && paidSuccess && !reservation && (
							<Box className={classes.vehicleInfoFooter}>
								{reservation ? (
									<GreenButton iconName="start" compact onClick={(): void => setRideStart(true)}>
										{formatMessage({ id: 'button.ride' })}
									</GreenButton>
								) : (
									<Box className={classes.scanAndReserveButtonGroupWrapper}>
										<LightGreenButton iconName="qr" compact>
											{formatMessage({ id: 'button.scan' })}
										</LightGreenButton>
										<GreenButton iconName="lock" compact onClick={(): void => setReservation(true)}>
											{formatMessage({ id: 'button.reserve' })}
										</GreenButton>
									</Box>
								)}
								<Text className={classes.swipeText}>{formatMessage({ id: 'home.vehicle_info_sheet.text.swipe_more' })}</Text>
							</Box>
						)}
						{hasAccount && hasValidatedDriverLicence && paidSuccess && reservation && (
							<Box className={classes.vehicleInfoFooter}>
								{rideStart ? (
									<Box className={classes.scanAndReserveButtonGroupWrapper}>
										<LightGreenButton iconName="point" compact onClick={(): void => setFinishRidingModal(true)}>
											{formatMessage({ id: 'button.finish' })}
										</LightGreenButton>
										{ridingStart ? (
											<GreenButton iconName="pause" compact onClick={(): void => setRidingStart(false)}>
												{formatMessage({ id: 'button.pause' })}
											</GreenButton>
										) : (
											<GreenButton iconName="start" compact onClick={(): void => setRidingStart(true)}>
												{formatMessage({ id: 'button.start' })}
											</GreenButton>
										)}
									</Box>
								) : (
									<GreenButton iconName="start" compact onClick={(): void => setRideStart(true)}>
										{formatMessage({ id: 'button.ride' })}
									</GreenButton>
								)}
								<Text className={classes.swipeText}>{formatMessage({ id: 'home.vehicle_info_sheet.text.swipe_more' })}</Text>
							</Box>
						)}
					</IonSlide>
					<IonSlide className={classes.slide}>
						{hasAccount && hasValidatedDriverLicence && !paidSuccess && (
							<>
								<Box className={classes.paymentMethodTitleTextWrapper}>
									<Text>{formatMessage({ id: 'home.payment_method_sheet.text.select_payment_method' })}</Text>
								</Box>
								<Box className={classes.walletsLogoContainer}>
									<Box className={classes.walletsLogo}>
										<IconButton iconProps={{ iconName: 'well-done-checked', color: '#ffffff' }} className={classes.wellDoneIcon} />
										<Link className={classes.rulerWalletText} href="/wallets/ruler-wallet">
											{formatMessage({ id: 'home.payment_method_sheet.logo_title' })}
										</Link>
										<Text className={classes.rulerPriceText}>€ 110 = 250 Ruler</Text>
										<Text className={classes.rulerNumberText}>65 Rulers</Text>
									</Box>
								</Box>
								<Box className={classes.creditCardsTextWrapper}>
									<Text>{formatMessage({ id: 'home.payment_method_sheet.text.credit_cards' })}</Text>
								</Box>
								{cardData !== undefined &&
									cardData.map(
										(data: any, index: number): JSX.Element => {
											return (
												<PaymentMethodItem
													key={index}
													cardData={data}
													handleShowClick={handleItemClick(index, data)}
													handleRemoveClick={handleTrashButtonClick(index)}
												/>
											);
										}
									)}
								<Button iconName="add" compact className={classes.addPaymentMethodButton} onClick={handleAddPaymentMethodClick}>
									{formatMessage({ id: 'button.add_payment_method' })}
								</Button>
								<Box className={classes.paymentMethodFooter}>
									<GreenButton
										iconName="add-payment"
										className={classes.payButton}
										compact
										onClick={(): void => setPaidModal(true)}
										disabled={cardData.length === 0}
									>
										{formatMessage({ id: 'button.pay' })}
									</GreenButton>
									<Text className={classes.swipeText}>{formatMessage({ id: 'home.payment_method_sheet.text.description_pay' })}</Text>
								</Box>
							</>
						)}
						{hasAccount && hasValidatedDriverLicence && paidSuccess && (
							<>
								{/* <Box> */}
								{/* <IonSlides options={reserveSlideOpts}>
										<IonSlide className={classes.slide}> */}
								<Box className={classes.vehicleInfo}>
									{activeVehicle === 'car' &&
										(ridingStart ? carInfo : pausedCarInfo).map(
											(info, index): JSX.Element => {
												return renderVehicleInfo(info, index);
											}
										)}
									{activeVehicle === 'scooter' &&
										(ridingStart ? scooterInfo : pausedScooterInfo).map(
											(info, index): JSX.Element => {
												return renderVehicleInfo(info, index);
											}
										)}
								</Box>
								<Box className={classes.imageWrapper}>
									<Image src={activeVehicle === 'car' ? car : bike} />
								</Box>
								{activeVehicle === 'car' ? (
									<>
										<Box className={classes.vehicleDetailInfoRow}>
											<Box className={classes.vehicleDetailInfoColumn}>
												<Icon iconName="seats" colorType="green" />
												<Text className={classes.iconText}>4 seats</Text>
											</Box>
											<Box className={classes.vehicleDetailInfoColumn}>
												<Icon iconName="engine" colorType="green" />
												<Text className={classes.iconText}>electric</Text>
											</Box>
										</Box>
										<Box className={classes.vehicleDetailInfoRow}>
											<Box className={classes.vehicleDetailInfoColumn}>
												<Icon iconName="transmission" colorType="green" />
												<Text className={classes.iconText}>automatic</Text>
											</Box>
											<Box className={classes.vehicleDetailInfoColumn}>
												<Icon iconName="color" colorType="green" />
												<Text className={classes.iconText}>white</Text>
											</Box>
										</Box>
										<Box className={classes.vehicleDetailInfoColumn}>
											<Icon iconName="point" colorType="green" />
											<Text className={classes.iconText}>Na Hřebenkách 2, 150 00 Praha 5</Text>
										</Box>
									</>
								) : (
									<>
										<Box className={classes.vehicleDetailInfoRow}>
											<Box className={classes.vehicleDetailInfoColumn}>
												<Icon iconName="speed" colorType="green" />
												<Text className={classes.iconText}>43 km / h</Text>
											</Box>
											<Box className={classes.vehicleDetailInfoColumn}>
												<Icon iconName="color" colorType="green" />
												<Text className={classes.iconText}>white</Text>
											</Box>
										</Box>
										<Box className={classes.vehicleDetailInfoColumn}>
											<Icon iconName="point" colorType="green" />
											<Text className={classes.iconText}>Na Hřebenkách 2, 150 00 Praha 5</Text>
										</Box>
									</>
								)}
								{/* <Box className={classes.vehicleDetailInfoRow}>
									<Box className={classes.vehicleDetailInfoColumn}>
										<Icon iconName="seats" colorType="green" />
										<Text className={classes.iconText}>4 seats</Text>
									</Box>
									<Box className={classes.vehicleDetailInfoColumn}>
										<Icon iconName="engine" colorType="green" />
										<Text className={classes.iconText}>electric</Text>
									</Box>
								</Box>
								<Box className={classes.vehicleDetailInfoRow}>
									<Box className={classes.vehicleDetailInfoColumn}>
										<Icon iconName="transmission" colorType="green" />
										<Text className={classes.iconText}>automatic</Text>
									</Box>
									<Box className={classes.vehicleDetailInfoColumn}>
										<Icon iconName="color" colorType="green" />
										<Text className={classes.iconText}>white</Text>
									</Box>
								</Box>
								<Box className={classes.vehicleDetailInfoColumn}>
									<Icon iconName="point" colorType="green" />
									<Text className={classes.iconText}>Na Hřebenkách 2, 150 00 Praha 5</Text>
								</Box> */}
								{/* </IonSlide> */}
								{/* <IonSlide className={classes.slide}> */}
								{/* <Box className={classes.vehicleInfo}>
									{scooterInfo.map(
										(info, index): JSX.Element => {
											// if (enteredQrCode && index === 2) return <Box />;

											return (
												<Box key={index} className={classes.infoWrapper}>
													{index === 0 ? (
														<Image src={require(`${info.iconName}`)} width={30} height={30} />
													) : (
														<Icon iconName={info.iconName} colorType="green" />
													)}
													<Text className={classes.propertyText}>{info.property}</Text>
													<Text className={classes.descriptionText}>{info.description}</Text>
												</Box>
											);
										}
									)}
								</Box> */}
								{/* <Box className={classes.imageWrapper}>
									<Image src={bike} />
								</Box> */}
								{/* <Box className={classes.vehicleDetailInfoRow}>
									<Box className={classes.vehicleDetailInfoColumn}>
										<Icon iconName="speed" colorType="green" />
										<Text className={classes.iconText}>43 km / h</Text>
									</Box>
									<Box className={classes.vehicleDetailInfoColumn}>
										<Icon iconName="color" colorType="green" />
										<Text className={classes.iconText}>white</Text>
									</Box>
								</Box>
								<Box className={classes.vehicleDetailInfoColumn}>
									<Icon iconName="point" colorType="green" />
									<Text className={classes.iconText}>Na Hřebenkách 2, 150 00 Praha 5</Text>
								</Box> */}
								{/* </IonSlide>
									</IonSlides> */}
								{/* </Box> */}
								<Box className={classes.reserveFooter}>
									{reservation ? (
										<Box>
											{rideStart ? (
												<Box className={classes.scanAndReserveButtonGroupWrapper}>
													<LightGreenButton iconName="point" compact onClick={(): void => setFinishRidingModal(true)}>
														{formatMessage({ id: 'button.finish' })}
													</LightGreenButton>
													{ridingStart ? (
														<GreenButton iconName="pause" compact onClick={(): void => setRidingStart(false)}>
															{formatMessage({ id: 'button.pause' })}
														</GreenButton>
													) : (
														<GreenButton iconName="start" compact onClick={(): void => setRidingStart(true)}>
															{formatMessage({ id: 'button.start' })}
														</GreenButton>
													)}
												</Box>
											) : (
												<GreenButton iconName="start" compact onClick={(): void => setRideStart(true)}>
													{formatMessage({ id: 'button.ride' })}
												</GreenButton>
											)}
										</Box>
									) : (
										<Box className={classes.scanAndReserveButtonGroupWrapper}>
											<LightGreenButton iconName="qr" compact>
												{formatMessage({ id: 'button.scan' })}
											</LightGreenButton>
											<GreenButton iconName="lock" compact onClick={(): void => setReservation(true)}>
												{formatMessage({ id: 'button.reserve' })}
											</GreenButton>
										</Box>
									)}

									<Box className={classes.iconButtonTextContainer}>
										<Box className={classes.iconButtonTextWrapper}>
											<IconButton iconName="how-to-ride" colorType="green" onClick={(): void => history.push('/get-help/how-to-ride')} />
											<Text className={classes.greenText}>{formatMessage({ id: 'home.vehicle_info_sheet.text.how_to_ride' })}</Text>
										</Box>
										<Box className={classes.iconButtonTextWrapper}>
											<IconButton iconName="report" colorType="green" onClick={(): void => history.push('/get-help/how-to-ride')} />
											<Text className={classes.greenText}>{formatMessage({ id: 'home.vehicle_info_sheet.text.report' })}</Text>
										</Box>
									</Box>
								</Box>
							</>
						)}
					</IonSlide>
				</IonSlides>
			</BottomSheet>
			<BottomSheet
				onCloseButtonClick={(): void => setShowFinishedRide(false)}
				open={showFinishedRide}
				hasBlackBar={false}
				hasCloseButton
				onBottomSheetChange={handleFinishRideBottomSheetChange}
			>
				<Box className={classes.totalAmountTextWrapper}>
					<Text className={classes.totalAmountText}>{formatMessage({ id: 'home.finished_ride_sheet.text.total_amount' })}</Text>
					<Box>
						<Text className={classes.totalAmountNumber}>$7</Text>
						<Text className={classes.totalAmountDecimal}>.00</Text>
					</Box>
				</Box>
				<Box className={classes.vehicleInfo}>
					{finishedRideVehicleInfo.map(
						(info, index): JSX.Element => {
							return (
								<Box key={index} className={classes.infoWrapper}>
									<Icon iconName={info.iconName} colorType="green" />
									<Text className={classes.propertyText}>{info.property}</Text>
									<Text className={classes.descriptionText}>{info.description}</Text>
								</Box>
							);
						}
					)}
				</Box>
				<Box className={classes.rateRideWrapper}>
					<Text className={classes.rateRideText}>{formatMessage({ id: 'home.finished_ride_sheet.text.rate_ride' })}</Text>
					<Box>
						{[0, 1, 2, 3].map(index => {
							return <Icon key={index} iconName="rate-active" className={classes.rateActiveIcon} />;
						})}
						<Icon iconName="rate-inactive" />
					</Box>
				</Box>
				<TextField
					label={formatMessage({ id: 'home.finished_ride_sheet.text.last_ride' })}
					name="rideReview"
					value={rideReview}
					onValueChange={handleRideReivewChange}
				/>
				<GreenButton onClick={(): void => setReportSubmitModal(true)}>{formatMessage({ id: 'button.done' })}</GreenButton>
			</BottomSheet>
			<Dialog
				title={formatMessage({ id: 'home.payment_method_sheet.pay.dialog.title' })}
				open={paidModal}
				hasClose
				illustrationName="superman"
				onClose={handlePaidDialogClose}
				aria-labelledby="form-dialog-title"
			>
				<Text className={classes.dialogContentText}>{formatMessage({ id: 'home.payment_method_sheet.pay.dialog.description' })}</Text>
			</Dialog>
			<Dialog
				title={formatMessage({ id: 'home.finished_ride_sheet.report_submit.dialog.title' })}
				open={reportSubmitModal}
				hasClose
				illustrationName="sent"
				onClose={handleReportSubmitDialogClose}
				aria-labelledby="form-dialog-title"
			>
				<Text className={classes.dialogContentText}>
					{formatMessage({ id: 'home.finished_ride_sheet.report_submit.dialog.description' })}
				</Text>
			</Dialog>
			<Dialog
				title={formatMessage({ id: 'home.vehicle_info_sheet.finish.dialog.title' })}
				open={finishRidingModal}
				hasClose
				illustrationName="question"
				onClose={(): void => setFinishRidingModal(false)}
				aria-labelledby="form-dialog-title"
			>
				<Typography className={classes.finishRidingDialogContentText}>
					{formatMessage({ id: 'home.vehicle_info_sheet.finish.dialog.description' })}
				</Typography>
				<BlackButton onClick={handleFinishRidingClick} className={classes.notRecommendedButton}>
					{formatMessage({ id: 'home.vehicle_info_sheet.finish.dialog.button_text' })}
				</BlackButton>
			</Dialog>
		</FullPage>
	);
};
