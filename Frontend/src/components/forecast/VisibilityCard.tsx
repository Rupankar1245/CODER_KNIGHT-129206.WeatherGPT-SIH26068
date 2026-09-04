import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import { Eye, RefreshCw } from 'lucide-react';

/* =========================================================
   TYPES
========================================================= */

interface VisibilityData {
  visibility: number | null;
  visibilityStatus?: string;
  visibilityDescription?: string;

  location?: {
    name?: string;
    country?: string;
  };
}

interface CurrentWeatherResponse {
  success: boolean;
  data?: VisibilityData;
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

export const VisibilityCard: React.FC = () => {

  const cardRef =
    useRef<HTMLDivElement | null>(null);

  /* =======================================================
     DATA STATE
  ======================================================= */

  const [
    visibility,
    setVisibility,
  ] = useState<number | null>(null);

  const [
    visibilityStatus,
    setVisibilityStatus,
  ] = useState('Loading...');

  const [
    visibilityDescription,
    setVisibilityDescription,
  ] = useState(
    'Loading visibility data...'
  );

  const [
    locationName,
    setLocationName,
  ] = useState('');

  /* =======================================================
     UI STATE
  ======================================================= */

  const [
    animatedVisibility,
    setAnimatedVisibility,
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
     ANIMATION STATE
  ======================================================= */

  const [
    isCardVisible,
    setIsCardVisible,
  ] = useState(false);

  /* =======================================================
     VISIBILITY STATUS HELPER
  ======================================================= */

  const getVisibilityInfo = (
    value: number
  ) => {

    if (value >= 10) {
      return {
        status: 'Excellent',
        description:
          'Excellent visibility with clear atmospheric conditions.',
      };
    }

    if (value >= 7) {
      return {
        status: 'Good',
        description:
          'Good visibility with generally clear conditions.',
      };
    }

    if (value >= 4) {
      return {
        status: 'Moderate',
        description:
          'Moderate visibility. Distant objects may appear slightly unclear.',
      };
    }

    if (value >= 1) {
      return {
        status: 'Poor',
        description:
          'Reduced visibility. Extra caution is recommended while travelling.',
      };
    }

    return {
      status: 'Very Poor',
      description:
        'Very poor visibility. Travel conditions may be hazardous.',
    };
  };

  /* =======================================================
     FETCH VISIBILITY
  ======================================================= */

  const fetchVisibility = () => {

    setLoading(true);
    setError('');

    setAnimatedVisibility(0);

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
              'Unable to load visibility data.'
            );
          }

          /* ---------------------------------------------
             VALIDATE DATA
          --------------------------------------------- */

          if (
            !result.data ||
            result.data.visibility === null ||
            result.data.visibility === undefined
          ) {

            throw new Error(
              'Visibility data is unavailable.'
            );
          }

          /*
           * Backend may return visibility in metres
           * or kilometres.
           *
           * OpenWeather normally returns metres.
           *
           * Example:
           * 10000 = 10 km
           */

          const rawVisibility =
            Number(
              result.data.visibility
            );

          const visibilityKm =
            rawVisibility > 100
              ? rawVisibility / 1000
              : rawVisibility;

          /*
           * Round to one decimal place.
           */

          const formattedVisibility =
            Math.round(
              visibilityKm * 10
            ) / 10;

          /* ---------------------------------------------
             SET VISIBILITY
          --------------------------------------------- */

          setVisibility(
            formattedVisibility
          );

          /* ---------------------------------------------
             CALCULATE STATUS
          --------------------------------------------- */

          const calculatedInfo =
            getVisibilityInfo(
              formattedVisibility
            );

          /*
           * Use backend status if valid.
           *
           * Otherwise automatically calculate it.
           */

          setVisibilityStatus(
            result.data.visibilityStatus?.trim() ||
            calculatedInfo.status
          );

          /*
           * Use backend description if valid.
           *
           * Otherwise automatically generate it.
           */

          setVisibilityDescription(
            result.data.visibilityDescription?.trim() ||
            calculatedInfo.description
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

          } else {

            setLocationName('');
          }

        } catch (err) {

          console.error(
            'MeghAI visibility error:',
            err
          );

          if (err instanceof Error) {

            setError(
              err.message ||
              'Unable to load visibility data.'
            );

          } else {

            setError(
              'Unable to load visibility data.'
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

    fetchVisibility();

  }, []);

  /* =======================================================
     VIEWPORT OBSERVER
  ======================================================= */

  useEffect(() => {

    const element =
      cardRef.current;

    if (!element) {
      return;
    }

    const observer =
      new IntersectionObserver(

        ([entry]) => {

          setIsCardVisible(
            entry.isIntersecting
          );

        },

        {
          threshold: 0.3,
        }
      );

    observer.observe(element);

    return () => {

      observer.disconnect();

    };

  }, []);

  /* =======================================================
     VISIBILITY ANIMATION
  ======================================================= */

  useEffect(() => {

    if (
      visibility === null ||
      loading ||
      error
    ) {

      setAnimatedVisibility(0);

      return;
    }

    if (!isCardVisible) {

      setAnimatedVisibility(0);

      return;
    }

    setAnimatedVisibility(0);

    const timer =
      setTimeout(() => {

        setAnimatedVisibility(
          visibility
        );

      }, 100);

    return () => {

      clearTimeout(timer);

    };

  }, [
    visibility,
    loading,
    error,
    isCardVisible,
  ]);

  /* =======================================================
     STATUS COLOR
  ======================================================= */

  const getStatusColor = () => {

    switch (
      visibilityStatus.toLowerCase()
    ) {

      case 'excellent':
        return '#86efac';

      case 'good':
        return '#7dd3fc';

      case 'moderate':
        return '#fde68a';

      case 'poor':
        return '#fdba74';

      case 'very poor':
        return '#fca5a5';

      default:
        return '#94a3b8';
    }
  };

  const statusColor =
    getStatusColor();

  /* =======================================================
     PROGRESS
  ======================================================= */

  const MAX_VISIBILITY = 10;

  const progressPercentage =
    visibility !== null
      ? Math.min(
          Math.max(
            (
              animatedVisibility /
              MAX_VISIBILITY
            ) * 100,
            0
          ),
          100
        )
      : 0;

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

          <div style={styles.titleSection}>

            <div style={styles.iconWrapper}>

              <Eye
                size={19}
                color="#38bdf8"
                strokeWidth={1.8}
              />

            </div>

            <div>

              <h3 style={styles.title}>
                Visibility
              </h3>

              <span style={styles.subtitle}>
                Atmospheric visibility
              </span>

            </div>

          </div>

        </div>

        <div style={styles.loadingContainer}>

          <div
            style={styles.loadingSpinner}
            className="visibility-spinner"
          />

          <span>
            Loading visibility data...
          </span>

        </div>

        <style>
          {`
            @keyframes visibilitySpin {
              from {
                transform: rotate(0deg);
              }

              to {
                transform: rotate(360deg);
              }
            }

            .visibility-spinner {
              animation:
                visibilitySpin
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

          <div style={styles.titleSection}>

            <div style={styles.iconWrapper}>

              <Eye
                size={19}
                color="#38bdf8"
                strokeWidth={1.8}
              />

            </div>

            <div>

              <h3 style={styles.title}>
                Visibility
              </h3>

              <span style={styles.subtitle}>
                Atmospheric visibility
              </span>

            </div>

          </div>

        </div>

        <div style={styles.errorContainer}>

          <span style={styles.errorTitle}>
            Unable to load visibility data
          </span>

          <span style={styles.errorText}>
            {error}
          </span>

          <button
            onClick={fetchVisibility}
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

      {/* HEADER */}

      <div style={styles.header}>

        <div style={styles.titleSection}>

          <div style={styles.iconWrapper}>

            <Eye
              size={19}
              color="#38bdf8"
              strokeWidth={1.8}
            />

          </div>

          <div>

            <h3 style={styles.title}>
              Visibility
            </h3>

            <span style={styles.subtitle}>
              Atmospheric visibility
            </span>

          </div>

        </div>

        <div
          style={{
            ...styles.statusBadge,

            color: statusColor,

            background:
              `${statusColor}12`,

            borderColor:
              `${statusColor}25`,
          }}
        >

          <span
            style={{
              ...styles.statusDot,

              background:
                statusColor,

              boxShadow:
                `0 0 7px ${statusColor}99`,
            }}
          />

          <span>
            {visibilityStatus}
          </span>

        </div>

      </div>

      {/* LOCATION */}

      {locationName && (

        <div style={styles.locationText}>
          {locationName}
        </div>

      )}

      {/* MAIN VALUE */}

      <div style={styles.valueRow}>

        <span style={styles.value}>
          {animatedVisibility}
        </span>

        <span style={styles.unit}>
          km
        </span>

      </div>

      {/* STATUS */}

      <div
        style={{
          ...styles.visibilityStatus,

          color: statusColor,
        }}
      >

        <span
          style={{
            ...styles.statusIndicator,

            background:
              statusColor,

            boxShadow:
              `0 0 8px ${statusColor}99`,
          }}
        />

        <span>
          {visibilityStatus} visibility
        </span>

      </div>

      {/* VISIBILITY GRAPH */}

      <div style={styles.visibilityGraph}>

        <div style={styles.graphHeader}>

          <span style={styles.graphLabel}>
            Visibility range
          </span>

          <span style={styles.graphValue}>
            {animatedVisibility} km
          </span>

        </div>

        <div style={styles.progressTrack}>

          <div
            style={{
              ...styles.progressBar,

              width:
                `${progressPercentage}%`,
            }}
          />

          <div
            style={{
              ...styles.progressMarker,

              left:
                `calc(${progressPercentage}% - 4px)`,
            }}
          />

        </div>

        <div style={styles.scaleLabels}>

          <span>
            0 km
          </span>

          <span>
            Poor
          </span>

          <span>
            Good
          </span>

          <span>
            Excellent
          </span>

          <span>
            10 km
          </span>

        </div>

      </div>

      {/* DESCRIPTION */}

      <div style={styles.description}>

        <span
          style={{
            ...styles.footerDot,

            background:
              statusColor,

            boxShadow:
              `0 0 7px ${statusColor}99`,
          }}
        />

        <span>
          {visibilityDescription}
        </span>

      </div>

      {/* REFRESH */}

      <button
        onClick={fetchVisibility}
        style={styles.refreshButton}
        title="Refresh visibility"
      >

        <RefreshCw size={11} />

        <span>
          Refresh
        </span>

      </button>

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

  card: {
    position: 'relative',
    width: '100%',
    minHeight: '100%',
    padding: '20px',
    boxSizing: 'border-box',
    borderRadius: '20px',
    background:
      'linear-gradient(145deg, rgba(255,255,255,0.10), rgba(255,255,255,0.035))',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border:
      '1px solid rgba(255,255,255,0.12)',
    boxShadow:
      '0 12px 35px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
  },

  titleSection: {
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

  title: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 600,
    color: '#f8fafc',
    letterSpacing: '-0.15px',
  },

  subtitle: {
    display: 'block',
    marginTop: '3px',
    fontSize: '10px',
    color: '#64748b',
  },

  locationText: {
    marginTop: '6px',
    marginLeft: '46px',
    fontSize: '9px',
    color: '#64748b',
  },

  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '5px 9px',
    borderRadius: '20px',
    border: '1px solid transparent',
    fontSize: '10px',
    whiteSpace: 'nowrap',
  },

  statusDot: {
    width: '5px',
    height: '5px',
    flexShrink: 0,
    borderRadius: '50%',
  },

  valueRow: {
    display: 'flex',
    alignItems: 'baseline',
    marginTop: '18px',
  },

  value: {
    fontSize: '38px',
    fontWeight: 700,
    color: '#ffffff',
    lineHeight: 1,
    letterSpacing: '-1px',
    textShadow:
      '0 3px 14px rgba(0,0,0,0.25)',
    fontVariantNumeric: 'tabular-nums',
    transition: 'all 0.15s ease',
  },

  unit: {
    fontSize: '15px',
    color: '#7dd3fc',
    marginLeft: '6px',
    fontWeight: 500,
  },

  visibilityStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    marginTop: '9px',
    fontSize: '11px',
  },

  statusIndicator: {
    width: '7px',
    height: '7px',
    flexShrink: 0,
    borderRadius: '50%',
  },

  visibilityGraph: {
    marginTop: '17px',
  },

  graphHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },

  graphLabel: {
    fontSize: '10px',
    color: '#94a3b8',
  },

  graphValue: {
    fontSize: '10px',
    fontWeight: 600,
    color: '#bae6fd',
  },

  progressTrack: {
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

  progressBar: {
    position: 'relative',
    height: '100%',
    minWidth: '0',
    borderRadius: '20px',
    background:
      'linear-gradient(90deg, rgba(34,197,94,0.70), rgba(56,189,248,0.95))',
    boxShadow:
      '0 0 14px rgba(56,189,248,0.28)',
    transition:
      'width 1.2s cubic-bezier(0.34,1.25,0.64,1)',
  },

  progressMarker: {
    position: 'absolute',
    top: '50%',
    width: '9px',
    height: '9px',
    transform: 'translateY(-50%)',
    borderRadius: '50%',
    background: '#e0f2fe',
    border: '2px solid #38bdf8',
    boxShadow:
      '0 0 10px rgba(56,189,248,0.65)',
    transition:
      'left 1.2s cubic-bezier(0.34,1.25,0.64,1)',
  },

  scaleLabels: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '6px',
    fontSize: '7px',
    color: '#64748b',
  },

  description: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    marginTop: '15px',
    paddingTop: '11px',
    borderTop:
      '1px solid rgba(255,255,255,0.06)',
    fontSize: '9px',
    color: '#64748b',
  },

  footerDot: {
    width: '5px',
    height: '5px',
    flexShrink: 0,
    borderRadius: '50%',
  },

  refreshButton: {
    position: 'absolute',
    right: '16px',
    bottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    background: 'transparent',
    border: 'none',
    color: '#64748b',
    fontSize: '8px',
    cursor: 'pointer',
    padding: '3px 4px',
  },

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