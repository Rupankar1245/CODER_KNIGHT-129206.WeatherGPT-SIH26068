import React, { useEffect, useRef, useState } from 'react';
import { Droplets } from 'lucide-react';

/* =========================================================
   TYPES
========================================================= */

interface ForecastItem {
  day: string;
  date: string;
  iconUrl: string;
  minTemp: number;
  maxTemp: number;
  description: string;
  rainProbability: number;
  barColor: string;
}

interface BackendForecastResponse {
  success: boolean;

  data?: {
    location: {
      name: string;
      country: string;
    };

    forecast: ForecastItem[];
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

export const SevenDayForecast: React.FC = () => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const [forecastData, setForecastData] = useState<ForecastItem[]>([]);

  const [locationName, setLocationName] = useState(
    'Current Location'
  );

  const [isVisible, setIsVisible] = useState(false);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  /* =======================================================
     FETCH FORECAST USING CURRENT LOCATION
     ======================================================= */

  const fetchForecast = async (
    latitude: number,
    longitude: number
  ) => {
    try {
      setLoading(true);
      setError('');

      /*
       * IMPORTANT:
       *
       * Frontend does NOT call OpenWeather directly.
       *
       * Frontend -> Django -> OpenWeather
       */

      const url =
        `${BACKEND_URL}/api/weather/forecast/` +
        `?lat=${latitude}` +
        `&lon=${longitude}`;

      const response = await fetch(url);

      /* -----------------------------------------------
         HTTP ERROR
      ------------------------------------------------ */

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => null);

        throw new Error(
          errorData?.error ||
            `Backend request failed (${response.status})`
        );
      }

      /* -----------------------------------------------
         PARSE RESPONSE
      ------------------------------------------------ */

      const result: BackendForecastResponse =
        await response.json();

      /* -----------------------------------------------
         BACKEND ERROR
      ------------------------------------------------ */

      if (!result.success) {
        throw new Error(
          result.error ||
            'Unable to load forecast.'
        );
      }

      /* -----------------------------------------------
         VALIDATE DATA
      ------------------------------------------------ */

      if (
        !result.data ||
        !result.data.forecast ||
        !result.data.forecast.length
      ) {
        throw new Error(
          'No forecast data available.'
        );
      }

      /* -----------------------------------------------
         LOCATION NAME
      ------------------------------------------------ */

      if (result.data.location) {
        const name =
          result.data.location.name ||
          'Current Location';

        const country =
          result.data.location.country || '';

        setLocationName(
          country
            ? `${name}, ${country}`
            : name
        );
      }

      /* -----------------------------------------------
         FORECAST DATA
      ------------------------------------------------ */

      setForecastData(
        result.data.forecast
      );

      /*
       * Backend currently returns:
       *
       * 5 forecast items
       *
       * So humidity animation array
       * must also contain 5 items.
       *
       * Your current backend response doesn't
       * contain humidity, so we don't invent it.
       */

      

    } catch (err) {
      console.error(
        'MeghAI forecast error:',
        err
      );

      if (err instanceof Error) {
        setError(
          err.message ||
            'Unable to load weather forecast.'
        );
      } else {
        setError(
          'Unable to load weather forecast.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     GET USER LOCATION
  ======================================================= */

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(
        'Location services are not supported by this browser.'
      );

      setLoading(false);

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        console.log(
          'MeghAI location:',
          latitude,
          longitude
        );

        fetchForecast(
          latitude,
          longitude
        );
      },
      (locationError) => {
        console.error(
          'MeghAI location error:',
          locationError
        );

        setError(
          'Unable to access your location. Please allow location permission.'
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

  /* =======================================================
     FORECAST ANIMATION
  ======================================================= */

  useEffect(() => {
    const currentCard =
      cardRef.current;

    if (!currentCard) {
      return;
    }

    if (loading || forecastData.length === 0) {
      return;
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(false);

            const timer = setTimeout(() => {
              setIsVisible(true);
            }, 100);

            return () => {
              clearTimeout(timer);
            };
          } else {
            setIsVisible(false);
          }
        },
        {
          threshold: 0.2,
        }
      );

    observer.observe(currentCard);

    return () => {
      observer.disconnect();
    };
  }, [loading, forecastData]);

  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (loading) {
    return (
      <section
        ref={cardRef}
        style={styles.card}
      >
        <div style={styles.header}>
          <div>
            <h3 style={styles.title}>
              5-Day Forecast
            </h3>

            <p style={styles.subtitle}>
              Daily weather outlook
            </p>
          </div>

          <span style={styles.headerBadge}>
            Forecast
          </span>
        </div>

        <div
          style={{
            minHeight: '210px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#94a3b8',
            fontSize: '12px',
          }}
        >
          Loading forecast...
        </div>
      </section>
    );
  }

  /* =======================================================
     ERROR STATE
  ======================================================= */

  if (error) {
    return (
      <section
        ref={cardRef}
        style={styles.card}
      >
        <div style={styles.header}>
          <div>
            <h3 style={styles.title}>
              5-Day Forecast
            </h3>

            <p style={styles.subtitle}>
              Daily weather outlook
            </p>
          </div>

          <span style={styles.headerBadge}>
            Forecast
          </span>
        </div>

        <div
          style={{
            minHeight: '210px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            color: '#94a3b8',
            fontSize: '12px',
            textAlign: 'center',
            padding: '20px',
          }}
        >
          <span
            style={{
              fontSize: '22px',
            }}
          >
            ⚠️
          </span>

          <span
            style={{
              color: '#f8fafc',
              fontWeight: 600,
            }}
          >
            Forecast unavailable
          </span>

          <span
            style={{
              fontSize: '10px',
              maxWidth: '320px',
              lineHeight: 1.5,
            }}
          >
            {error}
          </span>
        </div>
      </section>
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <section
      ref={cardRef}
      style={styles.card}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>
            5-Day Forecast
          </h3>

          <p style={styles.subtitle}>
            {locationName}
          </p>
        </div>

        <span style={styles.headerBadge}>
          Next 5 Days
        </span>
      </div>

      {/* =====================================================
          FORECAST LIST
      ===================================================== */}

      <div style={styles.forecastScroll}>
        <div style={styles.forecastGrid}>
          {forecastData.map(
            (item, index) => {
              return (
                <div
                  key={`${item.date}-${index}`}
                  style={{
                    ...styles.dayCard,

                    ...(index === 0
                      ? styles.todayCard
                      : {}),

                    opacity:
                      isVisible ? 1 : 0,

                    transform:
                      isVisible
                        ? 'translateY(0) scale(1)'
                        : 'translateY(18px) scale(0.97)',

                    transitionDelay:
                      isVisible
                        ? `${index * 90}ms`
                        : '0ms',
                  }}
                >
                  {/* ================= DAY ================= */}

                  <div style={styles.dayInfo}>
                    <span
                      style={{
                        ...styles.day,

                        ...(index === 0
                          ? styles.todayText
                          : {}),
                      }}
                    >
                      {index === 0
                        ? 'Today'
                        : item.day}
                    </span>

                    <span style={styles.date}>
                      {item.date}
                    </span>
                  </div>

                  {/* ================= WEATHER ICON ================= */}

                  <div
                    style={{
                      ...styles.weatherIcon,

                      ...(index === 0
                        ? styles.todayIcon
                        : {}),

                      transform:
                        isVisible
                          ? 'scale(1)'
                          : 'scale(0.75)',

                      opacity:
                        isVisible ? 1 : 0,

                      transitionDelay:
                        isVisible
                          ? `${index * 90 + 120}ms`
                          : '0ms',
                    }}
                  >
                    <img
                      src={item.iconUrl}
                      alt={item.description}
                      style={{
                        width: '36px',
                        height: '36px',
                        objectFit: 'contain',
                      }}
                    />
                  </div>

                  {/* ================= CONDITION ================= */}

                  <span style={styles.condition}>
                    {item.description}
                  </span>

                  {/* ================= TEMPERATURE ================= */}

                  <div
                    style={
                      styles.temperatureRow
                    }
                  >
                    <span style={styles.high}>
                      {item.maxTemp}°
                    </span>

                    <span style={styles.low}>
                      {item.minTemp}°
                    </span>
                  </div>

                  {/* ================= PRECIPITATION ================= */}

                  <div
                    style={
                      styles.precipitation
                    }
                  >
                    <Droplets
                      size={13}
                      strokeWidth={2}
                      color="#38bdf8"
                    />

                    <span>
                      {item.rainProbability}%
                    </span>
                  </div>

                  {/* ================= HUMIDITY ================= */}

                  <div
                    style={
                      styles.humidityWrapper
                    }
                  >
                    <div
                      style={
                        styles.humidityHeader
                      }
                    >
                      <span>
                        Rain probability
                      </span>

                      <span>
                        {item.rainProbability}%
                      </span>
                    </div>

                    <div
                      style={
                        styles.progressTrack
                      }
                    >
                      <div
                        style={{
                          ...styles.progressBar,

                          width:
                            isVisible
                              ? `${item.rainProbability}%`
                              : '0%',

                          transitionDelay:
                            isVisible
                              ? `${index * 90 + 350}ms`
                              : '0ms',
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </section>
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
     MAIN GLASS CARD
  ===================================================== */

  card: {
    position: 'relative',

    width: '100%',

    padding: '22px',

    borderRadius: '24px',

    boxSizing: 'border-box',

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

    justifyContent: 'space-between',

    marginBottom: '20px',

    gap: '16px',
  },

  title: {
    margin: 0,

    fontSize: '17px',

    fontWeight: 600,

    color: '#f8fafc',

    letterSpacing: '-0.2px',
  },

  subtitle: {
    margin: '4px 0 0',

    fontSize: '12px',

    color: '#94a3b8',
  },

  headerBadge: {
    padding: '6px 11px',

    borderRadius: '10px',

    background:
      'rgba(56,189,248,0.07)',

    border:
      '1px solid rgba(56,189,248,0.13)',

    color: '#7dd3fc',

    fontSize: '11px',

    fontWeight: 500,

    whiteSpace: 'nowrap',
  },

  /* =====================================================
     HORIZONTAL SCROLL
  ===================================================== */

  forecastScroll: {
    width: '100%',

    overflowX: 'auto',

    overflowY: 'hidden',

    paddingBottom: '5px',

    scrollbarWidth: 'thin',
  },

  forecastGrid: {
    display: 'grid',

    gridTemplateColumns:
      'repeat(5, minmax(145px, 1fr))',

    gap: '12px',

    minWidth: '770px',
  },

  /* =====================================================
     DAY CARD
  ===================================================== */

  dayCard: {
    position: 'relative',

    minHeight: '210px',

    padding: '15px 13px',

    borderRadius: '18px',

    background:
      'linear-gradient(145deg, rgba(255,255,255,0.065), rgba(255,255,255,0.025))',

    backdropFilter:
      'blur(14px)',

    WebkitBackdropFilter:
      'blur(14px)',

    border:
      '1px solid rgba(255,255,255,0.08)',

    display: 'flex',

    flexDirection: 'column',

    alignItems: 'center',

    boxSizing: 'border-box',

    transition:
      'opacity 0.65s ease, transform 0.65s cubic-bezier(0.22,1,0.36,1), border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease',
  },

  /* =====================================================
     TODAY CARD
  ===================================================== */

  todayCard: {
    background:
      'linear-gradient(145deg, rgba(56,189,248,0.13), rgba(56,189,248,0.035))',

    border:
      '1px solid rgba(56,189,248,0.26)',

    boxShadow:
      '0 8px 24px rgba(56,189,248,0.07), inset 0 1px 0 rgba(255,255,255,0.06)',
  },

  /* =====================================================
     DAY
  ===================================================== */

  dayInfo: {
    display: 'flex',

    flexDirection: 'column',

    alignItems: 'center',

    gap: '3px',
  },

  day: {
    fontSize: '13px',

    fontWeight: 600,

    color: '#e2e8f0',
  },

  todayText: {
    color: '#7dd3fc',
  },

  date: {
    fontSize: '10px',

    color: '#64748b',
  },

  /* =====================================================
     WEATHER ICON
  ===================================================== */

  weatherIcon: {
    width: '52px',

    height: '52px',

    marginTop: '13px',

    borderRadius: '16px',

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',

    color: '#bae6fd',

    background:
      'rgba(56,189,248,0.07)',

    border:
      '1px solid rgba(56,189,248,0.10)',

    boxShadow:
      'inset 0 1px 0 rgba(255,255,255,0.04)',

    transition:
      'opacity 0.5s ease, transform 0.7s cubic-bezier(0.34,1.3,0.64,1)',
  },

  todayIcon: {
    color: '#38bdf8',

    background:
      'rgba(56,189,248,0.11)',

    border:
      '1px solid rgba(56,189,248,0.18)',

    boxShadow:
      '0 0 18px rgba(56,189,248,0.06)',
  },

  /* =====================================================
     CONDITION
  ===================================================== */

  condition: {
    marginTop: '9px',

    fontSize: '11px',

    color: '#cbd5e1',

    textAlign: 'center',

    whiteSpace: 'nowrap',

    textTransform: 'capitalize',
  },

  /* =====================================================
     TEMPERATURE
  ===================================================== */

  temperatureRow: {
    display: 'flex',

    alignItems: 'baseline',

    gap: '7px',

    marginTop: '8px',
  },

  high: {
    fontSize: '18px',

    fontWeight: 700,

    color: '#ffffff',
  },

  low: {
    fontSize: '13px',

    fontWeight: 500,

    color: '#64748b',
  },

  /* =====================================================
     PRECIPITATION
  ===================================================== */

  precipitation: {
    display: 'flex',

    alignItems: 'center',

    gap: '4px',

    marginTop: '7px',

    fontSize: '11px',

    color: '#7dd3fc',
  },

  /* =====================================================
     HUMIDITY / RAIN BAR
  ===================================================== */

  humidityWrapper: {
    width: '100%',

    marginTop: '13px',

    paddingTop: '10px',

    borderTop:
      '1px solid rgba(255,255,255,0.07)',
  },

  humidityHeader: {
    display: 'flex',

    alignItems: 'center',

    justifyContent: 'space-between',

    fontSize: '9px',

    color: '#64748b',

    marginBottom: '5px',
  },

  progressTrack: {
    position: 'relative',

    width: '100%',

    height: '4px',

    borderRadius: '10px',

    background:
      'rgba(255,255,255,0.065)',

    border:
      '1px solid rgba(255,255,255,0.05)',

    overflow: 'hidden',

    boxShadow:
      'inset 0 1px 2px rgba(0,0,0,0.15)',
  },

  progressBar: {
    height: '100%',

    minWidth: '0',

    borderRadius: '10px',

    background:
      'linear-gradient(90deg, rgba(56,189,248,0.70), rgba(125,211,252,0.95))',

    boxShadow:
      '0 0 9px rgba(56,189,248,0.28)',

    transition:
      'width 1s cubic-bezier(0.34,1.25,0.64,1)',
  },
};