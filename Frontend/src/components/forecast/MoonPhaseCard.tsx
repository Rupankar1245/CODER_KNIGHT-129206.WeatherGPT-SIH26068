import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Moon,
  Sparkles,
} from 'lucide-react';


/* =========================================================
   TYPES
========================================================= */

interface MoonApiData {

  moonrise: {
    time: string | null;
    azimuth: number | null;
  };

  moonset: {
    time: string | null;
    azimuth: number | null;
  };

  highMoon: {
    time: string | null;
    elevation: number | null;
    visible: boolean | null;
  };

  lowMoon: {
    time: string | null;
    elevation: number | null;
    visible: boolean | null;
  };

  moonPhase: number;

  latitude: number | null;

  longitude: number | null;

  body: string | null;

  interval: string[] | null;

}


interface MoonApiResponse {

  success: boolean;

  data?: MoonApiData;

  error?: string;

}


/* =========================================================
   COMPONENT
========================================================= */

export const MoonPhaseCard: React.FC = () => {


  /* =======================================================
     REF
  ======================================================= */

  const cardRef =
    useRef<HTMLDivElement | null>(
      null
    );


  /* =======================================================
     STATE
  ======================================================= */

  const [
    moonData,
    setMoonData,
  ] = useState<
    MoonApiData | null
  >(
    null
  );


  const [
    loading,
    setLoading,
  ] = useState(
    true
  );


  const [
    error,
    setError,
  ] = useState<
    string | null
  >(
    null
  );


  const [
    animatedProgress,
    setAnimatedProgress,
  ] = useState(
    0
  );


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

          if (
            isMounted
          ) {

            setLoading(
              true
            );

            setError(
              null
            );

          }


          /* ===============================================
             CORRECT URL
          =============================================== */

          const url =

            `${BACKEND_URL}/api/weather/moon/?lat=${latitude}&lon=${longitude}`;


          console.log(
            'Fetching moon data:',
            url
          );


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


          setMoonData(
            result.data
          );


        } catch (
          err
        ) {

          console.error(

            'Moon data error:',

            err

          );


          if (
            isMounted
          ) {

            setError(

              err instanceof Error

                ? err.message

                : 'Unable to load moon data.'

            );

          }


        } finally {

          if (
            isMounted
          ) {

            setLoading(
              false
            );

          }

        }

      };


    /* =====================================================
       GEOLOCATION
    ===================================================== */

    if (
      !navigator.geolocation
    ) {

      setError(
        'Geolocation is not supported by this browser.'
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

        const latitude =
          position.coords.latitude;


        const longitude =
          position.coords.longitude;


        void fetchMoonData(

          latitude,

          longitude

        );

      },


      (
        locationError
      ) => {

        console.error(

          'Geolocation error:',

          locationError

        );


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


    return () => {

      isMounted =
        false;

    };


  }, [
    BACKEND_URL
  ]);


  /* =======================================================
     MOON PHASE CALCULATION
  ======================================================= */

  const getMoonPhaseInfo = (
    phaseAngle: number
  ) => {


    let normalized =
      phaseAngle %
      360;


    if (
      normalized < 0
    ) {

      normalized +=
        360;

    }


    let phaseName:
      string;


    if (
      normalized < 22.5 ||
      normalized >= 337.5
    ) {

      phaseName =
        'New Moon';

    } else if (
      normalized < 67.5
    ) {

      phaseName =
        'Waxing Crescent';

    } else if (
      normalized < 112.5
    ) {

      phaseName =
        'First Quarter';

    } else if (
      normalized < 157.5
    ) {

      phaseName =
        'Waxing Gibbous';

    } else if (
      normalized < 202.5
    ) {

      phaseName =
        'Full Moon';

    } else if (
      normalized < 247.5
    ) {

      phaseName =
        'Waning Gibbous';

    } else if (
      normalized < 292.5
    ) {

      phaseName =
        'Last Quarter';

    } else {

      phaseName =
        'Waning Crescent';

    }


    const radians =

      (
        normalized *
        Math.PI
      ) /
      180;


    const illumination =

      (
        (
          1 -
          Math.cos(
            radians
          )
        ) /
        2
      ) *
      100;


    return {

      phaseName,

      illumination:
        Math.round(
          illumination
        ),

      normalized,

    };

  };


  /* =======================================================
     NEXT MOON PHASE
  ======================================================= */

  const getNextPhaseInfo = (
    phaseAngle: number
  ) => {


    let normalized =
      phaseAngle %
      360;


    if (
      normalized < 0
    ) {

      normalized +=
        360;

    }


    const daysPerDegree =
      29.53 /
      360;


    const phases = [

      {
        angle:
          0,

        name:
          'New Moon',
      },

      {
        angle:
          90,

        name:
          'First Quarter',
      },

      {
        angle:
          180,

        name:
          'Full Moon',
      },

      {
        angle:
          270,

        name:
          'Last Quarter',
      },

    ];


    let nextPhase =
      phases.find(

        (
          phase
        ) =>

          phase.angle >
          normalized +
          0.5

      );


    if (
      !nextPhase
    ) {

      nextPhase = {

        angle:
          360,

        name:
          'New Moon',

      };

    }


    const degreesRemaining =

      nextPhase.angle -

      normalized;


    const daysRemaining =

      degreesRemaining *

      daysPerDegree;


    return {

      name:
        nextPhase.name,

      days:

        Math.max(

          1,

          Math.round(
            daysRemaining
          )

        ),

    };

  };


  /* =======================================================
     DERIVED DATA
  ======================================================= */

  const phaseInfo =

    moonData

      ? getMoonPhaseInfo(

          moonData.moonPhase

        )

      : {

          phaseName:
            'Moon',

          illumination:
            0,

          normalized:
            0,

        };


  const nextPhaseInfo =

    moonData

      ? getNextPhaseInfo(

          moonData.moonPhase

        )

      : {

          name:
            'Moon Phase',

          days:
            0,

        };


  const illumination =
    phaseInfo.illumination;


  const phaseName =
    phaseInfo.phaseName;


  const nextPhase =
    nextPhaseInfo.name;


  const daysToNextPhase =
    nextPhaseInfo.days;


  /* =======================================================
     ANIMATION
  ======================================================= */

  useEffect(() => {

    if (
      !moonData ||
      loading
    ) {

      return;

    }


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

            setAnimatedProgress(
              0
            );


            timer =
              setTimeout(
                () => {

                  setAnimatedProgress(
                    illumination
                  );

                },
                100
              );

          } else {

            setAnimatedProgress(
              0
            );

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

    moonData,

    loading,

    illumination,

  ]);


  /* =======================================================
     MOON SHADOW POSITION
  ======================================================= */

  const shadowPosition =

    50 -

    (
      animatedProgress /
      100
    ) *
    50;


  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (
    loading
  ) {

    return (

      <div
        ref={cardRef}
        style={styles.card}
      >

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


            <span
              style={styles.title}
            >
              Moon Phase
            </span>

          </div>


          <Sparkles
            size={16}
            color="#a78bfa"
          />

        </div>


        <div
          style={styles.loadingState}
        >
          Loading moon data...
        </div>

      </div>

    );

  }


  /* =======================================================
     ERROR STATE
  ======================================================= */

  if (
    error ||
    !moonData
  ) {

    return (

      <div
        ref={cardRef}
        style={styles.card}
      >

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


            <span
              style={styles.title}
            >
              Moon Phase
            </span>

          </div>


          <Sparkles
            size={16}
            color="#a78bfa"
          />

        </div>


        <div
          style={styles.errorState}
        >
          Unable to load moon data.
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


      {/* HEADER */}

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


          <span
            style={styles.title}
          >
            Moon Phase
          </span>

        </div>


        <Sparkles
          size={16}
          color="#a78bfa"
        />

      </div>


      {/* MOON VISUAL */}

      <div
        style={styles.phaseVisual}
      >

        <div
          style={{

            ...styles.moonGlow,

            opacity:

              0.15 +

              (
                animatedProgress /
                100
              ) *
              0.30,

          }}
        />


        <div
          style={styles.moon}
        >

          <div
            style={styles.moonSurface}
          >

            <div
              style={{

                ...styles.crater,

                ...styles.crater1,

              }}
            />


            <div
              style={{

                ...styles.crater,

                ...styles.crater2,

              }}
            />


            <div
              style={{

                ...styles.crater,

                ...styles.crater3,

              }}
            />


            <div
              style={{

                ...styles.crater,

                ...styles.crater4,

              }}
            />

          </div>


          <div
            style={{

              ...styles.shadowPhase,

              left:
                `${shadowPosition}%`,

              transform:
                'translateX(-50%)',

              opacity:

                animatedProgress >= 99

                  ? 0

                  : 0.94,

            }}
          />

        </div>

      </div>


      {/* CURRENT PHASE */}

      <div
        style={styles.phaseInfo}
      >

        <span
          style={styles.phaseName}
        >
          {phaseName}
        </span>


        <span
          style={styles.illumination}
        >
          {Math.round(
            animatedProgress
          )}
          % illuminated
        </span>

      </div>


      {/* PROGRESS */}

      <div
        style={styles.progressSection}
      >

        <div
          style={styles.progressLabels}
        >

          <span>
            New Moon
          </span>


          <span>
            Full Moon
          </span>

        </div>


        <div
          style={styles.progressTrack}
        >

          <div
            style={{

              ...styles.progressFill,

              width:
                `${animatedProgress}%`,

            }}
          />


          <div
            style={{

              ...styles.progressMarker,

              left:

                `calc(${animatedProgress}% - 3px)`,

            }}
          />

        </div>

      </div>


      {/* NEXT PHASE */}

      <div
        style={styles.nextPhase}
      >

        <span
          style={styles.nextLabel}
        >
          Next phase
        </span>


        <span
          style={styles.nextValue}
        >
          {nextPhase}
          {' · '}
          {daysToNextPhase}
          {' days'}
        </span>

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

      'linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.025))',

    backdropFilter:
      'blur(20px)',

    WebkitBackdropFilter:
      'blur(20px)',

    border:
      '1px solid rgba(255,255,255,0.14)',

    boxShadow:

      '0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.05)',

    overflow:
      'hidden',

    display:
      'flex',

    flexDirection:
      'column',

    justifyContent:
      'space-between',

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
      '9px',

  },


  iconBox: {

    width:
      '34px',

    height:
      '34px',

    borderRadius:
      '11px',

    display:
      'flex',

    alignItems:
      'center',

    justifyContent:
      'center',

    background:
      'rgba(167,139,250,0.11)',

    border:
      '1px solid rgba(167,139,250,0.17)',

    boxShadow:
      '0 0 15px rgba(167,139,250,0.06)',

  },


  title: {

    fontSize:
      '16px',

    fontWeight:
      600,

    color:
      '#ffffff',

    letterSpacing:
      '-0.2px',

  },


  phaseVisual: {

    position:
      'relative',

    height:
      '76px',

    display:
      'flex',

    alignItems:
      'center',

    justifyContent:
      'center',

    marginTop:
      '2px',

  },


  moonGlow: {

    position:
      'absolute',

    width:
      '76px',

    height:
      '76px',

    borderRadius:
      '50%',

    background:

      'radial-gradient(circle, rgba(196,181,253,0.55) 0%, rgba(139,92,246,0) 70%)',

    filter:
      'blur(8px)',

    transition:
      'opacity 1.2s ease',

  },


  moon: {

    position:
      'relative',

    width:
      '58px',

    height:
      '58px',

    borderRadius:
      '50%',

    overflow:
      'hidden',

    background:

      'radial-gradient(circle at 34% 28%, #ffffff 0%, #f5f3ff 38%, #ddd6fe 72%, #c4b5fd 100%)',

    boxShadow:

      '0 0 25px rgba(196,181,253,0.32), inset -4px -4px 10px rgba(109,40,217,0.08)',

    isolation:
      'isolate',

  },


  moonSurface: {

    position:
      'absolute',

    inset:
      0,

    zIndex:
      1,

    pointerEvents:
      'none',

  },


  shadowPhase: {

    position:
      'absolute',

    top:
      '-5%',

    width:
      '70px',

    height:
      '70px',

    borderRadius:
      '50%',

    background:

      'radial-gradient(circle at 45% 45%, rgba(32,22,55,0.96), rgba(45,27,78,0.92))',

    zIndex:
      3,

    transition:

      'left 1.35s cubic-bezier(0.34,1.2,0.64,1), opacity 0.8s ease',

    pointerEvents:
      'none',

    willChange:
      'left, opacity',

  },


  crater: {

    position:
      'absolute',

    borderRadius:
      '50%',

    background:
      'rgba(139,92,246,0.13)',

    boxShadow:
      'inset 1px 1px 2px rgba(255,255,255,0.18)',

    zIndex:
      2,

  },


  crater1: {

    width:
      '9px',

    height:
      '9px',

    top:
      '17px',

    left:
      '16px',

  },


  crater2: {

    width:
      '6px',

    height:
      '6px',

    top:
      '35px',

    left:
      '30px',

  },


  crater3: {

    width:
      '5px',

    height:
      '5px',

    top:
      '11px',

    left:
      '34px',

  },


  crater4: {

    width:
      '4px',

    height:
      '4px',

    top:
      '40px',

    left:
      '18px',

  },


  phaseInfo: {

    display:
      'flex',

    flexDirection:
      'column',

    alignItems:
      'center',

    gap:
      '3px',

    marginTop:
      '2px',

  },


  phaseName: {

    fontSize:
      '15px',

    fontWeight:
      600,

    color:
      '#ffffff',

    letterSpacing:
      '-0.1px',

  },


  illumination: {

    fontSize:
      '11px',

    color:
      '#a5b4fc',

    transition:
      'color 0.3s ease',

  },


  progressSection: {

    marginTop:
      '8px',

  },


  progressLabels: {

    display:
      'flex',

    justifyContent:
      'space-between',

    fontSize:
      '9px',

    color:
      '#64748b',

    marginBottom:
      '5px',

  },


  progressTrack: {

    position:
      'relative',

    width:
      '100%',

    height:
      '4px',

    borderRadius:
      '10px',

    background:
      'rgba(255,255,255,0.075)',

    border:
      '1px solid rgba(255,255,255,0.04)',

    overflow:
      'visible',

  },


  progressFill: {

    height:
      '100%',

    borderRadius:
      '10px',

    background:
      'linear-gradient(90deg, #8b5cf6, #c4b5fd)',

    boxShadow:
      '0 0 9px rgba(167,139,250,0.38)',

    transition:

      'width 1.3s cubic-bezier(0.34,1.2,0.64,1)',

  },


  progressMarker: {

    position:
      'absolute',

    top:
      '50%',

    width:
      '6px',

    height:
      '6px',

    borderRadius:
      '50%',

    transform:
      'translateY(-50%)',

    background:
      '#ede9fe',

    border:
      '1px solid #a78bfa',

    boxShadow:
      '0 0 8px rgba(167,139,250,0.55)',

    transition:

      'left 1.3s cubic-bezier(0.34,1.2,0.64,1)',

  },


  nextPhase: {

    display:
      'flex',

    justifyContent:
      'space-between',

    alignItems:
      'center',

    paddingTop:
      '9px',

    marginTop:
      '5px',

    borderTop:
      '1px solid rgba(255,255,255,0.08)',

  },


  nextLabel: {

    fontSize:
      '11px',

    color:
      '#94a3b8',

  },


  nextValue: {

    fontSize:
      '11px',

    fontWeight:
      500,

    color:
      '#ddd6fe',

  },


  loadingState: {

    flex:
      1,

    display:
      'flex',

    alignItems:
      'center',

    justifyContent:
      'center',

    fontSize:
      '12px',

    color:
      '#94a3b8',

  },


  errorState: {

    flex:
      1,

    display:
      'flex',

    alignItems:
      'center',

    justifyContent:
      'center',

    fontSize:
      '12px',

    color:
      '#94a3b8',

    textAlign:
      'center',

  },

};