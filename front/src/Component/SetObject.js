import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {MDBIcon, MDBInput, } from "mdbreact";
import {Button, Modal} from "react-bootstrap";
import {useNotification} from "../Notification/NotificationProvider";
import {useParams} from "react-router-dom";
import {createDriver, getFreeDrivers} from "../HTTPS/userApi";
import {getFreeTrucks} from "../HTTPS/truckApi";
import {Waves} from "loading-animations-react";
import {Table, Tbody, Th, Thead, Tr} from "react-super-responsive-table";
import {Typography} from "@mui/material";
import grey from "../img/grey.jfif";


const SetTruck = observer(({show, onHide, name, columns, onSelect, objects}) => {
    const dispatch = useNotification();
    const [selected, setSelected] = useState();

    return (
        <Modal show={show} onHide={onHide} centered role="dialog">
            <Modal.Header>
                <h3 className="text-center">Select {name}</h3>
            </Modal.Header>
            <Modal.Body className="justify-content-center align-items-center">
                {objects.length != 0 ?
                    <>
                        <Table>
                            <Thead>
                                <Tr>
                                    {columns().map(({label}, key) => <Th key={key}>{label}</Th>)}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {objects.map((el, key) =>
                                    <Tr key={key} onClick={ () => setSelected(el.id)} {...(selected == el.id ? {background : grey} : {})}>
                                        {columns().map(({field}, key2) => <Th key={key2}>{el[field]}</Th>)}
                                    </Tr>
                                )}
                            </Tbody>
                        </Table>
                        <div className="d-md-flex justify-content-center align-items-center mt-3">
                            <Button variant={"brand"} onClick={ () => onSelect(selected)}>
                                Select
                            </Button>
                        </div>
                    </>
                    :
                    <Typography>No available</Typography>
                }
                <Button variant={"outline-secondary"} onClick={onHide}>
                    Close
                </Button>
            </Modal.Body>
        </Modal>
    );
});

export default SetTruck;