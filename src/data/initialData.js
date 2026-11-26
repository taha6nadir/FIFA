export const initialLeagues = [
  { id: 1, name: "Premier League", country: "Angleterre", season: "2026-27 English Premier League", year: 2026, statistics: { matchs: 15, clubs: 20 }, status: "active" },
  { id: 2, name: "La Liga", country: "Espagne", season: "2026-27 Spanish LALIGA", year: 2026, statistics: { matchs: 15, clubs: 20 }, status: "active" },
  { id: 3, name: "Botola Pro", country: "Maroc", season: "2026-27 Botola", year: 2026, statistics: { matchs: 15, clubs: 20 }, status: "active" },
  { id: 4, name: "Serie A", country: "Italie", season: "2026-27 Italian Serie A", year: 2026, statistics: { matchs: 15, clubs: 20 }, status: "suspendu" },
];

export const initialClubs = [
  { id: 1, name: "Manchester City", abbreviation: "MCI", city: "Manchester", country: "Angleterre", leagueId: 1, logo: "", color: "#58b8e8" },
  { id: 2, name: "Arsenal", abbreviation: "ARS", city: "London", country: "Angleterre", leagueId: 1, logo: "", color: "#ef3340" },
  { id: 3, name: "Real Madrid", abbreviation: "RMA", city: "Madrid", country: "Espagne", leagueId: 2, logo: "", color: "#9eb8c8" },
  { id: 4, name: "FC Barcelona", abbreviation: "BAR", city: "Barcelona", country: "Espagne", leagueId: 2, logo: "", color: "#a50044" },
  { id: 5, name: "Wydad AC", abbreviation: "WAC", city: "Casablanca", country: "Maroc", leagueId: 3, logo: "", color: "#db1f26" },
  { id: 6, name: "Raja CA", abbreviation: "RCA", city: "Casablanca", country: "Maroc", leagueId: 3, logo: "", color: "#17823b" },
  { id: 7, name: "AC Milan", abbreviation: "MIL", city: "Milan", country: "Italie", leagueId: 4, logo: "", color: "#b50938" },
];

export const initialPlayers = [
  { id: 1, name: "Erling Haaland", position: "Attaquant", clubId: 1, age: 25, country: "Norvège", number: 9, goals: 18, matches: 15, photo: "" },
  { id: 2, name: "Phil Foden", position: "Milieu", clubId: 1, age: 25, country: "Angleterre", number: 47, goals: 8, matches: 14, photo: "" },
  { id: 3, name: "Bukayo Saka", position: "Attaquant", clubId: 2, age: 24, country: "Angleterre", number: 7, goals: 12, matches: 15, photo: "" },
  { id: 4, name: "Jude Bellingham", position: "Milieu", clubId: 3, age: 22, country: "Angleterre", number: 5, goals: 9, matches: 13, photo: "" },
  { id: 5, name: "Lamine Yamal", position: "Attaquant", clubId: 4, age: 18, country: "Espagne", number: 19, goals: 7, matches: 12, photo: "" },
  { id: 6, name: "Yahia Attiyat Allah", position: "Défenseur", clubId: 5, age: 31, country: "Maroc", number: 25, goals: 2, matches: 14, photo: "" },
  { id: 7, name: "Rafael Leão", position: "Attaquant", clubId: 7, age: 26, country: "Portugal", number: 10, goals: 11, matches: 13, photo: "" },
];

export const initialMatches = [
  { id: 1, leagueId: 1, homeClubId: 1, awayClubId: 2, date: "2026-01-10T20:00", homeScore: 2, awayScore: 1, status: "Terminé", duration: 94, stadium: "Etihad Stadium", homeScorers: ["Erling Haaland"], awayScorers: ["Bukayo Saka"] },
  { id: 2, leagueId: 2, homeClubId: 3, awayClubId: 4, date: "2026-01-15T21:00", homeScore: 2, awayScore: 2, status: "Terminé", duration: 90, stadium: "Santiago Bernabéu", homeScorers: ["Jude Bellingham"], awayScorers: ["Lamine Yamal"] },
  { id: 3, leagueId: 3, homeClubId: 5, awayClubId: 6, date: "2026-11-22T18:30", homeScore: null, awayScore: null, status: "À venir", duration: 0, stadium: "Stade Mohammed V", homeScorers: [], awayScorers: [] },
  { id: 4, leagueId: 4, homeClubId: 7, awayClubId: 3, date: "2026-11-25T20:45", homeScore: null, awayScore: null, status: "À venir", duration: 0, stadium: "San Siro", homeScorers: [], awayScorers: [] },
  { id: 5, leagueId: 1, homeClubId: 2, awayClubId: 1, date: "2026-11-28T17:30", homeScore: null, awayScore: null, status: "À venir", duration: 0, stadium: "Emirates Stadium", homeScorers: [], awayScorers: [] },
];
