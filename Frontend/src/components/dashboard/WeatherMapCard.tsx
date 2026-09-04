import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Layers,
  MapPin,
  Navigation,
  Wind,
} from 'lucide-react';

import 'leaflet/dist/leaflet.css';


/* =========================================================
   TYPES
========================================================= */

interface UserLocation {
  latitude: number;
  longitude: number;
  city?: string;
}


interface WeatherMapCardProps {
  userLocation?: UserLocation | null;
}


/* =========================================================
   COMPONENT
========================================================= */

export const WeatherMapCard: React.FC<
  WeatherMapCardProps
> = ({
  userLocation = null,
}) => {


  /* =======================================================
     REFS
  ======================================================= */

  const mapElementRef =
    useRef<HTMLDivElement | null>(
      null
    );


  const mapRef =
    useRef<import('leaflet').Map | null>(
      null
    );


  const markerRef =
    useRef<import('leaflet').Marker | null>(
      null
    );


  /* =======================================================
     STATE
  ======================================================= */

  const [
    currentTime,
    setCurrentTime,
  ] = useState(
    new Date()
  );


  const [
    isMapReady,
    setIsMapReady,
  ] = useState(
    false
  );


  const [
    mapError,
    setMapError,
  ] = useState<
    string | null
  >(
    null
  );


  /* =======================================================
     DEFAULT LOCATION
  ======================================================= */

  const DEFAULT_LATITUDE =
    22.5726;


  const DEFAULT_LONGITUDE =
    88.3639;


  /* =======================================================
     LIVE TIME UPDATE
  ======================================================= */

  useEffect(
    () => {

      const interval =
        window.setInterval(
          () => {

            setCurrentTime(
              new Date()
            );

          },
          1000
        );


      return () => {

        window.clearInterval(
          interval
        );

      };

    },
    []
  );


  /* =======================================================
     INITIALIZE MAP
  ======================================================= */

  useEffect(
    () => {

      let isMounted =
        true;


      const initializeMap =
        async () => {

          try {

            if (
              !mapElementRef.current ||
              mapRef.current
            ) {

              return;

            }


            const leafletModule =
              await import(
                'leaflet'
              );


            const L =
              leafletModule.default;


            if (
              !isMounted ||
              !mapElementRef.current
            ) {

              return;

            }


            const latitude =
              userLocation?.latitude ??
              DEFAULT_LATITUDE;


            const longitude =
              userLocation?.longitude ??
              DEFAULT_LONGITUDE;


            /* =============================================
               CREATE MAP
            ============================================= */

            const map =
              L.map(
                mapElementRef.current,
                {
                  zoomControl:
                    false,

                  attributionControl:
                    false,
                }
              );


            map.setView(
              [
                latitude,
                longitude,
              ],
              userLocation
                ? 10
                : 8
            );


            /* =============================================
               OPENSTREETMAP
            ============================================= */

            L.tileLayer(
              'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
              {
                maxZoom:
                  19,

                attribution:
                  '© OpenStreetMap contributors',
              }
            ).addTo(
              map
            );


            /* =============================================
               CUSTOM LOCATION MARKER
            ============================================= */

            const locationIcon =
              L.divIcon({

                className:
                  'weather-map-card__leaflet-marker',

                html: `
                  <div
                    class="weather-map-card__marker"
                  >
                    <div
                      class="weather-map-card__marker-core"
                    ></div>

                    <div
                      class="weather-map-card__marker-pulse"
                    ></div>
                  </div>
                `,

                iconSize:
                  [
                    34,
                    34,
                  ],

                iconAnchor:
                  [
                    17,
                    17,
                  ],

              });


            const marker =
              L.marker(
                [
                  latitude,
                  longitude,
                ],
                {
                  icon:
                    locationIcon,
                }
              ).addTo(
                map
              );


            mapRef.current =
              map;


            markerRef.current =
              marker;


            /* =============================================
               WAIT FOR DOM LAYOUT
            ============================================= */

            requestAnimationFrame(
              () => {

                requestAnimationFrame(
                  () => {

                    if (
                      mapRef.current
                    ) {

                      mapRef.current
                        .invalidateSize();

                    }

                  }
                );

              }
            );


            window.setTimeout(
              () => {

                if (
                  mapRef.current
                ) {

                  mapRef.current
                    .invalidateSize();

                }

              },
              300
            );


            if (
              isMounted
            ) {

              setIsMapReady(
                true
              );

            }

          } catch (
            error
          ) {

            console.error(
              'Weather map initialization error:',
              error
            );


            if (
              isMounted
            ) {

              setMapError(
                'Unable to load map preview.'
              );

              setIsMapReady(
                false
              );

            }

          }

        };


      initializeMap();


      return () => {

        isMounted =
          false;


        if (
          mapRef.current
        ) {

          mapRef.current.remove();

          mapRef.current =
            null;

        }


        markerRef.current =
          null;

      };

    },
    []
  );


  /* =======================================================
     UPDATE MAP WHEN REAL LOCATION CHANGES
  ======================================================= */

  useEffect(
    () => {

      const updateLocation =
        async () => {

          if (
            !userLocation
          ) {

            return;

          }


          if (
            !mapRef.current
          ) {

            return;

          }


          try {

            const leafletModule =
              await import(
                'leaflet'
              );


            const L =
              leafletModule.default;


            const latitude =
              userLocation.latitude;


            const longitude =
              userLocation.longitude;


            /* =============================================
               MOVE MAP
            ============================================= */

            mapRef.current.flyTo(
              [
                latitude,
                longitude,
              ],
              10,
              {
                animate:
                  true,

                duration:
                  1.2,
              }
            );


            /* =============================================
               UPDATE MARKER
            ============================================= */

            if (
              markerRef.current
            ) {

              markerRef.current
                .setLatLng(
                  [
                    latitude,
                    longitude,
                  ]
                );

            } else {

              const locationIcon =
                L.divIcon({

                  className:
                    'weather-map-card__leaflet-marker',

                  html: `
                    <div
                      class="weather-map-card__marker"
                    >
                      <div
                        class="weather-map-card__marker-core"
                      ></div>

                      <div
                        class="weather-map-card__marker-pulse"
                      ></div>
                    </div>
                  `,

                  iconSize:
                    [
                      34,
                      34,
                    ],

                  iconAnchor:
                    [
                      17,
                      17,
                    ],

                });


              markerRef.current =
                L.marker(
                  [
                    latitude,
                    longitude,
                  ],
                  {
                    icon:
                      locationIcon,
                  }
                ).addTo(
                  mapRef.current
                );

            }

          } catch (
            error
          ) {

            console.error(
              'Unable to update map location:',
              error
            );

          }

        };


      updateLocation();

    },
    [
      userLocation,
    ]
  );


  /* =======================================================
     FORMAT TIME
  ======================================================= */

  const formattedTime =
    currentTime.toLocaleTimeString(
      [],
      {
        hour:
          '2-digit',

        minute:
          '2-digit',
      }
    );


  const locationName =
    userLocation?.city ??
    'Kolkata';


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <div
      className="weather-map-card"
    >


      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="weather-map-card__header"
      >

        <div
          className="weather-map-card__title"
        >

          <span>
            Weather Map
          </span>


          <div
            className="weather-map-card__live"
          >

            <span
              className="weather-map-card__live-dot"
            />

            LIVE

          </div>

        </div>


        <div
          className="weather-map-card__layer-chip"
        >

          <Layers
            size={11}
          />

          Wind

        </div>

      </div>



      {/* =================================================
          MAP
      ================================================= */}

      <div
        className="weather-map-card__map"
      >


        {/* LEAFLET MAP */}

        <div
          ref={mapElementRef}
          className="weather-map-card__leaflet"
        />


        {/* WEATHER COLOR OVERLAY */}

        <div
          className="weather-map-card__weather-overlay"
        />


        {/* WEATHER SYSTEMS */}

        <div
          className="weather-map-card__weather weather-one"
        />

        <div
          className="weather-map-card__weather weather-two"
        />

        <div
          className="weather-map-card__weather weather-three"
        />


        {/* WIND STREAMS */}

        <div
          className="weather-map-card__wind-stream stream-one"
        />

        <div
          className="weather-map-card__wind-stream stream-two"
        />

        <div
          className="weather-map-card__wind-stream stream-three"
        />


        {/* WIND DATA */}

        <div
          className="weather-map-card__weather-data"
        >

          <div>

            <Wind
              size={12}
            />

            <strong>
              12 km/h
            </strong>

          </div>


          <span>
            Wind
          </span>

        </div>


        {/* LOCATION */}

        <div
          className="weather-map-card__location-label"
        >

          <MapPin
            size={11}
          />

          {locationName}

        </div>


        {/* TIME */}

        <div
          className="weather-map-card__time"
        >

          <Navigation
            size={10}
          />

          Updated {formattedTime}

        </div>


        {/* LOADING */}

        {!isMapReady &&
          !mapError && (

            <div
              className="weather-map-card__loading"
            >

              <div
                className="weather-map-card__spinner"
              />

              Loading live map...

            </div>

          )}


        {/* ERROR */}

        {mapError && (

          <div
            className="weather-map-card__error"
          >

            {mapError}

          </div>

        )}


      </div>



      {/* =================================================
          FOOTER
      ================================================= */}

      <div
        className="weather-map-card__footer"
      >

        <div
          className="weather-map-card__legend"
        >

          <span>

            <i
              className="legend-low"
            />

            Calm

          </span>


          <span>

            <i
              className="legend-medium"
            />

            Moderate

          </span>


          <span>

            <i
              className="legend-high"
            />

            Strong

          </span>

        </div>


        <button
          type="button"
          className="weather-map-card__expand"
          aria-label="Open weather map"
          title="Open weather map"
        >

          View Map →

        </button>

      </div>



      {/* =================================================
          STYLES
      ================================================= */}

      <style>{`

        /* ===============================================
           CARD
        =============================================== */

        .weather-map-card {
          position: relative;

          width: 100%;
          min-height: 260px;

          display: flex;
          flex-direction: column;

          padding: 16px;

          box-sizing: border-box;

          border-radius: 16px;

          overflow: hidden;

          background:
            rgba(
              15,
              35,
              65,
              0.55
            );

          backdrop-filter:
            blur(12px);

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.1
            );

          color:
            #ffffff;
        }


        /* ===============================================
           HEADER
        =============================================== */

        .weather-map-card__header {
          position: relative;

          z-index: 10;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 12px;

          margin-bottom: 12px;
        }


        .weather-map-card__title {
          display: flex;
          align-items: center;

          gap: 9px;

          font-size: 13px;
          font-weight: 600;
        }


        .weather-map-card__live {
          display: flex;
          align-items: center;

          gap: 5px;

          padding:
            3px
            7px;

          border-radius: 999px;

          background:
            rgba(
              34,
              197,
              94,
              0.12
            );

          color:
            #86efac;

          font-size: 8px;
          font-weight: 800;

          letter-spacing:
            0.06em;
        }


        .weather-map-card__live-dot {
          width: 5px;
          height: 5px;

          border-radius: 50%;

          background:
            #22c55e;

          box-shadow:
            0 0 8px
            rgba(
              34,
              197,
              94,
              0.9
            );

          animation:
            weather-map-live-pulse
            1.8s
            ease-in-out
            infinite;
        }


        @keyframes weather-map-live-pulse {

          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }

          50% {
            transform: scale(1.5);
            opacity: 0.5;
          }

        }


        .weather-map-card__layer-chip {
          display: flex;
          align-items: center;

          gap: 5px;

          padding:
            5px
            9px;

          border-radius: 10px;

          background:
            rgba(
              0,
              0,
              0,
              0.28
            );

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.08
            );

          color:
            #94a3b8;

          font-size: 10px;
        }


        /* ===============================================
           MAP
        =============================================== */

        .weather-map-card__map {
          position: relative;

          flex: 1;

          min-height: 175px;

          overflow: hidden;

          border-radius: 12px;

          background: #0a1b2b;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.08
            );
        }


        .weather-map-card__leaflet {
          position: absolute;

          inset: 0;

          width: 100%;
          height: 100%;

          z-index: 1;
        }


        .weather-map-card__leaflet
        .leaflet-tile-pane {
          filter:
            saturate(0.65)
            contrast(1.08)
            brightness(0.75);
        }


        /* ===============================================
           WEATHER OVERLAY
        =============================================== */

        .weather-map-card__weather-overlay {
          position: absolute;

          inset: 0;

          z-index: 2;

          pointer-events: none;

          background:
            linear-gradient(
              135deg,
              rgba(
                2,
                132,
                199,
                0.18
              ),
              transparent 45%,
              rgba(
                79,
                70,
                229,
                0.16
              )
            );
        }


        /* ===============================================
           WEATHER BLOBS
        =============================================== */

        .weather-map-card__weather {
          position: absolute;

          z-index: 3;

          border-radius: 50%;

          filter: blur(20px);

          pointer-events: none;

          opacity: 0.55;

          animation:
            weather-map-drift
            9s
            ease-in-out
            infinite
            alternate;
        }


        .weather-one {
          width: 130px;
          height: 130px;

          top: -45px;
          left: 10%;

          background:
            rgba(
              14,
              165,
              233,
              0.45
            );
        }


        .weather-two {
          width: 110px;
          height: 110px;

          right: 5%;
          top: 25%;

          background:
            rgba(
              99,
              102,
              241,
              0.38
            );

          animation-delay: -3s;
        }


        .weather-three {
          width: 90px;
          height: 90px;

          left: 40%;
          bottom: -35px;

          background:
            rgba(
              20,
              184,
              166,
              0.35
            );

          animation-delay: -5s;
        }


        @keyframes weather-map-drift {

          from {
            transform:
              translate(
                -8px,
                -5px
              )
              scale(1);
          }

          to {
            transform:
              translate(
                15px,
                10px
              )
              scale(1.12);
          }

        }


        /* ===============================================
           WIND STREAMS
        =============================================== */

        .weather-map-card__wind-stream {
          position: absolute;

          z-index: 4;

          height: 2px;

          border-radius: 999px;

          pointer-events: none;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(
                186,
                230,
                253,
                0.9
              ),
              transparent
            );

          opacity: 0.7;

          animation:
            weather-map-wind
            4s
            linear
            infinite;
        }


        .stream-one {
          width: 120px;
          top: 28%;
          left: -30%;
        }


        .stream-two {
          width: 150px;
          top: 55%;
          left: -35%;

          animation-delay: -1.5s;
        }


        .stream-three {
          width: 100px;
          top: 75%;
          left: -25%;

          animation-delay: -2.8s;
        }


        @keyframes weather-map-wind {

          from {
            transform:
              translateX(0)
              rotate(-8deg);
          }

          to {
            transform:
              translateX(500px)
              rotate(-8deg);
          }

        }


        /* ===============================================
           LEAFLET MARKER
        =============================================== */

        .weather-map-card__leaflet-marker {
          background:
            transparent !important;

          border:
            none !important;
        }


        .weather-map-card__marker {
          position: relative;

          width: 34px;
          height: 34px;

          display: flex;
          align-items: center;
          justify-content: center;
        }


        .weather-map-card__marker-core {
          position: relative;

          z-index: 2;

          width: 14px;
          height: 14px;

          border-radius: 50%;

          background: #0ea5e9;

          border:
            3px solid
            #ffffff;

          box-shadow:
            0 4px 12px
            rgba(
              0,
              0,
              0,
              0.4
            );
        }


        .weather-map-card__marker-pulse {
          position: absolute;

          width: 30px;
          height: 30px;

          border-radius: 50%;

          background:
            rgba(
              14,
              165,
              233,
              0.3
            );

          animation:
            weather-map-marker-pulse
            2s
            ease-out
            infinite;
        }


        @keyframes weather-map-marker-pulse {

          0% {
            transform: scale(0.6);
            opacity: 0.9;
          }

          100% {
            transform: scale(1.5);
            opacity: 0;
          }

        }


        /* ===============================================
           WEATHER DATA
        =============================================== */

        .weather-map-card__weather-data {
          position: absolute;

          z-index: 20;

          top: 10px;
          right: 10px;

          display: flex;
          flex-direction: column;

          gap: 3px;

          padding:
            7px
            9px;

          border-radius: 10px;

          background:
            rgba(
              6,
              18,
              32,
              0.78
            );

          backdrop-filter:
            blur(10px);

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.12
            );

          color: #94a3b8;

          font-size: 8px;
        }


        .weather-map-card__weather-data div {
          display: flex;
          align-items: center;

          gap: 5px;

          color: #ffffff;
        }


        .weather-map-card__weather-data strong {
          font-size: 10px;
        }


        /* ===============================================
           LOCATION LABEL
        =============================================== */

        .weather-map-card__location-label {
          position: absolute;

          z-index: 20;

          top: 50%;
          left: 50%;

          transform:
            translate(
              12px,
              -42px
            );

          display: flex;
          align-items: center;

          gap: 4px;

          padding:
            4px
            7px;

          border-radius: 7px;

          background:
            rgba(
              15,
              23,
              42,
              0.85
            );

          color: #ffffff;

          font-size: 8px;
          font-weight: 700;

          pointer-events: none;

          backdrop-filter:
            blur(8px);
        }


        /* ===============================================
           TIME
        =============================================== */

        .weather-map-card__time {
          position: absolute;

          z-index: 20;

          left: 10px;
          bottom: 9px;

          display: flex;
          align-items: center;

          gap: 4px;

          padding:
            4px
            7px;

          border-radius: 7px;

          background:
            rgba(
              5,
              15,
              25,
              0.72
            );

          color:
            rgba(
              255,
              255,
              255,
              0.8
            );

          font-size: 8px;

          backdrop-filter:
            blur(8px);
        }


        /* ===============================================
           LOADING
        =============================================== */

        .weather-map-card__loading {
          position: absolute;

          inset: 0;

          z-index: 30;

          display: flex;
          flex-direction: column;

          align-items: center;
          justify-content: center;

          gap: 8px;

          background:
            rgba(
              7,
              24,
              39,
              0.82
            );

          color: #cbd5e1;

          font-size: 10px;
        }


        .weather-map-card__spinner {
          width: 22px;
          height: 22px;

          border-radius: 50%;

          border:
            2px solid
            rgba(
              255,
              255,
              255,
              0.15
            );

          border-top-color: #38bdf8;

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


        .weather-map-card__error {
          position: absolute;

          inset: 0;

          z-index: 30;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 20px;

          background:
            rgba(
              127,
              29,
              29,
              0.85
            );

          color: #fecaca;

          font-size: 10px;

          text-align: center;
        }


        /* ===============================================
           FOOTER
        =============================================== */

        .weather-map-card__footer {
          position: relative;

          z-index: 10;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 10px;

          margin-top: 10px;
        }


        .weather-map-card__legend {
          display: flex;
          align-items: center;

          gap: 9px;

          flex-wrap: wrap;

          color: #64748b;

          font-size: 8px;
        }


        .weather-map-card__legend span {
          display: flex;
          align-items: center;

          gap: 4px;
        }


        .weather-map-card__legend i {
          width: 6px;
          height: 6px;

          border-radius: 50%;
        }


        .legend-low {
          background: #38bdf8;
        }


        .legend-medium {
          background: #6366f1;
        }


        .legend-high {
          background: #22c55e;
        }


        .weather-map-card__expand {
          flex-shrink: 0;

          border: none;

          background:
            transparent;

          color: #38bdf8;

          font-size: 10px;
          font-weight: 700;

          cursor: pointer;

          padding: 4px;
        }


        .weather-map-card__expand:hover {
          color: #7dd3fc;
        }


        /* ===============================================
           RESPONSIVE
        =============================================== */

        @media (
          max-width: 767px
        ) {

          .weather-map-card {
            min-height: 280px;
          }


          .weather-map-card__map {
            min-height: 190px;
          }

        }


        @media (
          max-width: 480px
        ) {

          .weather-map-card {
            padding: 13px;
          }


          .weather-map-card__legend {
            gap: 6px;
          }


          .weather-map-card__weather-data {
            display: none;
          }

        }

      `}</style>

    </div>

  );

};