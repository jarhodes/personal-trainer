import React from 'react';
import './App.css';
import CustomerList from './components/CustomerList';
import TrainingList from './components/TrainingList';
import PersistentDrawerLeft from './components/PersistentDrawerLeft';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import CustomerTrainingList from './components/CustomerTrainingList';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <PersistentDrawerLeft />

        <Switch>
          <Route exact path="/" component={CustomerList} />
          <Route path="/customer/:id" children={<CustomerTrainingList />} />
          <Route path="/training-sessions" component={TrainingList} />
          <Route render={() => <h1>Path not found</h1>} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
