import { combineReducers, createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import { authReducer, clubReducer, leagueReducer, matchReducer, playerReducer } from "./reducers";

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

export const fetchLeagues = () => async dispatch => {
  try {
    const response = await fetch("https://worldcup26.ir/get/soccer/leagues");
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length) {
        const leagues = data.slice(0, 8).map((item, index) => ({
          id: item.id || index + 1,
          name: item.name || item.league || `Championnat ${index + 1}`,
          country: item.country || "International",
          season: item.season || "2026-27",
          year: 2026,
          statistics: { matchs: item.matches || 15, clubs: item.teams || 20 },
          status: "active",
        }));
        dispatch({ type: "LEAGUES_SET", payload: leagues });
      }
    }
  } catch (error) {
    console.info("API indisponible — données locales utilisées.", error);
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
