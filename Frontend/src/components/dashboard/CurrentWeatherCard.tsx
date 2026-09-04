import React, { useEffect, useState } from 'react';
import {
  Droplets,
  Wind,
  Eye,
  Gauge,
} from 'lucide-react';


/* =========================================================
   TYPES
========================================================= */

interface WeatherData {
  name: string;
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
}


interface BackendWeatherResponse {
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


/* =========================================================
   COMPONENT
========================================================= */

export const CurrentWeatherCard: React.FC = () => {

  const [weather, setWeather] =
    useState<WeatherData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  /* =====================================================
     FETCH WEATHER
  ===================================================== */

  useEffect(() => {

    const fetchWeather = async (
      latitude: number,
      longitude: number
    ) => {

      try {

        const API_BASE_URL =
          import.meta.env.VITE_API_BASE_URL ||
          'http://127.0.0.1:8000';


        const response = await fetch(
          `${API_BASE_URL}/api/weather/current/?lat=${latitude}&lon=${longitude}`
        );


        if (!response.ok) {

          throw new Error(
            `Weather API error: ${response.status}`
          );

        }


        const result: BackendWeatherResponse =
          await response.json();


        if (
          !result.success ||
          !result.data
        ) {

          throw new Error(
            result.error ||
            'Unable to fetch weather data.'
          );

        }


        const data =
          result.data;


        setWeather({

          name:
            data.location.name,

          temperature:
            Math.round(
              data.weather.temperature
            ),

          feelsLike:
            Math.round(
              data.weather.feels_like
            ),

          tempMin:
            Math.round(
              data.weather.temperature_min
            ),

          tempMax:
            Math.round(
              data.weather.temperature_max
            ),

          condition:
            data.weather.condition ||
            'Unknown',

          humidity:
            data.weather.humidity,

          windSpeed:
            Math.round(
              data.wind.speed * 3.6
            ),

          visibility:
            Math.round(
              (data.visibility ?? 0) / 1000
            ),

          pressure:
            data.weather.pressure,

        });

      } catch (err) {

        console.error(
          'Failed to fetch weather:',
          err
        );


        setError(

          err instanceof Error
            ? err.message
            : 'Unable to fetch current weather'

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

        fetchWeather(

          position.coords.latitude,
          position.coords.longitude

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

        enableHighAccuracy:
          true,

        timeout:
          10000,

        maximumAge:
          300000,

      }

    );

  }, []);


  /* =====================================================
     LOADING SKELETON
  ===================================================== */

  if (loading) {

    return (

      <>

        <style>
          {`

            /* =============================================
               SKELETON ANIMATION
            ============================================= */

            @keyframes meghaiSkeletonShimmer {

              0% {
                background-position: -500px 0;
              }

              100% {
                background-position: 500px 0;
              }

            }


            .meghai-skeleton {

              background:
                linear-gradient(
                  90deg,
                  rgba(148, 163, 184, 0.10) 0%,
                  rgba(255, 255, 255, 0.18) 50%,
                  rgba(148, 163, 184, 0.10) 100%
                );

              background-size:
                1000px 100%;

              animation:
                meghaiSkeletonShimmer
                1.5s
                linear
                infinite;

            }


            /* =============================================
               MOBILE RESPONSIVE
            ============================================= */

            @media (max-width: 767px) {

              .current-weather-skeleton-row {

                gap:
                  18px !important;

              }


              .current-weather-skeleton-metrics {

                display:
                  grid !important;

                grid-template-columns:
                  repeat(2, minmax(0, 1fr));

                gap:
                  16px !important;

              }


              .current-weather-skeleton-divider {

                display:
                  none !important;

              }

            }


            @media (max-width: 479px) {

              .current-weather-skeleton-row {

                gap:
                  14px !important;

              }

            }

          `}
        </style>


        <div
          className="current-weather-card"
          style={styles.card}
        >


          {/* =============================================
              TOP SKELETON
          ============================================= */}

          <div
            style={styles.skeletonTopSection}
          >

            <div
              className="meghai-skeleton"
              style={{
                ...styles.skeletonBlock,
                width: '130px',
                height: '22px',
              }}
            />


            <div
              className="current-weather-skeleton-row"
              style={styles.skeletonWeatherRow}
            >

              <div
                className="meghai-skeleton current-weather-skeleton-temp"
                style={{
                  ...styles.skeletonBlock,
                  width: '140px',
                  height: '64px',
                  borderRadius: '14px',
                }}
              />


              <div
                style={styles.skeletonConditionBox}
              >

                <div
                  className="meghai-skeleton"
                  style={{
                    ...styles.skeletonBlock,
                    width: '110px',
                    height: '20px',
                  }}
                />


                <div
                  className="meghai-skeleton"
                  style={{
                    ...styles.skeletonBlock,
                    width: '140px',
                    height: '14px',
                  }}
                />


                <div
                  className="meghai-skeleton"
                  style={{
                    ...styles.skeletonBlock,
                    width: '180px',
                    height: '13px',
                  }}
                />

              </div>

            </div>

          </div>


          {/* =============================================
              METRICS SKELETON
          ============================================= */}

          <div
            className="current-weather-skeleton-metrics"
            style={styles.metricsGrid}
          >

            {[1, 2, 3, 4].map(
              (item, index) => (

                <React.Fragment
                  key={item}
                >

                  <div
                    style={styles.metricItem}
                  >

                    <div
                      className="meghai-skeleton"
                      style={{
                        ...styles.skeletonBlock,
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        flexShrink: 0,
                      }}
                    />


                    <div
                      style={styles.metricContent}
                    >

                      <div
                        className="meghai-skeleton"
                        style={{
                          ...styles.skeletonBlock,
                          width: '60px',
                          height: '12px',
                        }}
                      />


                      <div
                        className="meghai-skeleton"
                        style={{
                          ...styles.skeletonBlock,
                          width: '75px',
                          height: '15px',
                          marginTop: '5px',
                        }}
                      />

                    </div>

                  </div>


                  {index < 3 && (

                    <div
                      className="current-weather-skeleton-divider"
                      style={styles.divider}
                    />

                  )}

                </React.Fragment>

              )
            )}

          </div>

        </div>

      </>

    );

  }


  /* =====================================================
     ERROR STATE
  ===================================================== */

  if (error || !weather) {

    return (

      <div
        className="current-weather-card"
        style={styles.card}
      >

        <div
          style={styles.errorContainer}
        >

          <span
            style={styles.errorTitle}
          >
            Weather unavailable
          </span>


          <span
            style={styles.errorText}
          >
            {error ||
              'Unable to load weather data.'}
          </span>

        </div>

      </div>

    );

  }


  /* =====================================================
     MAIN WEATHER CARD
  ===================================================== */

  return (

    <>

      {/* =================================================
          RESPONSIVE CSS
      ================================================= */}

      <style>
        {`

          /* =============================================
             CURRENT WEATHER CARD
             DESKTOP BASE
          ============================================= */

          .current-weather-card {
            width: 100%;
            min-width: 0;
            box-sizing: border-box;
          }


          /* =============================================
             TABLET
          ============================================= */

          @media (max-width: 1023px) {

            .current-weather-card {

              padding:
                24px 26px !important;

            }

          }


          /* =============================================
             MOBILE
             BELOW 768px
          ============================================= */

          @media (max-width: 767px) {


            /* ===========================================
               CARD
            =========================================== */

            .current-weather-card {

              min-height:
                auto !important;

              padding:
                22px 20px !important;

              border-radius:
                20px !important;

            }


            /* ===========================================
               CLOUD BACKGROUND
            =========================================== */

            .current-weather-card .current-weather-cloud {

              width:
                100% !important;

              opacity:
                0.85;

            }


            /* ===========================================
               LOCATION
            =========================================== */

            .current-weather-card .current-weather-location {

              font-size:
                20px !important;

              line-height:
                1.3;

              max-width:
                100%;

              overflow:
                hidden;

              text-overflow:
                ellipsis;

              white-space:
                nowrap;

            }


            /* ===========================================
               TEMPERATURE ROW
            =========================================== */

            .current-weather-card
            .current-weather-details {

              gap:
                18px !important;

              margin-top:
                8px !important;

            }


            .current-weather-card
            .current-weather-temp {

              font-size:
                58px !important;

              flex-shrink:
                0;

            }


            /* ===========================================
               CONDITION
            =========================================== */

            .current-weather-card
            .current-weather-condition {

              font-size:
                19px !important;

            }


            .current-weather-card
            .current-weather-feels {

              font-size:
                13px !important;

            }


            .current-weather-card
            .current-weather-range {

              font-size:
                12px !important;

              line-height:
                1.5;

            }


            /* ===========================================
               METRICS
               2 x 2 GRID
            =========================================== */

            .current-weather-card
            .current-weather-metrics {

              display:
                grid !important;

              grid-template-columns:
                repeat(2, minmax(0, 1fr));

              align-items:
                stretch !important;

              justify-content:
                initial !important;

              gap:
                16px 12px !important;

              margin-top:
                22px !important;

              padding-top:
                18px !important;

            }


            .current-weather-card
            .current-weather-metric {

              justify-content:
                flex-start !important;

              gap:
                10px !important;

              min-width:
                0;

              padding:
                2px 0;

            }


            /* Hide desktop dividers */

            .current-weather-card
            .current-weather-divider {

              display:
                none !important;

            }


            .current-weather-card
            .current-weather-metric-label {

              font-size:
                11px !important;

            }


            .current-weather-card
            .current-weather-metric-value {

              font-size:
                14px !important;

            }

          }


          /* =============================================
             SMALL MOBILE
             BELOW 480px
          ============================================= */

          @media (max-width: 479px) {


            /* ===========================================
               CARD
            =========================================== */

            .current-weather-card {

              padding:
                20px 16px !important;

              border-radius:
                18px !important;

            }


            /* ===========================================
               LOCATION
            =========================================== */

            .current-weather-card
            .current-weather-location {

              font-size:
                18px !important;

            }


            /* ===========================================
               WEATHER ROW
            =========================================== */

            .current-weather-card
            .current-weather-details {

              gap:
                14px !important;

            }


            .current-weather-card
            .current-weather-temp {

              font-size:
                52px !important;

              letter-spacing:
                -1px !important;

            }


            .current-weather-card
            .current-weather-condition {

              font-size:
                17px !important;

            }


            .current-weather-card
            .current-weather-feels {

              font-size:
                12px !important;

            }


            .current-weather-card
            .current-weather-range {

              font-size:
                11px !important;

            }


            /* ===========================================
               METRICS
            =========================================== */

            .current-weather-card
            .current-weather-metrics {

              gap:
                14px 10px !important;

              margin-top:
                20px !important;

              padding-top:
                16px !important;

            }


            .current-weather-card
            .current-weather-metric {

              gap:
                8px !important;

            }


            .current-weather-card
            .current-weather-metric-label {

              font-size:
                10px !important;

            }


            .current-weather-card
            .current-weather-metric-value {

              font-size:
                13px !important;

            }

          }


          /* =============================================
             VERY SMALL MOBILE
             BELOW 360px
          ============================================= */

          @media (max-width: 359px) {


            .current-weather-card {

              padding:
                18px 14px !important;

            }


            /* Keep temperature readable */

            .current-weather-card
            .current-weather-details {

              gap:
                10px !important;

            }


            .current-weather-card
            .current-weather-temp {

              font-size:
                46px !important;

            }


            .current-weather-card
            .current-weather-condition {

              font-size:
                16px !important;

            }


            .current-weather-card
            .current-weather-range {

              line-height:
                1.6;

            }


            .current-weather-card
            .current-weather-metrics {

              gap:
                12px 8px !important;

            }

          }

        `}
      </style>


      <div
        className="current-weather-card"
        style={styles.card}
      >


        {/* =============================================
            CLOUD BACKDROP
        ============================================= */}

        <div
          className="current-weather-cloud"
          style={styles.cloudBackdrop}
        >

          <div
            style={styles.skyGlow}
          />

          <div
            style={styles.cloudAnimationWrapper}
            className="cloud-layer-1"
          >

            <div
              style={styles.cloudImage}
            />

          </div>

        </div>


        {/* =============================================
            TOP SECTION
        ============================================= */}

        <div
          style={styles.topSection}
        >

          <h3
            className="current-weather-location"
            style={styles.location}
          >
            {weather.name}
          </h3>


          <div
            className="current-weather-details"
            style={styles.weatherDetailsRow}
          >

            <span
              className="current-weather-temp"
              style={styles.temp}
            >
              {weather.temperature}°C
            </span>


            <div
              style={styles.conditionBox}
            >

              <span
                className="current-weather-condition"
                style={styles.condition}
              >
                {weather.condition}
              </span>


              <span
                className="current-weather-feels"
                style={styles.feelsLike}
              >
                Feels like {weather.feelsLike}°C
              </span>


              <span
                className="current-weather-range"
                style={styles.range}
              >
                High: {weather.tempMax}°C

                {' | '}

                Low: {weather.tempMin}°C
              </span>

            </div>

          </div>

        </div>


        {/* =============================================
            WEATHER METRICS
        ============================================= */}

        <div
          className="current-weather-metrics"
          style={styles.metricsGrid}
        >


          {/* HUMIDITY */}

          <div
            className="current-weather-metric"
            style={styles.metricItem}
          >

            <Droplets
              size={20}
              color="#38bdf8"
            />


            <div
              style={styles.metricContent}
            >

              <span
                className="current-weather-metric-label"
                style={styles.metricLabel}
              >
                Humidity
              </span>


              <span
                className="current-weather-metric-value"
                style={styles.metricValue}
              >
                {weather.humidity}%
              </span>

            </div>

          </div>


          <div
            className="current-weather-divider"
            style={styles.divider}
          />


          {/* WIND */}

          <div
            className="current-weather-metric"
            style={styles.metricItem}
          >

            <Wind
              size={20}
              color="#38bdf8"
            />


            <div
              style={styles.metricContent}
            >

              <span
                className="current-weather-metric-label"
                style={styles.metricLabel}
              >
                Wind
              </span>


              <span
                className="current-weather-metric-value"
                style={styles.metricValue}
              >
                {weather.windSpeed} km/h
              </span>

            </div>

          </div>


          <div
            className="current-weather-divider"
            style={styles.divider}
          />


          {/* VISIBILITY */}

          <div
            className="current-weather-metric"
            style={styles.metricItem}
          >

            <Eye
              size={20}
              color="#38bdf8"
            />


            <div
              style={styles.metricContent}
            >

              <span
                className="current-weather-metric-label"
                style={styles.metricLabel}
              >
                Visibility
              </span>


              <span
                className="current-weather-metric-value"
                style={styles.metricValue}
              >
                {weather.visibility} km
              </span>

            </div>

          </div>


          <div
            className="current-weather-divider"
            style={styles.divider}
          />


          {/* PRESSURE */}

          <div
            className="current-weather-metric"
            style={styles.metricItem}
          >

            <Gauge
              size={20}
              color="#38bdf8"
            />


            <div
              style={styles.metricContent}
            >

              <span
                className="current-weather-metric-label"
                style={styles.metricLabel}
              >
                Pressure
              </span>


              <span
                className="current-weather-metric-value"
                style={styles.metricValue}
              >
                {weather.pressure} hPa
              </span>

            </div>

          </div>

        </div>

      </div>

    </>

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

    position:
      'relative',

    overflow:
      'hidden',


    background:
      'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',


    backdropFilter:
      'blur(25px)',

    WebkitBackdropFilter:
      'blur(25px)',


    borderRadius:
      '24px',

    padding:
      '26px 30px',


    border:
      '1px solid rgba(255, 255, 255, 0.25)',


    boxShadow:
      '0 12px 40px rgba(0, 0, 0, 0.25)',


    minHeight:
      '190px',

    boxSizing:
      'border-box',

  },


  /* =====================================================
     SKELETON
  ===================================================== */

  skeletonBlock: {

    borderRadius:
      '8px',

    flexShrink:
      0,

  },


  skeletonTopSection: {

    display:
      'flex',

    flexDirection:
      'column',

    gap:
      '12px',

  },


  skeletonWeatherRow: {

    display:
      'flex',

    alignItems:
      'center',

    gap:
      '24px',

    marginTop:
      '2px',

  },


  skeletonConditionBox: {

    display:
      'flex',

    flexDirection:
      'column',

    gap:
      '8px',

  },


  /* =====================================================
     CLOUD BACKDROP
  ===================================================== */

  cloudBackdrop: {

    position:
      'absolute',

    top:
      0,

    right:
      0,


    width:
      '70%',

    height:
      '100%',


    pointerEvents:
      'none',

    zIndex:
      0,


    overflow:
      'hidden',


    maskImage:
      'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',


    WebkitMaskImage:
      'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',

  },


  skyGlow: {

    position:
      'absolute',

    top:
      '-20%',

    right:
      '-10%',


    width:
      '100%',

    height:
      '140%',


    background:
      'radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, rgba(15, 23, 42, 0) 70%)',


    filter:
      'blur(20px)',

  },


  cloudAnimationWrapper: {

    width:
      '140%',

    height:
      '140%',


    position:
      'absolute',

    top:
      '-20%',

    right:
      '-20%',

  },


  cloudImage: {

    width:
      '100%',

    height:
      '100%',


    backgroundImage:
      'url("https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=800&q=80")',


    backgroundSize:
      'cover',

    backgroundPosition:
      'center',


    opacity:
      0.38,

    mixBlendMode:
      'screen',

  },


  /* =====================================================
     MAIN CONTENT
  ===================================================== */

  topSection: {

    position:
      'relative',

    zIndex:
      1,


    display:
      'flex',

    flexDirection:
      'column',


    gap:
      '6px',

  },


  location: {

    fontSize:
      '22px',

    color:
      '#ffffff',


    fontWeight:
      600,

    letterSpacing:
      '-0.3px',


    textShadow:
      '0 2px 10px rgba(0, 0, 0, 0.3)',


    margin:
      0,

  },


  weatherDetailsRow: {

    display:
      'flex',

    alignItems:
      'center',


    gap:
      '24px',


    marginTop:
      '6px',

  },


  temp: {

    fontSize:
      '68px',


    fontWeight:
      700,


    color:
      '#ffffff',


    lineHeight:
      1,


    letterSpacing:
      '-1.5px',


    textShadow:
      '0 4px 20px rgba(0, 0, 0, 0.3)',

  },


  conditionBox: {

    display:
      'flex',

    flexDirection:
      'column',


    gap:
      '3px',

  },


  condition: {

    fontSize:
      '22px',

    fontWeight:
      600,


    color:
      '#ffffff',


    letterSpacing:
      '-0.2px',

  },


  feelsLike: {

    fontSize:
      '14px',

    color:
      '#e2e8f0',


    fontWeight:
      400,

  },


  range: {

    fontSize:
      '13px',

    color:
      '#cbd5e1',


    fontWeight:
      400,

  },


  /* =====================================================
     METRICS
  ===================================================== */

  metricsGrid: {

    position:
      'relative',

    zIndex:
      1,


    display:
      'flex',

    alignItems:
      'center',

    justifyContent:
      'space-between',


    marginTop:
      '28px',

    paddingTop:
      '20px',


    borderTop:
      '1px solid rgba(255, 255, 255, 0.18)',

  },


  metricItem: {

    display:
      'flex',

    alignItems:
      'center',


    gap:
      '12px',


    flex:
      1,


    justifyContent:
      'center',

  },


  metricContent: {

    display:
      'flex',

    flexDirection:
      'column',

  },


  metricLabel: {

    fontSize:
      '12px',

    color:
      '#94a3b8',


    fontWeight:
      400,

  },


  metricValue: {

    fontSize:
      '15px',

    fontWeight:
      600,


    color:
      '#ffffff',


    marginTop:
      '2px',

  },


  divider: {

    width:
      '1px',

    height:
      '32px',


    backgroundColor:
      'rgba(255, 255, 255, 0.18)',


    flexShrink:
      0,

  },


  /* =====================================================
     ERROR
  ===================================================== */

  errorContainer: {

    minHeight:
      '190px',


    display:
      'flex',

    flexDirection:
      'column',


    alignItems:
      'center',

    justifyContent:
      'center',


    gap:
      '8px',


    textAlign:
      'center',

  },


  errorTitle: {

    fontSize:
      '18px',

    fontWeight:
      600,


    color:
      '#ffffff',

  },


  errorText: {

    fontSize:
      '13px',

    color:
      '#94a3b8',

  },

};
