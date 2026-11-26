import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiCalendar, FiChevronRight, FiEdit2, FiShield } from "react-icons/fi";
import { Filters, PageHeader, StatCard } from "./ui";

const club = (clubs, id) => clubs.find(item => item.id === Number(id));

export function PlayersPage() {
  const players = useSelector(state => state.players.players);
  const clubs = useSelector(state => state.clubs.clubs);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("asc");
  const filtered = useMemo(() => players
    .filter(player => (!filter || player.clubId === Number(filter)) && player.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)), [players, search, filter, sort]);

  return (
    <main className="page">
      <PageHeader eyebrow="EFFECTIFS" title="Joueurs" action="Ajouter un joueur" actionTo="/addplayer" />
      <Filters search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} filterLabel="Tous les clubs" options={clubs.map(clubItem => ({ value: clubItem.id, label: clubItem.name }))} sort={sort} setSort={setSort} />
      <div className="section-count"><span>{filtered.length}</span> joueurs</div>
      <section className="card-grid player-grid">
        {filtered.map(player => {
          const clubItem = club(clubs, player.clubId);
          return (
            <article className="player-card" key={player.id}>
              <div className="player-card-head"><span className="player-avatar large">{player.name.split(" ").map(word => word[0]).join("")}</span><span className="shirt-number">#{player.number}</span></div>
              <div className="card-body"><p className="card-kicker">{player.position}</p><h3>{player.name}</h3><p className="muted">{clubItem?.name}</p><div className="card-actions"><Link className="icon-button" to={`/players/${player.id}/edit`}><FiEdit2 /></Link><Link className="secondary" to={`/players/${player.id}`}>Voir le profil <FiChevronRight /></Link></div></div>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export function PlayerForm({ editing = false }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const clubs = useSelector(state => state.clubs.clubs);
  const found = useSelector(state => state.players.players.find(player => player.id === Number(id)));
  const [form, setForm] = useState(editing && found ? found : { name: "", position: "Attaquant", clubId: clubs[0]?.id || 1, age: "", country: "", number: "", goals: 0, matches: 0, photo: "" });
  useEffect(() => { if (editing && found) setForm(found); }, [editing, found]);

  const submit = event => {
    event.preventDefault();
    dispatch({ type: editing ? "PLAYER_UPDATE" : "PLAYER_ADD", payload: { ...form, id: editing ? Number(id) : Date.now(), clubId: Number(form.clubId), age: Number(form.age), number: Number(form.number), goals: Number(form.goals || 0), matches: Number(form.matches || 0) } });
    navigate("/players");
  };

  return (
    <main className="page form-page">
      <Link className="back-link" to="/players"><FiArrowLeft /> Retour aux joueurs</Link>
      <PageHeader eyebrow={editing ? "MODIFIER" : "NOUVEAU"} title={editing ? "Modifier le joueur" : "Ajouter un joueur"} />
      <form className="editor-card" onSubmit={submit}>
        <div className="form-grid"><label>Nom complet<input value={form.name} onChange={event => setForm({...form, name: event.target.value})} required /></label><label>Club<select value={form.clubId} onChange={event => setForm({...form, clubId: event.target.value})}>{clubs.map(clubItem => <option key={clubItem.id} value={clubItem.id}>{clubItem.name}</option>)}</select></label></div>
        <div className="form-grid"><label>Position<select value={form.position} onChange={event => setForm({...form, position: event.target.value})}><option>Gardien</option><option>Défenseur</option><option>Milieu</option><option>Attaquant</option></select></label><label>Pays d’origine<input value={form.country} onChange={event => setForm({...form, country: event.target.value})} required /></label></div>
        <div className="form-grid"><label>Âge<input type="number" value={form.age} onChange={event => setForm({...form, age: event.target.value})} required /></label><label>Numéro<input type="number" value={form.number} onChange={event => setForm({...form, number: event.target.value})} required /></label></div>
        <label>URL de la photo<input value={form.photo || ""} onChange={event => setForm({...form, photo: event.target.value})} placeholder="https://..." /></label>
        <div className="form-submit"><button className="primary" type="submit">{editing ? "Enregistrer" : "Créer le joueur"}</button></div>
      </form>
    </main>
  );
}

export function PlayerDetail() {
  const { id } = useParams();
  const players = useSelector(state => state.players.players);
  const clubs = useSelector(state => state.clubs.clubs);
  const player = players.find(item => item.id === Number(id));
  if (!player) return <Navigate to="/players" />;
  const clubItem = club(clubs, player.clubId);
  return (
    <main className="page detail-page">
      <Link className="back-link" to="/players"><FiArrowLeft /> Retour aux joueurs</Link>
      <section className="detail-hero player-detail-hero"><span className="player-avatar profile">{player.name.split(" ").map(word => word[0]).join("")}</span><div><p className="eyebrow">{player.position} • #{player.number}</p><h1>{player.name}</h1><p>{player.country} • {clubItem?.name}</p></div><Link className="secondary" to={`/players/${id}/edit`}><FiEdit2 /> Modifier</Link></section>
      <section className="stats-grid detail-stats"><StatCard label="Matchs joués" value={player.matches || 0} icon={<FiCalendar />} color="green" /><StatCard label="Buts" value={player.goals || 0} icon={<FiShield />} color="gold" /></section>
    </main>
  );
}
