import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Moon,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';


/* =========================================================
   TYPES
========================================================= */

interface MoonEvent {
  time: string | null;
  azimuth?: number | null;
}

interface MoonApiData {
  moonrise: MoonEvent;
  moonset: MoonEvent;

  moonPhase: number | null;

  latitude: number;
  longitude: number;
}

interface MoonApiResponse {
  success: boolean;
  data?: MoonApiData;
  error?: string;
}


/* =========================================================
   COMPONENT
========================================================= */

export const MoonCard: React.FC = () => {


  /* =======================================================
     REF
  ======================================================= */

  const cardRef =
    useRef<HTMLDivElement | null>(
      null
    );


  /* =======================================================
     MOON DATA
  ======================================================= */

  const [
    moonrise,
    setMoonrise,
  ] = useState('--');


  const [
    moonset,
    setMoonset,
  ] = useState('--');


  const [
    moonProgress,
    setMoonProgress,
  ] = useState(0);


  /* =======================================================
     CURVE ANIMATION
  ======================================================= */

  const [
    progress,
    setProgress,
  ] = useState(0);


  /* =======================================================
     BACKEND URL
  ======================================================= */

  const BACKEND_URL =
    (
      import.meta.env.VITE_BACKEND_URL ||
      'http://127.0.0.1:8000'
    ).replace(
      /\/+$/,
      ''
    );


  /* =======================================================
     FORMAT TIME
  ======================================================= */

  const formatTime = (
    dateString: string | null
  ) => {

    if (!dateString) {
      return '--';
    }


    const date =
      new Date(
        dateString
      );


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return '--';

    }


    return date.toLocaleTimeString(
      'en-US',
      {
        hour:
          'numeric',

        minute:
          '2-digit',

        hour12:
          true,
      }
    );

  };


  /* =======================================================
     CALCULATE MOON PROGRESS
  ======================================================= */

  const calculateMoonProgress = (
    moonriseTime: string | null,
    moonsetTime: string | null
  ) => {

    if (
      !moonriseTime ||
      !moonsetTime
    ) {

      return 0;

    }


    const now =
      new Date();


    const moonriseDate =
      new Date(
        moonriseTime
      );


    const moonsetDate =
      new Date(
        moonsetTime
      );


    if (
      Number.isNaN(
        moonriseDate.getTime()
      ) ||
      Number.isNaN(
        moonsetDate.getTime()
      )
    ) {

      return 0;

    }


    /*
     * Moonset can occur after midnight.
     */

    if (
      moonsetDate <=
      moonriseDate
    ) {

      moonsetDate.setDate(
        moonsetDate.getDate() +
        1
      );

    }


    /*
     * Current time before moonrise.
     */

    if (
      now <
      moonriseDate
    ) {

      return 0;

    }


    /*
     * Current time after moonset.
     */

    if (
      now >
      moonsetDate
    ) {

      return 100;

    }


    const totalDuration =

      moonsetDate.getTime() -

      moonriseDate.getTime();


    const elapsedDuration =

      now.getTime() -

      moonriseDate.getTime();


    if (
      totalDuration <= 0
    ) {

      return 0;

    }


    const percentage =

      (
        elapsedDuration /
        totalDuration
      ) *
      100;


    return Math.max(

      0,

      Math.min(
        100,
        percentage
      )

    );

  };


  /* =======================================================
     FETCH MOON DATA
  ======================================================= */

  useEffect(() => {

    let isMounted =
      true;


    const fetchMoonData =
      async (
        latitude: number,
        longitude: number
      ) => {

        try {

          const url =

            `${BACKEND_URL}/api/weather/moon/?lat=${latitude}&lon=${longitude}`;


          const response =
            await fetch(
              url
            );


          if (
            !response.ok
          ) {

            throw new Error(

              `Moon API request failed: ${response.status}`

            );

          }


          const result:
            MoonApiResponse =

            await response.json();


          if (
            !result.success ||
            !result.data
          ) {

            throw new Error(

              result.error ||

              'Moon data unavailable.'

            );

          }


          if (
            !isMounted
          ) {

            return;

          }


          const data =
            result.data;


          /* =============================================
             FORMAT TIMES
          ============================================= */

          setMoonrise(

            formatTime(
              data.moonrise?.time ||
              null
            )

          );


          setMoonset(

            formatTime(
              data.moonset?.time ||
              null
            )

          );


          /* =============================================
             CALCULATE PROGRESS
          ============================================= */

          const calculatedProgress =

            calculateMoonProgress(

              data.moonrise?.time ||
              null,

              data.moonset?.time ||
              null

            );


          setMoonProgress(
            calculatedProgress
          );


        } catch (
          error
        ) {

          console.error(

            'Moon data error:',

            error

          );


          if (
            !isMounted
          ) {

            return;

          }


          setMoonrise('--');

          setMoonset('--');

          setMoonProgress(0);

        }

      };


    /* =====================================================
       GEOLOCATION
    ===================================================== */

    if (
      !navigator.geolocation
    ) {

      /*
       * Fallback location.
       */

      void fetchMoonData(

        22.5726,

        88.3639

      );

    } else {

      navigator.geolocation.getCurrentPosition(

        (
          position
        ) => {

          void fetchMoonData(

            position.coords.latitude,

            position.coords.longitude

          );

        },


        () => {

          /*
           * Fallback to Kolkata.
           */

          void fetchMoonData(

            22.5726,

            88.3639

          );

        },


        {
          enableHighAccuracy:
            false,

          timeout:
            10000,

          maximumAge:
            300000,
        }

      );

    }


    return () => {

      isMounted =
        false;

    };


  }, [
    BACKEND_URL
  ]);


  /* =======================================================
     EXACT BEZIER CURVE
  ======================================================= */

  const getBezierPoint = (
    t: number
  ) => {

    const startX =
      8;

    const startY =
      48;

    const controlX =
      50;

    const controlY =
      8;

    const endX =
      92;

    const endY =
      48;


    const x =

      Math.pow(
        1 - t,
        2
      ) *
      startX

      +

      2 *
      (1 - t) *
      t *
      controlX

      +

      Math.pow(
        t,
        2
      ) *
      endX;


    const y =

      Math.pow(
        1 - t,
        2
      ) *
      startY

      +

      2 *
      (1 - t) *
      t *
      controlY

      +

      Math.pow(
        t,
        2
      ) *
      endY;


    return {
      x,
      y,
    };

  };


  /* =======================================================
     VIEWPORT ANIMATION
  ======================================================= */

  useEffect(() => {

    let timer:
      | ReturnType<
        typeof setTimeout
      >
      | undefined;


    const observer =
      new IntersectionObserver(

        (
          [entry]
        ) => {

          if (
            entry.isIntersecting
          ) {

            setProgress(0);


            timer =
              setTimeout(
                () => {

                  setProgress(
                    moonProgress
                  );

                },
                120
              );

          } else {

            setProgress(0);


            if (
              timer
            ) {

              clearTimeout(
                timer
              );

            }

          }

        },

        {
          threshold:
            0.3,
        }

      );


    if (
      cardRef.current
    ) {

      observer.observe(
        cardRef.current
      );

    }


    return () => {

      if (
        timer
      ) {

        clearTimeout(
          timer
        );

      }


      observer.disconnect();

    };


  }, [
    moonProgress
  ]);


  /* =======================================================
     MOON POSITION
  ======================================================= */

  const t =

    Math.max(

      0,

      Math.min(
        100,
        progress
      )

    ) /
    100;


  const point =
    getBezierPoint(
      t
    );


  const moonLeft =

    `calc(3% + ${(point.x / 100) * 94}%)`;


  const moonTop =

    `${5 + (point.y / 55) * 70}px`;


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <div
      ref={cardRef}
      style={styles.card}
    >


      {/* =================================================
          HEADER
      ================================================= */}

      <div
        style={styles.header}
      >

        <div
          style={styles.titleWrapper}
        >

          <div
            style={styles.iconBox}
          >

            <Moon
              size={18}
              color="#c4b5fd"
              strokeWidth={2}
            />

          </div>


          <div
            style={styles.titleContent}
          >

            <span
              style={styles.title}
            >
              Moon
            </span>


            <span
              style={styles.subtitle}
            >
              Lunar path
            </span>

          </div>

        </div>

      </div>


      {/* =================================================
          CURVED PATH
      ================================================= */}

      <div
        style={styles.pathSection}
      >

        <svg
          viewBox="0 0 100 55"
          preserveAspectRatio="none"
          style={styles.svgPath}
        >

          <path
            d="M 8 48 Q 50 8 92 48"
            fill="none"
            stroke="rgba(196,181,253,0.10)"
            strokeWidth="1.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />


          <path
            d="M 8 48 Q 50 8 92 48"
            fill="none"
            stroke="rgba(196,181,253,0.48)"
            strokeWidth="1.6"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            pathLength="100"
            strokeDasharray="100"
            strokeDashoffset={`${100 - progress}`}
            style={{

              transition:

                'stroke-dashoffset 1.5s cubic-bezier(0.34, 1.2, 0.64, 1)',

              filter:

                'drop-shadow(0 0 4px rgba(196,181,253,0.20))',

            }}
          />

        </svg>


        {/* MOON */}

        <div
          style={{

            ...styles.moonPosition,

            left:
              moonLeft,

            top:
              moonTop,

          }}
        >

          <div
            style={styles.moonGlow}
          />


          <div
            style={styles.moonShape}
          >

            <Moon
              size={30}
              color="#f5f3ff"
              strokeWidth={1.5}
              style={styles.moonIcon}
            />


            <div
              style={styles.moonDarkSide}
            />

          </div>

        </div>


        {/* DOTS */}

        <div
          style={styles.startDot}
        />


        <div
          style={styles.endDot}
        />

      </div>


      {/* =================================================
          MOONRISE / MOONSET
      ================================================= */}

      <div
        style={styles.timeRow}
      >

        <div
          style={styles.timeItem}
        >

          <div
            style={styles.timeIcon}
          >

            <ArrowUp
              size={16}
              color="#c4b5fd"
              strokeWidth={2}
            />

          </div>


          <div
            style={styles.timeContent}
          >

            <span
              style={styles.label}
            >
              Moonrise
            </span>


            <span
              style={styles.time}
            >
              {moonrise}
            </span>

          </div>

        </div>


        <div
          style={styles.timeItemRight}
        >

          <div
            style={styles.timeContentRight}
          >

            <span
              style={styles.label}
            >
              Moonset
            </span>


            <span
              style={styles.time}
            >
              {moonset}
            </span>

          </div>


          <div
            style={styles.timeIcon}
          >

            <ArrowDown
              size={16}
              color="#a78bfa"
              strokeWidth={2}
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


  card: {

    position:
      'relative',

    width:
      '100%',

    minHeight:
      '210px',

    padding:
      '20px 22px',

    boxSizing:
      'border-box',

    borderRadius:
      '24px',

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

    overflow:
      'hidden',

    display:
      'flex',

    flexDirection:
      'column',

  },


  header: {

    display:
      'flex',

    alignItems:
      'center',

    justifyContent:
      'space-between',

    gap:
      '10px',

  },


  titleWrapper: {

    display:
      'flex',

    alignItems:
      'center',

    gap:
      '10px',

  },


  iconBox: {

    width:
      '36px',

    height:
      '36px',

    flexShrink:
      0,

    display:
      'flex',

    alignItems:
      'center',

    justifyContent:
      'center',

    borderRadius:
      '11px',

    background:
      'rgba(167,139,250,0.09)',

    border:
      '1px solid rgba(167,139,250,0.14)',

    boxShadow:
      '0 0 16px rgba(167,139,250,0.07)',

  },


  titleContent: {

    display:
      'flex',

    flexDirection:
      'column',

    gap:
      '3px',

  },


  title: {

    fontSize:
      '14px',

    fontWeight:
      600,

    color:
      '#f8fafc',

    letterSpacing:
      '-0.15px',

  },


  subtitle: {

    fontSize:
      '10px',

    color:
      '#64748b',

  },


  pathSection: {

    position:
      'relative',

    width:
      '100%',

    height:
      '92px',

    marginTop:
      '7px',

    overflow:
      'visible',

  },


  svgPath: {

    position:
      'absolute',

    left:
      '3%',

    top:
      '5px',

    width:
      '94%',

    height:
      '70px',

    overflow:
      'visible',

    pointerEvents:
      'none',

  },


  moonPosition: {

    position:
      'absolute',

    width:
      '38px',

    height:
      '38px',

    transform:
      'translate(-50%, -50%)',

    display:
      'flex',

    alignItems:
      'center',

    justifyContent:
      'center',

    zIndex:
      5,

    pointerEvents:
      'none',

    transition:

      'left 1.5s cubic-bezier(0.34, 1.2, 0.64, 1), top 1.5s cubic-bezier(0.34, 1.2, 0.64, 1)',

  },


  moonGlow: {

    position:
      'absolute',

    width:
      '52px',

    height:
      '52px',

    borderRadius:
      '50%',

    background:

      'radial-gradient(circle, rgba(196,181,253,0.42) 0%, rgba(139,92,246,0) 70%)',

    filter:
      'blur(7px)',

    pointerEvents:
      'none',

  },


  moonShape: {

    position:
      'relative',

    width:
      '34px',

    height:
      '34px',

    borderRadius:
      '50%',

    display:
      'flex',

    alignItems:
      'center',

    justifyContent:
      'center',

    background:

      'radial-gradient(circle at 35% 30%, #f8f7ff 0%, #ddd6fe 50%, #a78bfa 100%)',

    boxShadow:
      '0 0 18px rgba(196,181,253,0.35)',

    overflow:
      'hidden',

  },


  moonDarkSide: {

    position:
      'absolute',

    top:
      '-4%',

    right:
      '-20%',

    width:
      '58%',

    height:
      '108%',

    borderRadius:
      '50%',

    background:
      'rgba(49,46,129,0.88)',

    zIndex:
      2,

    pointerEvents:
      'none',

  },


  moonIcon: {

    position:
      'relative',

    zIndex:
      1,

    opacity:
      0.96,

    filter:

      'drop-shadow(0 0 5px rgba(255,255,255,0.35))',

  },


  startDot: {

    position:
      'absolute',

    left:
      '10.52%',

    top:
      '65.9px',

    width:
      '5px',

    height:
      '5px',

    transform:
      'translate(-50%, -50%)',

    borderRadius:
      '50%',

    background:
      'rgba(196,181,253,0.48)',

    boxShadow:
      '0 0 7px rgba(196,181,253,0.22)',

  },


  endDot: {

    position:
      'absolute',

    left:
      '89.48%',

    top:
      '65.9px',

    width:
      '5px',

    height:
      '5px',

    transform:
      'translate(-50%, -50%)',

    borderRadius:
      '50%',

    background:
      'rgba(196,181,253,0.48)',

    boxShadow:
      '0 0 7px rgba(196,181,253,0.22)',

  },


  timeRow: {

    display:
      'flex',

    justifyContent:
      'space-between',

    alignItems:
      'center',

    marginTop:
      '4px',

    paddingTop:
      '13px',

    borderTop:
      '1px solid rgba(255,255,255,0.07)',

  },


  timeItem: {

    display:
      'flex',

    alignItems:
      'center',

    gap:
      '8px',

    minWidth:
      0,

  },


  timeItemRight: {

    display:
      'flex',

    alignItems:
      'center',

    justifyContent:
      'flex-end',

    gap:
      '8px',

    minWidth:
      0,

  },


  timeIcon: {

    width:
      '30px',

    height:
      '30px',

    flexShrink:
      0,

    display:
      'flex',

    alignItems:
      'center',

    justifyContent:
      'center',

    borderRadius:
      '9px',

    background:
      'rgba(167,139,250,0.07)',

    border:
      '1px solid rgba(167,139,250,0.10)',

  },


  timeContent: {

    display:
      'flex',

    flexDirection:
      'column',

    gap:
      '2px',

  },


  timeContentRight: {

    display:
      'flex',

    flexDirection:
      'column',

    alignItems:
      'flex-end',

    gap:
      '2px',

  },


  label: {

    fontSize:
      '10px',

    color:
      '#64748b',

    fontWeight:
      400,

  },


  time: {

    fontSize:
      '13px',

    color:
      '#e2e8f0',

    fontWeight:
      600,

  },

};