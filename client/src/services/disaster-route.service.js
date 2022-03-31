import axios from "axios";

class DisasterRouteService {
  incidentData = {}
  incidentList = [];

  async configureIncidentList() {
    this.incidentList = await axios.get("/api/incident/");
  }

  generateIncidentData() {
    console.log("Incident List...", this.incidentList)
  }

  async getRoute(from, to) {
    let data;
    try {
      data = await fetch(
        `http://localhost:8080/api/directions/getRoute?source=${from}&destination=${to}`
      );
    } catch (error) {
      console.log(error);
    }
    const routeList = JSON.parse(await data.text());
    const optimalRoute = this.getOptimalRoute(routeList, this.incidentList)
    return optimalRoute
  }

  /**
   * Method to get optimal route based on the incident list 
   * @param {*} routes 
   * @param {*} incidentList 
   */
  getOptimalRoute(routes, incidentList) {
    console.log("Routes....", routes)
    console.log("Incident List...", incidentList)
    const actualRouteCoordinateList = routes.map(data => {
      return data.map(coord => {
        return {lat: coord[0], lng: coord[1]}
      })
    })
    console.log("Actual Coordinate List...", actualRouteCoordinateList)
    const actualIncidentList = incidentList.data.map(data => ({lat: data.latitude["$numberDecimal"], lng: data.longitude["$numberDecimal"]}))
    const filteredRoutesData = actualRouteCoordinateList.map(data => {
      const actualIncidentData = data.map(coord => {
        const incidentInfo = actualIncidentList.map(incident => {
          return this.arePointsNear(coord, incident, 0.2)
        })
        return incidentInfo.includes(true)
      })
      return actualIncidentData.includes(true)
    })
    const filteredRoutesIndex =  filteredRoutesData.findIndex(data => data === false) 
    console.log("Filtered route data....", filteredRoutesData)
    return filteredRoutesIndex !== -1 ? routes[filteredRoutesIndex] : routes[0]
  }

  arePointsNear(checkPoint, centerPoint, km) {
    const ky = 40000 / 360;
    const kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
    const dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
    const dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
    return Math.sqrt(dx * dx + dy * dy) <= km;
  }

}

export default DisasterRouteService