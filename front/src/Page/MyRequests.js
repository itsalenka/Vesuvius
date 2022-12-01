import {observer} from "mobx-react-lite";
import {useContext, useEffect, useState} from "react";
import {Context} from "../index";
import {Button, Container, Row} from "react-bootstrap";
import {Table, Tbody, Th, Thead, Tr} from "react-super-responsive-table";
import Filter from "../Component/Filter";
import AddRequest from "../Component/AddRequest";
import {Waves} from "loading-animations-react";
import {getMyRequests} from "../HTTPS/requestApi";
import {getCountries} from "../HTTPS/cityApi";
import {getSecondary} from "../HTTPS/typesApi";
import DataTable from "../Component/DataTable";
import {REQUESTPAGE_ROUTE} from "../consts";

const MyRequests = observer(() => {
    const {filter, types, user, cities} = useContext(Context)

    const [loading, setLoading] = useState(true)

    const [showForm, setShowForm] = useState(false)
    const handleCloseForm = () => setShowForm(false)
    const handleShowForm = () => setShowForm(true)

    const [showFilter, setShowFilter] = useState(false)
    const handleCloseFilter = () => setShowFilter(false)
    const handleShowFilter = () => setShowFilter(true)

    const columnsDesktop  = [
        {label: 'Date Loading', field: 'dateLoading'},
        {label: 'Date Unloading', field: 'dateUnloading'},
        {label: 'From', field: 'WRCity'},
        {label: 'To', field: 'WCity'},
        {label: 'Type Truck', field: 'typeTruck'},
        {label: 'Rate', field: 'rate'},
        {label: 'ADR', field: 'ADR'},
        {label:'Carrier', field: 'carrier'}
    ]
    const columnsMobile  = [
        {label: 'Date Loading', field: 'dateLoading'},
        {label: 'From', field: 'WRCity'},
        {label: 'To', field: 'WRCity'},
        {label: 'Type Truck', field: 'typeTruck'},
        {label: 'Rate', field: 'rate'},
        {label:'Carrier', field: 'carrier'}
    ]

    const columns = () => {
        return window.innerWidth <= 500 ? columnsMobile : columnsDesktop;
    }

    useEffect(() => {
        getMyRequests().then(data => {
            user.setMyRequests(data)
        }).catch(e => {
            alert(e.response.data.message)
        }).finally(() => setLoading(false))
        getCountries().then(data => {
            cities.setCountries(data);
        }).catch(e => {
            alert(e.response.data.message)
        })
        getSecondary().then(data => {
            types.setADRs(data.ADRs)
            types.setTypesTruck(data.typesTruck)
        }).catch(e => {
            alert(e.response.data.message)
        })    }, [])

    let date = new Date()
    date.setDate(date.getDate())
    date = new Date(date.setFullYear(date.getFullYear()  + 1)).toLocaleDateString('en-CA')

    let now = new Date()
    now.setDate(now.getDate())
    now = now.toLocaleDateString('en-CA')

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
                <Button variant={"outline-secondary"} className="px-4 me-3" onClick={handleShowFilter}>
                    Filter
                </Button>
                {user.userRole == 'CUSTOMER' &&
                    <Button variant={"outline-secondary"} className="px-4 me-3" onClick={handleShowForm}>
                        Add request
                    </Button>
                }
            </Row>
            <Row className="m-0">
                <h2 className="text-center mt-3"> My requests</h2>
                {filter.getRequests(user.myRequests).length != 0 ?
                    <DataTable requests={filter.getRequests(user.myRequests)} columns={columns} route={REQUESTPAGE_ROUTE}/>
                    :
                    <p className="text-center">Not found</p>
                }
            </Row>
            <AddRequest show={showForm} onHide={handleCloseForm}/>
            <Filter show={showFilter} onHide={handleCloseFilter}/>
        </Container>
    );
});

export default MyRequests;