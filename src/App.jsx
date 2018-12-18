// Module dependencies
import React from 'react';

// Components
import AutosuggestCustom from './components/AutosuggestCustom';
import Countries from './components/Countries';

import './App.css';

const App = () => (
  <div>
    <h2>Custom</h2>
    <AutosuggestCustom />
    <h2>Countries</h2>
    <Countries />
  </div>
);

// Module exports
export default App;
