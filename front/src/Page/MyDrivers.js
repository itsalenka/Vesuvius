import {observer} from "mobx-react-lite";
import {Button, Container, Row} from "react-bootstrap";
import DataTable from "../Component/DataTable";
import {MYDRIVERS_ROUTE, MYTRUCKS_ROUTE, REQUESTPAGE_ROUTE} from "../consts";
import AddRequest from "../Component/AddRequest";
import Filter from "../Component/Filter";
import React, {useContext, useEffect, useState} from "react";
import {getMyRequests} from "../HTTPS/requestApi";
import {getCountries} from "../HTTPS/cityApi";
import {getSecondary} from "../HTTPS/typesApi";
import {Context} from "../index";
import {Waves} from "loading-animations-react";
import {getMyTrucks} from "../HTTPS/truckApi";
import AddTruck from "../Component/AddTruck";
import AddEditTruck from "../Component/AddEditTruck";
import {getMyDrivers} from "../HTTPS/userApi";
import AddDriver from "../Component/AddDriver";

const MyDrivers = observer(() => {
    const {user, types} = useContext(Context)
    const [loading, setLoading] = useState(true)

    const [showForm, setShowForm] = useState(false)
    const handleCloseForm = () => setShowForm(false)
    const handleShowForm = () => setShowForm(true)

    const columns  = () =>[
        {label: 'Name', field: 'name'},
        {label: 'Email', field: 'email'},
        {label: 'Truck', field: 'truck'},
    ]


    const intialValues = {
        name: '',
        email: '',
        model: '',
        role: '',
        phoneNumber: '',
        password: '',
        passwordRep: '',
    };

    useEffect(() => {
        getMyDrivers().then(data => {
            user.setDrivers(data)
        }).catch(e => {
            alert(e.response.data.message)
        }).finally(() => setLoading(false))
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

    return (
        <Container fluid className="p-1">
            <Row className="m-0">
                {/*<Button variant={"outline-secondary"} className="px-4 me-3" onClick={handleShowFilter}>*/}
                {/*    Filter*/}
                {/*</Button>*/}
                <Button variant={"outline-secondary"} className="px-4 me-3" onClick={handleShowForm}>
                    Add driver
                </Button>
            </Row>
            <Row className="m-0">
                <h2 className="text-center mt-3"> My drivers</h2>
                {user.drivers.length != 0 ?
                    <DataTable requests={user.drivers} columns={columns} route={MYDRIVERS_ROUTE}/>
                    :
                    <p className="text-center">Not found</p>
                }
            </Row>
            <AddDriver show={showForm} onHide={handleCloseForm} driver={intialValues} type='Create'/>
        </Container>
    );
});

export default MyDrivers;