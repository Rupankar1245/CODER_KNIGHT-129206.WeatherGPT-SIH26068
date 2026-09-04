import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Gauge,
  TrendingDown,
  TrendingUp,
  Minus,
  RefreshCw,
} from 'lucide-react';

/* =========================================================
   TYPES
========================================================= */

interface PressureData {
  pressure: number | null;
  pressureStatus?: string;
  pressureDescription?: string;
  pressureTrend?: string;
  location?: {
    name?: string;
    country?: string;
  };
}

interface CurrentWeatherResponse {
  success: boolean;

  data?: PressureData & {
    weather?: {
      pressure?: number | null;
    };
  };

  error?: string;
}

/* =========================================================
   CONFIG
========================================================= */

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  'http://127.0.0.1:8000';

/* =========================================================
   COMPONENT
========================================================= */

export const PressureCard: React.FC = () => {

  const cardRef =
    useRef<HTMLDivElement | null>(null);

  /* =======================================================
     DATA STATE
  ======================================================= */

  const [
    pressure,
    setPressure,
  ] = useState<number | null>(null);

  const [
    pressureStatus,
    setPressureStatus,
  ] = useState('Normal');

  const [
    pressureDescription,
    setPressureDescription,
  ] = useState(
    'Normal atmospheric pressure'
  );

  const [
    pressureTrend,
    setPressureTrend,
  ] = useState('stable');

  const [
    locationName,
    setLocationName,
  ] = useState('');

  /* =======================================================
     UI STATE
  ======================================================= */

  const [
    animatedProgress,
    setAnimatedProgress,
  ] = useState(0);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');

  /* =======================================================
     PRESSURE SCALE
  ======================================================= */

  const minPressure = 980;
  const maxPressure = 1040;

  /*
   * Calculate progress safely.
   *
   * This is ONLY used for the visual bar.
   * The actual pressure value always comes
   * from the backend.
   */

  const pressurePercentage =
    pressure !== null
      ? Math.min(
          Math.max(
            (
              (pressure - minPressure) /
              (maxPressure - minPressure)
            ) * 100,
            0
          ),
          100
        )
      : 0;

  /* =======================================================
     FETCH CURRENT WEATHER
  ======================================================= */

  const fetchPressure = async () => {

    setLoading(true);
    setError('');

    /*
     * IMPORTANT:
     *
     * The backend endpoint receives the user's
     * actual browser location.
     *
     * No Bhadreswar / Kalna coordinates are
     * hardcoded here.
     */

    if (!navigator.geolocation) {

      setLoading(false);

      setError(
        'Location services are not supported by this browser.'
      );

      return;
    }

    navigator.geolocation.getCurrentPosition(

      async (position) => {

        try {

          const latitude =
            position.coords.latitude;

          const longitude =
            position.coords.longitude;

          /* ---------------------------------------------
             DJANGO BACKEND REQUEST
          --------------------------------------------- */

          const url =
            `${BACKEND_URL}/api/weather/current/` +
            `?lat=${latitude}` +
            `&lon=${longitude}`;

          const response =
            await fetch(url);

          /* ---------------------------------------------
             HTTP ERROR
          --------------------------------------------- */

          if (!response.ok) {

            const errorData =
              await response
                .json()
                .catch(() => null);

            throw new Error(
              errorData?.error ||
              `Backend request failed (${response.status})`
            );
          }

          /* ---------------------------------------------
             RESPONSE
          --------------------------------------------- */

          const result:
            CurrentWeatherResponse =
            await response.json();

          /* ---------------------------------------------
             BACKEND ERROR
          --------------------------------------------- */

          if (!result.success) {

            throw new Error(
              result.error ||
              'Unable to load pressure data.'
            );
          }

          if (!result.data) {

            throw new Error(
              'Pressure data is unavailable.'
            );
          }

          /* ---------------------------------------------
             PRESSURE
          --------------------------------------------- */

          /*
           * Primary architecture:
           *
           * data.pressure
           *
           * Fallback:
           *
           * data.weather.pressure
           *
           * This makes the card compatible with the
           * standardized current_weather() response.
           */

          const backendPressure =
            result.data.pressure ??
            result.data.weather?.pressure ??
            null;

          if (
            backendPressure === null ||
            backendPressure === undefined
          ) {

            throw new Error(
              'Atmospheric pressure data is unavailable.'
            );
          }

          const numericPressure =
            Number(backendPressure);

          if (
            !Number.isFinite(
              numericPressure
            )
          ) {

            throw new Error(
              'Invalid atmospheric pressure received from backend.'
            );
          }

          /* ---------------------------------------------
             SET PRESSURE
          --------------------------------------------- */

          setPressure(
            numericPressure
          );

          /* ---------------------------------------------
             STATUS
          --------------------------------------------- */

          if (
            result.data.pressureStatus
          ) {

            setPressureStatus(
              result.data.pressureStatus
            );

          } else {

            /*
             * Calculate status from the real
             * backend pressure value.
             */

            if (
              numericPressure < 1000
            ) {

              setPressureStatus(
                'Low'
              );

            } else if (
              numericPressure > 1025
            ) {

              setPressureStatus(
                'High'
              );

            } else {

              setPressureStatus(
                'Normal'
              );
            }
          }

          /* ---------------------------------------------
             DESCRIPTION
          --------------------------------------------- */

          if (
            result.data.pressureDescription
          ) {

            setPressureDescription(
              result.data.pressureDescription
            );

          } else {

            if (
              numericPressure < 1000
            ) {

              setPressureDescription(
                'Below normal atmospheric pressure'
              );

            } else if (
              numericPressure > 1025
            ) {

              setPressureDescription(
                'Above normal atmospheric pressure'
              );

            } else {

              setPressureDescription(
                'Normal atmospheric pressure'
              );
            }
          }

          /* ---------------------------------------------
             TREND
          --------------------------------------------- */

          if (
            result.data.pressureTrend
          ) {

            setPressureTrend(
              result.data.pressureTrend
            );

          } else {

            /*
             * Current weather endpoint does not provide
             * historical pressure trend.
             *
             * Therefore we do NOT fake a falling/rising
             * value.
             */

            setPressureTrend(
              'stable'
            );
          }

          /* ---------------------------------------------
             LOCATION
          --------------------------------------------- */

          if (
            result.data.location
          ) {

            const name =
              result.data.location.name ||
              '';

            const country =
              result.data.location.country ||
              '';

            if (
              name &&
              country
            ) {

              setLocationName(
                `${name}, ${country}`
              );

            } else {

              setLocationName(
                name
              );
            }
          }

        } catch (err) {

          console.error(
            'MeghAI pressure error:',
            err
          );

          if (
            err instanceof Error
          ) {

            setError(
              err.message ||
              'Unable to load pressure data.'
            );

          } else {

            setError(
              'Unable to load pressure data.'
            );
          }

        } finally {

          setLoading(false);
        }
      },

      (geoError) => {

        console.error(
          'MeghAI location error:',
          geoError
        );

        setLoading(false);

        switch (
          geoError.code
        ) {

          case geoError.PERMISSION_DENIED:

            setError(
              'Location permission was denied.'
            );

            break;

          case geoError.POSITION_UNAVAILABLE:

            setError(
              'Unable to determine your location.'
            );

            break;

          case geoError.TIMEOUT:

            setError(
              'Location request timed out.'
            );

            break;

          default:

            setError(
              'Unable to access your location.'
            );
        }
      },

      {
        enableHighAccuracy: true,

        timeout: 10000,

        maximumAge: 300000,
      }
    );
  };

  /* =======================================================
     INITIAL FETCH
  ======================================================= */

  useEffect(() => {

    fetchPressure();

  }, []);

  /* =======================================================
     PRESSURE ANIMATION
  ======================================================= */

  /*
   * IMPORTANT FIX
   *
   * Animation is controlled by IntersectionObserver.
   *
   * Enter viewport:
   *     0% -> actual pressure position
   *
   * Leave viewport:
   *     reset to 0%
   *
   * Enter viewport again:
   *     animation plays again
   *
   * We intentionally DO NOT put pressurePercentage
   * in the dependency array.
   *
   * Otherwise every backend value update could recreate
   * the observer and interfere with the scroll animation.
   */

  useEffect(() => {

    const card =
      cardRef.current;

    if (!card) {
      return;
    }

    let animationTimer:
      ReturnType<typeof setTimeout> | null =
      null;

    const observer =
      new IntersectionObserver(
        ([entry]) => {

          if (
            entry.isIntersecting
          ) {

            /*
             * Cancel any previous animation timer.
             */

            if (
              animationTimer
            ) {

              clearTimeout(
                animationTimer
              );
            }

            /*
             * Reset immediately.
             */

            setAnimatedProgress(0);

            /*
             * Wait a tiny amount before applying
             * the actual progress.
             *
             * This guarantees the browser sees
             * 0% first and the CSS transition runs.
             */

            animationTimer =
              setTimeout(() => {

                setAnimatedProgress(
                  pressurePercentage
                );

              }, 100);

          } else {

            /*
             * Card has left viewport.
             *
             * Reset so the next viewport entry
             * starts the animation from 0 again.
             */

            if (
              animationTimer
            ) {

              clearTimeout(
                animationTimer
              );

              animationTimer = null;
            }

            setAnimatedProgress(0);
          }
        },
        {
          threshold: 0.3,
        }
      );

    observer.observe(card);

    return () => {

      if (
        animationTimer
      ) {

        clearTimeout(
          animationTimer
        );
      }

      observer.disconnect();
    };

  }, [pressurePercentage]);

  /* =======================================================
     STATUS
  ======================================================= */

  const getStatusColor = () => {

    switch (
      pressureStatus.toLowerCase()
    ) {

      case 'low':
        return '#7dd3fc';

      case 'high':
        return '#fbbf24';

      case 'normal':
        return '#86efac';

      default:
        return '#94a3b8';
    }
  };

  const statusColor =
    getStatusColor();

  /* =======================================================
     TREND ICON
  ======================================================= */

  const getTrendIcon = () => {

    const trend =
      pressureTrend.toLowerCase();

    if (
      trend.includes('fall') ||
      trend.includes('down') ||
      trend.includes('decreas')
    ) {

      return (
        <TrendingDown
          size={14}
          color="#f59e0b"
          strokeWidth={1.8}
        />
      );
    }

    if (
      trend.includes('rise') ||
      trend.includes('up') ||
      trend.includes('increas')
    ) {

      return (
        <TrendingUp
          size={14}
          color="#38bdf8"
          strokeWidth={1.8}
        />
      );
    }

    return (
      <Minus
        size={14}
        color="#94a3b8"
        strokeWidth={1.8}
      />
    );
  };

  /* =======================================================
     TREND TEXT
  ======================================================= */

  const getTrendText = () => {

    const trend =
      pressureTrend.toLowerCase();

    if (
      trend.includes('fall') ||
      trend.includes('down') ||
      trend.includes('decreas')
    ) {

      return 'Falling';
    }

    if (
      trend.includes('rise') ||
      trend.includes('up') ||
      trend.includes('increas')
    ) {

      return 'Rising';
    }

    return 'Stable';
  };

  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (loading) {

    return (

      <div
        ref={cardRef}
        style={styles.card}
      >

        <div style={styles.header}>

          <div style={styles.iconWrapper}>

            <Gauge
              size={20}
              color="#38bdf8"
              strokeWidth={1.8}
            />

          </div>

          <span style={styles.title}>
            Atmospheric Pressure
          </span>

        </div>

        <div style={styles.loadingContainer}>

          <div
            style={styles.loadingSpinner}
            className="pressure-spinner"
          />

          <span>
            Loading pressure data...
          </span>

        </div>

        <style>
          {`
            @keyframes pressureSpin {
              from {
                transform: rotate(0deg);
              }

              to {
                transform: rotate(360deg);
              }
            }

            .pressure-spinner {
              animation:
                pressureSpin
                0.9s
                linear
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
        ref={cardRef}
        style={styles.card}
      >

        <div style={styles.header}>

          <div style={styles.iconWrapper}>

            <Gauge
              size={20}
              color="#38bdf8"
              strokeWidth={1.8}
            />

          </div>

          <span style={styles.title}>
            Atmospheric Pressure
          </span>

        </div>

        <div style={styles.errorContainer}>

          <span style={styles.errorTitle}>
            Unable to load pressure data
          </span>

          <span style={styles.errorText}>
            {error}
          </span>

          <button
            onClick={fetchPressure}
            style={styles.retryButton}
          >

            <RefreshCw size={12} />

            <span>
              Retry
            </span>

          </button>

        </div>

      </div>
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (

    <div
      ref={cardRef}
      style={styles.card}
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div style={styles.header}>

        <div style={styles.iconWrapper}>

          <Gauge
            size={20}
            color="#38bdf8"
            strokeWidth={1.8}
          />

        </div>

        <span style={styles.title}>
          Atmospheric Pressure
        </span>

      </div>


      {/* =================================================
          LOCATION
      ================================================= */}

      {locationName && (

        <div style={styles.locationText}>
          {locationName}
        </div>

      )}


      {/* =================================================
          PRESSURE VALUE
      ================================================= */}

      <div style={styles.valueRow}>

        <span style={styles.value}>
          {pressure !== null
            ? pressure.toFixed(1)
            : '--'}
        </span>

        <span style={styles.unit}>
          hPa
        </span>

      </div>


      {/* =================================================
          PRESSURE BAR
      ================================================= */}

      <div style={styles.pressureSection}>

        <div style={styles.pressureHeader}>

          <span style={styles.pressureLabel}>
            Pressure level
          </span>

          <span style={styles.pressureValue}>
            {pressure !== null
              ? `${pressure.toFixed(1)} hPa`
              : '-- hPa'}
          </span>

        </div>


        {/* GLASS PROGRESS TRACK */}

        <div style={styles.pressureTrack}>

          {/* ANIMATED FILL */}

          <div
            style={{
              ...styles.pressureFill,

              width:
                `${animatedProgress}%`,
            }}
          />

          {/* ANIMATED MARKER */}

          <div
            style={{
              ...styles.pressureMarker,

              left:
                `calc(${animatedProgress}% - 4px)`,
            }}
          />

        </div>


        {/* SCALE */}

        <div style={styles.scaleLabels}>

          <span>
            Low
          </span>

          <span>
            Normal
          </span>

          <span>
            High
          </span>

        </div>

      </div>


      {/* =================================================
          STATUS
      ================================================= */}

      <div
        style={{
          ...styles.statusRow,

          color: statusColor,
        }}
      >

        {getTrendIcon()}

        <span>
          {getTrendText()}
        </span>

      </div>


      {/* =================================================
          DESCRIPTION
      ================================================= */}

      <div style={styles.normalText}>
        {pressureDescription}
      </div>


      {/* =================================================
          REFRESH
      ================================================= */}

      <button
        onClick={fetchPressure}
        style={styles.refreshButton}
        title="Refresh pressure"
      >

        <RefreshCw size={11} />

        <span>
          Refresh
        </span>

      </button>


      {/* =================================================
          SUBTLE GLASS GLOW
      ================================================= */}

      <div style={styles.bottomGlow} />

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
     CARD
  ===================================================== */

  card: {
    position: 'relative',

    width: '100%',

    minHeight: '180px',

    padding: '20px',

    boxSizing: 'border-box',

    borderRadius: '20px',

    background:
      'linear-gradient(145deg, rgba(255,255,255,0.10), rgba(255,255,255,0.035))',

    backdropFilter:
      'blur(20px)',

    WebkitBackdropFilter:
      'blur(20px)',

    border:
      '1px solid rgba(255,255,255,0.12)',

    boxShadow:
      '0 12px 35px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.06)',

    overflow: 'hidden',
  },


  /* =====================================================
     HEADER
  ===================================================== */

  header: {
    display: 'flex',

    alignItems: 'center',

    gap: '10px',
  },


  iconWrapper: {
    width: '36px',

    height: '36px',

    flexShrink: 0,

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',

    borderRadius: '11px',

    background:
      'rgba(56,189,248,0.09)',

    border:
      '1px solid rgba(56,189,248,0.14)',

    boxShadow:
      '0 0 16px rgba(56,189,248,0.07)',
  },


  title: {
    fontSize: '14px',

    fontWeight: 600,

    color: '#e2e8f0',

    letterSpacing: '-0.15px',
  },


  /* =====================================================
     LOCATION
  ===================================================== */

  locationText: {
    marginTop: '6px',

    marginLeft: '46px',

    fontSize: '9px',

    color: '#64748b',
  },


  /* =====================================================
     VALUE
  ===================================================== */

  valueRow: {
    display: 'flex',

    alignItems: 'baseline',

    marginTop: '17px',
  },


  value: {
    fontSize: '32px',

    fontWeight: 700,

    color: '#ffffff',

    lineHeight: 1,

    letterSpacing: '-0.8px',

    textShadow:
      '0 3px 14px rgba(0,0,0,0.22)',

    fontVariantNumeric:
      'tabular-nums',
  },


  unit: {
    fontSize: '13px',

    color: '#94a3b8',

    marginLeft: '6px',

    fontWeight: 500,
  },


  /* =====================================================
     PRESSURE SECTION
  ===================================================== */

  pressureSection: {
    marginTop: '18px',
  },


  pressureHeader: {
    display: 'flex',

    alignItems: 'center',

    justifyContent: 'space-between',

    marginBottom: '7px',
  },


  pressureLabel: {
    fontSize: '10px',

    color: '#94a3b8',
  },


  pressureValue: {
    fontSize: '10px',

    fontWeight: 600,

    color: '#bae6fd',

    fontVariantNumeric:
      'tabular-nums',
  },


  /* =====================================================
     PRESSURE TRACK
  ===================================================== */

  pressureTrack: {
    position: 'relative',

    width: '100%',

    height: '7px',

    borderRadius: '20px',

    background:
      'rgba(255,255,255,0.065)',

    border:
      '1px solid rgba(255,255,255,0.06)',

    boxShadow:
      'inset 0 1px 3px rgba(0,0,0,0.18)',

    overflow: 'visible',
  },


  /* =====================================================
     ANIMATED FILL
  ===================================================== */

  pressureFill: {
    position: 'relative',

    height: '100%',

    minWidth: '0',

    borderRadius: '20px',

    background:
      'linear-gradient(90deg, rgba(14,165,233,0.70), rgba(56,189,248,0.95))',

    boxShadow:
      '0 0 13px rgba(56,189,248,0.30)',

    transition:
      'width 1.2s cubic-bezier(0.34,1.25,0.64,1)',
  },


  /* =====================================================
     ANIMATED MARKER
  ===================================================== */

  pressureMarker: {
    position: 'absolute',

    top: '50%',

    width: '9px',

    height: '9px',

    transform:
      'translateY(-50%)',

    borderRadius: '50%',

    background:
      '#e0f2fe',

    border:
      '2px solid #38bdf8',

    boxShadow:
      '0 0 10px rgba(56,189,248,0.65)',

    transition:
      'left 1.2s cubic-bezier(0.34,1.25,0.64,1)',
  },


  /* =====================================================
     SCALE
  ===================================================== */

  scaleLabels: {
    display: 'flex',

    alignItems: 'center',

    justifyContent: 'space-between',

    marginTop: '6px',

    fontSize: '7px',

    color: '#64748b',
  },


  /* =====================================================
     STATUS
  ===================================================== */

  statusRow: {
    display: 'flex',

    alignItems: 'center',

    gap: '6px',

    marginTop: '13px',

    fontSize: '11px',
  },


  /* =====================================================
     DESCRIPTION
  ===================================================== */

  normalText: {
    marginTop: '5px',

    fontSize: '10px',

    color: '#64748b',
  },


  /* =====================================================
     LOCATION / REFRESH
  ===================================================== */

  refreshButton: {
    position: 'absolute',

    right: '16px',

    bottom: '12px',

    display: 'flex',

    alignItems: 'center',

    gap: '4px',

    background:
      'transparent',

    border: 'none',

    color: '#64748b',

    fontSize: '8px',

    cursor: 'pointer',

    padding: '3px 4px',
  },


  /* =====================================================
     LOADING
  ===================================================== */

  loadingContainer: {
    minHeight: '180px',

    display: 'flex',

    flexDirection: 'column',

    alignItems: 'center',

    justifyContent: 'center',

    gap: '10px',

    color: '#94a3b8',

    fontSize: '11px',
  },


  loadingSpinner: {
    width: '20px',

    height: '20px',

    borderRadius: '50%',

    border:
      '2px solid rgba(255,255,255,0.15)',

    borderTop:
      '2px solid #38bdf8',
  },


  /* =====================================================
     ERROR
  ===================================================== */

  errorContainer: {
    minHeight: '180px',

    display: 'flex',

    flexDirection: 'column',

    alignItems: 'center',

    justifyContent: 'center',

    gap: '6px',

    textAlign: 'center',
  },


  errorTitle: {
    color: '#f8fafc',

    fontSize: '12px',

    fontWeight: 600,
  },


  errorText: {
    color: '#94a3b8',

    fontSize: '9px',

    maxWidth: '270px',

    lineHeight: 1.5,
  },


  retryButton: {
    display: 'flex',

    alignItems: 'center',

    gap: '5px',

    marginTop: '8px',

    padding: '6px 11px',

    borderRadius: '10px',

    border:
      '1px solid rgba(56,189,248,0.3)',

    background:
      'rgba(56,189,248,0.1)',

    color: '#7dd3fc',

    fontSize: '9px',

    cursor: 'pointer',
  },


  /* =====================================================
     GLASS GLOW
  ===================================================== */

  bottomGlow: {
    position: 'absolute',

    left: '18%',

    right: '18%',

    bottom: '-38px',

    height: '65px',

    background:
      'radial-gradient(ellipse, rgba(56,189,248,0.10), transparent 70%)',

    pointerEvents: 'none',
  },
};
