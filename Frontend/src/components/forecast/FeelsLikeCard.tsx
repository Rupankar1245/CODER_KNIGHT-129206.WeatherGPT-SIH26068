import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ThermometerSun,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';


/* =========================================================
   TYPES
========================================================= */

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

  timestamp?: number | null;
}


interface CurrentWeatherResponse {
  success: boolean;
  data?: CurrentWeatherData;
  error?: string;
}


interface HourlyForecastItem {
  time: string;
  timestamp?: number | null;
  tempVal: number;
  feelsLike: number;
  rainProbability?: number;
  weather?: string;
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

export const FeelsLikeCard: React.FC = () => {

  /* =======================================================
     CARD REFERENCE
  ======================================================= */

  const cardRef =
    useRef<HTMLDivElement | null>(null);


  /* =======================================================
     GRAPH ANIMATION
  ======================================================= */

  const [animateGraph, setAnimateGraph] =
    useState(false);


  /* =======================================================
     WEATHER STATE
  ======================================================= */

  const [actualTemperature, setActualTemperature] =
    useState<number | null>(null);

  const [feelsLikeTemperature, setFeelsLikeTemperature] =
    useState<number | null>(null);

  const [graphData, setGraphData] =
    useState<HourlyForecastItem[]>([]);


  /* =======================================================
     LOADING / ERROR
  ======================================================= */

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  /* =========================================================
     FETCH WEATHER DATA
  ========================================================= */

  useEffect(() => {

    let isMounted = true;

    let refreshInterval:
      ReturnType<typeof setInterval> | null = null;


    /* =======================================================
       FETCH CURRENT + HOURLY
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
           CURRENT WEATHER URL
        =================================================== */

        const currentUrl =
          `${BACKEND_URL}/api/weather/current/` +
          `?lat=${encodeURIComponent(latitude)}` +
          `&lon=${encodeURIComponent(longitude)}`;


        /* ===================================================
           HOURLY FORECAST URL
        =================================================== */

        const hourlyUrl =
          `${BACKEND_URL}/api/weather/hourly/` +
          `?lat=${encodeURIComponent(latitude)}` +
          `&lon=${encodeURIComponent(longitude)}`;


        /* ===================================================
           FETCH BOTH APIs
        =================================================== */

        const [
          currentResponse,
          hourlyResponse,
        ] = await Promise.all([

          fetch(currentUrl),

          fetch(hourlyUrl),

        ]);


        /* ===================================================
           CURRENT API ERROR
        =================================================== */

        if (!currentResponse.ok) {

          const errorData =
            await currentResponse
              .json()
              .catch(() => null);

          throw new Error(
            errorData?.error ||
            `Current weather API error: ${currentResponse.status}`
          );

        }


        /* ===================================================
           HOURLY API ERROR
        =================================================== */

        if (!hourlyResponse.ok) {

          const errorData =
            await hourlyResponse
              .json()
              .catch(() => null);

          throw new Error(
            errorData?.error ||
            `Hourly forecast API error: ${hourlyResponse.status}`
          );

        }


        /* ===================================================
           PARSE RESPONSES
        =================================================== */

        const currentResult:
          CurrentWeatherResponse =
          await currentResponse.json();


        const hourlyResult:
          HourlyForecastResponse =
          await hourlyResponse.json();


        /* ===================================================
           VALIDATE CURRENT DATA
        =================================================== */

        if (
          !currentResult.success ||
          !currentResult.data?.weather
        ) {

          throw new Error(
            currentResult.error ||
            'Current weather data unavailable.'
          );

        }


        /* ===================================================
           VALIDATE HOURLY DATA
        =================================================== */

        if (
          !hourlyResult.success ||
          !hourlyResult.data
        ) {

          throw new Error(
            hourlyResult.error ||
            'Hourly temperature data unavailable.'
          );

        }


        const currentWeather =
          currentResult.data.weather;


        const hourlyForecast =
          hourlyResult.data.forecast;


        /* ===================================================
           VALIDATE TEMPERATURE VALUES
        =================================================== */

        const currentTemp =
          currentWeather.temperature;

        const currentFeelsLike =
          currentWeather.feels_like;


        if (
          typeof currentTemp !== 'number' ||
          typeof currentFeelsLike !== 'number'
        ) {

          throw new Error(
            'Current temperature data unavailable.'
          );

        }


        /* ===================================================
           FILTER VALID HOURLY DATA
        =================================================== */

        const validHourlyData =
          hourlyForecast.filter(
            (item) =>
              typeof item.tempVal === 'number' &&
              typeof item.feelsLike === 'number' &&
              typeof item.time === 'string'
          );


        if (!validHourlyData.length) {

          throw new Error(
            'Hourly temperature data unavailable.'
          );

        }


        /* ===================================================
           UPDATE STATE
        =================================================== */

        if (isMounted) {

          setActualTemperature(
            Math.round(currentTemp)
          );

          setFeelsLikeTemperature(
            Math.round(currentFeelsLike)
          );

          setGraphData(
            validHourlyData
          );

          setError(null);

        }

      }

      catch (err) {

        console.error(
          'Feels Like Backend Error:',
          err
        );


        if (isMounted) {

          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load temperature data.'
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
          'Feels Like geolocation error:',
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
     VIEWPORT GRAPH ANIMATION
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
            graphData.length > 0
          ) {

            setAnimateGraph(false);


            animationTimeout =
              setTimeout(() => {

                setAnimateGraph(true);

              }, 120);

          }

          else {

            setAnimateGraph(false);

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

  }, [
    graphData.length,
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

              <ThermometerSun
                size={18}
                color="#38bdf8"
                strokeWidth={1.8}
              />

            </div>

            <div>

              <h3 style={styles.title}>
                Feels Like
              </h3>

              <span style={styles.subtitle}>
                Apparent vs actual temperature
              </span>

            </div>

          </div>

        </div>


        <div style={styles.loadingContainer}>

          <div
            className="feels-like-loading"
            style={styles.loadingSpinner}
          />

          <span style={styles.loadingText}>
            Loading temperature...
          </span>

        </div>


        <style>
          {`

            @keyframes feelsLikeSpin {

              from {
                transform: rotate(0deg);
              }

              to {
                transform: rotate(360deg);
              }

            }

            .feels-like-loading {

              animation:
                feelsLikeSpin
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
    actualTemperature === null ||
    feelsLikeTemperature === null ||
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

              <ThermometerSun
                size={18}
                color="#38bdf8"
                strokeWidth={1.8}
              />

            </div>

            <div>

              <h3 style={styles.title}>
                Feels Like
              </h3>

              <span style={styles.subtitle}>
                Apparent vs actual temperature
              </span>

            </div>

          </div>

        </div>


        <div style={styles.errorContainer}>

          <span style={styles.errorIcon}>
            ⚠️
          </span>


          <span style={styles.errorTitle}>
            Temperature data unavailable
          </span>


          <span style={styles.errorText}>
            {error ||
              'Unable to load temperature data.'}
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
     GRAPH CONFIG
  ========================================================= */

  const graphWidth = 520;

  const graphHeight = 150;

  const paddingLeft = 8;

  const paddingRight = 8;

  const paddingTop = 18;

  const paddingBottom = 25;


  /* =========================================================
     GRAPH TEMPERATURE RANGE
  ========================================================= */

  const allTemperatures = [
    actualTemperature,
    feelsLikeTemperature,

    ...graphData.flatMap(
      (item) => [
        item.tempVal,
        item.feelsLike,
      ]
    ),
  ];


  const rawMinTemp =
    Math.min(...allTemperatures);


  const rawMaxTemp =
    Math.max(...allTemperatures);


  const minTemp =
    Math.floor(
      (rawMinTemp - 2) / 2
    ) * 2;


  const maxTemp =
    Math.ceil(
      (rawMaxTemp + 2) / 2
    ) * 2;


  const usableWidth =
    graphWidth -
    paddingLeft -
    paddingRight;


  const usableHeight =
    graphHeight -
    paddingTop -
    paddingBottom;


  /* =========================================================
     GRAPH HELPERS
  ========================================================= */

  const getX = (
    index: number
  ) => {

    if (graphData.length <= 1) {
      return paddingLeft;
    }


    return (
      paddingLeft +
      (index /
        (graphData.length - 1)) *
        usableWidth
    );

  };


  const getY = (
    temperature: number
  ) => {

    const range =
      maxTemp - minTemp || 1;


    return (
      paddingTop +
      ((maxTemp - temperature) /
        range) *
        usableHeight
    );

  };


  /* =========================================================
     GRAPH POINTS
  ========================================================= */

  const actualPoints =
    graphData.map(
      (item, index) =>
        `${getX(index)},${getY(item.tempVal)}`
    );


  const feelsPoints =
    graphData.map(
      (item, index) =>
        `${getX(index)},${getY(item.feelsLike)}`
    );


  const actualPath =
    `M ${actualPoints.join(' L ')}`;


  const feelsPath =
    `M ${feelsPoints.join(' L ')}`;


  /* =========================================================
     AREA PATHS
  ========================================================= */

  const graphBottom =
    graphHeight -
    paddingBottom;


  const feelsAreaPath =
    `M ${feelsPoints[0]}
     L ${feelsPoints.slice(1).join(' L ')}
     L ${getX(graphData.length - 1)},${graphBottom}
     L ${getX(0)},${graphBottom}
     Z`;


  const actualAreaPath =
    `M ${actualPoints[0]}
     L ${actualPoints.slice(1).join(' L ')}
     L ${getX(graphData.length - 1)},${graphBottom}
     L ${getX(0)},${graphBottom}
     Z`;


  /* =========================================================
     CURRENT GRAPH POINT
  ========================================================= */

  const currentGraphIndex =
    graphData.length > 0
      ? Math.min(2, graphData.length - 1)
      : 0;


  /* =========================================================
     DIFFERENCE
  ========================================================= */

  const temperatureDifference =
    feelsLikeTemperature -
    actualTemperature;


  /* =========================================================
     DESCRIPTION
  ========================================================= */

  const description =
    temperatureDifference > 0
      ? `Feels warmer than the actual temperature due to humidity and atmospheric conditions.`
      : temperatureDifference < 0
        ? `Feels cooler than the actual temperature due to humidity and atmospheric conditions.`
        : `Feels similar to the actual temperature under current atmospheric conditions.`;


  /* =========================================================
     GLASS BACKGROUND
  ========================================================= */

  const glassBackground =
    'linear-gradient(145deg, rgba(255,255,255,0.115), rgba(255,255,255,0.035))';


  /* =========================================================
     MAIN RENDER
  ========================================================= */

  return (

    <div
      ref={cardRef}
      style={{
        ...styles.card,
        background: glassBackground,
      }}
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div style={styles.header}>

        <div style={styles.titleSection}>

          <div style={styles.iconWrapper}>

            <ThermometerSun
              size={18}
              color="#38bdf8"
              strokeWidth={1.8}
            />

          </div>

          <div>

            <h3 style={styles.title}>
              Feels Like
            </h3>

            <span style={styles.subtitle}>
              Apparent vs actual temperature
            </span>

          </div>

        </div>


        {/* ===================================================
            LEGEND
        =================================================== */}

        <div style={styles.legend}>

          <div style={styles.legendItem}>

            <span
              style={{
                ...styles.legendDot,
                background: '#38bdf8',
              }}
            />

            Actual

          </div>


          <div style={styles.legendItem}>

            <span
              style={{
                ...styles.legendDot,
                background: '#fbbf24',
              }}
            />

            Feels like

          </div>

        </div>

      </div>


      {/* =====================================================
          TEMPERATURE SUMMARY
      ===================================================== */}

      <div style={styles.temperatureSummary}>

        <div style={styles.temperatureBlock}>

          <div style={styles.temperature}>

            {feelsLikeTemperature}°

            <span style={styles.degreeText}>
              C
            </span>

          </div>

          <span style={styles.temperatureLabel}>
            Feels like
          </span>

        </div>


        <div style={styles.differenceBadge}>

          {temperatureDifference >= 0
            ? '+'
            : ''}

          {temperatureDifference}°C

        </div>


        <div style={styles.actualBlock}>

          <span style={styles.actualLabel}>
            Actual
          </span>

          <span style={styles.actualValue}>
            {actualTemperature}°C
          </span>

        </div>

      </div>


      {/* =====================================================
          GRAPH
      ===================================================== */}

      <div style={styles.graphContainer}>

        <svg
          viewBox={`0 0 ${graphWidth} ${graphHeight}`}
          preserveAspectRatio="none"
          style={styles.graph}
        >

          <defs>

            {/* Feels Like Gradient */}

            <linearGradient
              id="feelsFill"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >

              <stop
                offset="0%"
                stopColor="#fbbf24"
                stopOpacity="0.20"
              />

              <stop
                offset="100%"
                stopColor="#fbbf24"
                stopOpacity="0"
              />

            </linearGradient>


            {/* Actual Gradient */}

            <linearGradient
              id="actualFill"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >

              <stop
                offset="0%"
                stopColor="#38bdf8"
                stopOpacity="0.15"
              />

              <stop
                offset="100%"
                stopColor="#38bdf8"
                stopOpacity="0"
              />

            </linearGradient>

          </defs>


          {/* =================================================
              HORIZONTAL GRID
          ================================================= */}

          {[
            maxTemp - 2,
            maxTemp - 4,
            maxTemp - 6,
            maxTemp - 8,
          ]
            .filter(
              (temp) =>
                temp > minTemp
            )
            .map((temp) => (

              <line
                key={temp}
                x1={paddingLeft}
                x2={
                  graphWidth -
                  paddingRight
                }
                y1={getY(temp)}
                y2={getY(temp)}
                stroke="rgba(255,255,255,0.07)"
                strokeWidth="1"
                strokeDasharray="3 5"
              />

            ))}


          {/* =================================================
              FEELS LIKE AREA
          ================================================= */}

          <path
            d={feelsAreaPath}
            fill="url(#feelsFill)"
            style={{
              opacity:
                animateGraph
                  ? 1
                  : 0,

              transition:
                'opacity 0.8s ease',
            }}
          />


          {/* =================================================
              ACTUAL AREA
          ================================================= */}

          <path
            d={actualAreaPath}
            fill="url(#actualFill)"
            style={{
              opacity:
                animateGraph
                  ? 1
                  : 0,

              transition:
                'opacity 0.8s ease',
            }}
          />


          {/* =================================================
              FEELS LIKE LINE
          ================================================= */}

          <path
            d={feelsPath}
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="1"
            style={{
              strokeDasharray: 1,

              strokeDashoffset:
                animateGraph
                  ? 0
                  : 1,

              transition:
                'stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1)',

              filter:
                'drop-shadow(0 0 5px rgba(251,191,36,0.35))',
            }}
          />


          {/* =================================================
              ACTUAL LINE
          ================================================= */}

          <path
            d={actualPath}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="1"
            style={{
              strokeDasharray: 1,

              strokeDashoffset:
                animateGraph
                  ? 0
                  : 1,

              transition:
                'stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1)',

              filter:
                'drop-shadow(0 0 5px rgba(56,189,248,0.35))',
            }}
          />


          {/* =================================================
              FEELS LIKE POINTS
          ================================================= */}

          {graphData.map(
            (item, index) => (

              <g
                key={`feels-${index}`}
              >

                <circle
                  cx={getX(index)}
                  cy={getY(
                    item.feelsLike
                  )}
                  r="4"
                  fill="#0b2948"
                  stroke="#fbbf24"
                  strokeWidth="2"
                  style={{
                    opacity:
                      animateGraph
                        ? 1
                        : 0,

                    transition:
                      `opacity 0.4s ease ${0.25 + index * 0.08}s`,
                  }}
                />


                {/* Current point */}

                {index ===
                  currentGraphIndex && (

                  <circle
                    cx={getX(index)}
                    cy={getY(
                      item.feelsLike
                    )}
                    r="7"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="1"
                    opacity="0.35"
                  />

                )}

              </g>

            )
          )}


          {/* =================================================
              ACTUAL POINTS
          ================================================= */}

          {graphData.map(
            (item, index) => (

              <circle
                key={`actual-${index}`}
                cx={getX(index)}
                cy={getY(
                  item.tempVal
                )}
                r="4"
                fill="#0b2948"
                stroke="#38bdf8"
                strokeWidth="2"
                style={{
                  opacity:
                    animateGraph
                      ? 1
                      : 0,

                  transition:
                    `opacity 0.4s ease ${0.25 + index * 0.08}s`,
                }}
              />

            )
          )}

        </svg>


        {/* =====================================================
            Y AXIS LABELS
        ===================================================== */}

        <div style={styles.yAxis}>

          {[
            maxTemp - 2,
            maxTemp - 4,
            maxTemp - 6,
            maxTemp - 8,
          ]
            .filter(
              (temp) =>
                temp > minTemp
            )
            .map((temp) => (

              <span key={temp}>
                {temp}°
              </span>

            ))}

        </div>


        {/* =====================================================
            X AXIS LABELS
        ===================================================== */}

        <div style={styles.xAxis}>

          {graphData.map(
            (item, index) => (

              <span
                key={`${item.timestamp ?? item.time}-${index}`}
              >
                {item.time}
              </span>

            )
          )}

        </div>

      </div>


      {/* =====================================================
          DESCRIPTION
      ===================================================== */}

      <p style={styles.description}>

        {description}

      </p>


      {/* =====================================================
          BOTTOM DETAILS
      ===================================================== */}

      <div style={styles.bottomDetails}>

        <div style={styles.detailItem}>

          <div style={styles.detailIcon}>

            <ArrowDown
              size={13}
              color="#7dd3fc"
            />

          </div>

          <div>

            <span style={styles.detailLabel}>
              Current actual
            </span>

            <span style={styles.detailValue}>
              {actualTemperature}°C
            </span>

          </div>

        </div>


        <div style={styles.detailDivider} />


        <div style={styles.detailItem}>

          <div style={styles.detailIcon}>

            <ArrowUp
              size={13}
              color="#fbbf24"
            />

          </div>

          <div>

            <span style={styles.detailLabel}>
              Feels warmer by
            </span>

            <span style={styles.detailValue}>

              {temperatureDifference >= 0
                ? '+'
                : ''}

              {temperatureDifference}°C

            </span>

          </div>

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

    minHeight: '100%',

    padding: '20px',

    boxSizing: 'border-box',

    borderRadius: '20px',

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

    gap: '12px',

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

  },


  title: {

    margin: 0,

    fontSize: '14px',

    fontWeight: 600,

    color: '#f8fafc',

  },


  subtitle: {

    display: 'block',

    marginTop: '3px',

    fontSize: '10px',

    color: '#64748b',

  },


  /* =======================================================
     LEGEND
  ======================================================= */

  legend: {

    display: 'flex',

    alignItems: 'center',

    gap: '10px',

    fontSize: '9px',

    color: '#94a3b8',

  },


  legendItem: {

    display: 'flex',

    alignItems: 'center',

    gap: '4px',

  },


  legendDot: {

    width: '6px',

    height: '6px',

    borderRadius: '50%',

  },


  /* =======================================================
     TEMPERATURE SUMMARY
  ======================================================= */

  temperatureSummary: {

    display: 'flex',

    alignItems: 'center',

    gap: '14px',

    marginTop: '16px',

  },


  temperatureBlock: {

    display: 'flex',

    flexDirection: 'column',

  },


  temperature: {

    fontSize: '42px',

    lineHeight: 1,

    fontWeight: 700,

    color: '#ffffff',

    letterSpacing: '-1.2px',

  },


  degreeText: {

    fontSize: '15px',

    color: '#7dd3fc',

    marginLeft: '2px',

    verticalAlign: 'top',

  },


  temperatureLabel: {

    marginTop: '3px',

    fontSize: '9px',

    color: '#64748b',

  },


  differenceBadge: {

    padding: '5px 9px',

    borderRadius: '10px',

    fontSize: '10px',

    fontWeight: 600,

    color: '#fbbf24',

    background:
      'rgba(251,191,36,0.08)',

    border:
      '1px solid rgba(251,191,36,0.14)',

  },


  actualBlock: {

    marginLeft: 'auto',

    display: 'flex',

    flexDirection: 'column',

    alignItems: 'flex-end',

  },


  actualLabel: {

    fontSize: '9px',

    color: '#64748b',

  },


  actualValue: {

    marginTop: '3px',

    fontSize: '15px',

    fontWeight: 600,

    color: '#38bdf8',

  },


  /* =======================================================
     GRAPH
  ======================================================= */

  graphContainer: {

    position: 'relative',

    width: '100%',

    height: '165px',

    marginTop: '10px',

    paddingLeft: '26px',

    paddingBottom: '22px',

    boxSizing: 'border-box',

  },


  graph: {

    width: '100%',

    height: '140px',

    display: 'block',

    overflow: 'visible',

  },


  yAxis: {

    position: 'absolute',

    left: 0,

    top: '8px',

    bottom: '30px',

    display: 'flex',

    flexDirection: 'column',

    justifyContent: 'space-between',

    fontSize: '8px',

    color: '#64748b',

  },


  xAxis: {

    position: 'absolute',

    left: '26px',

    right: 0,

    bottom: 0,

    display: 'flex',

    justifyContent: 'space-between',

    fontSize: '8px',

    color: '#64748b',

  },


  /* =======================================================
     DESCRIPTION
  ======================================================= */

  description: {

    margin: '4px 0 0',

    fontSize: '10px',

    lineHeight: 1.45,

    color: '#94a3b8',

  },


  /* =======================================================
     BOTTOM DETAILS
  ======================================================= */

  bottomDetails: {

    display: 'flex',

    alignItems: 'center',

    marginTop: '14px',

    paddingTop: '12px',

    borderTop:
      '1px solid rgba(255,255,255,0.07)',

  },


  detailItem: {

    display: 'flex',

    alignItems: 'center',

    gap: '7px',

    flex: 1,

  },


  detailIcon: {

    width: '25px',

    height: '25px',

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',

    borderRadius: '7px',

    background:
      'rgba(56,189,248,0.07)',

  },


  detailLabel: {

    display: 'block',

    fontSize: '8px',

    color: '#64748b',

  },


  detailValue: {

    display: 'block',

    marginTop: '2px',

    fontSize: '12px',

    fontWeight: 600,

    color: '#e2e8f0',

  },


  detailDivider: {

    width: '1px',

    height: '26px',

    margin: '0 12px',

    background:
      'rgba(255,255,255,0.08)',

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