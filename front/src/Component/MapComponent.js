// import AppRouter from "./AppRouter";
//
// class MapComponent extends React.Component {
//     state = {
//         places: []
//     };
//
//     addMarker(e) {
//         const newPlace = { id: this.state.places.length, lat: e.latLng.lat(), lng: e.latLng.lng() };
//         this.setState({
//             places: [...this.state.places,newPlace]
//         })
//     }
//
//     return (
//         <GoogleMap
//             onClick={this.addMarker.bind(this)}
//             defaultZoom={this.props.zoom}
//             defaultCenter={this.props.center}
//         >
//             {this.state.places.map(place => {
//                 return (
//                     <Marker
//                         key={place.id}
//                         position={{ lat: place.lat, lng: place.lng }}
//                     />
//                 );
//             })}
//         </GoogleMap>
//     );
// }
//
// export default MapComponent;