import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Sparkles,
  Mic,
  Send,
  Maximize2,
} from 'lucide-react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  useAiChat,
} from './AiChatProvider';


/* =========================================================
   COMPONENT
========================================================= */

export const AiChatPanel: React.FC = () => {


  /* =======================================================
     ROUTER
  ======================================================= */

  const navigate =
    useNavigate();


  /* =======================================================
     SHARED CHAT STATE
  ======================================================= */

  const {
    messages,
    isLoading,
    weatherContextLoading,
    sendMessage,
  } = useAiChat();


  /* =======================================================
     INITIAL SKELETON STATE

     This state is ONLY for the first page load.
     Once the initial weather context finishes loading,
     the skeleton will never appear again during chatting.
  ======================================================= */

  const [
    showInitialSkeleton,
    setShowInitialSkeleton,
  ] = useState(
    weatherContextLoading
  );


  /* =======================================================
     LOCAL INPUT STATE
  ======================================================= */

  const [
    input,
    setInput,
  ] = useState('');


  /* =======================================================
     MESSAGE CONTAINER REF
  ======================================================= */

  const messagesContainerRef =
    useRef<HTMLDivElement | null>(
      null
    );


  /* =======================================================
     INITIAL SKELETON CONTROL
  ======================================================= */

  useEffect(
    () => {

      /*
       * Only turn the initial skeleton OFF.
       *
       * We intentionally never turn it ON again here.
       * Therefore, even if weatherContextLoading changes
       * later while chatting, the full skeleton will not
       * come back.
       */

      if (
        !weatherContextLoading
      ) {

        setShowInitialSkeleton(
          false
        );

      }

    },
    [
      weatherContextLoading,
    ]
  );


  /* =======================================================
     SCROLL CHAT ONLY
  ======================================================= */

  useEffect(
    () => {

      const container =
        messagesContainerRef.current;


      if (!container) {
        return;
      }


      requestAnimationFrame(
        () => {

          container.scrollTo({
            top:
              container.scrollHeight,

            behavior:
              'smooth',
          });

        }
      );

    },
    [
      messages,
      isLoading,
    ]
  );


  /* =======================================================
     SEND MESSAGE
  ======================================================= */

  const handleSend = async (
    customMessage?: string
  ) => {

    const userMessage =
      customMessage !== undefined
        ? customMessage.trim()
        : input.trim();


    if (!userMessage) {
      return;
    }


    /*
     * Block only when:
     * - AI is already thinking
     * - Initial page skeleton is active
     */

    if (
      isLoading ||
      showInitialSkeleton
    ) {
      return;
    }


    setInput('');


    await sendMessage(
      userMessage
    );

  };


  /* =======================================================
     ENTER KEY
  ======================================================= */

  const handleKeyDown = (
    event:
      React.KeyboardEvent<HTMLInputElement>
  ) => {

    if (
      event.key === 'Enter' &&
      !event.shiftKey
    ) {

      event.preventDefault();

      void handleSend();

    }

  };


  /* =======================================================
     QUICK QUESTION
  ======================================================= */

  const handleQuickQuestion = (
    question: string
  ) => {

    void handleSend(
      question
    );

  };


  /* =======================================================
     OPEN FULL CHAT
  ======================================================= */

  const handleOpenFullChat = () => {

    navigate(
      '/ai_chat'
    );

  };


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <div
      style={styles.card}
      className="ai-chat-panel"
    >


      {/* =================================================
          HEADER
      ================================================= */}

      <div style={styles.titleRow}>


        <div style={styles.titleGroup}>


          <Sparkles
            size={20}
            color="#fbbf24"
            style={{
              filter:
                'drop-shadow(0 0 6px #fbbf24)',
            }}
          />


          <h3 style={styles.heading}>
            Ask Weather-GPT
          </h3>


        </div>


        <button
          type="button"
          style={styles.expandBtn}
          className="expand-chat-btn"
          onClick={handleOpenFullChat}
          title="Open full chat"
          aria-label="Open full AI chat"
          disabled={showInitialSkeleton}
        >

          <Maximize2
            size={17}
            color="#ffffff"
          />

        </button>


      </div>


      {/* =================================================
          MESSAGE AREA
      ================================================= */}

      <div
        ref={messagesContainerRef}
        style={styles.messagesContainer}
        className="ai-chat-panel__messages"
      >


        {/* =================================================
            INITIAL WEATHER CONTEXT SKELETON

            ONLY FOR INITIAL PAGE LOAD
        ================================================= */}

        {showInitialSkeleton && (

          <div
            style={styles.skeletonContainer}
            className="ai-chat-skeleton"
          >


            {/* AI AVATAR + MESSAGE */}

            <div
              style={styles.skeletonMessageRow}
            >

              <div
                className="skeleton-shimmer"
                style={styles.skeletonAvatar}
              />


              <div
                style={styles.skeletonAiContent}
              >

                <div
                  className="skeleton-shimmer"
                  style={styles.skeletonLineLarge}
                />

                <div
                  className="skeleton-shimmer"
                  style={styles.skeletonLineMedium}
                />

                <div
                  className="skeleton-shimmer"
                  style={styles.skeletonLineSmall}
                />

              </div>

            </div>


            {/* USER MESSAGE */}

            <div
              style={styles.skeletonUserRow}
            >

              <div
                className="skeleton-shimmer"
                style={styles.skeletonUserBubble}
              />

            </div>


            {/* AI MESSAGE */}

            <div
              style={styles.skeletonMessageRow}
            >

              <div
                className="skeleton-shimmer"
                style={styles.skeletonAvatar}
              />


              <div
                style={styles.skeletonAiContent}
              >

                <div
                  className="skeleton-shimmer"
                  style={styles.skeletonLineMedium}
                />

                <div
                  className="skeleton-shimmer"
                  style={styles.skeletonLineLarge}
                />

              </div>

            </div>


            {/* EMPTY STATE STYLE SKELETON */}

            <div
              style={styles.skeletonEmptyArea}
            >

              <div
                className="skeleton-shimmer"
                style={styles.skeletonCenterLogo}
              />

              <div
                className="skeleton-shimmer"
                style={styles.skeletonCenterTitle}
              />

              <div
                className="skeleton-shimmer"
                style={styles.skeletonCenterDescription}
              />

              <div
                className="skeleton-shimmer"
                style={{
                  ...styles.skeletonCenterDescription,
                  width: '55%',
                }}
              />

            </div>


          </div>

        )}


        {/* =================================================
            EMPTY CHAT PLACEHOLDER
        ================================================= */}

        {!showInitialSkeleton &&
          messages.length === 0 &&
          !isLoading && (

            <div
              style={styles.emptyState}
            >


              <div
                style={styles.emptyLogoWrapper}
                className="empty-logo-glow"
              >

                <img
                  src="/logo.png"
                  alt="MeghAI"
                  style={styles.emptyLogo}
                />

              </div>


              <h4
                style={styles.emptyTitle}
              >
                How can I help you?
              </h4>


              <p
                style={styles.emptyDescription}
              >
                Ask Weather-GPT about the weather,
                travel conditions, rain,
                forecasts and more.
              </p>


            </div>

          )}


        {/* =================================================
            MESSAGES
        ================================================= */}

        {!showInitialSkeleton &&

          messages.map((message) => (

            <div
              key={message.id}
              style={
                message.role === 'user'
                  ? styles.userBubbleWrapper
                  : styles.aiBubbleWrapper
              }
              className={
                message.role === 'user'
                  ? 'user-message'
                  : 'ai-message'
              }
            >


              {message.role === 'ai' && (

                <div
                  style={
                    styles.aiAvatarWrapper
                  }
                  className="ai-avatar-glow"
                >

                  <img
                    src="/logo.png"
                    alt="MeghAI"
                    style={
                      styles.avatarImg
                    }
                  />

                </div>

              )}


              <div
                style={
                  message.role === 'user'
                    ? styles.userBubble
                    : styles.aiBubble
                }
              >

                <p
                  style={
                    message.role === 'user'
                      ? styles.userText
                      : styles.aiText
                  }
                >

                  {message.text}

                </p>

              </div>

            </div>

          ))}


        {/* =================================================
            AI THINKING INDICATOR

            ONLY WHEN A MESSAGE IS BEING PROCESSED
        ================================================= */}

        {!showInitialSkeleton &&
          isLoading && (

            <div
              style={
                styles.aiBubbleWrapper
              }
              className="ai-message"
            >


              <div
                style={
                  styles.aiAvatarWrapper
                }
                className="ai-avatar-glow"
              >

                <img
                  src="/logo.png"
                  alt="MeghAI"
                  style={
                    styles.avatarImg
                  }
                />

              </div>


              <div
                style={
                  styles.aiBubble
                }
              >

                <div
                  style={
                    styles.typingContainer
                  }
                >

                  <span
                    className="typing-dot"
                  />

                  <span
                    className="typing-dot"
                  />

                  <span
                    className="typing-dot"
                  />

                </div>

              </div>

            </div>

          )}

      </div>


      {/* =================================================
          QUICK QUESTIONS
      ================================================= */}

      <div
        style={
          styles.chipList
        }
      >


        <button
          type="button"
          className="chip-btn"
          style={styles.chip}
          onClick={() =>
            handleQuickQuestion(
              'Will it rain today?'
            )
          }
          disabled={
            isLoading ||
            showInitialSkeleton
          }
        >

          Will it rain today?

        </button>


        <button
          type="button"
          className="chip-btn"
          style={styles.chip}
          onClick={() =>
            handleQuickQuestion(
              'Is it safe to travel today?'
            )
          }
          disabled={
            isLoading ||
            showInitialSkeleton
          }
        >

          Is it safe to travel?

        </button>


        <button
          type="button"
          className="chip-btn"
          style={styles.chip}
          onClick={() =>
            handleQuickQuestion(
              'Give me a weather recommendation for today.'
            )
          }
          disabled={
            isLoading ||
            showInitialSkeleton
          }
        >

          Weather suggestion

        </button>


      </div>


      {/* =================================================
          INPUT
      ================================================= */}

      <div
        style={
          styles.inputSection
        }
      >


        <div
          style={
            styles.inputWrapper
          }
        >

          <input
            type="text"
            value={input}
            placeholder={
              showInitialSkeleton
                ? 'Loading Weather-GPT...'
                : isLoading
                  ? 'Weather-GPT is thinking...'
                  : 'Chat a message...'
            }
            onChange={(event) =>
              setInput(
                event.target.value
              )
            }
            onKeyDown={
              handleKeyDown
            }
            style={
              styles.input
            }
            disabled={
              isLoading ||
              showInitialSkeleton
            }
          />


          <button
            type="button"
            style={
              styles.iconBtn
            }
            title="Voice input"
            disabled={
              isLoading ||
              showInitialSkeleton
            }
          >

            <Mic
              size={18}
              color="#475569"
            />

          </button>


        </div>


        <button
          type="button"
          style={{
            ...styles.sendBtn,

            opacity:
              isLoading ||
              showInitialSkeleton ||
              !input.trim()
                ? 0.55
                : 1,

            cursor:
              isLoading ||
              showInitialSkeleton ||
              !input.trim()
                ? 'not-allowed'
                : 'pointer',
          }}
          className="send-btn-hover"
          title="Send message"
          onClick={() =>
            void handleSend()
          }
          disabled={
            isLoading ||
            showInitialSkeleton ||
            !input.trim()
          }
        >

          <Send
            size={15}
            color="#ffffff"
            style={{
              transform:
                'rotate(45deg)',

              marginLeft:
                '-2px',
            }}
          />

        </button>


      </div>


      {/* =================================================
          ANIMATIONS
      ================================================= */}

      <style>

        {`

          /* =============================================
             CRITICAL FLEX LAYOUT FIX
          ============================================= */

          .ai-chat-panel {
            width: 100%;
            height: 100%;
            min-height: 0;
            max-height: 100%;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }


          .ai-chat-panel__messages {
            flex: 1 1 0 !important;
            min-height: 0 !important;
            height: 0;
            overflow-y: auto !important;
            overflow-x: hidden !important;
            overscroll-behavior: contain;
            scrollbar-gutter: stable;
          }


          /* =============================================
             SKELETON SHIMMER
          ============================================= */

          @keyframes skeletonShimmer {

            0% {
              background-position: -400px 0;
            }

            100% {
              background-position: 400px 0;
            }

          }


          .skeleton-shimmer {

            background:
              linear-gradient(
                90deg,
                rgba(255, 255, 255, 0.08) 25%,
                rgba(255, 255, 255, 0.22) 50%,
                rgba(255, 255, 255, 0.08) 75%
              );

            background-size:
              800px 100%;

            animation:
              skeletonShimmer
              1.6s
              ease-in-out
              infinite;

          }


          /* =============================================
             MESSAGE APPEAR
          ============================================= */

          @keyframes messageAppear {

            from {
              opacity: 0;
              transform: translateY(8px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }

          }


          .user-message {
            animation:
              messageAppear
              0.3s
              ease-out;
          }


          .ai-message {
            animation:
              messageAppear
              0.35s
              ease-out;
          }


          /* =============================================
             AVATAR GLOW
          ============================================= */

          @keyframes avatarGlow {

            0%,
            100% {

              box-shadow:
                0 0 0
                rgba(56, 189, 248, 0);

            }


            50% {

              box-shadow:
                0 0 18px
                rgba(56, 189, 248, 0.35);

            }

          }


          .ai-avatar-glow {

            animation:
              avatarGlow
              3s
              ease-in-out
              infinite;

          }


          .empty-logo-glow {

            animation:
              avatarGlow
              3s
              ease-in-out
              infinite;

          }


          /* =============================================
             TYPING DOTS
          ============================================= */

          @keyframes typingAnimation {

            0%,
            60%,
            100% {

              transform:
                translateY(0);

              opacity:
                0.4;

            }


            30% {

              transform:
                translateY(-4px);

              opacity:
                1;

            }

          }


          .typing-dot {

            width: 6px;
            height: 6px;

            border-radius: 50%;

            background: #64748b;

            display: inline-block;

            animation:
              typingAnimation
              1.2s
              infinite
              ease-in-out;

          }


          .typing-dot:nth-child(2) {
            animation-delay: 0.15s;
          }


          .typing-dot:nth-child(3) {
            animation-delay: 0.3s;
          }


          /* =============================================
             SEND BUTTON
          ============================================= */

          .send-btn-hover {

            transition:
              transform 0.2s ease,
              box-shadow 0.2s ease,
              opacity 0.2s ease;

          }


          .send-btn-hover:hover:not(:disabled) {

            transform:
              scale(1.06);

            box-shadow:
              0 6px 18px
              rgba(2, 132, 199, 0.55);

          }


          /* =============================================
             EXPAND BUTTON
          ============================================= */

          .expand-chat-btn {

            transition:
              transform 0.2s ease,
              background 0.2s ease;

          }


          .expand-chat-btn:hover:not(:disabled) {

            transform:
              scale(1.08);

            background:
              rgba(255, 255, 255, 0.14);

          }


          /* =============================================
             CHIPS
          ============================================= */

          .chip-btn {

            transition:
              all 0.2s ease;

          }


          .chip-btn:hover:not(:disabled) {

            background:
              rgba(56, 189, 248, 0.12);

            border-color:
              rgba(56, 189, 248, 0.35);

            transform:
              translateY(-1px);

          }


          .chip-btn:disabled {

            opacity:
              0.45;

            cursor:
              not-allowed;

          }


          /* =============================================
             MESSAGE SCROLLBAR
          ============================================= */

          .ai-chat-panel__messages::-webkit-scrollbar {

            width: 5px;

          }


          .ai-chat-panel__messages::-webkit-scrollbar-track {

            background:
              transparent;

          }


          .ai-chat-panel__messages::-webkit-scrollbar-thumb {

            background:
              rgba(148, 163, 184, 0.35);

            border-radius:
              999px;

          }


          .ai-chat-panel__messages::-webkit-scrollbar-thumb:hover {

            background:
              rgba(148, 163, 184, 0.55);

          }

        `}

      </style>


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
     CARD
  ===================================================== */

  card: {

    position:
      'relative',

    width:
      '100%',

    background:
      'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 100%)',

    backdropFilter:
      'blur(20px)',

    WebkitBackdropFilter:
      'blur(20px)',

    borderRadius:
      '24px',

    padding:
      '22px 24px',

    border:
      '1px solid rgba(255, 255, 255, 0.18)',

    boxShadow:
      '0 8px 32px 0 rgba(0, 0, 0, 0.25)',

    display:
      'flex',

    flexDirection:
      'column',

    flex:
      '1 1 auto',

    height:
      '100%',

    minHeight:
      0,

    maxHeight:
      '100%',

    boxSizing:
      'border-box',

    overflow:
      'hidden',

  },


  titleRow: {

    display:
      'flex',

    alignItems:
      'center',

    justifyContent:
      'space-between',

    marginBottom:
      '14px',

    flexShrink:
      0,

  },


  titleGroup: {

    display:
      'flex',

    alignItems:
      'center',

    gap:
      '10px',

    minWidth:
      0,

  },


  heading: {

    fontSize:
      '20px',

    fontWeight:
      600,

    color:
      '#ffffff',

    letterSpacing:
      '-0.3px',

    margin:
      0,

    whiteSpace:
      'nowrap',

  },


  expandBtn: {

    width:
      '34px',

    height:
      '34px',

    borderRadius:
      '10px',

    border:
      '1px solid rgba(255, 255, 255, 0.16)',

    background:
      'rgba(255, 255, 255, 0.07)',

    display:
      'flex',

    alignItems:
      'center',

    justifyContent:
      'center',

    cursor:
      'pointer',

    flexShrink:
      0,

  },


  /* =====================================================
     MESSAGE CONTAINER
  ===================================================== */

  messagesContainer: {

    display:
      'flex',

    flexDirection:
      'column',

    gap:
      '14px',

    flex:
      '1 1 0',

    minHeight:
      0,

    height:
      0,

    overflowY:
      'auto',

    overflowX:
      'hidden',

    paddingRight:
      '6px',

    paddingBottom:
      '4px',

    scrollbarWidth:
      'thin',

    scrollbarColor:
      'rgba(148, 163, 184, 0.35) transparent',

  },


  /* =====================================================
     SKELETON
  ===================================================== */

  skeletonContainer: {

    width:
      '100%',

    minHeight:
      '100%',

    display:
      'flex',

    flexDirection:
      'column',

    gap:
      '20px',

    padding:
      '8px 2px 12px',

    boxSizing:
      'border-box',

  },


  skeletonMessageRow: {

    display:
      'flex',

    alignItems:
      'flex-start',

    gap:
      '12px',

    width:
      '100%',

  },


  skeletonAvatar: {

    width:
      '38px',

    height:
      '38px',

    borderRadius:
      '50%',

    flexShrink:
      0,

  },


  skeletonAiContent: {

    flex:
      '1 1 auto',

    display:
      'flex',

    flexDirection:
      'column',

    gap:
      '9px',

    paddingTop:
      '5px',

    minWidth:
      0,

  },


  skeletonLineLarge: {

    width:
      '88%',

    height:
      '12px',

    borderRadius:
      '999px',

  },


  skeletonLineMedium: {

    width:
      '68%',

    height:
      '12px',

    borderRadius:
      '999px',

  },


  skeletonLineSmall: {

    width:
      '46%',

    height:
      '12px',

    borderRadius:
      '999px',

  },


  skeletonUserRow: {

    width:
      '100%',

    display:
      'flex',

    justifyContent:
      'flex-end',

  },


  skeletonUserBubble: {

    width:
      '42%',

    height:
      '42px',

    borderRadius:
      '20px 20px 4px 20px',

  },


  skeletonEmptyArea: {

    flex:
      '1 1 auto',

    minHeight:
      '150px',

    display:
      'flex',

    flexDirection:
      'column',

    alignItems:
      'center',

    justifyContent:
      'center',

    gap:
      '12px',

    padding:
      '16px',

  },


  skeletonCenterLogo: {

    width:
      '58px',

    height:
      '58px',

    borderRadius:
      '50%',

    marginBottom:
      '4px',

  },


  skeletonCenterTitle: {

    width:
      '155px',

    height:
      '16px',

    borderRadius:
      '999px',

  },


  skeletonCenterDescription: {

    width:
      '72%',

    height:
      '11px',

    borderRadius:
      '999px',

  },


  /* =====================================================
     EMPTY CHAT
  ===================================================== */

  emptyState: {

    flex:
      '1 1 auto',

    minHeight:
      0,

    width:
      '100%',

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
      '12px 20px',

    boxSizing:
      'border-box',

  },


  emptyLogoWrapper: {

    width:
      '58px',

    height:
      '58px',

    borderRadius:
      '50%',

    overflow:
      'hidden',

    display:
      'flex',

    alignItems:
      'center',

    justifyContent:
      'center',

    border:
      '1px solid rgba(255, 255, 255, 0.3)',

    backgroundColor:
      'rgba(255, 255, 255, 0.1)',

    marginBottom:
      '12px',

    flexShrink:
      0,

  },


  emptyLogo: {

    width:
      '100%',

    height:
      '100%',

    objectFit:
      'cover',

  },


  emptyTitle: {

    margin:
      0,

    fontSize:
      '17px',

    fontWeight:
      600,

    color:
      '#ffffff',

    lineHeight:
      '1.4',

  },


  emptyDescription: {

    margin:
      '5px 0 0',

    maxWidth:
      '300px',

    fontSize:
      '12px',

    fontWeight:
      400,

    color:
      'rgba(255, 255, 255, 0.72)',

    lineHeight:
      '1.55',

  },


  /* =====================================================
     USER
  ===================================================== */

  userBubbleWrapper: {

    display:
      'flex',

    justifyContent:
      'flex-end',

    width:
      '100%',

    flexShrink:
      0,

  },


  userBubble: {

    backgroundColor:
      '#e2e8f0',

    color:
      '#0f172a',

    padding:
      '10px 18px',

    borderRadius:
      '20px 20px 4px 20px',

    fontSize:
      '14px',

    fontWeight:
      500,

    boxShadow:
      '0 2px 8px rgba(0,0,0,0.15)',

    maxWidth:
      '80%',

    overflowWrap:
      'anywhere',

    boxSizing:
      'border-box',

  },


  userText: {

    margin:
      0,

    fontSize:
      '14px',

    color:
      '#0f172a',

    lineHeight:
      '1.5',

    whiteSpace:
      'pre-wrap',

    wordBreak:
      'break-word',

  },


  /* =====================================================
     AI
  ===================================================== */

  aiBubbleWrapper: {

    display:
      'flex',

    alignItems:
      'flex-start',

    gap:
      '12px',

    width:
      '100%',

    flexShrink:
      0,

    minWidth:
      0,

  },


  aiAvatarWrapper: {

    width:
      '38px',

    height:
      '38px',

    borderRadius:
      '50%',

    overflow:
      'hidden',

    display:
      'flex',

    alignItems:
      'center',

    justifyContent:
      'center',

    border:
      '1px solid rgba(255, 255, 255, 0.3)',

    flexShrink:
      0,

    backgroundColor:
      'rgba(255, 255, 255, 0.1)',

  },


  avatarImg: {

    width:
      '100%',

    height:
      '100%',

    objectFit:
      'cover',

  },


  aiBubble: {

    backgroundColor:
      'rgba(248, 250, 252, 0.94)',

    padding:
      '14px 18px',

    borderRadius:
      '4px 22px 22px 22px',

    boxShadow:
      '0 4px 16px rgba(0,0,0,0.12)',

    maxWidth:
      '85%',

    minWidth:
      0,

    overflowWrap:
      'anywhere',

    boxSizing:
      'border-box',

  },


  aiText: {

    fontSize:
      '13px',

    color:
      '#1e293b',

    lineHeight:
      '1.55',

    margin:
      0,

    whiteSpace:
      'pre-wrap',

    wordBreak:
      'break-word',

  },


  /* =====================================================
     TYPING
  ===================================================== */

  typingContainer: {

    display:
      'flex',

    alignItems:
      'center',

    gap:
      '4px',

    height:
      '18px',

  },


  /* =====================================================
     CHIPS
  ===================================================== */

  chipList: {

    display:
      'flex',

    gap:
      '8px',

    marginTop:
      '12px',

    marginBottom:
      '14px',

    overflowX:
      'auto',

    overflowY:
      'hidden',

    paddingBottom:
      '2px',

    scrollbarWidth:
      'none',

    flexShrink:
      0,

    minWidth:
      0,

  },


  chip: {

    backgroundColor:
      'rgba(255, 255, 255, 0.08)',

    border:
      '1px solid rgba(255, 255, 255, 0.25)',

    color:
      '#ffffff',

    padding:
      '7px 14px',

    borderRadius:
      '20px',

    fontSize:
      '12px',

    fontWeight:
      400,

    cursor:
      'pointer',

    whiteSpace:
      'nowrap',

    backdropFilter:
      'blur(10px)',

    flexShrink:
      0,

  },


  /* =====================================================
     INPUT
  ===================================================== */

  inputSection: {

    display:
      'flex',

    alignItems:
      'center',

    gap:
      '10px',

    flexShrink:
      0,

    minWidth:
      0,

  },


  inputWrapper: {

    flex:
      '1 1 auto',

    minWidth:
      0,

    display:
      'flex',

    alignItems:
      'center',

    backgroundColor:
      'rgba(255, 255, 255, 0.92)',

    borderRadius:
      '25px',

    padding:
      '8px 16px',

    boxShadow:
      '0 2px 10px rgba(0, 0, 0, 0.1)',

  },


  input: {

    flex:
      1,

    minWidth:
      0,

    background:
      'transparent',

    border:
      'none',

    outline:
      'none',

    color:
      '#0f172a',

    fontSize:
      '14px',

    fontWeight:
      400,

  },


  /* =====================================================
     MICROPHONE
  ===================================================== */

  iconBtn: {

    background:
      'none',

    border:
      'none',

    cursor:
      'pointer',

    display:
      'flex',

    alignItems:
      'center',

    padding:
      '2px',

    flexShrink:
      0,

  },


  /* =====================================================
     SEND
  ===================================================== */

  sendBtn: {

    backgroundColor:
      '#0369a1',

    border:
      'none',

    borderRadius:
      '50%',

    width:
      '40px',

    height:
      '40px',

    display:
      'flex',

    alignItems:
      'center',

    justifyContent:
      'center',

    flexShrink:
      0,

    boxShadow:
      '0 4px 12px rgba(2, 132, 199, 0.4)',

  },

};