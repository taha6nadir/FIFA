import { FiChevronRight, FiPlus, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";

export function Crest({ name, color = "#173f35", size = "md" }) {
  const initials = String(name || "FC").split(" ").map(x => x[0]).join("").slice(0, 2).toUpperCase();
  return <span className={`crest crest-${size}`} style={{ "--crest": color }}>{initials}</span>;
}

export function PageHeader({ eyebrow, title, action, actionTo }) {
  return (
    <div className="page-header">
      <div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1></div>
      {action && <Link className="primary" to={actionTo}><FiPlus /> {action}</Link>}
    </div>
  );
}

export function Filters({ search, setSearch, filter, setFilter, filterLabel, options, sort, setSort }) {
  return (
    <div className="filters">
      <label className="search-field"><FiSearch /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." /></label>
      {options && (
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">{filterLabel}</option>
          {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      )}
      <select value={sort} onChange={e => setSort(e.target.value)}>
        <option value="asc">Ordre croissant</option>
        <option value="desc">Ordre décroissant</option>
      </select>
    </div>
  );
}

export function StatCard({ label, value, icon, color }) {
  return (
    <article className={`stat-card ${color}`}>
      <div className="stat-icon">{icon}</div>
      <div><span>{label}</span><strong>{value}</strong></div>
    </article>
  );
}

export function DetailsLink({ to, children }) {
  return <Link className="secondary" to={to}>{children} <FiChevronRight /></Link>;
}
