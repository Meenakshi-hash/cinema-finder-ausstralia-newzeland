import React, { useEffect, useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import Map, { Marker } from "react-map-gl";
import maplibregl from "maplibre-gl";
import { MapContextProvider } from "./context";
import { totalBounds } from "../../data/bounds";
import maplibreglWorker from "maplibre-gl/dist/maplibre-gl-csp-worker";
maplibregl.workerClass = maplibreglWorker;

const MaplibreMarker = ({ lat, lon }) => (
  <Marker longitude={lon} latitude={lat} anchor="bottom" />
);

const convertBounds = ([w, s, e, n]) => [
  [w, s],
  [e, n],
];

const MaplibreMap = ({ children, center, zoom }) => {
  console.log("render Maplibre map with global parameters");
  const mapRef = useRef();
  const maplibreBounds = convertBounds(totalBounds);

  // Watch central state mutations and pan map view smoothly
  useEffect(() => {
    if (mapRef.current && center && center.lat && center.lng) {
      mapRef.current.flyTo({
        center: [Number(center.lng), Number(center.lat)],
        zoom: zoom || 14,
        essential: true,
        duration: 1200,
      });
    }
  }, [center, zoom]);

  return (
    <Map
      ref={mapRef}
      mapLib={maplibregl}
      // Cinematic improvement: switch style endpoint to dark layout theme vector styles if available
      mapStyle="https://maptiler.com"
      initialViewState={{
        bounds: maplibreBounds,
      }}
      // Locks coordinates inside the AU/NZ region parameters
      maxBounds={maplibreBounds}
      padding={24}
    >
      <MapContextProvider
        value={{ Marker: MaplibreMarker, map: mapRef.current }}
      >
        {children}
      </MapContextProvider>
    </Map>
  );
};

export default MaplibreMap;
