
import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  CalendarDays,
  RefreshCw,
} from 'lucide-react';

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


/*
 * Kalna, West Bengal
 */

const LATITUDE = 23.2194;
const LONGITUDE = 88.3500;


/* =========================================================
   SKELETON COMPONENT
   ========================================================= */

const Skeleton: React.FC<{
  width?: string;
  height?: string;
  borderRadius?: string;
  style?: React.CSSProperties;
}> = ({
  width = '100%',
  height = '12px',
  borderRadius = '8px',
  style,
}) => (
  <div
    className="forecast-skeleton"
    style={{
      width,
      height,
      borderRadius,
      ...style,
    }}
  />
);


/* =========================================================
   COMPONENT
   ========================================================= */

export const SevenDayForecast: React.FC = () => {

  const [
    forecastData,
    setForecastData,
  ] = useState<ForecastItem[]>([]);

  const [
    locationName,
    setLocationName,
  ] = useState('Kalna, West Bengal');

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');

  const [
    animate,
    setAnimate,
  ] = useState(false);

  const cardRef =
    useRef<HTMLDivElement | null>(null);


  /* =======================================================
     FETCH FROM DJANGO BACKEND
     ======================================================= */

  const fetchForecast = async (
    showLoading = true
  ) => {

    try {

      if (showLoading) {
        setLoading(true);
      }

      setError('');


      /* ===================================================
         BUILD URL
         =================================================== */

      const url =
        `${BACKEND_URL}/api/weather/forecast/` +
        `?lat=${LATITUDE}` +
        `&lon=${LONGITUDE}`;


      /* ===================================================
         FETCH
         =================================================== */

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
          `Backend request failed (${response.status})`
        );

      }


      /* ===================================================
         PARSE RESPONSE
         =================================================== */

      const result:
        BackendForecastResponse =
          await response.json();


      /* ===================================================
         BACKEND ERROR
         =================================================== */

      if (!result.success) {

        throw new Error(
          result.error ||
          'Unable to load forecast.'
        );

      }


      /* ===================================================
         VALIDATE DATA
         =================================================== */

      if (
        !result.data ||
        !result.data.forecast ||
        !result.data.forecast.length
      ) {

        throw new Error(
          'No forecast data available.'
        );

      }


      /* ===================================================
         SET LOCATION
         =================================================== */

      if (result.data.location) {

        const name =
          result.data.location.name ||
          'Kalna';

        const country =
          result.data.location.country ||
          'IN';

        setLocationName(
          `${name}, ${country}`
        );

      }


      /* ===================================================
         SET FORECAST
         =================================================== */

      setForecastData(
        result.data.forecast
      );

    }

    catch (err) {

      console.error(
        'MeghAI forecast error:',
        err
      );


      if (err instanceof Error) {

        setError(
          err.message ||
          'Unable to load weather forecast.'
        );

      }

      else {

        setError(
          'Unable to load weather forecast.'
        );

      }

    }

    finally {

      if (showLoading) {
        setLoading(false);
      }

    }

  };


  /* =======================================================
     INITIAL FETCH
     ======================================================= */

  useEffect(() => {

    fetchForecast(true);

  }, []);


  /* =======================================================
     BAR ANIMATION
     ======================================================= */

  useEffect(() => {

    const currentCard =
      cardRef.current;

    if (!currentCard) {
      return;
    }


    let animationTimeout:
      ReturnType<typeof setTimeout> | null =
        null;


    const observer =
      new IntersectionObserver(

        ([entry]) => {

          if (
            entry.isIntersecting &&
            forecastData.length > 0
          ) {

            setAnimate(false);


            animationTimeout =
              setTimeout(() => {

                setAnimate(true);

              }, 120);

          }

          else {

            setAnimate(false);

          }

        },

        {
          threshold: 0.25,
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
    forecastData.length,
  ]);


  /* =======================================================
     LOADING STATE — SKELETON
     ======================================================= */

  if (loading) {

    return (

      <div
        ref={cardRef}
        style={{
          ...styles.card,
          ...styles.glassEffect,
        }}
      >

        {/* ===============================================
            HEADER SKELETON
            =============================================== */}

        <div
          style={styles.header}
        >

          <div>

            <Skeleton
              width="125px"
              height="16px"
              borderRadius="6px"
            />

            <Skeleton
              width="95px"
              height="9px"
              borderRadius="5px"
              style={{
                marginTop: '7px',
              }}
            />

          </div>


          <Skeleton
            width="88px"
            height="28px"
            borderRadius="12px"
          />

        </div>


        {/* ===============================================
            FORECAST ROW SKELETONS
            =============================================== */}

        <div
          style={styles.forecastList}
        >

          {Array.from({
            length: 5,
          }).map((_, index) => (

            <div
              key={index}
              style={
                styles.forecastRow
              }
            >

              {/* DAY */}

              <div
                style={
                  styles.dayContainer
                }
              >

                <Skeleton
                  width={
                    index === 0
                      ? '45px'
                      : '52px'
                  }
                  height="11px"
                  borderRadius="5px"
                />

                <Skeleton
                  width="38px"
                  height="8px"
                  borderRadius="4px"
                  style={{
                    marginTop: '5px',
                  }}
                />

              </div>


              {/* WEATHER ICON */}

              <div
                style={
                  styles.iconContainer
                }
              >

                <Skeleton
                  width="28px"
                  height="28px"
                  borderRadius="50%"
                />

              </div>


              {/* DESCRIPTION */}

              <div
                style={
                  styles.descriptionContainer
                }
              >

                <Skeleton
                  width={
                    index % 2 === 0
                      ? '72px'
                      : '58px'
                  }
                  height="9px"
                  borderRadius="5px"
                />

              </div>


              {/* TEMPERATURE BAR */}

              <div
                style={
                  styles.barContainer
                }
              >

                <Skeleton
                  width="100%"
                  height="5px"
                  borderRadius="10px"
                />

              </div>


              {/* RAIN */}

              <div
                style={
                  styles.rainProbability
                }
              >

                <Skeleton
                  width="32px"
                  height="9px"
                  borderRadius="4px"
                />

              </div>


              {/* TEMPERATURE */}

              <div
                style={
                  styles.tempContainer
                }
              >

                <Skeleton
                  width="42px"
                  height="11px"
                  borderRadius="5px"
                />

              </div>

            </div>

          ))}

        </div>


        {/* ===============================================
            FOOTER SKELETON
            =============================================== */}

        <div
          style={styles.footer}
        >

          <Skeleton
            width="95px"
            height="8px"
            borderRadius="4px"
          />

          <Skeleton
            width="55px"
            height="8px"
            borderRadius="4px"
          />

        </div>


        {/* ===============================================
            SKELETON ANIMATION
            =============================================== */}

        <style>
          {`

            @keyframes forecastSkeletonShimmer {

              0% {
                background-position:
                  200% 0;
              }

              100% {
                background-position:
                  -200% 0;
              }

            }


            .forecast-skeleton {

              background:
                linear-gradient(
                  90deg,
                  rgba(255, 255, 255, 0.05) 25%,
                  rgba(255, 255, 255, 0.13) 50%,
                  rgba(255, 255, 255, 0.05) 75%
                );

              background-size:
                200% 100%;

              animation:
                forecastSkeletonShimmer
                1.5s
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
        ref={cardRef}
        style={{
          ...styles.card,
          ...styles.glassEffect,
        }}
      >

        <div
          style={styles.header}
        >

          <span
            style={styles.cardTitle}
          >
            5-Day Forecast
          </span>


          <div
            style={styles.badge}
          >

            <CalendarDays
              size={14}
              color="#38bdf8"
            />

            <span>
              Forecast
            </span>

          </div>

        </div>


        <div
          style={
            styles.errorContainer
          }
        >

          <div
            style={styles.errorIcon}
          >
            ⚠️
          </div>


          <span
            style={
              styles.errorTitle
            }
          >
            Forecast unavailable
          </span>


          <span
            style={
              styles.errorText
            }
          >
            {error}
          </span>


          <button
            onClick={() =>
              fetchForecast(true)
            }
            style={
              styles.retryButton
            }
          >

            <RefreshCw
              size={13}
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
     MAIN UI
     ======================================================= */

  return (

    <div
      ref={cardRef}
      style={{
        ...styles.card,
        ...styles.glassEffect,
      }}
    >

      {/* =================================================
          HEADER
          ================================================= */}

      <div
        style={styles.header}
      >

        <div>

          <div
            style={styles.titleRow}
          >

            <span
              style={
                styles.cardTitle
              }
            >
              5-Day Forecast
            </span>

          </div>


          <div
            style={
              styles.locationText
            }
          >
            {locationName}
          </div>

        </div>


        <div
          style={styles.badge}
        >

          <CalendarDays
            size={14}
            color="#38bdf8"
          />

          <span>
            3-hour data
          </span>

        </div>

      </div>


      {/* =================================================
          FORECAST LIST
          ================================================= */}

      <div
        style={
          styles.forecastList
        }
      >

        {forecastData.map(
          (item, index) => {

            const barWidth =
              Math.min(
                Math.max(
                  item.maxTemp,
                  0
                ) / 40 * 100,
                100
              );


            return (

              <div
                key={`${item.date}-${index}`}
                style={
                  styles.forecastRow
                }
                className="forecast-row"
              >

                {/* DAY */}

                <div
                  style={
                    styles.dayContainer
                  }
                >

                  <span
                    style={
                      styles.dayText
                    }
                  >
                    {index === 0
                      ? 'Today'
                      : item.day}
                  </span>


                  <span
                    style={
                      styles.dateText
                    }
                  >
                    {item.date}
                  </span>

                </div>


                {/* ICON */}

                <div
                  style={
                    styles.iconContainer
                  }
                >

                  <img
                    src={item.iconUrl}
                    alt={
                      item.description
                    }
                    style={
                      styles.weatherIcon
                    }
                  />

                </div>


                {/* DESCRIPTION */}

                <div
                  style={
                    styles.descriptionContainer
                  }
                >

                  <span
                    style={
                      styles.weatherDescription
                    }
                  >
                    {item.description}
                  </span>

                </div>


                {/* TEMPERATURE BAR */}

                <div
                  style={
                    styles.barContainer
                  }
                >

                  <div
                    style={
                      styles.barTrack
                    }
                  >

                    <div
                      style={{
                        ...styles.barFill,

                        width:
                          animate
                            ? `${barWidth}%`
                            : '0%',

                        backgroundColor:
                          item.barColor,

                        boxShadow:
                          animate
                            ? `0 0 10px ${item.barColor}80`
                            : 'none',
                      }}
                    />

                  </div>

                </div>


                {/* RAIN */}

                <div
                  style={
                    styles.rainProbability
                  }
                >

                  <span
                    style={
                      styles.rainIcon
                    }
                  >
                    💧
                  </span>

                  <span>
                    {item.rainProbability}%
                  </span>

                </div>


                {/* TEMPERATURE */}

                <div
                  style={
                    styles.tempContainer
                  }
                >

                  <span
                    style={
                      styles.minTemp
                    }
                  >
                    {item.minTemp}°
                  </span>


                  <span
                    style={
                      styles.maxTemp
                    }
                  >
                    {item.maxTemp}°
                  </span>

                </div>

              </div>

            );

          }
        )}

      </div>


      {/* =================================================
          FOOTER
          ================================================= */}

      <div
        style={styles.footer}
      >

        <span>
          Updated from MeghAI
        </span>


        <button
          onClick={() =>
            fetchForecast(true)
          }
          style={
            styles.refreshButton
          }
          className="refreshButton"
          title="Refresh forecast"
        >

          <RefreshCw
            size={11}
          />

          <span>
            Refresh
          </span>

        </button>

      </div>


      {/* =================================================
          ANIMATIONS
          ================================================= */}

      <style>
        {`

          .forecast-row {

            transition:
              background 0.2s ease,
              transform 0.2s ease;

          }


          .forecast-row:hover {

            background:
              rgba(255, 255, 255, 0.045);

            transform:
              translateX(2px);

          }


          .refreshButton:hover {

            color:
              #38bdf8;

          }

        `}
      </style>

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


  /* =======================================================
     CARD
     ======================================================= */

  card: {

    position: 'relative',

    borderRadius: '24px',

    padding: '18px 22px',

    display: 'flex',

    flexDirection: 'column',

    minHeight: '230px',

    width: '100%',

    boxSizing: 'border-box',

    overflow: 'hidden',

  },


  /* =======================================================
     GLASS EFFECT
     ======================================================= */

  glassEffect: {

    background:
      'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%)',

    backdropFilter:
      'blur(20px)',

    WebkitBackdropFilter:
      'blur(20px)',

    border:
      '1px solid rgba(255, 255, 255, 0.14)',

    boxShadow:
      '0 8px 32px 0 rgba(0, 0, 0, 0.22)',

  },


  /* =======================================================
     HEADER
     ======================================================= */

  header: {

    display: 'flex',

    justifyContent:
      'space-between',

    alignItems: 'center',

    marginBottom: '10px',

    gap: '12px',

    flexShrink: 0,

  },


  titleRow: {

    display: 'flex',

    alignItems: 'center',

  },


  cardTitle: {

    fontSize: '16px',

    fontWeight: 600,

    color: '#ffffff',

    letterSpacing:
      '-0.2px',

  },


  locationText: {

    fontSize: '10px',

    color: '#94a3b8',

    marginTop: '3px',

  },


  badge: {

    display: 'flex',

    alignItems: 'center',

    gap: '6px',

    fontSize: '10px',

    fontWeight: 500,

    color: '#38bdf8',

    backgroundColor:
      'rgba(56, 189, 248, 0.12)',

    padding:
      '5px 10px',

    borderRadius:
      '12px',

    border:
      '1px solid rgba(56, 189, 248, 0.25)',

    whiteSpace:
      'nowrap',

    flexShrink: 0,

  },


  /* =======================================================
     FORECAST LIST
     ======================================================= */

  forecastList: {

    display: 'flex',

    flexDirection:
      'column',

    flex: 1,

    gap: '2px',

  },


  forecastRow: {

    display: 'grid',

    gridTemplateColumns:
      '72px 34px minmax(65px, 85px) minmax(55px, 1fr) 45px 58px',

    alignItems:
      'center',

    columnGap:
      '8px',

    padding:
      '3px 5px',

    minHeight:
      '34px',

    borderRadius:
      '9px',

    boxSizing:
      'border-box',

    width:
      '100%',

  },


  dayContainer: {

    display: 'flex',

    flexDirection:
      'column',

    minWidth:
      '0',

  },


  dayText: {

    fontSize:
      '11.5px',

    fontWeight:
      600,

    color:
      '#f1f5f9',

    whiteSpace:
      'nowrap',

    overflow:
      'hidden',

    textOverflow:
      'ellipsis',

  },


  dateText: {

    fontSize:
      '8.5px',

    color:
      '#64748b',

    marginTop:
      '2px',

  },


  iconContainer: {

    display:
      'flex',

    alignItems:
      'center',

    justifyContent:
      'center',

    width:
      '34px',

    height:
      '34px',

  },


  weatherIcon: {

    width:
      '32px',

    height:
      '32px',

    objectFit:
      'contain',

    display:
      'block',

  },


  descriptionContainer: {

    minWidth:
      '0',

    overflow:
      'hidden',

  },


  weatherDescription: {

    display:
      'block',

    fontSize:
      '9.5px',

    color:
      '#94a3b8',

    textTransform:
      'capitalize',

    whiteSpace:
      'nowrap',

    overflow:
      'hidden',

    textOverflow:
      'ellipsis',

  },


  /* =======================================================
     TEMPERATURE BAR
     ======================================================= */

  barContainer: {

    display:
      'flex',

    alignItems:
      'center',

    width:
      '100%',

    minWidth:
      '0',

  },


  barTrack: {

    width:
      '100%',

    height:
      '5px',

    backgroundColor:
      'rgba(255, 255, 255, 0.10)',

    borderRadius:
      '10px',

    overflow:
      'hidden',

    position:
      'relative',

  },


  barFill: {

    height:
      '100%',

    borderRadius:
      '10px',

    transition:
      'width 1.1s cubic-bezier(0.34, 1.28, 0.64, 1)',

  },


  /* =======================================================
     RAIN
     ======================================================= */

  rainProbability: {

    display:
      'flex',

    alignItems:
      'center',

    justifyContent:
      'flex-end',

    gap:
      '3px',

    fontSize:
      '9px',

    color:
      '#7dd3fc',

    whiteSpace:
      'nowrap',

  },


  rainIcon: {

    fontSize:
      '9px',

  },


  /* =======================================================
     TEMPERATURE
     ======================================================= */

  tempContainer: {

    display:
      'flex',

    alignItems:
      'center',

    justifyContent:
      'flex-end',

    gap:
      '5px',

    whiteSpace:
      'nowrap',

  },


  minTemp: {

    fontSize:
      '10px',

    color:
      '#94a3b8',

    fontWeight:
      500,

  },


  maxTemp: {

    fontSize:
      '12px',

    fontWeight:
      700,

    color:
      '#ffffff',

  },


  /* =======================================================
     FOOTER
     ======================================================= */

  footer: {

    display:
      'flex',

    alignItems:
      'center',

    justifyContent:
      'space-between',

    marginTop:
      '7px',

    paddingTop:
      '7px',

    borderTop:
      '1px solid rgba(255,255,255,0.08)',

    color:
      '#64748b',

    fontSize:
      '8px',

  },


  refreshButton: {

    display:
      'flex',

    alignItems:
      'center',

    gap:
      '4px',

    background:
      'transparent',

    border:
      'none',

    color:
      '#64748b',

    fontSize:
      '8px',

    cursor:
      'pointer',

    padding:
      '2px 4px',

  },


  /* =======================================================
     ERROR
     ======================================================= */

  errorContainer: {

    flex:
      1,

    display:
      'flex',

    flexDirection:
      'column',

    alignItems:
      'center',

    justifyContent:
      'center',

    gap:
      '5px',

    textAlign:
      'center',

  },


  errorIcon: {

    fontSize:
      '22px',

    marginBottom:
      '2px',

  },


  errorTitle: {

    color:
      '#f8fafc',

    fontSize:
      '13px',

    fontWeight:
      600,

  },


  errorText: {

    color:
      '#94a3b8',

    fontSize:
      '10px',

    maxWidth:
      '300px',

    lineHeight:
      1.4,

  },


  retryButton: {

    display:
      'flex',

    alignItems:
      'center',

    gap:
      '5px',

    marginTop:
      '8px',

    padding:
      '6px 11px',

    borderRadius:
      '10px',

    border:
      '1px solid rgba(56,189,248,0.3)',

    background:
      'rgba(56,189,248,0.1)',

    color:
      '#7dd3fc',

    fontSize:
      '10px',

    cursor:
      'pointer',

  },

};
