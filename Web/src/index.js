import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Navigater from './page/Navigater'
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './page/AuthContext'; // Adjust path based on your context location

ReactDOM.render(
  <React.StrictMode>
    <App />
    {/* <AuthProvider>
      <Navigater />
    </AuthProvider> */}
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
