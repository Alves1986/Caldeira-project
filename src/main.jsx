// Main entry point for React application
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Get root element
const container = document.getElementById('root');
const root = createRoot(container);

// Render app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

