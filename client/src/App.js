import React, { useEffect, useRef } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import Spinner from 'components/Spinner';
import SnackbarProvider from 'react-simple-snackbar';
import Routes from './routes';
import ThemeCustomization from './themes';
import ScrollTop from './components/ScrollTop';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { useTranslation } from 'react-i18next';
import enTranslation from "./en.json";
import deTranslation from "./de.json";
import { NotificationProvider } from 'hooks/useNotificationContext';

const resources = {
	en: {
		translation: enTranslation
	},
	de: {
		translation: deTranslation
	}
};

i18n
	.use(initReactI18next)
	.init({
		resources,
		lng: localStorage.getItem('selectedLanguage') || "en", // Get the stored language or default to 'en'
		fallbackLng: "en",
		interpolation: {
			escapeValue: false
		}
	});

function App() {
	const { t, i18n } = useTranslation();


	const changeLanguage = (lng) => {
		i18n.changeLanguage(lng);
		localStorage.setItem('selectedLanguage', lng); // Store the selected language in local storage

	};
	const { isLoading } = useSelector(
		(state) => ({
			isLoading: state.loadingReducer.isLoading,
		}),
		shallowEqual
	);
	const timerRef = useRef(null);
	const resetTimer = () => {
		clearTimeout(timerRef.current);
		timerRef.current = setTimeout(logoutUser, 7200000);
	};
	const logoutUser = () => {
		localStorage.removeItem('user');
	};
	useEffect(() => {
		resetTimer();
		const resetTimerOnUserActivity = () => {
			resetTimer();
		};
		document.addEventListener('click', resetTimerOnUserActivity);
		document.addEventListener('keypress', resetTimerOnUserActivity);
		document.addEventListener('mousemove', resetTimerOnUserActivity);
		return () => {
			clearTimeout(timerRef.current);
			document.removeEventListener('click', resetTimerOnUserActivity);
			document.removeEventListener('keypress', resetTimerOnUserActivity);
			document.removeEventListener('mousemove', resetTimerOnUserActivity);
		};
	}, []);

	return (
		<>
			{isLoading && <Spinner />}
			<ThemeCustomization>
				<SnackbarProvider>
					<ScrollTop>
						<NotificationProvider>
							<Routes />
						</NotificationProvider>
					</ScrollTop>
				</SnackbarProvider>
			</ThemeCustomization>
		</>
	);
}

export default App;