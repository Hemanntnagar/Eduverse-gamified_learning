import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import './Navbar.css';

const Navbar = () => {
  const { user } = useAuthStore();

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/dashboard" className="navbar-brand">
            <span className="brand-icon">🎓</span>
            EDUverse
          </Link>
          <div className="navbar-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/courses">Courses</Link>
            <Link to="/leaderboard">Leaderboard</Link>
            <Link to="/achievements">Achievements</Link>
            <Link to="/social">Social</Link>
            <span className="user-link">
              <span className="user-avatar">
                {user?.avatar || user?.username?.[0]?.toUpperCase() || '?'}
              </span>
              <span>Level {user?.level ?? '—'}</span>
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
