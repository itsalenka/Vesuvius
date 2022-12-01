import React, {useContext, useEffect} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import {Context} from "../index";
import {LOGIN_ROUTE, REQUESTS_ROUTE} from "../consts";
import {observer} from "mobx-react-lite";
import desktopImage from "../img/home-sm.jpg";


const Home = observer(() => {
    const {user} = useContext(Context)
    return (
        <Container fluid style={{height: window.innerHeight - 56, backgroundImage: `url(${desktopImage})` }} className="m-0 p-0 d-flex backImg">
            <div className="m-0 d-flex align-items-center"  style={{backgroundColor: "rgba(0, 0, 0, 0.3)"}}>
                <Row  className="m-0 pt-5 white-text">
                    <Col className="d-flex justify-content-center mx-xxl-5">
                        <div>
                            <h1 className="mb-3 whiteText">Welcome to Vesuvius</h1>
                            <h5 className="mb-4 whiteText">Service for finding applications for cargo transportation</h5>
                            <div className="d-flex justify-content-end">
                                {!user.isAuth === true ?
                                    <a className="btn btn-outline-secondary btn-lg m-2"
                                       href={LOGIN_ROUTE} role="button"
                                       rel="nofollow">Sign in</a>
                                    :
                                    <a className="btn btn-outline-secondary btn-lg m-2"
                                       href={REQUESTS_ROUTE} role="button"
                                       rel="nofollow">Search request</a>
                                }

                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </Container>
    );
});

export default Home;