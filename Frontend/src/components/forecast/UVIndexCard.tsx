import React, { useEffect, useRef, useState } from 'react';
import { Sun, ShieldCheck } from 'lucide-react';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://127.0.0.1:8000';

interface UVData {
  uvIndex: number;
  uvIndexMax: number;
  level: string;
  recommendation: string;
  progress: number;
  timestamp: string;
  timezone: string;
  latitude: number;
  longitude: number;
}

interface UVApiResponse {
  success: boolean;
  data?: UVData;
  error?: string;
}

export const UVIndexCard: React.FC = () => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const [uvData, setUvData] = useState<UVData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [animatedProgress, setAnimatedProgress] = useState(0);

  /* =====================================================
     FETCH UV DATA
  ===================================================== */

  useEffect(() => {
    let cancelled = false;

    const fetchUVData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!navigator.geolocation) {
          throw new Error(
            'Geolocation is not supported by this browser.'
          );
        }

        const position =
          await new Promise<GeolocationPosition>(
            (resolve, reject) => {
              navigator.geolocation.getCurrentPosition(
                resolve,
                reject,
                {
                  enableHighAccuracy: true,
                  timeout: 10000,
                  maximumAge: 300000,
                }
              );
            }
          );

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const apiUrl =
          `${API_BASE_URL}/api/weather/uv-index/?lat=${encodeURIComponent(
            latitude
          )}&lon=${encodeURIComponent(longitude)}`;

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        });

        let result: UVApiResponse;

        try {
          result = await response.json();
        } catch {
          throw new Error(
            `Invalid response from UV API. HTTP ${response.status}`
          );
        }

        if (!response.ok) {
          throw new Error(
            result.error ||
            `UV API error: ${response.status}`
          );
        }

        if (!result.success) {
          throw new Error(
            result.error ||
            'UV API returned an unsuccessful response.'
          );
        }

        if (!result.data) {
          throw new Error(
            'UV API returned no data.'
          );
        }

        /*
         * Validate actual UV payload.
         *
         * IMPORTANT:
         * UV index 0 is VALID.
         * Therefore we must NOT use:
         *
         * if (!result.data.uvIndex)
         *
         * because 0 would be treated as false.
         */

        if (
          typeof result.data.uvIndex !== 'number'
        ) {
          throw new Error(
            'Invalid UV index received from API.'
          );
        }

        if (!cancelled) {
          setUvData(result.data);
        }
      } catch (err) {
        if (cancelled) return;

        if (
          typeof GeolocationPositionError !==
          'undefined' &&
          err instanceof GeolocationPositionError
        ) {
          switch (err.code) {
            case err.PERMISSION_DENIED:
              setError(
                'Location permission is required to get UV data.'
              );
              break;

            case err.POSITION_UNAVAILABLE:
              setError(
                'Unable to determine your current location.'
              );
              break;

            case err.TIMEOUT:
              setError(
                'Location request timed out.'
              );
              break;

            default:
              setError(
                'Unable to access your location.'
              );
          }
        } else {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to fetch UV data.'
          );
        }

        setUvData(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchUVData();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =====================================================
     UV VALUES
  ===================================================== */

  const uvIndex = uvData?.uvIndex ?? 0;

  /*
   * Backend already provides progress.
   *
   * If backend progress is unavailable,
   * calculate it using uvIndexMax.
   */

  const calculatedProgress =
    uvData &&
      typeof uvData.uvIndexMax === 'number' &&
      uvData.uvIndexMax > 0
      ? Math.min(
        100,
        Math.max(
          0,
          (uvData.uvIndex /
            uvData.uvIndexMax) *
          100
        )
      )
      : 0;

  const uvProgress =
    uvData &&
      typeof uvData.progress === 'number'
      ? Math.min(
        100,
        Math.max(0, uvData.progress)
      )
      : calculatedProgress;

  const uvLevel =
    uvData?.level ?? 'Unavailable';

  const uvRecommendation =
    uvData?.recommendation ??
    'UV protection information is currently unavailable.';

  /* =====================================================
     UV LEVEL COLOR
  ===================================================== */

  const getLevelColor = () => {
    switch (uvLevel.toLowerCase()) {
      case 'low':
        return '#4ade80';

      case 'moderate':
        return '#fbbf24';

      case 'high':
        return '#fb923c';

      case 'very high':
        return '#f87171';

      case 'extreme':
        return '#c084fc';

      default:
        return '#94a3b8';
    }
  };

  const levelColor = getLevelColor();

  /* =====================================================
     DESCRIPTION
  ===================================================== */

  const getDescription = () => {
    if (!uvData) {
      return 'UV information unavailable';
    }

    switch (uvLevel.toLowerCase()) {
      case 'low':
        return 'Minimal protection required';

      case 'moderate':
        return 'Protection recommended';

      case 'high':
        return 'Protection required';

      case 'very high':
        return 'Extra protection required';

      case 'extreme':
        return 'Avoid direct sunlight';

      default:
        return uvRecommendation;
    }
  };

  /* =====================================================
     INTERSECTION ANIMATION
  ===================================================== */

  useEffect(() => {
    const card = cardRef.current;

    if (!card || !uvData) {
      setAnimatedProgress(0);
      return;
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setAnimatedProgress(0);

            const timer = window.setTimeout(() => {
              setAnimatedProgress(
                uvProgress
              );
            }, 100);

            return () => {
              window.clearTimeout(timer);
            };
          } else {
            setAnimatedProgress(0);
          }
        },
        {
          threshold: 0.3,
        }
      );

    observer.observe(card);

    return () => {
      observer.disconnect();
    };
  }, [uvData, uvProgress]);

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div
      ref={cardRef}
      style={styles.card}
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div style={styles.header}>

        <div style={styles.titleSection}>

          <div style={styles.iconWrapper}>

            <Sun
              size={18}
              color="#fbbf24"
              strokeWidth={1.8}
            />

          </div>

          <div>

            <h3 style={styles.title}>
              UV Index
            </h3>

            <span style={styles.subtitle}>
              Sun exposure level
            </span>

          </div>

        </div>

        {/* STATUS */}

        <div
          style={{
            ...styles.statusBadge,

            color:
              loading || error
                ? '#94a3b8'
                : levelColor,

            borderColor:
              loading || error
                ? 'rgba(148,163,184,0.15)'
                : `${levelColor}20`,

            background:
              loading || error
                ? 'rgba(148,163,184,0.07)'
                : `${levelColor}10`,
          }}
        >

          <span
            style={{
              ...styles.statusDot,

              backgroundColor:
                loading || error
                  ? '#94a3b8'
                  : levelColor,

              boxShadow:
                loading || error
                  ? '0 0 7px rgba(148,163,184,0.5)'
                  : `0 0 7px ${levelColor}99`,
            }}
          />

          <span>
            {loading
              ? 'Loading'
              : error
                ? 'Unavailable'
                : uvLevel}
          </span>

        </div>

      </div>

      {/* =================================================
          MAIN UV VALUE
      ================================================= */}

      <div style={styles.mainSection}>

        <div style={styles.uvValue}>

          {loading || error
            ? '—'
            : uvIndex.toFixed(1)}

        </div>

        <div style={styles.valueInfo}>

          <span
            style={{
              ...styles.level,

              color:
                loading || error
                  ? '#94a3b8'
                  : levelColor,
            }}
          >
            {loading
              ? 'Loading...'
              : error
                ? 'Unavailable'
                : uvLevel}
          </span>

          <span style={styles.description}>
            {loading
              ? 'Fetching UV information'
              : error
                ? 'Unable to load UV data'
                : getDescription()}
          </span>

        </div>

      </div>

      {/* =================================================
          UV SCALE
      ================================================= */}

      <div style={styles.scaleSection}>

        <div style={styles.scaleHeader}>

          <span style={styles.scaleTitle}>
            UV exposure
          </span>

          <span
            style={{
              ...styles.scaleValue,

              color:
                loading || error
                  ? '#64748b'
                  : levelColor,
            }}
          >
            {loading || error
              ? 'UV —'
              : `UV ${uvIndex.toFixed(1)}`}
          </span>

        </div>

        {/* GLASS UV TRACK */}

        <div style={styles.scale}>

          <div
            style={{
              ...styles.scaleProgress,

              width: `${loading || error
                  ? 0
                  : animatedProgress
                }%`,
            }}
          />

          <div
            style={{
              ...styles.scaleIndicator,

              left:
                loading || error
                  ? '0%'
                  : `calc(${animatedProgress}% - 6px)`,

              borderColor:
                loading || error
                  ? 'rgba(148,163,184,0.6)'
                  : `${levelColor}`,

              boxShadow:
                loading || error
                  ? '0 0 10px rgba(148,163,184,0.35)'
                  : `0 0 12px ${levelColor}99`,
            }}
          />

        </div>

        {/* SCALE LABELS */}

        <div style={styles.scaleLabels}>

          <span>
            Low
          </span>

          <span>
            Moderate
          </span>

          <span>
            High
          </span>

          <span>
            Very High
          </span>

        </div>

      </div>

      {/* =================================================
          RECOMMENDATION
      ================================================= */}

      <div style={styles.recommendation}>

        <div style={styles.recommendationIcon}>

          <ShieldCheck
            size={16}
            color="#38bdf8"
            strokeWidth={1.8}
          />

        </div>

        <div style={styles.recommendationContent}>

          <span style={styles.recommendationTitle}>
            Sun protection
          </span>

          <span style={styles.recommendationText}>

            {loading
              ? 'Fetching current UV protection advice...'
              : error
                ? 'UV protection information is currently unavailable.'
                : uvRecommendation}

          </span>

        </div>

      </div>

      {/* =================================================
          FOOTER
      ================================================= */}

      <div style={styles.footer}>

        <span
          style={{
            ...styles.footerDot,

            background:
              loading
                ? '#94a3b8'
                : error
                  ? '#ef4444'
                  : levelColor,

            boxShadow:
              loading
                ? '0 0 7px rgba(148,163,184,0.5)'
                : error
                  ? '0 0 7px rgba(239,68,68,0.6)'
                  : `0 0 7px ${levelColor}99`,
          }}
        />

        <span style={styles.footerText}>

          {loading
            ? 'Fetching current UV conditions'
            : error
              ? 'UV data unavailable'
              : `${uvLevel} exposure — ${uvRecommendation}`}

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

  /* =====================================================
     CARD
  ===================================================== */

  card: {
    position: 'relative',

    width: '100%',

    minHeight: '100%',

    padding: '20px',

    boxSizing: 'border-box',

    borderRadius: '20px',

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

    gap: '10px',
  },

  titleSection: {
    display: 'flex',

    alignItems: 'center',

    gap: '10px',
  },

  iconWrapper: {
    width: '36px',

    height: '36px',

    flexShrink: 0,

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',

    borderRadius: '10px',

    background:
      'rgba(251,191,36,0.09)',

    border:
      '1px solid rgba(251,191,36,0.14)',

    boxShadow:
      '0 0 16px rgba(251,191,36,0.07)',
  },

  title: {
    margin: 0,

    fontSize: '14px',

    fontWeight: 600,

    color: '#f8fafc',

    letterSpacing: '-0.15px',
  },

  subtitle: {
    display: 'block',

    marginTop: '3px',

    fontSize: '10px',

    color: '#64748b',
  },

  /* =====================================================
     STATUS
  ===================================================== */

  statusBadge: {
    display: 'flex',

    alignItems: 'center',

    gap: '6px',

    padding: '5px 9px',

    borderRadius: '20px',

    fontSize: '10px',

    whiteSpace: 'nowrap',
  },

  statusDot: {
    width: '5px',

    height: '5px',

    flexShrink: 0,

    borderRadius: '50%',
  },

  /* =====================================================
     MAIN VALUE
  ===================================================== */

  mainSection: {
    display: 'flex',

    alignItems: 'center',

    gap: '16px',

    marginTop: '20px',
  },

  uvValue: {
    fontSize: '48px',

    lineHeight: 1,

    fontWeight: 700,

    color: '#ffffff',

    letterSpacing: '-1.5px',

    textShadow:
      '0 4px 18px rgba(0,0,0,0.25)',
  },

  valueInfo: {
    display: 'flex',

    flexDirection: 'column',

    gap: '4px',
  },

  level: {
    fontSize: '16px',

    fontWeight: 600,
  },

  description: {
    fontSize: '11px',

    color: '#94a3b8',
  },

  /* =====================================================
     UV SCALE
  ===================================================== */

  scaleSection: {
    marginTop: '20px',
  },

  scaleHeader: {
    display: 'flex',

    alignItems: 'center',

    justifyContent: 'space-between',

    marginBottom: '8px',
  },

  scaleTitle: {
    fontSize: '10px',

    color: '#94a3b8',
  },

  scaleValue: {
    fontSize: '10px',

    fontWeight: 600,
  },

  scale: {
    position: 'relative',

    width: '100%',

    height: '9px',

    borderRadius: '20px',

    background:
      'rgba(255,255,255,0.065)',

    border:
      '1px solid rgba(255,255,255,0.06)',

    boxShadow:
      'inset 0 1px 3px rgba(0,0,0,0.18)',

    overflow: 'visible',
  },

  scaleProgress: {
    position: 'relative',

    height: '100%',

    minWidth: '0',

    borderRadius: '20px',

    background:
      'linear-gradient(90deg, rgba(34,197,94,0.72), rgba(250,204,21,0.82), rgba(251,191,36,0.95))',

    boxShadow:
      '0 0 14px rgba(251,191,36,0.25)',

    transition:
      'width 1.2s cubic-bezier(0.34,1.25,0.64,1)',
  },

  scaleIndicator: {
    position: 'absolute',

    top: '50%',

    width: '12px',

    height: '12px',

    transform:
      'translateY(-50%)',

    borderRadius: '50%',

    background:
      'rgba(255,255,255,0.95)',

    border:
      '2px solid rgba(251,191,36,0.95)',

    transition:
      'left 1.2s cubic-bezier(0.34,1.25,0.64,1)',

    zIndex: 2,
  },

  scaleLabels: {
    display: 'flex',

    alignItems: 'center',

    justifyContent: 'space-between',

    marginTop: '7px',

    fontSize: '7px',

    color: '#64748b',
  },

  /* =====================================================
     RECOMMENDATION
  ===================================================== */

  recommendation: {
    display: 'flex',

    alignItems: 'center',

    gap: '10px',

    marginTop: '18px',

    paddingTop: '14px',

    borderTop:
      '1px solid rgba(255,255,255,0.07)',
  },

  recommendationIcon: {
    width: '30px',

    height: '30px',

    flexShrink: 0,

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',

    borderRadius: '9px',

    background:
      'rgba(56,189,248,0.07)',

    border:
      '1px solid rgba(56,189,248,0.10)',
  },

  recommendationContent: {
    display: 'flex',

    flexDirection: 'column',

    gap: '3px',

    minWidth: 0,
  },

  recommendationTitle: {
    fontSize: '10px',

    fontWeight: 600,

    color: '#cbd5e1',
  },

  recommendationText: {
    fontSize: '9px',

    lineHeight: 1.4,

    color: '#64748b',
  },

  /* =====================================================
     FOOTER
  ===================================================== */

  footer: {
    display: 'flex',

    alignItems: 'center',

    gap: '7px',

    marginTop: '15px',

    paddingTop: '11px',

    borderTop:
      '1px solid rgba(255,255,255,0.06)',
  },

  footerDot: {
    width: '5px',

    height: '5px',

    flexShrink: 0,

    borderRadius: '50%',
  },

  footerText: {
    fontSize: '9px',

    color: '#64748b',
  },
};
