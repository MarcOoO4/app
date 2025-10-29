import React, {createContext} from 'react';
import App from './App';
import UserStore from './store/UserStore';
import OrderStore from './store/OrderStore';
import ManagerStore from './store/ManagerStore';
import ProductStore from './store/ProductStore';
import ServiceStore from './store/ServiceStore';
import { createRoot } from 'react-dom/client';

export const Context = createContext(null)

const rootElement = document.getElementById('root');

createRoot(rootElement).render( // Using createRoot from 'react-dom/client'
    <Context.Provider value={{ user: new UserStore(), order: new OrderStore(), manager: new ManagerStore(), product: new ProductStore(), service: new ServiceStore() }}>
        <App />
    </Context.Provider>
);
