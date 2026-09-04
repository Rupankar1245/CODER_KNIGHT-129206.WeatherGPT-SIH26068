
import React, { useEffect, useRef, useState } from 'react';
import { Sunrise, Sunset, Sun } from 'lucide-react';

interface SunData {
  sunrise: number | null;
  sunset: number | null;
  timezone: number;
  timestamp: number;
}

interface CurrentWeatherResponse {
  success: boolean;

  data?: {
    sun?: SunData;

    location?: {
      name: string;
      country: string;
    };
  };

  error?: string;
}

export const SunCard: React.FC = () => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL ||
    'http://127.0.0.1:8000';

  const [sunriseTimestamp, setSunriseTimestamp] =
    useState<number | null>(null);

  const [sunsetTimestamp, setSunsetTimestamp] =
    useState<number | null>(null);

  const [daylight, setDaylight] =
    useState('--');

  const [daylightProgress, setDaylightProgress] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [sunPosition, setSunPosition] = useState({
    x: 15,
    y: 105,
  });


  /* =========================================================
     FORMAT TIME
  ========================================================= */

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000)
      .toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      });
  };


  /* =========================================================
     FORMAT DAYLIGHT
  ========================================================= */

  const formatDaylight = (
    sunrise: number,
    sunset: number
  ) => {
    const durationSeconds =
      sunset - sunrise;

    if (durationSeconds <= 0) {
      return '--';
    }

    const totalMinutes =
      Math.floor(durationSeconds / 60);

    const hours =
      Math.floor(totalMinutes / 60);

    const minutes =
      totalMinutes % 60;

    return `${hours}h ${String(minutes).padStart(2, '0')}m`;
  };


  /* =========================================================
     FETCH CURRENT WEATHER
  ========================================================= */

  useEffect(() => {

    if (!navigator.geolocation) {
      setError(
        'Location services are not supported by this browser.'
      );

      setLoading(false);

      return;
    }

    navigator.geolocation.getCurrentPosition(

      async (position) => {

        try {

          const latitude =
            position.coords.latitude;

          const longitude =
            position.coords.longitude;

          const url =
            `${BACKEND_URL}/api/weather/current/` +
            `?lat=${latitude}` +
            `&lon=${longitude}`;

          const response =
            await fetch(url);

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

          const result:
            CurrentWeatherResponse =
            await response.json();

          if (!result.success) {

            throw new Error(
              result.error ||
              'Unable to load sun data.'
            );
          }

          const sun =
            result.data?.sun;

          if (
            !sun ||
            sun.sunrise === null ||
            sun.sunset === null ||
            sun.sunrise === undefined ||
            sun.sunset === undefined
          ) {

            throw new Error(
              'Sunrise and sunset data are unavailable.'
            );
          }

          const sunrise =
            Number(sun.sunrise);

          const sunset =
            Number(sun.sunset);

          if (
            !Number.isFinite(sunrise) ||
            !Number.isFinite(sunset) ||
            sunset <= sunrise
          ) {

            throw new Error(
              'Invalid sunrise or sunset data received.'
            );
          }

          /* ---------------------------------------------
             SAVE SUN DATA
          --------------------------------------------- */

          setSunriseTimestamp(
            sunrise
          );

          setSunsetTimestamp(
            sunset
          );

          /* ---------------------------------------------
             DAYLIGHT DURATION
          --------------------------------------------- */

          setDaylight(
            formatDaylight(
              sunrise,
              sunset
            )
          );

          /* ---------------------------------------------
             CURRENT DAYLIGHT PROGRESS
          --------------------------------------------- */

          const now =
            Date.now() / 1000;

          const progress =
            ((now - sunrise) /
              (sunset - sunrise)) *
            100;

          setDaylightProgress(
            Math.min(
              Math.max(progress, 0),
              100
            )
          );

        } catch (err) {

          console.error(
            'MeghAI sun error:',
            err
          );

          if (err instanceof Error) {

            setError(
              err.message ||
              'Unable to load sun data.'
            );

          } else {

            setError(
              'Unable to load sun data.'
            );
          }

        } finally {

          setLoading(false);
        }
      },

      (geoError) => {

        console.error(
          'MeghAI location error:',
          geoError
        );

        setLoading(false);

        switch (geoError.code) {

          case geoError.PERMISSION_DENIED:

            setError(
              'Location permission was denied.'
            );

            break;

          case geoError.POSITION_UNAVAILABLE:

            setError(
              'Unable to determine your location.'
            );

            break;

          case geoError.TIMEOUT:

            setError(
              'Location request timed out.'
            );

            break;

          default:

            setError(
              'Unable to access your location.'
            );
        }
      },

      {
        enableHighAccuracy: true,

        timeout: 10000,

        maximumAge: 300000,
      }
    );

  }, [BACKEND_URL]);


  /* =========================================================
     VIEWPORT OBSERVER + SUN PATH ANIMATION
  ========================================================= */

  useEffect(() => {

    /*
     * Do not start the animation before
     * backend data has arrived.
     */

    if (
      loading ||
      error ||
      sunriseTimestamp === null ||
      sunsetTimestamp === null
    ) {
      return;
    }

    const observer =
      new IntersectionObserver(

        ([entry]) => {

          if (!entry.isIntersecting) {
            return;
          }

          const path =
            pathRef.current;

          if (!path) {
            return;
          }

          /*
           * Get the complete length of
           * the actual SVG curve.
           */

          const totalLength =
            path.getTotalLength();


          /*
           * -----------------------------------------------------
           * RESET SUN TO SUNRISE
           * -----------------------------------------------------
           */

          const startPoint =
            path.getPointAtLength(0);

          setSunPosition({
            x: startPoint.x,
            y: startPoint.y,
          });


          /*
           * -----------------------------------------------------
           * TARGET POSITION
           * -----------------------------------------------------
           *
           * Current daylight progress is based on
           * actual sunrise/sunset timestamps.
           */

          const targetLength =
            (daylightProgress / 100) *
            totalLength;


          /*
           * -----------------------------------------------------
           * ANIMATION
           * -----------------------------------------------------
           */

          const duration = 1600;

          const startTime =
            performance.now();

          let animationFrame: number;


          const animateSun = (
            currentTime: number
          ) => {

            const elapsed =
              currentTime - startTime;


            /*
             * Normalized animation progress
             * 0 → 1
             */

            const rawProgress =
              Math.min(
                elapsed / duration,
                1
              );


            /*
             * Smooth ease-out.
             */

            const easedProgress =
              1 -
              Math.pow(
                1 - rawProgress,
                3
              );


            /*
             * ---------------------------------------------------
             * MOVE ALONG ACTUAL SVG PATH
             * ---------------------------------------------------
             */

            const currentLength =
              targetLength *
              easedProgress;


            const point =
              path.getPointAtLength(
                currentLength
              );


            /*
             * Update exact curve coordinates.
             */

            setSunPosition({
              x: point.x,
              y: point.y,
            });


            /*
             * Continue animation.
             */

            if (rawProgress < 1) {

              animationFrame =
                requestAnimationFrame(
                  animateSun
                );
            }
          };


          /*
           * Small delay after entering viewport.
           */

          const timer =
            window.setTimeout(() => {

              animationFrame =
                requestAnimationFrame(
                  animateSun
                );

            }, 100);


          /*
           * Cleanup.
           */

          return () => {

            clearTimeout(timer);

            cancelAnimationFrame(
              animationFrame
            );
          };
        },

        {
          threshold: 0.3,
        }
      );


    /*
     * Start observing card.
     */

    if (cardRef.current) {

      observer.observe(
        cardRef.current
      );
    }


    /*
     * Cleanup.
     */

    return () => {

      observer.disconnect();
    };

  }, [
    loading,
    error,
    sunriseTimestamp,
    sunsetTimestamp,
    daylightProgress,
  ]);


  /* =========================================================
     LOADING STATE
  ========================================================= */

  if (loading) {

    return (
      <div
        ref={cardRef}
        style={styles.card}
      >

        <div style={styles.header}>

          <div style={styles.titleWrapper}>

            <div style={styles.iconBox}>

              <Sun
                size={18}
                strokeWidth={2}
                color="#fbbf24"
              />

            </div>

            <span style={styles.title}>
              Sun
            </span>

          </div>

        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#94a3b8',
            fontSize: '11px',
          }}
        >
          Loading sun data...
        </div>

      </div>
    );
  }


  /* =========================================================
     ERROR STATE
  ========================================================= */

  if (error) {

    return (
      <div
        ref={cardRef}
        style={styles.card}
      >

        <div style={styles.header}>

          <div style={styles.titleWrapper}>

            <div style={styles.iconBox}>

              <Sun
                size={18}
                strokeWidth={2}
                color="#fbbf24"
              />

            </div>

            <span style={styles.title}>
              Sun
            </span>

          </div>

        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '6px',
            textAlign: 'center',
          }}
        >

          <span
            style={{
              color: '#f8fafc',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            Unable to load sun data
          </span>

          <span
            style={{
              color: '#94a3b8',
              fontSize: '9px',
            }}
          >
            {error}
          </span>

        </div>

      </div>
    );
  }


  const sunrise =
    sunriseTimestamp !== null
      ? formatTime(sunriseTimestamp)
      : '--';

  const sunset =
    sunsetTimestamp !== null
      ? formatTime(sunsetTimestamp)
      : '--';


  return (
    <div
      ref={cardRef}
      style={styles.card}
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div style={styles.header}>

        <div style={styles.titleWrapper}>

          <div style={styles.iconBox}>

            <Sun
              size={18}
              strokeWidth={2}
              color="#fbbf24"
            />

          </div>

          <span style={styles.title}>
            Sun
          </span>

        </div>


        <span style={styles.daylightBadge}>
          {daylight}
        </span>

      </div>


      {/* =================================================
          CURVED SUN PATH
      ================================================= */}

      <div style={styles.sunPathWrapper}>

        <svg
          viewBox="0 0 500 120"
          preserveAspectRatio="none"
          style={styles.svg}
        >

          <defs>

            {/* =========================================
                PATH GRADIENT
            ========================================= */}

            <linearGradient
              id="sunPathGradient"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >

              <stop
                offset="0%"
                stopColor="#fbbf24"
                stopOpacity="0.12"
              />

              <stop
                offset="45%"
                stopColor="#fbbf24"
                stopOpacity="0.55"
              />

              <stop
                offset="70%"
                stopColor="#fbbf24"
                stopOpacity="0.45"
              />

              <stop
                offset="100%"
                stopColor="#fb923c"
                stopOpacity="0.10"
              />

            </linearGradient>


            {/* =========================================
                SUN GLOW
            ========================================= */}

            <radialGradient
              id="sunGlowGradient"
            >

              <stop
                offset="0%"
                stopColor="#fbbf24"
                stopOpacity="0.25"
              />

              <stop
                offset="70%"
                stopColor="#fbbf24"
                stopOpacity="0.05"
              />

              <stop
                offset="100%"
                stopColor="#fbbf24"
                stopOpacity="0"
              />

            </radialGradient>

          </defs>


          {/* =================================================
              SOFT GLOW BEHIND CURVE
          ================================================= */}

          <path
            d="
              M 15 105
              C 105 15,
                395 15,
                485 105
            "
            fill="none"
            stroke="rgba(251,191,36,0.07)"
            strokeWidth="9"
            strokeLinecap="round"
          />


          {/* =================================================
              MAIN CURVED PATH
          ================================================= */}

          <path
            ref={pathRef}
            d="
              M 15 105
              C 105 15,
                395 15,
                485 105
            "
            fill="none"
            stroke="url(#sunPathGradient)"
            strokeWidth="2"
            strokeLinecap="round"
          />


          {/* =================================================
              SUNRISE POINT
          ================================================= */}

          <circle
            cx="15"
            cy="105"
            r="3"
            fill="#fbbf24"
            fillOpacity="0.45"
          />


          {/* =================================================
              SUNSET POINT
          ================================================= */}

          <circle
            cx="485"
            cy="105"
            r="3"
            fill="#fb923c"
            fillOpacity="0.40"
          />

        </svg>


        {/* =================================================
            MOVING SUN
        ================================================= */}

        <div
          style={{
            ...styles.sunPosition,

            left:
              `${(sunPosition.x / 500) * 100}%`,

            top:
              `${(sunPosition.y / 120) * 100}%`,
          }}
        >

          {/* ---------------------------------------------
              Glow
          --------------------------------------------- */}

          <div style={styles.sunGlow}>

            <Sun
              size={22}
              strokeWidth={2}
              color="#fbbf24"
              fill="rgba(251,191,36,0.28)"
            />

          </div>

        </div>

      </div>


      {/* =================================================
          SUNRISE / SUNSET
      ================================================= */}

      <div style={styles.timeRow}>

        {/* =================================================
            SUNRISE
        ================================================= */}

        <div style={styles.timeItem}>

          <div style={styles.timeIcon}>

            <Sunrise
              size={19}
              color="#fbbf24"
            />

          </div>


          <div style={styles.timeContent}>

            <span style={styles.label}>
              Sunrise
            </span>

            <span style={styles.time}>
              {sunrise}
            </span>

          </div>

        </div>


        {/* =================================================
            SUNSET
        ================================================= */}

        <div
          style={{
            ...styles.timeItem,
            justifyContent: 'flex-end',
          }}
        >

          <div style={styles.timeContentRight}>

            <span style={styles.label}>
              Sunset
            </span>

            <span style={styles.time}>
              {sunset}
            </span>

          </div>


          <div style={styles.timeIcon}>

            <Sunset
              size={19}
              color="#fb923c"
            />

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

  /* =====================================================
     CARD
  ===================================================== */

  card: {

    position: 'relative',

    width: '100%',

    minHeight: '210px',

    padding: '20px 22px',

    boxSizing: 'border-box',

    borderRadius: '24px',

    background:
      'linear-gradient(145deg, rgba(255,255,255,0.10), rgba(255,255,255,0.025))',

    backdropFilter:
      'blur(20px)',

    WebkitBackdropFilter:
      'blur(20px)',

    border:
      '1px solid rgba(255,255,255,0.12)',

    boxShadow:
      '0 10px 32px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.06)',

    overflow: 'hidden',

    display: 'flex',

    flexDirection: 'column',

    justifyContent: 'space-between',
  },


  /* =====================================================
     HEADER
  ===================================================== */

  header: {

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'space-between',

    gap: '10px',
  },


  titleWrapper: {

    display: 'flex',

    alignItems: 'center',

    gap: '9px',
  },


  iconBox: {

    width: '34px',

    height: '34px',

    borderRadius: '11px',

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',

    background:
      'rgba(251,191,36,0.10)',

    border:
      '1px solid rgba(251,191,36,0.16)',

    boxShadow:
      '0 0 16px rgba(251,191,36,0.06)',
  },


  title: {

    fontSize: '16px',

    fontWeight: 600,

    color: '#ffffff',

    letterSpacing: '-0.2px',
  },


  daylightBadge: {

    fontSize: '11px',

    fontWeight: 500,

    color: '#fde68a',

    background:
      'rgba(251,191,36,0.08)',

    border:
      '1px solid rgba(251,191,36,0.14)',

    padding: '5px 9px',

    borderRadius: '10px',
  },


  /* =====================================================
     SUN PATH WRAPPER
  ===================================================== */

  sunPathWrapper: {

    position: 'relative',

    width: '100%',

    height: '82px',

    marginTop: '5px',

    overflow: 'visible',
  },


  /* =====================================================
     SVG
  ===================================================== */

  svg: {

    position: 'absolute',

    left: 0,

    top: 0,

    width: '100%',

    height: '100%',

    overflow: 'visible',
  },


  /* =====================================================
     MOVING SUN
  ===================================================== */

  sunPosition: {

    position: 'absolute',

    width: '30px',

    height: '30px',

    transform:
      'translate(-50%, -50%)',

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',

    borderRadius: '50%',

    pointerEvents: 'none',

    zIndex: 5,
  },


  /* =====================================================
     SUN GLOW
  ===================================================== */

  sunGlow: {

    width: '30px',

    height: '30px',

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',

    borderRadius: '50%',

    background:
      'radial-gradient(circle, rgba(251,191,36,0.20), rgba(251,191,36,0.025) 70%)',

    boxShadow:
      '0 0 18px rgba(251,191,36,0.28), 0 0 35px rgba(251,191,36,0.10)',
  },


  /* =====================================================
     TIME ROW
  ===================================================== */

  timeRow: {

    display: 'flex',

    justifyContent: 'space-between',

    alignItems: 'center',

    paddingTop: '12px',

    borderTop:
      '1px solid rgba(255,255,255,0.08)',
  },


  /* =====================================================
     TIME ITEM
  ===================================================== */

  timeItem: {

    display: 'flex',

    alignItems: 'center',

    gap: '9px',
  },


  /* =====================================================
     TIME ICON
  ===================================================== */

  timeIcon: {

    width: '32px',

    height: '32px',

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',

    borderRadius: '10px',

    background:
      'rgba(255,255,255,0.045)',

    border:
      '1px solid rgba(255,255,255,0.05)',
  },


  /* =====================================================
     TIME CONTENT
  ===================================================== */

  timeContent: {

    display: 'flex',

    flexDirection: 'column',

    gap: '2px',
  },


  timeContentRight: {

    display: 'flex',

    flexDirection: 'column',

    alignItems: 'flex-end',

    gap: '2px',
  },


  /* =====================================================
     LABEL
  ===================================================== */

  label: {

    fontSize: '11px',

    color: '#94a3b8',

    fontWeight: 400,
  },


  /* =====================================================
     TIME
  ===================================================== */

  time: {

    fontSize: '14px',

    color: '#ffffff',

    fontWeight: 600,
  },
};
