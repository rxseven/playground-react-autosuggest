// Module dependencies
import axios from 'axios';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import React from 'react';
import Autosuggest from 'react-autosuggest';

// Regex
const escapeCharacters = input => input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Calculate suggestions for any given input value
const getSuggestions = (countries, value) => {
  // Format input value
  const escapedValue = escapeCharacters(value.trim());

  // Return an empty list
  if (escapedValue === '') {
    return [];
  }

  // Regex
  const regex = new RegExp(`^${escapedValue}`, 'i');

  // Return matched suggestions
  return countries.filter(item => regex.test(item.name));
};

// Get suggestion value
// When user navigates the suggestions using the Up and Down keys,
// the input value should be set according to the highlighted suggestion
const getSuggestionValue = suggestion => suggestion.name;

// Render suggestion
// Define how suggestions are rendered
const renderSuggestion = (suggestion, { query }) => {
  // Variables
  const matches = match(suggestion.name, query);
  const parts = parse(suggestion.name, matches);

  const name = (
    <span className="name">
      {parts.map(part => {
        // Variables
        const className = part.highlight ? 'highlight' : null;

        // View
        return (
          <span className={className} key={part.text}>
            {part.text}
          </span>
        );
      })}
    </span>
  );

  return (
    <span className="item">
      <span>
        <span className="icon" />
        {name}
      </span>{' '}
      <strong className="code">{suggestion.alpha2Code}</strong>
    </span>
  );
};

// Component
class AutosuggestPreload extends React.Component {
  // Constructor
  constructor() {
    super();

    // Initial state
    this.state = {
      countries: [],
      loading: false,
      suggestions: [],
      value: ''
    };
  }

  componentDidMount() {
    // Get country list
    this.getCountries();
  }

  // Get country list
  getCountries = async () => {
    // Set loading status
    this.setState({ loading: true });

    // API request
    const response = await axios.get('https://restcountries.eu/rest/v2/all');

    // Update state
    this.setState({ countries: response.data, loading: false });
  };

  // onChange handler
  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  // Update suggestion list
  // This function will be called every time, it might need to update suggestions
  onSuggestionsFetchRequested = ({ value }) => {
    // Variables
    const { countries } = this.state;

    // Update state
    this.setState({
      suggestions: getSuggestions(countries, value)
    });
  };

  // Clear suggestion list
  // This function will be called every time, it needs to clear suggestions
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  // Display suggestions only when input value is at least 1 characters long
  // By default, suggestions are rendered when the input isn't blank
  shouldRenderSuggestions = value => value.trim().length > 0;

  // Render component
  render() {
    // Variables
    const { loading, value, suggestions } = this.state;

    // Controlled input component
    const inputProps = {
      disabled: loading,
      onChange: this.onChange,
      placeholder: loading ? 'Loading...' : 'Country name',
      type: 'text',
      value
    };

    // View
    return (
      <React.Fragment>
        <div className="status">
          <strong>HTTP status: </strong>
          {loading ? 'Loading...' : 'Done'}
        </div>
        <div className="searchbox">
          <Autosuggest
            focusInputOnSuggestionClick
            getSuggestionValue={getSuggestionValue}
            highlightFirstSuggestion={false}
            inputProps={inputProps}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            renderSuggestion={renderSuggestion}
            shouldRenderSuggestions={this.shouldRenderSuggestions}
            suggestions={suggestions}
          />
        </div>
      </React.Fragment>
    );
  }
}

// Module exports
export default AutosuggestPreload;
