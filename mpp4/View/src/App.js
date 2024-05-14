import './App.css';
import React from 'react';
import VideoGameTable from './components/VideoGameTable';
import GameDetails from './components/GameDetails';
import AddGame from './components/AddGame';
import EditGame from './components/EditGame';
import CompanyTable from './components/CompanyTable'; 
import { Route, Routes, useLocation } from 'react-router-dom';
import AddCompany from './components/AddCompany';
import EditCompany from './components/EditCompany';
import CompanyDetails from './components/CompanyDetails';


function App() {
  const location = useLocation();


  return (
    <div className="App"> 
      <header className="App-header">
        {
          location.pathname !== '/add' && location.pathname.indexOf('/edit') !== 0  && location.pathname.indexOf('/addcompany') !== 0 && location.pathname.indexOf('/editcompany') !== 0 &&
          <h1 className='title'>Video Game Ratings</h1>
        }
        <Routes>
          <Route path='/' element={<VideoGameTable />} />
          <Route path='/game/:id' element={<GameDetails />} />
          <Route path='/add' element={<AddGame />} />
          <Route path='/edit/:id' element={<EditGame />} />
          <Route path='/companies' element={<CompanyTable/>} />
          <Route path='/company/:id' element={<CompanyDetails/>} />
          <Route path='/addcompany' element={<AddCompany/>} />
          <Route path='/editcompany/:id' element={<EditCompany/>} />
          <Route path='*' element={<h1>Not Found</h1>} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
