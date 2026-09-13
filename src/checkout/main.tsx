import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import CheckoutApp from './App';
import '../index.css';

createRoot(document.getElementById('checkout-root')!).render(
  <StrictMode>
    <CheckoutApp />
  </StrictMode>
);
