import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {MDBIcon, MDBInput, } from "mdbreact";
import {Button, Modal} from "react-bootstrap";
import {useNotification} from "../Notification/NotificationProvider";
import {useParams} from "react-router-dom";
import {createDriver} from "../HTTPS/userApi";

const AddDriver = observer(({show, onHide, driver}) => {
    const {id} = useParams();
    const dispatch = useNotification();

    const [formValues, setFormValues] = useState(driver);

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormValues({ ...formValues, [name]: value })
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await createDriver(formValues)
            handleNewNotification('Success', 'success')
            setFormValues(driver);
            onHide();
            window.location.reload(false)
            return

        } catch (e) {
            handleNewNotification(e, 'error')
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
        <Modal show={show} onHide={onHide} centered role="dialog">
            <Modal.Header>
                <h3 className="text-center">Create driver</h3>
            </Modal.Header>
            <Modal.Body className="justify-content-center align-items-center">
                <form autoComplete="off" onSubmit={handleSubmit}>
                    <MDBInput className="mt-50"
                              label="Your email"
                              icon="envelope"
                              group
                              name="email"
                              type="email"
                              pattern="^[\w\.]+@[\w]+\.[\w]{2,4}$"
                              title="Example: xxxxx@yyyy.com"
                              required
                              validate
                              value={formValues.email}
                              onChange={handleChange}
                              autoComplete="nope"
                    />
                    <MDBInput
                        label="Your password"
                        icon="lock"
                        group
                        name="password"
                        type="password"
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
                        title="Password should contain number, lowercase letter and uppercase letter"
                        required
                        validate
                        value={formValues.password}
                        onChange={handleChange}
                    />
                    <MDBInput
                        label="Confirm your password"
                        icon="exclamation-triangle"
                        group
                        id="passwordRep"
                        name="passwordRep"
                        type="password"
                        required
                        validate
                        value={formValues.passwordRep}
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
                        icon="phone"
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
                    <div className="d-md-flex justify-content-center align-items-center mb-4">
                            <Button variant={"brand"} type="submit">
                                Create
                                <MDBIcon far icon="paper-plane" className="ml-1" />
                            </Button>
                            <Button variant={"outline-secondary"} onClick={onHide}>
                                Close
                                <MDBIcon far icon="times-circle" className="ml-1" />
                            </Button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
});

export default AddDriver;