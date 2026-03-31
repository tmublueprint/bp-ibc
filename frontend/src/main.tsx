import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './global.scss'
import { store } from './store/store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './Route.tsx';
import UIContextProvider from './context/UIContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <UIContextProvider>
        <AppRoutes />
        </UIContextProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
)
