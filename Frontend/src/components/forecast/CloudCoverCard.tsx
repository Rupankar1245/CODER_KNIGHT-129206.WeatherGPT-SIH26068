import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import { Cloud, RefreshCw } from 'lucide-react';

/* =========================================================
   TYPES
========================================================= */

interface CloudCoverData {
  clouds: number | null;
  location?: {
    name?: string;
    country?: string;
  };
}

interface CurrentWeatherResponse {
  success: boolean;

  data?: CloudCoverData;

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

export const CloudCoverCard: React.FC = () => {

  const cardRef =
    useRef<HTMLDivElement | null>(null);

  /* =======================================================
     DATA STATE
  ======================================================= */

  const [
    cloudCover,
    setCloudCover,
  ] = useState<number | null>(null);

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
     FETCH CLOUD COVER
  ======================================================= */

  const fetchCloudCover = () => {

    setLoading(true);
    setError('');

    /*
     * Get user's real browser location.
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

          /*
           * Request goes to Django backend.
           *
           * Frontend does NOT call OpenWeather directly.
           */

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
             PARSE RESPONSE
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
              'Unable to load cloud cover data.'
            );
          }

          /* ---------------------------------------------
             VALIDATE CLOUD DATA
          --------------------------------------------- */

          if (
            !result.data ||
            result.data.clouds === null ||
            result.data.clouds === undefined
          ) {

            throw new Error(
              'Cloud cover data is unavailable.'
            );
          }

          /* ---------------------------------------------
             NORMALIZE CLOUD COVER
          --------------------------------------------- */

          const cloudValue =
            Number(result.data.clouds);

          if (
            !Number.isFinite(cloudValue)
          ) {

            throw new Error(
              'Invalid cloud cover value received from backend.'
            );
          }

          /*
           * OpenWeather cloud coverage is already
           * expressed as a percentage from 0 to 100.
           */

          const normalizedCloudCover =
            Math.min(
              Math.max(cloudValue, 0),
              100
            );

          /* ---------------------------------------------
             SET CLOUD COVER
          --------------------------------------------- */

          setCloudCover(
            Math.round(
              normalizedCloudCover
            )
          );

          /* ---------------------------------------------
             SET LOCATION
          --------------------------------------------- */

          if (result.data.location) {

            const name =
              result.data.location.name ||
              '';

            const country =
              result.data.location.country ||
              '';

            if (name && country) {

              setLocationName(
                `${name}, ${country}`
              );

            } else {

              setLocationName(name);
            }
          }

        } catch (err) {

          console.error(
            'MeghAI cloud cover error:',
            err
          );

          if (err instanceof Error) {

            setError(
              err.message ||
              'Unable to load cloud cover data.'
            );

          } else {

            setError(
              'Unable to load cloud cover data.'
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

        switch (geoError.code) {

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

    fetchCloudCover();

  }, []);

  /* =======================================================
     VIEWPORT ANIMATION
  ======================================================= */

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

          if (entry.isIntersecting) {

            /*
             * Only animate when actual data
             * is available.
             */

            if (
              cloudCover === null ||
              loading
            ) {
              return;
            }

            /*
             * Reset first so the animation
             * starts from zero every time
             * the card enters the viewport.
             */

            setAnimatedProgress(0);

            /*
             * Small delay allows the browser
             * to render the reset state first.
             */

            animationTimer =
              setTimeout(() => {

                setAnimatedProgress(
                  cloudCover
                );

              }, 100);

          } else {

            /*
             * Reset when the card leaves
             * the viewport.
             */

            if (animationTimer) {

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

      if (animationTimer) {

        clearTimeout(
          animationTimer
        );
      }

      observer.disconnect();
    };

  }, [
    cloudCover,
    loading,
  ]);

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

            <Cloud
              size={19}
              color="#38bdf8"
              strokeWidth={1.8}
            />

          </div>

          <div style={styles.titleSection}>

            <span style={styles.title}>
              Cloud Cover
            </span>

            <span style={styles.subtitle}>
              Sky coverage
            </span>

          </div>

        </div>

        <div style={styles.loadingContainer}>

          <div
            style={styles.loadingSpinner}
            className="cloud-cover-spinner"
          />

          <span>
            Loading cloud cover data...
          </span>

        </div>

        <style>
          {`
            @keyframes cloudCoverSpin {
              from {
                transform: rotate(0deg);
              }

              to {
                transform: rotate(360deg);
              }
            }

            .cloud-cover-spinner {
              animation:
                cloudCoverSpin
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

            <Cloud
              size={19}
              color="#38bdf8"
              strokeWidth={1.8}
            />

          </div>

          <div style={styles.titleSection}>

            <span style={styles.title}>
              Cloud Cover
            </span>

            <span style={styles.subtitle}>
              Sky coverage
            </span>

          </div>

        </div>

        <div style={styles.errorContainer}>

          <span style={styles.errorTitle}>
            Unable to load cloud cover data
          </span>

          <span style={styles.errorText}>
            {error}
          </span>

          <button
            onClick={fetchCloudCover}
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
     SAFE DISPLAY VALUE
  ======================================================= */

  const displayCloudCover =
    cloudCover ?? 0;

  /* =======================================================
     DESCRIPTION
  ======================================================= */

  const getDescription = () => {

    if (displayCloudCover < 20) {

      return 'Mostly clear skies expected';

    }

    if (displayCloudCover < 50) {

      return 'Partly cloudy skies expected';

    }

    if (displayCloudCover < 80) {

      return 'Mostly cloudy skies expected';

    }

    return 'Overcast skies expected';
  };

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

          <Cloud
            size={19}
            color="#38bdf8"
            strokeWidth={1.8}
          />

        </div>

        <div style={styles.titleSection}>

          <span style={styles.title}>
            Cloud Cover
          </span>

          <span style={styles.subtitle}>
            Sky coverage
          </span>

        </div>

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
          MAIN VALUE
      ================================================= */}

      <div style={styles.mainValue}>

        <span style={styles.value}>
          {animatedProgress}
        </span>

        <span style={styles.unit}>
          %
        </span>

      </div>


      {/* =================================================
          DESCRIPTION
      ================================================= */}

      <div style={styles.description}>

        <span style={styles.descriptionDot} />

        <span>
          {getDescription()}
        </span>

      </div>


      {/* =================================================
          CLOUD COVER GRAPH
      ================================================= */}

      <div style={styles.graphSection}>

        <div style={styles.graphHeader}>

          <span style={styles.graphLabel}>
            Cloud coverage
          </span>

          <span style={styles.graphValue}>
            {animatedProgress}%
          </span>

        </div>


        {/* GLASS PROGRESS TRACK */}

        <div style={styles.progressTrack}>

          <div
            style={{
              ...styles.progressBar,

              width:
                `${animatedProgress}%`,
            }}
          />

          <div
            style={{
              ...styles.progressMarker,

              left:
                `calc(${animatedProgress}% - 5px)`,
            }}
          />

        </div>


        {/* SCALE */}

        <div style={styles.scaleLabels}>

          <span>
            Clear
          </span>

          <span>
            50%
          </span>

          <span>
            Overcast
          </span>

        </div>

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
     CARD
  ===================================================== */

  card: {

    position: 'relative',

    width: '100%',

    minHeight: '145px',

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

    overflow:
      'hidden',
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

    borderRadius: '10px',

    background:
      'rgba(56,189,248,0.09)',

    border:
      '1px solid rgba(56,189,248,0.14)',

    boxShadow:
      '0 0 16px rgba(56,189,248,0.07)',
  },


  titleSection: {

    display: 'flex',

    flexDirection: 'column',

    gap: '3px',
  },


  title: {

    fontSize: '14px',

    fontWeight: 600,

    color: '#f8fafc',

    lineHeight: 1,
  },


  subtitle: {

    fontSize: '9px',

    color: '#64748b',
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
     MAIN VALUE
  ===================================================== */

  mainValue: {

    display: 'flex',

    alignItems: 'baseline',

    marginTop: '16px',

    lineHeight: 1,
  },


  value: {

    fontSize: '36px',

    fontWeight: 700,

    color: '#ffffff',

    letterSpacing: '-1px',

    textShadow:
      '0 3px 14px rgba(0,0,0,0.25)',

    fontVariantNumeric:
      'tabular-nums',
  },


  unit: {

    fontSize: '18px',

    fontWeight: 500,

    color: '#7dd3fc',

    marginLeft: '3px',
  },


  /* =====================================================
     DESCRIPTION
  ===================================================== */

  description: {

    display: 'flex',

    alignItems: 'center',

    gap: '6px',

    marginTop: '7px',

    fontSize: '10px',

    color: '#94a3b8',
  },


  descriptionDot: {

    width: '5px',

    height: '5px',

    flexShrink: 0,

    borderRadius: '50%',

    background: '#38bdf8',

    boxShadow:
      '0 0 7px rgba(56,189,248,0.65)',
  },


  /* =====================================================
     GRAPH
  ===================================================== */

  graphSection: {

    marginTop: '16px',
  },


  graphHeader: {

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'space-between',

    marginBottom: '7px',
  },


  graphLabel: {

    fontSize: '9px',

    color: '#64748b',
  },


  graphValue: {

    fontSize: '10px',

    fontWeight: 600,

    color: '#bae6fd',
  },


  /* =====================================================
     GLASS PROGRESS TRACK
  ===================================================== */

  progressTrack: {

    position: 'relative',

    width: '100%',

    height: '8px',

    borderRadius: '20px',

    background:
      'rgba(255,255,255,0.065)',

    border:
      '1px solid rgba(255,255,255,0.06)',

    boxShadow:
      'inset 0 1px 3px rgba(0,0,0,0.18)',

    overflow:
      'visible',
  },


  /* =====================================================
     GLASS PROGRESS BAR
  ===================================================== */

  progressBar: {

    position: 'relative',

    height: '100%',

    minWidth: '0',

    borderRadius: '20px',

    background:
      'linear-gradient(90deg, rgba(14,165,233,0.72), rgba(56,189,248,0.95))',

    boxShadow:
      '0 0 14px rgba(56,189,248,0.30)',

    transition:
      'width 1.2s cubic-bezier(0.34,1.25,0.64,1)',
  },


  /* =====================================================
     PROGRESS MARKER
  ===================================================== */

  progressMarker: {

    position: 'absolute',

    top: '50%',

    width: '10px',

    height: '10px',

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
};