import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { totalBounds } from "../../data/bounds";
import MapContext from "./context";

Icon.Default.imagePath =
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/";

// Custom view-controller component that links global location state directly to the active map instance
const MapViewController = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (center && center.lat && center.lng) {
      map.flyTo([Number(center.lat), Number(center.lng)], zoom || 14, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }
  }, [center, zoom, map]);

  return null;
};

const convertBounds = ([w, s, e, n]) => [
  [s, w],
  [n, e],
];

const LeafletMarker = ({ lat, lon }) => <Marker position={[lat, lon]} />;

const LeafletMap = ({ children, center, zoom }) => {
  console.log("render Leaflet map with global parameters");
  const leafletBounds = convertBounds(totalBounds);

  return (
    <MapContainer
      bounds={leafletBounds}
      // Hard boundaries protect the layout from drifting outside Australia/New Zealand
      maxBounds={leafletBounds}
      maxBoundsViscosity={1.0}
      style={{ height: "100%", backgroundColor: "#0A0A0C" }}
      zoomSnap={0.5}
      zoomDelta={0.5}
      minZoom={3}
    >
      <MapViewController center={center} zoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        // Cinematic theme improvement: uses a high-contrast dark tile set to match theater layouts
        url="https://{s}://{z}/{x}/{y}{r}.png"
        minZoom={0}
        maxZoom={18}
      />
      <MapContext.Provider value={{ Marker: LeafletMarker }}>
        {children}
      </MapContext.Provider>
    </MapContainer>
  );
};

export default LeafletMap;
