import React from 'react'
import { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

function MapGoogle() {

  const [Circuit, setCircuit] = React.useState([])
  
  React.useEffect(() => {
    fetch("https://ergast.com/api/f1/current/circuits.json")
    .then((res) => { return res.json() })
    .then((data) => {   
        setCircuit(data.MRData.CircuitTable.Circuits);
    })
    .catch((error) => { return console.log('error', error) });
  }, [])

  const [selectedCenter, setSelectedCenter] = useState(null);

  const containerStyle = {
    width: '800px',
    height: '800px'
  };
  
  const france = {
    lat: 46.63728,
    lng: 2.3382623
  };

  const api_key = process.env.REACT_APP_API_GOOGLE_MAP;
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: api_key
  })

  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} center={france} zoom={4}>
      {
        Circuit.map(circuit => {
            return (
              <div key={circuit.circuitId}>
                <Marker 
                position={{
                  lat: parseFloat(circuit.Location.lat), 
                  lng: parseFloat(circuit.Location.long)
                }}
                onClick={
                  () => {
                    setSelectedCenter(circuit);
                }}
                />

                {selectedCenter && (
                  <InfoWindow
                      onCloseClick={() => {
                        setSelectedCenter(null);
                      }}      
                      position={{
                        lat: parseFloat(selectedCenter.Location.lat),
                        lng: parseFloat(selectedCenter.Location.long)
                      }}
                  >
                    <div className="markerInfo">
                      <h1>{selectedCenter.circuitName}</h1>
                      <p>Latitude : {selectedCenter.Location.lat}</p>
                      <p>Longitude : {selectedCenter.Location.long}</p>
                      <a href={selectedCenter.url} target="_blank"><span>Info</span></a>

                    </div>
                  </InfoWindow>
                )}
              </div>
            )
        })
      }
    </GoogleMap>
  ) : <></>
}

export default MapGoogle