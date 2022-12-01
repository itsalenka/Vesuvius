import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {MDBIcon, MDBInput, } from "mdbreact";
import {Button, Modal} from "react-bootstrap";
import {createRequest, getMyRequests} from "../HTTPS/requestApi";
import {useNotification} from "../Notification/NotificationProvider";
import {getCities, getStates} from "../HTTPS/cityApi";
import {FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";

const AddRequest = observer(({show, onHide, now, date}) => {
    const {cities, types, user} = useContext(Context)
    const dispatch = useNotification();

    const [minDate, setMinDate] = useState(now)
    const [maxDate, setMaxDate] = useState()
    const [maxDate2, setMaxDate2] = useState(date)

    const intialValues = {
        dateLoading: '',
        dateUnloading: '',
        WRCountry: '',
        WCountry: '',
        WRState: '',
        WState: '',
        WRCity: '',
        WCity: '',
        WRAddress: '',
        WAddress: '',
        weight: 5,
        volume: 3,
        typeLoading: 'up',
        typeUnloading: 'up',
        cargo: '',
        rate: 5,
        note: '',
        typeTruck: types.typesTruck[0].name,
        ADR: types.ADRs[0].name,
        loadLimit: 5
    };
    const [formValues, setFormValues] = useState(intialValues);

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormValues({ ...formValues, [name]: value })
        if (name === 'dateLoading') {
            let date = new Date(value)
            setMaxDate2(new Date(date.setFullYear(date.getFullYear() + 1)).toLocaleDateString('en-CA'))
        }
        if (name == 'WRCountry'){
            if (cities.countries.includes(value)) {
                getStates(value).then(data => {
                    cities.setWRStates(data)
                }).catch(e => {
                    alert(e)
                })
                //.finally(() => setLoading(false))
            }
            else{
                cities.setWRStates([]);
            }
        }
        if (name == 'WCountry'){
            if (cities.countries.includes(value)) {
                getStates(value).then(data => {
                    cities.setWStates(data)
                }).catch(e => {
                    alert(e)
                })
                //.finally(() => setLoading(false))
            }
            else{
                cities.setWStates([]);
            }
        }
        if (name == 'WRState'){
            if(cities.WRStates.includes(value)) {
                getCities(formValues.WRCountry, value).then(data => {
                    cities.setWRCities(data)
                }).catch(e => {
                    alert(e)
                })
                //.finally(() => setLoading(false))
            } else{
                cities.setWRCities([]);
            }
        }
        if (name == 'WState'){
            if(cities.WStates.includes(value)) {
                getCities(formValues.WCountry, value).then(data => {
                    cities.setWCities(data)
                }).catch(e => {
                    alert(e)
                })
                //.finally(() => setLoading(false))
            } else{
                cities.setWCities([]);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if(!cities.countries.includes(formValues.WRCountry)) {
                handleNewNotification('Invalid from country', 'error')
                return
            }
            if(!cities.countries.includes(formValues.WCountry)) {
                handleNewNotification('Invalid to country', 'error')
                return
            }
            if(!cities.WRStates.includes(formValues.WRState)) {
                handleNewNotification('Invalid from state', 'error')
                return
            }
            if(!cities.WStates.includes(formValues.WState)) {
                handleNewNotification('Invalid to state', 'error')
                return
            }
            if(!cities.WRCities.includes(formValues.WRCity)) {
                handleNewNotification('Invalid from city', 'error')
                return
            }
            if(!cities.WCities.includes(formValues.WCity)) {
                handleNewNotification('Invalid to city', 'error')
                return
            }

            const data = await createRequest(formValues)
            handleNewNotification('Success', 'success')
            // getMyRequests().then(data => {
            //     user.setMyRequests(data)
            // }).catch(e => {
            //     alert(e.response.data.message)
            // })
            setFormValues(intialValues);
            onHide();
            window.location.reload(false)
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
        <Modal show={show} onHide={onHide} centered role="dialog">
            <Modal.Header>
                <h3 className="text-center">Create request</h3>
            </Modal.Header>
            <Modal.Body className="justify-content-center align-items-center">
                <form autoComplete="off" onSubmit={handleSubmit}>
                    <div className="row p-2">
                        <div className="col-lg-6">
                            <MDBInput className="mb-0"
                                      label="Date/time loading:"
                                      type="datetime-local"
                                      name="dateLoading"
                                      min={minDate}
                                      max={maxDate}
                                      required
                                      validate
                                      value={formValues.dateLoading}
                                      onChange={handleChange}
                            />
                            <MDBInput
                                label="From country"
                                list="countries"
                                name="WRCountry"
                                type="text"
                                maxLength="30"
                                minLength="3"
                                required
                                validate
                                value={formValues.WRCountry}
                                onChange={handleChange}
                                autoComplete="nope"
                            />
                            <MDBInput
                                label="From state"
                                list="WRStates"
                                name="WRState"
                                type="text"
                                maxLength="30"
                                minLength="3"
                                required
                                validate
                                value={formValues.WRState}
                                onChange={handleChange}
                                autoComplete="nope"
                            />
                            <MDBInput
                                label="From city"
                                list="WRCities"
                                name="WRCity"
                                type="text"
                                maxLength="30"
                                minLength="3"
                                required
                                validate
                                value={formValues.WRCity}
                                onChange={handleChange}
                                autoComplete="nope"
                            />
                            <MDBInput
                                label="From address"
                                group
                                name="WRAddress"
                                type="textarea"
                                required
                                validate
                                value={formValues.WRAddress}
                                onChange={handleChange}
                                autoComplete="nope"
                            />
                            <FormControl required sx={{ m: 1, width: '-webkit-fill-available' }}>
                                <InputLabel id="typeTruck-label">Type truck</InputLabel>
                                <Select
                                    labelId="typeTruck-label"
                                    value={formValues.typeTruck}
                                    label="Type truck *"
                                    name="typeTruck"
                                    onChange={handleChange}
                                >
                                    {types.typesTruck.map(type =>
                                        <MenuItem key={type.name} value={type.name}>{type.name}</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                            <MDBInput className="mb-0"
                                      label="Weight, t:"
                                      type="number"
                                      name="weight"
                                      required
                                      validate
                                      min="5"
                                      max="40"
                                      value={formValues.weight}
                                      onChange={handleChange}
                            />
                            <FormControl required sx={{ m: 1, width: '-webkit-fill-available' }}>
                                <InputLabel id="typeLoading-label">Type loading</InputLabel>
                                <Select
                                    labelId="typeLoading-label"
                                    value={formValues.typeLoading}
                                    label="Type loading *"
                                    name="typeLoading"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="up">Up</MenuItem>
                                    <MenuItem value="side">Side</MenuItem>
                                    <MenuItem value="pear">Pear</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className="col-lg-6">
                            <MDBInput className="mb-0"
                                      label="Date/time unloading:"
                                      type="datetime-local"
                                      name="dateUnloading"
                                      required
                                      min={formValues.dateLoading}
                                      max={maxDate2}
                                      validate
                                      value={formValues.dateUnloading}
                                      onChange={handleChange}
                            />
                            <MDBInput
                                label="To country"
                                list="countries"
                                name="WCountry"
                                type="text"
                                maxLength="30"
                                minLength="3"
                                required
                                validate
                                value={formValues.WCountry}
                                onChange={handleChange}
                                autoComplete="nope"/>
                            <MDBInput
                                label="To state"
                                list="WStates"
                                name="WState"
                                type="text"
                                maxLength="30"
                                minLength="3"
                                required
                                validate
                                value={formValues.WState}
                                onChange={handleChange}
                                autoComplete="nope"/>
                            <MDBInput
                                label="To city"
                                list="WCities"
                                name="WCity"
                                type="text"
                                maxLength="30"
                                minLength="3"
                                required
                                validate
                                value={formValues.WCity}
                                onChange={handleChange}
                                autoComplete="nope"/>
                            <MDBInput
                                label="To address"
                                group
                                name="WAddress"
                                type="textarea"
                                required
                                validate
                                value={formValues.WAddress}
                                onChange={handleChange}
                                autoComplete="nope"
                            />
                            <FormControl required sx={{ m: 1, width: '-webkit-fill-available' }}>
                                <InputLabel id="adr-label">Type ADR</InputLabel>
                                <Select
                                    labelId="adr-label"
                                    value={formValues.ADR}
                                    label="Type ADR *"
                                    name="ADR"
                                    onChange={handleChange}
                                >
                                    {types.ADRs.map(type =>
                                        <MenuItem key={type.name} value={type.name}>{type.name}</MenuItem>
                                    )}
                                </Select>
                            </FormControl>

                            <MDBInput className="mb-0"
                                      label="Volume, m2:"
                                      type="number"
                                      name="volume"
                                      required
                                      validate
                                      min="3"
                                      max="40"
                                      value={formValues.volume}
                                      onChange={handleChange}
                            />
                            <FormControl required sx={{ m: 1, width: '-webkit-fill-available' }}>
                                <InputLabel id="typeUnloading-label">Type unloading</InputLabel>
                                <Select
                                    labelId="typeUnloading-label"
                                    value={formValues.typeUnloading}
                                    label="Type unloading *"
                                    name="typeUnloading"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="up">Up</MenuItem>
                                    <MenuItem value="side">Side</MenuItem>
                                    <MenuItem value="pear">Pear</MenuItem>
                                </Select>
                            </FormControl>
                        <datalist id="countries">
                            {cities.countries.map(country =>
                                <option key={country} value={country}></option>
                            )}
                        </datalist>
                        <datalist id="WRStates">
                            {cities.WRStates.map(state =>
                                <option key={state} value={state}></option>
                            )}
                        </datalist>
                        <datalist id="WStates">
                            {cities.WStates.map(state =>
                                <option key={state} value={state}></option>
                            )}
                        </datalist>
                        <datalist id="WRCities">
                            {cities.WRCities.map(city =>
                                <option key={city} value={city}></option>
                            )}
                        </datalist>
                        <datalist id="WCities">
                            {cities.WCities.map(city =>
                                <option key={city} value={city}></option>
                            )}
                        </datalist>
                    </div>
                    <div className="col-lg-6">
                        <MDBInput className="mb-0"
                              label="Cargo:"
                              type="text"
                              name="cargo"
                              maxLength="50"
                              minLength="3"
                              required
                              validate
                              value={formValues.cargo}
                              onChange={handleChange}
                        />
                        <MDBInput className="mb-0"
                                  label="Load limit, h:"
                                  group
                                  type="number"
                                  min="1"
                                  max="1000"
                                  name="loadLimit"
                                  required
                                  validate
                                  value={formValues.loadLimit}
                                  onChange={handleChange}
                        />
                    </div>
                    <div className="col-lg-6">
                        <MDBInput className="mb-0"
                                  label="Rate, $:"
                                  group
                                  type="number"
                                  min="5"
                                  max="1000000"
                                  name="rate"
                                  required
                                  validate
                                  value={formValues.rate}
                                  onChange={handleChange}
                        />
                        <MDBInput className="mb-0"
                                  label="Note"
                                  type="textarea"
                                  name="note"
                                  validate
                                  value={formValues.note}
                                  onChange={handleChange}
                        />
                    </div>
                    <div className="d-md-flex justify-content-center align-items-center mb-4">
                        <Button variant={"brand"} type="submit">
                            Add request
                            <MDBIcon far icon="paper-plane" className="ml-1" />
                        </Button>
                        <Button variant={"outline-secondary"} onClick={onHide}>
                            Close
                            <MDBIcon far icon="times-circle" className="ml-1" />
                        </Button>
                    </div>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
});

export default AddRequest;