import React from 'react';

import {
  Sidebar,
} from '../../components/dashboard/Sidebar';

import {
  Header,
} from '../../components/dashboard/Header';

import {
  AiChatInterface,
} from '../../components/ai_chat/AiChatInterface';


/* =========================================================
   COMPONENT
   ========================================================= */

export const AiChatPage: React.FC = () => {

  return (

    <>

      {/* =====================================================
          RESPONSIVE CSS
          ===================================================== */}

      <style>{`

        /* ===================================================
           GLOBAL PAGE FIX
           =================================================== */

        .ai-chat-wrapper,
        .ai-chat-wrapper * {

          box-sizing:
            border-box;

        }


        /* ===================================================
           DESKTOP
           =================================================== */

        .ai-chat-wrapper {

          display:
            flex;

          width:
            100%;

          height:
            100vh;

          min-height:
            0;

          overflow:
            hidden;

          background:
            linear-gradient(
              135deg,
              #092242 0%,
              #082d54 30%,
              #0d4b75 65%,
              #004d64 100%
            );

          color:
            #ffffff;

        }


        /* ===================================================
           MAIN CONTENT
           =================================================== */

        .ai-chat-content {

          flex:
            1 1 auto;

          min-width:
            0;

          min-height:
            0;

          height:
            100vh;

          padding:
            0
            32px
            32px;

          overflow:
            hidden;

          display:
            flex;

          flex-direction:
            column;

        }


        /* ===================================================
           HEADER
           =================================================== */

        .ai-chat-header {

          flex:
            0 0 auto;

          position:
            relative;

          z-index:
            1000;

          width:
            100%;

          padding:
            12px
            0;

        }


        /* ===================================================
           CHAT AREA
           =================================================== */

        .ai-chat-main {

          flex:
            1 1 0;

          min-height:
            0;

          width:
            100%;

          overflow:
            hidden;

          display:
            flex;

        }


        .ai-chat-main
        > * {

          flex:
            1;

          min-width:
            0;

          min-height:
            0;

        }


        /* ===================================================
           TABLET
           768px - 1023px
           =================================================== */

        @media (
          max-width:
          1023px
        ) {

          .ai-chat-wrapper
          >
          :first-child {

            display:
              none !important;

          }


          .ai-chat-content {

            width:
              100%;

            height:
              100vh;

            padding:
              0
              20px
              24px;

          }


          .ai-chat-header {

            padding:
              10px
              0;

          }

        }


        /* ===================================================
           MOBILE
           BELOW 768px
           =================================================== */

        @media (
          max-width:
          767px
        ) {

          .ai-chat-wrapper {

            height:
              100dvh;

          }


          .ai-chat-wrapper
          >
          :first-child {

            display:
              none !important;

            width:
              0 !important;

            min-width:
              0 !important;

            max-width:
              0 !important;

          }


          .ai-chat-content {

            width:
              100% !important;

            min-width:
              0 !important;

            flex:
              1 1 100%;

            height:
              100dvh;

            padding:
              0
              12px
              12px;

          }


          .ai-chat-header {

            width:
              100%;

            padding:
              8px
              0;

            overflow:
              visible;

          }


          .ai-chat-main {

            width:
              100%;

            min-width:
              0;

            min-height:
              0;

          }

        }


        /* ===================================================
           SMALL MOBILE
           BELOW 480px
           =================================================== */

        @media (
          max-width:
          479px
        ) {

          .ai-chat-content {

            padding-left:
              8px;

            padding-right:
              8px;

            padding-bottom:
              8px;

          }


          .ai-chat-header {

            padding:
              6px
              0;

          }

        }


        /* ===================================================
           VERY SMALL PHONE
           BELOW 360px
           =================================================== */

        @media (
          max-width:
          359px
        ) {

          .ai-chat-content {

            padding-left:
              6px;

            padding-right:
              6px;

          }

        }

      `}</style>


      {/* =====================================================
          AI CHAT PAGE
          ===================================================== */}

      <div
        className="ai-chat-wrapper"
      >


        {/* ===================================================
            SIDEBAR
            =================================================== */}

        <Sidebar />


        {/* ===================================================
            MAIN CONTENT
            =================================================== */}

        <div
          className="ai-chat-content"
        >


          {/* =================================================
              HEADER
              ================================================= */}

          <div
            className="ai-chat-header"
          >

            <Header />

          </div>


          {/* =================================================
              AI CHAT
              ================================================= */}

          <main
            className="ai-chat-main"
          >

            <AiChatInterface />

          </main>


        </div>


      </div>


    </>

  );

};


export default AiChatPage;