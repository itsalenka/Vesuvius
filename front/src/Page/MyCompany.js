import {observer} from "mobx-react-lite";
import React, {useContext, useEffect, useState} from "react";
import {Context} from "../index";
import {useNavigate} from "react-router-dom";
import {useNotification} from "../Notification/NotificationProvider";
import {getInfo, updateCompany} from "../HTTPS/companyApi";
import {HOME_ROUTE, LOGIN_ROUTE, MYDRIVERS_ROUTE, MYTRUCKS_ROUTE} from "../consts";
import {Waves} from "loading-animations-react";
import {Button, Container} from "react-bootstrap";
import {Card, Typography} from "@mui/material";
import {MDBIcon, MDBInput} from "mdbreact";
import {getCities, getCountries, getStates} from "../HTTPS/cityApi";
import {getMyRequests} from "../HTTPS/requestApi";

const MyCompany = observer(() => {
    const {user, cities} = useContext(Context)
    const dispatch = useNotification();

    const [loading, setLoading] = useState(true)
    const [formValues, setFormValues] = useState()
    const [initValues, setInitValues] = useState()

    useEffect(() => {
        getInfo().then(data => {
            user.setCompany(data)
            const initialValues = {
                address: user.company.address,
                city: user.company.city,
                state: user.company.state,
                country: user.company.country,
                bankInfo: user.company.bankInfo,
                director: user.company.director,
                name: user.company.company,
            }
            setFormValues(initialValues)
            setInitValues(initialValues)

        }).catch( e=> {
            alert(e.response.data.message)
        }).finally(() => setLoading(false))
            getCountries().then(data => {
                cities.setCountries(data);
            }).catch(e => {
                alert(e.response.data.message)
            })
        }, [])



    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormValues({...formValues, [name]: value})
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
            if(!cities.states || !cities.states.includes(formValues.state)) {
                handleNewNotification('Invalid state', 'error')
                return
            }
            if(!cities.cities || !cities.cities.includes(formValues.city)) {
                handleNewNotification('Invalid city', 'error')
                return
            }

            const dataCompany = await updateCompany(formValues)
            user.setCompany(dataCompany)
            handleNewNotification('Success', 'success')
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
                <h1 className="mb-3">Welcome <span className="text-dark">{user.account.name}</span></h1>
                <h4 className="mb-4">to your personal account</h4>
                <form autoComplete="off" onSubmit={handleSubmit}>
                    <h3 className="fw-normal text-center">Company Details</h3>
                    <div className="row p-2">
                        <div className="col-lg-6">
                            <Typography variant="h6"  gutterBottom>Company name:</Typography>
                            <Typography variant="body2" gutterBottom>{formValues.name}</Typography>
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
                            {user.userRole === 'CARRIER' &&
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
                        </div>
                    <div className="col-lg-6">
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
                            group
                            name="address"
                            type="textarea"
                            required
                            validate
                            value={formValues.address}
                            onChange={handleChange}
                            autoComplete="nope"
                        />
                    </div>
                    </div>
                        <div className="d-md-flex justify-content-center align-items-center mb-4">
                        <Button variant={"outline-secondary"} type="submit">
                            Update
                            <MDBIcon far icon="paper-plane" className="ml-1"/>
                        </Button>
                    </div>
                </form>
            </Card>
        </Container>
    );
});

export default MyCompany;