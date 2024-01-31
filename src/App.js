import React from 'react';


import './App.css';
import Form from './components/Form';
import AuthCluster from './AuthCluster';

function App() {
  return (
    <div className="App">
      <h1 id='head'>PropFlow</h1>
      <AuthCluster />
      <center><Form></Form></center>
    </div>
  );
}

export default App;
