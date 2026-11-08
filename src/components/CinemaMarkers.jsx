import { useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import allCinemas from "../data/cinemas";
import { useMapContext } from "./Map/context";

const CinemaMarkers = () => {
  // Pull our map wrapper instance assets directly from context controls
  const { Marker, map } = useMapContext();
  const params = useParams();

  // Dynamically filter matching entries from the database collection
  const cinemas = useMemo(() => {
    if (params.franchiseId || params.countryCode) {
      const { franchiseId, countryCode } = params;
      return allCinemas.filter((cinema) => {
        return (
          (franchiseId === "all-cinemas" || cinema.franchise === franchiseId) &&
          cinema.countryCode === countryCode
        );
      });
    }
    return allCinemas;
  }, [params]);

  // RESPONSIVE CLICK SNAPPING HOOK
  useEffect(() => {
    if (
      params.franchiseId &&
      params.franchiseId !== "all-cinemas" &&
      cinemas.length > 0
    ) {
      // Target the first isolated record matching the sidebar selections
      const targetCinema = cinemas[0];

      if (targetCinema && targetCinema.lat && targetCinema.lng && map) {
        // Safe interface validation paths mapping directly against the active engine switcher (Maplibre vs Leaflet)
        if (typeof map.flyTo === "function") {
          map.flyTo([targetCinema.lat, targetCinema.lng], 14, {
            animate: true,
            duration: 1.2,
          });
        } else if (typeof map.setView === "function") {
          map.setView([targetCinema.lat, targetCinema.lng], 14);
        } else if (typeof map.panTo === "function") {
          map.panTo([targetCinema.lat, targetCinema.lng]);
          if (typeof map.setZoom === "function") map.setZoom(14);
        } else if (map.target && typeof map.target.flyTo === "function") {
          // Fallback configuration path structure specific to custom Maplibre component hooks
          map.target.flyTo({
            center: [targetCinema.lng, targetCinema.lat],
            zoom: 14,
            essential: true,
          });
        }
      }
    }
  }, [params.franchiseId, cinemas, map]);

  return cinemas.map((cinema, idx) => {
    return <Marker lat={cinema.lat} lon={cinema.lng} key={idx} />;
  });
};

export default CinemaMarkers;
