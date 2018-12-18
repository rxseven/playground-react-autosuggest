// Module dependencies
import axios from 'axios';
import React from 'react';

// Component
class Countries extends React.Component {
  // Constructor
  constructor() {
    super();

    // Initial state
    this.state = {
      countries: [],
      loading: false,
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

  // Render country list
  renderList = data => data.map(country => (
    <div key={country.alpha3Code}>
      <h5>{country.name}</h5>
      <img alt={country.name} height="50" src={country.flag} />
    </div>
  ));

  // Render component
  render() {
    // Variables
    const { countries, loading } = this.state;

    // View
    return (
      <div>
        {countries.length === 0 && loading ? (
          <div>Loading...</div>
        ) : (
          <div>{this.renderList(countries)}</div>
        )}
      </div>
    );
  }
}

// Module exports
export default Countries;
