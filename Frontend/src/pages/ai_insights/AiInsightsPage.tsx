import { useState } from 'react';

import {
  Sparkles,
  RefreshCw,
} from 'lucide-react';

import { Sidebar } from '../../components/dashboard/Sidebar';
import { Header } from '../../components/dashboard/Header';

import { AIWeatherSummary } from '../../components/ai_insights/AIWeatherSummary';
import { RiskDetection } from '../../components/ai_insights/RiskDetection';
import { AIForecastInsight } from '../../components/ai_insights/AIForecastInsight';
import { ExtremeWeatherAlert } from '../../components/ai_insights/ExtremeWeatherAlert';
import { WeatherAnomalyDetection } from '../../components/ai_insights/WeatherAnomalyDetection';
import { ActionRecommendations } from '../../components/ai_insights/ActionRecommendations';


/* =========================================================
   PAGE
========================================================= */

export const AIInsightPage: React.FC = () => {


  /* =======================================================
     REFRESH STATE
  ======================================================= */

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);


  /* =======================================================
     REFRESH HANDLER
  ======================================================= */

  const handleRefresh = () => {

    if (
      refreshing
    ) {
      return;
    }


    setRefreshing(
      true
    );


    window.setTimeout(
      () => {

        setRefreshing(
          false
        );

      },
      850
    );

  };


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <div
      style={styles.wrapper}
    >


      {/* ===================================================
          GLOBAL ANIMATIONS
      =================================================== */}

      <AIInsightsAnimation />


      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <Sidebar />


      {/* ===================================================
          MAIN CONTENT
      =================================================== */}

      <div
        style={styles.content}
      >


        {/* =================================================
            STICKY HEADER
        ================================================= */}

        <div
          style={styles.headerWrapper}
        >

          <Header />

        </div>


        {/* =================================================
            AI INSIGHTS CONTENT
        ================================================= */}

        <main
          style={styles.mainContent}
        >


          {/* ===============================================
              TOP STATUS BAR
          =============================================== */}

          <div
            style={styles.topNav}
          >


            {/* =============================================
                BRAND
            ============================================= */}

            <div
              style={styles.brandBadge}
            >


              <div
                style={styles.brandIconCircle}
              >

                <Sparkles
                  size={14}
                  aria-hidden="true"
                />

              </div>


              <span
                style={styles.brandText}
              >

                MEGHAI{' '}

                <strong
                  style={styles.brandTextStrong}
                >

                  AI ENGINE

                </strong>

              </span>

            </div>


            {/* =============================================
                STATUS ACTIONS
            ============================================= */}

            <div
              style={styles.statusGroup}
            >


              {/* LIVE STATUS */}

              <div
                style={styles.liveStatusPill}
              >

                <span
                  style={styles.liveDot}
                />

                <span>

                  Live Intelligence

                </span>

              </div>


              {/* REFRESH BUTTON */}

              <button
                type="button"
                style={{
                  ...styles.refreshButton,

                  opacity:
                    refreshing
                      ? 0.7
                      : 1,

                  cursor:
                    refreshing
                      ? 'wait'
                      : 'pointer',
                }}
                onClick={
                  handleRefresh
                }
                disabled={
                  refreshing
                }
                aria-label="Refresh AI insights"
              >

                <RefreshCw
                  size={13}
                  style={
                    refreshing
                      ? styles.spinningIcon
                      : undefined
                  }
                />


                <span>

                  {
                    refreshing
                      ? 'Refreshing'
                      : 'Refresh'
                  }

                </span>

              </button>

            </div>

          </div>


          


          {/* ===============================================
              AI INSIGHTS GRID

              ┌──────────────┬──────────────┬──────────────┐
              │      01      │      02      │      03      │
              ├──────────────┼──────────────┼──────────────┤
              │      04      │      05      │      06      │
              └──────────────┴──────────────┴──────────────┘
          =============================================== */}

          <section
            style={styles.insightsGrid}
            aria-label="Weather AI Capabilities"
          >


            {/* =============================================
                01 — AI WEATHER SUMMARY
            ============================================= */}

            <div
              style={styles.cardWrapper}
            >

              <AIWeatherSummary />

            </div>


            {/* =============================================
                02 — RISK DETECTION
            ============================================= */}

            <div
              style={styles.cardWrapper}
            >

              <RiskDetection />

            </div>


            {/* =============================================
                03 — AI FORECAST INSIGHT
            ============================================= */}

            <div
              style={styles.cardWrapper}
            >

              <AIForecastInsight />

            </div>


            {/* =============================================
                04 — EXTREME WEATHER ALERT
            ============================================= */}

            <div
              style={styles.cardWrapper}
            >

              <ExtremeWeatherAlert />

            </div>


            {/* =============================================
                05 — WEATHER ANOMALY DETECTION
            ============================================= */}

            <div
              style={styles.cardWrapper}
            >

              <WeatherAnomalyDetection />

            </div>


            {/* =============================================
                06 — ACTION RECOMMENDATIONS
            ============================================= */}

            <div
              style={styles.cardWrapper}
            >

              <ActionRecommendations />

            </div>

          </section>

        </main>

      </div>

    </div>

  );

};


/* =========================================================
   STYLES
========================================================= */

const styles: Record<
  string,
  React.CSSProperties
> = {


  /* =====================================================
     MAIN PAGE
  ===================================================== */

  wrapper: {

    display:
      'flex',

    width:
      '100%',

    height:
      '100vh',

    overflow:
      'hidden',

    background:
      'linear-gradient(135deg, #092242 0%, #082d54 30%, #0d4b75 65%, #004d64 100%)',

    color:
      '#ffffff',

  },


  /* =====================================================
     MAIN CONTENT
  ===================================================== */

  content: {

    flex:
      1,

    minWidth:
      0,

    height:
      '100vh',

    padding:
      '0 32px 24px',

    position:
      'relative',

    overflowY:
      'auto',

    overflowX:
      'hidden',

    boxSizing:
      'border-box',

  },


  /* =====================================================
     STICKY HEADER
  ===================================================== */

  headerWrapper: {

    position:
      'sticky',

    top:
      0,

    zIndex:
      1000,

    padding:
      '12px 0',

  },


  /* =====================================================
     MAIN AI INSIGHTS CONTENT
  ===================================================== */

  mainContent: {

    width:
      '100%',

    minHeight:
      'calc(100vh - 90px)',

    paddingBottom:
      '30px',

    boxSizing:
      'border-box',

  },


  /* =====================================================
     TOP STATUS NAVIGATION
  ===================================================== */

  topNav: {

    display:
      'flex',

    alignItems:
      'center',

    justifyContent:
      'space-between',

    gap:
      '20px',

    width:
      '100%',

    margin:
      '2px 0 22px',

    boxSizing:
      'border-box',

  },


  /* =====================================================
     BRAND BADGE
  ===================================================== */

  brandBadge: {

    display:
      'inline-flex',

    alignItems:
      'center',

    gap:
      '8px',

    flexShrink:
      0,

  },


  brandIconCircle: {

    display:
      'grid',

    placeItems:
      'center',

    width:
      '28px',

    height:
      '28px',

    borderRadius:
      '50%',

    background:
      'rgba(56, 189, 248, 0.12)',

    border:
      '1px solid rgba(56, 189, 248, 0.28)',

    color:
      '#38bdf8',

    boxSizing:
      'border-box',

  },


  brandText: {

    fontSize:
      '12px',

    letterSpacing:
      '0.13em',

    fontWeight:
      700,

    color:
      '#7dd3fc',

    whiteSpace:
      'nowrap',

  },


  brandTextStrong: {

    color:
      '#38bdf8',

    fontWeight:
      800,

  },


  /* =====================================================
     STATUS GROUP
  ===================================================== */

  statusGroup: {

    display:
      'flex',

    alignItems:
      'center',

    justifyContent:
      'flex-end',

    gap:
      '10px',

    flexWrap:
      'wrap',

  },


  /* =====================================================
     LIVE STATUS PILL
  ===================================================== */

  liveStatusPill: {

    display:
      'inline-flex',

    alignItems:
      'center',

    gap:
      '7px',

    padding:
      '6px 11px',

    borderRadius:
      '999px',

    background:
      'rgba(16, 185, 129, 0.10)',

    border:
      '1px solid rgba(16, 185, 129, 0.28)',

    color:
      '#a7f3d0',

    fontSize:
      '11px',

    fontWeight:
      600,

    whiteSpace:
      'nowrap',

  },


  liveDot: {

    width:
      '7px',

    height:
      '7px',

    flexShrink:
      0,

    borderRadius:
      '50%',

    background:
      '#10b981',

    boxShadow:
      '0 0 8px rgba(16, 185, 129, 0.85)',

    animation:
      'aiInsightsLivePulse 1.8s ease-in-out infinite',

  },


  /* =====================================================
     REFRESH BUTTON
  ===================================================== */

  refreshButton: {

    display:
      'inline-flex',

    alignItems:
      'center',

    gap:
      '6px',

    padding:
      '7px 10px',

    border:
      '1px solid rgba(255, 255, 255, 0.10)',

    background:
      'rgba(255, 255, 255, 0.05)',

    color:
      '#cbd5e1',

    fontSize:
      '11px',

    borderRadius:
      '9px',

    whiteSpace:
      'nowrap',

    transition:
      'all 0.2s ease',

  },


  spinningIcon: {

    animation:
      'aiInsightsSpin 0.85s linear infinite',

  },


  /* =====================================================
     HERO SECTION
  ===================================================== */

  heroSection: {

    width:
      '100%',

    margin:
      '0 0 26px',

    boxSizing:
      'border-box',

  },


  heroTitle: {

    display:
      'flex',

    alignItems:
      'center',

    gap:
      '10px',

    margin:
      '0 0 7px',

    color:
      '#ffffff',

    fontSize:
      '34px',

    fontWeight:
      700,

    letterSpacing:
      '-0.025em',

    lineHeight:
      1.2,

  },


  heroSparkle: {

    flexShrink:
      0,

    color:
      '#38bdf8',

    filter:
      'drop-shadow(0 0 10px rgba(56, 189, 248, 0.65))',

  },


  heroSubtitle: {

    margin:
      0,

    color:
      '#94a3b8',

    fontSize:
      '14px',

    lineHeight:
      1.5,

  },


  /* =====================================================
     INSIGHT GRID

     DESKTOP:
     3 COLUMNS
  ===================================================== */

  insightsGrid: {

    display:
      'grid',

    gridTemplateColumns:
      'repeat(3, minmax(0, 1fr))',

    gap:
      '20px',

    width:
      '100%',

    minWidth:
      0,

    alignItems:
      'stretch',

  },


  /* =====================================================
     CARD WRAPPER
  ===================================================== */

  cardWrapper: {

    width:
      '100%',

    minWidth:
      0,

    height:
      '100%',

    display:
      'flex',

    boxSizing:
      'border-box',

  },

};


/* =========================================================
   GLOBAL ANIMATIONS
========================================================= */

const AIInsightsAnimation: React.FC = () => {

  return (

    <style>

      {`

        /* ===============================================
           REFRESH SPIN
        =============================================== */

        @keyframes aiInsightsSpin {

          from {

            transform:
              rotate(0deg);

          }

          to {

            transform:
              rotate(360deg);

          }

        }


        /* ===============================================
           LIVE STATUS PULSE
        =============================================== */

        @keyframes aiInsightsLivePulse {

          0%,
          100% {

            opacity:
              0.55;

            transform:
              scale(0.9);

          }

          50% {

            opacity:
              1;

            transform:
              scale(1);

          }

        }


        /* ===============================================
           REFRESH BUTTON HOVER
        =============================================== */

        button[aria-label="Refresh AI insights"]:hover:not(:disabled) {

          background:
            rgba(
              255,
              255,
              255,
              0.10
            );

          border-color:
            rgba(
              56,
              189,
              248,
              0.35
            );

          color:
            #ffffff;

          transform:
            translateY(-1px);

        }


        /* ===============================================
           TABLET
        =============================================== */

        @media (
          max-width:
          1180px
        ) {

          section[aria-label="Weather AI Capabilities"] {

            grid-template-columns:
              repeat(
                2,
                minmax(
                  0,
                  1fr
                )
              ) !important;

          }

        }


        /* ===============================================
           MOBILE
        =============================================== */

        @media (
          max-width:
          760px
        ) {

          section[aria-label="Weather AI Capabilities"] {

            grid-template-columns:
              1fr !important;

          }

        }


        /* ===============================================
           SMALL MOBILE
        =============================================== */

        @media (
          max-width:
          600px
        ) {

          main {

            padding-bottom:
              20px;

          }

        }

      `}

    </style>

  );

};
