import React from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

class AutoComplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
    };
  }

  setAddress(address) {
    this.setState({ address: address });
  }

  async handleSelect(value) {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    this.props.setAddressAndDestinationCoordinates({
      address: value,
      destinationCoordinates: latLng,
    });
  }

  render() {
    return (
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.setAddress.bind(this)}
        onSelect={this.handleSelect.bind(this)}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: "Search Places ...",
                className: "location-search-input",
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion) => {
                const className = suggestion.active
                  ? "suggestion-item--active"
                  : "suggestion-item";
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: "#fafafa", cursor: "pointer" }
                  : { backgroundColor: "#ffffff", cursor: "pointer" };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  }
}

export default AutoComplete;
