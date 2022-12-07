import {observer} from "mobx-react-lite";
import {
    Card, Typography
} from "@mui/material";
import {Button, Container} from "react-bootstrap";
import React, {useContext, useEffect, useState} from "react";
import {getSecondary} from "../HTTPS/typesApi";
import {useNavigate, useParams} from "react-router-dom";
import {Context} from "../index";
import {Waves} from "loading-animations-react";
import {useNotification} from "../Notification/NotificationProvider";
import {MYDRIVERS_ROUTE} from "../consts";
import {deleteDriver, getDriver} from "../HTTPS/userApi";
import SetObject from "../Component/SetObject";
import {getFreeTrucks, updateTruck} from "../HTTPS/truckApi";

const DriverPage = observer(() => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {types} = useContext(Context)

    const columns  = () =>[
        {label: 'Number', field: 'number'},
        {label: 'brand', field: 'brand'},
        {label: 'year', field: 'year'},
        {label: 'type', field: 'typeTruck'},
    ]

    const [freeTrucks, setFreeTrucks] = useState([])
    const [showTrucks, setShowTrucks] = useState(false)
    const handleCloseTrucks = () => setShowTrucks(false)

    const handleShowTrucks = () => {
        getFreeTrucks().then(data => {
            setFreeTrucks(data);
            console.log(data)
        }).catch( e=> {
            alert(e.response.data.message)
        })
        setShowTrucks(true)
    }

    const [driver, setDriver] = useState()
    const [loading, setLoading] = useState(true)
    const dispatch = useNotification();


    useEffect(() => {
        getDriver(id).then(data => {
            setDriver(data)
        }).catch(e => {
            alert(e.response.data.message)
        }).finally(() => setLoading(false))

        getSecondary().then(data => {
            types.setTypesTruck(data.typesTruck)
        }).catch(e => {
            alert(e.response.data.message)
        })
    }, [])

    const handleNewNotification = (message, type) => {
        dispatch({
            type: type,
            message: message,
            title: message
        })
    }

    const handleDelete = async () => {
        try{
            await deleteDriver(id);
            handleNewNotification('Success', 'success')
            navigate(MYDRIVERS_ROUTE);
        } catch (e) {
            handleNewNotification(e.response.data.message, 'error')
        }
    };

    const handleSelect = async (truckId) => {
        try{
            console.log(truckId)
            setShowTrucks(false)
            await updateTruck(truckId, {driverId: id});
            getDriver(id).then(data => {
                setDriver(data)
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
                <h4 className="mb-4">Driver</h4>
                <Typography variant="h6"  gutterBottom>Name:</Typography>
                <Typography variant="body2" gutterBottom>{driver.name}</Typography>
                <Typography variant="h6"  gutterBottom>Email:</Typography>
                <Typography variant="body2" gutterBottom>{driver.email}</Typography>
                <Typography variant="h6"  gutterBottom>Phone Number:</Typography>
                <Typography variant="body2" gutterBottom>{driver.phoneNumber}</Typography>
                {driver.truck &&
                    <>
                        <Typography variant="h6"  gutterBottom>Truck:</Typography>
                        <Typography variant="body2" gutterBottom>{driver.truck}</Typography>
                    </>
                }
                <div className="d-flex justify-content-end">
                    <Button variant="outline-secondary" className="mx-4" onClick={handleShowTrucks}>
                        Set/change truck
                    </Button>
                    <Button variant="outline-secondary" className="mx-4" onClick={handleDelete}>
                        Delete
                    </Button>
                </div>
            </Card>
            <SetObject show={showTrucks} onHide={handleCloseTrucks} columns={columns} name='Truck' onSelect={handleSelect} objects={freeTrucks}></SetObject>
        </Container>
    );
});

export default DriverPage;