import React from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { MdDelete } from 'react-icons/md';
import { BsFillPencilFill } from 'react-icons/bs';

function MapGoogle(props) {

  const [Circuit, setCircuit] = React.useState([])

  const [OwnCircuit, setOwnCircuit] = React.useState([])
  const [position, setPosition] = React.useState({
    lat: 46.227638,
    lng: 2.213749
  })

  const [selectedCenter, setSelectedCenter] = React.useState(null);
  const [selectedCircuit, setSelectedCircuit] = React.useState(null);

  const [updateCircuit, setUpdateCircuit] = React.useState(false);
  const [name, setName] = React.useState(null)
  const [lat, setLat] = React.useState(null)
  const [long, setLong] = React.useState(null)

  const [zoom, setZoom] = React.useState(4)
  const mapRef = React.useRef(null)

  const containerStyle = {
    width: '100%',
    height: '100vh'
  }

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

  const DeleteMarker = (id) => {
    const request = new Request(`http://localhost:3000/api/circuit/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': props.token,
      }
    });

    fetch(request)
      .then(response => {
        if (response.ok) {
          window.location.reload();
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    UpdateMarker(e, selectedCircuit._id);
  }

  const UpdateMarker = (e, id) => {
    e.preventDefault()
    const request = new Request(`http://localhost:3000/api/circuit/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': props.token,
      },
      body: JSON.stringify({
        name: name,
        latitude: lat,
        longitude: long
    })
    });

    fetch(request)
      .then(response => {
        if (response.ok) {
          window.location.reload();
        }
      })
      .catch(error => {
        console.error(error);
      });
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
    const requestOptions = {
      headers: {
        'x-access-token': props.token
      },
    };
    fetch("http://localhost:3000/api/circuit", requestOptions)
      .then((res) => { if (res.status === 200) { return res.json() } })
      .then((data) => {
        setOwnCircuit(data);
      })
      .catch((error) => { return console.log('error', error) });
  }, [props.token])

  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} center={position} zoom={zoom} onLoad={handleLoad} onDragEnd={handleCenter}>
      {
        Circuit.map(circuit => {
          return (
            <>
              <Marker key={circuit.circuitId} position={{
                lat: parseFloat(circuit.Location.lat),
                lng: parseFloat(circuit.Location.long)
              }}
                onClick={() => { setSelectedCenter(circuit) }}
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
                    <h2>{selectedCenter.circuitName}</h2>
                    <p>Latitude : {selectedCenter.Location.lat}</p>
                    <p>Longitude : {selectedCenter.Location.long}</p>
                    <a href={selectedCenter.url} target="_blank" rel="noreferrer"><span>Info</span></a>
                  </div>
                </InfoWindow>
              )}
            </>
          )
        })
      }
      {OwnCircuit ?
        OwnCircuit.map(newcircuit => {
          return (
            <>
              <Marker key={newcircuit._id} position={{
                lat: parseFloat(newcircuit.latitude),
                lng: parseFloat(newcircuit.longitude)
              }} icon='http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                onClick={() => { setSelectedCircuit(newcircuit) }}
              />
              {selectedCircuit && (
                <InfoWindow
                  onCloseClick={() => {
                    setSelectedCircuit(null);
                    setUpdateCircuit(false)
                  }}
                  position={{
                    lat: parseFloat(selectedCircuit.latitude),
                    lng: parseFloat(selectedCircuit.longitude)
                  }}
                >
                  <div className="markerInfo">
                    <h2>{selectedCircuit.name}</h2>
                    <p>Latitude : {selectedCircuit.latitude}</p>
                    <p>Longitude : {selectedCircuit.longitude}</p>
                    <div className={!updateCircuit ? "flex" : "hidden"}>
                      <MdDelete className="cursor-pointer" onClick={() => DeleteMarker(selectedCircuit._id)} size={30} />
                      <BsFillPencilFill className="cursor-pointer"  onClick={() => setUpdateCircuit(true)}   size={25} />
                    </div>
                    {
                      updateCircuit &&  
                      <form onSubmit={handleSubmit}>
                        <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl">
                            <input className=" pl-2 w-full outline-none border-none" name="name" id="name" placeholder="Nom du circuit" onChange={e => setName(e.target.value)} />
                        </div>
                        <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl ">
                            <input className="pl-2 w-full outline-none border-none" name="lat" id="lat" placeholder="Latitude" onChange={e => setLat(e.target.value)} />
                        </div>
                        <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl ">
                            <input className="pl-2 w-full outline-none border-none" name="long" id="long" placeholder="Longitude" onChange={e => setLong(e.target.value)} />
                        </div>
                        <button type="submit" className="block w-full bg-indigo-600 mt-5 py-2 rounded-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2">Modifier marker</button>
                    </form>
                    }

                  </div>
                </InfoWindow>
              )}
            </>
          )
        })
        :
        <></>
      }
    </GoogleMap>
  ) : <></>
}

export default MapGoogle