import { Grid, Paper, Typography, Box } from "@mui/material";
import { Switch, Route } from "react-router-dom";
import loadable from "@loadable/component";

// Standard components located inside the local child directories
import Layout from "./components/Layout";
import Map from "./components/Map";
import AsideIndex from "./components/AsideIndex";
import Provider from "./components/Provider";
import {
  FranchiseCinemasList,
  NearbyCinemasList,
} from "./components/CinemaList";

// Standard 404 handler component for pages not found
const NotFound = () => (
  <Typography variant="h6" sx={{ p: 2, textAlign: "center" }}>
    404, Page Not Found!
  </Typography>
);

// Explicit 'fallback' configurations protect the chunks from initializing as undefined
const CinemaMarkers = loadable(() => import("./components/CinemaMarkers"), {
  fallback: (
    <Box sx={{ p: 2, color: "text.secondary" }}>Loading map elements...</Box>
  ),
});

const NearbyCinemaMarkers = loadable(
  () => import("./components/NearbyCinemaMarkers"),
  {
    fallback: (
      <Box sx={{ p: 2, color: "text.secondary" }}>Loading nearby venues...</Box>
    ),
  }
);

// Our root component containing our map and info panel
const App = () => (
  <Provider>
    <Layout>
      <Grid item xs={12} md={8} sx={{ minHeight: 400 }}>
        <Map>
          <Switch>
            <Route exact path="/">
              {/* Added key to stabilize the component tree */}
              <CinemaMarkers key="root-markers" />
            </Route>

            <Route path="/nearby">
              <NearbyCinemaMarkers />
            </Route>

            {/* 
              UPDATED: Using a dynamic key based on parameters stops 
              the map from entering an endless auto-zoom calculation loop.
            */}
            <Route
              path="/:franchiseId/:countryCode"
              render={({ match }) => (
                <CinemaMarkers
                  key={`${match.params.franchiseId}-${match.params.countryCode}`}
                  franchiseId={match.params.franchiseId}
                  countryCode={match.params.countryCode}
                />
              )}
            />

            <Route path="*">
              <Box sx={{ p: 4, textAlign: "center", color: "text.disabled" }}>
                No Map Data Available
              </Box>
            </Route>
          </Switch>
        </Map>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, height: "100%", minHeight: 400 }} elevation={1}>
          <Switch>
            <Route exact path="/">
              <AsideIndex />
            </Route>
            <Route path="/nearby">
              <NearbyCinemasList />
            </Route>
            <Route path="/:franchiseId/:countryCode">
              <FranchiseCinemasList />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </Paper>
      </Grid>
    </Layout>
  </Provider>
);

export default App;
