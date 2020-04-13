import { FullPage, IconButton } from 'components';
import { makeStyles } from '@material-ui/styles';
import { mapViewer, styles } from './Home.styles';
import MapGL from 'react-map-gl';
import React, { useState } from 'react';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const useStyle = makeStyles(styles);

export const Home: React.FunctionComponent = () => {
	const classes = useStyle();
	const [viewport, setViewport] = useState({
		latitude: 37.8,
		longitude: -122.4,
		zoom: 14,
		bearing: 0,
		pitch: 0
	});

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
				<IconButton className={classes.reportIcon} iconProps={{ iconName: 'report', primaryColor: 'black', secondaryColor: 'red' }} />
				<IconButton className={classes.zonesIcon} iconProps={{ iconName: 'zones', primaryColor: 'black', secondaryColor: 'red' }} />
				<IconButton className={classes.vehicleIcon} iconProps={{ iconName: 'vehicle', primaryColor: 'black', secondaryColor: 'red' }} />
				<IconButton className={classes.findMeIcon} iconProps={{ iconName: 'find-me', primaryColor: 'black', secondaryColor: 'red' }} />
			</MapGL>
		</FullPage>
	);
};
