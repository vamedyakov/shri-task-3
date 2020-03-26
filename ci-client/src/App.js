import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Start } from './components/Start/Start';
import { Settings } from './components/Settings/Settings';
import { History } from './components/History/History';
import { Details } from './components/Details/Details';
import './App.scss';


function App() {
  return (
    <Router>
      <div className="app
        app_color_project-default
        app_color_default
        app_space_default
        app_font_default
        app_size_default
        app_round_default
        app_gap_default">
        <Switch>
          <Route path='/' exact component={Start} />
          <Route path='/settings' exact component={Settings} />
          <Route path='/history' exact component={History} />
          <Route path='/build/:id' component={Details} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
