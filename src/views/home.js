import React from 'react'
import Map from '../components/map'

function Home() {

    // const [Circuit, setCircuit] = React.useState([])

    // React.useEffect(() => {
    //     fetch("https://ergast.com/api/f1/current/circuits.json")
    //     .then((res) => { return res.json() })
    //     .then((data) => {   
    //         setCircuit(data.MRData.CircuitTable.Circuits);
    //     })
    //     .catch((error) => { return console.log('error', error) });
    //   }, [])


    return (
        <div className="container">
            <Map />
        </div>
    )
}

export default Home