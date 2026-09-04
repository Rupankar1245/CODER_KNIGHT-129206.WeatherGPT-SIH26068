import React, { useEffect, useRef, useState } from 'react';
import {
  Sprout,
  Plane,
  Waves,
  Building2,
  ArrowRight,
} from 'lucide-react';

type Sector = 'Agriculture' | 'Aviation' | 'Marine' | 'Urban';

const sectorData = {
  Agriculture: {
    icon: Sprout,
    title: 'Rainfall expected in next 24–48 hrs.',
    description:
      'Good time for transplanting Aman paddy in coastal regions.',
  },

  Aviation: {
    icon: Plane,
    title: 'Reduced visibility expected.',
    description:
      'Flight operations may experience delays during thunderstorms.',
  },

  Marine: {
    icon: Waves,
    title: 'Moderate sea conditions expected.',
    description:
      'Fishermen are advised to remain cautious near coastal waters.',
  },

  Urban: {
    icon: Building2,
    title: 'Waterlogging risk in low-lying areas.',
    description:
      'Residents should avoid flooded roads during peak rainfall.',
  },
};

const sectorColors: Record<
  Sector,
  {
    bg: string;
    border: string;
    text: string;
    shadow: string;
  }
> = {
  Agriculture: {
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.20)',
    text: '#34d399',
    shadow: 'rgba(16, 185, 129, 0.08)',
  },

  Aviation: {
    bg: 'rgba(56, 189, 248, 0.12)',
    border: 'rgba(56, 189, 248, 0.20)',
    text: '#38bdf8',
    shadow: 'rgba(56, 189, 248, 0.08)',
  },

  Marine: {
    bg: 'rgba(59, 130, 246, 0.12)',
    border: 'rgba(59, 130, 246, 0.20)',
    text: '#60a5fa',
    shadow: 'rgba(59, 130, 246, 0.08)',
  },

  Urban: {
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.20)',
    text: '#fbbf24',
    shadow: 'rgba(245, 158, 11, 0.08)',
  },
};

export const SectoralAdvisory: React.FC = () => {
  const [activeSector, setActiveSector] =
    useState<Sector>('Agriculture');

  const [isVisible, setIsVisible] = useState(false);

  const [contentKey, setContentKey] = useState(0);

  const cardRef = useRef<HTMLDivElement | null>(null);

  /*
   * =========================================
   * VIEWPORT OBSERVER
   * =========================================
   *
   * Card viewport-e dhukle:
   *   → card animation start
   *
   * Card viewport-er baire gele:
   *   → animation reset
   *
   * Tai revisit korle abar animation hobe.
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
        threshold: 0.3,
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
   * SECTOR CHANGE
   * =========================================
   *
   * Content key change kore content animation
   * abar fresh kore trigger kora hocche.
   */
  const handleSectorChange = (sector: Sector) => {
    if (sector === activeSector) {
      return;
    }

    setActiveSector(sector);

    setContentKey((prev) => prev + 1);
  };

  const advisory = sectorData[activeSector];

  const AdvisoryIcon = advisory.icon;

  const colors = sectorColors[activeSector];

  return (
    <div
      ref={cardRef}
      style={styles.card}
      className={
        isVisible
          ? 'sectoral-advisory-visible'
          : ''
      }
    >

      {/* =========================================
          ANIMATION STYLES
      ========================================= */}

      <style>
        {`

          /* =====================================
             CARD ENTRY
          ===================================== */

          @keyframes sectorCardEnter {

            from {
              opacity: 0;
              transform: translateY(12px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }

          }


          /* =====================================
             HEADER ENTRY
          ===================================== */

          @keyframes sectorHeaderEnter {

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
             TAB ENTRY
          ===================================== */

          @keyframes sectorTabsEnter {

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
             CONTENT ENTRY
          ===================================== */

          @keyframes sectorContentEnter {

            from {
              opacity: 0;
              transform: translateY(8px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }

          }


          /* =====================================
             ICON ENTRY
          ===================================== */

          @keyframes sectorIconEnter {

            0% {
              opacity: 0;
              transform: scale(0.82);
            }

            70% {
              opacity: 1;
              transform: scale(1.04);
            }

            100% {
              opacity: 1;
              transform: scale(1);
            }

          }


          /* =====================================
             ARROW
          ===================================== */

          @keyframes sectorArrowMove {

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
             DEFAULT CONTENT STATE
          ===================================== */

          .sector-content-animated {
            opacity: 0;
            transform: translateY(8px);
          }

          .sector-icon-animated {
            opacity: 0;
            transform: scale(0.82);
          }


          /* =====================================
             CARD ACTIVE
          ===================================== */

          .sectoral-advisory-visible {
            animation:
              sectorCardEnter
              0.8s
              cubic-bezier(0.22, 1, 0.36, 1)
              forwards;
          }


          /* =====================================
             HEADER
          ===================================== */

          .sectoral-advisory-visible
          .sector-header-animated {

            animation:
              sectorHeaderEnter
              0.65s
              cubic-bezier(0.22, 1, 0.36, 1)
              0.08s
              forwards;

          }


          /* =====================================
             TABS
          ===================================== */

          .sectoral-advisory-visible
          .sector-tabs-animated {

            animation:
              sectorTabsEnter
              0.65s
              cubic-bezier(0.22, 1, 0.36, 1)
              0.18s
              forwards;

          }


          /* =====================================
             CONTENT
          ===================================== */

          .sectoral-advisory-visible
          .sector-content-animated {

            animation:
              sectorContentEnter
              0.7s
              cubic-bezier(0.22, 1, 0.36, 1)
              0.32s
              forwards;

          }


          /* =====================================
             ICON
          ===================================== */

          .sectoral-advisory-visible
          .sector-icon-animated {

            animation:
              sectorIconEnter
              0.55s
              cubic-bezier(0.22, 1, 0.36, 1)
              0.42s
              forwards;

          }


          /* =====================================
             ARROW HOVER
          ===================================== */

          .sectoral-advisory-link:hover
          .sectoral-arrow {

            animation:
              sectorArrowMove
              0.8s
              ease-in-out
              infinite;

          }


          /* =====================================
             REDUCED MOTION
          ===================================== */

          @media (prefers-reduced-motion: reduce) {

            .sectoral-advisory-visible,
            .sectoral-advisory-visible
            .sector-header-animated,
            .sectoral-advisory-visible
            .sector-tabs-animated,
            .sectoral-advisory-visible
            .sector-content-animated,
            .sectoral-advisory-visible
            .sector-icon-animated {

              animation: none !important;

              opacity: 1 !important;

              transform: none !important;

            }

          }

        `}
      </style>


      {/* =========================================
          HEADER
      ========================================= */}

      <div
        style={styles.header}
        className="sector-header-animated"
      >

        <span style={styles.cardTitle}>
          Sectoral Advisory
        </span>

      </div>


      {/* =========================================
          SECTOR TABS
      ========================================= */}

      <div
        style={styles.tabsContainer}
        className="sector-tabs-animated"
      >

        {(Object.keys(sectorData) as Sector[]).map(
          (sector) => {

            const isActive =
              activeSector === sector;

            return (
              <button
                key={sector}
                onClick={() =>
                  handleSectorChange(sector)
                }
                style={{
                  ...styles.tab,

                  ...(isActive
                    ? styles.activeTab
                    : {}),
                }}
              >
                {sector}
              </button>
            );
          }
        )}

      </div>


      {/* =========================================
          ADVISORY CONTENT
      ========================================= */}

      <div
        key={contentKey}
        style={styles.content}
        className="sector-content-animated"
      >

        {/* Icon */}

        <div
          className="sector-icon-animated"
          style={{
            ...styles.iconWrapper,

            background: colors.bg,

            borderColor: colors.border,

            color: colors.text,

            boxShadow:
              `0 4px 15px ${colors.shadow}`,
          }}
        >

          <AdvisoryIcon
            size={24}
            strokeWidth={2}
          />

        </div>


        {/* Text */}

        <div style={styles.textContainer}>

          <p style={styles.title}>
            {advisory.title}
          </p>

          <p style={styles.description}>
            {advisory.description}
          </p>

        </div>

      </div>


      {/* =========================================
          FOOTER
      ========================================= */}

      <button
        style={styles.footerButton}
        className="sectoral-advisory-link"
      >

        <span>
          View All Advisories
        </span>

        <span
          className="sectoral-arrow"
          style={styles.arrow}
        >
          <ArrowRight size={14} />
        </span>

      </button>

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

    flexDirection: 'column',

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
     HEADER
  ========================================= */

  header: {
    display: 'flex',

    alignItems: 'center',

    marginBottom: '13px',
  },


  cardTitle: {
    fontSize: '16px',

    fontWeight: 600,

    color: '#ffffff',

    letterSpacing: '-0.2px',
  },


  /* =========================================
     TABS
  ========================================= */

  tabsContainer: {
    display: 'flex',

    alignItems: 'center',

    gap: '18px',

    borderBottom:
      '1px solid rgba(255, 255, 255, 0.10)',

    overflowX: 'auto',

    scrollbarWidth: 'none',
  },


  tab: {
    position: 'relative',

    padding: '0 0 9px',

    border: 'none',

    background: 'transparent',

    color: '#94a3b8',

    fontSize: '10px',

    fontWeight: 500,

    cursor: 'pointer',

    whiteSpace: 'nowrap',

    transition:
      'color 0.25s ease, transform 0.25s ease',
  },


  activeTab: {
    color: '#38bdf8',

    fontWeight: 600,

    transform: 'translateY(-1px)',
  },


  /* =========================================
     CONTENT
  ========================================= */

  content: {
    display: 'flex',

    alignItems: 'center',

    gap: '14px',

    flex: 1,

    marginTop: '20px',
  },


  /* =========================================
     ICON
  ========================================= */

  iconWrapper: {
    width: '48px',

    height: '48px',

    minWidth: '48px',

    borderRadius: '12px',

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',

    border:
      '1px solid transparent',
  },


  /* =========================================
     TEXT
  ========================================= */

  textContainer: {
    display: 'flex',

    flexDirection: 'column',

    minWidth: 0,
  },


  title: {
    margin: '0 0 6px',

    fontSize: '11px',

    fontWeight: 600,

    lineHeight: '1.4',

    color: '#e2e8f0',
  },


  description: {
    margin: 0,

    fontSize: '10px',

    fontWeight: 400,

    lineHeight: '1.5',

    color: '#94a3b8',
  },


  /* =========================================
     FOOTER
  ========================================= */

  footerButton: {
    marginTop: '12px',

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
};