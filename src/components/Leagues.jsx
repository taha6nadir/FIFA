import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiCalendar, FiChevronRight, FiEdit2, FiShield } from "react-icons/fi";
import { Crest, Filters, PageHeader, StatCard } from "./ui";

export function LeaguesPage() {
  const leagues = useSelector(state => state.leagues.leagues);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("asc");
  const filtered = useMemo(() => leagues
    .filter(league => (!filter || league.country === filter) && `${league.name} ${league.country}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)), [leagues, search, filter, sort]);
  const countries = [...new Set(leagues.map(league => league.country))].map(country => ({ value: country, label: country }));

  return (
    <main className="page">
      <PageHeader eyebrow="COMPÉTITIONS" title="Championnats" action="Ajouter un championnat" actionTo="/addLeague" />
      <Filters search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} filterLabel="Tous les pays" options={countries} sort={sort} setSort={setSort} />
      <div className="section-count"><span>{filtered.length}</span> championnats</div>
      <section className="card-grid league-grid">
        {filtered.map(league => (
          <article className="league-card" key={league.id}>
            <div className="league-banner"><span className="league-emblem"><FiShield /></span><span className={`status ${league.status}`}>{league.status === "active" ? "Actif" : "Suspendu"}</span></div>
            <div className="card-body">
              <p className="card-kicker">{league.country}</p><h3>{league.name}</h3><p className="season">{league.season}</p>
              <div className="card-actions"><Link className="icon-button" to={`/leagues/${league.id}/edit`} title="Modifier"><FiEdit2 /></Link><Link className="secondary" to={`/leagues/${league.id}`}>Voir les détails <FiChevronRight /></Link></div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export function LeagueForm({ editing = false }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const found = useSelector(state => state.leagues.leagues.find(league => league.id === Number(id)));
  const [form, setForm] = useState(editing && found ? found : { name: "", country: "", season: "", year: new Date().getFullYear(), statistics: { matchs: 0, clubs: 0 }, status: "active" });

  useEffect(() => { if (editing && found) setForm(found); }, [editing, found]);

  const submit = event => {
    event.preventDefault();
    dispatch({ type: editing ? "LEAGUE_UPDATE" : "LEAGUE_ADD", payload: { ...form, id: editing ? Number(id) : Date.now(), statistics: { matchs: Number(form.statistics?.matchs || 0), clubs: Number(form.statistics?.clubs || 0) }, year: Number(form.year) } });
    navigate("/leagues");
  };

  return (
    <main className="page form-page">
      <Link className="back-link" to="/leagues"><FiArrowLeft /> Retour aux championnats</Link>
      <PageHeader eyebrow={editing ? "MODIFIER" : "NOUVEAU"} title={editing ? "Modifier le championnat" : "Ajouter un championnat"} />
      <form className="editor-card" onSubmit={submit}>
        <div className="form-grid"><label>Nom du championnat<input value={form.name} onChange={event => setForm({...form, name: event.target.value})} required /></label><label>Pays<input value={form.country} onChange={event => setForm({...form, country: event.target.value})} required /></label></div>
        <div className="form-grid"><label>Saison<input value={form.season} onChange={event => setForm({...form, season: event.target.value})} required /></label><label>Année<input type="number" value={form.year} onChange={event => setForm({...form, year: event.target.value})} required /></label></div>
        <div className="form-grid"><label>Nombre de matchs<input type="number" value={form.statistics?.matchs || 0} onChange={event => setForm({...form, statistics: {...form.statistics, matchs: event.target.value}})} /></label><label>Nombre de clubs<input type="number" value={form.statistics?.clubs || 0} onChange={event => setForm({...form, statistics: {...form.statistics, clubs: event.target.value}})} /></label></div>
        <label>Statut<select value={form.status} onChange={event => setForm({...form, status: event.target.value})}><option value="active">Actif</option><option value="suspendu">Suspendu</option></select></label>
        <div className="form-submit"><button className="primary" type="submit">{editing ? "Enregistrer" : "Créer le championnat"}</button></div>
      </form>
    </main>
  );
}

export function LeagueDetail() {
  const { id } = useParams();
  const league = useSelector(state => state.leagues.leagues.find(item => item.id === Number(id)));
  const clubs = useSelector(state => state.clubs.clubs);
  const matchs = useSelector(state => state.matchs.matchs);
  if (!league) return <Navigate to="/leagues" />;
  const leagueClubs = clubs.filter(club => club.leagueId === league.id);
  const leagueMatches = matchs.filter(match => match.leagueId === league.id);
  return (
    <main className="page detail-page">
      <Link className="back-link" to="/leagues"><FiArrowLeft /> Retour aux championnats</Link>
      <section className="detail-hero"><Crest name={league.name} size="xl" /><div><p className="eyebrow">{league.country}</p><h1>{league.name}</h1><p>{league.season} • Saison {league.year}</p></div><Link className="secondary" to={`/leagues/${id}/edit`}><FiEdit2 /> Modifier</Link></section>
      <section className="stats-grid detail-stats"><StatCard label="Matchs" value={leagueMatches.length} icon={<FiCalendar />} color="green" /><StatCard label="Clubs" value={leagueClubs.length} icon={<FiShield />} color="blue" /></section>
    </main>
  );
}
