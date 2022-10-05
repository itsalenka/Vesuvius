import React, {useContext, useEffect, useRef, useState} from 'react';
import {Col, Container, Row, Spinner} from "react-bootstrap";
import GoogleMapReact from 'google-map-react';
import MapComponent from "../Component/MapComponent";

const Map = () => {
    // const {location} = useContext(Context)
    const [points, setPoints] = useState([])
    const ws = new WebSocket('wss://ten:5000')
    useEffect( () => {
        ws.onmessage = (e) => {
            console.log('e.data ' + e.data)
            if (e.data) {
                let data = JSON.parse(e.data)
                let arr = points;
                var foundIndex = arr.findIndex(x => x.id == data.id);
                if (foundIndex != -1)
                    arr[foundIndex] = data;
                else
                    arr.push(data)
                console.log('arr ' + arr)
                setPoints(arr)
                console.log('-' + points)
            }
        }
    })

    const [center, setCenter] = useState({lat: 53.8362049, lng: 27.5796115 });
    const [zoom, setZoom] = useState(4);

    return (
        <Container fluid className="p-1">
            <p>show map</p>
            {/*{points.map(({id, lat, lng}, key) =>*/}
            {/*    <h1>{lat} -  {lng} {id}</h1>*/}
            {/*    )}*/}

            <div style={{ height: '100vh', width: '100%' }}>
                {/*<GoogleMapReact*/}
                {/*    bootstrapURLKeys={{ key: 'AIzaSyCGxjkgFHGCJnDRqa3C-0yh02lZvwrtTSw',language: 'en' }}*/}
                {/*    defaultCenter={center}*/}
                {/*    defaultZoom={zoom}*/}
                {/*>*/}
                {/*    {points.map(({id, lat, lng}, key) =>*/}
                {/*    {*/}
                {/*        return (*/}
                {/*        <Marker*/}
                {/*            key={id}*/}
                {/*            // position={{ lat: 53.8362049, lng: 27.5796115 }}*/}
                {/*            name={id} color='red'*/}
                {/*                lat={lat}*/}
                {/*                lng={lng}*/}
                {/*                // name="My Marker"*/}
                {/*                // color="blue"*/}
                {/*        ></Marker>*/}
                {/*        )})}*/}
                    {/*<Marker*/}
                    {/*    // lat={lat} lng={lng} name={id} color='red'*/}
                    {/*    lat={53.8362049}*/}
                    {/*    lng={27.5796115}*/}
                    {/*    name="i"*/}
                    {/*    color="red"*/}
                    {/*></Marker>*/}
                    {/*)}*/}
                    {/*<Marker*/}
                    {/*    lat={11.0168}*/}
                    {/*    lng={76.9558}*/}
                    {/*    name="My Marker"*/}
                    {/*    color="blue"*/}
                    {/*/>*/}
                {/*</GoogleMapReact>*/}
                {/*<MapComponent*/}
                {/*    googleMapURL="https://maps.googleapis.com/maps/api/js?"*/}
                {/*    loadingElement={<div style={{ height: `100%` }} />}*/}
                {/*    containerElement={<div style={{ height: `400px` }} />}*/}
                {/*    mapElement={<div style={{ height: `100%` }} />}*/}
                {/*    center={{ lat: -33.8665433, lng: 151.1956316 }}*/}
                {/*    zoom={3}*/}
                {/*/>*/}
            </div>
            {/*{points.map(({id, latitude, longitude}, key) => <h1 key={key}>{id} {latitude} {longitude}</h1>)}*/}
        </Container>
    );
};

export default Map;