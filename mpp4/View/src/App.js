import './App.css';
import React from 'react';
import VideoGameTable from './components/VideoGameTable';
import GameDetails from './components/GameDetails';
import AddGame from './components/AddGame';
import EditGame from './components/EditGame';
import CompanyTable from './components/CompanyTable'; 
import { Routes, useLocation, Route } from 'react-router-dom';
import AddCompany from './components/AddCompany';
import EditCompany from './components/EditCompany';
import CompanyDetails from './components/CompanyDetails';
import Login from './components/Login';
import Register from './components/Register';
import UserTable from './components/UserTable';
import EditUser from './components/EditUser';
import { Navigate } from 'react-router-dom';
import { authToken } from './Service/Service';
import { useState } from 'react';

function App() {
  const location = useLocation();
  const [auth, setAuth] = useState(false);

  function ProtectedRoute({ element, ...rest }) {
    const _ = authToken().then((response) => {
      if(response === 'Authorized'){
        setAuth(true);
      }
      else{
        setAuth(false);
      }
    }
    ).catch((error) => {
      console.log(error);
      setAuth(false);
      return <Navigate to='/login' />
    });
    console.log(auth);
    if(auth){
      return element;
    }
    else{
      return <Navigate to='/login' />
    }
  }


  return (
    <div className="App"> 
      <header className="App-header">
        {
          location.pathname !== '/add' && location.pathname.indexOf('/edit') !== 0  && location.pathname.indexOf('/addcompany') !== 0 && location.pathname.indexOf('/editcompany') !== 0 &&
          <h1 className='title'>Video Game Ratings</h1>
        }
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/games' element={<ProtectedRoute element={<VideoGameTable />} />} />
          <Route path='/game/:id' element={<ProtectedRoute element={<GameDetails />} />} />
          <Route path='/add' element={<ProtectedRoute element={<AddGame />} />} />
          <Route path='/edit/:id' element={<ProtectedRoute element={<EditGame />} />} />
          <Route path='/companies' element={<ProtectedRoute element={<CompanyTable/>} />} />
          <Route path='/company/:id' element={<ProtectedRoute element={<CompanyDetails/>} />} />
          <Route path='/addcompany' element={<ProtectedRoute element={<AddCompany/>} />} />
          <Route path='/editcompany/:id' element={<ProtectedRoute element={<EditCompany/>} />} />
          <Route path='/users' element={<ProtectedRoute element={<UserTable/>} />} />
          {/* <Route path='/user/:id' element={<ProtectedRoute element={<UserDetails/>} />} /> */}
          <Route path='/edituser/:id' element={<ProtectedRoute element={<EditUser/>} />} />
          <Route path='*' element={<ProtectedRoute element={<h1>Not Found</h1>} />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
