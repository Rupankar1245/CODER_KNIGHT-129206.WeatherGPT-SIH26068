import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

/* =========================================================
   GLOBAL TYPES
========================================================= */

declare global {
  interface Window {
    L?: unknown;

    windyInit?: (
      options: WindyInitOptions,
      callback: (
        windyAPI: WindyAPI
      ) => void
    ) => void;
  }
}

/* =========================================================
   WINDY TYPES
========================================================= */

interface WindyInitOptions {
  key: string;
  lat: number;
  lon: number;
  zoom: number;
  verbose?: boolean;
}

interface WindyStore {
  get: (
    key: string
  ) => unknown;

  set: (
    key: string,
    value: unknown
  ) => void;

  getAllowed?: (
    key: string
  ) => string[] | string;
}

interface WindyMap {
  flyTo: (
    latLng: [number, number],
    zoom?: number,
    options?: {
      duration?: number;
    }
  ) => void;

  invalidateSize?: () => void;
}

interface WindyAPI {
  map: WindyMap;
  store: WindyStore;
}

/* =========================================================
   COMPONENT TYPES
========================================================= */

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface WeatherMapProps {
  activeLayer: string;

  setActiveLayer:
  React.Dispatch<
    React.SetStateAction<string>
  >;

  userLocation:
  UserLocation | null;
}

interface WeatherLayer {
  id: string;
  windyOverlay: string;
  label: string;
  icon: string;
  description: string;
}

/* =========================================================
   CONSTANTS
========================================================= */

const LEAFLET_SCRIPT =
  'https://unpkg.com/leaflet@1.4.0/dist/leaflet.js';

const WINDY_SCRIPT =
  'https://api.windy.com/assets/map-forecast/libBoot.js';

const DEFAULT_LATITUDE =
  22.5726;

const DEFAULT_LONGITUDE =
  88.3639;

/* =========================================================
   MODULE LEVEL SCRIPT PROMISES ONLY

   IMPORTANT:
   We cache ONLY script loading.

   We DO NOT cache Windy API instance because the map
   instance is connected to a specific #windy DOM element.
========================================================= */

let leafletScriptPromise:
  | Promise<void>
  | null =
  null;

let windyScriptPromise:
  | Promise<void>
  | null =
  null;

/* =========================================================
   WEATHER LAYERS
========================================================= */

const ALL_LAYERS: WeatherLayer[] = [
  {
    id: 'wind',
    windyOverlay: 'wind',
    label: 'Wind',
    icon: '💨',
    description:
      'Wind speed and direction',
  },

  {
    id: 'temperature',
    windyOverlay: 'temp',
    label: 'Temperature',
    icon: '🌡️',
    description:
      'Air temperature',
  },

  {
    id: 'pressure',
    windyOverlay: 'pressure',
    label: 'Pressure',
    icon: '🌀',
    description:
      'Atmospheric pressure',
  },

  {
    id: 'precipitation',
    windyOverlay: 'rain',
    label: 'Rain',
    icon: '🌧️',
    description:
      'Rain and precipitation',
  },

  {
    id: 'clouds',
    windyOverlay: 'clouds',
    label: 'Clouds',
    icon: '☁️',
    description:
      'Cloud coverage',
  },

  {
    id: 'gust',
    windyOverlay: 'gust',
    label: 'Wind Gusts',
    icon: '💨',
    description:
      'Wind gust intensity',
  },

  {
    id: 'waves',
    windyOverlay: 'waves',
    label: 'Waves',
    icon: '🌊',
    description:
      'Ocean wave conditions',
  },
];

/* =========================================================
   WAIT FOR CONDITION
========================================================= */

const waitForCondition = (
  condition: () => boolean,
  timeout = 10000
): Promise<void> => {
  return new Promise<void>(
    (
      resolve,
      reject
    ) => {
      const startTime =
        Date.now();

      const interval =
        window.setInterval(
          () => {
            if (
              condition()
            ) {
              window.clearInterval(
                interval
              );

              resolve();
              return;
            }

            if (
              Date.now() -
              startTime >
              timeout
            ) {
              window.clearInterval(
                interval
              );

              reject(
                new Error(
                  'Timed out while waiting for external dependency.'
                )
              );
            }
          },
          50
        );
    }
  );
};

/* =========================================================
   GENERIC SCRIPT LOADER
========================================================= */

const loadExternalScript = (
  src: string,
  checkLoaded: () => boolean
): Promise<void> => {
  if (
    checkLoaded()
  ) {
    return Promise.resolve();
  }

  return new Promise<void>(
    (
      resolve,
      reject
    ) => {
      const existingScript =
        document.querySelector(
          `script[src="${src}"]`
        ) as HTMLScriptElement | null;

      if (
        existingScript
      ) {
        waitForCondition(
          checkLoaded
        )
          .then(
            resolve
          )
          .catch(
            reject
          );

        return;
      }

      const script =
        document.createElement(
          'script'
        );

      script.src =
        src;

      script.async =
        true;

      script.onload =
        async () => {
          try {
            await waitForCondition(
              checkLoaded
            );

            resolve();
          } catch (
          error
          ) {
            reject(
              error
            );
          }
        };

      script.onerror =
        () => {
          reject(
            new Error(
              `Failed to load script: ${src}`
            )
          );
        };

      document.head.appendChild(
        script
      );
    }
  );
};

/* =========================================================
   LOAD LEAFLET
========================================================= */

const loadLeafletScript =
  (): Promise<void> => {
    if (
      typeof window.L !==
      'undefined'
    ) {
      return Promise.resolve();
    }

    if (
      leafletScriptPromise
    ) {
      return leafletScriptPromise;
    }

    leafletScriptPromise =
      loadExternalScript(
        LEAFLET_SCRIPT,
        () =>
          typeof window.L !==
          'undefined'
      )
        .catch(
          (
            error
          ) => {
            leafletScriptPromise =
              null;

            throw error;
          }
        );

    return leafletScriptPromise;
  };

/* =========================================================
   LOAD WINDY SCRIPT
========================================================= */

const loadWindyScript =
  async (): Promise<void> => {
    await loadLeafletScript();

    if (
      typeof window.windyInit ===
      'function'
    ) {
      return;
    }

    if (
      windyScriptPromise
    ) {
      return windyScriptPromise;
    }

    windyScriptPromise =
      loadExternalScript(
        WINDY_SCRIPT,
        () =>
          typeof window.windyInit ===
          'function'
      )
        .catch(
          (
            error
          ) => {
            windyScriptPromise =
              null;

            throw error;
          }
        );

    return windyScriptPromise;
  };

/* =========================================================
   ENSURE WINDY CONTAINER EXISTS

   Windy requires:

   <div id="windy"></div>

   directly available in the BODY DOM tree before
   initialization.
========================================================= */

const waitForWindyContainer =
  async (): Promise<HTMLDivElement> => {
    await waitForCondition(
      () =>
        document.getElementById(
          'windy'
        ) instanceof HTMLDivElement
    );

    const container =
      document.getElementById(
        'windy'
      ) as HTMLDivElement;

    return container;
  };

/* =========================================================
   INITIALIZE WINDY

   IMPORTANT:
   No shared API instance is reused here.
   Every mounted WeatherMap gets initialized against
   its currently mounted #windy DOM container.
========================================================= */

const initializeWindy =
  async (
    apiKey: string,
    latitude: number,
    longitude: number,
    zoom: number
  ): Promise<WindyAPI> => {
    /*
      First make sure the container exists.

      This is important because Windy's libBoot checks
      for #windy during initialization.
    */

    await waitForWindyContainer();

    /*
      Then load scripts.
    */

    await loadWindyScript();

    /*
      Check again because navigation could happen
      while scripts were loading.
    */

    const container =
      document.getElementById(
        'windy'
      );

    if (
      !container
    ) {
      throw new Error(
        'Windy map container was removed before initialization.'
      );
    }

    if (
      typeof window.windyInit !==
      'function'
    ) {
      throw new Error(
        'Windy API loaded but windyInit is unavailable.'
      );
    }

    /*
      Clear any stale DOM left inside the container.
    */

    container.innerHTML =
      '';

    return new Promise<WindyAPI>(
      (
        resolve,
        reject
      ) => {
        try {
          window.windyInit?.(
            {
              key:
                apiKey,

              lat:
                latitude,

              lon:
                longitude,

              zoom:
                zoom,

              verbose:
                false,
            },

            (
              windyAPI
            ) => {
              if (
                !windyAPI
              ) {
                reject(
                  new Error(
                    'Windy returned an invalid API instance.'
                  )
                );

                return;
              }

              resolve(
                windyAPI
              );
            }
          );
        } catch (
        error
        ) {
          reject(
            error
          );
        }
      }
    );
  };

/* =========================================================
   WEATHER MAP COMPONENT
========================================================= */

export const WeatherMap:
  React.FC<WeatherMapProps> = ({
    activeLayer,
    setActiveLayer,
    userLocation,
  }) => {
    /* =====================================================
       ENV
    ===================================================== */

    const windyApiKey =
      import.meta.env
        .VITE_WINDY_API_KEY as
      | string
      | undefined;

    /* =====================================================
       REFS
    ===================================================== */

    const windyAPIRef =
      useRef<
        WindyAPI | null
      >(
        null
      );

    const mapContainerRef =
      useRef<
        HTMLElement | null
      >(
        null
      );

    const isMountedRef =
      useRef(
        false
      );

    const initializationIdRef =
      useRef(
        0
      );

    /* =====================================================
       STATE
    ===================================================== */

    const [
      isLoading,
      setIsLoading,
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
      availableOverlays,
      setAvailableOverlays,
    ] = useState<
      string[]
    >(
      []
    );

    const [
      isPlaying,
      setIsPlaying,
    ] = useState(
      true
    );

    const [
      isLayerMenuOpen,
      setIsLayerMenuOpen,
    ] = useState(
      false
    );

    /* =====================================================
       AVAILABLE LAYERS
    ===================================================== */

    const availableLayers =
      useMemo(
        () => {
          if (
            availableOverlays.length ===
            0
          ) {
            return [];
          }

          return ALL_LAYERS.filter(
            (
              layer
            ) =>
              availableOverlays.includes(
                layer.windyOverlay
              )
          );
        },
        [
          availableOverlays,
        ]
      );

    /* =====================================================
       CURRENT LAYER
    ===================================================== */

    const currentLayer =
      availableLayers.find(
        (
          layer
        ) =>
          layer.id ===
          activeLayer
      ) ||
      availableLayers[0] ||
      ALL_LAYERS[0];

    /* =====================================================
       GET WINDY OVERLAY
    ===================================================== */

    const getWindyOverlay =
      useCallback(
        (
          layerId: string
        ): string => {
          const layer =
            ALL_LAYERS.find(
              (
                item
              ) =>
                item.id ===
                layerId
            );

          return (
            layer?.windyOverlay ||
            'wind'
          );
        },
        []
      );

    /* =====================================================
       INITIALIZE MAP
    ===================================================== */

    useEffect(
      () => {
        isMountedRef.current =
          true;

        /*
          Every mount gets its own initialization ID.

          If the user navigates away while initialization
          is running, the old async result is ignored.
        */

        initializationIdRef.current +=
          1;

        const currentInitializationId =
          initializationIdRef.current;

        const initialize =
          async () => {
            try {
              if (
                isMountedRef.current
              ) {
                setError(
                  null
                );

                setIsLoading(
                  true
                );

                setAvailableOverlays(
                  []
                );
              }

              /*
                Reset stale reference from any previous mount.
              */

              windyAPIRef.current =
                null;

              if (
                !windyApiKey
              ) {
                throw new Error(
                  'VITE_WINDY_API_KEY is missing from your .env file.'
                );
              }

              const latitude =
                userLocation?.latitude ??
                DEFAULT_LATITUDE;

              const longitude =
                userLocation?.longitude ??
                DEFAULT_LONGITUDE;

              const zoom =
                userLocation
                  ? 8
                  : 5;

              /*
                Wait one animation frame.

                This guarantees React has committed the
                #windy element into the DOM.
              */

              await new Promise<void>((resolve) => {
                requestAnimationFrame(() => {
                  requestAnimationFrame(() => resolve());
                });
              });

              /*
                If component was unmounted,
                stop here.
              */

              if (
                !isMountedRef.current ||
                initializationIdRef.current !==
                currentInitializationId
              ) {
                return;
              }

              const windyAPI =
                await initializeWindy(
                  windyApiKey,
                  latitude,
                  longitude,
                  zoom
                );

              /*
                Ignore stale async initialization.
              */

              if (
                !isMountedRef.current ||
                initializationIdRef.current !==
                currentInitializationId
              ) {
                return;
              }

              /*
                IMPORTANT:
                Check the current #windy container still exists.
              */

              const currentContainer =
                document.getElementById(
                  'windy'
                );

              if (
                !currentContainer
              ) {
                return;
              }

              windyAPIRef.current =
                windyAPI;

              /* =============================================
                 GET AVAILABLE OVERLAYS
              ============================================= */

              let overlays:
                string[] =
                [];

              try {
                const allowed =
                  windyAPI
                    .store
                    .getAllowed?.(
                      'overlay'
                    );

                if (
                  Array.isArray(
                    allowed
                  )
                ) {
                  overlays =
                    allowed;
                } else if (
                  typeof allowed ===
                  'string'
                ) {
                  overlays =
                    [
                      allowed,
                    ];
                }
              } catch (
              overlayError
              ) {
                console.warn(
                  'Unable to detect Windy overlays:',
                  overlayError
                );
              }

              /*
                Fallback to supported layer list.
              */

              if (
                overlays.length ===
                0
              ) {
                overlays =
                  ALL_LAYERS.map(
                    (
                      layer
                    ) =>
                      layer.windyOverlay
                  );
              }

              if (
                !isMountedRef.current ||
                initializationIdRef.current !==
                currentInitializationId
              ) {
                return;
              }

              setAvailableOverlays(
                overlays
              );

              /* =============================================
                 DETERMINE INITIAL OVERLAY
              ============================================= */

              const requestedOverlay =
                getWindyOverlay(
                  activeLayer
                );

              const initialOverlay =
                overlays.includes(
                  requestedOverlay
                )
                  ? requestedOverlay
                  : (
                    overlays.includes(
                      'wind'
                    )
                      ? 'wind'
                      : overlays[0]
                  );

              /*
                Sync active layer if needed.
              */

              const matchingLayer =
                ALL_LAYERS.find(
                  (
                    layer
                  ) =>
                    layer.windyOverlay ===
                    initialOverlay
                );

              if (
                matchingLayer &&
                matchingLayer.id !==
                activeLayer
              ) {
                setActiveLayer(
                  matchingLayer.id
                );
              }

              /* =============================================
                 APPLY OVERLAY
              ============================================= */

              if (
                initialOverlay
              ) {
                try {
                  windyAPI
                    .store
                    .set(
                      'overlay',
                      initialOverlay
                    );
                } catch (
                overlayError
                ) {
                  console.warn(
                    'Unable to apply Windy overlay:',
                    overlayError
                  );
                }
              }

              /* =============================================
                 WIND PARTICLES
              ============================================= */

              if (
                initialOverlay ===
                'wind'
              ) {
                try {
                  windyAPI
                    .store
                    .set(
                      'particlesAnim',
                      'on'
                    );
                } catch (
                particleError
                ) {
                  console.warn(
                    'Unable to enable wind particles:',
                    particleError
                  );
                }
              }

              /* =============================================
                 RESIZE
              ============================================= */

              window.setTimeout(
                () => {
                  if (
                    !isMountedRef.current ||
                    initializationIdRef.current !==
                    currentInitializationId
                  ) {
                    return;
                  }

                  try {
                    windyAPI
                      .map
                      .invalidateSize?.();
                  } catch (
                  resizeError
                  ) {
                    console.warn(
                      'Unable to resize Windy map:',
                      resizeError
                    );
                  }
                },
                600
              );

              /* =============================================
                 COMPLETE
              ============================================= */

              if (
                isMountedRef.current &&
                initializationIdRef.current ===
                currentInitializationId
              ) {
                setIsPlaying(
                  true
                );

                setIsLoading(
                  false
                );
              }
            } catch (
            initializationError
            ) {
              console.error(
                'Windy initialization error:',
                initializationError
              );

              if (
                isMountedRef.current &&
                initializationIdRef.current ===
                currentInitializationId
              ) {
                setError(
                  initializationError
                    instanceof Error
                    ? initializationError.message
                    : 'Unable to initialize Windy map.'
                );

                setIsLoading(
                  false
                );
              }
            }
          };

        initialize();

        return () => {
          /*
            Invalidate this initialization.
          */

          initializationIdRef.current +=
            1;

          isMountedRef.current =
            false;

          /*
            VERY IMPORTANT:
            Never reuse the old API reference
            after component unmount.
          */

          windyAPIRef.current =
            null;

          setIsLayerMenuOpen(
            false
          );
        };
      },

      [
        windyApiKey,
      ]
    );

    /* =====================================================
       CHANGE WEATHER LAYER
    ===================================================== */

    useEffect(
      () => {
        const windyAPI =
          windyAPIRef.current;

        if (
          !windyAPI
        ) {
          return;
        }

        if (
          availableOverlays.length ===
          0
        ) {
          return;
        }

        const overlay =
          getWindyOverlay(
            activeLayer
          );

        if (
          !availableOverlays.includes(
            overlay
          )
        ) {
          return;
        }

        try {
          windyAPI
            .store
            .set(
              'overlay',
              overlay
            );

          if (
            overlay ===
            'wind'
          ) {
            windyAPI
              .store
              .set(
                'particlesAnim',
                isPlaying
                  ? 'on'
                  : 'off'
              );
          }
        } catch (
        layerError
        ) {
          console.error(
            'Unable to change Windy layer:',
            layerError
          );
        }
      },

      [
        activeLayer,
        availableOverlays,
        getWindyOverlay,
        isPlaying,
      ]
    );

    /* =====================================================
       USER LOCATION UPDATE
    ===================================================== */

    useEffect(
      () => {
        const windyAPI =
          windyAPIRef.current;

        if (
          !windyAPI ||
          !userLocation
        ) {
          return;
        }

        try {
          windyAPI
            .map
            .flyTo(
              [
                userLocation.latitude,
                userLocation.longitude,
              ],
              8,
              {
                duration:
                  1.2,
              }
            );
        } catch (
        locationError
        ) {
          console.warn(
            'Unable to update map location:',
            locationError
          );
        }
      },

      [
        userLocation,
      ]
    );

    /* =====================================================
       HANDLE LAYER CHANGE
    ===================================================== */

    const handleLayerChange =
      (
        layerId: string
      ) => {
        const overlay =
          getWindyOverlay(
            layerId
          );

        if (
          !availableOverlays.includes(
            overlay
          )
        ) {
          console.warn(
            `Layer "${layerId}" is not supported by the current Windy API.`
          );

          return;
        }

        setActiveLayer(
          layerId
        );

        setIsLayerMenuOpen(
          false
        );
      };

    /* =====================================================
       CENTER MAP
    ===================================================== */

    const handleCenterMap =
      () => {
        const windyAPI =
          windyAPIRef.current;

        if (
          !windyAPI
        ) {
          return;
        }

        const latitude =
          userLocation?.latitude ??
          DEFAULT_LATITUDE;

        const longitude =
          userLocation?.longitude ??
          DEFAULT_LONGITUDE;

        try {
          windyAPI
            .map
            .flyTo(
              [
                latitude,
                longitude,
              ],
              userLocation
                ? 8
                : 5,
              {
                duration:
                  1.2,
              }
            );
        } catch (
        centerError
        ) {
          console.warn(
            'Unable to center map:',
            centerError
          );
        }
      };

    /* =====================================================
       FULLSCREEN
    ===================================================== */

    const handleFullscreen =
      async () => {
        const element =
          mapContainerRef.current;

        if (
          !element
        ) {
          return;
        }

        try {
          if (
            !document.fullscreenElement
          ) {
            await element.requestFullscreen();
          } else {
            await document.exitFullscreen();
          }

          window.setTimeout(
            () => {
              try {
                windyAPIRef.current
                  ?.map
                  .invalidateSize?.();
              } catch (
              resizeError
              ) {
                console.warn(
                  'Fullscreen resize error:',
                  resizeError
                );
              }
            },
            600
          );
        } catch (
        fullscreenError
        ) {
          console.warn(
            'Fullscreen error:',
            fullscreenError
          );
        }
      };

    /* =====================================================
       PLAY / PAUSE
    ===================================================== */

    const handlePlay =
      () => {
        const windyAPI =
          windyAPIRef.current;

        if (
          !windyAPI
        ) {
          return;
        }

        const nextState =
          !isPlaying;

        setIsPlaying(
          nextState
        );

        const currentOverlay =
          getWindyOverlay(
            activeLayer
          );

        if (
          currentOverlay ===
          'wind'
        ) {
          try {
            windyAPI
              .store
              .set(
                'particlesAnim',
                nextState
                  ? 'on'
                  : 'off'
              );
          } catch (
          particleError
          ) {
            console.warn(
              'Unable to toggle particles:',
              particleError
            );
          }
        }
      };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
      <section
        ref={mapContainerRef}
        className="weather-map"
      >
        {/* =================================================
            WINDY MAP

            IMPORTANT:
            Keep this directly rendered at all times.
        ================================================= */}

        <div
          id="windy"
          className="weather-map__windy"
        />

        {/* =================================================
            LOADING
        ================================================= */}

        {isLoading && (
          <div
            className="weather-map__loading"
          >
            <div
              className="weather-map__spinner"
            />

            <span>
              Loading live weather map...
            </span>
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div
            className="weather-map__error"
          >
            <strong>
              Windy Map Error
            </strong>

            <span>
              {error}
            </span>
          </div>
        )}

        {/* =================================================
            LAYER MENU
        ================================================= */}

        {!isLoading &&
          !error && (
            <div
              className="weather-map__layers"
            >
              <button
                type="button"
                className="weather-map__layers-toggle"
                onClick={
                  () =>
                    setIsLayerMenuOpen(
                      (
                        previous
                      ) =>
                        !previous
                    )
                }
                aria-expanded={
                  isLayerMenuOpen
                }
              >
                <span
                  className="weather-map__layers-toggle-left"
                >
                  <span>
                    ☰
                  </span>

                  <span>
                    Layers
                  </span>
                </span>

                <span
                  className={
                    isLayerMenuOpen
                      ? 'weather-map__chevron open'
                      : 'weather-map__chevron'
                  }
                >
                  ⌄
                </span>
              </button>

              {isLayerMenuOpen && (
                <div
                  className="weather-map__panel"
                >
                  <span
                    className="weather-map__panel-title"
                  >
                    Weather Layers
                  </span>

                  {availableLayers.length >
                    0 ? (
                    availableLayers.map(
                      (
                        layer
                      ) => (
                        <button
                          key={
                            layer.id
                          }
                          type="button"
                          className={
                            activeLayer ===
                              layer.id
                              ? 'weather-map__layer active'
                              : 'weather-map__layer'
                          }
                          onClick={
                            () =>
                              handleLayerChange(
                                layer.id
                              )
                          }
                          title={
                            layer.description
                          }
                        >
                          <span
                            className="weather-map__layer-icon"
                          >
                            {layer.icon}
                          </span>

                          <span>
                            {layer.label}
                          </span>
                        </button>
                      )
                    )
                  ) : (
                    <span
                      className="weather-map__no-layers"
                    >
                      Detecting layers...
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

        {/* =================================================
            TOP BAR
        ================================================= */}

        {!isLoading &&
          !error && (
            <div
              className="weather-map__topbar"
            >
              <div
                className="weather-map__brand"
              >
                <span
                  className="weather-map__live-dot"
                />

                <span>
                  Live Weather Map
                </span>
              </div>

              <div
                className="weather-map__mode"
              >
                <span>
                  {currentLayer.icon}
                </span>

                <span>
                  {currentLayer.label}
                </span>
              </div>
            </div>
          )}

        {/* =================================================
            ACTIONS
        ================================================= */}

        {!isLoading &&
          !error && (
            <div
              className="weather-map__actions"
            >
              <button
                type="button"
                onClick={
                  handleCenterMap
                }
                aria-label="Center map"
                title="Center map"
              >
                ◎
              </button>

              <button
                type="button"
                onClick={
                  handleFullscreen
                }
                aria-label="Fullscreen"
                title="Fullscreen"
              >
                ⛶
              </button>
            </div>
          )}

        {/* =================================================
            INFO PANEL
        ================================================= */}

        {!isLoading &&
          !error && (
            <div
              className="weather-map__info"
            >
              <div
                className="weather-map__info-title"
              >
                <span>
                  {currentLayer.icon}
                </span>

                <span>
                  {currentLayer.label}
                </span>
              </div>

              <p>
                {
                  currentLayer.description
                }
              </p>
            </div>
          )}

        {/* =================================================
            TIMELINE
        ================================================= */}

        {!isLoading &&
          !error && (
            <div
              className="weather-map__timeline"
            >
              <button
                type="button"
                className="weather-map__play"
                onClick={
                  handlePlay
                }
                aria-label="Play or pause animation"
                title="Play or pause animation"
              >
                {
                  isPlaying
                    ? '❚❚'
                    : '▶'
                }
              </button>

              <div
                className="weather-map__time"
              >
                <strong>
                  Live Forecast
                </strong>

                <span>
                  {
                    currentLayer.description
                  }
                </span>
              </div>

              <div
                className="weather-map__timeline-line"
              >
                <span
                  className="weather-map__timeline-progress"
                />
              </div>
            </div>
          )}

        {/* =================================================
            STYLES
        ================================================= */}

        <style>{`

          .weather-map {
            position: relative;
            width: 100%;
            height: 100%;
            min-width: 0;
            min-height: 0;
            overflow: hidden;
            border-radius: 22px;
            background: #0b1220;
            isolation: isolate;
          }

          .weather-map:fullscreen {
            width: 100vw;
            height: 100vh;
            border-radius: 0;
          }

          .weather-map__windy,
          #windy {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            min-width: 0;
            min-height: 0;
          }


          /* ===============================================
             LOADING
          =============================================== */

          .weather-map__loading {
            position: absolute;
            inset: 0;
            z-index: 5000;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            gap: 14px;

            background:
              rgba(9, 34, 66, 0.72);

            backdrop-filter:
              blur(8px);

            color: #ffffff;

            font-size: 13px;
            font-weight: 600;
          }

          .weather-map__spinner {
            width: 34px;
            height: 34px;

            border-radius: 50%;

            border:
              3px solid
              rgba(255, 255, 255, 0.25);

            border-top-color:
              #38bdf8;

            animation:
              weather-map-spin
              0.8s
              linear
              infinite;
          }

          @keyframes weather-map-spin {
            to {
              transform:
                rotate(360deg);
            }
          }


          /* ===============================================
             ERROR
          =============================================== */

          .weather-map__error {
            position: absolute;

            top: 50%;
            left: 50%;

            transform:
              translate(-50%, -50%);

            z-index: 5000;

            display: flex;
            flex-direction: column;

            gap: 8px;

            width:
              min(
                380px,
                calc(100% - 40px)
              );

            padding: 22px;

            border-radius: 16px;

            background:
              rgba(127, 29, 29, 0.96);

            color: #ffffff;

            text-align: center;

            box-sizing: border-box;
          }

          .weather-map__error span {
            font-size: 12px;
            opacity: 0.85;
          }


          /* ===============================================
             LAYERS
          =============================================== */

          .weather-map__layers {
            position: absolute;

            top: 22px;
            left: 22px;

            z-index: 2200;

            display: flex;
            flex-direction: column;
            align-items: flex-start;

            gap: 8px;
          }

          .weather-map__layers-toggle {
            display: flex;
            align-items: center;
            justify-content: space-between;

            gap: 18px;

            min-width: 150px;

            padding: 11px 14px;

            border:
              1px solid
              rgba(255, 255, 255, 0.35);

            border-radius: 14px;

            background:
              rgba(15, 23, 42, 0.88);

            backdrop-filter:
              blur(18px);

            color: #ffffff;

            cursor: pointer;

            box-shadow:
              0 10px 26px
              rgba(0, 0, 0, 0.20);

            transition:
              all 0.2s ease;
          }

          .weather-map__layers-toggle:hover {
            transform:
              translateY(-1px);

            background:
              rgba(15, 23, 42, 0.96);
          }

          .weather-map__layers-toggle-left {
            display: flex;
            align-items: center;
            gap: 8px;

            font-size: 12px;
            font-weight: 700;
          }

          .weather-map__chevron {
            display: inline-block;

            font-size: 16px;
            line-height: 1;

            transition:
              transform 0.2s ease;
          }

          .weather-map__chevron.open {
            transform:
              rotate(180deg);
          }


          /* ===============================================
             PANEL
          =============================================== */

          .weather-map__panel {
            width: 180px;

            max-height:
              min(
                360px,
                calc(100vh - 240px)
              );

            overflow-y: auto;

            display: flex;
            flex-direction: column;

            gap: 6px;

            padding: 12px;

            border-radius: 16px;

            background:
              rgba(255, 255, 255, 0.96);

            backdrop-filter:
              blur(20px);

            box-shadow:
              0 16px 36px
              rgba(0, 0, 0, 0.20);

            box-sizing: border-box;

            animation:
              weather-map-menu
              0.18s
              ease;
          }

          @keyframes weather-map-menu {
            from {
              opacity: 0;

              transform:
                translateY(-6px);
            }

            to {
              opacity: 1;

              transform:
                translateY(0);
            }
          }

          .weather-map__panel-title {
            margin:
              2px
              4px
              6px;

            font-size: 10px;
            font-weight: 800;

            letter-spacing: 0.08em;
            text-transform: uppercase;

            color: #64748b;
          }

          .weather-map__layer {
            width: 100%;

            display: flex;
            align-items: center;

            gap: 9px;

            padding: 10px;

            border: none;
            border-radius: 10px;

            background: transparent;

            color: #334155;

            text-align: left;

            font-size: 12px;
            font-weight: 600;

            cursor: pointer;

            transition:
              all 0.2s ease;
          }

          .weather-map__layer:hover {
            background: #f1f5f9;
          }

          .weather-map__layer.active {
            background: #0f172a;
            color: #ffffff;
          }

          .weather-map__layer-icon {
            width: 20px;
            text-align: center;
          }

          .weather-map__no-layers {
            padding: 10px 4px;

            font-size: 11px;

            color: #64748b;
          }


          /* ===============================================
             TOP BAR
          =============================================== */

          .weather-map__topbar {
            position: absolute;

            top: 22px;
            left: 50%;

            transform:
              translateX(-50%);

            z-index: 2100;

            display: flex;
            align-items: center;

            gap: 10px;

            pointer-events: none;
          }

          .weather-map__brand,
          .weather-map__mode {
            display: flex;
            align-items: center;

            gap: 8px;

            white-space: nowrap;

            box-shadow:
              0 10px 28px
              rgba(0, 0, 0, 0.18);
          }

          .weather-map__brand {
            padding: 10px 14px;

            border-radius: 999px;

            background:
              rgba(15, 23, 42, 0.90);

            backdrop-filter:
              blur(16px);

            color: #ffffff;

            font-size: 13px;
            font-weight: 700;
          }

          .weather-map__live-dot {
            width: 7px;
            height: 7px;

            flex-shrink: 0;

            border-radius: 50%;

            background: #22c55e;

            box-shadow:
              0 0 0 4px
              rgba(34, 197, 94, 0.18);
          }

          .weather-map__mode {
            padding: 10px 14px;

            border-radius: 999px;

            background:
              rgba(255, 255, 255, 0.95);

            color: #0f172a;

            font-size: 12px;
            font-weight: 700;
          }


          /* ===============================================
             INFO
          =============================================== */

          .weather-map__info {
            position: absolute;

            left: 22px;
            bottom: 112px;

            z-index: 2100;

            width: 190px;

            padding: 12px 14px;

            border-radius: 14px;

            background:
              rgba(255, 255, 255, 0.95);

            backdrop-filter:
              blur(14px);

            box-shadow:
              0 10px 24px
              rgba(15, 23, 42, 0.16);

            box-sizing: border-box;
          }

          .weather-map__info-title {
            display: flex;
            align-items: center;

            gap: 7px;

            margin-bottom: 5px;

            font-size: 12px;
            font-weight: 800;

            color: #0f172a;
          }

          .weather-map__info p {
            margin: 0;

            font-size: 10px;
            line-height: 1.5;

            color: #64748b;
          }


          /* ===============================================
             ACTIONS
          =============================================== */

          .weather-map__actions {
            position: absolute;

            right: 22px;
            bottom: 112px;

            z-index: 2200;

            display: flex;
            flex-direction: column;

            gap: 8px;
          }

          .weather-map__actions button {
            width: 40px;
            height: 40px;

            border: none;
            border-radius: 12px;

            background:
              rgba(255, 255, 255, 0.95);

            color: #0f172a;

            font-size: 19px;

            cursor: pointer;

            box-shadow:
              0 8px 20px
              rgba(15, 23, 42, 0.18);

            transition:
              transform 0.2s ease;
          }

          .weather-map__actions button:hover {
            transform:
              translateY(-2px);
          }


          /* ===============================================
             TIMELINE
          =============================================== */

          .weather-map__timeline {
            position: absolute;

            left: 22px;
            right: 22px;
            bottom: 22px;

            z-index: 2100;

            min-height: 68px;

            display: flex;
            align-items: center;

            gap: 14px;

            padding: 12px 18px;

            border-radius: 16px;

            background:
              rgba(15, 23, 42, 0.92);

            backdrop-filter:
              blur(18px);

            box-shadow:
              0 14px 40px
              rgba(0, 0, 0, 0.28);

            box-sizing: border-box;
          }

          .weather-map__play {
            width: 38px;
            height: 38px;

            flex-shrink: 0;

            border: none;
            border-radius: 50%;

            background: #ffffff;

            color: #0f172a;

            cursor: pointer;

            font-size: 12px;
            font-weight: 800;
          }

          .weather-map__time {
            min-width: 150px;

            display: flex;
            flex-direction: column;

            gap: 3px;

            color: #ffffff;
          }

          .weather-map__time strong {
            font-size: 13px;
          }

          .weather-map__time span {
            font-size: 11px;

            color:
              rgba(255, 255, 255, 0.58);
          }

          .weather-map__timeline-line {
            position: relative;

            flex: 1;

            min-width: 60px;

            height: 4px;

            overflow: hidden;

            border-radius: 999px;

            background:
              rgba(255, 255, 255, 0.20);
          }

          .weather-map__timeline-progress {
            position: absolute;

            inset:
              0 auto 0 0;

            width: 32%;
            height: 100%;

            border-radius: inherit;

            background:
              linear-gradient(
                90deg,
                #38bdf8,
                #6366f1
              );
          }


          /* ===============================================
             RESPONSIVE
          =============================================== */

          @media (
            max-width: 1100px
          ) {
            .weather-map__topbar {
              gap: 7px;
            }

            .weather-map__brand,
            .weather-map__mode {
              padding:
                9px 11px;
            }

            .weather-map__brand {
              font-size: 12px;
            }

            .weather-map__time {
              min-width: 120px;
            }
          }


          @media (
            max-width: 768px
          ) {
            .weather-map {
              min-height: 520px;
              border-radius: 18px;
            }

            .weather-map__layers {
              top: 14px;
              left: 14px;
            }

            .weather-map__panel {
              width: 165px;
              max-height: 280px;
            }

            .weather-map__topbar {
              top: 14px;

              left: auto;
              right: 14px;

              transform: none;
            }

            .weather-map__brand {
              display: none;
            }

            .weather-map__info {
              display: none;
            }

            .weather-map__actions {
              right: 14px;
              bottom: 100px;
            }

            .weather-map__timeline {
              left: 12px;
              right: 12px;
              bottom: 12px;

              min-height: 58px;

              gap: 9px;

              padding:
                10px 12px;
            }

            .weather-map__time {
              min-width: 90px;
            }

            .weather-map__time strong {
              font-size: 11px;
            }

            .weather-map__time span {
              display: none;
            }

            .weather-map__play {
              width: 34px;
              height: 34px;
            }
          }


          @media (
            max-width: 480px
          ) {
            .weather-map__mode {
              display: none;
            }

            .weather-map__layers-toggle {
              min-width: 125px;
            }

            .weather-map__time {
              display: none;
            }
          }

        `}</style>
      </section>
    );
  };