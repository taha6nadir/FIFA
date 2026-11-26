import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiLogOut, FiShield } from "react-icons/fi";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  return (
    <header className="navbar">
      <Link className="brand" to="/">
        <span className="brand-mark"><FiShield /></span>
        <span>FIFA<span>Manager</span></span>
      </Link>
      <nav className="nav-links">
        <NavLink to="/">Accueil</NavLink>
        <NavLink to="/about">À propos</NavLink>
        <NavLink to="/leagues">Championnats</NavLink>
        <NavLink to="/clubs">Clubs</NavLink>
        <NavLink to="/matchs">Matchs</NavLink>
        <NavLink to="/players">Joueurs</NavLink>
      </nav>
      <div className="nav-user">
        <div className="avatar">{user?.prenom?.[0]}{user?.nom?.[0]}</div>
        <button className="logout" onClick={logout}><FiLogOut /> Déconnexion</button>
      </div>
    </header>
  );
}
