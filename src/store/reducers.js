import { initialLeagues, initialClubs, initialPlayers, initialMatches } from "../data/initialData";

const saved = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
};

export const leagueReducer = (state = { leagues: saved("leagues", initialLeagues) }, action) => {
  switch (action.type) {
    case "LEAGUES_SET": return { ...state, leagues: action.payload };
    case "LEAGUE_ADD": return { ...state, leagues: [...state.leagues, action.payload] };
    case "LEAGUE_UPDATE": return { ...state, leagues: state.leagues.map(x => x.id === action.payload.id ? action.payload : x) };
    default: return state;
  }
};
export const clubReducer = (state = { clubs: saved("clubs", initialClubs) }, action) => {
  switch (action.type) {
    case "CLUBS_SET": return { ...state, clubs: action.payload };
    case "CLUB_ADD": return { ...state, clubs: [...state.clubs, action.payload] };
    case "CLUB_UPDATE": return { ...state, clubs: state.clubs.map(x => x.id === action.payload.id ? action.payload : x) };
    default: return state;
  }
};
export const playerReducer = (state = { players: saved("players", initialPlayers) }, action) => {
  switch (action.type) {
    case "PLAYER_ADD": return { ...state, players: [...state.players, action.payload] };
    case "PLAYER_UPDATE": return { ...state, players: state.players.map(x => x.id === action.payload.id ? action.payload : x) };
    default: return state;
  }
};
export const matchReducer = (state = { matchs: saved("matchs", initialMatches) }, action) => {
  switch (action.type) {
    case "MATCH_ADD": return { ...state, matchs: [...state.matchs, action.payload] };
    case "MATCH_UPDATE": return { ...state, matchs: state.matchs.map(x => x.id === action.payload.id ? action.payload : x) };
    default: return state;
  }
};
export const authReducer = (state = { isAuthenticated: !!localStorage.getItem("session"), user: JSON.parse(localStorage.getItem("session") || "null"), users: saved("users", [{ nom: "Doe", prenom: "John", username: "admin", email: "admin@fifa.test", password: "admin123" }]) }, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS": return { ...state, isAuthenticated: true, user: action.payload };
    case "LOGOUT": return { ...state, isAuthenticated: false, user: null };
    case "REGISTER_SUCCESS": return { ...state, users: [...state.users, action.payload] };
    default: return state;
  }
};
