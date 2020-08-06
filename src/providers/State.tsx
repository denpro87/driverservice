import React, { createContext, useEffect, useReducer } from 'react';
import { IAction, IState } from './IState';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;
const initialState: IState = {
	settings: {
		isDarkMode: false
	},
	logged: false,
	appLoaded: false
};

export const AppContext = createContext({} as IContextProps);
export function AppContextProvider(props: any) {
	const [state, dispatch] = useReducer(loggerReducer, initialState); //usato loggerReducer invece che reducer
	useEffect(() => {
		if (!state.appLoaded) return;
		let persistentData = JSON.stringify({
			settings: state.settings,
			logged: state.logged
		});
		Storage.set({ key: 'appstorage', value: persistentData }).then(() => {
			console.log(persistentData);
		});
	}, [state]);

	const value = { state, dispatch };
	return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
}

interface IContextProps {
	state: IState;
	dispatch: React.Dispatch<IAction>;
}

const reducer = (state: IState, action: IAction) => {
	switch (action.type) {
		case 'UPDATE_SETTINGS': {
			return { ...state, settings: action.payload };
		}
		case 'LOGOUT': {
			Storage.clear().then(() => {
				console.log('storage cleaned');
			});
			return { ...state, user: null, salon: null, wizard: true, appLoaded: null, code: null, logged: null };
		}
	}
	return state;
};

type Dispatch = React.Dispatch<IAction>;
export const login = async (dispatch: Dispatch, data: { firstname: string; lastname: string; phone: string }) => {
	dispatch({ type: 'LOGIN', payload: data });
};

export const register = async (dispatch: Dispatch, data: { firstname: string | null; lastname: string | null; phone: string | null }) => {
	dispatch({ type: 'REGISTER', payload: data });
};

export const logout = async (dispatch: Dispatch) => {
	dispatch({ type: 'LOGOUT' });
};

/*** reducer alternativo, che ogni volta che viene chiamato logga ***/
const logger = (reducer: any) => {
	return (state: IState, action: IAction) => {
		console.log('%cPrevious State:', 'color: #9E9E9E; font-weight: 700;', state);
		console.log('%cAction:', 'color: #00A7F7; font-weight: 700;', action);
		console.log('%cNext State:', 'color: #47B04B; font-weight: 700;', reducer(state, action));
		return reducer(state, action);
	};
};
const loggerReducer = logger(reducer);
/*** fine reducer alternativo ***/

export async function getStorageData(state: IState) {
	if (state.appLoaded) return state;
	await Storage.get({ key: 'appstorage' }).then(r => {
		let storage = JSON.parse(r.value + '');
		if (storage != null) {
			state.settings = storage.settings ?? state.settings;
			state.logged = storage.logged;
			console.log('storage loaded: ', storage);
		} else {
			console.log('storage is null');
		}
		state.appLoaded = true;
		return state;
	});
}
