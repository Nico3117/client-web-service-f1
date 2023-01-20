import React from 'react'
import Map from '../components/map'
import { IoIosAdd } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";

function Home() {

    const [name, setName] = React.useState(null)
    const [lat, setLat] = React.useState(null)
    const [long, setLong] = React.useState(null)

    const [modal, setModal] = React.useState(false)

    const token = localStorage.getItem('token');

    const addMarker = async (e) => {
        e.preventDefault()

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify({
                name: name,
                latitude: lat,
                longitude: long
            })
        };

        try {
            const response = await fetch('http://localhost:3000/api/circuit', requestOptions);
            if (response.status === 200) {
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
        }
    }

    const modalMarker = () => {
        if (modal) {
            setModal(false)
        } else {
            setModal(true)
        }
    }

    return (
        <div className='relative flex justify-center'>
            <Map token={token} />
            <div className='absolute bottom-10'>
                <IoIosAdd onClick={modalMarker} size={70} className={!modal ? "w-fit m-auto bg-white rounded-full shadow-md" : "hidden"} />
                <div className={modal ? "bg-white w-40 shadow-md rounded-md p-5" : "hidden"}>
                    <RxCross1 onClick={modalMarker} size={30} />
                    {
                        token ?
                            <form onSubmit={addMarker}>
                                <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl">
                                    <input className=" pl-2 w-full outline-none border-none" name="name" id="name" placeholder="Nom du circuit" onChange={e => setName(e.target.value)} />
                                </div>
                                <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl ">
                                    <input className="pl-2 w-full outline-none border-none" name="lat" id="lat" placeholder="Latitude" onChange={e => setLat(e.target.value)} />
                                </div>
                                <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl ">
                                    <input className="pl-2 w-full outline-none border-none" name="long" id="long" placeholder="Longitude" onChange={e => setLong(e.target.value)} />
                                </div>
                                <button type="submit" className="block w-full bg-indigo-600 mt-5 py-2 rounded-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2">Ajouter marker</button>
                            </form>
                            :
                            <p>Vous devez être connecté pour ajouter un marker</p>
                    }
                </div>
            </div>
        </div>
    )
}

export default Home