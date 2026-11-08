import React, { createContext, useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { HashRouter } from "react-router-dom";
import { SnackbarProvider, useSnackbar } from "notistack";

// 1. Create a global Context to share Map, Filters, and Selection state across all components
export const CinemaContext = createContext();

// 2. The corrected Cinematic Theme
const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0A0A0C",
      paper: "#16161A",
    },
    primary: {
      main: "#E50914",
    },
    secondary: {
      main: "#FFC107",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#A0A0AB",
    },
    // FIX: This section prevents the "Cannot read properties of undefined (reading 'type')" crash
    action: {
      active: "#FFFFFF",
      hover: "rgba(255, 255, 255, 0.08)",
      hoverOpacity: 0.08,
      selected: "rgba(255, 255, 255, 0.16)",
      disabled: "rgba(255, 255, 255, 0.3)",
      disabledBackground: "rgba(255, 255, 255, 0.12)",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 700,
      letterSpacing: "0.5px",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "1px solid rgba(255, 255, 255, 0.08)",
        },
      },
    },
  },
});

const ContextDataProvider = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [selectedCinema, setSelectedCinema] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: -33.8688, lng: 151.2093 }); // Defaults to Sydney
  const [mapZoom, setMapZoom] = useState(10);

  const [filters, setFilters] = useState({
    candybar: false,
    recliners: false,
    maxPrice: 40,
  });
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setMapCenter(userCoords);
        setMapZoom(13);
        enqueueSnackbar("Located your position!", { variant: "success" });
      },
      (error) => {
        enqueueSnackbar("Allow location access to find closest cinemas.", {
          variant: "info",
        });
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, [enqueueSnackbar]);

  const snapToCinema = (cinema) => {
    if (cinema && cinema.lat && cinema.lng) {
      setSelectedCinema(cinema);
      setMapCenter({ lat: cinema.lat, lng: cinema.lng });
      setMapZoom(15);
    }
  };

  return (
    <CinemaContext.Provider
      value={{
        selectedCinema,
        setSelectedCinema,
        mapCenter,
        setMapCenter,
        mapZoom,
        setMapZoom,
        filters,
        setFilters,
        sortBy,
        setSortBy,
        snapToCinema,
      }}
    >
      {children}
    </CinemaContext.Provider>
  );
};

const Provider = ({ children }) => (
  <HashRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <ContextDataProvider>{children}</ContextDataProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </HashRouter>
);

export default Provider;
