import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CloudSun,
  Map,
  Sparkles,
  MessageSquare,
  BriefcaseBusiness,
  ShieldAlert,
  Bell,
  // Bookmark,
  // Settings,
  Moon,
  Sun,
  ChevronDown,
} from 'lucide-react';

import logoImg from '../../assets/logo.png';

const menuItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Forecast',
    path: '/forecast',
    icon: CloudSun,
  },
  {
    label: 'Weather Maps',
    path: '/weather_maps',
    icon: Map,
  },
  {
    label: 'AI Insights',
    path: '/ai_insights',
    icon: Sparkles,
  },
  {
    label: 'AI Chat',
    path: '/ai_chat',
    icon: MessageSquare,
  },
  {
    label: 'Sectoral Advisory',
    path: '/sectoral_advisory',
    icon: BriefcaseBusiness,
  },
  {
    label: 'Disaster Monitoring',
    path: '/disaster_monitoring',
    icon: ShieldAlert,
  },
  {
    label: 'Alerts',
    path: '/alerts',
    icon: Bell,
  },
  // {
  //   label: 'Saved Locations',
  //   path: '/saved_locations',
  //   icon: Bookmark,
  // },
  // {
  //   label: 'Settings',
  //   path: '/settings',
  //   icon: Settings,
  // },
];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside style={styles.sidebar}>

      {/* ==================== BRAND / HEADER ==================== */}
      <div style={styles.brandContainer}>
        <div style={styles.logoWrapper}>
          <img
            src={logoImg}
            alt="MeghAI Logo"
            style={styles.logoImage}
          />
        </div>

        <span style={styles.brandName}>
          Megh<span style={{ color: '#38bdf8' }}>AI</span>
        </span>
      </div>

      {/* ==================== SCROLLABLE NAVIGATION ==================== */}
      <nav style={styles.navList}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <div
              key={item.label}
              onClick={() => navigate(item.path)}
              style={{
                ...styles.navItem,
                ...(isActive ? styles.activeNavItem : {}),
              }}
            >
              <Icon
                size={18}
                color={isActive ? '#38bdf8' : '#8a99ad'}
              />

              <span
                style={{
                  color: isActive ? '#ffffff' : '#8a99ad',
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </nav>

      {/* ==================== FOOTER ==================== */}
      <div style={styles.footer}>

        {/* Profile */}
        <div style={styles.profileBadge}>
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80"
            alt="Rahul Sharma"
            style={styles.avatar}
          />

          <div style={styles.profileText}>
            <span style={styles.userName}>
              Rahul Sharma
            </span>
          </div>

          <ChevronDown
            size={16}
            color="#8a99ad"
          />
        </div>

        {/* Theme */}
        <div style={styles.themeRow}>
          <span
            style={{
              fontSize: '13px',
              color: '#8a99ad',
            }}
          >
            Theme
          </span>

          <div style={styles.toggleContainer}>
            <Sun
              size={12}
              color="#8a99ad"
            />

            <div style={styles.toggleThumb} />

            <Moon
              size={12}
              color="#ffffff"
            />
          </div>
        </div>

      </div>
    </aside>
  );
};

const styles: Record<string, React.CSSProperties> = {

  /* ==================== SIDEBAR ==================== */

  sidebar: {
    width: '240px',

    backgroundColor: 'rgba(10, 16, 29, 0.45)',

    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',

    height: '100vh',

    display: 'flex',
    flexDirection: 'column',

    padding: '20px 16px',

    borderRight:
      '1px solid rgba(255, 255, 255, 0.1)',

    boxShadow:
      '4px 0 24px rgba(0, 0, 0, 0.15)',

    flexShrink: 0,

    position: 'sticky',
    top: 0,
    left: 0,

    zIndex: 10,
  },

  /* ==================== BRAND ==================== */

  brandContainer: {
    display: 'flex',
    alignItems: 'center',

    gap: '12px',

    padding: '0 8px 24px 8px',

    flexShrink: 0,
  },

  logoWrapper: {
    width: '38px',
    height: '38px',

    borderRadius: '10px',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    overflow: 'hidden',

    flexShrink: 0,
  },

  logoImage: {
    width: '100%',
    height: '100%',

    objectFit: 'contain',
  },

  brandName: {
    fontSize: '22px',
    fontWeight: 700,

    color: '#ffffff',

    letterSpacing: '-0.5px',
  },

  /* ==================== NAVIGATION ==================== */

  navList: {
    display: 'flex',
    flexDirection: 'column',

    gap: '4px',

    flex: 1,

    /*
     * Only the navigation section scrolls.
     */
    overflowY: 'auto',

    /*
     * Important for flex containers.
     */
    minHeight: 0,

    paddingRight: '4px',

    scrollbarWidth: 'thin',
    scrollbarColor:
      'rgba(148, 163, 184, 0.25) transparent',
  },

  navItem: {
    display: 'flex',
    alignItems: 'center',

    gap: '14px',

    padding: '11px 14px',

    borderRadius: '12px',

    cursor: 'pointer',

    fontSize: '14px',

    transition: 'all 0.2s ease',

    flexShrink: 0,
  },

  activeNavItem: {
    backgroundColor:
      'rgba(22, 40, 68, 0.7)',

    borderLeft:
      '3px solid #38bdf8',
  },

  /* ==================== FOOTER ==================== */

  footer: {
    display: 'flex',
    flexDirection: 'column',

    gap: '12px',

    paddingTop: '16px',

    borderTop:
      '1px solid rgba(255, 255, 255, 0.08)',

    flexShrink: 0,
  },

  /* ==================== PROFILE ==================== */

  profileBadge: {
    display: 'flex',

    alignItems: 'center',

    gap: '10px',

    padding: '8px 10px',

    backgroundColor:
      'rgba(20, 32, 53, 0.6)',

    borderRadius: '12px',

    border:
      '1px solid rgba(255, 255, 255, 0.05)',
  },

  avatar: {
    width: '32px',
    height: '32px',

    borderRadius: '50%',

    objectFit: 'cover',
  },

  profileText: {
    flex: 1,

    minWidth: 0,
  },

  userName: {
    fontSize: '13px',

    fontWeight: 500,

    color: '#f8fafc',

    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  /* ==================== THEME ==================== */

  themeRow: {
    display: 'flex',

    justifyContent: 'space-between',

    alignItems: 'center',

    padding: '0 4px',
  },

  toggleContainer: {
    width: '52px',
    height: '26px',

    borderRadius: '20px',

    backgroundColor:
      'rgba(26, 40, 61, 0.8)',

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'space-between',

    padding: '4px 6px',

    position: 'relative',
  },

  toggleThumb: {
    position: 'absolute',

    right: '3px',

    width: '20px',
    height: '20px',

    borderRadius: '50%',

    backgroundColor: '#38bdf8',

    boxShadow:
      '0 0 10px rgba(56, 189, 248, 0.35)',
  },
};