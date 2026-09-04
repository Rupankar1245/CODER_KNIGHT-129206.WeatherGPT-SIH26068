import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

interface HourItem {
  time: string;
  tempVal: number;
  rainProbability: number;
  weather: string;
}

interface HourlyForecastData {
  location: {
    name: string;
    country: string;
  };

  forecast: HourItem[];

  max_rain_probability: number;
}

interface ForecastApiResponse {
  success: boolean;
  data?: HourlyForecastData;
  error?: string;
}

export const HourlyForecast: React.FC = () => {
  const svgWidth = 500;
  const svgHeight = 110;

  const paddingX = 24;

  const minY = 20;
  const maxY = 75;

  /* =====================================================
     STATE
     ===================================================== */

  const [hourlyData, setHourlyData] =
    useState<HourItem[]>([]);

  const [rainProbability, setRainProbability] =
    useState<number | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /* =====================================================
     CARD REFERENCE
     ===================================================== */

  const cardRef =
    useRef<HTMLDivElement | null>(null);

  const [isVisible, setIsVisible] =
    useState(false);

  /* =====================================================
     FETCH HOURLY FORECAST
     ===================================================== */

  useEffect(() => {
    const fetchForecast = async (
      latitude: number,
      longitude: number
    ) => {
      try {
        setLoading(true);
        setError(null);

        const API_BASE_URL =
          import.meta.env.VITE_API_BASE_URL ||
          'http://127.0.0.1:8000';

        const response = await fetch(
          `${API_BASE_URL}/api/weather/hourly/?lat=${latitude}&lon=${longitude}`
        );

        if (!response.ok) {
          throw new Error(
            `Backend forecast error: ${response.status}`
          );
        }

        const result: ForecastApiResponse =
          await response.json();

        if (!result.success) {
          throw new Error(
            result.error ||
              'Unable to load forecast.'
          );
        }

        if (!result.data) {
          throw new Error(
            'Forecast data is unavailable.'
          );
        }

        if (
          !result.data.forecast ||
          result.data.forecast.length === 0
        ) {
          throw new Error(
            'No forecast data found.'
          );
        }

        setHourlyData(
          result.data.forecast
        );

        setRainProbability(
          result.data.max_rain_probability
        );
      } catch (err) {
        console.error(
          'Failed to fetch hourly forecast:',
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load forecast.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (!navigator.geolocation) {
      setError(
        'Geolocation is not supported by your browser.'
      );

      setLoading(false);

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const {
          latitude,
          longitude,
        } = position.coords;

        fetchForecast(
          latitude,
          longitude
        );
      },

      (geoError) => {
        console.error(
          'Geolocation error:',
          geoError.message
        );

        setError(
          'Location permission is required.'
        );

        setLoading(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);

  /* =====================================================
     INTERSECTION OBSERVER
     ===================================================== */

  useEffect(() => {
    const currentCard =
      cardRef.current;

    if (!currentCard) {
      return;
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          setIsVisible(
            entry.isIntersecting
          );
        },
        {
          threshold: 0.35,
        }
      );

    observer.observe(currentCard);

    return () => {
      observer.disconnect();
    };
  }, []);

  /* =====================================================
     LOADING SKELETON
     ===================================================== */

  if (loading) {
    return (
      <div
        ref={cardRef}
        style={styles.card}
      >
        <style>
          {`
            @keyframes meghaiHourlySkeleton {
              0% {
                background-position: -600px 0;
              }

              100% {
                background-position: 600px 0;
              }
            }

            .meghai-hourly-skeleton {
              background:
                linear-gradient(
                  90deg,
                  rgba(148, 163, 184, 0.10) 0%,
                  rgba(255, 255, 255, 0.20) 50%,
                  rgba(148, 163, 184, 0.10) 100%
                );

              background-size: 1200px 100%;

              animation:
                meghaiHourlySkeleton
                1.5s
                linear
                infinite;
            }
          `}
        </style>

        {/* HEADER SKELETON */}

        <div style={styles.header}>
          <div
            className="meghai-hourly-skeleton"
            style={{
              ...styles.skeletonBlock,
              width: '145px',
              height: '20px',
            }}
          />

          <div
            style={styles.skeletonBadge}
          >
            <div
              className="meghai-hourly-skeleton"
              style={{
                ...styles.skeletonBlock,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
              }}
            />

            <div
              className="meghai-hourly-skeleton"
              style={{
                ...styles.skeletonBlock,
                width: '130px',
                height: '14px',
              }}
            />
          </div>
        </div>

        {/* CHART SKELETON */}

        <div
          style={styles.skeletonChart}
        >
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            style={styles.svg}
            preserveAspectRatio="none"
          >
            {/* SKELETON CURVE */}

            <path
              d="
                M 24 58
                L 90 45
                L 155 55
                L 220 32
                L 285 42
                L 350 25
                L 415 40
                L 476 28
              "
              fill="none"
              stroke="rgba(148, 163, 184, 0.25)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* SKELETON POINTS */}

            {[
              [24, 58],
              [90, 45],
              [155, 55],
              [220, 32],
              [285, 42],
              [350, 25],
              [415, 40],
              [476, 28],
            ].map(
              ([x, y], index) => (
                <g key={index}>
                  {/* TEMP LABEL */}

                  <rect
                    x={x - 13}
                    y={y - 25}
                    width="26"
                    height="8"
                    rx="4"
                    fill="rgba(148, 163, 184, 0.18)"
                  />

                  {/* POINT */}

                  <circle
                    cx={x}
                    cy={y}
                    r="3.5"
                    fill="rgba(148, 163, 184, 0.30)"
                  />

                  {/* TICK */}

                  <line
                    x1={x}
                    y1={maxY + 8}
                    x2={x}
                    y2={maxY + 12}
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="1"
                  />

                  {/* TIME LABEL */}

                  <rect
                    x={x - 14}
                    y={maxY + 18}
                    width="28"
                    height="7"
                    rx="3.5"
                    fill="rgba(148, 163, 184, 0.16)"
                  />
                </g>
              )
            )}

            {/* DIVIDER */}

            <line
              x1={paddingX - 10}
              y1={maxY + 10}
              x2={
                svgWidth -
                paddingX +
                10
              }
              y2={maxY + 10}
              stroke="rgba(255, 255, 255, 0.10)"
              strokeWidth="1"
            />
          </svg>

          {/* SHIMMER OVERLAY */}

          <div
            className="meghai-hourly-skeleton"
            style={
              styles.skeletonShimmerOverlay
            }
          />
        </div>
      </div>
    );
  }

  /* =====================================================
     ERROR STATE
     ===================================================== */

  if (
    error ||
    hourlyData.length === 0
  ) {
    return (
      <div
        ref={cardRef}
        style={styles.card}
      >
        <div
          style={styles.errorContainer}
        >
          <span
            style={styles.errorTitle}
          >
            Forecast unavailable
          </span>

          <span
            style={styles.errorText}
          >
            {error ||
              'No forecast data found.'}
          </span>
        </div>
      </div>
    );
  }

  /* =====================================================
     TEMPERATURE RANGE
     ===================================================== */

  const temperatures =
    hourlyData.map(
      (item) => item.tempVal
    );

  let minTemp =
    Math.min(...temperatures);

  let maxTemp =
    Math.max(...temperatures);

  if (minTemp === maxTemp) {
    minTemp -= 2;
    maxTemp += 2;
  }

  const tempRange =
    maxTemp - minTemp;

  /* =====================================================
     CHART POINTS
     ===================================================== */

  const denominator =
    Math.max(
      hourlyData.length - 1,
      1
    );

  const points =
    hourlyData.map(
      (item, index) => {
        const x =
          paddingX +
          (index *
            (svgWidth -
              2 * paddingX)) /
            denominator;

        const y =
          maxY -
          ((item.tempVal -
            minTemp) /
            tempRange) *
            (maxY - minY);

        return {
          x,
          y,
          temp: `${item.tempVal}°`,
          time: item.time,
        };
      }
    );

  /* =====================================================
     SVG PATH
     ===================================================== */

  const pathD =
    points.reduce(
      (acc, point, index) => {
        if (index === 0) {
          return `M ${point.x} ${point.y}`;
        }

        return `${acc} L ${point.x} ${point.y}`;
      },
      ''
    );

  /* =====================================================
     MAIN UI
     ===================================================== */

  return (
    <div
      ref={cardRef}
      style={styles.card}
    >
      <style>
        {`
          @keyframes hourlyForecastDraw {
            0% {
              stroke-dashoffset: 1;
            }

            100% {
              stroke-dashoffset: 0;
            }
          }

          .hourly-forecast-line {
            stroke-dasharray: 1;
            stroke-dashoffset: 1;
          }

          .hourly-forecast-line.visible {
            animation:
              hourlyForecastDraw
              3.8s
              cubic-bezier(0.25, 0.8, 0.25, 1)
              forwards;
          }
        `}
      </style>

      {/* HEADER */}

      <div style={styles.header}>
        <h3 style={styles.title}>
          Next 24 Hours
        </h3>

        <div style={styles.badge}>
          <span
            style={styles.cloudIcon}
          >
            🌧️
          </span>

          <span>
            {rainProbability !== null
              ? `${rainProbability}% rain probability`
              : 'Rain probability'}
          </span>
        </div>
      </div>

      {/* CHART */}

      <div
        style={styles.chartContainer}
      >
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={styles.svg}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="hourlyAreaGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#38bdf8"
                stopOpacity="0.20"
              />

              <stop
                offset="100%"
                stopColor="#38bdf8"
                stopOpacity="0"
              />
            </linearGradient>

            <filter
              id="hourlyLineGlow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="3"
                floodColor="#38bdf8"
                floodOpacity="0.45"
              />
            </filter>
          </defs>

          {/* AREA */}

          <path
            d={`
              ${pathD}
              L ${points[points.length - 1].x}
                ${maxY + 15}
              L ${points[0].x}
                ${maxY + 15}
              Z
            `}
            fill="url(#hourlyAreaGradient)"
          />

          {/* ANIMATED LINE */}

          <path
            className={`hourly-forecast-line ${
              isVisible
                ? 'visible'
                : ''
            }`}
            d={pathD}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="1"
            filter="url(#hourlyLineGlow)"
          />

          {/* POINTS */}

          {points.map(
            (point, index) => (
              <g key={index}>
                <text
                  x={point.x}
                  y={point.y - 10}
                  fill="#ffffff"
                  fontSize="12"
                  fontWeight="500"
                  textAnchor="middle"
                >
                  {point.temp}
                </text>

                <circle
                  cx={point.x}
                  cy={point.y}
                  r="3.5"
                  fill="#38bdf8"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />

                <line
                  x1={point.x}
                  y1={maxY + 8}
                  x2={point.x}
                  y2={maxY + 12}
                  stroke="rgba(255, 255, 255, 0.20)"
                  strokeWidth="1"
                />

                <text
                  x={point.x}
                  y={maxY + 25}
                  fill="#94a3b8"
                  fontSize="11"
                  textAnchor="middle"
                >
                  {point.time}
                </text>
              </g>
            )
          )}

          {/* DIVIDER */}

          <line
            x1={paddingX - 10}
            y1={maxY + 10}
            x2={
              svgWidth -
              paddingX +
              10
            }
            y2={maxY + 10}
            stroke="rgba(255, 255, 255, 0.10)"
            strokeWidth="1"
          />
        </svg>
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
     MAIN CARD
     ===================================================== */

  card: {
    position: 'relative',

    background:
      'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%)',

    backdropFilter:
      'blur(20px)',

    WebkitBackdropFilter:
      'blur(20px)',

    borderRadius: '24px',

    padding: '20px 24px',

    border:
      '1px solid rgba(255, 255, 255, 0.15)',

    boxShadow:
      '0 8px 32px 0 rgba(0, 0, 0, 0.25)',

    overflow: 'hidden',
  },


  /* =====================================================
     HEADER
     ===================================================== */

  header: {
    display: 'flex',

    justifyContent:
      'space-between',

    alignItems: 'center',

    marginBottom: '8px',
  },


  title: {
    margin: 0,

    fontSize: '18px',

    fontWeight: 600,

    color: '#ffffff',

    letterSpacing: '-0.3px',
  },


  /* =====================================================
     RAIN BADGE
     ===================================================== */

  badge: {
    display: 'flex',

    alignItems: 'center',

    gap: '6px',

    fontSize: '13px',

    color: '#e2e8f0',

    fontWeight: 400,
  },


  cloudIcon: {
    fontSize: '14px',

    lineHeight: 1,
  },


  /* =====================================================
     CHART
     ===================================================== */

  chartContainer: {
    width: '100%',

    overflow: 'visible',

    marginTop: '2px',
  },


  svg: {
    display: 'block',

    width: '100%',

    height: 'auto',

    overflow: 'visible',
  },


  /* =====================================================
     SKELETON
     ===================================================== */

  skeletonBlock: {
    borderRadius: '7px',
    flexShrink: 0,
  },


  skeletonBadge: {
    display: 'flex',

    alignItems: 'center',

    gap: '7px',
  },


  skeletonChart: {
    position: 'relative',

    width: '100%',

    marginTop: '2px',

    overflow: 'hidden',

    borderRadius: '12px',
  },


  skeletonShimmerOverlay: {
    position: 'absolute',

    inset: 0,

    borderRadius: '12px',

    opacity: 0.55,

    pointerEvents: 'none',
  },


  /* =====================================================
     ERROR
     ===================================================== */

  errorContainer: {
    minHeight: '160px',

    display: 'flex',

    flexDirection: 'column',

    alignItems: 'center',

    justifyContent: 'center',

    gap: '6px',

    textAlign: 'center',
  },


  errorTitle: {
    fontSize: '17px',

    fontWeight: 600,

    color: '#ffffff',
  },


  errorText: {
    fontSize: '13px',

    color: '#94a3b8',
  },
};
