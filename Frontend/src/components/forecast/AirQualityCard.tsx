import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

/* =========================================================
   TYPES
========================================================= */

interface AirQualityData {
  aqi: number;
  pm25: number;
  pm10: number;
  co: number;
  no2: number;
  o3: number;
  so2: number;
  timestamp?: number;
}

interface AirQualityResponse {
  success: boolean;
  data?: AirQualityData;
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

export const AirQualityCard: React.FC = () => {

  /* =======================================================
     STATE
  ======================================================= */

  const [airQuality, setAirQuality] =
    useState<AirQualityData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  /* =======================================================
     GAUGE ANIMATION STATE
  ======================================================= */

  const [animatedOffset, setAnimatedOffset] =
    useState(Math.PI * 65);


  /* =======================================================
     CARD REFERENCE
  ======================================================= */

  const cardRef =
    useRef<HTMLDivElement | null>(null);


  /* =======================================================
     GAUGE CONFIG
  ======================================================= */

  const radius = 65;

  const strokeWidth = 12;

  const circumference =
    Math.PI * radius;


  /* =======================================================
     AQI PERCENTAGE
  ======================================================= */

  /*
   * OpenWeather Air Pollution API AQI:
   *
   * 1 = Good
   * 2 = Fair
   * 3 = Moderate
   * 4 = Poor
   * 5 = Very Poor
   */

  const normalizedAQI =
    airQuality
      ? Math.min(
          Math.max(airQuality.aqi, 1),
          5
        )
      : 1;


  const aqiPercentage =
    airQuality
      ? normalizedAQI / 5
      : 0;


  const targetOffset =
    circumference -
    aqiPercentage * circumference;


  /* =======================================================
     AQI STATUS
  ======================================================= */

  const getAQIDetails = (
    aqi: number
  ) => {

    switch (aqi) {

      case 1:
        return {
          status: 'Good',
          color: '#10b981',
        };

      case 2:
        return {
          status: 'Fair',
          color: '#f59e0b',
        };

      case 3:
        return {
          status: 'Moderate',
          color: '#f97316',
        };

      case 4:
        return {
          status: 'Poor',
          color: '#ef4444',
        };

      case 5:
        return {
          status: 'Very Poor',
          color: '#8b5cf6',
        };

      default:
        return {
          status: 'Unknown',
          color: '#94a3b8',
        };
    }
  };


  const {
    status,
    color: currentColor,
  } =
    getAQIDetails(
      airQuality?.aqi ?? 0
    );


  /* =======================================================
     FETCH AIR QUALITY FROM DJANGO
  ======================================================= */

  useEffect(() => {

    let isMounted = true;

    let refreshInterval:
      ReturnType<typeof setInterval> | null = null;


    /* =====================================================
       FETCH FUNCTION
    ===================================================== */

    const fetchAirQuality = async (
      latitude: number,
      longitude: number,
      showLoading = false
    ) => {

      try {

        if (showLoading) {
          setLoading(true);
        }

        setError(null);


        /* ===============================================
           BUILD DJANGO API URL
        =============================================== */

        const url =
          `${BACKEND_URL}/api/weather/air-quality/` +
          `?lat=${encodeURIComponent(latitude)}` +
          `&lon=${encodeURIComponent(longitude)}`;


        /* ===============================================
           REQUEST BACKEND
        =============================================== */

        const response =
          await fetch(url);


        /* ===============================================
           HTTP ERROR
        =============================================== */

        if (!response.ok) {

          const errorData =
            await response
              .json()
              .catch(() => null);


          throw new Error(
            errorData?.error ||
            `Backend API error: ${response.status}`
          );

        }


        /* ===============================================
           PARSE RESPONSE
        =============================================== */

        const result:
          AirQualityResponse =
          await response.json();


        /* ===============================================
           BACKEND RESPONSE VALIDATION
        =============================================== */

        if (
          !result.success ||
          !result.data
        ) {

          throw new Error(
            result.error ||
            'Air quality data unavailable.'
          );

        }


        /* ===============================================
           UPDATE STATE
        =============================================== */

        if (isMounted) {

          setAirQuality(
            result.data
          );

          setError(null);

        }

      }

      catch (err) {

        console.error(
          'Forecast Air Quality Backend Error:',
          err
        );


        if (isMounted) {

          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load air quality.'
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


    /* =====================================================
       GET USER LOCATION
    ===================================================== */

    if (!navigator.geolocation) {

      setError(
        'Geolocation is not supported by your browser.'
      );

      setLoading(false);

      return;

    }


    navigator.geolocation.getCurrentPosition(

      /* ===================================================
         SUCCESS
      =================================================== */

      (position) => {

        if (!isMounted) {
          return;
        }


        const {
          latitude,
          longitude,
        } = position.coords;


        /* ===============================================
           INITIAL FETCH
        =============================================== */

        fetchAirQuality(
          latitude,
          longitude,
          true
        );


        /* ===============================================
           REFRESH EVERY 10 MINUTES
        =============================================== */

        refreshInterval =
          setInterval(
            () => {

              fetchAirQuality(
                latitude,
                longitude,
                false
              );

            },
            10 * 60 * 1000
          );

      },


      /* ===================================================
         GEOLOCATION ERROR
      =================================================== */

      (geoError) => {

        console.error(
          'Forecast geolocation error:',
          geoError.message
        );


        if (isMounted) {

          setError(
            'Location permission is required.'
          );

          setLoading(false);

        }

      },


      /* ===================================================
         GEOLOCATION OPTIONS
      =================================================== */

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }

    );


    /* =====================================================
       CLEANUP
    ===================================================== */

    return () => {

      isMounted = false;

      if (refreshInterval) {

        clearInterval(
          refreshInterval
        );

      }

    };

  }, []);


  /* =======================================================
     GAUGE ANIMATION
  ======================================================= */

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
            airQuality
          ) {

            setAnimatedOffset(
              circumference
            );


            animationTimeout =
              setTimeout(() => {

                setAnimatedOffset(
                  targetOffset
                );

              }, 100);

          }

          else {

            setAnimatedOffset(
              circumference
            );

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
    airQuality,
    targetOffset,
    circumference,
  ]);


  /* =======================================================
     GLASS EFFECT
  ======================================================= */

  const glassEffect:
    React.CSSProperties = {

    background:
      'linear-gradient(135deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.045) 100%)',

    backdropFilter:
      'blur(20px)',

    WebkitBackdropFilter:
      'blur(20px)',

    border:
      '1px solid rgba(255,255,255,0.18)',

    boxShadow:
      '0 10px 35px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.06)',
  };


  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (loading) {

    return (

      <div
        ref={cardRef}
        style={{
          ...styles.card,
          ...glassEffect,
        }}
      >

        <div style={styles.header}>

          <div>

            <h3 style={styles.cardTitle}>
              Air Quality
            </h3>

            <span style={styles.subtitle}>
              Air Quality Index
            </span>

          </div>


          <div style={styles.liveBadge}>

            <span style={styles.liveDot} />

            Live

          </div>

        </div>


        <div style={styles.loadingContainer}>

          <div
            className="forecast-aqi-loading"
            style={styles.loadingSpinner}
          />

          <span style={styles.loadingText}>
            Loading air quality...
          </span>

        </div>


        <style>
          {`

            @keyframes forecastAqiSpin {

              from {
                transform: rotate(0deg);
              }

              to {
                transform: rotate(360deg);
              }

            }

            .forecast-aqi-loading {

              animation:
                forecastAqiSpin
                1s
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

  if (
    error ||
    !airQuality
  ) {

    return (

      <div
        ref={cardRef}
        style={{
          ...styles.card,
          ...glassEffect,
        }}
      >

        <div style={styles.header}>

          <div>

            <h3 style={styles.cardTitle}>
              Air Quality
            </h3>

            <span style={styles.subtitle}>
              Air Quality Index
            </span>

          </div>

        </div>


        <div style={styles.errorContainer}>

          <span style={styles.errorIcon}>
            ⚠️
          </span>


          <span style={styles.errorTitle}>
            Air quality unavailable
          </span>


          <span style={styles.errorText}>
            {error ||
              'Unable to load air quality data.'}
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


  /* =======================================================
     MAIN RENDER
  ======================================================= */

  return (

    <div
      ref={cardRef}
      style={{
        ...styles.card,
        ...glassEffect,
      }}
    >

      {/* =================================================
          LIVE ANIMATION
      ================================================= */}

      <style>
        {`

          @keyframes forecastAqiLivePulse {

            0% {
              opacity: 0.45;
              transform: scale(0.9);
            }

            50% {
              opacity: 1;
              transform: scale(1);
            }

            100% {
              opacity: 0.45;
              transform: scale(0.9);
            }

          }

        `}
      </style>


      {/* =================================================
          HEADER
      ================================================= */}

      <div style={styles.header}>

        <div>

          <h3 style={styles.cardTitle}>
            Air Quality
          </h3>

          <span style={styles.subtitle}>
            Air Quality Index
          </span>

        </div>


        <div style={styles.liveBadge}>

          <span style={styles.liveDot} />

          Live

        </div>

      </div>


      {/* =================================================
          GAUGE
      ================================================= */}

      <div style={styles.gaugeWrapper}>

        <svg
          width="190"
          height="115"
          viewBox="0 0 160 100"
          style={styles.svg}
        >

          <defs>

            <linearGradient
              id="forecastAqiGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >

              <stop
                offset="0%"
                stopColor="#10b981"
              />

              <stop
                offset="35%"
                stopColor="#f59e0b"
              />

              <stop
                offset="70%"
                stopColor="#f97316"
              />

              <stop
                offset="100%"
                stopColor="#ef4444"
              />

            </linearGradient>

          </defs>


          {/* =============================================
              BACKGROUND ARC
          ============================================= */}

          <path
            d="
              M 15 85
              A 65 65 0 0 1 145 85
            "
            fill="none"
            stroke="rgba(255,255,255,0.10)"
            strokeWidth={
              strokeWidth
            }
            strokeLinecap="round"
          />


          {/* =============================================
              ACTIVE ARC
          ============================================= */}

          <path
            d="
              M 15 85
              A 65 65 0 0 1 145 85
            "
            fill="none"
            stroke="url(#forecastAqiGradient)"
            strokeWidth={
              strokeWidth
            }
            strokeLinecap="round"
            strokeDasharray={
              circumference
            }
            strokeDashoffset={
              animatedOffset
            }
            style={{
              transition:
                'stroke-dashoffset 1.3s cubic-bezier(0.34, 1.28, 0.64, 1)',
            }}
          />

        </svg>


        {/* =============================================
            GAUGE CENTER
        ============================================= */}

        <div style={styles.gaugeCenter}>

          <span style={styles.aqiValue}>
            {airQuality.aqi}
          </span>


          <span
            style={{
              ...styles.aqiStatus,
              color: currentColor,
            }}
          >
            {status}
          </span>

        </div>

      </div>


      {/* =================================================
          DESCRIPTION
      ================================================= */}

      <p style={styles.description}>

        {status === 'Good' &&
          'Air quality is satisfactory.'}

        {status === 'Fair' &&
          'Air quality is acceptable.'}

        {status === 'Moderate' &&
          'Air quality is moderate.'}

        {status === 'Poor' &&
          'Air quality may affect sensitive individuals.'}

        {status === 'Very Poor' &&
          'Health effects may occur with prolonged exposure.'}

        {status === 'Unknown' &&
          'Air quality information is currently unavailable.'}

      </p>


      {/* =================================================
          POLLUTANT GRID
      ================================================= */}

      <div style={styles.pollutantGrid}>

        {/* PM2.5 */}

        <div style={styles.pollutantItem}>

          <span style={styles.pollutantLabel}>
            PM2.5
          </span>

          <span style={styles.pollutantValue}>

            {airQuality.pm25.toFixed(1)}

            <small style={styles.small}>
              {' '}µg/m³
            </small>

          </span>

        </div>


        {/* PM10 */}

        <div style={styles.pollutantItem}>

          <span style={styles.pollutantLabel}>
            PM10
          </span>

          <span style={styles.pollutantValue}>

            {airQuality.pm10.toFixed(1)}

            <small style={styles.small}>
              {' '}µg/m³
            </small>

          </span>

        </div>


        {/* CO */}

        <div style={styles.pollutantItem}>

          <span style={styles.pollutantLabel}>
            CO
          </span>

          <span style={styles.pollutantValue}>

            {airQuality.co.toFixed(0)}

            <small style={styles.small}>
              {' '}µg/m³
            </small>

          </span>

        </div>


        {/* NO2 */}

        <div style={styles.pollutantItem}>

          <span style={styles.pollutantLabel}>
            NO₂
          </span>

          <span style={styles.pollutantValue}>

            {airQuality.no2.toFixed(1)}

            <small style={styles.small}>
              {' '}µg/m³
            </small>

          </span>

        </div>

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

    height: '100%',

    minHeight: 0,

    padding: '20px 24px',

    boxSizing: 'border-box',

    display: 'flex',

    flexDirection: 'column',

    overflow: 'hidden',

    borderRadius: '24px',

  },


  /* =======================================================
     HEADER
  ======================================================= */

  header: {

    display: 'flex',

    alignItems: 'flex-start',

    justifyContent:
      'space-between',

  },


  cardTitle: {

    margin: 0,

    fontSize: '16px',

    fontWeight: 600,

    color: '#ffffff',

    letterSpacing:
      '-0.2px',

  },


  subtitle: {

    display: 'block',

    marginTop: '3px',

    fontSize: '11px',

    color: '#94a3b8',

  },


  /* =======================================================
     LIVE BADGE
  ======================================================= */

  liveBadge: {

    display: 'flex',

    alignItems: 'center',

    gap: '6px',

    padding:
      '4px 9px',

    borderRadius:
      '12px',

    background:
      'rgba(16,185,129,0.08)',

    border:
      '1px solid rgba(16,185,129,0.18)',

    color: '#a7f3d0',

    fontSize: '10px',

    fontWeight: 500,

  },


  liveDot: {

    width: '5px',

    height: '5px',

    borderRadius: '50%',

    backgroundColor:
      '#10b981',

    boxShadow:
      '0 0 7px rgba(16,185,129,0.8)',

    animation:
      'forecastAqiLivePulse 1.8s ease-in-out infinite',

  },


  /* =======================================================
     GAUGE
  ======================================================= */

  gaugeWrapper: {

    position: 'relative',

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',

    height: '112px',

    marginTop: '2px',

  },


  svg: {

    display: 'block',

    overflow: 'visible',

  },


  gaugeCenter: {

    position: 'absolute',

    top: '61%',

    left: '50%',

    transform:
      'translate(-50%, -50%)',

    display: 'flex',

    flexDirection:
      'column',

    alignItems: 'center',

    whiteSpace:
      'nowrap',

  },


  aqiValue: {

    fontSize: '32px',

    lineHeight: 1,

    fontWeight: 700,

    color: '#ffffff',

    letterSpacing:
      '-1px',

  },


  aqiStatus: {

    marginTop: '5px',

    fontSize: '12px',

    fontWeight: 600,

  },


  /* =======================================================
     DESCRIPTION
  ======================================================= */

  description: {

    margin:
      '-2px 0 12px',

    textAlign: 'center',

    fontSize: '11px',

    lineHeight: 1.4,

    color: '#94a3b8',

  },


  /* =======================================================
     POLLUTANT GRID
  ======================================================= */

  pollutantGrid: {

    display: 'grid',

    gridTemplateColumns:
      '1fr 1fr 1fr 1fr',

    borderTop:
      '1px solid rgba(255,255,255,0.10)',

    paddingTop: '12px',

    gap: '8px',

  },


  pollutantItem: {

    display: 'flex',

    flexDirection:
      'column',

    alignItems: 'center',

    gap: '3px',

    minWidth: 0,

  },


  pollutantLabel: {

    fontSize: '10px',

    color: '#94a3b8',

    fontWeight: 400,

  },


  pollutantValue: {

    fontSize: '13px',

    color: '#ffffff',

    fontWeight: 600,

  },


  small: {

    fontSize: '8px',

    color: '#94a3b8',

    fontWeight: 400,

  },


  /* =======================================================
     LOADING
  ======================================================= */

  loadingContainer: {

    flex: 1,

    display: 'flex',

    flexDirection:
      'column',

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


  loadingText: {

    fontSize: '11px',

    color: '#94a3b8',

  },


  /* =======================================================
     ERROR
  ======================================================= */

  errorContainer: {

    flex: 1,

    display: 'flex',

    flexDirection:
      'column',

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

    padding:
      '6px 12px',

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