import './css/App.css';
import React from 'react'
import {Routes, Route} from 'react-router-dom';
import DisplayDeployed from './Components/DisplayDeployed';
import Header from './Components/Header';
import Deployer from './Components/Deployer';
import Elections from './Components/Elections';



function App() {

return(
  <>
  <Header/>
  
  <Routes className="App">
      <Route path= "/" element={<><Deployer /><DisplayDeployed/></>}/>
      <Route path= "/home" element={<Deployer />}/>
      <Route path= "/deployed" element={<DisplayDeployed/>}/>
      <Route path= "/contract/:addr" element={<Elections/>}/>  
  </Routes>
  </>
  );
}

export default App;
