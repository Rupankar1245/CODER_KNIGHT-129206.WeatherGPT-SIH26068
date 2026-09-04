import React, { useEffect, useRef, useState } from 'react';
import {
  CloudRain,
  Droplets,
  Umbrella,
  TrendingUp,
} from 'lucide-react';

/* =========================================================
   TYPES
========================================================= */

interface HourlyForecastItem {
  time: string;
  timestamp?: number | null;
  tempVal: number;
  feelsLike: number;
  rainProbability?: number;
  weather?: string;
  rain?: number;
  precipitation?: number;
}

interface HourlyForecastData {
  location?: {
    name?: string | null;
    country?: string | null;
  };

  forecast: HourlyForecastItem[];

  max_rain_probability?: number;
}

interface HourlyForecastResponse {
  success: boolean;
  data?: HourlyForecastData;
  error?: string;
}

/* =========================================================
   BACKEND CONFIG
========================================================= */

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  'http://127.0.0.1:8000';

/* =========================================================
   COMPONENT
========================================================= */

export const PrecipitationCard: React.FC = () => {

  /* =======================================================
     CARD REFERENCE
  ======================================================= */

  const cardRef =
    useRef<HTMLDivElement | null>(null);

  /* =======================================================
     GRAPH ANIMATION
  ======================================================= */

  const [animatedProgress, setAnimatedProgress] =
    useState(0);

  /* =======================================================
     WEATHER STATE
  ======================================================= */

  const [rainProbability, setRainProbability] =
    useState<number | null>(null);

  const [expectedRain, setExpectedRain] =
    useState<number | null>(null);

  const [rainDuration, setRainDuration] =
    useState<number | null>(null);

  const [graphData, setGraphData] =
    useState<HourlyForecastItem[]>([]);

  const [status, setStatus] =
    useState('Low');

  const [forecastSummary, setForecastSummary] =
    useState('');

  /* =======================================================
     LOADING / ERROR
  ======================================================= */

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /* =========================================================
     FETCH HOURLY WEATHER
  ========================================================= */

  useEffect(() => {

    let isMounted = true;

    let refreshInterval:
      ReturnType<typeof setInterval> | null = null;

    /* =======================================================
       FETCH FUNCTION
    ======================================================= */

    const fetchWeatherData = async (
      latitude: number,
      longitude: number,
      showLoading = false
    ) => {

      try {

        if (showLoading) {
          setLoading(true);
        }

        setError(null);

        /* ===================================================
           HOURLY FORECAST URL
        =================================================== */

        const hourlyUrl =
          `${BACKEND_URL}/api/weather/hourly/` +
          `?lat=${encodeURIComponent(latitude)}` +
          `&lon=${encodeURIComponent(longitude)}`;

        /* ===================================================
           FETCH
        =================================================== */

        const response =
          await fetch(hourlyUrl);

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
            `Hourly forecast API error: ${response.status}`
          );
        }

        /* ===================================================
           PARSE
        =================================================== */

        const result:
          HourlyForecastResponse =
          await response.json();

        /* ===================================================
           VALIDATE
        =================================================== */

        if (
          !result.success ||
          !result.data
        ) {

          throw new Error(
            result.error ||
            'Hourly precipitation data unavailable.'
          );
        }

        const forecast =
          result.data.forecast;

        if (
          !Array.isArray(forecast) ||
          forecast.length === 0
        ) {

          throw new Error(
            'Hourly precipitation data unavailable.'
          );
        }

        /* ===================================================
           VALID HOURLY DATA
        =================================================== */

        const validHourlyData =
          forecast.filter(
            (item) =>
              typeof item.time === 'string' &&
              typeof item.rainProbability === 'number'
          );

        if (!validHourlyData.length) {

          throw new Error(
            'Rain probability data unavailable.'
          );
        }

        /* ===================================================
           NORMALIZE RAIN PROBABILITY
        =================================================== */

        const normalizedData =
          validHourlyData.map((item) => ({
            ...item,

            rainProbability:
              Math.max(
                0,
                Math.min(
                  100,
                  item.rainProbability ?? 0
                )
              ),
          }));

        /* ===================================================
           MAX RAIN PROBABILITY
           
           Backend already provides max_rain_probability.
           If unavailable, calculate it from hourly data.
        =================================================== */

        const backendMax =
          typeof result.data.max_rain_probability === 'number'
            ? result.data.max_rain_probability
            : null;

        const calculatedMax =
          Math.max(
            ...normalizedData.map(
              (item) =>
                item.rainProbability ?? 0
            )
          );

        const maxProbability =
          backendMax !== null
            ? Math.max(
                0,
                Math.min(
                  100,
                  backendMax
                )
              )
            : calculatedMax;

        /* ===================================================
           IMPORTANT FIX
           
           The card should display the highest precipitation
           probability from the upcoming forecast.

           Previously:
             normalizedData[0]

           That caused the main card value to show the first
           hourly value while the summary used maxProbability.

           Now everything uses maxProbability consistently.
        =================================================== */

        const displayProbability =
          Math.round(maxProbability);

        /* ===================================================
           EXPECTED RAIN
           
           Current backend does not send rainfall amount.
           If rain / precipitation is available later,
           this will automatically calculate it.
        =================================================== */

        const rainfallValues =
          normalizedData
            .map(
              (item) =>
                item.rain ??
                item.precipitation
            )
            .filter(
              (value): value is number =>
                typeof value === 'number' &&
                Number.isFinite(value)
            );

        const calculatedRain =
          rainfallValues.length > 0
            ? rainfallValues.reduce(
                (sum, value) =>
                  sum + Math.max(0, value),
                0
              )
            : null;

        /* ===================================================
           RAIN DURATION
           
           Count forecast periods with meaningful
           precipitation probability.
        =================================================== */

        const rainHours =
          normalizedData.filter(
            (item) =>
              (item.rainProbability ?? 0) >= 30
          ).length;

        const calculatedDuration =
          rainHours > 0
            ? rainHours
            : 0;

        /* ===================================================
           STATUS
        =================================================== */

        const getStatus =
          (probability: number) => {

            if (probability < 20) {
              return 'Low';
            }

            if (probability < 60) {
              return 'Moderate';
            }

            if (probability < 80) {
              return 'High';
            }

            return 'Very High';
          };

        /* ===================================================
           SUMMARY
        =================================================== */

        const getSummary =
          (
            probability: number,
            data: HourlyForecastItem[]
          ) => {

            if (probability < 20) {

              return 'Low chance of precipitation in the upcoming hours.';
            }

            if (probability < 60) {

              const rainHour =
                data.find(
                  (item) =>
                    (item.rainProbability ?? 0) >= 50
                );

              if (rainHour) {

                return `Rain may become more likely around ${rainHour.time}.`;
              }

              return 'Moderate chance of precipitation in the upcoming hours.';
            }

            if (probability < 80) {

              return 'Rain is fairly likely during the upcoming hours.';
            }

            return 'High chance of precipitation. Consider carrying an umbrella.';
          };

        /* ===================================================
           UPDATE STATE
        =================================================== */

        if (isMounted) {

          /*
           * FIX:
           * Use maxProbability instead of normalizedData[0].
           */
          setRainProbability(
            displayProbability
          );

          setExpectedRain(
            calculatedRain !== null
              ? Number(calculatedRain.toFixed(1))
              : null
          );

          setRainDuration(
            calculatedDuration
          );

          setGraphData(
            normalizedData
          );

          setStatus(
            getStatus(displayProbability)
          );

          setForecastSummary(
            getSummary(
              maxProbability,
              normalizedData
            )
          );

          setError(null);
        }

      }

      catch (err) {

        console.error(
          'Precipitation Backend Error:',
          err
        );

        if (isMounted) {

          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load precipitation data.'
          );
        }

      }

      finally {

        if (
          isMounted &&
          showLoading
        ) {

          setLoading(false);
        }
      }
    };

    /* =======================================================
       GEOLOCATION
    ======================================================= */

    if (!navigator.geolocation) {

      setError(
        'Geolocation is not supported by your browser.'
      );

      setLoading(false);

      return;
    }

    navigator.geolocation.getCurrentPosition(

      /* =====================================================
         SUCCESS
      ===================================================== */

      (position) => {

        if (!isMounted) {
          return;
        }

        const {
          latitude,
          longitude,
        } = position.coords;

        /* ===================================================
           INITIAL FETCH
        =================================================== */

        fetchWeatherData(
          latitude,
          longitude,
          true
        );

        /* ===================================================
           REFRESH EVERY 10 MINUTES
        =================================================== */

        refreshInterval =
          setInterval(
            () => {

              fetchWeatherData(
                latitude,
                longitude,
                false
              );

            },
            10 * 60 * 1000
          );
      },

      /* =====================================================
         GEOLOCATION ERROR
      ===================================================== */

      (geoError) => {

        console.error(
          'Precipitation geolocation error:',
          geoError.message
        );

        if (isMounted) {

          setError(
            'Location permission is required.'
          );

          setLoading(false);
        }
      },

      /* =====================================================
         OPTIONS
      ===================================================== */

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );

    /* =======================================================
       CLEANUP
    ======================================================= */

    return () => {

      isMounted = false;

      if (refreshInterval) {

        clearInterval(
          refreshInterval
        );
      }
    };

  }, []);

  /* =========================================================
     VIEWPORT ANIMATION
  ========================================================= */

  useEffect(() => {

    const currentCard =
      cardRef.current;

    if (!currentCard) {
      return;
    }

    let animationTimeout:
      ReturnType<typeof setTimeout> | null = null;

    const observer =
      new IntersectionObserver(

        ([entry]) => {

          if (
            entry.isIntersecting &&
            rainProbability !== null
          ) {

            setAnimatedProgress(0);

            animationTimeout =
              setTimeout(() => {

                setAnimatedProgress(
                  rainProbability
                );

              }, 100);

          }

          else {

            setAnimatedProgress(0);
          }
        },

        {
          threshold: 0.3,
        }
      );

    observer.observe(
      currentCard
    );

    return () => {

      observer.disconnect();

      if (animationTimeout) {

        clearTimeout(
          animationTimeout
        );
      }
    };

  }, [
    rainProbability,
  ]);

  /* =========================================================
     LOADING STATE
  ========================================================= */

  if (loading) {

    return (

      <div
        ref={cardRef}
        style={{
          ...styles.card,
          background:
            'linear-gradient(145deg, rgba(255,255,255,0.115), rgba(255,255,255,0.035))',
        }}
      >

        <div style={styles.header}>

          <div style={styles.titleSection}>

            <div style={styles.iconWrapper}>

              <CloudRain
                size={19}
                color="#38bdf8"
                strokeWidth={1.8}
              />

            </div>

            <div>

              <h3 style={styles.title}>
                Precipitation
              </h3>

              <span style={styles.subtitle}>
                Rain probability
              </span>

            </div>

          </div>

        </div>

        <div style={styles.loadingContainer}>

          <div
            className="precipitation-loading"
            style={styles.loadingSpinner}
          />

          <span style={styles.loadingText}>
            Loading precipitation...
          </span>

        </div>

        <style>
          {`
            @keyframes precipitationSpin {

              from {
                transform: rotate(0deg);
              }

              to {
                transform: rotate(360deg);
              }

            }

            .precipitation-loading {

              animation:
                precipitationSpin
                1s
                linear
                infinite;

            }
          `}
        </style>

      </div>
    );
  }

  /* =========================================================
     ERROR STATE
  ========================================================= */

  if (
    error ||
    rainProbability === null ||
    graphData.length === 0
  ) {

    return (

      <div
        ref={cardRef}
        style={{
          ...styles.card,
          background:
            'linear-gradient(145deg, rgba(255,255,255,0.115), rgba(255,255,255,0.035))',
        }}
      >

        <div style={styles.header}>

          <div style={styles.titleSection}>

            <div style={styles.iconWrapper}>

              <CloudRain
                size={19}
                color="#38bdf8"
                strokeWidth={1.8}
              />

            </div>

            <div>

              <h3 style={styles.title}>
                Precipitation
              </h3>

              <span style={styles.subtitle}>
                Rain probability
              </span>

            </div>

          </div>

        </div>

        <div style={styles.errorContainer}>

          <span style={styles.errorIcon}>
            ⚠️
          </span>

          <span style={styles.errorTitle}>
            Precipitation data unavailable
          </span>

          <span style={styles.errorText}>
            {error ||
              'Unable to load precipitation data.'}
          </span>

          <button
            onClick={() => {
              window.location.reload();
            }}
            style={styles.retryButton}
          >
            Retry
          </button>

        </div>

      </div>
    );
  }

  /* =========================================================
     MAIN RENDER VALUES
  ========================================================= */

  const probability =
    rainProbability;

  const progress =
    Math.max(
      0,
      Math.min(
        100,
        animatedProgress
      )
    );

  return (

    <div
      ref={cardRef}
      style={styles.card}
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div style={styles.header}>

        <div style={styles.titleSection}>

          <div style={styles.iconWrapper}>

            <CloudRain
              size={19}
              color="#38bdf8"
              strokeWidth={1.8}
            />

          </div>

          <div>

            <h3 style={styles.title}>
              Precipitation
            </h3>

            <span style={styles.subtitle}>
              Rain probability
            </span>

          </div>

        </div>

        <div style={styles.trendBadge}>

          <TrendingUp
            size={13}
            color="#38bdf8"
          />

          <span>
            {status}
          </span>

        </div>

      </div>

      {/* =====================================================
          MAIN VALUE
      ===================================================== */}

      <div style={styles.mainSection}>

        <div style={styles.rainIcon}>

          <CloudRain
            size={34}
            color="#38bdf8"
            strokeWidth={1.5}
          />

        </div>

        <div style={styles.valueSection}>

          <div style={styles.mainValue}>

            {probability}

            <span style={styles.percent}>
              %
            </span>

          </div>

          <div style={styles.valueLabel}>
            Chance of rain
          </div>

        </div>

      </div>

      {/* =====================================================
          PROBABILITY GRAPH
      ===================================================== */}

      <div style={styles.graphSection}>

        <div style={styles.graphHeader}>

          <span style={styles.graphLabel}>
            Precipitation probability
          </span>

          <span style={styles.graphValue}>
            {probability}%
          </span>

        </div>

        <div style={styles.progressTrack}>

          <div
            style={{
              ...styles.progressFill,
              width: `${progress}%`,
            }}
          />

          <div
            style={{
              ...styles.progressMarker,
              left: `calc(${progress}% - 4px)`,
            }}
          />

        </div>

        <div style={styles.scaleLabels}>

          <span>
            0%
          </span>

          <span>
            Low
          </span>

          <span>
            Moderate
          </span>

          <span>
            High
          </span>

          <span>
            100%
          </span>

        </div>

      </div>

      {/* =====================================================
          DETAILS
      ===================================================== */}

      <div style={styles.detailsGrid}>

        {/* EXPECTED RAIN */}

        <div style={styles.detailItem}>

          <div style={styles.detailIcon}>

            <Droplets
              size={15}
              color="#38bdf8"
              strokeWidth={1.8}
            />

          </div>

          <div style={styles.detailContent}>

            <span style={styles.detailLabel}>
              Expected Rain
            </span>

            <span style={styles.detailValue}>

              {expectedRain !== null
                ? `${expectedRain} mm`
                : '—'}

            </span>

          </div>

        </div>

        {/* RAIN DURATION */}

        <div style={styles.detailItem}>

          <div style={styles.detailIcon}>

            <Umbrella
              size={15}
              color="#38bdf8"
              strokeWidth={1.8}
            />

          </div>

          <div style={styles.detailContent}>

            <span style={styles.detailLabel}>
              Rain Duration
            </span>

            <span style={styles.detailValue}>

              {rainDuration !== null &&
              rainDuration > 0
                ? `${rainDuration} hrs`
                : '—'}

            </span>

          </div>

        </div>

      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div style={styles.footer}>

        <span style={styles.footerDot} />

        <span style={styles.footerText}>

          {forecastSummary ||
            'Based on upcoming hourly forecast'}

        </span>

      </div>

    </div>
  );
};

/* =========================================================
   STYLES
========================================================= */

const styles:
  Record<string, React.CSSProperties> = {

  /* =======================================================
     CARD
  ======================================================= */

  card: {

    position: 'relative',

    width: '100%',

    minHeight: '100%',

    padding: '20px',

    boxSizing: 'border-box',

    borderRadius: '20px',

    background:
      'linear-gradient(145deg, rgba(255,255,255,0.115), rgba(255,255,255,0.035))',

    backdropFilter: 'blur(22px)',

    WebkitBackdropFilter: 'blur(22px)',

    border:
      '1px solid rgba(255,255,255,0.14)',

    boxShadow:
      '0 12px 35px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.06)',

    overflow: 'hidden',
  },

  /* =======================================================
     HEADER
  ======================================================= */

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

  trendBadge: {

    display: 'flex',

    alignItems: 'center',

    gap: '5px',

    padding: '5px 9px',

    borderRadius: '20px',

    background:
      'rgba(56,189,248,0.07)',

    border:
      '1px solid rgba(56,189,248,0.13)',

    color: '#bae6fd',

    fontSize: '10px',

    whiteSpace: 'nowrap',
  },

  /* =======================================================
     MAIN VALUE
  ======================================================= */

  mainSection: {

    display: 'flex',

    alignItems: 'center',

    gap: '15px',

    marginTop: '18px',
  },

  rainIcon: {

    width: '58px',

    height: '58px',

    flexShrink: 0,

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',

    borderRadius: '16px',

    background:
      'radial-gradient(circle, rgba(56,189,248,0.14), rgba(56,189,248,0.025))',

    border:
      '1px solid rgba(56,189,248,0.12)',

    boxShadow:
      '0 0 25px rgba(56,189,248,0.07)',
  },

  valueSection: {

    display: 'flex',

    flexDirection: 'column',

    gap: '3px',
  },

  mainValue: {

    display: 'flex',

    alignItems: 'baseline',

    fontSize: '38px',

    lineHeight: 1,

    fontWeight: 700,

    color: '#ffffff',

    letterSpacing: '-1px',

    textShadow:
      '0 3px 14px rgba(0,0,0,0.25)',
  },

  percent: {

    marginLeft: '2px',

    fontSize: '20px',

    fontWeight: 500,

    color: '#7dd3fc',
  },

  valueLabel: {

    fontSize: '11px',

    color: '#94a3b8',

    marginTop: '3px',
  },

  /* =======================================================
     GRAPH
  ======================================================= */

  graphSection: {

    marginTop: '20px',
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

    fontSize: '11px',

    fontWeight: 600,

    color: '#bae6fd',
  },

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

    overflow: 'visible',
  },

  progressFill: {

    position: 'relative',

    height: '100%',

    minWidth: '0',

    borderRadius: '20px',

    background:
      'linear-gradient(90deg, rgba(14,165,233,0.75), rgba(56,189,248,0.95))',

    boxShadow:
      '0 0 14px rgba(56,189,248,0.30)',

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

    border:
      '2px solid #38bdf8',

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

  /* =======================================================
     DETAILS
  ======================================================= */

  detailsGrid: {

    display: 'grid',

    gridTemplateColumns: '1fr 1fr',

    gap: '12px',

    marginTop: '17px',

    paddingTop: '15px',

    borderTop:
      '1px solid rgba(255,255,255,0.07)',
  },

  detailItem: {

    display: 'flex',

    alignItems: 'center',

    gap: '8px',

    minWidth: 0,
  },

  detailIcon: {

    width: '28px',

    height: '28px',

    flexShrink: 0,

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',

    borderRadius: '8px',

    background:
      'rgba(56,189,248,0.07)',

    border:
      '1px solid rgba(56,189,248,0.09)',
  },

  detailContent: {

    display: 'flex',

    flexDirection: 'column',

    minWidth: 0,
  },

  detailLabel: {

    fontSize: '9px',

    color: '#64748b',

    whiteSpace: 'nowrap',
  },

  detailValue: {

    marginTop: '2px',

    fontSize: '12px',

    fontWeight: 600,

    color: '#e2e8f0',

    whiteSpace: 'nowrap',
  },

  /* =======================================================
     FOOTER
  ======================================================= */

  footer: {

    display: 'flex',

    alignItems: 'center',

    gap: '7px',

    marginTop: '15px',

    paddingTop: '11px',

    borderTop:
      '1px solid rgba(255,255,255,0.06)',
  },

  footerDot: {

    width: '5px',

    height: '5px',

    flexShrink: 0,

    borderRadius: '50%',

    background: '#38bdf8',

    boxShadow:
      '0 0 7px rgba(56,189,248,0.6)',
  },

  footerText: {

    fontSize: '9px',

    color: '#64748b',
  },

  /* =======================================================
     LOADING
  ======================================================= */

  loadingContainer: {

    minHeight: '240px',

    display: 'flex',

    flexDirection: 'column',

    alignItems: 'center',

    justifyContent: 'center',

    gap: '10px',
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

  loadingText: {

    fontSize: '11px',

    color: '#94a3b8',
  },

  /* =======================================================
     ERROR
  ======================================================= */

  errorContainer: {

    minHeight: '240px',

    display: 'flex',

    flexDirection: 'column',

    alignItems: 'center',

    justifyContent: 'center',

    gap: '7px',

    textAlign: 'center',
  },

  errorIcon: {

    fontSize: '22px',

    marginBottom: '2px',
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