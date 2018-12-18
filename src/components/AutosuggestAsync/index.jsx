// Module dependencies
import axios from 'axios';
import React from 'react';
import Autosuggest from 'react-autosuggest';

// Get suggestion value
const getSuggestionValue = suggestion => suggestion.name;

// Render suggestion
const renderSuggestion = suggestion => <span>{suggestion.name}</span>;

// Cancel HTTP request
const makeRequestCreator = () => {
  let call;

  return (url) => {
    if (call) {
      call.cancel('Only one request allowed at a time.');
    }

    call = axios.CancelToken.source();

    return axios.get(url, {
      cancelToken: call.token,
    });
  };
};

// HTTP Get method
const get = makeRequestCreator();

// Component
class AutosuggestAsync extends React.Component {
  constructor() {
    super();

    // Initial state
    this.state = {
      isLoading: false,
      suggestions: [],
      value: '',
    };

    // Class properties
    this.lastRequestId = null;
  }

  // Controlled input handler
  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  // Update suggestion list
  onSuggestionsFetchRequested = async ({ value }) => {
    // Variables
    const baseURL = 'https://restcountries.eu/rest/v2';

    // Set loading status
    this.setState({
      isLoading: true,
    });

    // Get country list
    try {
      // Fetch data
      const response = await get(`${baseURL}/name/${value}?fields=name`);

      // Update state
      this.setState({
        isLoading: false,
        suggestions: response.data,
      });
    } catch (error) {
      // Cancelled requests
      if (axios.isCancel(error)) {
        console.error(`Cancelling previous request: ${error.message}`);
      }
    }
  };

  // Clear suggestion list
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  // Render component
  render() {
    // Variables
    const { value, suggestions, isLoading } = this.state;
    const status = isLoading ? 'Loading...' : 'Type to load suggestions';
    const inputProps = {
      onChange: this.onChange,
      placeholder: 'Country name',
      type: 'text',
      value,
    };

    // View
    return (
      <div className="searchbox">
        <div className="status">
          <strong>Status:</strong>
          {' '}
          {status}
        </div>
        <Autosuggest
          getSuggestionValue={getSuggestionValue}
          inputProps={inputProps}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          renderSuggestion={renderSuggestion}
          suggestions={suggestions}
        />
      </div>
    );
  }
}

// Module exports
export default AutosuggestAsync;
