import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FiChevronRight, FiShield } from "react-icons/fi";

function AuthShowcase({ eyebrow, title }) {
  return (
    <section className="auth-showcase">
      <div className="auth-brand"><span className="brand-mark"><FiShield /></span><b>FIFA</b><span>Manager</span></div>
      <div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1></div>
      <div className="pitch-art"><div /><div /><span /></div>
    </section>
  );
}

export function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector(state => state.auth.users);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const submit = event => {
    event.preventDefault();
    const found = users.find(user => user.username === form.username && user.password === form.password);
    if (found) {
      dispatch({ type: "LOGIN_SUCCESS", payload: found });
      navigate("/");
    } else {
      setError("login ou mot de passe n’est pas valide");
    }
  };

  return (
    <main className="auth-page">
      <AuthShowcase eyebrow="SAISON 2026 / 2027" title={<>Toute la gestion du football,<br />en un seul endroit.</>} />
      <section className="auth-panel">
        <form className="auth-form" onSubmit={submit}>
          <p className="eyebrow">ESPACE ADMINISTRATION</p>
          <h2>Bon retour</h2>
          <p className="muted">Connectez-vous pour gérer vos compétitions.</p>
          {error && <div className="error-box">{error}</div>}
          <label>Nom d’utilisateur<input value={form.username} onChange={event => setForm({...form, username: event.target.value})} placeholder="admin" required /></label>
          <label>Mot de passe<input type="password" value={form.password} onChange={event => setForm({...form, password: event.target.value})} placeholder="••••••••" required /></label>
          <button className="primary wide" type="submit">Se connecter <FiChevronRight /></button>
          <p className="auth-link">Si vous n’êtes pas inscrit, <Link to="/register">inscrivez-vous maintenant !!!</Link></p>
          <small className="demo-hint">Compte test : admin / admin123</small>
        </form>
      </section>
    </main>
  );
}

export function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nom: "", prenom: "", username: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");

  const submit = event => {
    event.preventDefault();
    if (form.password !== form.confirm) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    dispatch({ type: "REGISTER_SUCCESS", payload: { nom: form.nom, prenom: form.prenom, username: form.username, email: form.email, password: form.password } });
    navigate("/login");
  };

  return (
    <main className="auth-page register-page">
      <AuthShowcase eyebrow="NOUVEAU COMPTE" title={<>Rejoignez le centre<br />de gestion.</>} />
      <section className="auth-panel">
        <form className="auth-form" onSubmit={submit}>
          <p className="eyebrow">CRÉER UN COMPTE</p><h2>Inscription</h2>
          {error && <div className="error-box">{error}</div>}
          <div className="form-grid">
            <label>Nom<input value={form.nom} onChange={event => setForm({...form, nom: event.target.value})} required /></label>
            <label>Prénom<input value={form.prenom} onChange={event => setForm({...form, prenom: event.target.value})} required /></label>
          </div>
          <label>Nom d’utilisateur<input value={form.username} onChange={event => setForm({...form, username: event.target.value})} required /></label>
          <label>Email<input type="email" value={form.email} onChange={event => setForm({...form, email: event.target.value})} required /></label>
          <div className="form-grid">
            <label>Mot de passe<input type="password" value={form.password} onChange={event => setForm({...form, password: event.target.value})} required /></label>
            <label>Confirmation<input type="password" value={form.confirm} onChange={event => setForm({...form, confirm: event.target.value})} required /></label>
          </div>
          <button className="primary wide" type="submit">S’inscrire <FiChevronRight /></button>
          <p className="auth-link">Déjà inscrit ? <Link to="/login">Se connecter</Link></p>
        </form>
      </section>
    </main>
  );
}
