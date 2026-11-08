import React, { useContext } from "react";
import loadable from "@loadable/component";
import createPersistedState from "use-persisted-state";
import { useParams } from "react-router-dom";
// Import our shared context layer
import { CinemaContext } from "../Provider";

const usePersistedMapTypeState = createPersistedState("app.mapType");

const Maps = {
  maplibre: loadable(() => import("./MaplibreMap")),
  leaflet: loadable(() => import("./LeafletMap")),
};

export const mapTypes = Object.keys(Maps);
export const useMapType = () => {
  const [mapType, setMapType] = usePersistedMapTypeState(mapTypes[0]);
  return [mapType, setMapType];
};

const Map = (props) => {
  // Returns either a MaplibreMap or a LeafletMap component depending on
  // what has been set via the settings cog in the nav (default: maplibre)
  const [mapType] = useMapType();
  const Component = Maps[mapType];

  // Intercept active list parameters here at the core structural boundary layout
  const params = useParams();

  // Extract shared coordinates and zoom context parameters
  const { mapCenter, mapZoom, selectedCinema } = useContext(CinemaContext);

  return (
    <Component
      {...props}
      activeFranchise={params.franchiseId}
      activeCountry={params.countryCode}
      // Pass down spatial states so map engines snap instantly to coordinates
      center={mapCenter}
      zoom={mapZoom}
      selectedCinema={selectedCinema}
    />
  );
};

export default Map;
