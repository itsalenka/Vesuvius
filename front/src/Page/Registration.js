import React, {useContext, useEffect, useState} from 'react';
import {Button, Col, Container, Row, Spinner} from "react-bootstrap";
import {HOME_ROUTE, LOGIN_ROUTE} from "../consts";
import {MDBIcon, MDBInput, MDBCard, MDBCardBody} from "mdbreact";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {registration} from "../HTTPS/userApi";
import {getCities, getCountries, getStates} from "../HTTPS/cityApi";
import {useNavigate} from "react-router-dom";
import {useNotification} from "../Notification/NotificationProvider";
import {TrinitySpinner, Waves} from 'loading-animations-react';
import road from "../img/asfalt-sm.jpg";

const Registration = observer(() => {
    const {cities} = useContext(Context)
    const navigate = useNavigate()
    const dispatch = useNotification();

    const intialValues = { email: '', password: '', passwordRep: '', role: 'CUSTOMER', nameCompany: '', name: '', city: '', state: '',     country: '', director: '', bankInfo: '', address: '', phoneNumber: '' };
    const [formValues, setFormValues] = useState(intialValues);

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getCountries().then(data => {
            cities.setCountries(data);
        }).catch( e=> {alert (e)}).finally(() => setLoading(false))
    }, [])

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value })
        if (name == 'country'){
            if (cities.countries.includes(value)) {
                getStates(value).then(data => {
                    cities.setStates(data)
                }).catch(e => {
                    alert(e)
                }).finally(() => setLoading(false))
            }
            else{
                cities.setStates([]);
            }
        }

        if (name == 'state'){
            if(cities.states.includes(value)) {
                getCities(formValues.country, value).then(data => {
                    cities.setCities(data)
                }).catch(e => {
                    alert(e)
                }).finally(() => setLoading(false))
            } else{
                cities.setCities([]);
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if(!cities.countries.includes(formValues.country)) {
                handleNewNotification('Invalid country', 'error')
                return
            }
            if(!cities.states.includes(formValues.state)) {
                handleNewNotification('Invalid state', 'error')
                return
            }
            if(!cities.cities.includes(formValues.city)) {
                handleNewNotification('Invalid city', 'error')
                return
            }
            if(formValues.role == 'CUSTOMER')
                formValues.bankInfo = undefined;
            const data = await registration(formValues)
            handleNewNotification(data.message, 'success')
            navigate(HOME_ROUTE)
        } catch (e) {
            handleNewNotification(e.response.data.message, 'error')
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
            <MDBCard className="p-2">
                <MDBCardBody className="justify-content-center align-items-center">
                    <form autoComplete="off" onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="p-2">
                                    <h3 className="text-center">User</h3>
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
                                        <h6 className="mb-0 me-4">I'm: </h6>
                                        <div className="form-check form-check-inline mb-0 me-4" onChange={handleChange}>
                                            <input
                                                id="customer"
                                                className="form-check-input"
                                                type="radio"
                                                name="role"
                                                value="CUSTOMER"
                                                defaultChecked
                                            />
                                            <label className="form-check-label me-2" htmlFor="customer">Customer</label><br></br>
                                            <input
                                                id="carrier"
                                                className="form-check-input"
                                                type="radio"
                                                name="role"
                                                value="CARRIER"
                                            />
                                            <label className="form-check-label" htmlFor="carrier">Carrier</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="p-2">
                                    <h3 className="text-center">Company</h3>
                                    <MDBInput className="mt-50"
                                              label="Name your company"
                                              icon="pen-nib"
                                              group
                                              name="nameCompany"
                                              type="text"
                                              maxLength="30"
                                              minLength="3"
                                              required
                                              validate
                                              value={formValues.nameCompany}
                                              onChange={handleChange}
                                    />
                                    <MDBInput
                                        label="Director's name"
                                        icon="user-tie"
                                        group
                                        name="director"
                                        type="text"
                                        maxLength="30"
                                        minLength="3"
                                        required
                                        validate
                                        value={formValues.director}
                                        onChange={handleChange}
                                    />
                                    <MDBInput
                                        label="Country"
                                        icon="map-marker-alt"
                                        list="countries"
                                        name="country"
                                        type="text"
                                        maxLength="30"
                                        minLength="3"
                                        required
                                        validate
                                        value={formValues.country}
                                        onChange={handleChange}
                                        autoComplete="nope"
                                    />
                                    <datalist id="countries">
                                        {cities.countries.map(country =>
                                            <option key={country} value={country}></option>
                                        )}
                                    </datalist>
                                    <MDBInput
                                        label="State"
                                        icon="map-marker-alt"
                                        list="states"
                                        name="state"
                                        type="text"
                                        maxLength="30"
                                        minLength="3"
                                        required
                                        validate
                                        value={formValues.state}
                                        onChange={handleChange}
                                        autoComplete="nope"
                                    />
                                    <datalist id="states">
                                        {cities.states.map(state =>
                                            <option key={state} value={state}></option>
                                        )}
                                    </datalist>
                                    <MDBInput
                                        label="City"
                                        icon="map-marker-alt"
                                        list="cities"
                                        name="city"
                                        type="text"
                                        maxLength="30"
                                        minLength="3"
                                        required
                                        validate
                                        value={formValues.city}
                                        onChange={handleChange}
                                        autoComplete="nope"
                                    />
                                    <datalist id="cities">
                                        {cities.cities.map(city =>
                                            <option key={city} value={city}></option>
                                        )}
                                    </datalist>
                                    <MDBInput
                                        label="Address"
                                        icon="map-marker-alt"
                                        group
                                        name="address"
                                        type="textarea"
                                        required
                                        validate
                                        value={formValues.address}
                                        onChange={handleChange}
                                        autoComplete="nope"
                                    />
                                    {formValues.role === 'CARRIER' &&
                                        <MDBInput
                                            label="Your bank information"
                                            icon="university"
                                            group
                                            name="bankInfo"
                                            type="textarea"
                                            maxLength="50"
                                            minLength="3"
                                            required
                                            validate
                                            value={formValues.bankInfo}
                                            onChange={handleChange}
                                        />
                                    }
                                    <div>
                                        Have an account? <a className="link-auth" href={LOGIN_ROUTE}>Login here</a>
                                    </div>
                                    <div className="text-center mt-3">
                                        <Button variant={"brand"} type="submit">
                                            Sign in
                                            <MDBIcon far icon="paper-plane" className="ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </MDBCardBody>
            </MDBCard>
        </Container>
    );
});

export default Registration;