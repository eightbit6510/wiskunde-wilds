import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/caveat/600.css';
import '@fontsource/caveat/700.css';
import '@fontsource/quicksand/400.css';
import '@fontsource/quicksand/600.css';
import '@fontsource/quicksand/700.css';
import './styles/global.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
