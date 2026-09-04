import React, { useEffect, useState } from 'react';

import {
  AlertTriangle,
  CloudRain,
  ShieldAlert,
  CloudLightning,
  Wind,
  ThermometerSun,
  Info,
  RefreshCw,
} from 'lucide-react';

/* =========================================================
   TYPES
   ========================================================= */

interface WeatherAlert {
  active: boolean;
  severity: string;
  event: string;
  description: string;
  weather_type: string;
  updated_at: string;
}

/* =========================================================
   CONFIG
   ========================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://127.0.0.1:8000';

const LATITUDE = 23.2194;
const LONGITUDE = 88.3500;

/* =========================================================
   COMPONENT
   ========================================================= */

export const WeatherAlertCard: React.FC = () => {

  const [alert, setAlert] =
    useState<WeatherAlert | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');


  /* =======================================================
     FETCH WEATHER ALERT
     ======================================================= */

  const fetchWeatherAlert = async () => {

    try {

      setLoading(true);
      setError('');


      const url =
        `${API_BASE_URL}/api/weather/alerts/` +
        `?lat=${LATITUDE}` +
        `&lon=${LONGITUDE}`;


      const response =
        await fetch(url);


      /* ===================================================
         HTTP ERROR
         =================================================== */

      if (!response.ok) {

        const errorData =
          await response
            .json()
            .catch(() => null);


        throw new Error(
          errorData?.error ||
          `Failed to fetch weather alert (${response.status})`
        );

      }


      /* ===================================================
         PARSE RESPONSE
         =================================================== */

      const data:
        WeatherAlert =
        await response.json();


      /* ===================================================
         VALIDATE RESPONSE
         =================================================== */

      if (
        typeof data.active !== 'boolean'
      ) {

        throw new Error(
          'Invalid weather alert response from backend.'
        );

      }


      /* ===================================================
         SET DATA
         =================================================== */

      setAlert(data);

    } catch (err) {

      console.error(
        'MeghAI weather alert error:',
        err
      );


      if (err instanceof Error) {

        setError(
          err.message ||
          'Unable to load weather alert.'
        );

      } else {

        setError(
          'Unable to load weather alert.'
        );

      }

    } finally {

      setLoading(false);

    }

  };


  /* =======================================================
     INITIAL LOAD + AUTO REFRESH
     ======================================================= */

  useEffect(() => {

    fetchWeatherAlert();


    const interval =
      setInterval(
        () => {

          fetchWeatherAlert();

        },
        5 * 60 * 1000
      );


    return () => {

      clearInterval(interval);

    };

  }, []);


  /* =======================================================
     WEATHER ICON
     ======================================================= */

  const getWeatherIcon = () => {

    if (!alert) {

      return (
        <Info
          size={20}
          color="#38bdf8"
        />
      );

    }


    const type =
      alert.weather_type?.toLowerCase() || '';


    /* THUNDER / STORM */

    if (
      type.includes('thunder') ||
      type.includes('storm')
    ) {

      return (
        <CloudLightning
          size={20}
          color="#a78bfa"
        />
      );

    }


    /* RAIN */

    if (
      type.includes('rain') ||
      type.includes('drizzle')
    ) {

      return (
        <CloudRain
          size={20}
          color="#38bdf8"
        />
      );

    }


    /* WIND */

    if (
      type.includes('wind')
    ) {

      return (
        <Wind
          size={20}
          color="#60a5fa"
        />
      );

    }


    /* HEAT */

    if (
      type.includes('heat') ||
      type.includes('temperature')
    ) {

      return (
        <ThermometerSun
          size={20}
          color="#fb923c"
        />
      );

    }


    /* DEFAULT */

    return (
      <Info
        size={20}
        color="#38bdf8"
      />
    );

  };


  /* =======================================================
     LOADING STATE — SKELETON
     ======================================================= */

  if (loading) {

    return (

      <div
        style={{
          ...styles.alertCard,
          ...styles.glassEffect,
        }}
      >

        {/* ===============================================
            HEADER SKELETON
            =============================================== */}

        <div style={styles.headerRow}>

          <div style={styles.titleWrapper}>

            <div
              className="weather-alert-skeleton"
              style={styles.skeletonIcon}
            />

            <div
              className="weather-alert-skeleton"
              style={styles.skeletonTitle}
            />

          </div>


          <div
            className="weather-alert-skeleton"
            style={styles.skeletonBadge}
          />

        </div>


        {/* ===============================================
            CONTENT SKELETON
            =============================================== */}

        <div style={styles.skeletonContent}>

          <div style={styles.skeletonMainInfo}>

            <div
              className="weather-alert-skeleton"
              style={styles.skeletonWeatherIcon}
            />

            <div
              className="weather-alert-skeleton"
              style={styles.skeletonEvent}
            />

          </div>


          <div
            className="weather-alert-skeleton"
            style={styles.skeletonLineLong}
          />

          <div
            className="weather-alert-skeleton"
            style={styles.skeletonLineMedium}
          />

          <div
            className="weather-alert-skeleton"
            style={styles.skeletonLineShort}
          />

        </div>


        {/* ===============================================
            FOOTER SKELETON
            =============================================== */}

        <div style={styles.skeletonFooter}>

          <div
            className="weather-alert-skeleton"
            style={styles.skeletonFooterLeft}
          />

          <div style={styles.skeletonFooterRight}>

            <div
              className="weather-alert-skeleton"
              style={styles.skeletonTimestamp}
            />

            <div
              className="weather-alert-skeleton"
              style={styles.skeletonRefresh}
            />

          </div>

        </div>


        {/* ===============================================
            SKELETON ANIMATION
            =============================================== */}

        <style>
          {`

            @keyframes weatherAlertSkeletonShimmer {

              0% {
                background-position:
                  -500px 0;
              }

              100% {
                background-position:
                  500px 0;
              }

            }


            .weather-alert-skeleton {

              background:
                linear-gradient(
                  90deg,
                  rgba(255,255,255,0.055) 0%,
                  rgba(255,255,255,0.12) 45%,
                  rgba(255,255,255,0.055) 100%
                );

              background-size:
                500px 100%;

              animation:
                weatherAlertSkeletonShimmer
                1.6s
                ease-in-out
                infinite;

            }

          `}
        </style>

      </div>

    );

  }


  /* =======================================================
     ERROR STATE
     ======================================================= */

  if (error) {

    return (

      <div
        style={{
          ...styles.alertCard,
          ...styles.glassEffect,
        }}
      >

        <div style={styles.headerRow}>

          <div style={styles.titleWrapper}>

            <div style={styles.iconContainer}>

              <AlertTriangle
                size={16}
                color="#f59e0b"
              />

            </div>


            <span style={styles.alertTitle}>
              Weather Alert
            </span>

          </div>

        </div>


        <div style={styles.errorContainer}>

          <span style={styles.errorTitle}>
            Alert unavailable
          </span>


          <span style={styles.errorText}>
            {error}
          </span>


          <button
            onClick={fetchWeatherAlert}
            style={styles.retryButton}
          >

            <RefreshCw
              size={12}
            />

            <span>
              Retry
            </span>

          </button>

        </div>

      </div>

    );

  }


  /* =======================================================
     NO ACTIVE ALERT
     ======================================================= */

  if (
    !alert ||
    !alert.active
  ) {

    return (

      <div
        style={{
          ...styles.alertCard,
          ...styles.glassEffect,
          border:
            '1px solid rgba(16, 185, 129, 0.18)',
        }}
      >

        {/* ===============================================
            HEADER
            =============================================== */}

        <div style={styles.headerRow}>

          <div style={styles.titleWrapper}>

            <div
              style={{
                ...styles.iconContainer,
                backgroundColor:
                  'rgba(16, 185, 129, 0.12)',
              }}
            >

              <ShieldAlert
                size={16}
                color="#10b981"
              />

            </div>


            <span
              style={{
                ...styles.alertTitle,
                color: '#10b981',
              }}
            >
              Weather Status
            </span>

          </div>


          <div
            style={{
              ...styles.liveBadge,
              color: '#34d399',
              backgroundColor:
                'rgba(16, 185, 129, 0.08)',
              border:
                '1px solid rgba(16, 185, 129, 0.22)',
            }}
          >

            <span
              style={{
                ...styles.staticDot,
                backgroundColor:
                  '#10b981',
              }}
            />

            <span>
              Normal
            </span>

          </div>

        </div>


        {/* ===============================================
            CONTENT
            =============================================== */}

        <div style={styles.contentBody}>

          <div style={styles.mainInfo}>

            <ShieldAlert
              size={20}
              color="#10b981"
            />

            <h4 style={styles.eventHeading}>
              No Active Weather Alerts
            </h4>

          </div>


          <p style={styles.alertText}>
            Weather conditions are currently
            normal in your area. MeghAI will
            notify you if a significant weather
            event is detected.
          </p>

        </div>


        {/* ===============================================
            FOOTER
            =============================================== */}

        <div style={styles.footerRow}>

          <div style={styles.metaItemGreen}>

            <ShieldAlert
              size={12}
              color="#10b981"
            />

            <span>
              Low Risk
            </span>

          </div>


          <div style={styles.footerRight}>

            <span style={styles.timestamp}>
              Updated just now
            </span>


            <button
              onClick={fetchWeatherAlert}
              style={styles.refreshButton}
              title="Refresh weather alert"
            >

              <RefreshCw
                size={11}
              />

            </button>

          </div>

        </div>

      </div>

    );

  }


  /* =======================================================
     ACTIVE ALERT
     ======================================================= */

  return (

    <>

      <style>
        {`

          @keyframes iconBlink {

            0%,
            100% {
              opacity: 1;
            }

            50% {
              opacity: 0.25;
            }

          }


          .weather-alert-refresh:hover {

            color:
              #38bdf8 !important;

            background:
              rgba(56, 189, 248, 0.08) !important;

          }

        `}
      </style>


      <div
        style={{
          ...styles.alertCard,
          ...styles.glassEffect,
          border:
            '1px solid rgba(245, 158, 11, 0.18)',
        }}
      >

        {/* ===============================================
            TOP HEADER
            =============================================== */}

        <div style={styles.headerRow}>

          <div style={styles.titleWrapper}>

            <div style={styles.iconContainer}>

              <AlertTriangle
                size={16}
                color="#f59e0b"
                style={{
                  animation:
                    'iconBlink 1.2s infinite ease-in-out',
                }}
              />

            </div>


            <span style={styles.alertTitle}>
              Severe Weather Alert
            </span>

          </div>


          <div style={styles.liveBadge}>

            <span style={styles.staticDot} />

            <span>
              Active
            </span>

          </div>

        </div>


        {/* ===============================================
            MAIN ALERT CONTENT
            =============================================== */}

        <div style={styles.contentBody}>

          <div style={styles.mainInfo}>

            {getWeatherIcon()}

            <h4 style={styles.eventHeading}>
              {alert.event}
            </h4>

          </div>


          <p style={styles.alertText}>
            {alert.description}
          </p>

        </div>


        {/* ===============================================
            FOOTER
            =============================================== */}

        <div style={styles.footerRow}>

          <div style={styles.metaItem}>

            <ShieldAlert
              size={12}
              color="#f59e0b"
            />

            <span>
              {alert.severity}
            </span>

          </div>


          <div style={styles.footerRight}>

            <span style={styles.timestamp}>
              Updated {alert.updated_at}
            </span>


            <button
              onClick={fetchWeatherAlert}
              style={styles.refreshButton}
              className="weather-alert-refresh"
              title="Refresh weather alert"
            >

              <RefreshCw
                size={11}
              />

            </button>

          </div>

        </div>

      </div>

    </>

  );

};


/* =========================================================
   STYLES
   ========================================================= */

const styles: Record<
  string,
  React.CSSProperties
> = {


  /* =======================================================
     CARD
     ======================================================= */

  alertCard: {

    position: 'relative',

    borderRadius: '20px',

    padding: '18px',

    minHeight: '250px',

    width: '100%',

    boxSizing: 'border-box',

    display: 'flex',

    flexDirection: 'column',

    justifyContent: 'space-between',

    overflow: 'hidden',

  },


  /* =======================================================
     GLASS EFFECT
     ======================================================= */

  glassEffect: {

    background:
      'linear-gradient(135deg, rgba(255,255,255,0.075) 0%, rgba(255,255,255,0.025) 100%)',

    backdropFilter:
      'blur(18px)',

    WebkitBackdropFilter:
      'blur(18px)',

    border:
      '1px solid rgba(255,255,255,0.10)',

    boxShadow:
      '0 8px 24px rgba(0,0,0,0.12)',

  },


  /* =======================================================
     HEADER
     ======================================================= */

  headerRow: {

    display: 'flex',

    justifyContent:
      'space-between',

    alignItems: 'center',

    gap: '8px',

  },


  titleWrapper: {

    display: 'flex',

    alignItems: 'center',

    gap: '8px',

    minWidth: 0,

  },


  iconContainer: {

    backgroundColor:
      'rgba(245,158,11,0.12)',

    padding: '6px',

    borderRadius: '10px',

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',

    flexShrink: 0,

  },


  alertTitle: {

    fontSize: '11px',

    fontWeight: 600,

    textTransform: 'uppercase',

    letterSpacing: '0.6px',

    color: '#f59e0b',

    whiteSpace: 'nowrap',

    overflow: 'hidden',

    textOverflow: 'ellipsis',

  },


  /* =======================================================
     ACTIVE BADGE
     ======================================================= */

  liveBadge: {

    display: 'flex',

    alignItems: 'center',

    gap: '6px',

    backgroundColor:
      'rgba(245,158,11,0.08)',

    padding: '3px 8px',

    borderRadius: '12px',

    fontSize: '10px',

    fontWeight: 600,

    color: '#fbbf24',

    border:
      '1px solid rgba(245,158,11,0.22)',

    flexShrink: 0,

  },


  staticDot: {

    width: '6px',

    height: '6px',

    borderRadius: '50%',

    backgroundColor:
      '#f59e0b',

  },


  /* =======================================================
     CONTENT
     ======================================================= */

  contentBody: {

    margin:
      '10px 0',

  },


  mainInfo: {

    display: 'flex',

    alignItems: 'center',

    gap: '8px',

    marginBottom: '6px',

  },


  eventHeading: {

    fontSize: '14px',

    fontWeight: 700,

    color: '#ffffff',

    margin: 0,

    lineHeight: 1.3,

  },


  alertText: {

    fontSize: '11.5px',

    color: '#94a3b8',

    lineHeight: '1.45',

    margin: 0,

  },


  /* =======================================================
     FOOTER
     ======================================================= */

  footerRow: {

    display: 'flex',

    justifyContent:
      'space-between',

    alignItems: 'center',

    gap: '10px',

    borderTop:
      '1px solid rgba(255,255,255,0.07)',

    paddingTop: '8px',

  },


  footerRight: {

    display: 'flex',

    alignItems: 'center',

    gap: '6px',

    minWidth: 0,

  },


  metaItem: {

    display: 'flex',

    alignItems: 'center',

    gap: '4px',

    fontSize: '10px',

    fontWeight: 600,

    color: '#fbbf24',

    whiteSpace: 'nowrap',

  },


  metaItemGreen: {

    display: 'flex',

    alignItems: 'center',

    gap: '4px',

    fontSize: '10px',

    fontWeight: 600,

    color: '#34d399',

    whiteSpace: 'nowrap',

  },


  timestamp: {

    fontSize: '10px',

    color: '#64748b',

    whiteSpace: 'nowrap',

    overflow: 'hidden',

    textOverflow: 'ellipsis',

  },


  refreshButton: {

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',

    width: '22px',

    height: '22px',

    padding: 0,

    borderRadius: '7px',

    border:
      '1px solid rgba(255,255,255,0.08)',

    background:
      'transparent',

    color: '#64748b',

    cursor: 'pointer',

    flexShrink: 0,

    transition:
      'color 0.2s ease, background 0.2s ease',

  },


  /* =======================================================
     SKELETON
     ======================================================= */

  skeletonIcon: {

    width: '28px',

    height: '28px',

    borderRadius: '10px',

    flexShrink: 0,

  },


  skeletonTitle: {

    width: '105px',

    height: '11px',

    borderRadius: '6px',

  },


  skeletonBadge: {

    width: '54px',

    height: '24px',

    borderRadius: '12px',

    flexShrink: 0,

  },


  skeletonContent: {

    flex: 1,

    display: 'flex',

    flexDirection: 'column',

    justifyContent: 'center',

    margin: '10px 0',

  },


  skeletonMainInfo: {

    display: 'flex',

    alignItems: 'center',

    gap: '8px',

    marginBottom: '13px',

  },


  skeletonWeatherIcon: {

    width: '20px',

    height: '20px',

    borderRadius: '7px',

    flexShrink: 0,

  },


  skeletonEvent: {

    width: '145px',

    height: '15px',

    borderRadius: '6px',

  },


  skeletonLineLong: {

    width: '100%',

    height: '10px',

    borderRadius: '6px',

    marginBottom: '8px',

  },


  skeletonLineMedium: {

    width: '84%',

    height: '10px',

    borderRadius: '6px',

    marginBottom: '8px',

  },


  skeletonLineShort: {

    width: '58%',

    height: '10px',

    borderRadius: '6px',

  },


  skeletonFooter: {

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'space-between',

    gap: '10px',

    borderTop:
      '1px solid rgba(255,255,255,0.07)',

    paddingTop: '8px',

  },


  skeletonFooterLeft: {

    width: '60px',

    height: '11px',

    borderRadius: '6px',

  },


  skeletonFooterRight: {

    display: 'flex',

    alignItems: 'center',

    gap: '8px',

  },


  skeletonTimestamp: {

    width: '75px',

    height: '10px',

    borderRadius: '6px',

  },


  skeletonRefresh: {

    width: '22px',

    height: '22px',

    borderRadius: '7px',

  },


  /* =======================================================
     ERROR
     ======================================================= */

  errorContainer: {

    flex: 1,

    display: 'flex',

    flexDirection: 'column',

    alignItems: 'center',

    justifyContent: 'center',

    gap: '7px',

    textAlign: 'center',

  },


  errorTitle: {

    color: '#f8fafc',

    fontSize: '13px',

    fontWeight: 600,

  },


  errorText: {

    color: '#94a3b8',

    fontSize: '10px',

    maxWidth: '280px',

    lineHeight: 1.4,

  },


  retryButton: {

    display: 'flex',

    alignItems: 'center',

    gap: '5px',

    marginTop: '7px',

    padding: '6px 12px',

    borderRadius: '9px',

    border:
      '1px solid rgba(56,189,248,0.3)',

    background:
      'rgba(56,189,248,0.1)',

    color: '#7dd3fc',

    fontSize: '10px',

    cursor: 'pointer',

  },

};