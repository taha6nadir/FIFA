import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiBarChart2, FiCalendar, FiChevronRight, FiShield, FiUsers } from "react-icons/fi";
import { Crest, StatCard } from "./ui";

const club = (clubs, id) => clubs.find(item => item.id === Number(id));

export default function Home() {
  const leagues = useSelector(state => state.leagues.leagues);
  const clubs = useSelector(state => state.clubs.clubs);
  const players = useSelector(state => state.players.players);
  const matchs = useSelector(state => state.matchs.matchs);

  const upcoming = matchs
    .filter(match => match.status === "À venir")
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  return (
    <main className="page">
      <div className="dashboard-head">
        <div><p className="eyebrow">TABLEAU DE BORD</p><h1>Vue d’ensemble</h1></div>
        <div className="season-pill"><span /> Saison 2026—2027</div>
      </div>
      <section className="stats-grid">
        <StatCard label="Championnats" value={leagues.length} icon={<FiBarChart2 />} color="green" />
        <StatCard label="Clubs" value={clubs.length} icon={<FiShield />} color="blue" />
        <StatCard label="Matchs à venir" value={upcoming.length} icon={<FiCalendar />} color="gold" />
        <StatCard label="Joueurs" value={players.length} icon={<FiUsers />} color="red" />
      </section>
      <section className="panel upcoming-panel">
        <div className="panel-head">
          <div><p className="eyebrow">CALENDrier</p><h2>Matchs à venir</h2></div>
          <Link to="/matchs">Voir tous les matchs <FiChevronRight /></Link>
        </div>
        <div className="match-list">
          {upcoming.map(match => {
            const home = club(clubs, match.homeClubId);
            const away = club(clubs, match.awayClubId);
            return (
              <Link className="upcoming-row" to={`/matchs/${match.id}`} key={match.id}>
                <div className="match-date">
                  <b>{new Date(match.date).getDate()}</b>
                  <span>{new Intl.DateTimeFormat("fr-FR", { month: "short" }).format(new Date(match.date))}</span>
                </div>
                <div className="fixture">
                  <Crest name={home?.name} color={home?.color} /><b>{home?.name}</b><span>VS</span><b>{away?.name}</b><Crest name={away?.name} color={away?.color} />
                </div>
                <span className="match-status">À venir</span><FiChevronRight />
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export function About() {
  return (
    <main className="page about-page">
      <div className="about-hero"><p className="eyebrow">À PROPOS</p><h1>Le football mérite<br />une gestion à la hauteur.</h1></div>
      <section className="about-content">
        <div><span>01</span><h2>Une plateforme complète</h2><p>FIFA Manager centralise la gestion des championnats, des clubs, des joueurs et des rencontres dans un espace clair et moderne.</p></div>
        <div><span>02</span><h2>Conçue pour les administrateurs</h2><p>Chaque information est organisée pour faciliter le suivi de la saison, la programmation des matchs et l’administration des effectifs.</p></div>
      </section>
    </main>
  );
}
