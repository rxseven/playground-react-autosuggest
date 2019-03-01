// Module dependencies
import React from 'react';

// Components
import AutosuggestCustom from './components/AutosuggestCustom';
import AutosuggestAsync from './components/AutosuggestAsync';
import AutosuggestPreload from './components/AutosuggestPreload';
import AutosuggestCurrency from './components/AutosuggestCurrency';
import Countries from './components/Countries';

import './App.css';

const App = () => (
  <div>
    <h1>React Autosuggest</h1>
    <h2>Custom</h2>
    <AutosuggestCustom />
    <h2>Asynchronous</h2>
    <AutosuggestAsync />
    <h2>Preload</h2>
    <AutosuggestPreload />
    <h2>Currency</h2>
    <AutosuggestCurrency />
    <h2>Countries</h2>
    <Countries />
  </div>
);

// Module exports
export default App;
