import React from 'react';import {createRoot} from 'react-dom/client';import App from './App';import './styles/app.css';import {applyTheme} from './lib/theme';import {getLang} from './lib/i18n';
applyTheme();document.documentElement.lang=getLang();createRoot(document.getElementById('root')).render(<App/>);
