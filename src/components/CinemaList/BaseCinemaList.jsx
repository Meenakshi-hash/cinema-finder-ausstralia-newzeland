import React, { useContext } from "react";
import {
  List,
  Divider,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
} from "@mui/material";
// Import our global context state to utilize active filter keys
import { CinemaContext } from "../Provider";
import CinemaListItem from "./CinemaListItem";

const CinemaListAside = ({ cinemas = [], Header = null }) => {
  const { filters, setFilters, sortBy, setSortBy, snapToCinema } =
    useContext(CinemaContext);

  // 1. Handle dynamic event changes for search sorting selectors
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.checked,
    });
  };

  const handlePriceSliderChange = (event, newValue) => {
    setFilters({
      ...filters,
      maxPrice: newValue,
    });
  };

  // 2. Filter the cinemas list dynamically based on advanced parameters
  const filteredCinemas = cinemas.filter((cinema) => {
    // Filter out items matching amenity constraints (falling back to false if unavailable in mock data)
    if (filters.candybar && !cinema.hasCandybar) return false;
    if (filters.recliners && !cinema.hasRecliners) return false;

    // Filter out items exceeding the max ticket pricing constraint
    if (cinema.ticketPrice && cinema.ticketPrice > filters.maxPrice)
      return false;

    return true;
  });

  // 3. Sort the array according to selected sorting methods
  const sortedCinemas = [...filteredCinemas].sort((a, b) => {
    if (sortBy === "price") {
      return (a.ticketPrice || 0) - (b.ticketPrice || 0);
    }
    if (sortBy === "distance") {
      return (a.distance || 0) - (b.distance || 0);
    }
    // Default Alphabetical fallback
    return (a.name || "").localeCompare(b.name || "");
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Dynamic Advanced Filter Panel Controls (Fixes: Sorting, candybar & price limits) */}
      <Box
        sx={{ p: 1.5, bgcolor: "background.default", borderRadius: 2, mb: 2 }}
      >
        <Typography
          variant="subtitle2"
          color="secondary"
          sx={{ mb: 1, fontWeight: "bold" }}
        >
          Filters & Controls
        </Typography>

        <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
          <InputLabel id="cinema-sort-label">Sort Cinemas By</InputLabel>
          <Select
            labelId="cinema-sort-label"
            value={sortBy}
            label="Sort Cinemas By"
            onChange={handleSortChange}
          >
            <MenuItem value="name">Alphabetical (A-Z)</MenuItem>
            <MenuItem value="price">Ticket Price (Lowest First)</MenuItem>
            <MenuItem value="distance">Distance (Nearest First)</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ px: 1, mb: 1.5 }}>
          <Typography variant="caption" color="text.secondary">
            Max Ticket Price: ${filters.maxPrice}
          </Typography>
          <Slider
            value={filters.maxPrice}
            onChange={handlePriceSliderChange}
            min={10}
            max={40}
            step={1}
            valueLabelDisplay="auto"
            size="small"
            color="primary"
          />
        </Box>

        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={filters.candybar}
                onChange={handleCheckboxChange}
                name="candybar"
                color="primary"
              />
            }
            label={<Typography variant="caption">🍿 Candy Bar</Typography>}
          />
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={filters.recliners}
                onChange={handleCheckboxChange}
                name="recliners"
                color="primary"
              />
            }
            label={<Typography variant="caption">💺 Recliners</Typography>}
          />
        </FormGroup>
      </Box>

      {Header && <Header cinemas={sortedCinemas} />}
      {Header && <Divider sx={{ my: 1 }} />}

      {/* Graceful Safe Placeholder Catch (Fixes: broken list states from empty params) */}
      {sortedCinemas.length === 0 ? (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            No cinemas found matching the selected filtering combinations.
          </Typography>
        </Box>
      ) : (
        <List
          sx={{
            maxHeight: "calc(100vh - 340px)",
            overflowY: "auto",
            flexGrow: 1,
          }}
        >
          {sortedCinemas.map((cinema, idx) => (
            <Box
              key={idx}
              onClick={() => snapToCinema(cinema)}
              sx={{
                cursor: "pointer",
                transition: "0.2s",
                "&:hover": { bgcolor: "rgba(255,255,255,0.03)" },
              }}
            >
              <CinemaListItem {...cinema} />
              {idx < sortedCinemas.length - 1 && <Divider component="li" />}
            </Box>
          ))}
        </List>
      )}
    </Box>
  );
};

export default CinemaListAside;
