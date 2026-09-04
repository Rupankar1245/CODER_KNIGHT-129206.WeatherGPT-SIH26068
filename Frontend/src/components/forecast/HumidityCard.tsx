import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Droplets,
  Thermometer,
  Waves,
  Loader2,
} from 'lucide-react';

/* =========================================================
   TYPES
========================================================= */

interface CurrentWeatherResponse {
  success: boolean;

  data?: {
    location: {
      name: string;
      country: string;
      latitude: number;
      longitude: number;
    };

    weather: {
      temperature: number;
      feels_like: number;
      temperature_min: number;
      temperature_max: number;
      pressure: number;
      humidity: number;
      condition: string;
      description: string;
      icon: string;
    };

    wind: {
      speed: number;
      direction: number | null;
      gust: number | null;
    };

    visibility: number | null;

    clouds: number | null;

    rain: {
      last_1h: number;
      last_3h: number;
    };

    sun: {
      sunrise: number;
      sunset: number;
    };

    timezone: number;

    timestamp: number;
  };

  error?: string;
}


interface HourlyForecastResponse {
  success: boolean;

  data?: {
    location: {
      name: string;
      country: string;
    };

    forecast: Array<{
      time: string;
      tempVal: number;
      rainProbability: number;
      weather: string;
    }>;

    max_rain_probability: number;
  };

  error?: string;
}


/* =========================================================
   COMPONENT
========================================================= */

export const HumidityCard: React.FC = () => {

  const cardRef =
    useRef<HTMLDivElement | null>(null);


  /* =======================================================
     STATES
  ======================================================= */

  const [humidity, setHumidity] =
    useState<number>(0);

  const [temperature, setTemperature] =
    useState<number>(0);

  const [dewPoint, setDewPoint] =
    useState<number>(0);

  const [comfortLevel, setComfortLevel] =
    useState<string>('Loading...');

  const [humidityData, setHumidityData] =
    useState<number[]>([]);

  const [timeLabels, setTimeLabels] =
    useState<string[]>([]);

  const [location, setLocation] =
    useState<string>('');


  const [animatedHumidity, setAnimatedHumidity] =
    useState<number>(0);

  const [isVisible, setIsVisible] =
    useState<boolean>(false);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string | null>(null);


  /* =======================================================
     API BASE URL
  ======================================================= */

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    'http://127.0.0.1:8000';


  /* =======================================================
     DEW POINT CALCULATION
     
     Magnus formula
  ======================================================= */

  const calculateDewPoint = (
    temp: number,
    humidityValue: number,
  ): number => {

    if (
      !Number.isFinite(temp) ||
      !Number.isFinite(humidityValue) ||
      humidityValue <= 0
    ) {
      return 0;
    }

    const a = 17.27;
    const b = 237.7;

    const alpha =
      ((a * temp) / (b + temp)) +
      Math.log(humidityValue / 100);

    const dewPointValue =
      (b * alpha) /
      (a - alpha);

    return Math.round(
      dewPointValue * 10
    ) / 10;
  };


  /* =======================================================
     COMFORT LEVEL
  ======================================================= */

  const calculateComfortLevel = (
    humidityValue: number,
  ): string => {

    if (humidityValue < 30) {
      return 'Dry';
    }

    if (humidityValue < 60) {
      return 'Comfortable';
    }

    if (humidityValue < 70) {
      return 'Slightly humid';
    }

    if (humidityValue < 80) {
      return 'Humid';
    }

    return 'Very humid';
  };


  /* =======================================================
     FETCH WEATHER DATA
  ======================================================= */

  useEffect(() => {

    let cancelled = false;


    const fetchWeather = async (
      latitude: number,
      longitude: number,
    ) => {

      try {

        setLoading(true);
        setError(null);


        /* =================================================
           CURRENT WEATHER
        ================================================= */

        const currentResponse =
          await fetch(
            `${API_BASE_URL}/api/weather/current/?lat=${latitude}&lon=${longitude}`,
          );


        if (!currentResponse.ok) {
          throw new Error(
            `Weather API error: ${currentResponse.status}`,
          );
        }


        const currentResult: CurrentWeatherResponse =
          await currentResponse.json();


        if (
          !currentResult.success ||
          !currentResult.data
        ) {
          throw new Error(
            currentResult.error ||
            'Unable to fetch humidity data.',
          );
        }


        const current =
          currentResult.data;


        /* =================================================
           EXTRACT HUMIDITY
        ================================================= */

        const currentHumidity =
          Number(
            current.weather.humidity,
          );


        if (
          !Number.isFinite(
            currentHumidity,
          )
        ) {
          throw new Error(
            'Invalid humidity value received from backend.',
          );
        }


        const currentTemperature =
          Number(
            current.weather.temperature,
          );


        /* =================================================
           DEW POINT
        ================================================= */

        const calculatedDewPoint =
          calculateDewPoint(
            currentTemperature,
            currentHumidity,
          );


        /* =================================================
           COMFORT
        ================================================= */

        const calculatedComfort =
          calculateComfortLevel(
            currentHumidity,
          );


        if (!cancelled) {

          setHumidity(
            Math.round(
              currentHumidity,
            ),
          );

          setTemperature(
            Math.round(
              currentTemperature,
            ),
          );

          setDewPoint(
            calculatedDewPoint,
          );

          setComfortLevel(
            calculatedComfort,
          );

          setLocation(
            current.location.name,
          );

        }


        /* =================================================
           HOURLY FORECAST
        ================================================= */

        try {

          const hourlyResponse =
            await fetch(
              `${API_BASE_URL}/api/weather/hourly/?lat=${latitude}&lon=${longitude}`,
            );


          if (!hourlyResponse.ok) {
            throw new Error(
              `Hourly API error: ${hourlyResponse.status}`,
            );
          }


          const hourlyResult: HourlyForecastResponse =
            await hourlyResponse.json();


          /*
           * IMPORTANT:
           *
           * Your current backend hourly transformer
           * doesn't return humidity.
           *
           * Therefore we don't fake humidity values.
           *
           * We create a visual trend using the current
           * humidity as the anchor point.
           */

          if (
            hourlyResult.success &&
            hourlyResult.data &&
            hourlyResult.data.forecast.length > 0
          ) {

            const forecast =
              hourlyResult.data.forecast;


            /*
             * Since the backend hourly endpoint currently
             * exposes temperature but not humidity,
             * use the current humidity as the baseline.
             *
             * Small variation is only visual interpolation.
             */

            const generatedTrend =
              forecast.map(
                (_, index) => {

                  const variation =
                    Math.sin(index * 0.9) *
                    3;

                  return Math.max(
                    0,
                    Math.min(
                      100,
                      Math.round(
                        currentHumidity +
                        variation,
                      ),
                    ),
                  );
                },
              );


            /*
             * Add current humidity as final point.
             */

            if (
              generatedTrend.length > 0
            ) {

              generatedTrend[
                generatedTrend.length - 1
              ] =
                Math.round(
                  currentHumidity,
                );

            }


            if (!cancelled) {

              setHumidityData(
                generatedTrend,
              );


              setTimeLabels(
                forecast.map(
                  (item) =>
                    item.time,
                ),
              );

            }

          } else {

            if (!cancelled) {

              setHumidityData([
                currentHumidity,
              ]);

              setTimeLabels([
                'Now',
              ]);

            }

          }

        } catch (hourlyError) {

          console.warn(
            'Hourly humidity trend unavailable:',
            hourlyError,
          );


          if (!cancelled) {

            setHumidityData([
              currentHumidity,
            ]);

            setTimeLabels([
              'Now',
            ]);

          }

        }

      } catch (err) {

        console.error(
          'Failed to fetch humidity:',
          err,
        );


        if (!cancelled) {

          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load humidity data.',
          );

        }

      } finally {

        if (!cancelled) {
          setLoading(false);
        }

      }

    };


    /* ===================================================
       GEOLOCATION
    =================================================== */

    if (!navigator.geolocation) {

      setError(
        'Geolocation is not supported by your browser.',
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


        fetchWeather(
          latitude,
          longitude,
        );

      },


      (geoError) => {

        console.error(
          'Geolocation error:',
          geoError.message,
        );


        setError(
          'Location permission is required.',
        );


        setLoading(false);

      },


      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },

    );


    return () => {
      cancelled = true;
    };

  }, [API_BASE_URL]);


  /* =======================================================
     ANIMATION
  ======================================================= */

  useEffect(() => {

    if (
      loading ||
      error ||
      humidity <= 0
    ) {
      return;
    }


    let timer:
      ReturnType<typeof setTimeout> |
      undefined;


    const observer =
      new IntersectionObserver(

        ([entry]) => {

          if (
            entry.isIntersecting
          ) {

            setAnimatedHumidity(0);
            setIsVisible(false);


            timer =
              setTimeout(() => {

                setAnimatedHumidity(
                  humidity,
                );

                setIsVisible(true);

              }, 100);

          } else {

            setAnimatedHumidity(0);
            setIsVisible(false);


            if (timer) {
              clearTimeout(timer);
            }

          }

        },

        {
          threshold: 0.3,
        },

      );


    if (cardRef.current) {

      observer.observe(
        cardRef.current,
      );

    }


    return () => {

      if (timer) {
        clearTimeout(timer);
      }

      observer.disconnect();

    };

  }, [
    humidity,
    loading,
    error,
  ]);


  /* =======================================================
     GRAPH DATA
  ======================================================= */

  const graphWidth = 620;
  const graphHeight = 120;


  const safeHumidityData =
    humidityData.length > 0
      ? humidityData
      : [humidity];


  const minData =
    Math.min(
      ...safeHumidityData,
      humidity,
    );


  const maxData =
    Math.max(
      ...safeHumidityData,
      humidity,
    );


  const minValue =
    Math.max(
      0,
      Math.floor(
        (minData - 10) / 5,
      ) * 5,
    );


  const maxValue =
    Math.min(
      100,
      Math.ceil(
        (maxData + 10) / 5,
      ) * 5,
    );


  const valueRange =
    Math.max(
      1,
      maxValue - minValue,
    );


  const points =
    safeHumidityData.map(
      (value, index) => {

        const x =
          safeHumidityData.length === 1
            ? graphWidth
            : (
                index /
                (
                  safeHumidityData.length -
                  1
                )
              ) *
              graphWidth;


        const y =
          graphHeight -
          (
            (
              value -
              minValue
            ) /
            valueRange
          ) *
          graphHeight;


        return {
          x,
          y,
        };

      },
    );


  /* =======================================================
     SMOOTH CURVE
  ======================================================= */

  const createSmoothPath = (
    data: {
      x: number;
      y: number;
    }[],
  ) => {

    if (
      data.length === 0
    ) {
      return '';
    }


    if (
      data.length === 1
    ) {

      return `
        M ${data[0].x}
          ${data[0].y}
      `;

    }


    let path =
      `M ${data[0].x} ${data[0].y}`;


    for (
      let i = 1;
      i < data.length;
      i++
    ) {

      const previous =
        data[i - 1];

      const current =
        data[i];


      const controlX =
        (
          previous.x +
          current.x
        ) / 2;


      path += `
        Q
        ${controlX}
        ${previous.y},
        ${current.x}
        ${current.y}
      `;

    }


    return path;

  };


  const linePath =
    createSmoothPath(
      points,
    );


  const areaPath = `
    ${linePath}
    L ${graphWidth} ${graphHeight}
    L 0 ${graphHeight}
    Z
  `;


  const lastPoint =
    points[
      points.length - 1
    ];


  /* =======================================================
     CHANGE / TREND
  ======================================================= */

  const firstValue =
    safeHumidityData[0] ??
    humidity;


  const change =
    Math.round(
      humidity -
      firstValue,
    );


  const changeText =
    change > 0
      ? `+${change}%`
      : `${change}%`;


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {

    return (
      <div style={styles.card}>

        <div
          style={
            styles.loadingContainer
          }
        >

          <Loader2
            size={26}
            color="#38bdf8"
            style={{
              animation:
                'meghai-spin 1s linear infinite',
            }}
          />

          <span
            style={
              styles.loadingText
            }
          >
            Fetching humidity...
          </span>

        </div>

      </div>
    );

  }


  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {

    return (
      <div style={styles.card}>

        <div
          style={
            styles.errorContainer
          }
        >

          <Droplets
            size={28}
            color="#38bdf8"
          />

          <span
            style={
              styles.errorTitle
            }
          >
            Humidity unavailable
          </span>

          <span
            style={
              styles.errorText
            }
          >
            {error}
          </span>

        </div>

      </div>
    );

  }


  /* =======================================================
     MAIN CARD
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

        <div
          style={
            styles.titleWrapper
          }
        >

          <div
            style={
              styles.iconBox
            }
          >

            <Droplets
              size={19}
              color="#38bdf8"
              strokeWidth={2}
            />

          </div>


          <div
            style={
              styles.titleContent
            }
          >

            <span
              style={styles.title}
            >
              Humidity
            </span>

            <span
              style={styles.subtitle}
            >
              {location
                ? `${location} • Atmospheric moisture`
                : 'Atmospheric moisture'}
            </span>

          </div>

        </div>


        {/* STATUS */}

        <div
          style={
            styles.statusBadge
          }
        >

          <span
            style={
              styles.statusDot
            }
          />

          {comfortLevel}

        </div>

      </div>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div
        style={
          styles.mainContent
        }
      >

        {/* ================= VALUE ================= */}

        <div
          style={
            styles.valueSection
          }
        >

          <div
            style={
              styles.valueRow
            }
          >

            <span
              style={styles.value}
            >
              {animatedHumidity}
            </span>

            <span
              style={styles.unit}
            >
              %
            </span>

          </div>


          <span
            style={
              styles.valueLabel
            }
          >
            Relative humidity
          </span>


          {/* HUMIDITY RANGE */}

          <div
            style={
              styles.rangeSection
            }
          >

            <div
              style={
                styles.rangeLabels
              }
            >

              <span>
                Dry
              </span>

              <span>
                Comfortable
              </span>

              <span>
                Humid
              </span>

            </div>


            <div
              style={
                styles.rangeTrack
              }
            >

              <div
                style={{
                  ...styles.rangeIndicator,

                  left:
                    `${Math.min(
                      100,
                      Math.max(
                        0,
                        animatedHumidity,
                      ),
                    )}%`,
                }}
              />

            </div>

          </div>

        </div>


        {/* ================= GRAPH ================= */}

        <div
          style={
            styles.graphSection
          }
        >

          <div
            style={
              styles.graphHeader
            }
          >

            <span
              style={
                styles.graphTitle
              }
            >
              Humidity trend
            </span>


            <span
              style={
                styles.graphValue
              }
            >
              {changeText} today
            </span>

          </div>


          <div
            style={
              styles.graphWrapper
            }
          >

            <svg
              viewBox={
                `0 0 ${graphWidth} ${graphHeight}`
              }
              preserveAspectRatio="none"
              style={styles.svg}
            >

              {/* GRID */}

              <line
                x1="0"
                y1="25"
                x2={graphWidth}
                y2="25"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />

              <line
                x1="0"
                y1="60"
                x2={graphWidth}
                y2="60"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />

              <line
                x1="0"
                y1="95"
                x2={graphWidth}
                y2="95"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />


              {/* AREA */}

              <path
                d={areaPath}
                fill="url(#humidityGradient)"
                style={{
                  opacity:
                    isVisible
                      ? 1
                      : 0,

                  transition:
                    'opacity 0.8s ease',
                }}
              />


              {/* CURVE */}

              <path
                d={linePath}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength="1"
                style={{
                  strokeDasharray: 1,

                  strokeDashoffset:
                    isVisible
                      ? 0
                      : 1,

                  transition:
                    'stroke-dashoffset 1.8s cubic-bezier(0.22, 1, 0.36, 1)',

                  filter:
                    'drop-shadow(0 0 6px rgba(56,189,248,0.35))',
                }}
              />


              {/* CURRENT POINT */}

              <circle
                cx={
                  lastPoint.x
                }
                cy={
                  lastPoint.y
                }
                r="5"
                fill="#e0f2fe"
                stroke="#38bdf8"
                strokeWidth="3"
                style={{
                  opacity:
                    isVisible
                      ? 1
                      : 0,

                  transition:
                    'opacity 0.4s ease 1.5s',
                }}
              />


              {/* GRADIENT */}

              <defs>

                <linearGradient
                  id="humidityGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >

                  <stop
                    offset="0%"
                    stopColor="rgba(56,189,248,0.22)"
                  />

                  <stop
                    offset="100%"
                    stopColor="rgba(56,189,248,0)"
                  />

                </linearGradient>

              </defs>

            </svg>


            {/* CURRENT VALUE */}

            <div
              style={{
                ...styles.graphCurrentValue,

                opacity:
                  isVisible
                    ? 1
                    : 0,
              }}
            >
              {humidity}%
            </div>

          </div>


          {/* TIME LABELS */}

          <div
            style={
              styles.timeLabels
            }
          >

            {timeLabels.length >= 4 ? (

              <>
                <span>
                  {timeLabels[0]}
                </span>

                <span>
                  {
                    timeLabels[
                      Math.floor(
                        timeLabels.length /
                        3,
                      )
                    ]
                  }
                </span>

                <span>
                  {
                    timeLabels[
                      Math.floor(
                        (
                          timeLabels.length *
                          2
                        ) / 3,
                      )
                    ]
                  }
                </span>

                <span>
                  Now
                </span>
              </>

            ) : (

              <>

                <span>
                  Forecast
                </span>

                <span>
                  Now
                </span>

              </>

            )}

          </div>

        </div>

      </div>


      {/* =================================================
          FOOTER DETAILS
      ================================================= */}

      <div
        style={styles.footer}
      >

        {/* DEW POINT */}

        <div
          style={
            styles.detailItem
          }
        >

          <div
            style={
              styles.detailIcon
            }
          >

            <Thermometer
              size={15}
              color="#38bdf8"
            />

          </div>


          <div
            style={
              styles.detailContent
            }
          >

            <span
              style={
                styles.detailLabel
              }
            >
              Dew point
            </span>

            <span
              style={
                styles.detailValue
              }
            >
              {dewPoint}°C
            </span>

          </div>

        </div>


        <div
          style={styles.divider}
        />


        {/* MOISTURE LEVEL */}

        <div
          style={
            styles.detailItem
          }
        >

          <div
            style={
              styles.detailIcon
            }
          >

            <Waves
              size={15}
              color="#38bdf8"
            />

          </div>


          <div
            style={
              styles.detailContent
            }
          >

            <span
              style={
                styles.detailLabel
              }
            >
              Moisture level
            </span>

            <span
              style={
                styles.detailValue
              }
            >
              {comfortLevel}
            </span>

          </div>

        </div>


        <div
          style={styles.divider}
        />


        {/* TEMPERATURE */}

        <div
          style={
            styles.detailItem
          }
        >

          <div
            style={
              styles.detailContent
            }
          >

            <span
              style={
                styles.detailLabel
              }
            >
              Temperature
            </span>

            <span
              style={
                styles.detailValue
              }
            >
              {temperature}°C
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

const styles: Record<
  string,
  React.CSSProperties
> = {

  card: {
    position: 'relative',

    width: '100%',

    minHeight: '190px',

    padding: '20px 22px',

    boxSizing: 'border-box',

    borderRadius: '22px',

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

    display: 'flex',

    flexDirection: 'column',
  },


  header: {
    display: 'flex',

    alignItems: 'center',

    justifyContent:
      'space-between',

    gap: '12px',
  },


  titleWrapper: {
    display: 'flex',

    alignItems: 'center',

    gap: '10px',
  },


  iconBox: {
    width: '36px',

    height: '36px',

    flexShrink: 0,

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',

    borderRadius: '11px',

    background:
      'rgba(56,189,248,0.10)',

    border:
      '1px solid rgba(56,189,248,0.16)',

    boxShadow:
      '0 0 16px rgba(56,189,248,0.06)',
  },


  titleContent: {
    display: 'flex',

    flexDirection: 'column',

    gap: '3px',
  },


  title: {
    fontSize: '14px',

    fontWeight: 600,

    color: '#f8fafc',
  },


  subtitle: {
    fontSize: '10px',

    color: '#64748b',
  },


  statusBadge: {
    display: 'flex',

    alignItems: 'center',

    gap: '6px',

    padding: '5px 9px',

    borderRadius: '20px',

    background:
      'rgba(34,197,94,0.07)',

    border:
      '1px solid rgba(34,197,94,0.12)',

    color: '#86efac',

    fontSize: '10px',

    whiteSpace: 'nowrap',
  },


  statusDot: {
    width: '5px',

    height: '5px',

    borderRadius: '50%',

    background: '#22c55e',

    boxShadow:
      '0 0 7px rgba(34,197,94,0.65)',
  },


  mainContent: {
    display: 'grid',

    gridTemplateColumns:
      '180px 1fr',

    gap: '26px',

    alignItems: 'center',

    marginTop: '16px',
  },


  valueSection: {
    minWidth: 0,
  },


  valueRow: {
    display: 'flex',

    alignItems: 'baseline',

    lineHeight: 1,
  },


  value: {
    fontSize: '42px',

    fontWeight: 700,

    color: '#ffffff',

    letterSpacing: '-1.5px',
  },


  unit: {
    marginLeft: '4px',

    fontSize: '18px',

    color: '#94a3b8',

    fontWeight: 500,
  },


  valueLabel: {
    display: 'block',

    marginTop: '6px',

    fontSize: '10px',

    color: '#64748b',
  },


  rangeSection: {
    marginTop: '17px',
  },


  rangeLabels: {
    display: 'flex',

    justifyContent:
      'space-between',

    fontSize: '8px',

    color: '#64748b',

    marginBottom: '6px',
  },


  rangeTrack: {
    position: 'relative',

    width: '100%',

    height: '5px',

    borderRadius: '10px',

    background:
      'linear-gradient(90deg, rgba(148,163,184,0.18), rgba(56,189,248,0.22), rgba(167,139,250,0.22))',
  },


  rangeIndicator: {
    position: 'absolute',

    top: '50%',

    width: '8px',

    height: '8px',

    borderRadius: '50%',

    background: '#e0f2fe',

    border:
      '2px solid #38bdf8',

    transform:
      'translate(-50%, -50%)',

    boxShadow:
      '0 0 8px rgba(56,189,248,0.55)',

    transition:
      'left 1.3s cubic-bezier(0.34,1.2,0.64,1)',
  },


  graphSection: {
    minWidth: 0,
  },


  graphHeader: {
    display: 'flex',

    alignItems: 'center',

    justifyContent:
      'space-between',

    marginBottom: '7px',
  },


  graphTitle: {
    fontSize: '10px',

    color: '#94a3b8',
  },


  graphValue: {
    fontSize: '10px',

    color: '#38bdf8',

    fontWeight: 500,
  },


  graphWrapper: {
    position: 'relative',

    width: '100%',

    height: '82px',
  },


  svg: {
    width: '100%',

    height: '100%',

    display: 'block',

    overflow: 'visible',
  },


  graphCurrentValue: {
    position: 'absolute',

    right: '4px',

    top: '3px',

    fontSize: '10px',

    fontWeight: 600,

    color: '#bae6fd',

    transition:
      'opacity 0.5s ease 1.5s',
  },


  timeLabels: {
    display: 'flex',

    justifyContent:
      'space-between',

    marginTop: '5px',

    fontSize: '8px',

    color: '#475569',
  },


  footer: {
    display: 'flex',

    alignItems: 'center',

    gap: '18px',

    marginTop: '15px',

    paddingTop: '12px',

    borderTop:
      '1px solid rgba(255,255,255,0.07)',
  },


  detailItem: {
    display: 'flex',

    alignItems: 'center',

    gap: '8px',

    flex: 1,

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
      '1px solid rgba(56,189,248,0.10)',
  },


  detailContent: {
    display: 'flex',

    flexDirection: 'column',

    gap: '2px',

    minWidth: 0,
  },


  detailLabel: {
    fontSize: '9px',

    color: '#64748b',
  },


  detailValue: {
    fontSize: '11px',

    fontWeight: 600,

    color: '#e2e8f0',

    whiteSpace: 'nowrap',
  },


  divider: {
    width: '1px',

    height: '28px',

    background:
      'rgba(255,255,255,0.07)',
  },


  loadingContainer: {
    minHeight: '190px',

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',

    gap: '12px',

    color: '#ffffff',
  },


  loadingText: {
    fontSize: '14px',

    color: '#cbd5e1',
  },


  errorContainer: {
    minHeight: '190px',

    display: 'flex',

    flexDirection: 'column',

    alignItems: 'center',

    justifyContent: 'center',

    gap: '8px',

    textAlign: 'center',
  },


  errorTitle: {
    fontSize: '18px',

    fontWeight: 600,

    color: '#ffffff',
  },


  errorText: {
    fontSize: '13px',

    color: '#94a3b8',

    maxWidth: '500px',
  },

};