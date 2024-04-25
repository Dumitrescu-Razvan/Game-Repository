import './App.css';
import React from 'react';
import VideoGameTable from './components/VideoGameTable';
import GameDetails from './components/GameDetails';
import AddGame from './components/AddGame';
import EditGame from './components/EditGame';
import CompanyTable from './components/CompanyTable'; 
import { Route, Routes, useLocation } from 'react-router-dom';


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
          <Route path='/company/:id' element={<h1>Company Details</h1>} />
          <Route path='/addcompany' element={<h1>Add Company</h1>} />
          <Route path='/editcompany/:id' element={<h1>Edit Company</h1>} />
          <Route path='*' element={<h1>Not Found</h1>} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
