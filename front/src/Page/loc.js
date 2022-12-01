import React, {useContext, useEffect} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import {sendLocation} from "../HTTPS/LocationApi";
import { useTranslation } from 'react-i18next';

const Home = () => {
    // const {user} = useContext(Context)
    const { t, i18n } = useTranslation();
    const [latitude, setLatitude] = React.useState(null);
    const [longitude, setLongitude] = React.useState(null);


    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         navigator.geolocation.getCurrentPosition(
    //             location => {
    //                 console.log(location.coords);
    //                 sendLocation(location.coords.latitude, location.coords.longitude).then(data => {
    //                     console.log(data)
    //                 }).catch( e=> {alert (e)});
    //
    //             },
    //             err => console.log(err)
    //         );
    //         }, 10000);
    //     }, []);

    return (
        <Container className="m-0 p-0 d-flex">
            <div className="m-0 d-flex align-items-center">
                <p>{t('Welcome')}</p>
                <p>{t('Welcome describe')}</p>
            </div>
        </Container>
    );
};

export default Home;