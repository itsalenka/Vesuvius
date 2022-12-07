import {observer} from "mobx-react-lite";
import {
    Card,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup, FormHelperText,
    FormLabel,
    InputLabel,
    MenuItem,
    Select, Typography
} from "@mui/material";
import {MDBIcon, MDBInput} from "mdbreact";
import {Button, Container} from "react-bootstrap";
import React, {useContext, useEffect, useState} from "react";
import {deleteTruck, getFreeTrucks, getTruck, updateTruck} from "../HTTPS/truckApi";
import {getSecondary} from "../HTTPS/typesApi";
import {useNavigate, useParams} from "react-router-dom";
import {Context} from "../index";
import {Waves} from "loading-animations-react";
import {useNotification} from "../Notification/NotificationProvider";
import AddEditTruck from "../Component/AddEditTruck";
import {MYTRUCKS_ROUTE} from "../consts";
import SetObject from "../Component/SetObject";
import {getDriver, getFreeDrivers} from "../HTTPS/userApi";

const TruckPage = observer(() => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {types} = useContext(Context)

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
        type: '',
    };

    const columns  = () =>[
        {label: 'Name', field: 'name'},
    ]

    const [freeDrivers, setFreeDrivers] = useState([])
    const [showForm, setShowForm] = useState(false)
    const handleCloseForm = () => setShowForm(false)
    const handleShowForm = () => setShowForm(true)

    const [showDrivers, setShowDrivers] = useState(false)
    const handleCloseDrivers = () => setShowDrivers(false)
    const handleShowDrivers = () => {
        getFreeDrivers().then(data => {
            setFreeDrivers(data);
        }).catch( e=> {
            alert(e.response.data.message)
        })
        setShowDrivers(true)
    }

    const [truck, setTruck] = useState(intialValues)
    const [loading, setLoading] = useState(true)
    const dispatch = useNotification();


    useEffect(() => {
        getTruck(id).then(data => {
            if(!data.notes)
                data.notes = ''
            setTruck(data)
        }).catch(e => {
            alert(e.response.data.message)
        }).finally(() => setLoading(false))

        getSecondary().then(data => {
            types.setTypesTruck(data.typesTruck)
        }).catch(e => {
            alert(e.response.data.message)
        })
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setTruck({ ...truck, [name]: value })
    };

    let nowDate = new Date()
    let maxYear = nowDate.getFullYear()
    let minYear = maxYear - 30

    const handleNewNotification = (message, type) => {
        dispatch({
            type: type,
            message: message,
            title: message
        })
    }

    const handleDelete = async () => {
        try{
            await deleteTruck(id);
            handleNewNotification('Success', 'success')
            navigate(MYTRUCKS_ROUTE);
        } catch (e) {
            handleNewNotification(e.response.data.message, 'error')
        }
    };

    const handleSelect = async (driverId) => {
        try{
            setShowDrivers(false)
            await updateTruck(id, {driverId});
            getTruck(id).then(data => {
                setTruck(data)
            })
        } catch (e) {
            handleNewNotification(e.response.data.message, 'error')
        }
    };

    const deleteDriver = async () => {
        try{
            await updateTruck(id, {driverId: null});
            getTruck(id).then(data => {
                setTruck(data)
            })
        } catch (e) {
            handleNewNotification(e.response.data.message, 'error')
        }
    };

    if (loading) {
        return <>
            <div style={{height:  window.innerHeight - 87,
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
                <h4 className="mb-4">You truck</h4>
                <div className="row p-2">
                    <div className="col-lg-6">
                        <Typography variant="h6"  gutterBottom>Number:</Typography>
                        <Typography variant="body2" gutterBottom>{truck.number}</Typography>
                        <Typography variant="h6"  gutterBottom>Brand:</Typography>
                        <Typography variant="body2" gutterBottom>{truck.brand}</Typography>
                        <Typography variant="h6"  gutterBottom>Model:</Typography>
                        <Typography variant="body2" gutterBottom>{truck.model}</Typography>
                        <Typography variant="h6"  gutterBottom>Year:</Typography>
                        <Typography variant="body2" gutterBottom>{truck.year}</Typography>
                        <Typography variant="h6"  gutterBottom>Type truck:</Typography>
                        <Typography variant="body2" gutterBottom>{truck.typeTruck}</Typography>
                        <Typography variant="h6" gutterBottom>Driver:</Typography>
                        {truck.driver &&
                            <Typography variant="body2" gutterBottom>{truck.driver.name}</Typography>
                        }
                        {!truck.driver &&
                            <Typography variant="body2" gutterBottom>none</Typography>
                        }
                    </div>
                    <div className="col-lg-6">
                        <Typography variant="h6"  gutterBottom>Max weight, t:</Typography>
                        <Typography variant="body2" gutterBottom>{truck.maxWeight}</Typography>
                        <Typography variant="h6"  gutterBottom>Max volume, m2:</Typography>
                        <Typography variant="body2" gutterBottom>{truck.maxVolume}</Typography>
                        <Typography variant="h6"  gutterBottom>Type loading/unloading:</Typography>
                        {truck.isUpLoading &&
                            <Typography variant="body2" gutterBottom> - Up</Typography>
                        }
                        {truck.isSideLoading &&
                            <Typography variant="body2" gutterBottom> - Side</Typography>
                        }
                        {truck.isPearLoading &&
                            <Typography variant="body2" gutterBottom> - Pear</Typography>
                        }
                        {truck.notes &&
                            <>
                                <Typography variant="h6" gutterBottom>Notes:</Typography>
                                <Typography variant="body2" gutterBottom>{truck.notes}</Typography>
                            </>
                        }
                    </div>
                </div>
                <div className="d-flex justify-content-end">
                    <Button variant="outline-secondary" className="mx-4" onClick={handleShowDrivers}>
                        Set/change driver
                    </Button>
                    {truck.driver &&
                        <Button variant="outline-secondary" className="mx-4" onClick={deleteDriver}>
                            Delete driver
                        </Button>
                    }
                    <Button variant="brand"className="mx-4"  onClick={handleShowForm}>
                        Update
                        <MDBIcon far icon="paper-plane" className="ml-1" />
                    </Button>
                    <Button variant="outline-secondary" className="mx-4" onClick={handleDelete}>
                        Delete
                    </Button>
                </div>
            </Card>
            <AddEditTruck show={showForm} onHide={handleCloseForm} minYear={minYear} maxYear={maxYear} truck={truck} type='Update'/>
            <SetObject show={showDrivers} onHide={handleCloseDrivers} columns={columns} name='Driver' onSelect={handleSelect} objects={freeDrivers}></SetObject>
        </Container>
    );
});

export default TruckPage;