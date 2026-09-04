import React, { useEffect, useRef, useState } from 'react';
import {
  CircleAlert,
  Waves,
  ThermometerSun,
  Zap,
  ArrowRight,
} from 'lucide-react';

interface DisasterItemProps {
  icon: React.ReactNode;
  title: string;
  status: string;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
  animationClass: string;
}

const DisasterItem: React.FC<DisasterItemProps> = ({
  icon,
  title,
  status,
  iconBg,
  iconBorder,
  iconColor,
  animationClass,
}) => {
  return (
    <div
      style={styles.disasterItem}
      className={`disaster-item-base ${animationClass}`}
    >
      <div
        style={{
          ...styles.iconWrapper,
          background: iconBg,
          border: `1px solid ${iconBorder}`,
          color: iconColor,
        }}
      >
        {icon}
      </div>

      <div style={styles.itemText}>
        <span style={styles.itemTitle}>
          {title}
        </span>

        <small style={styles.itemStatus}>
          {status}
        </small>
      </div>
    </div>
  );
};

export const DisasterMonitoring: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const cardRef = useRef<HTMLDivElement | null>(null);

  /*
   * =========================================
   * VIEWPORT OBSERVER
   * =========================================
   *
   * Card viewport-e dhukle:
   *   → animation start
   *
   * Card viewport-er baire gele:
   *   → animation reset
   *
   * Tai scroll kore abar revisit korle
   * animation abar replay hobe.
   */

  useEffect(() => {
    const currentCard = cardRef.current;

    if (!currentCard) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.25,
      }
    );

    observer.observe(currentCard);

    return () => {
      observer.unobserve(currentCard);
      observer.disconnect();
    };
  }, []);

  /*
   * =========================================
   * DISASTER DATA
   * =========================================
   */

  const disasterData = [
    {
      icon: <CircleAlert size={14} />,
      title: 'Cyclone Tracker',
      status: 'No active cyclone',
      iconBg: 'rgba(167, 139, 250, 0.14)',
      iconBorder: 'rgba(167, 139, 250, 0.18)',
      iconColor: '#a78bfa',
      animationClass: 'disaster-item-1',
    },

    {
      icon: <Waves size={14} />,
      title: 'Flood Monitoring',
      status: '2 districts at risk',
      iconBg: 'rgba(56, 189, 248, 0.14)',
      iconBorder: 'rgba(56, 189, 248, 0.18)',
      iconColor: '#38bdf8',
      animationClass: 'disaster-item-2',
    },

    {
      icon: <ThermometerSun size={14} />,
      title: 'Heatwave Tracker',
      status: 'No heatwave',
      iconBg: 'rgba(245, 158, 11, 0.14)',
      iconBorder: 'rgba(245, 158, 11, 0.18)',
      iconColor: '#f59e0b',
      animationClass: 'disaster-item-3',
    },

    {
      icon: <Zap size={14} />,
      title: 'Lightning Tracker',
      status: 'Moderate activity',
      iconBg: 'rgba(16, 185, 129, 0.14)',
      iconBorder: 'rgba(16, 185, 129, 0.18)',
      iconColor: '#34d399',
      animationClass: 'disaster-item-4',
    },
  ];

  return (
    <div
      ref={cardRef}
      style={styles.card}
      className={
        isVisible
          ? 'disaster-card-visible'
          : ''
      }
    >

      {/* =====================================
          ANIMATION STYLES
      ===================================== */}

      <style>
        {`

          /* =====================================
             CARD ENTRY
          ===================================== */

          @keyframes disasterCardEnter {

            from {
              opacity: 0;
              transform: translateY(14px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }

          }


          /* =====================================
             HEADER ENTRY
          ===================================== */

          @keyframes disasterHeaderEnter {

            from {
              opacity: 0;
              transform: translateY(5px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }

          }


          /* =====================================
             ITEM ENTRY
          ===================================== */

          @keyframes disasterItemEnter {

            from {
              opacity: 0;
              transform: translateX(-10px);
            }

            to {
              opacity: 1;
              transform: translateX(0);
            }

          }


          /* =====================================
             ICON ENTRY
          ===================================== */

          @keyframes disasterIconEnter {

            0% {
              opacity: 0;
              transform: scale(0.78);
            }

            70% {
              opacity: 1;
              transform: scale(1.05);
            }

            100% {
              opacity: 1;
              transform: scale(1);
            }

          }


          /* =====================================
             MAP ENTRY
          ===================================== */

          @keyframes disasterMapEnter {

            from {
              opacity: 0;
              transform: translateX(10px) scale(0.94);
            }

            to {
              opacity: 1;
              transform: translateX(0) scale(1);
            }

          }


          /* =====================================
             MAP DOT PULSE
          ===================================== */

          @keyframes disasterDotPulse {

            0%,
            100% {
              transform: scale(1);
              opacity: 0.85;
            }

            50% {
              transform: scale(1.15);
              opacity: 1;
            }

          }


          /* =====================================
             ARROW HOVER
          ===================================== */

          @keyframes disasterArrowMove {

            0% {
              transform: translateX(0);
            }

            50% {
              transform: translateX(3px);
            }

            100% {
              transform: translateX(0);
            }

          }


          /* =====================================
             DEFAULT STATES
          ===================================== */

          .disaster-item-base {
            opacity: 0;
            transform: translateX(-10px);
          }

          .disaster-map-box {
            opacity: 0;
            transform: translateX(10px) scale(0.94);
          }


          /* =====================================
             CARD
          ===================================== */

          .disaster-card-visible {

            animation:
              disasterCardEnter
              0.8s
              cubic-bezier(0.22, 1, 0.36, 1)
              forwards;

          }


          /* =====================================
             HEADER
          ===================================== */

          .disaster-card-visible
          .disaster-header-animated {

            animation:
              disasterHeaderEnter
              0.65s
              cubic-bezier(0.22, 1, 0.36, 1)
              0.08s
              forwards;

          }


          /* =====================================
             DISASTER ITEMS
          ===================================== */

          .disaster-card-visible
          .disaster-item-1 {

            animation:
              disasterItemEnter
              0.65s
              cubic-bezier(0.22, 1, 0.36, 1)
              0.18s
              forwards;

          }


          .disaster-card-visible
          .disaster-item-2 {

            animation:
              disasterItemEnter
              0.65s
              cubic-bezier(0.22, 1, 0.36, 1)
              0.30s
              forwards;

          }


          .disaster-card-visible
          .disaster-item-3 {

            animation:
              disasterItemEnter
              0.65s
              cubic-bezier(0.22, 1, 0.36, 1)
              0.42s
              forwards;

          }


          .disaster-card-visible
          .disaster-item-4 {

            animation:
              disasterItemEnter
              0.65s
              cubic-bezier(0.22, 1, 0.36, 1)
              0.54s
              forwards;

          }


          /* =====================================
             MAP
          ===================================== */

          .disaster-card-visible
          .disaster-map-box {

            animation:
              disasterMapEnter
              0.8s
              cubic-bezier(0.22, 1, 0.36, 1)
              0.28s
              forwards;

          }


          /* =====================================
             MAP DOTS
          ===================================== */

          .disaster-card-visible
          .disaster-map-dot {

            animation:
              disasterDotPulse
              2.8s
              ease-in-out
              infinite;

          }


          /* =====================================
             FOOTER ARROW
          ===================================== */

          .footer-dashboard-btn:hover
          .animated-arrow-icon {

            animation:
              disasterArrowMove
              0.8s
              ease-in-out
              infinite;

          }


          /* =====================================
             REDUCED MOTION
          ===================================== */

          @media (prefers-reduced-motion: reduce) {

            .disaster-card-visible,
            .disaster-card-visible
            .disaster-header-animated,
            .disaster-card-visible
            .disaster-item-1,
            .disaster-card-visible
            .disaster-item-2,
            .disaster-card-visible
            .disaster-item-3,
            .disaster-card-visible
            .disaster-item-4,
            .disaster-card-visible
            .disaster-map-box,
            .disaster-card-visible
            .disaster-map-dot {

              animation: none !important;

              opacity: 1 !important;

              transform: none !important;

            }

          }

        `}
      </style>


      {/* =========================================
          LEFT CONTENT
      ========================================= */}

      <div style={styles.leftSection}>

        {/* Header */}

        <div
          style={styles.header}
          className="disaster-header-animated"
        >

          <span style={styles.cardTitle}>
            Disaster Monitoring
          </span>

        </div>


        {/* Disaster List */}

        <div style={styles.disasterList}>

          {disasterData.map((item, index) => (
            <DisasterItem
              key={index}
              {...item}
            />
          ))}

        </div>


        {/* Footer */}

        <button
          style={styles.footerButton}
          className="footer-dashboard-btn"
        >

          <span>
            Open Disaster Dashboard
          </span>

          <span
            className="animated-arrow-icon"
            style={styles.arrow}
          >
            <ArrowRight size={14} />
          </span>

        </button>

      </div>


      {/* =========================================
          MAP SECTION
      ========================================= */}

      <div
        style={styles.mapSection}
        className="disaster-map-box"
      >

        <div style={styles.mapPlaceholder}>

          <span style={styles.mapLabel}>
            INDIA
          </span>


          {/* Map Dot 1 */}

          <div
            className="disaster-map-dot"
            style={{
              ...styles.mapDot,
              top: '30%',
              left: '52%',
            }}
          />


          {/* Map Dot 2 */}

          <div
            className="disaster-map-dot"
            style={{
              ...styles.mapDot,
              top: '52%',
              left: '43%',
              animationDelay: '0.5s',
            }}
          />


          {/* Map Dot 3 */}

          <div
            className="disaster-map-dot"
            style={{
              ...styles.mapDot,
              top: '68%',
              left: '58%',
              animationDelay: '1s',
            }}
          />

        </div>

      </div>

    </div>
  );
};


const styles: Record<string, React.CSSProperties> = {

  /* =========================================
     CARD
  ========================================= */

  card: {
    position: 'relative',

    borderRadius: '24px',

    padding: '20px 24px',

    display: 'flex',

    justifyContent: 'space-between',

    gap: '18px',

    minHeight: '230px',

    overflow: 'hidden',

    background:
      'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 100%)',

    backdropFilter: 'blur(20px)',

    WebkitBackdropFilter: 'blur(20px)',

    border:
      '1px solid rgba(255, 255, 255, 0.18)',

    boxShadow:
      '0 8px 32px 0 rgba(0, 0, 0, 0.2)',

    color: '#ffffff',
  },


  /* =========================================
     LEFT SECTION
  ========================================= */

  leftSection: {
    flex: 1,

    minWidth: 0,

    display: 'flex',

    flexDirection: 'column',
  },


  /* =========================================
     HEADER
  ========================================= */

  header: {
    display: 'flex',

    alignItems: 'center',

    marginBottom: '14px',
  },


  cardTitle: {
    fontSize: '16px',

    fontWeight: 600,

    color: '#ffffff',

    letterSpacing: '-0.2px',
  },


  /* =========================================
     DISASTER LIST
  ========================================= */

  disasterList: {
    display: 'flex',

    flexDirection: 'column',

    gap: '9px',

    flex: 1,
  },


  disasterItem: {
    display: 'flex',

    alignItems: 'center',

    gap: '9px',
  },


  /* =========================================
     ICON
  ========================================= */

  iconWrapper: {
    width: '27px',

    height: '27px',

    minWidth: '27px',

    borderRadius: '7px',

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',

    boxSizing: 'border-box',
  },


  /* =========================================
     ITEM TEXT
  ========================================= */

  itemText: {
    display: 'flex',

    flexDirection: 'column',

    minWidth: 0,
  },


  itemTitle: {
    fontSize: '10px',

    fontWeight: 600,

    lineHeight: '1.35',

    color: '#e2e8f0',
  },


  itemStatus: {
    marginTop: '2px',

    fontSize: '9px',

    fontWeight: 400,

    lineHeight: '1.3',

    color: '#94a3b8',
  },


  /* =========================================
     FOOTER
  ========================================= */

  footerButton: {
    marginTop: '10px',

    paddingTop: '11px',

    width: '100%',

    display: 'flex',

    alignItems: 'center',

    gap: '6px',

    border: 'none',

    borderTop:
      '1px solid rgba(255, 255, 255, 0.10)',

    background: 'transparent',

    color: '#38bdf8',

    fontSize: '11px',

    fontWeight: 600,

    cursor: 'pointer',

    textAlign: 'left',
  },


  arrow: {
    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',
  },


  /* =========================================
     MAP SECTION
  ========================================= */

  mapSection: {
    width: '115px',

    minWidth: '115px',

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',
  },


  mapPlaceholder: {
    position: 'relative',

    width: '100px',

    height: '155px',

    borderRadius: '14px',

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',

    overflow: 'hidden',

    background:
      'linear-gradient(145deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.025))',

    border:
      '1px solid rgba(255, 255, 255, 0.10)',

    boxShadow:
      'inset 0 0 25px rgba(255, 255, 255, 0.025)',
  },


  mapLabel: {
    fontSize: '15px',

    fontWeight: 800,

    letterSpacing: '2px',

    color:
      'rgba(203, 213, 225, 0.25)',
  },


  mapDot: {
    position: 'absolute',

    width: '8px',

    height: '8px',

    borderRadius: '50%',

    background: '#f97316',

    boxShadow:
      '0 0 0 4px rgba(249, 115, 22, 0.14), 0 0 12px rgba(249, 115, 22, 0.45)',
  },
};