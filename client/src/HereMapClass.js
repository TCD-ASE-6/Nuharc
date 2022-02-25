
import * as React from 'react';

export default class HereMapClass extends React.Component {
    mapRef = React.createRef();
    state = {
      map: null
    };
  
    componentDidMount() {
      const H = window.H;
      const platform = new H.service.Platform({
          apikey: "{R4_pnstHZLpuSq7RXxJZDIx5GEMpqA4HsZ_NMHg8U4c}"
      });
  
      const defaultLayers = platform.createDefaultLayers();
  
      const map = new H.Map(
        this.mapRef.current,
        defaultLayers.vector.normal.map,
        {
          center: { lat: 50, lng: 5 },
          zoom: 4,
          pixelRatio: window.devicePixelRatio || 1
        }
      );
  
      // MapEvents enables the event system
      // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
      // This variable is unused and is present for explanatory purposes
      const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
  
      // Create the default UI components to allow the user to interact with them
      // This variable is unused
      const ui = H.ui.UI.createDefault(map, defaultLayers);
  
      this.setState({ map });
    }
  
    componentWillUnmount() {
      this.state.map.dispose();
    }
  
    render() {
      return <div ref={this.mapRef} style={{ height: "93.5vh" }} />;
    }
  }