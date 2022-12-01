import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {MDBCard, MDBInput} from "mdbreact";
import {Button, Container, Modal} from "react-bootstrap";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

const Filter =observer(({show, onHide}) => {
    const {types, filter} = useContext(Context)

    const clear = () => {
        filter.setTo('')
        filter.setFrom('')
        filter.setDateFilter('')
        filter.setTypeTruckFilter('')
        filter.setADRFilter('')
    }

    return (
        <Modal show={show} onHide={onHide} centered role="dialog">
            <Modal.Header >
                <h3 className="text-center">Create request</h3>
            </Modal.Header>
            <Modal.Body className="justify-content-center align-items-center">
                <h4 className="text-center">Filter:</h4>
                <form className="filterForm">
                    <MDBInput
                        label="From"
                        name="from"
                        type="text"
                        value={filter.From}
                        onChange={(e) => {filter.setFrom(e.target.value)}}
                        autoComplete="nope"/>
                    <MDBInput
                        label="To"
                        name="Tto"
                        type="text"
                        value={filter.To}
                        onChange={(e) => {filter.setTo(e.target.value)}}
                        autoComplete="nope"/>
                    <MDBInput className="mb-0"
                              type="date"
                              validate
                              error="wrong"
                              success="right"
                              value={filter.dateFilter}
                              onChange={(e) => {filter.setDateFilter(e.target.value)}}
                    />
                    <FormControl required sx={{ m: 1, width: '-webkit-fill-available' }}>
                        <InputLabel id="typeTruck-label">Type truck</InputLabel>
                        <Select
                            labelId="typeTruck-label"
                            value={filter.typeTruckFilter}
                            label="Type truck *"
                            name="typeTruck"
                            onChange={(e) => {filter.setTypeTruckFilter(e.target.value)}}
                        >
                            {types.typesTruck.map(type =>
                                <MenuItem key={type.name} value={type.name}>{type.name}</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                    <FormControl required sx={{ m: 1, width: '-webkit-fill-available' }}>
                        <InputLabel id="adr-label">Type ADR</InputLabel>
                        <Select
                            labelId="adr-label"
                            value={filter.ADRFilter}
                            label="Type ADR *"
                            name="ADR"
                            onChange={(e) => {filter.setADRFilter(e.target.value)}}
                        >
                            {types.ADRs.map(type =>
                                <MenuItem key={type.name} value={type.name}>{type.name}</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                    <div className="text-center mb-2">
                        <Button variant={"brand"} onClick={onHide}>Show</Button>
                        <Button variant={"outline-secondary"} onClick={() => clear()}>Clear</Button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
});

export default Filter;