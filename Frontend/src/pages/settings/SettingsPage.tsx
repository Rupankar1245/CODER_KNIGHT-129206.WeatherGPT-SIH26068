import React from 'react';

import { Sidebar } from '../../components/dashboard/Sidebar';
import { Header } from '../../components/dashboard/Header';


// =====================================================
// TEAM MEMBERS
// =====================================================

const teamMembers = [
  {
    name: 'Rupankar Das',
    role: 'Team Leader & Backend Developer',
    image: '/meet_the_team/Rupankar.jpg',
    linkedin: 'https://www.linkedin.com/in/rupankardas123/',
  },
  {
    name: 'Amit Santra',
    role: 'Frontend Developer',
    image: '/meet_the_team/Amit.jpeg',
    linkedin: 'https://www.linkedin.com/in/amit-santra-966151369/',
  },
  {
    name: 'Aniket Sharma',
    role: 'Frontend Developer and Documentation',
    image: '/meet_the_team/Aniket.jpeg',
    linkedin: 'https://www.linkedin.com/in/aniket-sharma-345506434/',
  },
  {
    name: 'Uma Shankar Das',
    role: 'UI/UX Designer & Editor',
    image: '/meet_the_team/UmaShankar.jpeg',
    linkedin: 'https://www.linkedin.com/in/uma-shankar-das-b46238382/',
  },
  {
    name: 'Arghya Nath',
    role: 'Speaker & Prestation ',
    image: '/meet_the_team/Arghya.jpeg',
    linkedin: 'https://www.linkedin.com/in/arghya-nath-476503434?/',
  },
  {
    name: 'Sneha Das',
    role: 'Researcher',
    image: '/meet_the_team/Sneha.jpeg',
    linkedin: 'https://www.linkedin.com/in/snehaa-das-766776432/',
  },
];


// =====================================================
// SETTINGS / MEET THE TEAM PAGE
// =====================================================

export const SettingsPage: React.FC = () => {
  return (
    <>
      <style>{`

        /* =====================================================
           MAIN WRAPPER
           ===================================================== */

        .settings-wrapper {
          display: flex;

          width: 100%;
          height: 100vh;

          overflow: hidden;

          background:
            radial-gradient(
              circle at 15% 15%,
              rgba(0, 190, 255, 0.14),
              transparent 32%
            ),
            radial-gradient(
              circle at 85% 80%,
              rgba(0, 255, 210, 0.10),
              transparent 35%
            ),
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

          box-sizing: border-box;
        }


        /* =====================================================
           HEADER
           ===================================================== */

        .settings-header {
          position: sticky;

          top: 0;

          z-index: 1000;

          width: 100%;

          padding: 12px 0;

          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }


        /* =====================================================
           PAGE CONTENT
           ===================================================== */

        .team-page {
          width: 100%;

          max-width: 1250px;

          margin: 0 auto;

          padding: 30px 0 50px;
        }


        /* =====================================================
           PAGE INTRO
           ===================================================== */

        .team-heading {
          text-align: center;

          margin-bottom: 38px;
        }


        .team-heading h1 {
          margin: 0;

          font-size: 34px;

          font-weight: 700;

          letter-spacing: -0.5px;

          color: #ffffff;

          text-shadow:
            0 4px 20px rgba(0, 0, 0, 0.25);
        }


        .team-heading h1 span {
          background:
            linear-gradient(
              90deg,
              #ffffff,
              #8deaff,
              #ffffff
            );

          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;

          background-clip: text;
        }


        .team-heading p {
          margin: 10px auto 0;

          max-width: 650px;

          font-size: 15px;

          line-height: 1.6;

          color: rgba(255, 255, 255, 0.68);
        }


        /* =====================================================
           TEAM GRID
           ===================================================== */

        .team-grid {
          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 24px;
        }


        /* =====================================================
           TEAM CARD
           ===================================================== */

        .team-card {
          position: relative;

          overflow: hidden;

          min-height: 365px;

          border-radius: 24px;

          padding: 26px 22px;

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;

          text-align: center;

          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.13),
              rgba(255, 255, 255, 0.055)
            );

          border: 1px solid
            rgba(255, 255, 255, 0.14);

          box-shadow:
            0 18px 45px
            rgba(0, 0, 0, 0.20),

            inset 0 1px 0
            rgba(255, 255, 255, 0.10);

          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);

          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease,
            border-color 0.3s ease;
        }


        .team-card::before {
          content: '';

          position: absolute;

          width: 180px;
          height: 180px;

          top: -90px;
          right: -70px;

          border-radius: 50%;

          background:
            rgba(77, 221, 255, 0.12);

          filter: blur(10px);

          pointer-events: none;
        }


        .team-card::after {
          content: '';

          position: absolute;

          width: 150px;
          height: 150px;

          bottom: -90px;
          left: -70px;

          border-radius: 50%;

          background:
            rgba(0, 255, 210, 0.08);

          filter: blur(15px);

          pointer-events: none;
        }


        .team-card:hover {
          transform: translateY(-7px);

          border-color:
            rgba(127, 230, 255, 0.38);

          box-shadow:
            0 25px 55px
            rgba(0, 0, 0, 0.28),

            0 0 35px
            rgba(60, 210, 255, 0.08);
        }


        /* =====================================================
           PROFILE IMAGE
           ===================================================== */

        .team-image-wrapper {
          position: relative;

          width: 130px;
          height: 130px;

          margin-bottom: 20px;

          flex-shrink: 0;
        }


        .team-image-ring {
          position: absolute;

          inset: -5px;

          border-radius: 50%;

          background:
            linear-gradient(
              135deg,
              #78e8ff,
              rgba(255, 255, 255, 0.25),
              #52ffd5
            );

          opacity: 0.9;

          animation:
            teamRingGlow 3s ease-in-out infinite;
        }


        .team-image {
          position: relative;

          width: 130px;
          height: 130px;

          object-fit: cover;

          border-radius: 50%;

          display: block;

          border: 4px solid
            rgba(8, 45, 84, 0.95);

          box-shadow:
            0 10px 30px
            rgba(0, 0, 0, 0.28);
        }


        @keyframes teamRingGlow {

          0%,
          100% {
            opacity: 0.65;
          }

          50% {
            opacity: 1;
          }

        }


        /* =====================================================
           NAME
           ===================================================== */

        .team-name {
          position: relative;

          z-index: 2;

          margin: 0;

          font-size: 19px;

          font-weight: 700;

          color: #ffffff;
        }


        /* =====================================================
           ROLE
           ===================================================== */

        .team-role {
          position: relative;

          z-index: 2;

          margin: 7px 0 18px;

          font-size: 13px;

          font-weight: 500;

          color: #91eaff;

          letter-spacing: 0.25px;
        }


        /* =====================================================
           LINKEDIN BUTTON
           ===================================================== */

        .linkedin-button {
          position: relative;

          z-index: 2;

          display: inline-flex;

          align-items: center;

          justify-content: center;

          gap: 8px;

          min-width: 130px;

          padding: 9px 17px;

          border-radius: 10px;

          text-decoration: none;

          font-size: 13px;

          font-weight: 600;

          color: #ffffff;

          background:
            rgba(255, 255, 255, 0.08);

          border: 1px solid
            rgba(255, 255, 255, 0.14);

          transition:
            all 0.25s ease;
        }


        .linkedin-button:hover {
          background:
            rgba(255, 255, 255, 0.16);

          border-color:
            rgba(255, 255, 255, 0.30);

          transform: translateY(-2px);

          box-shadow:
            0 8px 20px
            rgba(0, 0, 0, 0.15);
        }


        .linkedin-icon {
          width: 17px;
          height: 17px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 3px;

          font-size: 11px;

          font-weight: 800;

          color: #0b4169;

          background: #ffffff;
        }


        /* =====================================================
           TEAM FOOTER
           ===================================================== */

        .team-footer {
          margin-top: 35px;

          text-align: center;

          color:
            rgba(255, 255, 255, 0.48);

          font-size: 12px;
        }


        /* =====================================================
           TABLET
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


          .team-page {
            padding-top: 25px;
          }


          .team-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));

            gap: 20px;
          }


          .team-card {
            min-height: 350px;
          }

        }


        /* =====================================================
           MOBILE
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


          .team-page {
            padding:
              20px
              0
              35px;
          }


          .team-heading {
            margin-bottom: 28px;
          }


          .team-heading h1 {
            font-size: 27px;
          }


          .team-heading p {
            font-size: 13px;

            padding:
              0
              8px;
          }


          .team-grid {
            grid-template-columns: 1fr;

            gap: 18px;
          }


          .team-card {
            min-height: 340px;

            padding:
              24px
              18px;
          }


          .team-image-wrapper,
          .team-image {
            width: 115px;
            height: 115px;
          }


          .team-name {
            font-size: 18px;
          }

        }


        /* =====================================================
           SMALL MOBILE
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


          .team-page {
            padding-top: 16px;
          }


          .team-heading h1 {
            font-size: 24px;
          }


          .team-heading p {
            font-size: 12px;
          }


          .team-card {
            min-height: 320px;

            border-radius: 20px;
          }


          .team-image-wrapper,
          .team-image {
            width: 105px;
            height: 105px;
          }


          .team-name {
            font-size: 17px;
          }

        }


        /* =====================================================
           VERY SMALL PHONE
           ===================================================== */

        @media (max-width: 359px) {

          .settings-content {
            padding-left: 6px;
            padding-right: 6px;
          }


          .team-card {
            padding-left: 14px;
            padding-right: 14px;
          }

        }

      `}</style>


      {/* =====================================================
          PAGE
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
              MEET THE TEAM
              ================================================= */}

          <main className="team-page">


            {/* =================================================
                HEADING
                ================================================= */}

            <div className="team-heading">

              <h1>
                Meet the <span>Weather-GPT Team</span>
              </h1>

              <p>
                The passionate minds behind Weather-GPT — building
                intelligent, accessible and reliable weather
                intelligence for everyone.
              </p>

            </div>


            {/* =================================================
                TEAM GRID
                ================================================= */}

            <div className="team-grid">

              {teamMembers.map((member, index) => (

                <article
                  className="team-card"
                  key={index}
                >


                  {/* =========================================
                      PROFILE IMAGE
                      ========================================= */}

                  <div className="team-image-wrapper">

                    <div className="team-image-ring" />

                    <img
                      className="team-image"
                      src={member.image}
                      alt={`${member.name} - ${member.role}`}
                    />

                  </div>


                  {/* =========================================
                      NAME
                      ========================================= */}

                  <h2 className="team-name">
                    {member.name}
                  </h2>


                  {/* =========================================
                      ROLE
                      ========================================= */}

                  <p className="team-role">
                    {member.role}
                  </p>


                  {/* =========================================
                      LINKEDIN
                      ========================================= */}

                  <a
                    className="linkedin-button"
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${member.name}'s LinkedIn profile`}
                  >

                    <span className="linkedin-icon">
                      in
                    </span>

                    LinkedIn

                  </a>


                </article>

              ))}

            </div>


            {/* =================================================
                FOOTER
                ================================================= */}

            <div className="team-footer">
              WeatherGPT • Team CoderKnights
            </div>


          </main>


        </div>

      </div>

    </>
  );
};


export default SettingsPage;