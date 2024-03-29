import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineHome, AiOutlineUser, AiOutlineMenu, AiOutlineClose, AiOutlineLogout } from 'react-icons/ai';

function Sidebar() {

    const [Open, setOpen] = React.useState(true);

    const navigate = useNavigate();

    const OpenSidebar = () => {
        if (Open === true) {
            setOpen(false)
        } else {
            setOpen(true)
        }
    }

    const LogOut = () => {
        localStorage.removeItem('token');
        navigate('/')
        OpenSidebar()
        window.location.reload();
    }

    const token = localStorage.getItem('token');

    return (
        <>
            <div className="w-full bg-dark h-20 flex items-center pl-6 absolute z-10 fixed top-0">
                <AiOutlineMenu onClick={OpenSidebar} className="text-white" size={30} />
            </div>
            <div className={"flex flex-col text-gray-800 " + (Open ? "hidden" : "")}>
                <div className="fixed flex flex-col top-0 left-0 w-64 bg-dark h-full shadow-lg z-10">
                    <div className="h-20 flex items-center pl-6">
                        <AiOutlineClose onClick={OpenSidebar} className="text-white" size={30} />
                    </div>
                    <ul className="flex flex-col py-6">
                        <li className="px-5 h-11 flex items-center">
                            <div className="font-semibold text-sm text-gray-300 uppercase">Tableau de bord</div>
                        </li>
                        <li className="h-11 flex items-center">
                            <Link to='/' onClick={OpenSidebar} className="flex h-full pl-5 w-full items-center focus:outline-none hover:bg-gray-700 text-gray-500 hover:text-gray-200 border-l-4 border-transparent hover:border-blue-500">
                                <AiOutlineHome />
                                <span className="ml-2 font-semibold text-sm">Accueil</span>
                            </Link>
                        </li>
                        <li className="px-5 h-11 flex items-center">
                            <div className="font-semibold text-sm text-gray-300 uppercase">Paramètres</div>
                        </li>
                        {
                            token ?
                                <li className="h-11 flex items-center">
                                    <div onClick={LogOut} className="cursor-pointer flex h-full pl-5 w-full items-center focus:outline-none hover:bg-gray-700 text-gray-500 hover:text-gray-200 border-l-4 border-transparent hover:border-blue-500">
                                        <AiOutlineLogout />
                                        <span className="ml-2 font-semibold text-sm">Déconnexion</span>
                                    </div>
                                </li>
                                :
                                <li className="h-11 flex items-center">
                                    <Link to='/connexion' onClick={OpenSidebar} className="flex h-full pl-5 w-full items-center focus:outline-none hover:bg-gray-700 text-gray-500 hover:text-gray-200 border-l-4 border-transparent hover:border-blue-500">
                                        <AiOutlineUser />
                                        <span className="ml-2 font-semibold text-sm">Se connecter</span>
                                    </Link>
                                </li>
                        }
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Sidebar