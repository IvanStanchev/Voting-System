import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { BrowserRouter } from 'react-router-dom';
import { DataProvider } from './Components/DataContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
    <DataProvider>
      <App />
    </DataProvider>
    </BrowserRouter>
  </React.StrictMode>
);

serviceWorkerRegistration.register();
