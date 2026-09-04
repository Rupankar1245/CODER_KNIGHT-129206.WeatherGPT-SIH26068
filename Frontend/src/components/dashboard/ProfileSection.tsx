import React, { useEffect } from 'react';

import {
  X,
  Camera,
  Pencil,
  MapPin,
  Bell,
  Settings,
  ShieldCheck,
  HelpCircle,
  LogOut,
  ChevronRight,
  Mail,
  UserRound,
  Globe2,
  CheckCircle2,
} from 'lucide-react';

interface ProfileSectionProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  isOpen,
  onClose,
}) => {

  /* =====================================================
     ESC KEY
     ===================================================== */

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, [isOpen, onClose]);


  /* =====================================================
     BODY SCROLL LOCK
     ===================================================== */

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow =
        originalOverflow;
    };
  }, [isOpen]);


  if (!isOpen) return null;


  return (
    <>
      {/* =====================================================
          PROFILE GLASSMORPHISM CSS
          ===================================================== */}

      <style>{`

        /* =====================================================
           OVERLAY
           ===================================================== */

        .profile-overlay {
          position: fixed;

          inset: 0;

          z-index: 3000;

          background:
            rgba(1, 12, 27, 0.30);

          backdrop-filter:
            blur(3px);

          -webkit-backdrop-filter:
            blur(3px);

          animation:
            profileOverlayIn
            0.25s ease-out;
        }


        @keyframes profileOverlayIn {

          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }

        }


        /* =====================================================
           PROFILE DRAWER
           ===================================================== */

        .profile-section {
          position: fixed;

          top: 10px;

          right: 10px;

          width: 420px;

          max-width: calc(100vw - 20px);

          height: calc(100vh - 20px);

          z-index: 3001;

          display: flex;

          flex-direction: column;

          color: #ffffff;

          overflow: hidden;

          border:
            1px solid
            rgba(255,255,255,0.16);

          border-radius: 22px;

          background:
            linear-gradient(
              145deg,
              rgba(8, 34, 66, 0.58) 0%,
              rgba(8, 52, 84, 0.48) 45%,
              rgba(0, 77, 100, 0.42) 100%
            );

          backdrop-filter:
            blur(28px)
            saturate(135%);

          -webkit-backdrop-filter:
            blur(28px)
            saturate(135%);

          box-shadow:
            -20px 10px 60px
            rgba(0,0,0,0.30),

            inset 0 1px 0
            rgba(255,255,255,0.10),

            inset 0 0 0 1px
            rgba(255,255,255,0.025);

          animation:
            profileSlideIn
            0.32s cubic-bezier(
              0.22,
              1,
              0.36,
              1
            );
        }


        @keyframes profileSlideIn {

          from {
            opacity: 0;

            transform:
              translateX(35px)
              scale(0.98);
          }

          to {
            opacity: 1;

            transform:
              translateX(0)
              scale(1);
          }

        }


        /* =====================================================
           GLASS HIGHLIGHT
           ===================================================== */

        .profile-section::before {
          content: '';

          position: absolute;

          top: -150px;

          right: -100px;

          width: 300px;

          height: 300px;

          border-radius: 50%;

          background:
            rgba(56,189,248,0.10);

          filter:
            blur(50px);

          pointer-events: none;
        }


        .profile-section::after {
          content: '';

          position: absolute;

          bottom: -180px;

          left: -120px;

          width: 320px;

          height: 320px;

          border-radius: 50%;

          background:
            rgba(20,184,166,0.07);

          filter:
            blur(60px);

          pointer-events: none;
        }


        /* =====================================================
           TOP HEADER
           ===================================================== */

        .profile-top {
          position: relative;

          z-index: 2;

          display: flex;

          align-items: center;

          justify-content: space-between;

          padding:
            20px 22px 16px;

          flex-shrink: 0;

          border-bottom:
            1px solid
            rgba(255,255,255,0.08);

          background:
            rgba(255,255,255,0.025);
        }


        .profile-heading {
          display: flex;

          flex-direction: column;

          gap: 3px;
        }


        .profile-heading-title {
          margin: 0;

          font-size: 18px;

          font-weight: 700;

          letter-spacing: -0.3px;
        }


        .profile-heading-subtitle {
          margin: 0;

          font-size: 11px;

          color:
            rgba(203,213,225,0.58);
        }


        /* =====================================================
           CLOSE BUTTON
           ===================================================== */

        .profile-close-btn {
          width: 36px;

          height: 36px;

          display: flex;

          align-items: center;

          justify-content: center;

          padding: 0;

          border:
            1px solid
            rgba(255,255,255,0.12);

          border-radius: 11px;

          background:
            rgba(255,255,255,0.055);

          color:
            rgba(255,255,255,0.72);

          cursor: pointer;

          transition:
            all 0.2s ease;

          box-shadow:
            inset 0 1px 0
            rgba(255,255,255,0.06);
        }


        .profile-close-btn:hover {
          background:
            rgba(255,255,255,0.11);

          border-color:
            rgba(255,255,255,0.20);

          color: #ffffff;

          transform:
            rotate(4deg);
        }


        /* =====================================================
           SCROLL AREA
           ===================================================== */

        .profile-scroll {
          position: relative;

          z-index: 2;

          flex: 1;

          overflow-y: auto;

          overflow-x: hidden;

          padding:
            20px 22px 30px;

          scrollbar-width: thin;

          scrollbar-color:
            rgba(255,255,255,0.18)
            transparent;
        }


        .profile-scroll::-webkit-scrollbar {
          width: 5px;
        }


        .profile-scroll::-webkit-scrollbar-track {
          background: transparent;
        }


        .profile-scroll::-webkit-scrollbar-thumb {
          background:
            rgba(255,255,255,0.16);

          border-radius: 10px;
        }


        /* =====================================================
           PROFILE HERO
           ===================================================== */

        .profile-hero {
          position: relative;

          display: flex;

          flex-direction: column;

          align-items: center;

          text-align: center;

          padding:
            20px 16px 22px;

          border:
            1px solid
            rgba(255,255,255,0.105);

          border-radius: 18px;

          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,0.075),
              rgba(255,255,255,0.028)
            );

          backdrop-filter:
            blur(18px);

          -webkit-backdrop-filter:
            blur(18px);

          box-shadow:
            inset 0 1px 0
            rgba(255,255,255,0.07),

            0 8px 30px
            rgba(0,0,0,0.08);

          overflow: hidden;
        }


        .profile-hero::before {
          content: '';

          position: absolute;

          width: 190px;

          height: 190px;

          top: -125px;

          right: -65px;

          border-radius: 50%;

          background:
            rgba(56,189,248,0.11);

          filter:
            blur(30px);

          pointer-events: none;
        }


        /* =====================================================
           AVATAR
           ===================================================== */

        .profile-avatar-wrapper {
          position: relative;

          width: 88px;

          height: 88px;

          margin-bottom: 13px;
        }


        .profile-avatar {
          width: 88px;

          height: 88px;

          display: block;

          object-fit: cover;

          border-radius: 50%;

          border:
            3px solid
            rgba(255,255,255,0.18);

          box-shadow:
            0 8px 30px
            rgba(0,0,0,0.28),

            0 0 0 5px
            rgba(255,255,255,0.025);
        }


        /* =====================================================
           ONLINE STATUS
           ===================================================== */

        .profile-online {
          position: absolute;

          right: 3px;

          bottom: 5px;

          width: 15px;

          height: 15px;

          border-radius: 50%;

          background: #10b981;

          border:
            3px solid
            rgba(8,45,84,0.95);

          box-shadow:
            0 0 10px
            rgba(16,185,129,0.75);
        }


        /* =====================================================
           CAMERA BUTTON
           ===================================================== */

        .profile-camera-btn {
          position: absolute;

          right: -5px;

          top: -3px;

          width: 29px;

          height: 29px;

          display: flex;

          align-items: center;

          justify-content: center;

          padding: 0;

          border:
            1px solid
            rgba(255,255,255,0.16);

          border-radius: 50%;

          background:
            rgba(7,38,69,0.68);

          backdrop-filter:
            blur(12px);

          -webkit-backdrop-filter:
            blur(12px);

          color: #ffffff;

          cursor: pointer;

          box-shadow:
            0 5px 15px
            rgba(0,0,0,0.25);

          transition:
            all 0.2s ease;
        }


        .profile-camera-btn:hover {
          background:
            rgba(56,189,248,0.20);

          border-color:
            rgba(56,189,248,0.30);

          transform:
            scale(1.06);
        }


        /* =====================================================
           USER NAME
           ===================================================== */

        .profile-name {
          margin: 0;

          font-size: 19px;

          font-weight: 700;

          letter-spacing: -0.3px;
        }


        .profile-email {
          display: flex;

          align-items: center;

          justify-content: center;

          gap: 5px;

          margin-top: 5px;

          font-size: 11px;

          color:
            rgba(203,213,225,0.60);
        }


        .profile-status {
          display: inline-flex;

          align-items: center;

          gap: 5px;

          margin-top: 12px;

          padding:
            5px 10px;

          border:
            1px solid
            rgba(16,185,129,0.18);

          border-radius: 20px;

          background:
            rgba(16,185,129,0.065);

          backdrop-filter:
            blur(10px);

          -webkit-backdrop-filter:
            blur(10px);

          color:
            rgba(167,243,208,0.88);

          font-size: 10px;

          font-weight: 600;
        }


        /* =====================================================
           EDIT PROFILE
           ===================================================== */

        .profile-edit-btn {
          width: 100%;

          height: 38px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 7px;

          margin-top: 15px;

          border:
            1px solid
            rgba(56,189,248,0.20);

          border-radius: 10px;

          background:
            rgba(56,189,248,0.07);

          backdrop-filter:
            blur(12px);

          -webkit-backdrop-filter:
            blur(12px);

          color:
            #bae6fd;

          font-size: 11px;

          font-weight: 600;

          cursor: pointer;

          transition:
            all 0.2s ease;
        }


        .profile-edit-btn:hover {
          background:
            rgba(56,189,248,0.13);

          border-color:
            rgba(56,189,248,0.32);

          transform:
            translateY(-1px);
        }


        /* =====================================================
           MENU SECTION
           ===================================================== */

        .profile-menu-section {
          margin-top: 22px;
        }


        .profile-menu-title {
          margin:
            0 0 9px 4px;

          font-size: 10px;

          font-weight: 700;

          letter-spacing: 0.8px;

          text-transform: uppercase;

          color:
            rgba(148,163,184,0.62);
        }


        /* =====================================================
           MENU CONTAINER
           ===================================================== */

        .profile-menu {
          overflow: hidden;

          border:
            1px solid
            rgba(255,255,255,0.085);

          border-radius: 15px;

          background:
            rgba(255,255,255,0.035);

          backdrop-filter:
            blur(18px);

          -webkit-backdrop-filter:
            blur(18px);

          box-shadow:
            inset 0 1px 0
            rgba(255,255,255,0.035);
        }


        /* =====================================================
           MENU ITEM
           ===================================================== */

        .profile-menu-item {
          width: 100%;

          min-height: 57px;

          display: flex;

          align-items: center;

          gap: 12px;

          padding:
            9px 13px;

          border: none;

          border-bottom:
            1px solid
            rgba(255,255,255,0.055);

          background:
            transparent;

          color: #ffffff;

          text-align: left;

          cursor: pointer;

          transition:
            all 0.2s ease;
        }


        .profile-menu-item:last-child {
          border-bottom: none;
        }


        .profile-menu-item:hover {
          background:
            rgba(255,255,255,0.065);

          padding-left: 16px;
        }


        /* =====================================================
           MENU ICON
           ===================================================== */

        .profile-menu-icon {
          width: 34px;

          height: 34px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border:
            1px solid
            rgba(255,255,255,0.075);

          border-radius: 10px;

          background:
            rgba(255,255,255,0.045);

          backdrop-filter:
            blur(10px);

          -webkit-backdrop-filter:
            blur(10px);

          color:
            #7dd3fc;
        }


        .profile-menu-content {
          flex: 1;

          min-width: 0;

          display: flex;

          flex-direction: column;

          gap: 3px;
        }


        .profile-menu-label {
          font-size: 12px;

          font-weight: 600;

          color:
            rgba(248,250,252,0.92);
        }


        .profile-menu-description {
          font-size: 9px;

          color:
            rgba(148,163,184,0.58);

          white-space: nowrap;

          overflow: hidden;

          text-overflow: ellipsis;
        }


        .profile-menu-arrow {
          flex-shrink: 0;

          color:
            rgba(148,163,184,0.42);

          transition:
            transform 0.2s ease;
        }


        .profile-menu-item:hover
        .profile-menu-arrow {
          transform:
            translateX(3px);

          color:
            rgba(255,255,255,0.65);
        }


        /* =====================================================
           SIGN OUT
           ===================================================== */

        .profile-signout {
          margin-top: 22px;
        }


        .profile-signout-btn {
          width: 100%;

          height: 44px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 8px;

          border:
            1px solid
            rgba(239,68,68,0.15);

          border-radius: 11px;

          background:
            rgba(239,68,68,0.045);

          backdrop-filter:
            blur(12px);

          -webkit-backdrop-filter:
            blur(12px);

          color:
            rgba(252,165,165,0.90);

          font-size: 11px;

          font-weight: 600;

          cursor: pointer;

          transition:
            all 0.2s ease;
        }


        .profile-signout-btn:hover {
          background:
            rgba(239,68,68,0.10);

          border-color:
            rgba(239,68,68,0.28);

          color: #fecaca;

          transform:
            translateY(-1px);
        }


        /* =====================================================
           FOOTER
           ===================================================== */

        .profile-footer {
          margin-top: 18px;

          padding-bottom: 5px;

          text-align: center;

          color:
            rgba(148,163,184,0.42);

          font-size: 9px;

          line-height: 1.6;
        }


        /* =====================================================
           TABLET / MOBILE
           ===================================================== */

        @media (max-width: 767px) {

          .profile-section {
            top: 0;

            right: 0;

            width: 100%;

            max-width: 100%;

            height: 100vh;

            border-radius: 0;

            border-left: none;

            border-top: none;

            border-bottom: none;
          }


          .profile-top {
            padding:
              17px 18px 14px;
          }


          .profile-scroll {
            padding:
              16px 18px 25px;
          }

        }


        /* =====================================================
           SMALL MOBILE
           ===================================================== */

        @media (max-width: 479px) {

          .profile-heading-title {
            font-size: 17px;
          }


          .profile-hero {
            padding:
              18px 14px 19px;
          }


          .profile-avatar-wrapper,
          .profile-avatar {
            width: 78px;

            height: 78px;
          }


          .profile-name {
            font-size: 18px;
          }


          .profile-menu-item {
            min-height: 54px;

            padding:
              8px 11px;
          }

        }


        /* =====================================================
           VERY SMALL PHONE
           ===================================================== */

        @media (max-width: 359px) {

          .profile-top {
            padding:
              14px 14px 12px;
          }


          .profile-scroll {
            padding:
              14px 14px 22px;
          }


          .profile-menu-description {
            display: none;
          }

        }

      `}</style>


      {/* =====================================================
          OVERLAY
          ===================================================== */}

      <div
        className="profile-overlay"
        onClick={onClose}
        aria-hidden="true"
      />


      {/* =====================================================
          PROFILE DRAWER
          ===================================================== */}

      <aside
        className="profile-section"
        role="dialog"
        aria-modal="true"
        aria-label="Profile"
        onClick={(event) =>
          event.stopPropagation()
        }
      >


        {/* ===================================================
            HEADER
            =================================================== */}

        <div className="profile-top">

          <div className="profile-heading">

            <h2 className="profile-heading-title">
              My Profile
            </h2>

            <p className="profile-heading-subtitle">
              Manage your MeghAI account
            </p>

          </div>


          <button
            type="button"
            className="profile-close-btn"
            onClick={onClose}
            aria-label="Close profile"
          >

            <X size={17} />

          </button>

        </div>


        {/* ===================================================
            SCROLL CONTENT
            =================================================== */}

        <div className="profile-scroll">


          {/* =================================================
              PROFILE HERO
              ================================================= */}

          <section className="profile-hero">


            {/* ===============================================
                AVATAR
                =============================================== */}

            <div className="profile-avatar-wrapper">

              <img
                className="profile-avatar"
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=85"
                alt="Profile"
              />


              <span
                className="profile-online"
                title="Online"
              />


              <button
                type="button"
                className="profile-camera-btn"
                aria-label="Change profile photo"
              >

                <Camera size={13} />

              </button>

            </div>


            {/* ===============================================
                USER INFORMATION
                =============================================== */}

            <h3 className="profile-name">
              MeghAI User
            </h3>


            <div className="profile-email">

              <Mail size={12} />

              <span>
                user@meghai.app
              </span>

            </div>


            <div className="profile-status">

              <CheckCircle2 size={11} />

              <span>
                Account active
              </span>

            </div>


            {/* ===============================================
                EDIT PROFILE
                =============================================== */}

            <button
              type="button"
              className="profile-edit-btn"
            >

              <Pencil size={13} />

              <span>
                Edit Profile
              </span>

            </button>

          </section>


          {/* =================================================
              ACCOUNT
              ================================================= */}

          <section className="profile-menu-section">

            <h4 className="profile-menu-title">
              Account
            </h4>


            <div className="profile-menu">


              {/* =============================================
                  PERSONAL INFORMATION
                  ============================================= */}

              <button
                type="button"
                className="profile-menu-item"
              >

                <div className="profile-menu-icon">
                  <UserRound size={16} />
                </div>


                <div className="profile-menu-content">

                  <span className="profile-menu-label">
                    Personal Information
                  </span>

                  <span className="profile-menu-description">
                    Manage your name and account details
                  </span>

                </div>


                <ChevronRight
                  size={15}
                  className="profile-menu-arrow"
                />

              </button>


              {/* =============================================
                  LOCATION
                  ============================================= */}

              <button
                type="button"
                className="profile-menu-item"
              >

                <div className="profile-menu-icon">
                  <MapPin size={16} />
                </div>


                <div className="profile-menu-content">

                  <span className="profile-menu-label">
                    Location
                  </span>

                  <span className="profile-menu-description">
                    Manage your weather location
                  </span>

                </div>


                <ChevronRight
                  size={15}
                  className="profile-menu-arrow"
                />

              </button>


              {/* =============================================
                  LANGUAGE
                  ============================================= */}

              <button
                type="button"
                className="profile-menu-item"
              >

                <div className="profile-menu-icon">
                  <Globe2 size={16} />
                </div>


                <div className="profile-menu-content">

                  <span className="profile-menu-label">
                    Language
                  </span>

                  <span className="profile-menu-description">
                    Choose your preferred language
                  </span>

                </div>


                <ChevronRight
                  size={15}
                  className="profile-menu-arrow"
                />

              </button>

            </div>

          </section>


          {/* =================================================
              PREFERENCES
              ================================================= */}

          <section className="profile-menu-section">

            <h4 className="profile-menu-title">
              Preferences
            </h4>


            <div className="profile-menu">


              {/* =============================================
                  NOTIFICATIONS
                  ============================================= */}

              <button
                type="button"
                className="profile-menu-item"
              >

                <div className="profile-menu-icon">
                  <Bell size={16} />
                </div>


                <div className="profile-menu-content">

                  <span className="profile-menu-label">
                    Notifications
                  </span>

                  <span className="profile-menu-description">
                    Manage weather alerts and updates
                  </span>

                </div>


                <ChevronRight
                  size={15}
                  className="profile-menu-arrow"
                />

              </button>


              {/* =============================================
                  SETTINGS
                  ============================================= */}

              <button
                type="button"
                className="profile-menu-item"
              >

                <div className="profile-menu-icon">
                  <Settings size={16} />
                </div>


                <div className="profile-menu-content">

                  <span className="profile-menu-label">
                    Settings
                  </span>

                  <span className="profile-menu-description">
                    Customize your MeghAI experience
                  </span>

                </div>


                <ChevronRight
                  size={15}
                  className="profile-menu-arrow"
                />

              </button>


              {/* =============================================
                  PRIVACY
                  ============================================= */}

              <button
                type="button"
                className="profile-menu-item"
              >

                <div className="profile-menu-icon">
                  <ShieldCheck size={16} />
                </div>


                <div className="profile-menu-content">

                  <span className="profile-menu-label">
                    Privacy & Security
                  </span>

                  <span className="profile-menu-description">
                    Manage privacy and security preferences
                  </span>

                </div>


                <ChevronRight
                  size={15}
                  className="profile-menu-arrow"
                />

              </button>

            </div>

          </section>


          {/* =================================================
              SUPPORT
              ================================================= */}

          <section className="profile-menu-section">

            <h4 className="profile-menu-title">
              Support
            </h4>


            <div className="profile-menu">

              <button
                type="button"
                className="profile-menu-item"
              >

                <div className="profile-menu-icon">
                  <HelpCircle size={16} />
                </div>


                <div className="profile-menu-content">

                  <span className="profile-menu-label">
                    Help & Support
                  </span>

                  <span className="profile-menu-description">
                    Get help with MeghAI
                  </span>

                </div>


                <ChevronRight
                  size={15}
                  className="profile-menu-arrow"
                />

              </button>

            </div>

          </section>


          {/* =================================================
              SIGN OUT
              ================================================= */}

          <div className="profile-signout">

            <button
              type="button"
              className="profile-signout-btn"
            >

              <LogOut size={15} />

              <span>
                Sign Out
              </span>

            </button>

          </div>


          {/* =================================================
              FOOTER
              ================================================= */}

          <div className="profile-footer">

            <div>
              MeghAI
            </div>

            <div>
              Weather Intelligence for Everyone
            </div>

          </div>

        </div>

      </aside>
    </>
  );
};

export default ProfileSection;