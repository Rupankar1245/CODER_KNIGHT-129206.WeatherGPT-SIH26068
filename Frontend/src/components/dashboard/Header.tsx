
import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  MapPin,
  ChevronDown,
  Bell,
  LocateFixed,
  Loader2,
} from 'lucide-react';

import { NotificationPanel } from './NotificationPanel';
import { SearchBar } from './SearchBar';
import { ProfileSection } from './ProfileSection';


/* =========================================================
   TYPES
========================================================= */

interface LocationData {
  city: string;
  state: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
}


interface HeaderProps {
  onLocationDetected?: (
    latitude: number,
    longitude: number
  ) => void;
}


/* =========================================================
   HEADER
========================================================= */

export const Header: React.FC<HeaderProps> = ({
  onLocationDetected,
}) => {


  /* =====================================================
     NOTIFICATION STATE
  ===================================================== */

  const [
    showNotifications,
    setShowNotifications,
  ] = useState(false);


  const notificationRef =
    useRef<HTMLDivElement>(null);


  /* =====================================================
     PROFILE STATE
  ===================================================== */

  const [
    showProfile,
    setShowProfile,
  ] = useState(false);


  /* =====================================================
     LIVE DATE & TIME
  ===================================================== */

  const [
    currentTime,
    setCurrentTime,
  ] = useState(new Date());


  /* =====================================================
     GPS LOCATION
  ===================================================== */

  const [
    location,
    setLocation,
  ] = useState<LocationData>({
    city:
      'Detecting location...',
    state:
      '',
    country:
      '',
    latitude:
      null,
    longitude:
      null,
  });


  const [
    isLocationLoading,
    setIsLocationLoading,
  ] = useState(true);


  /* =====================================================
     CLOSE NOTIFICATION WHEN CLICKING OUTSIDE
  ===================================================== */

  useEffect(() => {


    const handleClickOutside = (
      event: MouseEvent
    ) => {

      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          event.target as Node
        )
      ) {

        setShowNotifications(false);

      }

    };


    if (showNotifications) {

      document.addEventListener(
        'mousedown',
        handleClickOutside
      );

    }


    return () => {

      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );

    };


  }, [showNotifications]);


  /* =====================================================
     LIVE CLOCK
  ===================================================== */

  useEffect(() => {


    const timer =
      window.setInterval(() => {

        setCurrentTime(
          new Date()
        );

      }, 1000);


    return () => {

      window.clearInterval(
        timer
      );

    };


  }, []);


  /* =====================================================
     GPS + OPENWEATHER REVERSE GEOCODING
  ===================================================== */

  useEffect(() => {


    if (!navigator.geolocation) {

      console.error(
        'Geolocation is not supported by this browser.'
      );


      setLocation({
        city:
          'Location unavailable',
        state:
          '',
        country:
          '',
        latitude:
          null,
        longitude:
          null,
      });


      setIsLocationLoading(false);

      return;

    }


    const handlePosition = async (
      position: GeolocationPosition
    ) => {


      const {
        latitude,
        longitude,
      } = position.coords;


      /* =============================================
         SEND GPS LOCATION TO PARENT
      ============================================= */

      onLocationDetected?.(
        latitude,
        longitude
      );


      try {


        const API_KEY =
          import.meta.env
            .VITE_OPENWEATHER_API_KEY;


        if (!API_KEY) {

          console.error(
            'OpenWeather API key is missing.'
          );


          setLocation({
            city:
              'API key missing',
            state:
              '',
            country:
              '',
            latitude,
            longitude,
          });


          setIsLocationLoading(false);

          return;

        }


        /* =============================================
           OPENWEATHER REVERSE GEOCODING
        ============================================= */

        const response =
          await fetch(

            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`

          );


        if (!response.ok) {

          throw new Error(
            `OpenWeather request failed: ${response.status}`
          );

        }


        const data =
          await response.json();


        if (
          Array.isArray(data) &&
          data.length > 0
        ) {


          const locationData =
            data[0];


          setLocation({

            city:
              locationData.local_names?.en ||
              locationData.name ||
              'Unknown location',

            state:
              locationData.state ||
              '',

            country:
              locationData.country ||
              '',

            latitude,

            longitude,

          });


        } else {


          setLocation({

            city:
              'Unknown location',

            state:
              '',

            country:
              '',

            latitude,

            longitude,

          });

        }


      } catch (error) {


        console.error(
          'Failed to fetch location:',
          error
        );


        setLocation({

          city:
            'Unable to detect location',

          state:
            '',

          country:
            '',

          latitude,

          longitude,

        });


      } finally {

        setIsLocationLoading(false);

      }

    };


    /* =============================================
       GEOLOCATION ERROR
    ============================================= */

    const handleLocationError = (
      error: GeolocationPositionError
    ) => {


      console.error(
        'Geolocation error:',
        error.message
      );


      let errorMessage =
        'Location unavailable';


      switch (error.code) {


        case error.PERMISSION_DENIED:

          errorMessage =
            'Location permission denied';

          break;


        case error.POSITION_UNAVAILABLE:

          errorMessage =
            'Location unavailable';

          break;


        case error.TIMEOUT:

          errorMessage =
            'Location request timed out';

          break;


        default:

          errorMessage =
            'Unable to detect location';

      }


      setLocation({

        city:
          errorMessage,

        state:
          '',

        country:
          '',

        latitude:
          null,

        longitude:
          null,

      });


      setIsLocationLoading(false);

    };


    /* =============================================
       REQUEST CURRENT POSITION
    ============================================= */

    navigator.geolocation.getCurrentPosition(

      handlePosition,

      handleLocationError,

      {
        enableHighAccuracy:
          true,

        timeout:
          10000,

        maximumAge:
          300000,
      }

    );


  }, [onLocationDetected]);


  /* =====================================================
     SEARCH HANDLER
  ===================================================== */

  const handleSearch = (
    query: string
  ) => {


    console.log(
      'MeghAI Search:',
      query
    );


    /*
    Later:

    searchWeatherLocation(query);

    searchWeatherAlerts(query);

    navigate(`/weather/${query}`);
    */

  };


  /* =====================================================
     FORMAT DATE
  ===================================================== */

  const formattedDate =
    currentTime.toLocaleDateString(
      'en-IN',
      {
        weekday:
          'long',

        month:
          'long',

        day:
          'numeric',

        year:
          'numeric',
      }
    );


  /* =====================================================
     FORMAT TIME
  ===================================================== */

  const formattedTime =
    currentTime.toLocaleTimeString(
      'en-IN',
      {
        hour:
          '2-digit',

        minute:
          '2-digit',

        second:
          '2-digit',

        hour12:
          true,
      }
    );


  /* =====================================================
     LOCATION DISPLAY
  ===================================================== */

  const locationName =
    location.state
      ? `${location.city}, ${location.state}`
      : location.city;


  /* =====================================================
     RENDER
  ===================================================== */

  return (

    <>


      {/* =================================================
          RESPONSIVE HEADER CSS
      ================================================= */}

      <style>{`

        /* =====================================================
           BASE SAFETY
        ===================================================== */

        .meghai-header,
        .meghai-header * {
          box-sizing:
            border-box;
        }


        /* =====================================================
           DESKTOP

           Desktop layout remains unchanged.
        ===================================================== */

        .meghai-header {
          display:
            flex;

          align-items:
            center;

          gap:
            20px;
        }


        .meghai-location-container {
          flex-shrink:
            0;
        }


        .meghai-location-title {
          min-width:
            0;
        }


        .meghai-location-name {
          overflow:
            hidden;

          text-overflow:
            ellipsis;
        }


        /* =====================================================
           TABLET
           768px - 1023px
        ===================================================== */

        @media (max-width: 1023px) {


          .meghai-header {
            gap:
              14px;
          }


          .meghai-location-container {
            min-width:
              210px !important;
          }


          .meghai-update-badge {
            display:
              none !important;
          }

        }


        /* =====================================================
           MOBILE
           BELOW 768px
        ===================================================== */

        @media (max-width: 767px) {


          /* ===============================================
             MAIN HEADER

             ROW 1:
             Location | Notification | Profile

             ROW 2:
             Search
          =============================================== */

          .meghai-header {
            display:
              grid !important;

            grid-template-columns:
              minmax(0, 1fr)
              auto
              auto;

            grid-template-areas:
              "location notification profile"
              "search search search";

            align-items:
              center;

            gap:
              12px;

            width:
              100%;

            min-width:
              0;

            padding:
              12px !important;

            min-height:
              auto !important;

            border-radius:
              14px !important;
          }


          /* ===============================================
             LOCATION
          =============================================== */

          .meghai-location-container {
            grid-area:
              location;

            width:
              100%;

            min-width:
              0 !important;

            max-width:
              100%;

            overflow:
              hidden;
          }


          .meghai-location-title {
            width:
              100%;

            min-width:
              0;

            gap:
              7px !important;
          }


          .meghai-location-title h2 {
            min-width:
              0;

            max-width:
              100%;

            overflow:
              hidden;

            text-overflow:
              ellipsis;

            white-space:
              nowrap;

            font-size:
              16px !important;

            line-height:
              1.2;

            margin:
              0;
          }


          .meghai-location-title svg {
            flex-shrink:
              0;
          }


          /* ===============================================
             DATE

             Hidden on mobile to keep the
             top row clean and compact.
          =============================================== */

          .meghai-date-text {
            display:
              none !important;
          }


          /* ===============================================
             SEARCH
          =============================================== */

          .meghai-search-section {
            grid-area:
              search;

            width:
              100%;

            min-width:
              0;

            max-width:
              100%;

            margin-top:
              2px;
          }


          .meghai-search-section > * {
            width:
              100%;

            min-width:
              0;
          }


          /* ===============================================
             RIGHT SECTION

             Allows children to participate directly
             in the CSS grid.
          =============================================== */

          .meghai-right-section {
            display:
              contents !important;
          }


          /* ===============================================
             LOCATION STATUS BADGE
          =============================================== */

          .meghai-update-badge {
            display:
              none !important;
          }


          /* ===============================================
             NOTIFICATION
          =============================================== */

          .meghai-notification-wrapper {
            grid-area:
              notification;

            flex-shrink:
              0;
          }


          .meghai-notification-button {
            width:
              38px !important;

            height:
              38px !important;
          }


          /* ===============================================
             PROFILE
          =============================================== */

          .meghai-avatar-button {
            grid-area:
              profile;

            width:
              40px !important;

            height:
              40px !important;

            flex-shrink:
              0;
          }


          .meghai-avatar {
            width:
              36px !important;

            height:
              36px !important;
          }

        }


        /* =====================================================
           SMALL MOBILE
           BELOW 480px
        ===================================================== */

        @media (max-width: 480px) {


          .meghai-header {
            gap:
              10px;

            padding:
              10px !important;
          }


          .meghai-location-title h2 {
            font-size:
              15px !important;
          }


          .meghai-location-title svg {
            width:
              18px;

            height:
              18px;
          }


          .meghai-notification-button {
            width:
              36px !important;

            height:
              36px !important;
          }


          .meghai-avatar-button {
            width:
              38px !important;

            height:
              38px !important;
          }


          .meghai-avatar {
            width:
              34px !important;

            height:
              34px !important;
          }

        }


        /* =====================================================
           VERY SMALL MOBILE
           BELOW 360px
        ===================================================== */

        @media (max-width: 359px) {


          .meghai-header {
            gap:
              8px;

            padding:
              8px !important;
          }


          .meghai-location-title h2 {
            font-size:
              14px !important;
          }


          .meghai-notification-button {
            width:
              34px !important;

            height:
              34px !important;
          }


          .meghai-avatar-button {
            width:
              36px !important;

            height:
              36px !important;
          }


          .meghai-avatar {
            width:
              32px !important;

            height:
              32px !important;
          }

        }


        /* =====================================================
           TOUCH DEVICES
        ===================================================== */

        @media (hover: none) {

          .meghai-header button:hover {
            transform:
              none;
          }

        }

      `}</style>


      {/* =================================================
          HEADER
      ================================================= */}

      <header
        className="meghai-header"
        style={styles.header}
      >


        {/* ===============================================
            LEFT SECTION — LOCATION
        =============================================== */}

        <div
          className="
            meghai-location-container
          "
          style={styles.locationContainer}
        >


          <div
            className="
              meghai-location-title
            "
            style={styles.locationTitle}
          >


            {isLocationLoading ? (

              <Loader2
                size={20}
                color="#38bdf8"
                style={{
                  animation:
                    'meghai-spin 1s linear infinite',
                }}
              />

            ) : (

              <MapPin
                size={20}
                color="#38bdf8"
              />

            )}


            <h2
              className="
                meghai-location-name
              "
            >

              {locationName}

            </h2>


            <ChevronDown
              size={18}
              color="#94a3b8"
              style={{
                cursor:
                  'pointer',

                flexShrink:
                  0,
              }}
            />


          </div>


          <p
            className="
              meghai-date-text
            "
            style={styles.dateText}
          >

            {formattedDate}

            {' | '}

            {formattedTime}

          </p>


        </div>


        {/* ===============================================
            CENTER SECTION — SEARCH
        =============================================== */}

        <div
          className="
            meghai-search-section
          "
          style={styles.searchSection}
        >

          <SearchBar
            onSearch={handleSearch}
          />

        </div>


        {/* ===============================================
            RIGHT SECTION
        =============================================== */}

        <div
          className="
            meghai-right-section
          "
          style={styles.rightSection}
        >


          {/* =============================================
              LOCATION STATUS
          ============================================= */}

          <div
            className="
              meghai-update-badge
            "
            style={
              isLocationLoading
                ? styles.updateBadgeLoading
                : styles.updateBadge
            }
          >


            {isLocationLoading ? (

              <>

                <LocateFixed
                  size={12}
                  color="#38bdf8"
                />


                <span>

                  Detecting location...

                </span>

              </>

            ) : (

              <>

                <span
                  style={
                    styles.greenDot
                  }
                />


                <span>

                  Location detected

                </span>

              </>

            )}


          </div>


          {/* =============================================
              NOTIFICATION
          ============================================= */}

          <div
            ref={notificationRef}
            className="
              meghai-notification-wrapper
            "
            style={styles.notificationWrapper}
          >


            <button
              type="button"
              className="
                meghai-notification-button
              "
              onClick={() =>
                setShowNotifications(
                  (prev) => !prev
                )
              }
              style={{
                ...styles.iconBtn,

                ...(showNotifications
                  ? styles.iconBtnActive
                  : {}),
              }}
              aria-label="Notifications"
              aria-expanded={
                showNotifications
              }
            >


              <Bell
                size={18}
                color="#f8fafc"
              />


              <span
                style={styles.badge}
              />


            </button>


            {showNotifications && (

              <NotificationPanel
                onClose={() =>
                  setShowNotifications(
                    false
                  )
                }
              />

            )}


          </div>


          {/* =============================================
              PROFILE AVATAR
          ============================================= */}

          <button
            type="button"
            className="
              meghai-avatar-button
            "
            onClick={() =>
              setShowProfile(true)
            }
            style={styles.avatarButton}
            aria-label="Open profile"
            aria-expanded={showProfile}
          >


            <img
              className="
                meghai-avatar
              "
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80"
              alt="Avatar"
              style={styles.avatar}
            />


          </button>


        </div>


      </header>


      {/* =================================================
          PROFILE SECTION
      ================================================= */}

      <ProfileSection
        isOpen={showProfile}
        onClose={() =>
          setShowProfile(false)
        }
      />


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
     HEADER
  ===================================================== */

  header: {

    display:
      'flex',

    alignItems:
      'center',

    gap:
      '20px',

    padding:
      '12px 18px',

    background:
      'rgba(255, 255, 255, 0.055)',

    backdropFilter:
      'blur(18px)',

    WebkitBackdropFilter:
      'blur(18px)',

    border:
      '1px solid rgba(255, 255, 255, 0.10)',

    borderRadius:
      '16px',

    boxShadow:
      '0 8px 32px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.06)',

    marginBottom:
      '20px',

    position:
      'relative',

    overflow:
      'visible',

    minHeight:
      '64px',

    boxSizing:
      'border-box',

  },


  /* =====================================================
     LOCATION
  ===================================================== */

  locationContainer: {

    display:
      'flex',

    flexDirection:
      'column',

    gap:
      '3px',

    flexShrink:
      0,

    minWidth:
      '235px',

  },


  locationTitle: {

    display:
      'flex',

    alignItems:
      'center',

    gap:
      '8px',

    color:
      '#f8fafc',

    fontSize:
      '19px',

    fontWeight:
      600,

    letterSpacing:
      '-0.2px',

    whiteSpace:
      'nowrap',

  },


  dateText: {

    color:
      'rgba(203, 213, 225, 0.70)',

    fontSize:
      '12px',

    margin:
      '0 0 0 28px',

    letterSpacing:
      '0.1px',

    whiteSpace:
      'nowrap',

  },


  /* =====================================================
     SEARCH SECTION
  ===================================================== */

  searchSection: {

    flex:
      1,

    display:
      'flex',

    justifyContent:
      'center',

    alignItems:
      'center',

    minWidth:
      0,

  },


  /* =====================================================
     RIGHT SECTION
  ===================================================== */

  rightSection: {

    display:
      'flex',

    alignItems:
      'center',

    gap:
      '12px',

    flexShrink:
      0,

  },


  /* =====================================================
     LOCATION BADGE
  ===================================================== */

  updateBadge: {

    display:
      'flex',

    alignItems:
      'center',

    gap:
      '7px',

    background:
      'rgba(16, 185, 129, 0.08)',

    border:
      '1px solid rgba(16, 185, 129, 0.16)',

    padding:
      '6px 11px',

    borderRadius:
      '20px',

    fontSize:
      '11px',

    color:
      'rgba(226, 232, 240, 0.78)',

    backdropFilter:
      'blur(10px)',

    WebkitBackdropFilter:
      'blur(10px)',

    whiteSpace:
      'nowrap',

  },


  /* =====================================================
     LOCATION LOADING BADGE
  ===================================================== */

  updateBadgeLoading: {

    display:
      'flex',

    alignItems:
      'center',

    gap:
      '7px',

    background:
      'rgba(56, 189, 248, 0.08)',

    border:
      '1px solid rgba(56, 189, 248, 0.16)',

    padding:
      '6px 11px',

    borderRadius:
      '20px',

    fontSize:
      '11px',

    color:
      'rgba(226, 232, 240, 0.78)',

    backdropFilter:
      'blur(10px)',

    WebkitBackdropFilter:
      'blur(10px)',

    whiteSpace:
      'nowrap',

  },


  /* =====================================================
     GREEN STATUS DOT
  ===================================================== */

  greenDot: {

    width:
      '6px',

    height:
      '6px',

    backgroundColor:
      '#10b981',

    borderRadius:
      '50%',

    boxShadow:
      '0 0 8px rgba(16, 185, 129, 0.8)',

  },


  /* =====================================================
     NOTIFICATION
  ===================================================== */

  notificationWrapper: {

    position:
      'relative',

  },


  iconBtn: {

    position:
      'relative',

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

    padding:
      0,

    background:
      'rgba(255, 255, 255, 0.055)',

    border:
      '1px solid rgba(255, 255, 255, 0.09)',

    borderRadius:
      '50%',

    cursor:
      'pointer',

    backdropFilter:
      'blur(12px)',

    WebkitBackdropFilter:
      'blur(12px)',

    boxShadow:
      'inset 0 1px 0 rgba(255, 255, 255, 0.08)',

    transition:
      'all 0.2s ease',

  },


  iconBtnActive: {

    background:
      'rgba(56, 189, 248, 0.14)',

    border:
      '1px solid rgba(56, 189, 248, 0.30)',

    boxShadow:
      '0 0 16px rgba(56, 189, 248, 0.12)',

  },


  /* =====================================================
     NOTIFICATION BADGE
  ===================================================== */

  badge: {

    position:
      'absolute',

    top:
      '5px',

    right:
      '5px',

    width:
      '6px',

    height:
      '6px',

    backgroundColor:
      '#ef4444',

    border:
      '1.5px solid rgba(8, 45, 84, 0.9)',

    borderRadius:
      '50%',

    boxShadow:
      '0 0 6px rgba(239, 68, 68, 0.65)',

  },


  /* =====================================================
     PROFILE AVATAR BUTTON
  ===================================================== */

  avatarButton: {

    display:
      'flex',

    alignItems:
      'center',

    justifyContent:
      'center',

    width:
      '38px',

    height:
      '38px',

    padding:
      '0',

    background:
      'transparent',

    border:
      'none',

    borderRadius:
      '50%',

    cursor:
      'pointer',

    transition:
      'transform 0.2s ease',

  },


  /* =====================================================
     AVATAR
  ===================================================== */

  avatar: {

    width:
      '34px',

    height:
      '34px',

    borderRadius:
      '50%',

    objectFit:
      'cover',

    border:
      '1px solid rgba(255, 255, 255, 0.18)',

    boxShadow:
      '0 4px 12px rgba(0, 0, 0, 0.20)',

    transition:
      'all 0.2s ease',

  },

};
