import React from 'react';

import { Sidebar } from '../../components/dashboard/Sidebar';
import { Header } from '../../components/dashboard/Header';

export const SavedLocationPage: React.FC = () => {
  return (
    <>
      {/* =====================================================
          RESPONSIVE CSS
          ===================================================== */}

      <style>{`

        /* =====================================================
           DESKTOP
           ===================================================== */

        .saved-location-wrapper {
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

        .saved-location-content {
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

        .saved-location-header {
          position: sticky;

          top: 0;

          z-index: 1000;

          width: 100%;

          padding: 12px 0;
        }


        /* =====================================================
           BLANK CONTENT
           ===================================================== */

        .saved-location-blank {
          width: 100%;

          min-height: calc(100vh - 100px);
        }


        /* =====================================================
           TABLET
           768px - 1023px
           ===================================================== */

        @media (max-width: 1023px) {

          .saved-location-wrapper > :first-child {
            display: none !important;
          }


          .saved-location-content {
            width: 100%;

            flex: 1 1 100%;

            padding:
              0
              20px
              30px;
          }


          .saved-location-header {
            padding: 10px 0;
          }

        }


        /* =====================================================
           MOBILE
           BELOW 768px
           ===================================================== */

        @media (max-width: 767px) {

          .saved-location-wrapper > :first-child {
            display: none !important;

            width: 0 !important;
            min-width: 0 !important;
            max-width: 0 !important;
          }


          .saved-location-content {
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


          .saved-location-header {
            width: 100%;

            padding: 8px 0;

            overflow: visible;
          }


          .saved-location-blank {
            width: 100%;

            min-height: calc(100vh - 80px);
          }

        }


        /* =====================================================
           SMALL MOBILE
           BELOW 480px
           ===================================================== */

        @media (max-width: 479px) {

          .saved-location-content {
            padding-left: 8px;
            padding-right: 8px;
            padding-bottom: 16px;
          }


          .saved-location-header {
            padding: 6px 0;
          }

        }


        /* =====================================================
           VERY SMALL PHONE
           BELOW 360px
           ===================================================== */

        @media (max-width: 359px) {

          .saved-location-content {
            padding-left: 6px;
            padding-right: 6px;
          }

        }

      `}</style>


      {/* =====================================================
          SAVED LOCATION PAGE
          ===================================================== */}

      <div className="saved-location-wrapper">


        {/* ===================================================
            SIDEBAR
            =================================================== */}

        <Sidebar />


        {/* ===================================================
            MAIN CONTENT
            =================================================== */}

        <div className="saved-location-content">


          {/* =================================================
              HEADER
              ================================================= */}

          <div className="saved-location-header">
            <Header />
          </div>


          {/* =================================================
              BLANK PAGE CONTENT
              ================================================= */}

          <main className="saved-location-blank">
            {/*
              Saved Location content will be added here later.
            */}
          </main>


        </div>

      </div>
    </>
  );
};

export default SavedLocationPage;