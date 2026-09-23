import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { ImageProvider } from './context/ImageContext.tsx';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ImageProvider>
      <App />
    </ImageProvider>
  </StrictMode>,
);
