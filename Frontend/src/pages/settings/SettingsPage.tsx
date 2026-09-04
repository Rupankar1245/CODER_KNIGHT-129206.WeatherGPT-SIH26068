import React from 'react';

import { Sidebar } from '../../components/dashboard/Sidebar';
import { Header } from '../../components/dashboard/Header';

export const SettingsPage: React.FC = () => {
  return (
    <>
      {/* =====================================================
          RESPONSIVE CSS
          ===================================================== */}

      <style>{`

        /* =====================================================
           DESKTOP
           ===================================================== */

        .settings-wrapper {
          display: flex;

          width: 100%;
          height: 100vh;

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

        .settings-content {
          flex: 1;

          min-width: 0;
          min-height: 0;

          width: 100%;
          height: 100vh;

          padding: 0 32px 32px;

          overflow-y: auto;
          overflow-x: hidden;
        }


        /* =====================================================
           STICKY HEADER
           ===================================================== */

        .settings-header {
          position: sticky;

          top: 0;

          z-index: 1000;

          width: 100%;

          padding: 12px 0;
        }


        /* =====================================================
           BLANK CONTENT
           ===================================================== */

        .settings-blank {
          width: 100%;

          min-height: calc(100vh - 100px);
        }


        /* =====================================================
           TABLET
           768px - 1023px
           ===================================================== */

        @media (max-width: 1023px) {

          .settings-wrapper > :first-child {
            display: none !important;
          }


          .settings-content {
            width: 100%;

            flex: 1 1 100%;

            padding:
              0
              20px
              30px;
          }


          .settings-header {
            padding: 10px 0;
          }

        }


        /* =====================================================
           MOBILE
           BELOW 768px
           ===================================================== */

        @media (max-width: 767px) {

          .settings-wrapper > :first-child {
            display: none !important;

            width: 0 !important;
            min-width: 0 !important;
            max-width: 0 !important;
          }


          .settings-content {
            display: block;

            width: 100% !important;

            min-width: 0 !important;

            flex: 1 1 100%;

            height: 100vh;

            padding:
              0
              12px
              20px;

            overflow-x: hidden;
            overflow-y: auto;
          }


          .settings-header {
            width: 100%;

            padding: 8px 0;

            overflow: visible;
          }


          .settings-blank {
            width: 100%;

            min-height: calc(100vh - 80px);
          }

        }


        /* =====================================================
           SMALL MOBILE
           BELOW 480px
           ===================================================== */

        @media (max-width: 479px) {

          .settings-content {
            padding-left: 8px;
            padding-right: 8px;
            padding-bottom: 16px;
          }


          .settings-header {
            padding: 6px 0;
          }

        }


        /* =====================================================
           VERY SMALL PHONE
           BELOW 360px
           ===================================================== */

        @media (max-width: 359px) {

          .settings-content {
            padding-left: 6px;
            padding-right: 6px;
          }

        }

      `}</style>


      {/* =====================================================
          SETTINGS PAGE
          ===================================================== */}

      <div className="settings-wrapper">


        {/* ===================================================
            SIDEBAR
            =================================================== */}

        <Sidebar />


        {/* ===================================================
            MAIN CONTENT
            =================================================== */}

        <div className="settings-content">


          {/* =================================================
              HEADER
              ================================================= */}

          <div className="settings-header">
            <Header />
          </div>


          {/* =================================================
              BLANK PAGE CONTENT
              ================================================= */}

          <main className="settings-blank">
            {/*
              Settings content will be added here later.
            */}
          </main>


        </div>

      </div>
    </>
  );
};

export default SettingsPage;