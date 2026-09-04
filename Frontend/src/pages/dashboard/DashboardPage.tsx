import React, {
  useState,
} from 'react';



import { Sidebar } from '../../components/dashboard/Sidebar';
import { Header } from '../../components/dashboard/Header';
import { CurrentWeatherCard } from '../../components/dashboard/CurrentWeatherCard';
import { HourlyForecast } from '../../components/dashboard/HourlyForecast';

import {
  AiChatPanel,
} from '../../components/ai_chat/AiChatPanel';

import { AirQualityCard } from '../../components/dashboard/AirQualityCard';
import { SevenDayForecast } from '../../components/dashboard/SevenDayForecast';
import { WeatherAlertCard } from '../../components/dashboard/WeatherAlertCard';
import { WeatherMapCard } from '../../components/dashboard/WeatherMapCard';
import { AIWeatherInsights } from '../../components/dashboard/AIWeatherInsights';
import { SectoralAdvisory } from '../../components/dashboard/SectoralAdvisory';
import { DisasterMonitoring } from '../../components/dashboard/DisasterMonitoring';

import {
  Sparkles,
} from 'lucide-react';

import {
  VoiceMode,
} from '../../components/voice/VoiceMode';


/* =========================================================
   COMPONENT
========================================================= */

export const DashboardPage: React.FC = () => {


  /* =======================================================
     ROUTER
  ======================================================= */

  


  /* =======================================================
     VOICE MODE
  ======================================================= */

  const [
    isVoiceModeOpen,
    setIsVoiceModeOpen,
  ] = useState(false);


  return (

    <>

      {/* =====================================================
          RESPONSIVE CSS
      ===================================================== */}

      <style>{`

        /* =====================================================
           GLOBAL SAFETY
        ===================================================== */

        .dashboard-wrapper,
        .dashboard-wrapper *,
        .dashboard-wrapper *::before,
        .dashboard-wrapper *::after {
          box-sizing: border-box;
        }


        /* =====================================================
           MAIN DASHBOARD WRAPPER
        ===================================================== */

        .dashboard-wrapper {
          display: flex;

          width: 100%;

          height: 100vh;
          height: 100dvh;

          overflow: hidden;

          background:
            linear-gradient(
              135deg,
              #092242 0%,
              #082d54 30%,
              #0d4b75 65%,
              #004d64 100%
            );

          color: #ffffff;
        }


        /* =====================================================
           MAIN CONTENT
        ===================================================== */

        .dashboard-content {
          flex: 1;

          min-width: 0;
          min-height: 0;

          height: 100vh;
          height: 100dvh;

          padding:
            0
            32px
            32px;

          overflow-y: auto;
          overflow-x: hidden;

          -webkit-overflow-scrolling: touch;

          overscroll-behavior-x: none;
        }


        /* =====================================================
           STICKY HEADER
        ===================================================== */

        .dashboard-header {
          position: sticky;

          top: 0;

          width: 100%;

          z-index: 1000;

          padding:
            12px
            0;

          isolation: isolate;
        }


        /* =====================================================
           TOP GRID
        ===================================================== */

        .dashboard-top-grid {
          display: grid;

          grid-template-columns:
            minmax(0, 1.55fr)
            minmax(0, 1fr);

          gap: 20px;

          align-items: stretch;

          width: 100%;

          min-width: 0;
        }


        /* =====================================================
           LEFT COLUMN
        ===================================================== */

        .dashboard-left-column {
          display: flex;

          flex-direction: column;

          gap: 20px;

          min-width: 0;
        }


        /* =====================================================
           RIGHT COLUMN
        ===================================================== */

        .dashboard-right-column {
          display: flex;

          flex-direction: column;

          min-width: 0;
          min-height: 0;

          align-self: stretch;
        }


        /* =====================================================
           AI CHAT
        ===================================================== */

        .dashboard-chat-wrapper {
          display: flex;

          width: 100%;

          flex: 1;

          min-width: 0;
          min-height: 0;

          overflow: hidden;
        }


        .dashboard-chat-wrapper > * {
          width: 100%;

          height: 100%;

          flex: 1;

          min-width: 0;
          min-height: 0;
        }


        /* =====================================================
           WEATHER SUMMARY
        ===================================================== */

        .dashboard-summary-row {
          display: grid;

          grid-template-columns:
            minmax(0, 0.65fr)
            minmax(0, 1.70fr)
            minmax(0, 0.65fr);

          gap: 20px;

          margin-top: 20px;

          align-items: start;

          width: 100%;

          min-width: 0;
        }


        .dashboard-card-wrapper {
          width: 100%;

          min-width: 0;
        }


        /* =====================================================
           DESKTOP CARD HEIGHTS
        ===================================================== */

        .dashboard-aqi-card > *,
        .dashboard-alert-card > * {
          height: 325px;
        }


        /* =====================================================
           WEATHER MAP
        ===================================================== */

        .dashboard-map {
          width: 100%;

          min-width: 0;

          margin-top: 20px;
        }


        /* =====================================================
           AI INSIGHTS
        ===================================================== */

        .dashboard-insights-row {
          display: grid;

          grid-template-columns:
            minmax(0, 1fr)
            minmax(0, 1fr)
            minmax(0, 1fr);

          gap: 20px;

          margin-top: 20px;

          padding-bottom: 40px;

          width: 100%;

          min-width: 0;
        }


        /* =====================================================
           FLOATING ASK MEGHAI BUTTON
        ===================================================== */

        .dashboard-floating-btn {
          position: fixed;

          right: 24px;

          bottom: 24px;

          z-index: 1100;

          display: flex;

          align-items: center;
          justify-content: center;

          gap: 8px;

          padding:
            10px
            18px;

          border: none;

          border-radius: 25px;

          background:
            linear-gradient(
              135deg,
              #0284c7 0%,
              #0369a1 100%
            );

          color: #ffffff;

          font-size: 13px;

          font-weight: 600;

          cursor: pointer;

          box-shadow:
            0 4px 20px
            rgba(2, 132, 199, 0.4);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }


        .dashboard-floating-btn:hover {
          transform: translateY(-2px);

          box-shadow:
            0 8px 24px
            rgba(2, 132, 199, 0.55);
        }


        /* =====================================================
           TABLET
           768px - 1023px
        ===================================================== */

        @media (max-width: 1023px) {


          /* =================================================
             SIDEBAR
          ================================================= */

          .dashboard-wrapper > :first-child {
            display: none !important;
          }


          /* =================================================
             MAIN CONTENT
          ================================================= */

          .dashboard-content {
            width: 100%;

            flex: 1 1 100%;

            padding:
              0
              20px
              100px;
          }


          /* =================================================
             HEADER
          ================================================= */

          .dashboard-header {
            padding:
              10px
              0;
          }


          /* =================================================
             TOP GRID
          ================================================= */

          .dashboard-top-grid {
            grid-template-columns:
              minmax(0, 1fr);

            gap: 20px;
          }


          /* =================================================
             RIGHT COLUMN
          ================================================= */

          .dashboard-right-column {
            display: block;

            width: 100%;
          }


          /* =================================================
             CHAT
          ================================================= */

          .dashboard-chat-wrapper {
            width: 100%;

            height:
              clamp(
                400px,
                55vh,
                520px
              );

            min-height: 400px;

            max-height: 520px;
          }


          /* =================================================
             SUMMARY
          ================================================= */

          .dashboard-summary-row {
            grid-template-columns:
              minmax(0, 1fr)
              minmax(0, 1fr);

            gap: 20px;
          }


          .dashboard-summary-row
          .dashboard-forecast {
            grid-column: 1 / -1;
          }


          /* =================================================
             INSIGHTS
          ================================================= */

          .dashboard-insights-row {
            grid-template-columns:
              minmax(0, 1fr)
              minmax(0, 1fr);

            gap: 20px;
          }

        }


        /* =====================================================
           MOBILE
           BELOW 768px
        ===================================================== */

        @media (max-width: 767px) {


          /* =================================================
             WRAPPER
          ================================================= */

          .dashboard-wrapper {
            display: block;

            width: 100%;

            height: 100dvh;
            min-height: 100dvh;

            overflow: hidden;
          }


          /* =================================================
             SIDEBAR
          ================================================= */

          .dashboard-wrapper > :first-child {
            display: none !important;

            width: 0 !important;

            min-width: 0 !important;

            max-width: 0 !important;
          }


          /* =================================================
             MAIN CONTENT
          ================================================= */

          .dashboard-content {
            display: block;

            width: 100% !important;

            min-width: 0 !important;

            max-width: 100%;

            height: 100dvh;
            min-height: 100dvh;

            padding:
              0
              14px
              calc(
                90px +
                env(
                  safe-area-inset-bottom,
                  0px
                )
              );

            overflow-x: hidden;
            overflow-y: auto;

            -webkit-overflow-scrolling: touch;

            overscroll-behavior-x: none;
          }


          /* =================================================
             STICKY HEADER
          ================================================= */

          .dashboard-header {
            position: sticky;

            top: 0;

            width: 100%;

            z-index: 1000;

            padding:
              8px
              0;

            isolation: isolate;
          }


          /* =================================================
             TOP GRID
          ================================================= */

          .dashboard-top-grid {
            width: 100%;

            max-width: 100%;

            grid-template-columns:
              minmax(0, 1fr);

            gap: 16px;
          }


          /* =================================================
             COLUMNS
          ================================================= */

          .dashboard-left-column,
          .dashboard-right-column {
            width: 100% !important;

            min-width: 0 !important;

            max-width: 100%;
          }


          .dashboard-left-column {
            gap: 16px;
          }


          .dashboard-right-column {
            display: block;
          }


          /* =================================================
             AI CHAT
          ================================================= */

          .dashboard-chat-wrapper {
            display: flex;

            width: 100% !important;

            height:
              clamp(
                400px,
                62vh,
                500px
              );

            min-height: 400px;

            max-height: 500px;

            overflow: hidden;
          }


          .dashboard-chat-wrapper > * {
            width: 100%;

            height: 100%;

            min-width: 0;

            min-height: 0;
          }


          /* =================================================
             SUMMARY
          ================================================= */

          .dashboard-summary-row {
            width: 100%;

            max-width: 100%;

            grid-template-columns:
              minmax(0, 1fr);

            gap: 16px;

            margin-top: 16px;
          }


          .dashboard-summary-row
          .dashboard-forecast {
            grid-column: auto;
          }


          .dashboard-card-wrapper {
            width: 100% !important;

            min-width: 0 !important;

            max-width: 100%;
          }


          /* =================================================
             RESET DESKTOP CARD HEIGHTS
          ================================================= */

          .dashboard-aqi-card > *,
          .dashboard-alert-card > * {
            height: auto;

            min-height: 0;
          }


          /* =================================================
             WEATHER MAP
          ================================================= */

          .dashboard-map {
            width: 100%;

            max-width: 100%;

            margin-top: 16px;
          }


          /* =================================================
             INSIGHTS
          ================================================= */

          .dashboard-insights-row {
            width: 100%;

            max-width: 100%;

            grid-template-columns:
              minmax(0, 1fr);

            gap: 16px;

            margin-top: 16px;

            padding-bottom: 20px;
          }


          /* =================================================
             OVERFLOW PROTECTION
          ================================================= */

          .dashboard-top-grid,
          .dashboard-summary-row,
          .dashboard-insights-row,
          .dashboard-map,
          .dashboard-left-column,
          .dashboard-right-column {
            min-width: 0;

            overflow-x: hidden;
          }


          /* =================================================
             FLOATING BUTTON
          ================================================= */

          .dashboard-floating-btn {
            right: 16px;

            bottom:
              calc(
                16px +
                env(
                  safe-area-inset-bottom,
                  0px
                )
              );

            padding:
              10px
              16px;

            font-size: 12px;
          }

        }


        /* =====================================================
           SMALL MOBILE
           BELOW 480px
        ===================================================== */

        @media (max-width: 479px) {


          /* =================================================
             MAIN CONTENT
          ================================================= */

          .dashboard-content {
            padding-left: 10px;

            padding-right: 10px;

            padding-bottom:
              calc(
                82px +
                env(
                  safe-area-inset-bottom,
                  0px
                )
              );
          }


          /* =================================================
             HEADER
          ================================================= */

          .dashboard-header {
            padding:
              6px
              0;
          }


          /* =================================================
             SPACING
          ================================================= */

          .dashboard-top-grid {
            gap: 12px;
          }


          .dashboard-left-column {
            gap: 12px;
          }


          /* =================================================
             CHAT
          ================================================= */

          .dashboard-chat-wrapper {
            height:
              clamp(
                380px,
                58vh,
                440px
              );

            min-height: 380px;

            max-height: 440px;
          }


          /* =================================================
             SUMMARY
          ================================================= */

          .dashboard-summary-row {
            gap: 12px;

            margin-top: 12px;
          }


          /* =================================================
             MAP
          ================================================= */

          .dashboard-map {
            margin-top: 12px;
          }


          /* =================================================
             INSIGHTS
          ================================================= */

          .dashboard-insights-row {
            gap: 12px;

            margin-top: 12px;
          }


          /* =================================================
             COMPACT FLOATING BUTTON
          ================================================= */

          .dashboard-floating-btn {
            width: 48px;

            height: 48px;

            padding: 0;

            border-radius: 50%;

            gap: 0;

            right: 14px;

            bottom:
              calc(
                14px +
                env(
                  safe-area-inset-bottom,
                  0px
                )
              );
          }


          .dashboard-floating-btn span {
            display: none;
          }

        }


        /* =====================================================
           VERY SMALL PHONE
           BELOW 360px
        ===================================================== */

        @media (max-width: 359px) {


          .dashboard-content {
            padding-left: 8px;

            padding-right: 8px;
          }


          .dashboard-chat-wrapper {
            height: 360px;

            min-height: 360px;

            max-height: 400px;
          }


          .dashboard-floating-btn {
            width: 46px;

            height: 46px;

            right: 10px;
          }

        }


        /* =====================================================
           TOUCH DEVICE HOVER PROTECTION
        ===================================================== */

        @media (hover: none) {

          .dashboard-floating-btn:hover {
            transform: none;

            box-shadow:
              0 4px 20px
              rgba(2, 132, 199, 0.4);
          }

        }

      `}</style>


      {/* =====================================================
          MAIN DASHBOARD
      ===================================================== */}

      <div className="dashboard-wrapper">


        {/* ===================================================
            SIDEBAR
        =================================================== */}

        <Sidebar />


        {/* ===================================================
            MAIN CONTENT
        =================================================== */}

        <main className="dashboard-content">


          {/* =================================================
              STICKY HEADER
          ================================================= */}

          <div className="dashboard-header">

            <Header />

          </div>


          {/* =================================================
              TOP DASHBOARD
          ================================================= */}

          <div className="dashboard-top-grid">


            {/* ===============================================
                LEFT COLUMN
            =============================================== */}

            <div className="dashboard-left-column">

              <CurrentWeatherCard />

              <HourlyForecast />

            </div>


            {/* ===============================================
                RIGHT COLUMN
            =============================================== */}

            <div className="dashboard-right-column">

              <div className="dashboard-chat-wrapper">

                <AiChatPanel />

              </div>

            </div>

          </div>


          {/* =================================================
              WEATHER SUMMARY
          ================================================= */}

          <div className="dashboard-summary-row">


            {/* ===============================================
                AQI
            =============================================== */}

            <div
              className="
                dashboard-card-wrapper
                dashboard-aqi-card
              "
            >

              <AirQualityCard />

            </div>


            {/* ===============================================
                FORECAST
            =============================================== */}

            <div
              className="
                dashboard-card-wrapper
                dashboard-forecast
              "
            >

              <SevenDayForecast />

            </div>


            {/* ===============================================
                WEATHER ALERT
            =============================================== */}

            <div
              className="
                dashboard-card-wrapper
                dashboard-alert-card
              "
            >

              <WeatherAlertCard />

            </div>

          </div>


          {/* =================================================
              WEATHER MAP
          ================================================= */}

          <div className="dashboard-map">

            <WeatherMapCard />

          </div>


          {/* =================================================
              AI INSIGHTS
          ================================================= */}

          <div className="dashboard-insights-row">

            <AIWeatherInsights />

            <SectoralAdvisory />

            <DisasterMonitoring />

          </div>


          {/* =================================================
              FLOATING ASK MEGHAI
              NOW OPENS VOICE MODE
          ================================================= */}

          <button
            type="button"
            className="dashboard-floating-btn"
            aria-label="Open MeghAI Voice Mode"
            onClick={() =>
              setIsVoiceModeOpen(true)
            }
          >

            <Sparkles
              size={16}
              color="#ffffff"
            />

            <span>
              Ask MeghAI
            </span>

          </button>


        </main>


        {/* ===================================================
            VOICE MODE OVERLAY
        =================================================== */}

        {isVoiceModeOpen && (

          <VoiceMode
            onClose={() =>
              setIsVoiceModeOpen(false)
            }
          />

        )}


      </div>

    </>

  );

};
