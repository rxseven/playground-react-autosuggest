// Module dependencies
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import React from 'react';
import Autosuggest from 'react-autosuggest';

import countries from '../../data/countries';

// Suggestion list
const dummy = countries;

// Regex
const escapeCharacters = input => input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Calculate suggestions for any given input value
const getSuggestions = (value) => {
  // Format input value
  const escapedValue = escapeCharacters(value.trim());

  // Return an empty list
  if (escapedValue === '') {
    return [];
  }

  // Regex
  const regex = new RegExp(`^${escapedValue}`, 'i');

  // Return matched suggestions
  return dummy.filter(item => regex.test(item.name));
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
      {parts.map((part, index) => {
        // Variables
        const className = part.highlight ? 'highlight' : null;

        // View
        return (
          <span className={className} key={index}>
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
      </span>
      {' '}
      <strong className="code">{suggestion.code}</strong>
    </span>
  );
};

// Component
class AutosuggestCustom extends React.Component {
  // Constructor
  constructor() {
    super();

    // Initial state
    this.state = {
      suggestions: [],
      value: '',
    };
  }

  // onChange handler
  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  // Update suggestion list
  // This function will be called every time, it might need to update suggestions
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value),
    });
  };

  // Clear suggestion list
  // This function will be called every time, it needs to clear suggestions
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  // Select suggestion
  // This function is called when suggestion is selected
  onSuggestionSelected = (
    event,
    {
      suggestion, suggestionValue, suggestionIndex, sectionIndex, method,
    },
  ) => {
    console.log('onSuggestionSelected');
    console.log('suggestion:', suggestion);
    console.log('suggestionValue:', suggestionValue);
    console.log('suggestionIndex:', suggestionIndex);
    console.log('sectionIndex:', sectionIndex);
    console.log('method:', method);
  };

  // Highlighted suggestion changes
  // This function is called when the highlighted suggestion changes
  onSuggestionHighlighted = ({ suggestion }) => {
    console.log('onSuggestionHighlighted');
    console.log('suggestion:', suggestion);
  };

  // Display suggestions only when input value is at least 1 characters long
  // By default, suggestions are rendered when the input isn't blank
  shouldRenderSuggestions = value => value.trim().length > 0;

  // Render component
  render() {
    // Variables
    const { value, suggestions } = this.state;

    // Controlled input component
    const inputProps = {
      onChange: this.onChange,
      placeholder: 'Country name',
      type: 'text',
      value,
    };

    // View
    return (
      <div className="searchbox">
        <Autosuggest
          focusInputOnSuggestionClick
          getSuggestionValue={getSuggestionValue}
          highlightFirstSuggestion={false}
          inputProps={inputProps}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionHighlighted={this.onSuggestionHighlighted}
          onSuggestionSelected={this.onSuggestionSelected}
          renderSuggestion={renderSuggestion}
          shouldRenderSuggestions={this.shouldRenderSuggestions}
          suggestions={suggestions}
        />
      </div>
    );
  }
}

// Module exports
export default AutosuggestCustom;
