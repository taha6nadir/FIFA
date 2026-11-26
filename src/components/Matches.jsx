import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiEdit2 } from "react-icons/fi";
import { Crest, Filters, PageHeader } from "./ui";

const clubName = (clubs, id) => clubs.find(club => club.id === Number(id))?.name || "Club";
const club = (clubs, id) => clubs.find(club => club.id === Number(id));
const leagueName = (leagues, id) => leagues.find(league => league.id === Number(id))?.name || "Championnat";

export function MatchesPage() {
  const matchs = useSelector(state => state.matchs.matchs);
  const clubs = useSelector(state => state.clubs.clubs);
  const leagues = useSelector(state => state.leagues.leagues);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("asc");
  const filtered = useMemo(() => matchs
    .filter(match => (!filter || match.status === filter) && `${clubName(clubs, match.homeClubId)} ${clubName(clubs, match.awayClubId)} ${leagueName(leagues, match.leagueId)}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)), [matchs, clubs, leagues, search, filter, sort]);

  return (
    <main className="page">
      <PageHeader eyebrow="CALENDrier" title="Matchs" action="Ajouter un match" actionTo="/addMatch" />
      <Filters search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} filterLabel="Tous les statuts" options={[{ value: "À venir", label: "À venir" }, { value: "Terminé", label: "Terminé" }]} sort={sort} setSort={setSort} />
      <div className="section-count"><span>{filtered.length}</span> matchs</div>
      <section className="matches-grid">
        {filtered.map(match => {
          const home = club(clubs, match.homeClubId);
          const away = club(clubs, match.awayClubId);
          const date = new Date(match.date);
          return (
            <article className="match-card" key={match.id}>
              <div className="match-card-head"><span>{leagueName(leagues, match.leagueId)}</span><span className={`status-match ${match.status === "Terminé" ? "finished" : "upcoming"}`}>{match.status}</span></div>
              <div className="scoreboard">
                <div><Crest name={home?.name} color={home?.color} /><b>{home?.name}</b></div>
                <div className="score"><strong>{match.status === "Terminé" ? `${match.homeScore} — ${match.awayScore}` : "VS"}</strong><span>{date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })} • {date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</span></div>
                <div><Crest name={away?.name} color={away?.color} /><b>{away?.name}</b></div>
              </div>
              <div className="card-actions match-actions"><Link className="icon-button" to={`/matchs/${match.id}/edit`}><FiEdit2 /></Link><Link className="secondary" to={`/matchs/${match.id}`}>Voir le match</Link></div>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export function MatchForm({ editing = false }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const leagues = useSelector(state => state.leagues.leagues);
  const clubs = useSelector(state => state.clubs.clubs);
  const players = useSelector(state => state.players.players);
  const found = useSelector(state => state.matchs.matchs.find(match => match.id === Number(id)));
  const [form, setForm] = useState(editing && found ? found : { leagueId: leagues[0]?.id || 1, homeClubId: "", awayClubId: "", date: "", status: "À venir", homeScore: null, awayScore: null, duration: 0, stadium: "", homeScorers: [], awayScorers: [] });
  useEffect(() => { if (editing && found) setForm(found); }, [editing, found]);

  const leagueClubs = clubs.filter(clubItem => clubItem.leagueId === Number(form.leagueId));
  const scorerOptions = clubId => players.filter(player => player.clubId === clubId).map(player => player.name);

  const submit = event => {
    event.preventDefault();
    dispatch({
      type: editing ? "MATCH_UPDATE" : "MATCH_ADD",
      payload: {
        ...form,
        id: editing ? Number(id) : Date.now(),
        leagueId: Number(form.leagueId),
        homeClubId: Number(form.homeClubId),
        awayClubId: Number(form.awayClubId),
        homeScore: form.status === "Terminé" ? Number(form.homeScore || 0) : null,
        awayScore: form.status === "Terminé" ? Number(form.awayScore || 0) : null,
        duration: form.status === "À venir" ? 0 : Number(form.duration || 0)
      }
    });
    navigate("/matchs");
  };

  return (
    <main className="page form-page">
      <Link className="back-link" to="/matchs"><FiArrowLeft /> Retour aux matchs</Link>
      <PageHeader eyebrow={editing ? "MODIFIER" : "NOUVEAU"} title={editing ? "Modifier le match" : "Ajouter un match"} />
      <form className="editor-card" onSubmit={submit}>
        <div className="form-grid"><label>Championnat<select value={form.leagueId} onChange={event => setForm({...form, leagueId: event.target.value, homeClubId: "", awayClubId: ""})}>{leagues.map(league => <option key={league.id} value={league.id}>{league.name}</option>)}</select></label><label>Stade<input value={form.stadium || ""} onChange={event => setForm({...form, stadium: event.target.value})} placeholder="Nom du stade" /></label></div>
        <div className="form-grid"><label>Club à domicile<select value={form.homeClubId} onChange={event => setForm({...form, homeClubId: event.target.value})} required><option value="">Sélectionner</option>{leagueClubs.map(clubItem => <option key={clubItem.id} value={clubItem.id}>{clubItem.name}</option>)}</select></label><label>Club à l’extérieur<select value={form.awayClubId} onChange={event => setForm({...form, awayClubId: event.target.value})} required><option value="">Sélectionner</option>{leagueClubs.filter(clubItem => String(clubItem.id) !== String(form.homeClubId)).map(clubItem => <option key={clubItem.id} value={clubItem.id}>{clubItem.name}</option>)}</select></label></div>
        <div className="form-grid"><label>Date et heure<input type="datetime-local" value={String(form.date).slice(0, 16)} onChange={event => setForm({...form, date: event.target.value})} required /></label><label>Statut<select value={form.status} onChange={event => setForm({...form, status: event.target.value})}><option>À venir</option><option>Terminé</option></select></label></div>
        {editing && (
          <>
            <div className="form-grid"><label>Score domicile<input type="number" min="0" value={form.homeScore ?? ""} onChange={event => setForm({...form, homeScore: event.target.value})} /></label><label>Score extérieur<input type="number" min="0" value={form.awayScore ?? ""} onChange={event => setForm({...form, awayScore: event.target.value})} /></label></div>
            <div className="form-grid"><label>Durée (minutes)<input type="number" min="0" value={form.duration || 0} onChange={event => setForm({...form, duration: event.target.value})} /></label><label>Buteur domicile<select multiple value={form.homeScorers || []} onChange={event => setForm({...form, homeScorers: [...event.target.selectedOptions].map(option => option.value)})}>{scorerOptions(form.homeClubId).map(name => <option key={name}>{name}</option>)}</select></label></div>
            <label>Buteurs extérieur<select multiple value={form.awayScorers || []} onChange={event => setForm({...form, awayScorers: [...event.target.selectedOptions].map(option => option.value)})}>{scorerOptions(form.awayClubId).map(name => <option key={name}>{name}</option>)}</select></label>
          </>
        )}
        <div className="form-submit"><button className="primary" type="submit">{editing ? "Enregistrer" : "Créer le match"}</button></div>
      </form>
    </main>
  );
}

export function MatchDetail() {
  const { id } = useParams();
  const matchs = useSelector(state => state.matchs.matchs);
  const clubs = useSelector(state => state.clubs.clubs);
  const leagues = useSelector(state => state.leagues.leagues);
  const match = matchs.find(item => item.id === Number(id));
  if (!match) return <Navigate to="/matchs" />;
  const home = club(clubs, match.homeClubId);
  const away = club(clubs, match.awayClubId);
  const league = leagues.find(item => item.id === match.leagueId);
  const date = new Date(match.date);
  const winner = match.status === "Terminé" ? (match.homeScore > match.awayScore ? home?.name : match.awayScore > match.homeScore ? away?.name : "Match nul") : "À déterminer";

  return (
    <main className="page detail-page">
      <Link className="back-link" to="/matchs"><FiArrowLeft /> Retour aux matchs</Link>
      <section className="match-detail-head"><div><p className="eyebrow">{league?.name} • {league?.country}</p><h1>{winner}</h1><p>{date.toLocaleDateString("fr-FR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })} • {match.stadium}</p></div><Link className="secondary" to={`/matchs/${id}/edit`}><FiEdit2 /> Modifier</Link></section>
      <section className="match-detail-card"><div className="team-detail"><Crest name={home?.name} color={home?.color} size="xl" /><h2>{home?.name}</h2><span>Domicile</span></div><div className="detail-score"><strong>{match.status === "Terminé" ? `${match.homeScore ?? 0} — ${match.awayScore ?? 0}` : "VS"}</strong><span>{match.status === "Terminé" ? `${match.duration || 0} minutes` : "0 minute"}</span><span className={`status-match ${match.status === "Terminé" ? "finished" : "upcoming"}`}>{match.status}</span></div><div className="team-detail"><Crest name={away?.name} color={away?.color} size="xl" /><h2>{away?.name}</h2><span>Extérieur</span></div></section>
      <section className="scorers-row"><div><h3>Buteurs — domicile</h3><p>{match.status === "À venir" || !(match.homeScorers || []).length ? "Aucun" : match.homeScorers.join(", ")}</p></div><div><h3>Buteurs — extérieur</h3><p>{match.status === "À venir" || !(match.awayScorers || []).length ? "Aucun" : match.awayScorers.join(", ")}</p></div></section>
    </main>
  );
}
