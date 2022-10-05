import React from 'react';
import {Routes, Route} from "react-router-dom";
import Home from "../Page/Home";
import {publicRoutes} from "../routes";

const AppRouter = () => {
    // let {user} = useContext(Context);
    return (
        <Routes>
            {publicRoutes.map(({path, Component}, key) => <Route exact path={path} element={<Component/>} key={key} />)}
            {/*{user.isAuth === true && authRoutes.map(({path, Component}, key) => <Route exact path={path} element={<Component/>} key={key} />)}*/}
            {/*{user.userRole === 'CARRIER' && carrierRoutes.map(({path, Component}, key) => <Route exact path={path} element={<Component/>} key={key} />)}*/}
            <Route
                path="*"
                element={<Home></Home>}
            />
        </Routes>
    );
};

export default AppRouter;