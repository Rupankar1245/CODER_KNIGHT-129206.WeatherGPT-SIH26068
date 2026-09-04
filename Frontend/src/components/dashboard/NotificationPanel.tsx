import React, { useState } from 'react';

import {
  CloudRain,
  TriangleAlert,
  ThermometerSun,
  Wind,
  Sparkles,
  X,
  Trash2,
  BellOff,
} from 'lucide-react';


/* =========================================================
   TYPES
========================================================= */

interface NotificationPanelProps {
  onClose: () => void;
}


interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  icon: React.ReactNode;
  unread: boolean;
}


/* =========================================================
   INITIAL DATA
========================================================= */

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: 'Heavy Rain Alert',
    message:
      'Moderate to heavy rainfall is expected in your area.',
    time: '5 min ago',
    icon: <TriangleAlert size={16} />,
    unread: true,
  },

  {
    id: 2,
    title: 'Rain Forecast Updated',
    message:
      'Rain probability increased to 72% for the evening.',
    time: '18 min ago',
    icon: <CloudRain size={16} />,
    unread: true,
  },

  {
    id: 3,
    title: 'Temperature Advisory',
    message:
      'Temperature may reach 34°C today.',
    time: '42 min ago',
    icon: <ThermometerSun size={16} />,
    unread: false,
  },

  {
    id: 4,
    title: 'Air Quality Update',
    message:
      'Air quality remains moderate in your location.',
    time: '1 hour ago',
    icon: <Wind size={16} />,
    unread: false,
  },

  {
    id: 5,
    title: 'New AI Insight',
    message:
      'MeghAI has generated a new weather insight for you.',
    time: '2 hours ago',
    icon: <Sparkles size={16} />,
    unread: false,
  },
];


/* =========================================================
   COMPONENT
========================================================= */

export const NotificationPanel: React.FC<
  NotificationPanelProps
> = ({ onClose }) => {


  /* =======================================================
     STATE
  ======================================================= */

  const [notifications, setNotifications] =
    useState<Notification[]>(
      initialNotifications
    );


  /* =======================================================
     REMOVE SINGLE NOTIFICATION
  ======================================================= */

  const removeNotification = (
    id: number
  ) => {

    setNotifications((prev) =>
      prev.filter(
        (notification) =>
          notification.id !== id
      )
    );

  };


  /* =======================================================
     CLEAR ALL
  ======================================================= */

  const clearAllNotifications = () => {

    setNotifications([]);

  };


  /* =======================================================
     UNREAD COUNT
  ======================================================= */

  const unreadCount =
    notifications.filter(
      (notification) =>
        notification.unread
    ).length;


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>


      {/* ===================================================
          ANIMATION + RESPONSIVE STYLES
      ==================================================== */}

      <style>
        {`

          /* =================================================
             PANEL ENTER ANIMATION
          ================================================= */

          @keyframes notificationPanelEnter {

            0% {
              opacity: 0;
              transform:
                translateY(-10px)
                scale(0.96);

              filter:
                blur(4px);
            }


            60% {
              opacity: 1;

              transform:
                translateY(2px)
                scale(1.005);

              filter:
                blur(0);
            }


            100% {
              opacity: 1;

              transform:
                translateY(0)
                scale(1);

              filter:
                blur(0);
            }

          }


          /* =================================================
             MOBILE PANEL ENTER

             IMPORTANT:
             Keeps translateX(-50%) intact.
          ================================================= */

          @keyframes notificationPanelEnterMobile {

            0% {
              opacity: 0;

              transform:
                translateX(-50%)
                translateY(-10px)
                scale(0.96);

              filter:
                blur(4px);
            }


            60% {
              opacity: 1;

              transform:
                translateX(-50%)
                translateY(2px)
                scale(1.005);

              filter:
                blur(0);
            }


            100% {
              opacity: 1;

              transform:
                translateX(-50%)
                translateY(0)
                scale(1);

              filter:
                blur(0);
            }

          }


          /* =================================================
             NOTIFICATION ITEM ENTER
          ================================================= */

          @keyframes notificationItemEnter {

            0% {
              opacity: 0;

              transform:
                translateY(-8px);
            }


            100% {
              opacity: 1;

              transform:
                translateY(0);
            }

          }


          /* =================================================
             ICON ENTER
          ================================================= */

          @keyframes notificationIconEnter {

            0% {
              opacity: 0;

              transform:
                scale(0.75);
            }


            70% {
              opacity: 1;

              transform:
                scale(1.05);
            }


            100% {
              opacity: 1;

              transform:
                scale(1);
            }

          }


          /* =================================================
             SCROLLBAR
          ================================================= */

          .notification-scroll::-webkit-scrollbar {

            width:
              4px;

          }


          .notification-scroll::-webkit-scrollbar-track {

            background:
              transparent;

          }


          .notification-scroll::-webkit-scrollbar-thumb {

            background:
              rgba(148, 163, 184, 0.20);

            border-radius:
              10px;

          }


          .notification-scroll::-webkit-scrollbar-thumb:hover {

            background:
              rgba(148, 163, 184, 0.35);

          }


          /* =================================================
             DESKTOP HOVER EFFECTS
          ================================================= */

          .notification-close:hover {

            background:
              rgba(255, 255, 255, 0.09) !important;

            color:
              #f8fafc !important;

            border-color:
              rgba(255, 255, 255, 0.12) !important;

            transform:
              rotate(90deg);

          }


          .notification-delete:hover {

            background:
              rgba(239, 68, 68, 0.10) !important;

            color:
              #f87171 !important;

            border-color:
              rgba(239, 68, 68, 0.15) !important;

            transform:
              scale(1.05);

          }


          .notification-clear:hover {

            background:
              rgba(255, 255, 255, 0.05) !important;

            color:
              #cbd5e1 !important;

          }


          .notification-view:hover {

            background:
              rgba(56, 189, 248, 0.10) !important;

            border-color:
              rgba(56, 189, 248, 0.22) !important;

            transform:
              translateY(-1px);

          }


          /* =================================================
             TABLET
          ================================================= */

          @media (max-width: 1023px) {

            .notification-panel {

              right:
                0 !important;

              width:
                min(
                  370px,
                  calc(100vw - 32px)
                ) !important;

            }

          }


          /* =================================================
             MOBILE
          ================================================= */

          @media (max-width: 767px) {

            .notification-panel {

              position:
                fixed !important;

              left:
                50% !important;

              right:
                auto !important;

              top:
                64px !important;

              width:
                calc(
                  100vw - 24px
                ) !important;

              max-width:
                420px !important;

              height:
                min(
                  420px,
                  calc(
                    100dvh - 88px
                  )
                ) !important;

              max-height:
                calc(
                  100dvh - 88px
                ) !important;

              animation:
                notificationPanelEnterMobile
                0.42s
                cubic-bezier(
                  0.22,
                  1,
                  0.36,
                  1
                )
                forwards !important;

            }


            .notification-panel-header {

              padding:
                13px
                14px !important;

            }


            .notification-item {

              padding:
                11px
                13px !important;

              gap:
                10px !important;

            }


            .notification-content {

              padding-right:
                18px !important;

            }


            .notification-message {

              font-size:
                10px !important;

            }


            .notification-panel-footer {

              padding:
                9px
                12px !important;

            }

          }


          /* =================================================
             SMALL MOBILE
          ================================================= */

          @media (max-width: 479px) {

            .notification-panel {

              top:
                58px !important;

              width:
                calc(
                  100vw - 16px
                ) !important;

              height:
                min(
                  410px,
                  calc(
                    100dvh - 74px
                  )
                ) !important;

              max-height:
                calc(
                  100dvh - 74px
                ) !important;

              border-radius:
                16px !important;

            }


            .notification-panel-header {

              padding:
                11px
                12px !important;

            }


            .notification-header-icon {

              width:
                30px !important;

              height:
                30px !important;

            }


            .notification-title {

              font-size:
                13px !important;

            }


            .notification-subtitle {

              font-size:
                9.5px !important;

            }


            .notification-item {

              padding:
                10px
                11px !important;

            }


            .notification-icon {

              width:
                30px !important;

              height:
                30px !important;

            }


            .notification-title-text {

              font-size:
                11px !important;

            }


            .notification-message {

              font-size:
                9.8px !important;

              line-height:
                1.4 !important;

            }


            .notification-time {

              font-size:
                9px !important;

            }


            .notification-delete-button {

              right:
                6px !important;

              top:
                9px !important;

            }


            .notification-panel-footer {

              padding:
                8px
                10px !important;

            }


            .notification-clear-button,
            .notification-view-button {

              font-size:
                9.5px !important;

            }

          }


          /* =================================================
             VERY SMALL MOBILE
          ================================================= */

          @media (max-width: 359px) {

            .notification-panel {

              width:
                calc(
                  100vw - 12px
                ) !important;

              top:
                54px !important;

              height:
                min(
                  390px,
                  calc(
                    100dvh - 66px
                  )
                ) !important;

            }


            .notification-panel-header {

              padding:
                10px !important;

            }


            .notification-item {

              padding:
                9px
                10px !important;

            }

          }


          /* =================================================
             TOUCH DEVICE HOVER PROTECTION
          ================================================= */

          @media (hover: none) {

            .notification-close:hover,
            .notification-delete:hover,
            .notification-clear:hover,
            .notification-view:hover {

              transform:
                none;

            }


            .notification-close:hover {

              background:
                rgba(255, 255, 255, 0.045) !important;

              color:
                #94a3b8 !important;

            }


            .notification-delete:hover {

              background:
                transparent !important;

              color:
                rgba(
                  148,
                  163,
                  184,
                  0.40
                ) !important;

            }

          }

        `}
      </style>


      {/* ===================================================
          MAIN PANEL
      ==================================================== */}

      <div
        style={styles.panel}
        className="notification-panel"
      >


        {/* =================================================
            HEADER
        ================================================= */}

        <div
          style={styles.panelHeader}
          className="notification-panel-header"
        >


          <div style={styles.headerLeft}>


            <div
              style={styles.headerIcon}
              className="notification-header-icon"
            >

              <BellOff size={15} />

            </div>


            <div>


              <div style={styles.titleRow}>


                <h3
                  style={styles.title}
                  className="notification-title"
                >
                  Notifications
                </h3>


                {notifications.length > 0 && (

                  <span style={styles.countBadge}>

                    {notifications.length}

                  </span>

                )}

              </div>


              <p
                style={styles.subtitle}
                className="notification-subtitle"
              >

                {unreadCount > 0
                  ? `${unreadCount} unread update${
                      unreadCount > 1
                        ? 's'
                        : ''
                    }`
                  : 'You are all caught up'}

              </p>


            </div>


          </div>


          <button
            type="button"
            onClick={onClose}
            style={styles.closeButton}
            className="notification-close"
            aria-label="Close notifications"
          >

            <X size={15} />

          </button>


        </div>


        {/* =================================================
            NOTIFICATIONS
        ================================================= */}

        {notifications.length > 0 ? (

          <>


            {/* =============================================
                LIST
            ============================================= */}

            <div
              style={styles.notificationList}
              className="notification-scroll"
            >

              {notifications.map(
                (notification, index) => (

                  <div
                    key={notification.id}
                    style={{
                      ...styles.notificationItem,

                      ...(notification.unread
                        ? styles.unreadItem
                        : {}),

                      animation:
                        'notificationItemEnter 0.42s cubic-bezier(0.22, 1, 0.36, 1) forwards',

                      animationDelay:
                        `${index * 75 + 120}ms`,

                      opacity:
                        0,
                    }}
                    className="notification-item"
                  >


                    {/* =====================================
                        ICON
                    ===================================== */}

                    <div
                      style={{
                        ...styles.notificationIcon,

                        ...(notification.unread
                          ? styles.unreadIcon
                          : {}),

                        animation:
                          'notificationIconEnter 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards',

                        animationDelay:
                          `${index * 75 + 220}ms`,

                        opacity:
                          0,
                      }}
                      className="notification-icon"
                    >

                      {notification.icon}

                    </div>


                    {/* =====================================
                        CONTENT
                    ===================================== */}

                    <div
                      style={styles.notificationContent}
                      className="notification-content"
                    >


                      <div
                        style={
                          styles.notificationTitleRow
                        }
                      >


                        <span
                          style={
                            styles.notificationTitle
                          }
                          className="notification-title-text"
                        >

                          {notification.title}

                        </span>


                        {notification.unread && (

                          <span
                            style={styles.unreadDot}
                          />

                        )}

                      </div>


                      <p
                        style={styles.message}
                        className="notification-message"
                      >

                        {notification.message}

                      </p>


                      <span
                        style={styles.time}
                        className="notification-time"
                      >

                        {notification.time}

                      </span>


                    </div>


                    {/* =====================================
                        DELETE
                    ===================================== */}

                    <button
                      type="button"
                      onClick={() =>
                        removeNotification(
                          notification.id
                        )
                      }
                      style={styles.deleteButton}
                      className="
                        notification-delete
                        notification-delete-button
                      "
                      aria-label={
                        `Remove ${notification.title}`
                      }
                      title="Remove notification"
                    >

                      <Trash2 size={13} />

                    </button>


                  </div>

                )
              )}

            </div>


            {/* =============================================
                FOOTER
            ============================================= */}

            <div
              style={styles.panelFooter}
              className="notification-panel-footer"
            >


              <button
                type="button"
                onClick={clearAllNotifications}
                style={styles.clearButton}
                className="
                  notification-clear
                  notification-clear-button
                "
              >

                <Trash2 size={13} />

                <span>
                  Clear all
                </span>

              </button>


              <button
                type="button"
                style={styles.viewAllButton}
                className="
                  notification-view
                  notification-view-button
                "
              >

                <span>
                  View all
                </span>


                <span style={styles.arrow}>
                  →
                </span>


              </button>


            </div>


          </>

        ) : (


          /* ===============================================
             EMPTY STATE
          =============================================== */

          <div style={styles.emptyState}>


            <div style={styles.emptyIcon}>

              <BellOff size={22} />

            </div>


            <h4 style={styles.emptyTitle}>
              No notifications
            </h4>


            <p style={styles.emptyMessage}>

              You're all caught up. We'll let you know
              when something important happens.

            </p>


          </div>

        )}


      </div>


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


  /* =======================================================
     MAIN PANEL
  ======================================================= */

  panel: {

    position:
      'absolute',

    top:
      '48px',

    right:
      '-8px',

    width:
      '370px',

    height:
      '420px',

    display:
      'flex',

    flexDirection:
      'column',

    background:
      'linear-gradient(145deg, rgba(12, 38, 66, 0.97), rgba(7, 25, 46, 0.97))',

    backdropFilter:
      'blur(28px)',

    WebkitBackdropFilter:
      'blur(28px)',

    border:
      '1px solid rgba(255, 255, 255, 0.12)',

    borderRadius:
      '20px',

    boxShadow:
      '0 24px 60px rgba(0, 0, 0, 0.45), 0 8px 24px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.07)',

    overflow:
      'hidden',

    zIndex:
      2000,

    boxSizing:
      'border-box',

    animation:
      'notificationPanelEnter 0.42s cubic-bezier(0.22, 1, 0.36, 1) forwards',

  },


  /* =======================================================
     HEADER
  ======================================================= */

  panelHeader: {

    flexShrink:
      0,

    display:
      'flex',

    justifyContent:
      'space-between',

    alignItems:
      'center',

    padding:
      '14px 17px',

    borderBottom:
      '1px solid rgba(255, 255, 255, 0.07)',

    background:
      'rgba(255, 255, 255, 0.015)',

  },


  headerLeft: {

    display:
      'flex',

    alignItems:
      'center',

    gap:
      '10px',

    minWidth:
      0,

  },


  headerIcon: {

    width:
      '32px',

    height:
      '32px',

    display:
      'flex',

    alignItems:
      'center',

    justifyContent:
      'center',

    flexShrink:
      0,

    borderRadius:
      '10px',

    color:
      '#38bdf8',

    background:
      'linear-gradient(135deg, rgba(56, 189, 248, 0.14), rgba(56, 189, 248, 0.05))',

    border:
      '1px solid rgba(56, 189, 248, 0.14)',

    boxShadow:
      '0 4px 12px rgba(56, 189, 248, 0.06)',

  },


  titleRow: {

    display:
      'flex',

    alignItems:
      'center',

    gap:
      '7px',

  },


  title: {

    margin:
      0,

    color:
      '#f8fafc',

    fontSize:
      '14px',

    fontWeight:
      650,

    letterSpacing:
      '-0.1px',

  },


  countBadge: {

    minWidth:
      '18px',

    height:
      '18px',

    display:
      'flex',

    alignItems:
      'center',

    justifyContent:
      'center',

    padding:
      '0 5px',

    borderRadius:
      '20px',

    background:
      'rgba(56, 189, 248, 0.12)',

    border:
      '1px solid rgba(56, 189, 248, 0.18)',

    color:
      '#38bdf8',

    fontSize:
      '9px',

    fontWeight:
      700,

    boxSizing:
      'border-box',

  },


  subtitle: {

    margin:
      '3px 0 0',

    color:
      'rgba(148, 163, 184, 0.72)',

    fontSize:
      '10px',

  },


  closeButton: {

    width:
      '28px',

    height:
      '28px',

    display:
      'flex',

    alignItems:
      'center',

    justifyContent:
      'center',

    flexShrink:
      0,

    border:
      '1px solid rgba(255, 255, 255, 0.07)',

    borderRadius:
      '9px',

    background:
      'rgba(255, 255, 255, 0.045)',

    color:
      '#94a3b8',

    cursor:
      'pointer',

    transition:
      'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',

  },


  /* =======================================================
     SCROLLABLE LIST
  ======================================================= */

  notificationList: {

    flex:
      1,

    minHeight:
      0,

    display:
      'flex',

    flexDirection:
      'column',

    overflowY:
      'auto',

    overflowX:
      'hidden',

    scrollbarWidth:
      'thin',

    scrollbarColor:
      'rgba(148, 163, 184, 0.25) transparent',

  },


  notificationItem: {

    position:
      'relative',

    display:
      'flex',

    gap:
      '11px',

    flexShrink:
      0,

    padding:
      '12px 16px',

    borderBottom:
      '1px solid rgba(255, 255, 255, 0.045)',

    transition:
      'background 0.25s ease, transform 0.25s ease',

    boxSizing:
      'border-box',

  },


  unreadItem: {

    background:
      'linear-gradient(90deg, rgba(56, 189, 248, 0.045), transparent)',

  },


  /* =======================================================
     ICON
  ======================================================= */

  notificationIcon: {

    width:
      '32px',

    height:
      '32px',

    flexShrink:
      0,

    display:
      'flex',

    alignItems:
      'center',

    justifyContent:
      'center',

    borderRadius:
      '10px',

    color:
      '#64748b',

    background:
      'rgba(255, 255, 255, 0.045)',

    border:
      '1px solid rgba(255, 255, 255, 0.06)',

  },


  unreadIcon: {

    color:
      '#38bdf8',

    background:
      'linear-gradient(135deg, rgba(56, 189, 248, 0.13), rgba(56, 189, 248, 0.05))',

    border:
      '1px solid rgba(56, 189, 248, 0.15)',

    boxShadow:
      '0 4px 12px rgba(56, 189, 248, 0.05)',

  },


  /* =======================================================
     CONTENT
  ======================================================= */

  notificationContent: {

    flex:
      1,

    minWidth:
      0,

    paddingRight:
      '20px',

  },


  notificationTitleRow: {

    display:
      'flex',

    alignItems:
      'center',

    gap:
      '7px',

    minWidth:
      0,

  },


  notificationTitle: {

    color:
      '#e2e8f0',

    fontSize:
      '11.5px',

    fontWeight:
      600,

    whiteSpace:
      'nowrap',

    overflow:
      'hidden',

    textOverflow:
      'ellipsis',

  },


  unreadDot: {

    width:
      '5px',

    height:
      '5px',

    flexShrink:
      0,

    backgroundColor:
      '#38bdf8',

    borderRadius:
      '50%',

    boxShadow:
      '0 0 8px rgba(56, 189, 248, 0.75)',

  },


  message: {

    margin:
      '4px 0 5px',

    color:
      'rgba(148, 163, 184, 0.78)',

    fontSize:
      '10.5px',

    lineHeight:
      1.45,

  },


  time: {

    color:
      'rgba(100, 116, 139, 0.82)',

    fontSize:
      '9.5px',

  },


  /* =======================================================
     DELETE
  ======================================================= */

  deleteButton: {

    position:
      'absolute',

    top:
      '12px',

    right:
      '10px',

    width:
      '24px',

    height:
      '24px',

    display:
      'flex',

    alignItems:
      'center',

    justifyContent:
      'center',

    border:
      '1px solid transparent',

    borderRadius:
      '7px',

    background:
      'transparent',

    color:
      'rgba(148, 163, 184, 0.40)',

    cursor:
      'pointer',

    transition:
      'all 0.22s cubic-bezier(0.22, 1, 0.36, 1)',

  },


  /* =======================================================
     FOOTER
  ======================================================= */

  panelFooter: {

    flexShrink:
      0,

    display:
      'flex',

    alignItems:
      'center',

    justifyContent:
      'space-between',

    padding:
      '9px 14px',

    background:
      'rgba(255, 255, 255, 0.018)',

    borderTop:
      '1px solid rgba(255, 255, 255, 0.05)',

  },


  clearButton: {

    display:
      'flex',

    alignItems:
      'center',

    gap:
      '6px',

    padding:
      '7px 9px',

    border:
      'none',

    borderRadius:
      '8px',

    background:
      'transparent',

    color:
      'rgba(148, 163, 184, 0.65)',

    fontSize:
      '10px',

    cursor:
      'pointer',

    transition:
      'all 0.2s ease',

  },


  viewAllButton: {

    display:
      'flex',

    alignItems:
      'center',

    gap:
      '7px',

    padding:
      '7px 10px',

    border:
      '1px solid rgba(56, 189, 248, 0.12)',

    borderRadius:
      '8px',

    background:
      'rgba(56, 189, 248, 0.055)',

    color:
      '#38bdf8',

    fontSize:
      '10px',

    fontWeight:
      600,

    cursor:
      'pointer',

    transition:
      'all 0.2s ease',

  },


  arrow: {

    fontSize:
      '13px',

    lineHeight:
      1,

  },


  /* =======================================================
     EMPTY STATE
  ======================================================= */

  emptyState: {

    flex:
      1,

    minHeight:
      0,

    display:
      'flex',

    flexDirection:
      'column',

    alignItems:
      'center',

    justifyContent:
      'center',

    textAlign:
      'center',

    padding:
      '30px 35px',

  },


  emptyIcon: {

    width:
      '52px',

    height:
      '52px',

    display:
      'flex',

    alignItems:
      'center',

    justifyContent:
      'center',

    marginBottom:
      '13px',

    borderRadius:
      '16px',

    color:
      'rgba(148, 163, 184, 0.65)',

    background:
      'rgba(255, 255, 255, 0.045)',

    border:
      '1px solid rgba(255, 255, 255, 0.07)',

    boxShadow:
      'inset 0 1px 0 rgba(255, 255, 255, 0.05)',

  },


  emptyTitle: {

    margin:
      0,

    color:
      '#e2e8f0',

    fontSize:
      '13px',

    fontWeight:
      600,

  },


  emptyMessage: {

    maxWidth:
      '260px',

    margin:
      '6px 0 0',

    color:
      'rgba(148, 163, 184, 0.65)',

    fontSize:
      '10.5px',

    lineHeight:
      1.5,

  },

};