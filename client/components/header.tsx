import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

interface HeaderProps {
  currentUser: { id: string; email: string } | null;
}

const Header = ({ currentUser }: HeaderProps) => {
  const router = useRouter();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  const isActive = (path: string) => router.pathname.startsWith(path);

  return (
    <nav className="nav">
      <Link href="/" className="nav-brand">
        <span className="nav-brand-icon">G</span>
        GetTix
      </Link>

      <ul className="nav-links">
        <li>
          <button
            id="theme-toggle"
            className="nav-link theme-icon-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <i className="fa-regular fa-moon" />
            ) : (
              <i className="fa-regular fa-sun" />
            )}
          </button>
        </li>
        {currentUser ? (
          <>
            <li>
              <Link
                href="/tickets"
                className={`nav-link ${isActive('/tickets') ? 'nav-link-active' : ''}`}
              >
                Tickets
              </Link>
            </li>
            <li>
              <Link
                href="/orders"
                className={`nav-link ${isActive('/orders') ? 'nav-link-active' : ''}`}
              >
                My Orders
              </Link>
            </li>
            <li>
              <Link href="/auth/signout" className="nav-link">
                Sign Out
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/auth/signin" className="nav-link">
                Sign In
              </Link>
            </li>
            <li>
              <Link href="/auth/signup" className="nav-link nav-link-accent">
                Sign Up
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Header;
