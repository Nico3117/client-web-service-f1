import React from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'

function MapGoogle(props) {

  const [Circuit, setCircuit] = React.useState([])
  const [OwnCircuit, setOwnCircuit] = React.useState([])
  const [position, setPosition] = React.useState({
    lat: 46.63728,
    lng: 2.3382623
  });
  const [zoom, setZoom] = React.useState(4)
  const mapRef = React.useRef(null)

  const containerStyle = {
    width: '100%',
    height: '100vh'
  }

  const requestOptions = {
    headers: {
      'x-access-token': props.token
    },
  };

  const api_key = process.env.REACT_APP_API_GOOGLE_MAP

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: api_key
  })

  const handleLoad = (map) => {
    mapRef.current = map;
  }

  const handleCenter = () => {
    if (!mapRef.current) return;

    const newPos = mapRef.current.getCenter().toJSON();
    const newZoom = mapRef.current.getZoom();

    setPosition(newPos);
    setZoom(newZoom)
  }

  React.useEffect(() => {
    fetch("https://ergast.com/api/f1/current/circuits.json")
      .then((res) => { return res.json() })
      .then((data) => {
        setCircuit(data.MRData.CircuitTable.Circuits);
      })
      .catch((error) => { return console.log('error', error) });
  }, [])

  React.useEffect(() => {
    fetch("http://localhost:3000/api/circuit", requestOptions)
      .then((res) => { return res.json() })
      .then((data) => {
        setOwnCircuit(data);
      })
      .catch((error) => { return console.log('error', error) });
  }, [])

  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} center={position} zoom={zoom} onLoad={handleLoad} onDragEnd={handleCenter}>
      {
        Circuit.map(circuit => {
          return (
            <div key={circuit.circuitId}>
              <Marker position={{
                lat: parseFloat(circuit.Location.lat),
                lng: parseFloat(circuit.Location.long)
              }} />
            </div>
          )
        })
      }
      {
        OwnCircuit.map(newcircuit => {
          return (
            <div key={newcircuit._id}>
              <Marker position={{
                lat: parseFloat(newcircuit.latitude),
                lng: parseFloat(newcircuit.longitude)
              }} icon='http://maps.google.com/mapfiles/ms/icons/blue-dot.png' />
            </div>
          )
        })
      }
    </GoogleMap>
  ) : <></>
}

export default MapGoogle