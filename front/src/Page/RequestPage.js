import React, {useContext, useEffect, useState} from 'react';
import {MDBCard, MDBContainer, MDBIcon, MDBIframe} from "mdbreact";
import {Button, Col, Container, Row, Spinner} from "react-bootstrap";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {acceptRequest, deleteRequest, getFreeDriversForReq, getRequest, updateRequest} from "../HTTPS/requestApi";
import {useNavigate, useParams} from "react-router-dom";
import {MYREQUESTS_ROUTE} from "../consts";
import {Waves} from "loading-animations-react";
import {useNotification} from "../Notification/NotificationProvider";
import {Accordion, AccordionDetails, AccordionSummary, Card, CardContent, Grid, Paper, Typography} from "@mui/material";
import SetObject from "../Component/SetObject";
import {getFreeDrivers} from "../HTTPS/userApi";

const RequestRage = observer(() => {
    const {user} = useContext(Context)
    const {id} = useParams();
    const navigate = useNavigate()
    const dispatch = useNotification();

    const columns  = () =>[
        {label: 'Name', field: 'name'},
    ]

    const [request, setRequest] = useState(null)
    const [loading, setLoading] = useState(true)

    const [freeDrivers, setFreeDrivers] = useState([])
    const [showDrivers, setShowDrivers] = useState(false)
    const handleCloseDrivers = () => setShowDrivers(false)
    const handleShowDrivers = () => {
        getFreeDrivers(request.dateLoading, request.dateUnloading).then(data => {
            setFreeDrivers(data);
        }).catch( e=> {
            alert(e.response.data.message)
        })
        setShowDrivers(true)
    }


    useEffect(() => {
        getRequest(id).then(data => {
            setRequest(data)
        }).catch( e=> {
            alert(e.response.data.message)
        }).finally(() => {
            setLoading(false)
        })
    }, [])

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

    const handleNewNotification = (message, type) => {
        dispatch({
            type: type,
            message: message,
            title: message
        })
    }


    const Accept = async (driverId) => {
        try {
            const data = await updateRequest(id, {driverId})
            if (data.message === 'Success') {
                handleNewNotification('Success', 'success')
            } else {
                handleNewNotification(data.message, 'error')
                user.check()
            }
            navigate(MYREQUESTS_ROUTE)
        } catch (e) {
            handleNewNotification(e.response.data.message, 'error')
            user.check()
        }
    }

    const Delete = async () => {
        try {
            const data = await deleteRequest(id)
            if (data.message === 'Success') {
                handleNewNotification('Success', 'success')
            } else {
                handleNewNotification(data.message, 'error')
                user.check()
            }
            navigate(MYREQUESTS_ROUTE)
        } catch (e) {
            handleNewNotification(e.response.data.message, 'error')
            user.check()
        }
    }

    const updateStatus = async (body) => {
        try {
            const data = await updateRequest(id, body)
            if (data.message === 'Success') {
                handleNewNotification('Success', 'success')
                const req = request
                const result = Object.assign(req, body)
                setRequest(result);
            } else {
                handleNewNotification(data.message, 'error')
                user.check()
            }
        } catch (e) {
            handleNewNotification(e.response.data.message, 'error')
            user.check()
        }
    }

    const StartLoad = async () => {
        await updateStatus({startLoad: Date.now()})
    }

    const FinishLoad = async () => {
        await updateStatus({finishLoad: Date.now()})
    }

    const StartUnload = async () => {
        await updateStatus({startUnload: Date.now()})

    }

    const FinishUnload = async () => {
        await updateStatus({finishUnload: Date.now()})
    }

    const needStatusBlock = () =>{
        return request.loadLimit || (!request.carrier && user.userRole === 'CARRIER')
    }

    return (
        <Container>
            <MDBIframe src={"https://www.google.com/maps/embed/v1/directions?key=AIzaSyCe7MuBAvlyy7UAsnrQe-R8sG9ykWOrlLY&origin=" + request.WRCity + "&destination=" + request.WCity + "&mode=driving"}
                           frameBorder="0"
                           style={{height: 20 + 'em'}}
                           allowFullScreen></MDBIframe>
            <Accordion defaultExpanded="true">
                <AccordionSummary style={{backgroundColor: 'rgba(0, 0, 0, .09)',
                    borderBottom: '1px solid rgba(0, 0, 0, .125)',
                    marginBottom: -1,
                    minHeight: 56,}}
                    aria-controls="panel1a-content"
                    id="panel1a-header">
                    <Typography variant="h6">Request detail</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="h6"  gutterBottom>Date loading -> unloading:</Typography>
                    <Typography variant="body2" gutterBottom>{request.dateLoading + ' -> ' + request.dateUnloading}</Typography>
                    <Typography variant="h6"  gutterBottom>From -> To:</Typography>
                    <Typography variant="body2" gutterBottom>{request.WRCity + ' - ' + request.WCity}</Typography>
                    <Typography variant="h6"  gutterBottom>Cargo:</Typography>
                    <Typography variant="body2" gutterBottom>{request.cargo}</Typography>
                    <Typography variant="h6"  gutterBottom>Weight:</Typography>
                    <Typography variant="body2" gutterBottom>{request.weight}</Typography>
                    <Typography variant="h6"  gutterBottom>Volume:</Typography>
                    <Typography variant="body2" gutterBottom>{request.volume}</Typography>
                    <Typography variant="h6"  gutterBottom>ype ADR:</Typography>
                    <Typography variant="body2" gutterBottom>{request.ADR}</Typography>
                    <Typography variant="h6"  gutterBottom>Type truck:</Typography>
                    <Typography variant="body2" gutterBottom>{request.typeTruck}</Typography>
                    <Typography variant="h6"  gutterBottom>Type loading -> unloading:</Typography>
                    <Typography variant="body2" gutterBottom>{request.typeLoading + ' -> ' + request.typeUnloading}</Typography>
                    <Typography variant="h6"  gutterBottom>Rate:</Typography>
                    <Typography variant="body2" gutterBottom>{request.rate}</Typography>
                    {request.loadLimit &&
                        <>
                            <Typography variant="h6" gutterBottom>Load limit:</Typography>
                            <Typography variant="body2" gutterBottom>{request.loadLimit}</Typography>
                        </>
                    }
                    {request.note &&
                        <>
                            <Typography variant="h6"  gutterBottom>Note:</Typography>
                            <Typography variant="body2" gutterBottom>{request.note}</Typography>
                        </>
                    }
                    {request.carrier &&
                        <Typography variant="h6" gutterBottom>Accepted</Typography>
                    }
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary style={{backgroundColor: 'rgba(0, 0, 0, .09)',
                    borderBottom: '1px solid rgba(0, 0, 0, .125)',
                    marginBottom: -1,
                    minHeight: 56,}}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography variant="h6">Company detail</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="h6"  gutterBottom>Company Name:</Typography>
                    <Typography variant="body2" gutterBottom>{request.customer.nameCompany}</Typography>
                    <Typography variant="h6"  gutterBottom>Director:</Typography>
                    <Typography variant="body2" gutterBottom>{request.customer.director}</Typography>
                    <Typography variant="h6"  gutterBottom>City:</Typography>
                    <Typography variant="body2" gutterBottom>{request.customer.city}</Typography>
                    <Typography variant="h6"  gutterBottom>Name:</Typography>
                    <Typography variant="body2" gutterBottom>{request.customer.name}</Typography>
                    <Typography variant="h6"  gutterBottom>Email:</Typography>
                    <Typography variant="body2" gutterBottom>{request.customer.email}</Typography>
                    <Typography variant="h6"  gutterBottom>Phone number:</Typography>
                    <Typography variant="body2" gutterBottom>{request.customer.phoneNumber}</Typography>
                </AccordionDetails>
            </Accordion>
            {request.carrier &&
                <Accordion>
                    <AccordionSummary style={{backgroundColor: 'rgba(0, 0, 0, .09)',
                        borderBottom: '1px solid rgba(0, 0, 0, .125)',
                        marginBottom: -1,
                        minHeight: 56,}}
                                      aria-controls="panel1a-content"
                                      id="panel1a-header"
                    >
                        <Typography variant="h6">Carrier detail</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="h6"  gutterBottom>Company Name:</Typography>
                        <Typography variant="body2" gutterBottom>{request.carrier.nameCompany}</Typography>
                        <Typography variant="h6"  gutterBottom>Director:</Typography>
                        <Typography variant="body2" gutterBottom>{request.carrier.director}</Typography>
                        <Typography variant="h6"  gutterBottom>City:</Typography>
                        <Typography variant="body2" gutterBottom>{request.carrier.city}</Typography>
                        <Typography variant="h6"  gutterBottom>Name:</Typography>
                        <Typography variant="body2" gutterBottom>{request.carrier.name}</Typography>
                        <Typography variant="h6"  gutterBottom>Phone number:</Typography>
                        <Typography variant="body2" gutterBottom>{request.carrier.phoneNumber}</Typography>
                        <Typography variant="h6"  gutterBottom>Email:</Typography>
                        <Typography variant="body2" gutterBottom>{request.carrier.email}</Typography>
                    </AccordionDetails>
                </Accordion>
            }
            {request.driver &&
                <Accordion>
                    <AccordionSummary style={{backgroundColor: 'rgba(0, 0, 0, .09)',
                        borderBottom: '1px solid rgba(0, 0, 0, .125)',
                        marginBottom: -1,
                        minHeight: 56,}}
                                      aria-controls="panel1a-content"
                                      id="panel1a-header"
                    >
                        <Typography variant="h6">Driver detail</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="h6"  gutterBottom>Name:</Typography>
                        <Typography variant="body2" gutterBottom>{request.driver.name}</Typography>
                        <Typography variant="h6"  gutterBottom>Email:</Typography>
                        <Typography variant="body2" gutterBottom>{request.driver.email}</Typography>
                        <Typography variant="h6"  gutterBottom>Phone number:</Typography>
                        <Typography variant="body2" gutterBottom>{request.driver.phoneNumber}</Typography>
                    </AccordionDetails>
                </Accordion>
            }
            {needStatusBlock &&
                <Accordion>
                    <AccordionSummary style={{
                        backgroundColor: 'rgba(0, 0, 0, .09)',
                        borderBottom: '1px solid rgba(0, 0, 0, .125)',
                        marginBottom: -1,
                        minHeight: 56,
                    }}
                                      aria-controls="panel1a-content"
                                      id="panel1a-header">
                        <Typography variant="h6">Status</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {request.startLoad &&
                            <Typography variant="body2" gutterBottom>Start Loading: {request.startLoad}</Typography>
                        }
                        {request.finishLoad &&
                            <Typography variant="body2" gutterBottom>Finish
                                Loading: {request.finishLoad}</Typography>
                        }
                        {request.startUnload &&
                            <Typography variant="body2" gutterBottom>Start
                                Unloading: {request.startUnload}</Typography>
                        }
                        {request.finishUnload &&
                            <Typography variant="body2" gutterBottom>Finish
                                Unloading: {request.finishUnload}</Typography>
                        }
                        {!request.carrier && user.userRole === 'CARRIER' &&
                            <Button variant={"outline-secondary"} className="px-4" onClick={handleShowDrivers}>
                                Accept
                            </Button>
                        }
                        {request.customer && request.customer.id == user.userId &&
                            <Button variant={"outline-secondary"} className="px-4" onClick={Delete}>
                                Delete
                            </Button>
                        }
                        {request.driver && request.driver.id == user.userId &&
                            <>
                                {!request.startLoad ?
                                    <Button variant={"outline-secondary"} className="px-4" onClick={StartLoad}>
                                        Start Loading
                                    </Button>
                                    :
                                    <>
                                        {!request.finishLoad ?
                                            <Button variant={"outline-secondary"} className="px-4" onClick={FinishLoad}>
                                                Finish Loading
                                            </Button>
                                            :
                                            <>
                                                {!request.startUnload ?
                                                    <Button variant={"outline-secondary"} className="px-4"
                                                            onClick={StartUnload}>
                                                        Start Unloading
                                                    </Button>
                                                    :
                                                    <>
                                                        {!request.finishUnload &&
                                                            <Button variant={"outline-secondary"} className="px-4"
                                                                    onClick={FinishUnload}>
                                                                Finish Unloading
                                                            </Button>
                                                        }
                                                    </>
                                                }
                                            </>
                                        }
                                    </>
                                }
                            </>
                        }
                    </AccordionDetails>
                </Accordion>
            }
            <SetObject show={showDrivers} onHide={handleCloseDrivers} columns={columns} name='Driver' onSelect={Accept} objects={freeDrivers}></SetObject>
        </Container>
    );
});

export default RequestRage;