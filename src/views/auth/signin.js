import React from 'react'
import { Link, useNavigate } from "react-router-dom";

function Signin() {

  const [email, setEmail] = React.useState(null)
  const [password, setPassword] = React.useState(null)

  const navigate = useNavigate();

  const HandleLogin = async (e) => {
    e.preventDefault()

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email,
          password: password
       })
      };
      
      try {
        const response = await fetch('http://localhost:3000/api/auth/login', requestOptions);
        const data = await response.json();
        console.log(data)
        localStorage.setItem('token', data.token);
        navigate('/')
      } catch (error) {
        console.error(error);
      }
  }

  return (
    <div className="container">
      <form className="w-full max-w-2xl mx-auto" onSubmit={HandleLogin}>
        <h1 className="text-gray-600 my-8 text-center text-xl font-bold">Connectez-vous</h1>
        <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl">
          <input id="email" className=" pl-2 w-full outline-none border-none" type="email" name="email" placeholder="Email" onChange={e=>setEmail(e.target.value)}/>
        </div>
        <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl ">
            <input className="pl-2 w-full outline-none border-none" type="password" name="password" id="password" placeholder="Mot de passe" onChange={e=>setPassword(e.target.value)}/>
        </div>
        <button type="submit" className="block w-full bg-indigo-600 mt-5 py-2 rounded-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2">Connexion</button>
        <div className="flex justify-between items-center mt-4">
          <Link to="/inscription">Pas de compte ?</Link>
        </div>
      </form> 
    </div>
  )
}

export default Signin