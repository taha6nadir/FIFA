import { combineReducers, createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import axios from "axios";
import { authReducer, clubReducer, leagueReducer, matchReducer, playerReducer } from "./reducers";

const FOOTBALL_API_URL = "https://worldcup26.ir";

export const loggerMiddleware = ({ getState }) => next => action => {
  const publicActions = ["LOGIN_SUCCESS", "REGISTER_SUCCESS", "LOGOUT"];
  const publicPaths = ["/login", "/register"];
  const publicAction = publicActions.includes(action.type) || publicPaths.includes(window.location.pathname);
  if (!publicAction && !getState().auth.isAuthenticated && !action.type.startsWith("@@redux")) {
    window.history.replaceState({}, "", "/login");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }
  console.log(`[Redux] ${action.type}`, action.payload);
  return next(action);
};

export const fetchFootballData = () => async dispatch => {
  try {
    const { data } = await axios.get(`${FOOTBALL_API_URL}/get/soccer/leagues`, {
      params: { available: true },
    });
    const apiLeagues = Array.isArray(data.leagues) ? data.leagues : [];

    if (!apiLeagues.length) {
      throw new Error("The football API returned no available leagues.");
    }

    const leagues = apiLeagues.map((league, index) => ({
      id: Number(league.id) || index + 1,
      name: league.name,
      abbreviation: league.abbreviation || "",
      country: league.country || "International",
      season: league.season?.display_name || "2026-27",
      year: Number(league.season?.year) || 2026,
      statistics: {
        matchs: league.coverage?.matches || 0,
        clubs: league.coverage?.clubs || 0,
      },
      status: league.active ? "active" : "suspendu",
      slug: league.slug,
      logo: league.logo || "",
    }));

    dispatch({ type: "LEAGUES_SET", payload: leagues });

    const leaguesWithClubs = apiLeagues.filter(league => league.slug && league.coverage?.clubs > 0);
    const clubsByLeague = await Promise.all(leaguesWithClubs.map(async league => {
      try {
        const response = await axios.get(
          `${FOOTBALL_API_URL}/get/soccer/${encodeURIComponent(league.slug)}/clubs`
        );
        if (!Array.isArray(response.data.clubs)) {
          throw new Error(`The football API returned an invalid club list for ${league.slug}.`);
        }

        return response.data.clubs.map(club => ({
          id: Number(club.id),
          name: club.displayName || club.name,
          abbreviation: club.abbreviation || "",
          city: club.city || club.location || "",
          country: club.country || league.country || "International",
          leagueId: Number(league.id),
          logo: club.logo || "",
          color: club.color ? `#${club.color.replace(/^#/, "")}` : "#173f35",
        }));
      } catch (error) {
        console.info(`Could not load clubs for ${league.name}.`, error);
        return [];
      }
    }));

    const clubs = clubsByLeague.flat();
    if (clubs.length) {
      dispatch({ type: "CLUBS_SET", payload: clubs });
    }
  } catch (error) {
    console.info("Football API unavailable — local data is being used.", error);
  }
};

const rootReducer = combineReducers({
  auth: authReducer,
  leagues: leagueReducer,
  clubs: clubReducer,
  players: playerReducer,
  matchs: matchReducer,
});

export const store = createStore(rootReducer, applyMiddleware(loggerMiddleware, thunk));

store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem("leagues", JSON.stringify(state.leagues.leagues));
  localStorage.setItem("clubs", JSON.stringify(state.clubs.clubs));
  localStorage.setItem("players", JSON.stringify(state.players.players));
  localStorage.setItem("matchs", JSON.stringify(state.matchs.matchs));
  localStorage.setItem("users", JSON.stringify(state.auth.users));
  if (state.auth.isAuthenticated) localStorage.setItem("session", JSON.stringify(state.auth.user));
  else localStorage.removeItem("session");
});
