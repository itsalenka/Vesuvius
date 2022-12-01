import React, {useContext, useEffect, useState} from 'react';
import {Button, Card, Col, Container, Form, NavLink, Row} from "react-bootstrap";
import {HOME_ROUTE, MYREQUESTS_ROUTE, REGISTRATION_ROUTE, REQUESTPAGE_ROUTE, REQUESTS_ROUTE} from "../consts";
import {MDBContainer, MDBIcon, MDBRow, MDBCol, MDBInput, MDBBtn, MDBCard, MDBCardBody} from "mdbreact";
import {login} from "../HTTPS/userApi";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import {useNotification} from "../Notification/NotificationProvider";
import road from "../img/asfalt-sm.jpg";


const Login = observer(( ) => {
    const navigate = useNavigate()
    const {user} = useContext(Context)
    const dispatch = useNotification();
    const intialValues = { email: "", password: "" };
    const [formValues, setFormValues] = useState(intialValues);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const data = await login(formValues)
            user.check()
            navigate(HOME_ROUTE)
        } catch (e) {
            handleNewNotification(e.response.data.message, 'error')
        } finally {
            return false
        }
    }

    const handleNewNotification = (message, type) => {
        dispatch({
            type: type,
            message: message,
            title: message
        })
    }

    return (
        <Container fluid style={{height: window.innerHeight - 56, backgroundImage: `url(${road})`}}
                   className="d-flex justify-content-center align-items-center">
            <MDBCard className="p-4">
                <MDBCardBody  className="justify-content-center align-items-center">
                    <h2 className="me-3 text-center white-text">Authorization:</h2>
                    <form className="d-flex flex-column" onSubmit={handleSubmit} autoComplete="off">
                        <div className="white-text">
                            <MDBInput
                                label="Your email"
                                name="email"
                                type="email"
                                required
                                validate
                                value={formValues.email}
                                onChange={handleChange}
                            />
                            <MDBInput className="mb-0"
                                      label="Your password"
                                      name="password"
                                      type="password"
                                      required
                                      validate
                                      value={formValues.password}
                                      onChange={handleChange}
                            />
                            <div>
                                No account? <a className="link-auth" href={REGISTRATION_ROUTE}>Registration</a>
                            </div>
                            <div className="text-center mt-3">
                                <Button variant={"brand"} type="submit">
                                    Sign in
                                    <MDBIcon far icon="paper-plane" className="ml-1" />
                                </Button>
                            </div>
                        </div>
                    </form>
                </MDBCardBody>
            </MDBCard>
        </Container>
    );
});

export default Login;