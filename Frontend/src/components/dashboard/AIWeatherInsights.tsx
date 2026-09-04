import React, { useEffect, useRef, useState } from 'react';
import {
  CloudRain,
  Sun,
  Umbrella,
  Sprout,
  ArrowRight,
} from 'lucide-react';

export const AIWeatherInsights: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const cardRef = useRef<HTMLDivElement | null>(null);

  /*
   * Observe card visibility.
   *
   * Outside viewport:
   *   → reset animation
   *
   * Inside viewport:
   *   → start animation
   *
   * This makes the animation replay every time
   * the user revisits the card.
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

  return (
    <div
      ref={cardRef}
      style={styles.card}
      className={isVisible ? 'weather-insights-visible' : ''}
    >

      <style>
        {`

          /* =========================================
             CARD ENTRY
          ========================================= */

          @keyframes insightsCardEnter {
            from {
              opacity: 0;
              transform: translateY(12px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }


          /* =========================================
             INSIGHT ITEM ENTRY
          ========================================= */

          @keyframes insightItemEnter {
            from {
              opacity: 0;
              transform: translateY(8px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }


          /* =========================================
             ICON ENTRY
          ========================================= */

          @keyframes insightIconEnter {
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


          /* =========================================
             LIVE DOT
          ========================================= */

          @keyframes liveDotPulse {
            0%,
            100% {
              opacity: 1;
              box-shadow: 0 0 6px rgba(56, 189, 248, 0.45);
            }

            50% {
              opacity: 0.65;
              box-shadow: 0 0 10px rgba(56, 189, 248, 0.7);
            }
          }


          /* =========================================
             ARROW HOVER
          ========================================= */

          @keyframes arrowMove {
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


          /* =========================================
             DEFAULT STATE
          ========================================= */

          .weather-insights-card-item {
            opacity: 0;
            transform: translateY(8px);
          }

          .weather-insights-card-icon {
            opacity: 0;
            transform: scale(0.82);
          }


          /* =========================================
             ACTIVE CARD
          ========================================= */

          .weather-insights-visible {
            animation:
              insightsCardEnter
              0.8s
              cubic-bezier(0.22, 1, 0.36, 1)
              forwards;
          }


          /* =========================================
             STAGGERED INSIGHTS
          ========================================= */

          .weather-insights-visible
          .insight-item-1 {
            animation:
              insightItemEnter
              0.75s
              cubic-bezier(0.22, 1, 0.36, 1)
              0.12s
              forwards;
          }

          .weather-insights-visible
          .insight-item-2 {
            animation:
              insightItemEnter
              0.75s
              cubic-bezier(0.22, 1, 0.36, 1)
              0.28s
              forwards;
          }

          .weather-insights-visible
          .insight-item-3 {
            animation:
              insightItemEnter
              0.75s
              cubic-bezier(0.22, 1, 0.36, 1)
              0.44s
              forwards;
          }

          .weather-insights-visible
          .insight-item-4 {
            animation:
              insightItemEnter
              0.75s
              cubic-bezier(0.22, 1, 0.36, 1)
              0.60s
              forwards;
          }


          /* =========================================
             ICON STAGGER
          ========================================= */

          .weather-insights-visible
          .insight-icon-1 {
            animation:
              insightIconEnter
              0.55s
              cubic-bezier(0.22, 1, 0.36, 1)
              0.18s
              forwards;
          }

          .weather-insights-visible
          .insight-icon-2 {
            animation:
              insightIconEnter
              0.55s
              cubic-bezier(0.22, 1, 0.36, 1)
              0.34s
              forwards;
          }

          .weather-insights-visible
          .insight-icon-3 {
            animation:
              insightIconEnter
              0.55s
              cubic-bezier(0.22, 1, 0.36, 1)
              0.50s
              forwards;
          }

          .weather-insights-visible
          .insight-icon-4 {
            animation:
              insightIconEnter
              0.55s
              cubic-bezier(0.22, 1, 0.36, 1)
              0.66s
              forwards;
          }


          /* =========================================
             LIVE INDICATOR
          ========================================= */

          .weather-insights-visible
          .weather-live-dot {
            animation:
              liveDotPulse
              2.8s
              ease-in-out
              infinite;
          }


          /* =========================================
             FOOTER HOVER
          ========================================= */

          .weather-insights-link:hover
          .weather-arrow {
            animation:
              arrowMove
              0.8s
              ease-in-out
              infinite;
          }


          /* =========================================
             ACCESSIBILITY
          ========================================= */

          @media (prefers-reduced-motion: reduce) {

            .weather-insights-visible,
            .weather-insights-visible .insight-item-1,
            .weather-insights-visible .insight-item-2,
            .weather-insights-visible .insight-item-3,
            .weather-insights-visible .insight-item-4,
            .weather-insights-visible .insight-icon-1,
            .weather-insights-visible .insight-icon-2,
            .weather-insights-visible .insight-icon-3,
            .weather-insights-visible .insight-icon-4,
            .weather-insights-visible .weather-live-dot {
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

      <div style={styles.header}>

        <span style={styles.cardTitle}>
          AI Weather Insights
        </span>

        <div style={styles.liveIndicator}>

          <span
            className="weather-live-dot"
            style={styles.liveDot}
          />

          <span style={styles.liveText}>
            Live AI
          </span>

        </div>

      </div>


      {/* =========================================
          INSIGHTS
      ========================================= */}

      <div style={styles.insightsList}>

        {/* Insight 1 */}

        <div
          style={styles.insightItem}
          className="weather-insights-card-item insight-item-1"
        >

          <div
            className="weather-insights-card-icon insight-icon-1"
            style={{
              ...styles.insightIcon,
              background: 'rgba(56, 189, 248, 0.14)',
              color: '#38bdf8',
              border:
                '1px solid rgba(56, 189, 248, 0.18)',
            }}
          >
            <CloudRain size={15} />
          </div>

          <p style={styles.insightText}>
            High chance of heavy rainfall in Kolkata and
            nearby districts over the next 24 hours.
            Stay cautious.
          </p>

        </div>


        {/* Insight 2 */}

        <div
          style={styles.insightItem}
          className="weather-insights-card-item insight-item-2"
        >

          <div
            className="weather-insights-card-icon insight-icon-2"
            style={{
              ...styles.insightIcon,
              background: 'rgba(245, 158, 11, 0.14)',
              color: '#f59e0b',
              border:
                '1px solid rgba(245, 158, 11, 0.18)',
            }}
          >
            <Sun size={15} />
          </div>

          <p style={styles.insightText}>
            Thunderstorm activity is likely during the
            afternoon and evening hours.
          </p>

        </div>


        {/* Insight 3 */}

        <div
          style={styles.insightItem}
          className="weather-insights-card-item insight-item-3"
        >

          <div
            className="weather-insights-card-icon insight-icon-3"
            style={{
              ...styles.insightIcon,
              background: 'rgba(16, 185, 129, 0.14)',
              color: '#10b981',
              border:
                '1px solid rgba(16, 185, 129, 0.18)',
            }}
          >
            <Umbrella size={15} />
          </div>

          <p style={styles.insightText}>
            Carry an umbrella and avoid waterlogged or
            low-lying areas during heavy rainfall.
          </p>

        </div>


        {/* Insight 4 */}

        <div
          style={styles.insightItem}
          className="weather-insights-card-item insight-item-4"
        >

          <div
            className="weather-insights-card-icon insight-icon-4"
            style={{
              ...styles.insightIcon,
              background: 'rgba(167, 139, 250, 0.14)',
              color: '#a78bfa',
              border:
                '1px solid rgba(167, 139, 250, 0.18)',
            }}
          >
            <Sprout size={15} />
          </div>

          <p style={styles.insightText}>
            Farmers are advised to postpone irrigation
            activities due to expected rainfall.
          </p>

        </div>

      </div>


      {/* =========================================
          FOOTER
      ========================================= */}

      <button
        style={styles.insightsLink}
        className="weather-insights-link"
      >

        <span>
          View Detailed Insights
        </span>

        <span
          className="weather-arrow"
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

    justifyContent: 'space-between',

    minHeight: '230px',

    overflow: 'hidden',

    background:
      'linear-gradient(135deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.05) 100%)',

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

    justifyContent: 'space-between',

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
     LIVE INDICATOR
  ========================================= */

  liveIndicator: {
    display: 'flex',

    alignItems: 'center',

    gap: '6px',

    background:
      'rgba(56, 189, 248, 0.1)',

    padding: '3px 8px',

    borderRadius: '12px',

    border:
      '1px solid rgba(56, 189, 248, 0.2)',
  },


  liveDot: {
    width: '6px',

    height: '6px',

    borderRadius: '50%',

    backgroundColor: '#38bdf8',

    boxShadow:
      '0 0 7px rgba(56, 189, 248, 0.55)',
  },


  liveText: {
    fontSize: '10px',

    fontWeight: 500,

    color: '#38bdf8',

    letterSpacing: '0.3px',
  },


  /* =========================================
     INSIGHTS LIST
  ========================================= */

  insightsList: {
    display: 'flex',

    flexDirection: 'column',

    gap: '10px',

    flex: 1,
  },


  /* =========================================
     INSIGHT ITEM
  ========================================= */

  insightItem: {
    display: 'flex',

    alignItems: 'flex-start',

    gap: '10px',
  },


  /* =========================================
     ICON
  ========================================= */

  insightIcon: {
    width: '28px',

    height: '28px',

    minWidth: '28px',

    borderRadius: '8px',

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',

    boxSizing: 'border-box',
  },


  /* =========================================
     TEXT
  ========================================= */

  insightText: {
    margin: '0',

    paddingTop: '2px',

    fontSize: '11px',

    lineHeight: '1.45',

    color: '#cbd5e1',

    fontWeight: 400,
  },


  /* =========================================
     FOOTER
  ========================================= */

  insightsLink: {
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