import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiCalendar, FiChevronRight, FiEdit2, FiShield, FiUsers } from "react-icons/fi";
import { Crest, Filters, PageHeader, StatCard } from "./ui";

const leagueName = (leagues, id) => leagues.find(league => league.id === Number(id))?.name || "Championnat";

export function ClubsPage() {
  const clubs = useSelector(state => state.clubs.clubs);
  const leagues = useSelector(state => state.leagues.leagues);
  const players = useSelector(state => state.players.players);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("asc");
  const filtered = useMemo(() => clubs
    .filter(club => (!filter || club.leagueId === Number(filter)) && club.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)), [clubs, search, filter, sort]);

  return (
    <main className="page">
      <PageHeader eyebrow="ÉQUIPES" title="Clubs" action="Ajouter un club" actionTo="/addclub" />
      <Filters search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} filterLabel="Tous les championnats" options={leagues.map(league => ({ value: league.id, label: league.name }))} sort={sort} setSort={setSort} />
      <div className="section-count"><span>{filtered.length}</span> clubs</div>
      <section className="card-grid club-grid">
        {filtered.map(club => {
          const count = players.filter(player => player.clubId === club.id).length;
          return (
            <article className="club-card" key={club.id}>
              <div className="club-card-head"><Crest name={club.name} color={club.color} size="lg" /><span className="player-count">{count} joueurs</span></div>
              <div className="card-body"><p className="card-kicker">{club.city}, {club.country}</p><h3>{club.name}</h3><p className="muted">{club.abbreviation} • {leagueName(leagues, club.leagueId)}</p><div className="card-actions"><Link className="icon-button" to={`/clubs/${club.id}/edit`}><FiEdit2 /></Link><Link className="secondary" to={`/clubs/${club.id}`}>Voir le club <FiChevronRight /></Link></div></div>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export function ClubForm({ editing = false }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const leagues = useSelector(state => state.leagues.leagues);
  const found = useSelector(state => state.clubs.clubs.find(club => club.id === Number(id)));
  const [form, setForm] = useState(editing && found ? found : { name: "", abbreviation: "", city: "", country: "", leagueId: leagues[0]?.id || 1, color: "#173f35", logo: "" });
  useEffect(() => { if (editing && found) setForm(found); }, [editing, found]);

  const submit = event => {
    event.preventDefault();
    dispatch({ type: editing ? "CLUB_UPDATE" : "CLUB_ADD", payload: { ...form, id: editing ? Number(id) : Date.now(), leagueId: Number(form.leagueId), abbreviation: form.abbreviation.toUpperCase() } });
    navigate("/clubs");
  };

  return (
    <main className="page form-page">
      <Link className="back-link" to="/clubs"><FiArrowLeft /> Retour aux clubs</Link>
      <PageHeader eyebrow={editing ? "MODIFIER" : "NOUVEAU"} title={editing ? "Modifier le club" : "Ajouter un club"} />
      <form className="editor-card" onSubmit={submit}>
        <div className="form-grid"><label>Nom du club<input value={form.name} onChange={event => setForm({...form, name: event.target.value})} required /></label><label>Abréviation<input maxLength="4" value={form.abbreviation} onChange={event => setForm({...form, abbreviation: event.target.value})} required /></label></div>
        <div className="form-grid"><label>Pays<input value={form.country} onChange={event => setForm({...form, country: event.target.value})} required /></label><label>Ville<input value={form.city} onChange={event => setForm({...form, city: event.target.value})} required /></label></div>
        <div className="form-grid"><label>Championnat<select value={form.leagueId} onChange={event => setForm({...form, leagueId: event.target.value})}>{leagues.map(league => <option key={league.id} value={league.id}>{league.name}</option>)}</select></label><label>Couleur<div className="color-input"><input type="color" value={form.color || "#173f35"} onChange={event => setForm({...form, color: event.target.value})} /><span>{form.color || "#173f35"}</span></div></label></div>
        <label>URL du logo<input value={form.logo || ""} onChange={event => setForm({...form, logo: event.target.value})} placeholder="https://..." /></label>
        <div className="form-submit"><button className="primary" type="submit">{editing ? "Enregistrer" : "Créer le club"}</button></div>
      </form>
    </main>
  );
}

export function ClubDetail() {
  const { id } = useParams();
  const clubs = useSelector(state => state.clubs.clubs);
  const leagues = useSelector(state => state.leagues.leagues);
  const players = useSelector(state => state.players.players);
  const matchs = useSelector(state => state.matchs.matchs);
  const club = clubs.find(item => item.id === Number(id));
  if (!club) return <Navigate to="/clubs" />;
  const roster = players.filter(player => player.clubId === club.id);
  const played = matchs.filter(match => (match.homeClubId === club.id || match.awayClubId === club.id) && match.status === "Terminé");
  const wins = played.filter(match => (match.homeClubId === club.id && match.homeScore > match.awayScore) || (match.awayClubId === club.id && match.awayScore > match.homeScore)).length;

  return (
    <main className="page detail-page">
      <Link className="back-link" to="/clubs"><FiArrowLeft /> Retour aux clubs</Link>
      <section className="detail-hero club-detail-hero"><Crest name={club.name} color={club.color} size="xl" /><div><p className="eyebrow">{club.abbreviation} • {leagueName(leagues, club.leagueId)}</p><h1>{club.name}</h1><p>{club.city}, {club.country}</p></div><Link className="secondary" to={`/clubs/${id}/edit`}><FiEdit2 /> Modifier</Link></section>
      <section className="stats-grid detail-stats"><StatCard label="Joueurs" value={roster.length} icon={<FiUsers />} color="green" /><StatCard label="Matchs joués" value={played.length} icon={<FiCalendar />} color="blue" /><StatCard label="Victoires" value={wins} icon={<FiShield />} color="gold" /></section>
      <div className="panel roster-panel"><div className="panel-head"><div><p className="eyebrow">EFFECTIF</p><h2>Joueurs</h2></div></div><div className="mini-player-grid">{roster.map(player => <Link to={`/players/${player.id}`} className="mini-player" key={player.id}><span className="player-avatar">{player.name.split(" ").map(word => word[0]).join("")}</span><div><b>{player.name}</b><span>{player.position} • #{player.number}</span></div><FiChevronRight /></Link>)}</div></div>
    </main>
  );
}
