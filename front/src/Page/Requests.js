import {observer} from "mobx-react-lite";
import {Button, Container, Row} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {Context} from "../index";
import Filter from "../Component/Filter";
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import {REQUESTPAGE_ROUTE} from "../consts";
import {useNavigate} from "react-router-dom";
import DataTable from "../Component/DataTable";
import {getSecondary} from "../HTTPS/typesApi";
import {Waves} from "loading-animations-react";
import {getCountries} from "../HTTPS/cityApi";


const Requests = observer(() => {
    const {filter, types, request, user, cities} = useContext(Context)
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)

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
    ]
    const columnsMobile  = [
        {label: 'Date Loading', field: 'dateLoading'},
        {label: 'From', field: 'WRCity'},
        {label: 'To', field: 'WRCity'},
        {label: 'Type Truck', field: 'typeTruck'},
        {label: 'Rate', field: 'rate'},
    ]
    let nowDate = new Date()
    let maxYear = nowDate.getFullYear()
    let minYear = maxYear - 30


    const columns = () => {
        return window.innerWidth <= 500 ? columnsMobile : columnsDesktop;
    }

    useEffect(() => {
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
        <>
            <Container fluid className="p-1">
                <Row className="m-0">
                    <Button variant={"outline-secondary"} className="px-4 me-3" onClick={handleShowFilter}>
                        Filter
                    </Button>
                </Row>
                <Row className="m-0">
                    <h2 className="text-center mt-3"> Search request</h2>
                    {filter.getRequests(request.requests).length != 0 ?
                        <DataTable requests={filter.getRequests(request.requests)} columns={columns}  route={REQUESTPAGE_ROUTE}/>
                        :
                        <p className="text-center">Not found</p>
                    }
                </Row>
                <Filter show={showFilter} onHide={handleCloseFilter}/>

            </Container>

        </>
    );
});

export default Requests;