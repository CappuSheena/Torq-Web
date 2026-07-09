import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles.css';

// BrowserRouter provides the routing context App.jsx needs for its <Routes>
// and useNavigate() calls (e.g. Header's logo/profile links). Tests provide
// their own router (MemoryRouter, see App.test.jsx) instead of this one.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
