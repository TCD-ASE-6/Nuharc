import { Component } from "react";

// HERE API key
const API_KEY = "Z9irXJBDz_jDcLwmi-1WwTBdSTQmBci1wB9QqTzwZMY";
// Initial latitude to center the map on Dublin
const DUBLIN_LAT = 53.34460864423722;
// Initial longitude to center the map on Dublin
const DUBLIN_LNG = -6.276456570972608;
// Initial zoom factor of the map
const INITIAL_ZOOM = 13;
// Transport mode for the HERE map API
const TRANSPORT_MODE = "pedestrian";
// Routing mode for the HERE map API
const ROUTING_MODE = "fast";
// Routing mode for the HERE map API
const AUTOCOMPLETE_COUNTRY_CODE = "IRL";
// Max retrieved results for autocompletion
const AUTOCOMPLETE_MAX_RESULTS = 5;
// Element Id of the search suggestions
const SEARCH_SUGGESTIONS_ID = "searchSuggestionsId";
// Element Id of the search suggestions
const SEARCH_BAR_ID = "searchBarId";
// Element Id of the destination span
const DESTINATION_SPAN_ID = "destinationSpanId";

class AutoComplete extends Component {
  autocompleteRequest = new XMLHttpRequest();
  constructor(props) {
    super(props);
    this.state = {
      map: null,
      currentCoordinates: {
        lat: DUBLIN_LAT,
        lng: DUBLIN_LNG,
      },
      destinationCoordinates: {
        lat: 53.35600864423722,
        lng: -6.256456570972608,
      },
      incidents: { incidentList: [] },
      address: "",
      router: null,
    };
    this.onSearchBarKeyUp = this.onSearchBarKeyUp.bind(this);
    this.onAutoCompleteSuccess = this.onAutoCompleteSuccess.bind(this);
  }

  componentDidMount() {
    this.autocompleteRequest.addEventListener(
      "load",
      this.onAutoCompleteSuccess
    );
    this.autocompleteRequest.addEventListener(
      "error",
      this.onAutoCompleteFailure
    );
    this.autocompleteRequest.responseType = "json";
  }

  /**
   *
   * @param {*} searchString
   */
  autocomplete(searchString) {
    let params =
      "?query=" +
      searchString +
      "&apiKey=" +
      API_KEY +
      "&maxresults=" +
      AUTOCOMPLETE_MAX_RESULTS +
      "&country=" +
      AUTOCOMPLETE_COUNTRY_CODE +
      "&beginHighlight=<strong>" +
      "&endHighlight=</strong>";

    this.autocompleteRequest.open(
      "GET",
      "https://autocomplete.geocoder.ls.hereapi.com/6.2/suggest.json" + params
    );
    this.autocompleteRequest.send();
  }

  /**
   *
   * @param {*} event details of the occurred event
   */
  onAutoCompleteSuccess(event) {
    let searchSuggestions = document.getElementById(SEARCH_SUGGESTIONS_ID);
    //remove all old suggestions from the list
    searchSuggestions.innerHTML = "";
    //now add the new suggestions
    try {
      for (const suggestion of event.target.response.suggestions) {
        let suggestionElement = document.createElement("li");
        suggestionElement.innerHTML = suggestion.label;
        suggestionElement.classList.add("autosuggestElement");
        suggestionElement.onclick = () => {
          searchSuggestions.innerHTML = "";
          let lookupRequest = new XMLHttpRequest();
          lookupRequest.addEventListener("load", (event) => {
            //unpack response from HERE API which is very complicated for some reason
            let responseArr = JSON.parse(event.target.response).response.view;
            if (responseArr.length > 0) {
              let innerArr = responseArr[0].result;
              if (innerArr.length > 0) {
                document.getElementById(SEARCH_BAR_ID).value =
                  innerArr[0].location.address.label;
                document.getElementById(DESTINATION_SPAN_ID).innerHTML =
                  innerArr[0].location.address.label;
                let destLat = innerArr[0].location.displayPosition.latitude;
                let destLng = innerArr[0].location.displayPosition.longitude;
                // this.props.setState({
                //   destinationCoordinates: {
                //     lat: destLat,
                //     lng: destLng,
                //   },
                // });
                this.props.updateLocation({
                  lat: destLat,
                  lng: destLng,
                });
                // console.log(this.props.state.destinationCoordinates);
              }
            }
          });
          let params =
            "?locationid=" +
            suggestion.locationId +
            "&jsonattributes=1" +
            "&apiKey=" +
            API_KEY;
          lookupRequest.open(
            "GET",
            "https://geocoder.ls.hereapi.com/6.2/geocode.json" + params
          );
          lookupRequest.send();
        };

        //add the created element to the list
        searchSuggestions.appendChild(suggestionElement);
      }
    } catch (TypeError) {
      //do nothing
    }
  }

  /**
   * Callback when the autocomplete fails
   *
   */
  onAutoCompleteFailure() {
    //TODO: add failure handling
    console.log("autocomplete failed");
  }

  /**
   * Callback when the user types in the searchbar
   *
   * @param {*} event details of the occurred event
   */
  onSearchBarKeyUp(event) {
    this.autocomplete(event.target.value);
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <input
          type="text"
          id={SEARCH_BAR_ID}
          onKeyUp={this.onSearchBarKeyUp}
          placeholder="Enter Location"
        ></input>
        <span>Current Destination: </span>
        <span id={DESTINATION_SPAN_ID}> </span>
        <ul id={SEARCH_SUGGESTIONS_ID}></ul>
      </div>
    );
  }
}

export default AutoComplete;
