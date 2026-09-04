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
  (
    import.meta.env.VITE_BACKEND_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    'http://127.0.0.1:8000'
  ).replace(/\/$/, '');

/* =========================================================
   COMPONENT
========================================================= */

export const AirQualityCard: React.FC = () => {

  /* =======================================================
     STATE
  ======================================================= */

  const [
    airQuality,
    setAirQuality,
  ] = useState<AirQualityData | null>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );

  const [
    animatedOffset,
    setAnimatedOffset,
  ] = useState(
    Math.PI * 65
  );


  /* =======================================================
     CARD REFERENCE
  ======================================================= */

  const cardRef =
    useRef<HTMLDivElement | null>(
      null
    );


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

  const normalizedAQI =
    airQuality
      ? Math.min(
          Math.max(
            airQuality.aqi,
            1
          ),
          5
        )
      : 1;


  const aqiPercentage =
    airQuality
      ? normalizedAQI / 5
      : 0;


  const targetOffset =
    circumference -
    aqiPercentage *
      circumference;


  /* =======================================================
     AQI DETAILS
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
     FETCH AIR QUALITY
  ======================================================= */

  useEffect(() => {

    let isMounted = true;

    let refreshInterval:
      ReturnType<
        typeof setInterval
      > | null = null;


    const fetchAirQuality =
      async (
        latitude: number,
        longitude: number,
        showLoading = false
      ) => {

        try {

          if (showLoading) {

            setLoading(
              true
            );

          }


          setError(
            null
          );


          const url =
            `${BACKEND_URL}/api/weather/air-quality/` +
            `?lat=${encodeURIComponent(
              latitude
            )}` +
            `&lon=${encodeURIComponent(
              longitude
            )}`;


          const response =
            await fetch(
              url,
              {
                method:
                  'GET',

                headers: {
                  Accept:
                    'application/json',
                },

                cache:
                  'no-store',
              }
            );


          if (
            !response.ok
          ) {

            throw new Error(
              `Backend API error: ${response.status}`
            );

          }


          const result:
            AirQualityResponse =
              await response.json();


          if (
            !result.success ||
            !result.data
          ) {

            throw new Error(
              result.error ||
              'Air quality data unavailable.'
            );

          }


          if (
            isMounted
          ) {

            setAirQuality(
              result.data
            );

            setError(
              null
            );

          }

        }

        catch (
          err
        ) {

          console.error(
            'Air Quality Backend Error:',
            err
          );


          if (
            isMounted
          ) {

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

            setLoading(
              false
            );

          }

        }

      };


    /* =====================================================
       GEOLOCATION
    ====================================================== */

    if (
      !navigator.geolocation
    ) {

      setError(
        'Geolocation is not supported by your browser.'
      );

      setLoading(
        false
      );

      return;

    }


    navigator.geolocation.getCurrentPosition(

      (
        position
      ) => {

        if (
          !isMounted
        ) {

          return;

        }


        const {
          latitude,
          longitude,
        } =
          position.coords;


        /* ===============================================
           INITIAL FETCH
        ================================================ */

        void fetchAirQuality(
          latitude,
          longitude,
          true
        );


        /* ===============================================
           REFRESH EVERY 10 MINUTES
        ================================================ */

        refreshInterval =
          setInterval(
            () => {

              void fetchAirQuality(
                latitude,
                longitude,
                false
              );

            },
            10 * 60 * 1000
          );

      },

      (
        geoError
      ) => {

        console.error(
          'Geolocation error:',
          geoError.message
        );


        if (
          isMounted
        ) {

          setError(
            'Location permission is required.'
          );

          setLoading(
            false
          );

        }

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


    return () => {

      isMounted =
        false;


      if (
        refreshInterval
      ) {

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


    if (
      !currentCard ||
      !airQuality
    ) {

      return;

    }


    let animationTimeout:
      ReturnType<
        typeof setTimeout
      > | null = null;


    const observer =
      new IntersectionObserver(

        (
          [entry]
        ) => {

          if (
            entry.isIntersecting
          ) {

            setAnimatedOffset(
              circumference
            );


            animationTimeout =
              setTimeout(
                () => {

                  setAnimatedOffset(
                    targetOffset
                  );

                },
                100
              );

          }

          else {

            setAnimatedOffset(
              circumference
            );

          }

        },

        {
          threshold:
            0.3,
        }

      );


    observer.observe(
      currentCard
    );


    return () => {

      observer.disconnect();


      if (
        animationTimeout
      ) {

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
      'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 100%)',

    backdropFilter:
      'blur(20px)',

    WebkitBackdropFilter:
      'blur(20px)',

    border:
      '1px solid rgba(255, 255, 255, 0.18)',

    boxShadow:
      '0 8px 32px 0 rgba(0, 0, 0, 0.2)',

  };


  /* =======================================================
     LOADING SKELETON
  ======================================================= */

  if (
    loading
  ) {

    return (

      <div
        ref={cardRef}
        style={{
          ...styles.card,
          ...glassEffect,
        }}
        className="aqi-card-skeleton"
      >

        {/* ===============================================
            SKELETON HEADER
        ================================================ */}

        <div
          style={
            styles.header
          }
        >

          <div
            className="aqi-skeleton aqi-skeleton-title"
          />


          <div
            className="aqi-skeleton aqi-skeleton-live"
          />

        </div>


        {/* ===============================================
            SKELETON GAUGE
        ================================================ */}

        <div
          style={
            styles.skeletonGaugeWrapper
          }
        >

          <div
            className="aqi-skeleton-gauge"
          >

            <div
              className="aqi-skeleton aqi-skeleton-number"
            />


            <div
              className="aqi-skeleton aqi-skeleton-status"
            />

          </div>

        </div>


        {/* ===============================================
            SKELETON MAIN POLLUTANTS
        ================================================ */}

        <div
          style={
            styles.skeletonBottomRow
          }
        >

          <div
            className="aqi-skeleton aqi-skeleton-pollutant-main"
          />


          <div
            className="aqi-skeleton aqi-skeleton-pollutant-main"
          />

        </div>


        {/* ===============================================
            SKELETON ADDITIONAL POLLUTANTS
        ================================================ */}

        <div
          style={
            styles.skeletonPollutantRow
          }
        >

          <div
            className="aqi-skeleton aqi-skeleton-pollutant-small"
          />


          <div
            className="aqi-skeleton aqi-skeleton-pollutant-small"
          />


          <div
            className="aqi-skeleton aqi-skeleton-pollutant-small"
          />


          <div
            className="aqi-skeleton aqi-skeleton-pollutant-small"
          />

        </div>


        {/* ===============================================
            SKELETON CSS
        ================================================ */}

        <style>

          {`

            @keyframes aqiSkeletonShimmer {

              0% {

                background-position:
                  -200% 0;

              }


              100% {

                background-position:
                  200% 0;

              }

            }


            .aqi-skeleton {

              position:
                relative;

              overflow:
                hidden;

              background:
                linear-gradient(
                  90deg,
                  rgba(255, 255, 255, 0.07) 25%,
                  rgba(255, 255, 255, 0.18) 50%,
                  rgba(255, 255, 255, 0.07) 75%
                );

              background-size:
                200% 100%;

              animation:
                aqiSkeletonShimmer
                1.5s
                ease-in-out
                infinite;

            }


            .aqi-skeleton-title {

              width:
                132px;

              height:
                17px;

              border-radius:
                6px;

            }


            .aqi-skeleton-live {

              width:
                48px;

              height:
                22px;

              border-radius:
                12px;

            }


            .aqi-skeleton-gauge {

              width:
                132px;

              height:
                72px;

              border:
                12px solid
                rgba(255, 255, 255, 0.07);

              border-bottom:
                none;

              border-radius:
                132px 132px 0 0;

              position:
                relative;

              display:
                flex;

              flex-direction:
                column;

              align-items:
                center;

              justify-content:
                center;

              box-sizing:
                border-box;

              overflow:
                hidden;

            }


            .aqi-skeleton-gauge::before {

              content:
                '';

              position:
                absolute;

              inset:
                -12px;

              border-radius:
                132px 132px 0 0;

              background:
                linear-gradient(
                  90deg,
                  transparent 20%,
                  rgba(255, 255, 255, 0.12) 50%,
                  transparent 80%
                );

              background-size:
                200% 100%;

              animation:
                aqiSkeletonShimmer
                1.8s
                ease-in-out
                infinite;

              pointer-events:
                none;

            }


            .aqi-skeleton-number {

              width:
                30px;

              height:
                26px;

              border-radius:
                6px;

              margin-top:
                22px;

              z-index:
                1;

            }


            .aqi-skeleton-status {

              width:
                48px;

              height:
                11px;

              border-radius:
                5px;

              margin-top:
                7px;

              z-index:
                1;

            }


            .aqi-skeleton-pollutant-main {

              width:
                100px;

              max-width:
                42%;

              height:
                13px;

              border-radius:
                5px;

            }


            .aqi-skeleton-pollutant-small {

              width:
                44px;

              height:
                10px;

              border-radius:
                4px;

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

        <div
          style={
            styles.header
          }
        >

          <span
            style={
              styles.cardTitle
            }
          >
            Air Quality Index
          </span>

        </div>


        <div
          style={
            styles.errorContainer
          }
        >

          <span
            style={
              styles.errorIcon
            }
          >
            ⚠️
          </span>


          <span
            style={
              styles.errorTitle
            }
          >
            Air quality unavailable
          </span>


          <span
            style={
              styles.errorText
            }
          >
            {
              error ||
              'Unable to load air quality data.'
            }
          </span>

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
        ...glassEffect,
      }}
    >

      {/* =================================================
          ANIMATIONS
      ================================================= */}

      <style>

        {`

          @keyframes aqiLivePulse {

            0% {

              opacity:
                0.45;

              transform:
                scale(0.9);

            }


            50% {

              opacity:
                1;

              transform:
                scale(1);

            }


            100% {

              opacity:
                0.45;

              transform:
                scale(0.9);

            }

          }

        `}

      </style>


      {/* =================================================
          HEADER
      ================================================= */}

      <div
        style={
          styles.header
        }
      >

        <span
          style={
            styles.cardTitle
          }
        >
          Air Quality Index
        </span>


        <div
          style={
            styles.liveBadge
          }
        >

          <span
            style={
              styles.liveDot
            }
          />

          LIVE

        </div>

      </div>


      {/* =================================================
          GAUGE
      ================================================= */}

      <div
        style={
          styles.gaugeWrapper
        }
      >

        <svg
          width="180"
          height="110"
          viewBox="0 0 160 100"
          style={
            styles.svg
          }
        >

          <defs>

            <linearGradient
              id="aqiArcGradient"
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


            <filter
              id="aqiGlow"
              x="-30%"
              y="-30%"
              width="160%"
              height="160%"
            >

              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="4"
                floodColor={
                  currentColor
                }
                floodOpacity="0.35"
              />

            </filter>

          </defs>


          {/* =============================================
              BACKGROUND ARC
          ============================================== */}

          <path
            d="
              M 15 85
              A 65 65 0 0 1 145 85
            "
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={
              strokeWidth
            }
            strokeLinecap="round"
          />


          {/* =============================================
              ACTIVE ARC
          ============================================== */}

          <path
            d="
              M 15 85
              A 65 65 0 0 1 145 85
            "
            fill="none"
            stroke="url(#aqiArcGradient)"
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
            filter="url(#aqiGlow)"
            style={{
              transition:
                'stroke-dashoffset 1.3s cubic-bezier(0.34, 1.28, 0.64, 1)',
            }}
          />

        </svg>


        {/* =============================================
            CENTER VALUE
        ============================================== */}

        <div
          style={
            styles.gaugeCenterText
          }
        >

          <span
            style={
              styles.aqiNumber
            }
          >
            {airQuality.aqi}
          </span>


          <span
            style={{
              ...styles.aqiStatus,
              color:
                currentColor,
            }}
          >
            {status}
          </span>

        </div>

      </div>


      {/* =================================================
          MAIN POLLUTANTS
      ================================================= */}

      <div
        style={
          styles.bottomRow
        }
      >

        <span>

          PM2.5:{' '}

          <strong>
            {airQuality.pm25.toFixed(1)}
          </strong>{' '}

          µg/m³

        </span>


        <span>

          PM10:{' '}

          <strong>
            {airQuality.pm10.toFixed(1)}
          </strong>{' '}

          µg/m³

        </span>

      </div>


      {/* =================================================
          ADDITIONAL POLLUTANTS
      ================================================= */}

      <div
        style={
          styles.pollutantRow
        }
      >

        <span>

          CO{' '}

          <strong>
            {airQuality.co.toFixed(0)}
          </strong>

        </span>


        <span>

          NO₂{' '}

          <strong>
            {airQuality.no2.toFixed(1)}
          </strong>

        </span>


        <span>

          O₃{' '}

          <strong>
            {airQuality.o3.toFixed(1)}
          </strong>

        </span>


        <span>

          SO₂{' '}

          <strong>
            {airQuality.so2.toFixed(1)}
          </strong>

        </span>

      </div>

    </div>

  );

};


/* =========================================================
   STYLES
========================================================= */

const styles:
  Record<
    string,
    React.CSSProperties
  > = {


  /* =======================================================
     CARD
  ======================================================= */

  card: {

    position:
      'relative',

    borderRadius:
      '24px',

    padding:
      '20px 24px',

    display:
      'flex',

    flexDirection:
      'column',

    justifyContent:
      'space-between',

    minHeight:
      '230px',

    overflow:
      'hidden',

    boxSizing:
      'border-box',

  },


  /* =======================================================
     HEADER
  ======================================================= */

  header: {

    display:
      'flex',

    justifyContent:
      'space-between',

    alignItems:
      'center',

    flexShrink:
      0,

  },


  cardTitle: {

    fontSize:
      '16px',

    fontWeight:
      600,

    color:
      '#ffffff',

    letterSpacing:
      '-0.2px',

  },


  /* =======================================================
     LIVE BADGE
  ======================================================= */

  liveBadge: {

    display:
      'flex',

    alignItems:
      'center',

    gap:
      '6px',

    fontSize:
      '10px',

    fontWeight:
      600,

    color:
      '#4ade80',

    backgroundColor:
      'rgba(74, 222, 128, 0.10)',

    padding:
      '4px 9px',

    borderRadius:
      '12px',

    border:
      '1px solid rgba(74, 222, 128, 0.2)',

  },


  liveDot: {

    width:
      '6px',

    height:
      '6px',

    borderRadius:
      '50%',

    backgroundColor:
      '#4ade80',

    boxShadow:
      '0 0 8px rgba(74, 222, 128, 0.8)',

    animation:
      'aqiLivePulse 1.8s ease-in-out infinite',

  },


  /* =======================================================
     GAUGE
  ======================================================= */

  gaugeWrapper: {

    position:
      'relative',

    display:
      'flex',

    justifyContent:
      'center',

    alignItems:
      'center',

    margin:
      '10px 0',

  },


  skeletonGaugeWrapper: {

    flex:
      1,

    minHeight:
      '118px',

    display:
      'flex',

    alignItems:
      'center',

    justifyContent:
      'center',

    margin:
      '8px 0',

  },


  svg: {

    display:
      'block',

    overflow:
      'visible',

  },


  gaugeCenterText: {

    position:
      'absolute',

    top:
      '55%',

    left:
      '50%',

    transform:
      'translate(-50%, -50%)',

    display:
      'flex',

    flexDirection:
      'column',

    alignItems:
      'center',

  },


  aqiNumber: {

    fontSize:
      '32px',

    fontWeight:
      700,

    color:
      '#ffffff',

    lineHeight:
      '1',

  },


  aqiStatus: {

    fontSize:
      '13px',

    fontWeight:
      600,

    marginTop:
      '4px',

    whiteSpace:
      'nowrap',

  },


  /* =======================================================
     MAIN POLLUTANTS
  ======================================================= */

  bottomRow: {

    display:
      'flex',

    justifyContent:
      'space-between',

    fontSize:
      '12px',

    color:
      '#cbd5e1',

    borderTop:
      '1px solid rgba(255,255,255,0.1)',

    paddingTop:
      '10px',

    gap:
      '12px',

  },


  skeletonBottomRow: {

    display:
      'flex',

    justifyContent:
      'space-between',

    alignItems:
      'center',

    borderTop:
      '1px solid rgba(255,255,255,0.1)',

    paddingTop:
      '12px',

    gap:
      '12px',

  },


  /* =======================================================
     ADDITIONAL POLLUTANTS
  ======================================================= */

  pollutantRow: {

    display:
      'flex',

    justifyContent:
      'space-between',

    marginTop:
      '8px',

    fontSize:
      '10px',

    color:
      '#94a3b8',

    gap:
      '6px',

  },


  skeletonPollutantRow: {

    display:
      'flex',

    justifyContent:
      'space-between',

    alignItems:
      'center',

    marginTop:
      '10px',

    gap:
      '8px',

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
      '6px',

    textAlign:
      'center',

  },


  errorIcon: {

    fontSize:
      '28px',

  },


  errorTitle: {

    fontSize:
      '14px',

    fontWeight:
      600,

    color:
      '#ffffff',

  },


  errorText: {

    fontSize:
      '11px',

    color:
      '#94a3b8',

    maxWidth:
      '240px',

    lineHeight:
      '1.5',

  },

};