import React, {
  useCallback,
  useState,
} from 'react';

import { Sidebar } from '../../components/dashboard/Sidebar';
import { Header } from '../../components/dashboard/Header';
import { WeatherMap } from '../../components/weather_maps/WeatherMap';


interface UserLocation {
  latitude: number;
  longitude: number;
}


export const WeatherMapPage: React.FC = () => {


  /* =====================================================
     WEATHER LAYER
  ===================================================== */

  const [
    activeLayer,
    setActiveLayer,
  ] = useState<string>(
    'pressure'
  );


  /* =====================================================
     USER LOCATION
  ===================================================== */

  const [
    userLocation,
    setUserLocation,
  ] = useState<UserLocation | null>(
    null
  );


  /* =====================================================
     LOCATION CALLBACK
  ===================================================== */

  const handleLocationDetected =
    useCallback(

      (
        latitude: number,
        longitude: number
      ) => {

        setUserLocation({
          latitude,
          longitude,
        });

      },

      []

    );


  /* =====================================================
     RENDER
  ===================================================== */

  return (

    <div
      style={styles.wrapper}
    >


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar />


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div
        style={styles.content}
      >


        {/* =============================================
            HEADER
        ============================================== */}

        <div
          style={styles.headerWrapper}
        >

          <Header
            onLocationDetected={
              handleLocationDetected
            }
          />

        </div>


        {/* =============================================
            WEATHER MAP AREA
        ============================================== */}

        <main
          style={styles.mainContent}
        >

          <div
            style={styles.weatherMapSection}
          >

            <WeatherMap
              activeLayer={
                activeLayer
              }
              setActiveLayer={
                setActiveLayer
              }
              userLocation={
                userLocation
              }
            />

          </div>

        </main>


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
     PAGE WRAPPER
  ===================================================== */

  wrapper: {

    display:
      'flex',

    width:
      '100%',

    height:
      '100dvh',

    minHeight:
      0,

    overflow:
      'hidden',

    background:
      'linear-gradient(135deg, #092242 0%, #082d54 30%, #0d4b75 65%, #004d64 100%)',

    color:
      '#ffffff',

  },


  /* =====================================================
     MAIN CONTENT
  ===================================================== */

  content: {

    flex:
      1,

    minWidth:
      0,

    minHeight:
      0,

    height:
      '100dvh',

    padding:
      '0 32px 20px',

    position:
      'relative',

    boxSizing:
      'border-box',

    display:
      'flex',

    flexDirection:
      'column',

    overflow:
      'hidden',

  },


  /* =====================================================
     HEADER
  ===================================================== */

  headerWrapper: {

    flexShrink:
      0,

    padding:
      '12px 0 18px',

    zIndex:
      5000,

  },


  /* =====================================================
     MAIN AREA
  ===================================================== */

  mainContent: {

    flex:
      1,

    width:
      '100%',

    minWidth:
      0,

    minHeight:
      0,

    display:
      'flex',

    flexDirection:
      'column',

    overflow:
      'hidden',

  },


  /* =====================================================
     WEATHER MAP SECTION
  ===================================================== */

  weatherMapSection: {

    flex:
      1,

    width:
      '100%',

    minWidth:
      0,

    minHeight:
      0,

    height:
      '100%',

    display:
      'flex',

    position:
      'relative',

    overflow:
      'hidden',

    borderRadius:
      '24px',

    boxSizing:
      'border-box',

  },


};