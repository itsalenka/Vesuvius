import logo from './logo.svg';
import './App.css';
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./Component/AppRouter";
import NavBar from "./Component/NavBar";
import {useContext, useEffect} from "react";
import {Context} from "./index";
import {observer} from "mobx-react-lite";

const App = observer(() => {
    const {user} = useContext(Context)

    useEffect(() => {
        user.check()
    }, [])

    return (
        <BrowserRouter>
            <NavBar/>
            <AppRouter />
        </BrowserRouter>
    );
})

export default App;
