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
import MyCompany from "./Page/MyCompany";
import MyRequests from "./Page/MyRequests";
import Home from "./Page/Home";
import MyDrivers from "./Page/MyDrivers";
import DriverPage from "./Page/DriverPage";
import MyTrucks from "./Page/MyTrucks";
import TruckPage from "./Page/TruckPage";
import RequestPage from "./Page/RequestPage"
import MyAccount from "./Page/MyAccount";


export const authRoutes = [
    {
        path: REQUESTPAGE_ROUTE + '/:id',
        Component: RequestPage
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
        Component: MyDrivers
    },
    {
        path: MYCOMPANY_ROTE,
        Component: MyCompany
    },
    {
        path: MYDRIVERS_ROUTE + '/:id',
        Component: DriverPage
    },
    {
        path: MYTRUCKS_ROUTE,
        Component: MyTrucks
    },
    {
        path: MYTRUCKS_ROUTE + '/:id',
        Component: TruckPage
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

export const customerRoutes = [
    {
        path: MYCOMPANY_ROTE,
        Component: MyCompany
    }
]