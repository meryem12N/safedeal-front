import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IconBox, IconChevronDown } from './DashboardIcons';
import './SidebarTransactionsMenu.css';

function SidebarTransactionsMenu({ delay = 0 }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isTransactionsSection = location.pathname.startsWith('/transactions');
  const [open, setOpen] = useState(isTransactionsSection);

  return (
    <div className="stm-wrap">
      <button
        className={`ud-nav-item-full stm-trigger ${isTransactionsSection ? 'active' : ''}`}
        style={{ animationDelay: `${delay}s` }}
        type="button"
        onClick={() => setOpen((v) => !v)}
      >
        <IconBox /> <span>Transactions</span>
        <svg
          className={`stm-chevron ${open ? 'stm-chevron--open' : ''}`}
          viewBox="0 0 24 24" width="14" height="14" fill="none"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className="stm-submenu">
          <button
            className={`stm-subitem ${location.pathname === '/transactions/new' ? 'stm-subitem--active' : ''}`}
            type="button"
            onClick={() => navigate('/transactions/new')}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Nouvelle transaction</span>
          </button>
          <button
            className={`stm-subitem ${location.pathname === '/transactions' ? 'stm-subitem--active' : ''}`}
            type="button"
            onClick={() => navigate('/transactions')}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Toutes les transactions</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default SidebarTransactionsMenu;