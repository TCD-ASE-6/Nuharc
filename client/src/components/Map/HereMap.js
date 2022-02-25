import React, { Component } from "react";

class HereMap extends Component {

    render() {
        return (
            <head>
                <title>Here Map App</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <script type="text/javascript" src="https://js.api.here.com/v3/3.1/mapsjs-core.js"></script>
                <script type="text/javascript" src="https://js.api.here.com/v3/3.1/mapsjs-service.js"></script>
                <script type="text/javascript" src="https://js.api.here.com/v3/3.1/mapsjs-ui.js"></script>
                <script type="text/javascript" src="https://js.api.here.com/v3/3.1/mapsjs-mapevents.js"></script>
            </head>
        )

    }
}
export default HereMap;