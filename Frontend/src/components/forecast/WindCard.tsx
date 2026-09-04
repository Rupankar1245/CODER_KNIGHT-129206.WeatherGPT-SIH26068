import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Wind,
  Navigation,
  Gauge,
  Activity,
} from 'lucide-react';


/* =========================================================
   TYPES
========================================================= */

interface WindData {
  speed?: number | null;
  direction?: number | null;
  gust?: number | null;
}


interface CurrentWeatherData {
  location?: {
    name?: string | null;
    country?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  };

  weather?: {
    temperature?: number | null;
    feels_like?: number | null;
    temperature_min?: number | null;
    temperature_max?: number | null;
    pressure?: number | null;
    humidity?: number | null;
    condition?: string | null;
    description?: string | null;
    icon?: string | null;
  };

  wind?: WindData;

  timestamp?: number | null;
}


interface CurrentWeatherResponse {
  success: boolean;
  data?: CurrentWeatherData;
  error?: string;
}


/* =========================================================
   BACKEND CONFIG
========================================================= */

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  'http://127.0.0.1:8000';


/* =========================================================
   HELPERS
========================================================= */

/*
 * Convert degrees into compass direction.
 *
 * 0   -> N
 * 22.5 -> NNE
 * 45  -> NE
 * ...
 * 292.5 -> WNW
 */

const getCompassDirection = (
  degree: number
): string => {

  const directions = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSW',
    'SW',
    'WSW',
    'W',
    'WNW',
    'NW',
    'NNW',
  ];

  const normalized =
    ((degree % 360) + 360) % 360;

  const index =
    Math.round(normalized / 22.5) %
    16;

  return directions[index];
};


/*
 * Convert compass direction into readable text.
 *
 * WNW -> West-Northwest
 */

const getFullDirection = (
  direction: string
): string => {

  const map: Record<string, string> = {

    N: 'North',

    NNE: 'North-Northeast',
    NE: 'Northeast',
    ENE: 'East-Northeast',

    E: 'East',

    ESE: 'East-Southeast',
    SE: 'Southeast',
    SSE: 'South-Southeast',

    S: 'South',

    SSW: 'South-Southwest',
    SW: 'Southwest',
    WSW: 'West-Southwest',

    W: 'West',

    WNW: 'West-Northwest',
    NW: 'Northwest',
    NNW: 'North-Northwest',

  };

  return map[direction] || direction;
};


/*
 * OpenWeather wind speed is m/s.
 *
 * 1 m/s = 3.6 km/h
 */

const msToKmh = (
  value: number
): number => {

  return value * 3.6;

};


/* =========================================================
   COMPONENT
========================================================= */

export const WindCard: React.FC = () => {

  /* =======================================================
     CARD REFERENCE
  ======================================================= */

  const cardRef =
    useRef<HTMLDivElement | null>(null);


  /* =======================================================
     VISIBILITY / ANIMATION
  ======================================================= */

  const [isVisible, setIsVisible] =
    useState(false);


  /* =======================================================
     WIND STATE
  ======================================================= */

  const [windSpeed, setWindSpeed] =
    useState<number | null>(null);

  const [gustSpeed, setGustSpeed] =
    useState<number | null>(null);

  const [windDegree, setWindDegree] =
    useState<number | null>(null);

  const [direction, setDirection] =
    useState<string | null>(null);


  /* =======================================================
     LOADING / ERROR
  ======================================================= */

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  /* =========================================================
     FETCH WIND DATA
  ========================================================= */

  useEffect(() => {

    let isMounted = true;

    let refreshInterval:
      ReturnType<typeof setInterval> | null = null;


    /* =======================================================
       FETCH CURRENT WEATHER
    ======================================================= */

    const fetchWindData = async (
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
           CURRENT WEATHER URL
        =================================================== */

        const currentUrl =
          `${BACKEND_URL}/api/weather/current/` +
          `?lat=${encodeURIComponent(latitude)}` +
          `&lon=${encodeURIComponent(longitude)}`;


        /* ===================================================
           FETCH
        =================================================== */

        const response =
          await fetch(currentUrl);


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
            `Weather API error: ${response.status}`
          );

        }


        /* ===================================================
           PARSE
        =================================================== */

        const result:
          CurrentWeatherResponse =
          await response.json();


        /* ===================================================
           VALIDATE RESPONSE
        =================================================== */

        if (
          !result.success ||
          !result.data
        ) {

          throw new Error(
            result.error ||
            'Weather data unavailable.'
          );

        }


        /* ===================================================
           VALIDATE WIND
        =================================================== */

        const wind =
          result.data.wind;


        if (!wind) {

          throw new Error(
            'Wind data unavailable.'
          );

        }


        const rawSpeed =
          wind.speed;

        const rawDegree =
          wind.direction;


        if (
          typeof rawSpeed !== 'number' ||
          typeof rawDegree !== 'number'
        ) {

          throw new Error(
            'Invalid wind data received from backend.'
          );

        }


        /* ===================================================
           CONVERT WIND SPEED
        =================================================== */

        const speedKmh =
          msToKmh(rawSpeed);


        /*
         * Gust can be null because OpenWeather
         * does not always provide gust information.
         */

        const gustKmh =
          typeof wind.gust === 'number'
            ? msToKmh(wind.gust)
            : null;


        /* ===================================================
           COMPASS DIRECTION
        =================================================== */

        const compassDirection =
          getCompassDirection(
            rawDegree
          );


        /* ===================================================
           UPDATE STATE
        =================================================== */

        if (isMounted) {

          setWindSpeed(
            Math.round(speedKmh)
          );

          setGustSpeed(
            gustKmh !== null
              ? Math.round(gustKmh)
              : null
          );

          setWindDegree(
            Math.round(rawDegree)
          );

          setDirection(
            compassDirection
          );

          setError(null);

        }

      }

      catch (err) {

        console.error(
          'Wind Backend Error:',
          err
        );


        if (isMounted) {

          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load wind data.'
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
         LOCATION SUCCESS
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

        fetchWindData(
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

              fetchWindData(
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
          'Wind geolocation error:',
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
         GEOLOCATION OPTIONS
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
            entry.isIntersecting
          ) {

            setIsVisible(false);


            animationTimeout =
              setTimeout(() => {

                setIsVisible(true);

              }, 80);

          }

          else {

            setIsVisible(false);

          }

        },

        {
          threshold: 0.35,
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

  }, []);


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

              <Wind
                size={18}
                color="#38bdf8"
                strokeWidth={1.8}
              />

            </div>

            <div>

              <h3 style={styles.title}>
                Wind
              </h3>

              <span style={styles.subtitle}>
                Current wind conditions
              </span>

            </div>

          </div>

        </div>


        <div style={styles.loadingContainer}>

          <div
            className="wind-loading"
            style={styles.loadingSpinner}
          />

          <span style={styles.loadingText}>
            Loading wind data...
          </span>

        </div>


        <style>
          {`

            @keyframes windSpin {

              from {
                transform: rotate(0deg);
              }

              to {
                transform: rotate(360deg);
              }

            }

            .wind-loading {

              animation:
                windSpin
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
    windSpeed === null ||
    windDegree === null ||
    direction === null
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

              <Wind
                size={18}
                color="#38bdf8"
                strokeWidth={1.8}
              />

            </div>

            <div>

              <h3 style={styles.title}>
                Wind
              </h3>

              <span style={styles.subtitle}>
                Current wind conditions
              </span>

            </div>

          </div>

        </div>


        <div style={styles.errorContainer}>

          <span style={styles.errorIcon}>
            ⚠️
          </span>


          <span style={styles.errorTitle}>
            Wind data unavailable
          </span>


          <span style={styles.errorText}>
            {error ||
              'Unable to load wind data.'}
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
     WIND STATUS
  ========================================================= */

  const getWindStatus = (
    speed: number
  ) => {

    if (speed < 12) {

      return {
        label: 'Calm',
        color: '#34d399',
      };

    }


    if (speed < 30) {

      return {
        label: 'Moderate',
        color: '#38bdf8',
      };

    }


    if (speed < 50) {

      return {
        label: 'Strong',
        color: '#fbbf24',
      };

    }


    return {
      label: 'Very Strong',
      color: '#fb7185',
    };

  };


  const windStatus =
    getWindStatus(
      windSpeed
    );


  /* =========================================================
     WIND STRENGTH
  ========================================================= */

  const windPercentage =
    Math.min(
      (windSpeed / 60) * 100,
      100
    );


  /* =========================================================
     FULL DIRECTION
  ========================================================= */

  const fullDirection =
    getFullDirection(
      direction
    );


  /* =========================================================
     MAIN RENDER
  ========================================================= */

  return (

    <div
      ref={cardRef}
      style={{
        ...styles.card,

        ...(isVisible
          ? styles.cardVisible
          : {}),
      }}
    >

      {/* =====================================================
          BACKGROUND WIND FLOW
      ===================================================== */}

      <div style={styles.backgroundFlow}>

        <div
          style={{
            ...styles.flowLine,
            ...styles.flowLineOne,

            ...(isVisible
              ? styles.flowAnimated
              : {}),
          }}
        />


        <div
          style={{
            ...styles.flowLine,
            ...styles.flowLineTwo,

            ...(isVisible
              ? styles.flowAnimatedSlow
              : {}),
          }}
        />


        <div
          style={{
            ...styles.flowLine,
            ...styles.flowLineThree,

            ...(isVisible
              ? styles.flowAnimatedFast
              : {}),
          }}
        />

      </div>


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div style={styles.header}>

        <div style={styles.titleSection}>

          <div style={styles.iconWrapper}>

            <Wind
              size={18}
              color="#38bdf8"
              strokeWidth={1.8}
            />

          </div>

          <div>

            <h3 style={styles.title}>
              Wind
            </h3>

            <span style={styles.subtitle}>
              Current wind conditions
            </span>

          </div>

        </div>


        {/* STATUS */}

        <div
          style={{
            ...styles.statusBadge,
            borderColor:
              `${windStatus.color}30`,
            background:
              `${windStatus.color}10`,
          }}
        >

          <span
            style={{
              ...styles.statusDot,
              backgroundColor:
                windStatus.color,
              boxShadow:
                `0 0 8px ${windStatus.color}aa`,
            }}
          />


          <span
            style={{
              color:
                windStatus.color,
            }}
          >
            {windStatus.label}
          </span>

        </div>

      </div>


      {/* =====================================================
          MAIN WIND SECTION
      ===================================================== */}

      <div style={styles.mainSection}>

        <div style={styles.windVisual}>

          <div
            style={{
              ...styles.windGlow,
              opacity:
                isVisible
                  ? 1
                  : 0,
            }}
          />


          <Wind
            size={30}
            color="#38bdf8"
            strokeWidth={1.5}
            style={{
              transform:
                isVisible
                  ? 'translateX(0)'
                  : 'translateX(-8px)',

              opacity:
                isVisible
                  ? 1
                  : 0,

              transition:
                'all 700ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          />

        </div>


        {/* MAIN VALUE */}

        <div style={styles.valueSection}>

          <div style={styles.mainValue}>

            <span>
              {windSpeed}
            </span>

            <span style={styles.unit}>
              km/h
            </span>

          </div>


          <div style={styles.directionRow}>

            <Navigation
              size={11}
              color="#7dd3fc"
              style={{
                transform:
                  `rotate(${windDegree}deg)`,
              }}
            />

            <span style={styles.direction}>
              {direction} · {windDegree}°
            </span>

          </div>

        </div>

      </div>


      {/* =====================================================
          WIND STRENGTH BAR
      ===================================================== */}

      <div style={styles.strengthSection}>

        <div style={styles.strengthHeader}>

          <span style={styles.strengthLabel}>
            Wind speed
          </span>

          <span style={styles.strengthValue}>
            {windSpeed} / 60 km/h
          </span>

        </div>


        <div style={styles.strengthTrack}>

          <div
            style={{
              ...styles.strengthProgress,

              width:
                isVisible
                  ? `${windPercentage}%`
                  : '0%',
            }}
          >

            <div style={styles.progressGlow} />

          </div>

        </div>


        <div style={styles.strengthLabels}>

          <span>
            Calm
          </span>

          <span>
            Moderate
          </span>

          <span>
            Strong
          </span>

        </div>

      </div>


      {/* =====================================================
          DETAILS
      ===================================================== */}

      <div style={styles.detailsGrid}>

        {/* DIRECTION */}

        <div style={styles.detailItem}>

          <div style={styles.detailIcon}>

            <Navigation
              size={14}
              color="#38bdf8"
            />

          </div>


          <div style={styles.detailContent}>

            <span style={styles.detailLabel}>
              Direction
            </span>

            <span style={styles.detailValue}>
              {direction}
            </span>

          </div>

        </div>


        {/* GUST */}

        <div style={styles.detailItem}>

          <div style={styles.detailIcon}>

            <Gauge
              size={14}
              color="#38bdf8"
            />

          </div>


          <div style={styles.detailContent}>

            <span style={styles.detailLabel}>
              Gusts
            </span>

            <span style={styles.detailValue}>

              {gustSpeed !== null
                ? `${gustSpeed} km/h`
                : 'N/A'}

            </span>

          </div>

        </div>

      </div>


      {/* =====================================================
          COMPASS
      ===================================================== */}

      <div style={styles.directionSection}>

        <div style={styles.compass}>

          <div style={styles.outerRing} />

          <div style={styles.innerRing} />


          <div style={styles.tickTop} />
          <div style={styles.tickRight} />
          <div style={styles.tickBottom} />
          <div style={styles.tickLeft} />


          <span style={styles.north}>
            N
          </span>

          <span style={styles.east}>
            E
          </span>

          <span style={styles.south}>
            S
          </span>

          <span style={styles.west}>
            W
          </span>


          {/* ROTATING WIND ARROW */}

          <div
            style={{
              ...styles.arrowWrapper,

              transform:
                isVisible
                  ? `rotate(${windDegree}deg)`
                  : 'rotate(0deg)',
            }}
          >

            <div style={styles.windArrow} />

            <div style={styles.arrowHead} />

          </div>


          <div style={styles.centerDot} />

        </div>


        <div style={styles.compassInfo}>

          <div style={styles.compassIconRow}>

            <Activity
              size={12}
              color="#38bdf8"
            />

            <span style={styles.compassLabel}>
              Wind direction
            </span>

          </div>


          <span style={styles.compassValue}>
            {fullDirection}
          </span>


          <span style={styles.compassDegree}>
            {windDegree}° from North
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


  /* =====================================================
     CARD
  ===================================================== */

  card: {

    position: 'relative',

    width: '100%',

    minHeight: '100%',

    padding: '20px',

    boxSizing: 'border-box',

    borderRadius: '20px',

    background:
      'linear-gradient(145deg, rgba(255,255,255,0.105), rgba(255,255,255,0.035))',

    backdropFilter: 'blur(22px)',

    WebkitBackdropFilter:
      'blur(22px)',

    border:
      '1px solid rgba(255,255,255,0.14)',

    boxShadow:
      '0 14px 40px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.06)',

    overflow: 'hidden',

    transition:
      'border-color 400ms ease, box-shadow 400ms ease',

  },


  cardVisible: {

    border:
      '1px solid rgba(56,189,248,0.18)',

    boxShadow:
      '0 14px 40px rgba(0,0,0,0.18), 0 0 25px rgba(56,189,248,0.035), inset 0 1px 0 rgba(255,255,255,0.07)',

  },


  /* =====================================================
     BACKGROUND FLOW
  ===================================================== */

  backgroundFlow: {

    position: 'absolute',

    inset: 0,

    pointerEvents: 'none',

    overflow: 'hidden',

    opacity: 0.55,

  },


  flowLine: {

    position: 'absolute',

    height: '1px',

    borderRadius: '50%',

    background:
      'linear-gradient(90deg, transparent, rgba(56,189,248,0.18), transparent)',

    transform:
      'translateX(-120%)',

    opacity: 0,

  },


  flowLineOne: {

    width: '150px',

    top: '34%',

    left: '58%',

  },


  flowLineTwo: {

    width: '210px',

    top: '57%',

    left: '48%',

  },


  flowLineThree: {

    width: '120px',

    top: '72%',

    left: '65%',

  },


  flowAnimated: {

    animation:
      'windFlow 2.8s ease-in-out infinite',

  },


  flowAnimatedSlow: {

    animation:
      'windFlow 3.8s ease-in-out infinite 0.4s',

  },


  flowAnimatedFast: {

    animation:
      'windFlow 2.2s ease-in-out infinite 0.8s',

  },


  /* =====================================================
     HEADER
  ===================================================== */

  header: {

    position: 'relative',

    zIndex: 2,

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
      'rgba(56,189,248,0.08)',

    border:
      '1px solid rgba(56,189,248,0.14)',

    boxShadow:
      '0 0 18px rgba(56,189,248,0.06)',

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


  /* =====================================================
     STATUS
  ===================================================== */

  statusBadge: {

    display: 'flex',

    alignItems: 'center',

    gap: '6px',

    padding: '5px 9px',

    borderRadius: '20px',

    border: '1px solid',

    fontSize: '10px',

    fontWeight: 500,

  },


  statusDot: {

    width: '5px',

    height: '5px',

    borderRadius: '50%',

  },


  /* =====================================================
     MAIN SECTION
  ===================================================== */

  mainSection: {

    position: 'relative',

    zIndex: 2,

    display: 'flex',

    alignItems: 'center',

    gap: '15px',

    marginTop: '18px',

  },


  windVisual: {

    position: 'relative',

    width: '58px',

    height: '58px',

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',

    flexShrink: 0,

    borderRadius: '16px',

    background:
      'radial-gradient(circle, rgba(56,189,248,0.14), rgba(56,189,248,0.025))',

    border:
      '1px solid rgba(56,189,248,0.13)',

    boxShadow:
      'inset 0 0 18px rgba(56,189,248,0.04), 0 0 22px rgba(56,189,248,0.06)',

  },


  windGlow: {

    position: 'absolute',

    width: '32px',

    height: '32px',

    borderRadius: '50%',

    background:
      'rgba(56,189,248,0.16)',

    filter: 'blur(12px)',

    transition:
      'opacity 800ms ease',

  },


  valueSection: {

    display: 'flex',

    flexDirection: 'column',

    gap: '5px',

  },


  mainValue: {

    display: 'flex',

    alignItems: 'baseline',

    gap: '5px',

    fontSize: '34px',

    lineHeight: 1,

    fontWeight: 700,

    color: '#ffffff',

    letterSpacing: '-1px',

    textShadow:
      '0 4px 18px rgba(0,0,0,0.25)',

  },


  unit: {

    fontSize: '12px',

    fontWeight: 500,

    color: '#94a3b8',

    letterSpacing: 0,

  },


  directionRow: {

    display: 'flex',

    alignItems: 'center',

    gap: '5px',

  },


  direction: {

    fontSize: '11px',

    color: '#7dd3fc',

    fontWeight: 500,

  },


  /* =====================================================
     STRENGTH BAR
  ===================================================== */

  strengthSection: {

    position: 'relative',

    zIndex: 2,

    marginTop: '18px',

  },


  strengthHeader: {

    display: 'flex',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginBottom: '7px',

  },


  strengthLabel: {

    fontSize: '9px',

    color: '#64748b',

  },


  strengthValue: {

    fontSize: '9px',

    color: '#94a3b8',

  },


  strengthTrack: {

    position: 'relative',

    width: '100%',

    height: '5px',

    overflow: 'hidden',

    borderRadius: '20px',

    background:
      'rgba(255,255,255,0.07)',

    border:
      '1px solid rgba(255,255,255,0.04)',

  },


  strengthProgress: {

    position: 'relative',

    height: '100%',

    borderRadius: '20px',

    background:
      'linear-gradient(90deg, #38bdf8, #22d3ee, #fbbf24)',

    boxShadow:
      '0 0 12px rgba(56,189,248,0.3)',

    transition:
      'width 1.2s cubic-bezier(0.22,1,0.36,1)',

  },


  progressGlow: {

    position: 'absolute',

    right: 0,

    top: 0,

    width: '18px',

    height: '100%',

    background:
      'rgba(255,255,255,0.7)',

    filter: 'blur(5px)',

    opacity: 0.35,

  },


  strengthLabels: {

    display: 'flex',

    justifyContent: 'space-between',

    marginTop: '5px',

    fontSize: '8px',

    color: '#64748b',

  },


  /* =====================================================
     DETAILS
  ===================================================== */

  detailsGrid: {

    position: 'relative',

    zIndex: 2,

    display: 'grid',

    gridTemplateColumns: '1fr 1fr',

    gap: '12px',

    marginTop: '17px',

    paddingTop: '14px',

    borderTop:
      '1px solid rgba(255,255,255,0.07)',

  },


  detailItem: {

    display: 'flex',

    alignItems: 'center',

    gap: '8px',

  },


  detailIcon: {

    width: '28px',

    height: '28px',

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',

    flexShrink: 0,

    borderRadius: '8px',

    background:
      'rgba(56,189,248,0.07)',

    border:
      '1px solid rgba(56,189,248,0.09)',

  },


  detailContent: {

    display: 'flex',

    flexDirection: 'column',

  },


  detailLabel: {

    fontSize: '9px',

    color: '#64748b',

  },


  detailValue: {

    marginTop: '2px',

    fontSize: '12px',

    fontWeight: 600,

    color: '#e2e8f0',

  },


  /* =====================================================
     COMPASS
  ===================================================== */

  directionSection: {

    position: 'relative',

    zIndex: 2,

    display: 'flex',

    alignItems: 'center',

    gap: '18px',

    marginTop: '16px',

    paddingTop: '14px',

    borderTop:
      '1px solid rgba(255,255,255,0.07)',

  },


  compass: {

    position: 'relative',

    width: '72px',

    height: '72px',

    flexShrink: 0,

    borderRadius: '50%',

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',

    background:
      'radial-gradient(circle, rgba(56,189,248,0.08), rgba(255,255,255,0.025))',

    border:
      '1px solid rgba(255,255,255,0.08)',

    boxShadow:
      'inset 0 0 20px rgba(56,189,248,0.035)',

  },


  outerRing: {

    position: 'absolute',

    inset: '2px',

    borderRadius: '50%',

    border:
      '1px solid rgba(148,163,184,0.22)',

  },


  innerRing: {

    position: 'absolute',

    inset: '11px',

    borderRadius: '50%',

    border:
      '1px dashed rgba(148,163,184,0.13)',

  },


  tickTop: {

    position: 'absolute',

    top: '4px',

    left: '50%',

    width: '1px',

    height: '5px',

    transform:
      'translateX(-50%)',

    background:
      'rgba(148,163,184,0.45)',

  },


  tickRight: {

    position: 'absolute',

    right: '4px',

    top: '50%',

    width: '5px',

    height: '1px',

    transform:
      'translateY(-50%)',

    background:
      'rgba(148,163,184,0.25)',

  },


  tickBottom: {

    position: 'absolute',

    bottom: '4px',

    left: '50%',

    width: '1px',

    height: '5px',

    transform:
      'translateX(-50%)',

    background:
      'rgba(148,163,184,0.25)',

  },


  tickLeft: {

    position: 'absolute',

    left: '4px',

    top: '50%',

    width: '5px',

    height: '1px',

    transform:
      'translateY(-50%)',

    background:
      'rgba(148,163,184,0.25)',

  },


  north: {

    position: 'absolute',

    top: '5px',

    left: '50%',

    transform:
      'translateX(-50%)',

    fontSize: '8px',

    fontWeight: 700,

    color: '#94a3b8',

  },


  east: {

    position: 'absolute',

    right: '6px',

    top: '50%',

    transform:
      'translateY(-50%)',

    fontSize: '8px',

    fontWeight: 600,

    color: '#64748b',

  },


  south: {

    position: 'absolute',

    bottom: '5px',

    left: '50%',

    transform:
      'translateX(-50%)',

    fontSize: '8px',

    fontWeight: 600,

    color: '#64748b',

  },


  west: {

    position: 'absolute',

    left: '6px',

    top: '50%',

    transform:
      'translateY(-50%)',

    fontSize: '8px',

    fontWeight: 600,

    color: '#64748b',

  },


  arrowWrapper: {

    position: 'absolute',

    width: '34px',

    height: '34px',

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',

    transformOrigin: 'center',

    transition:
      'transform 1.25s cubic-bezier(0.22,1,0.36,1)',

  },


  windArrow: {

    position: 'absolute',

    width: '2px',

    height: '24px',

    bottom: '50%',

    left: '50%',

    transform:
      'translateX(-50%)',

    borderRadius: '4px',

    background:
      'linear-gradient(to top, rgba(56,189,248,0.25), #38bdf8)',

    boxShadow:
      '0 0 9px rgba(56,189,248,0.4)',

  },


  arrowHead: {

    position: 'absolute',

    width: '0',

    height: '0',

    top: '1px',

    left: '50%',

    transform:
      'translateX(-50%)',

    borderLeft:
      '4px solid transparent',

    borderRight:
      '4px solid transparent',

    borderBottom:
      '8px solid #38bdf8',

    filter:
      'drop-shadow(0 0 4px rgba(56,189,248,0.55))',

  },


  centerDot: {

    position: 'absolute',

    width: '6px',

    height: '6px',

    borderRadius: '50%',

    background: '#38bdf8',

    boxShadow:
      '0 0 9px rgba(56,189,248,0.7)',

    zIndex: 5,

  },


  compassInfo: {

    display: 'flex',

    flexDirection: 'column',

    gap: '4px',

    minWidth: 0,

  },


  compassIconRow: {

    display: 'flex',

    alignItems: 'center',

    gap: '5px',

  },


  compassLabel: {

    fontSize: '9px',

    color: '#64748b',

  },


  compassValue: {

    fontSize: '12px',

    fontWeight: 500,

    color: '#cbd5e1',

  },


  compassDegree: {

    fontSize: '9px',

    color: '#64748b',

  },


  /* =====================================================
     LOADING
  ===================================================== */

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


  /* =====================================================
     ERROR
  ===================================================== */

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


/* =========================================================
   GLOBAL ANIMATION
========================================================= */

if (
  typeof document !== 'undefined' &&
  !document.getElementById(
    'meghai-wind-card-animation'
  )
) {

  const style =
    document.createElement('style');


  style.id =
    'meghai-wind-card-animation';


  style.innerHTML = `

    @keyframes windFlow {

      0% {

        transform:
          translateX(-120%);

        opacity: 0;

      }

      20% {

        opacity: 0.8;

      }

      70% {

        opacity: 0.5;

      }

      100% {

        transform:
          translateX(180%);

        opacity: 0;

      }

    }

  `;


  document.head.appendChild(style);

}
