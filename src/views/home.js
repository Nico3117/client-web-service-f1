import React from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';

function Home() {

    const [Circuit, setCircuit] = React.useState([])

    React.useEffect(() => {
        fetch("https://ergast.com/api/f1/current/circuits.json")
        .then((res) => { return res.json() })
        .then((data) => {   
            setCircuit(data.MRData.CircuitTable.Circuits);
        })
        .catch((error) => { return console.log('error', error) });
      }, [])

    let DefaultIcon = L.icon({
        iconUrl: icon,
        iconSize: [24,36],
        iconAnchor: [12,36]
    });

    L.Marker.prototype.options.icon = DefaultIcon;

    return (
        <div className="container">
            <MapContainer style={{ width: "900px", height: "600px" }} className="mx-auto mt-10" center={[46.63728, 2.3382623]} zoom={4}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {
                    Circuit.map(circuit => 
                        <Marker position={[circuit.Location.lat, circuit.Location.long]}>
                            <Popup>
                                {circuit.circuitName}
                            </Popup>
                        </Marker>
                    )
                }
            </MapContainer>
        </div>
    )
}

export default Home