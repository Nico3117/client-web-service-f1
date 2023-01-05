import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/home';
import Sidebar from './components/sidebar';
import Signup from './views/auth/signup';
import Signin from './views/auth/signin';

function App() {
  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path='/'>
          <Route index element={<Home />}/>
          <Route path='connexion' element={<Signin />}/>
          <Route path='inscription' element={<Signup />}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
