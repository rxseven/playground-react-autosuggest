// Module dependencies
import axios from 'axios';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import React from 'react';
import Autosuggest from 'react-autosuggest';

// Regex
const escapeCharacters = input => input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Filter list
const filterList = (list, keys, term) =>
  list.filter(item =>
    keys.some(key =>
      String(item[key])
        .toLowerCase()
        .includes(term.toLowerCase())
    )
  );

// Calculate suggestions for any given input value
const getSuggestions = (currencies, value) => {
  // Format input value
  const escapedValue = escapeCharacters(value.trim());

  // Return an empty list
  if (escapedValue === '') {
    return [];
  }

  // Return matched suggestions
  return filterList(currencies, ['code', 'name'], escapedValue);
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
      <strong className="code">{suggestion.code}</strong>
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
      currencies: [],
      loading: false,
      rate: 0,
      suggestions: [],
      value: ''
    };
  }

  componentDidMount() {
    // Get currency list
    this.getCurrencies();
  }

  // Get currency list
  getCurrencies = async () => {
    // Set loading status
    this.setState({ loading: true });

    // API request
    const response = await axios.get('http://localhost:5000/api/v1/currencies');

    // Retrieve data in a response and transform to an appropriate format
    const currencies = response.data;

    // Update state
    this.setState({ currencies, loading: false });
  };

  // Get conversion rate
  getRate = async (amount, from, to) => {
    // API request
    const response = await axios.get('http://localhost:5000/api/v1/rate', {
      params: {
        amount,
        from,
        to
      }
    });

    // Retrieve data in a response and transform to an appropriate format
    const { countries, rate } = response.data;

    // Update state
    this.setState({ countries, rate });
  };

  // onChange handler
  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  // When suggestion is selected via mouse or keyboard
  onSuggestionSelected = (event, { suggestion, suggestionValue }) => {
    console.log('onSuggestionSelected - suggestion - ', suggestion);
    console.log('onSuggestionSelected - suggestionValue -', suggestionValue);

    this.getRate(1, 'usd', suggestion.code);
  };

  // Update suggestion list
  // This function will be called every time, it might need to update suggestions
  onSuggestionsFetchRequested = ({ value }) => {
    // Variables
    const { currencies } = this.state;

    // Update state
    this.setState({
      suggestions: getSuggestions(currencies, value)
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
    const { countries, loading, rate, value, suggestions } = this.state;

    // Controlled input component
    const inputProps = {
      disabled: loading,
      onChange: this.onChange,
      placeholder: loading ? 'Loading...' : 'Currency name',
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
            onSuggestionSelected={this.onSuggestionSelected}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            renderSuggestion={renderSuggestion}
            shouldRenderSuggestions={this.shouldRenderSuggestions}
            suggestions={suggestions}
          />
        </div>
        <div>
          <div>Rate: {rate}</div>
          {!!countries && (
            <ul>
              {countries.map(country => (
                <li key={country.code}>
                  <img
                    alt={country.name}
                    src={`https://www.countryflags.io/${
                      country.code
                    }/flat/16.png`}
                  />
                  <span>{country.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </React.Fragment>
    );
  }
}

// Module exports
export default AutosuggestPreload;
