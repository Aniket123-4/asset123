import { CssBaseline } from '@mui/material';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './redux/store';
import reportWebVitals from './reportWebVitals';
import 'primereact/resources/themes/lara-light-indigo/theme.css';   
import 'primereact/resources/primereact.css';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

import './index.css';


const root = ReactDOM.createRoot(
  document.getElementById('root')
);

root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
      <CssBaseline />
      <App />
      </I18nextProvider>
    </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
