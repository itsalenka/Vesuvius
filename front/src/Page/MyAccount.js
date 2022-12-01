import {observer} from "mobx-react-lite";
import {getInfo, logout, updateUser} from "../HTTPS/userApi";
import {HOME_ROUTE, LOGIN_ROUTE, MYREQUESTS_ROUTE} from "../consts";
import React, {useContext, useEffect, useState} from "react";
import {Waves} from "loading-animations-react";
import {Button, Col, Container, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {Context} from "../index";
import {Card} from "@mui/material";
import {MDBIcon, MDBInput} from "mdbreact";
import {useNotification} from "../Notification/NotificationProvider";


const MyAccount = observer(() => {
    const {user} = useContext(Context)
    const navigate = useNavigate()
    const dispatch = useNotification();

    const [loading, setLoading] = useState(true)
    const [check, setCheck] = useState(false)
    const [formValues, setFormValues] = useState()

    useEffect(() => {
        getInfo().then(data => {
            user.setAccount(data)
            let initialValues = {
                email: user.account.email,
                name: user.account.name,
                phoneNumber: user.account.phoneNumber,
                passwordOld: undefined,
                password: undefined,
                passwordRep: undefined
            }
            setFormValues(initialValues)
        }).catch( e=> {
            alert(e.response.data.message)
        }).finally(() => setLoading(false))
    }, [])


    const SignOut = async () => {
        await logout()
        localStorage.clear()
        user.check()
        navigate(LOGIN_ROUTE)
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormValues({...formValues, [name]: value})
    }


    const handleSubmit = async (e) => {
        e.preventDefault()
        if (check === false) {
            setFormValues({...formValues, 'passwordOld': undefined, 'password': undefined, 'passwordRep': undefined})
        }
        try {
            const dataUser = await updateUser(formValues)
            switch (dataUser.message){
                case 'Activate your account by email':
                    await logout()
                    localStorage.clear()
                    user.check()
                    handleNewNotification(dataUser.message, 'success')
                    navigate(HOME_ROUTE)
                    break;
                case 'Success':
                    handleNewNotification(dataUser.message, 'success')
                    break;
                default:
                    handleNewNotification(dataUser.message, 'error')
                    break;
            }
        } catch (e) {
            handleNewNotification(e.response.data.message, 'success')
        }
    }

    const handleNewNotification = (message, type) => {
        dispatch({
            type: type,
            message: message,
            title: message
        })
    }

    if (loading) {
        return <>
            <div style={{height:  window.innerHeight - 56,
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Waves waveColor="#a6c" backgroundColor="#fff"/>
            </div>
        </>
    }

    return (
        <Container fluid className="p-4 d-flex justify-content-center">
            <Card variant="outlined" className="p-4" style={{maxWidth: 50 + 'em'}}>
                <h1 className="mb-3">Welcome</h1>
                <h4 className="mb-4">to your personal account</h4>
                <form autoComplete="off" onSubmit={handleSubmit}>
                    <h3 className="fw-normal text-center">User Details</h3>
                    <MDBInput
                        label="Your email"
                        icon="envelope"
                        group
                        name="email"
                        type="email"
                        validate
                        error="wrong"
                        success="right"
                        value={formValues.email}
                        onChange={handleChange}
                    />
                    <MDBInput className="mt-50"
                              label="Name"
                              group
                              name="name"
                              type="text"
                              maxLength="50"
                              minLength="3"
                              required
                              validate
                              value={formValues.name}
                              onChange={handleChange}
                    />
                    <MDBInput
                        label="Phone number"
                        group
                        name="phoneNumber"
                        type="tel"
                        pattern="^[+][0-9]{1,4}[\]([0-9]{1,4}[)][0-9]{3}[-][0-9]{2}[-][0-9]{2}"
                        title="Example: +xxx(xx)xxx-xx-xx"
                        required
                        validate
                        value={formValues.phoneNumber}
                        onChange={handleChange}
                        autoComplete="nope"
                    />

                    <div className="form-check">
                        <input
                            id="checkPassword"
                            className="form-check-input"
                            type="checkbox"
                            onClick={e => setCheck(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="checkPassword"> change password</label>
                    </div>
                    {check &&
                        <>
                            <MDBInput
                                label="Your old password"
                                icon="lock"
                                group
                                name="passwordOld"
                                type="password"
                                validate
                                error="wrong"
                                success="right"
                                value={formValues.passwordOld}
                                onChange={handleChange}
                            />
                            <MDBInput
                                label="Your new password"
                                icon="lock"
                                group
                                name="password"
                                type="password"
                                validate
                                error="wrong"
                                success="right"
                                value={formValues.password}
                                onChange={handleChange}
                            />
                            <MDBInput
                                label="Confirm  your new password"
                                icon="exclamation-triangle"
                                group
                                name="passwordRep"
                                type="password"
                                validate
                                error="wrong"
                                success="right"
                                value={formValues.passwordRep}
                                onChange={handleChange}
                            />
                        </>
                    }
                    <div className="d-md-flex justify-content-center align-items-center mb-4">
                        <Button variant={"outline-secondary"} type="submit">
                            Update
                            <MDBIcon far icon="paper-plane" className="ml-1"/>
                        </Button>
                    </div>
                </form>

                <div className="d-flex justify-content-end">
                    <Button variant={"outline-secondary"} className="px-4" onClick={SignOut}>
                        Log out
                    </Button>
                </div>
            </Card>
        </Container>
    );
});

export default MyAccount;