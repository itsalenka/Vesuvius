import {
    HOME_ROUTE,
    LOGIN_ROUTE, LOGOUT_ROUTE,
    MYCOMPANY_ROTE, MYREQUESTS_ROUTE,
    REGISTRATION_ROUTE,
    REQUESTPAGE_ROUTE,
    REQUESTS_ROUTE,
    MYDRIVERS_ROUTE,
    MYTRUCKS_ROUTE, MYACCOUNT_ROTE
} from "./consts";
import Requests from "./Page/Requests";
import Login from "./Page/Login";
import Registration from "./Page/Registration";
import Company from "./Page/Company";
import MyRequests from "./Page/MyRequests";
import Home from "./Page/Home";
import Drivers from "./Page/Drivers";
import DriverEdit from "./Page/DriverEdit";
import Trucks from "./Page/Trucks";
import TruckEdit from "./Page/TruckEdit";
import RequestPage from "./Page/RequestPage"
import MyAccount from "./Page/MyAccount";


export const authRoutes = [
    {
        path: REQUESTPAGE_ROUTE + '/:id',
        Component: RequestPage
    },
    {
        path: MYCOMPANY_ROTE,
        Component: Company
    },
    {
        path: MYACCOUNT_ROTE,
        Component: MyAccount
    },
    {
        path: MYREQUESTS_ROUTE,
        Component: MyRequests
    }
]

export const carrierRoutes = [
    {
        path: MYDRIVERS_ROUTE,
        Component: Drivers
    },
    {
        path: MYDRIVERS_ROUTE + '/:id',
        Component: DriverEdit
    },
    {
        path: MYTRUCKS_ROUTE,
        Component: Trucks
    },
    {
        path: MYTRUCKS_ROUTE + '/:id',
        Component: TruckEdit
    }
]

export const publicRoutes = [
    {
        path: REGISTRATION_ROUTE,
        Component: Registration
    },
    {
        path: LOGIN_ROUTE,
        Component: Login
    },
    {
        path: REQUESTS_ROUTE,
        Component: Requests
    },
    {
        path: '*',
        Component: Home
    }

]