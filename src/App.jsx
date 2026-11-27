import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { fetchFootballData } from "./store/store";
import Navbar from "./components/Navbar";
import { Login, Register } from "./components/Auth";
import Home, { About } from "./components/Home";
import { LeaguesPage, LeagueForm, LeagueDetail } from "./components/Leagues";
import { ClubsPage, ClubForm, ClubDetail } from "./components/Clubs";
import { PlayersPage, PlayerForm, PlayerDetail } from "./components/Players";
import { MatchesPage, MatchForm, MatchDetail } from "./components/Matches";
import "./App.css";

function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  }, [dispatch, navigate]);
  return null;
}

function AppContent() {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const pathname = window.location.pathname;
  const authPage = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchFootballData());
  }, [dispatch, isAuthenticated]);

  return (
    <>
      {isAuthenticated && !authPage && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/leagues" element={<LeaguesPage />} />
              <Route path="/leagues/:id" element={<LeagueDetail />} />
              <Route path="/addLeague" element={<LeagueForm />} />
              <Route path="/leagues/:id/edit" element={<LeagueForm editing />} />
              <Route path="/clubs" element={<ClubsPage />} />
              <Route path="/clubs/:id" element={<ClubDetail />} />
              <Route path="/addclub" element={<ClubForm />} />
              <Route path="/clubs/:id/edit" element={<ClubForm editing />} />
              <Route path="/players" element={<PlayersPage />} />
              <Route path="/players/:id" element={<PlayerDetail />} />
              <Route path="/addplayer" element={<PlayerForm />} />
              <Route path="/players/:id/edit" element={<PlayerForm editing />} />
              <Route path="/matchs" element={<MatchesPage />} />
              <Route path="/matchs/:id" element={<MatchDetail />} />
              <Route path="/addMatch" element={<MatchForm />} />
              <Route path="/matchs/:id/edit" element={<MatchForm editing />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
