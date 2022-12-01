import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {MDBIcon, MDBInput, } from "mdbreact";
import {Button, Modal} from "react-bootstrap";
import {createRequest, getMyRequests} from "../HTTPS/requestApi";
import {useNotification} from "../Notification/NotificationProvider";
import {getCities, getStates} from "../HTTPS/cityApi";
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup, FormHelperText,
    FormLabel,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import {createTruck} from "../HTTPS/truckApi";

const AddTruck = observer(({show, onHide, minYear, maxYear}) => {
    const {types} = useContext(Context)
    const dispatch = useNotification();

    const intialValues = {
        number: '',
        brand: '',
        model: '',
        year: '',
        notes: '',
        maxWeight: 5,
        maxVolume: 5,
        isUpLoading: false,
        isSideLoading: false,
        isPearLoading: false,
        type: types.typesTruck[0].name,
    };
    const [formValues, setFormValues] = useState(intialValues);

    const error = [formValues.isUpLoading, formValues.isSideLoading, formValues.isPearLoading].filter((v) => v).length == 0;
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormValues({ ...formValues, [name]: value })
    };

    const handleChangeCB = (e) => {
        const { name, checked } = e.target
        setFormValues({ ...formValues, [name]: checked })
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if(error)
                return
            const data = await createTruck(formValues)
            handleNewNotification('Success', 'success')
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
                <h3 className="text-center">Create truck</h3>
            </Modal.Header>
            <Modal.Body className="justify-content-center align-items-center">
                <form autoComplete="off" onSubmit={handleSubmit}>
                    <div className="row p-2">
                        <div className="col-lg-6">
                            <MDBInput className="mb-0"
                                      label="Number:"
                                      type="text"
                                      required
                                      name="number"
                                      maxLength="10"
                                      minLength="3"
                                      required
                                      validate
                                      value={formValues.number}
                                      onChange={handleChange}
                            />
                            <MDBInput className="mb-0"
                                      label="Brand:"
                                      type="text"
                                      required
                                      name="brand"
                                      maxLength="20"
                                      minLength="3"
                                      required
                                      validate
                                      value={formValues.brand}
                                      onChange={handleChange}
                            />
                            <MDBInput className="mb-0"
                                      label="Model:"
                                      required
                                      type="text"
                                      name="model"
                                      maxLength="20"
                                      minLength="3"
                                      required
                                      validate
                                      value={formValues.model}
                                      onChange={handleChange}
                            />
                            <MDBInput className="mb-0"
                                      label="Year:"
                                      required
                                      type="number"
                                      name="year"
                                      min={minYear}
                                      max={maxYear}
                                      required
                                      validate
                                      value={formValues.year}
                                      onChange={handleChange}
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
                                      label="Notes"
                                      type="textarea"
                                      name="notes"
                                      validate
                                      value={formValues.notes}
                                      onChange={handleChange}
                            />

                        </div>
                        <div className="col-lg-6">
                            <MDBInput className="mb-0"
                                label="Max weight, t:"
                                type="number"
                                  required
                                name="maxWeight"
                                required
                                validate
                                min="5"
                                max="40"
                                value={formValues.maxWeight}
                                onChange={handleChange}
                            />
                            <MDBInput className="mb-0"
                                      label="Max volume, m2:"
                                      type="number"
                                      required
                                      name="maxVolume"
                                      required
                                      validate
                                      min="3"
                                      max="40"
                                      value={formValues.maxVolume}
                                      onChange={handleChange}
                            />
                            <FormControl
                                required
                                component="fieldset"
                                sx={{ m: 3 }}
                                error={error}
                                variant="standard"
                            >
                                <FormLabel component="legend" color="secondary" >Types loading/unloading</FormLabel>
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={formValues.isUpLoading} color="secondary" onChange={handleChangeCB} name="isUpLoading" />
                                        }
                                        label="Up"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={formValues.isSideLoading} color="secondary" onChange={handleChangeCB} name="isSideLoading" />
                                        }
                                        label="Side"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={formValues.isPearLoading} color="secondary" onChange={handleChangeCB} name="isPearLoading" />
                                        }
                                        label="Pear"
                                    /></FormGroup>
                                <FormHelperText>You need to select</FormHelperText>
                            </FormControl>
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

export default AddTruck;