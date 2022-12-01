import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './i18n';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserStore from "./Store/UserStore";
import RequestStore from "./Store/RequestStore";
import CityStore from "./Store/CityStore";
import TypesStore from "./Store/TypesStore";
import NotificationProvider from "./Notification/NotificationProvider";
import FilterStore from "./Store/FilterStore";


export const Context = createContext(null)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <NotificationProvider>
        <Context.Provider value={{
           // location: new LocationStore()
            user: new UserStore(),
            request: new RequestStore(),
            cities: new CityStore(),
            types: new TypesStore(),
            filter: new FilterStore()
        }}>
            <App />
        </Context.Provider>
    </NotificationProvider>
);

reportWebVitals();
