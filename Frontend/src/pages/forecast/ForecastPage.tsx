import React from 'react';

import { Sidebar } from '../../components/dashboard/Sidebar';
import { Header } from '../../components/dashboard/Header';
import { CurrentWeatherCard } from '../../components/dashboard/CurrentWeatherCard';

import { HourlyForecast } from '../../components/dashboard/HourlyForecast';
import { SevenDayForecast } from '../../components/forecast/SevenDayForecast';

import { HumidityCard } from '../../components/forecast/HumidityCard';

import { FeelsLikeCard } from '../../components/forecast/FeelsLikeCard';
import { WindCard } from '../../components/forecast/WindCard';
import { PrecipitationCard } from '../../components/forecast/PrecipitationCard';
import { UVIndexCard } from '../../components/forecast/UVIndexCard';
import { AirQualityCard } from '../../components/forecast/AirQualityCard';

import { CloudCoverCard } from '../../components/forecast/CloudCoverCard';
import { PressureCard } from '../../components/forecast/PressureCard';
import { VisibilityCard } from '../../components/forecast/VisibilityCard';

import { SunCard } from '../../components/forecast/SunCard';
import { MoonCard } from '../../components/forecast/MoonCard';
import { MoonPhaseCard } from '../../components/forecast/MoonPhaseCard';


export const ForecastPage: React.FC = () => {
  return (
    <div style={styles.wrapper}>

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Sidebar />


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div style={styles.content}>

        {/* =================================================
            STICKY HEADER
        ================================================= */}

        <div style={styles.headerWrapper}>
          <Header />
        </div>


        {/* =================================================
            FORECAST CONTENT
        ================================================= */}

        <main style={styles.mainContent}>


          {/* =================================================
              CURRENT WEATHER
          ================================================= */}

          <div style={styles.currentWeatherWrapper}>

            <CurrentWeatherCard />

          </div>


          {/* =================================================
              HUMIDITY
          ================================================= */}

          <div style={styles.humiditySection}>

            <HumidityCard />

          </div>


          {/* =================================================
              FIRST WEATHER DETAILS ROW

              FEELS LIKE | WIND | PRECIPITATION
          ================================================= */}

          <div style={styles.weatherDetailsGrid}>

            {/* ================= FEELS LIKE ================= */}

            <div style={styles.cardWrapper}>
              <FeelsLikeCard />
            </div>


            {/* ================= WIND ================= */}

            <div style={styles.cardWrapper}>
              <WindCard />
            </div>


            {/* ================= PRECIPITATION ================= */}

            <div style={styles.cardWrapper}>
              <PrecipitationCard />
            </div>

          </div>


          {/* =================================================
              SECOND WEATHER DETAILS ROW

              UV INDEX | AIR QUALITY
          ================================================= */}

          <div style={styles.secondaryWeatherGrid}>

            {/* ================= UV INDEX ================= */}

            <div style={styles.cardWrapper}>
              <UVIndexCard />
            </div>


            {/* ================= AIR QUALITY ================= */}

            <div style={styles.cardWrapper}>
              <AirQualityCard />
            </div>

          </div>


          {/* =================================================
              HOURLY FORECAST
          ================================================= */}

          <div style={styles.hourlyForecastSection}>

            <HourlyForecast />

          </div>


          {/* =================================================
              7 DAY FORECAST
          ================================================= */}

          <div style={styles.sevenDayForecastSection}>

            <SevenDayForecast />

          </div>


          {/* =================================================
              ATMOSPHERIC DETAILS

              CLOUD COVER | PRESSURE | VISIBILITY
          ================================================= */}

          <div style={styles.atmosphericDetailsGrid}>

            {/* ================= CLOUD COVER ================= */}

            <div style={styles.cardWrapper}>
              <CloudCoverCard />
            </div>


            {/* ================= PRESSURE ================= */}

            <div style={styles.cardWrapper}>
              <PressureCard />
            </div>


            {/* ================= VISIBILITY ================= */}

            <div style={styles.cardWrapper}>
              <VisibilityCard />
            </div>

          </div>


          {/* =================================================
              SUN & MOON

              SUN | MOON | MOON PHASE
          ================================================= */}

          <div style={styles.sunMoonSection}>

            {/* ================= SUN ================= */}

            <div style={styles.cardWrapper}>
              <SunCard />
            </div>


            {/* ================= MOON ================= */}

            <div style={styles.cardWrapper}>
              <MoonCard />
            </div>


            {/* ================= MOON PHASE ================= */}

            <div style={styles.cardWrapper}>
              <MoonPhaseCard />
            </div>

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
     MAIN PAGE
  ===================================================== */

  wrapper: {
    display: 'flex',

    width: '100%',

    height: '100vh',

    overflow: 'hidden',

    background:
      'linear-gradient(135deg, #092242 0%, #082d54 30%, #0d4b75 65%, #004d64 100%)',

    color: '#ffffff',
  },


  /* =====================================================
     MAIN CONTENT
  ===================================================== */

  content: {
    flex: 1,

    minWidth: 0,

    height: '100vh',

    padding:
      '0 32px 24px',

    position: 'relative',

    overflowY: 'auto',

    overflowX: 'hidden',

    boxSizing: 'border-box',
  },


  /* =====================================================
     STICKY HEADER
  ===================================================== */

  headerWrapper: {
    position: 'sticky',

    top: 0,

    zIndex: 1000,

    padding:
      '12px 0',
  },


  /* =====================================================
     MAIN FORECAST CONTENT
  ===================================================== */

  mainContent: {
    width: '100%',

    minHeight:
      'calc(100vh - 90px)',

    paddingBottom:
      '30px',

    boxSizing: 'border-box',
  },


  /* =====================================================
     CURRENT WEATHER
  ===================================================== */

  currentWeatherWrapper: {
    width: '100%',

    height: '170px',

    overflow: 'hidden',

    borderRadius:
      '24px',

    marginBottom:
      '20px',
  },


  /* =====================================================
     HUMIDITY
  ===================================================== */

  humiditySection: {
    width: '100%',

    marginBottom:
      '20px',

    minWidth: 0,
  },


  /* =====================================================
     FIRST WEATHER DETAILS GRID

     ┌──────────────┬──────────────┬──────────────┐
     │ FEELS LIKE   │    WIND      │ PRECIPITATION│
     └──────────────┴──────────────┴──────────────┘
  ===================================================== */

  weatherDetailsGrid: {
    display: 'grid',

    gridTemplateColumns:
      '1fr 1fr 1fr',

    gap:
      '20px',

    width:
      '100%',

    alignItems:
      'stretch',
  },


  /* =====================================================
     SECOND WEATHER DETAILS GRID

     ┌──────────────────────┬──────────────────────┐
     │      UV INDEX        │     AIR QUALITY      │
     └──────────────────────┴──────────────────────┘
  ===================================================== */

  secondaryWeatherGrid: {
    display: 'grid',

    gridTemplateColumns:
      '1fr 1fr',

    gap:
      '20px',

    width:
      '100%',

    marginTop:
      '20px',

    alignItems:
      'stretch',
  },


  /* =====================================================
     INDIVIDUAL CARD WRAPPER
  ===================================================== */

  cardWrapper: {
    width:
      '100%',

    minWidth:
      0,

    height:
      '100%',

    boxSizing:
      'border-box',

    display:
      'flex',
  },


  /* =====================================================
     HOURLY FORECAST
  ===================================================== */

  hourlyForecastSection: {
    width:
      '100%',

    marginTop:
      '20px',

    minWidth:
      0,
  },


  /* =====================================================
     7 DAY FORECAST
  ===================================================== */

  sevenDayForecastSection: {
    width:
      '100%',

    marginTop:
      '20px',

    minWidth:
      0,
  },


  /* =====================================================
     ATMOSPHERIC DETAILS

     ┌──────────────┬──────────────┬──────────────┐
     │ CLOUD COVER  │   PRESSURE   │  VISIBILITY  │
     └──────────────┴──────────────┴──────────────┘
  ===================================================== */

  atmosphericDetailsGrid: {
    display: 'grid',

    gridTemplateColumns:
      '1fr 1fr 1fr',

    gap:
      '20px',

    width:
      '100%',

    marginTop:
      '20px',

    alignItems:
      'stretch',
  },


  /* =====================================================
     SUN & MOON SECTION

     ┌──────────────┬──────────────┬──────────────┐
     │     SUN      │     MOON     │  MOON PHASE  │
     └──────────────┴──────────────┴──────────────┘
  ===================================================== */

  sunMoonSection: {
    display: 'grid',

    gridTemplateColumns:
      '1fr 1fr 1fr',

    gap:
      '20px',

    width:
      '100%',

    marginTop:
      '20px',

    alignItems:
      'stretch',
  },

};