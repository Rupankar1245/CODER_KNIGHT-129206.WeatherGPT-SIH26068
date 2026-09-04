import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Sparkles,
  Mic,
  Send,
  MessageSquare,
  Menu,
  PanelLeftClose,
  Plus,
  Trash2,
  X,
} from 'lucide-react';

import {
  useAiChat,
} from './AiChatProvider';

import type {
  ChatConversation,
} from './AiChatProvider';


/* =========================================================
   COMPONENT
========================================================= */

export const AiChatInterface: React.FC = () => {


  /* =======================================================
     SHARED CHAT
  ======================================================= */

  const {
    conversations,
    activeConversationId,
    messages,
    isLoading,
    sendMessage,
    createNewChat,
    selectConversation,
    deleteConversation,
  } = useAiChat();


  /* =======================================================
     LOCAL STATE
  ======================================================= */

  const [
    input,
    setInput,
  ] = useState('');


  /*
    IMPORTANT:
    Sidebar always starts CLOSED.
  */

  const [
    isHistoryOpen,
    setIsHistoryOpen,
  ] = useState(
    false
  );


  const [
    isMobile,
    setIsMobile,
  ] = useState(
    false
  );


  /* =======================================================
     REFS
  ======================================================= */

  const messagesContainerRef =
    useRef<HTMLDivElement | null>(
      null
    );


  /* =======================================================
     SCREEN SIZE
  ======================================================= */

  useEffect(() => {

    const handleResize = () => {

      const mobile =
        window.innerWidth <= 767;


      setIsMobile(
        mobile
      );


      /*
        Only close sidebar when switching
        to mobile.

        DO NOT automatically open it
        on desktop.
      */

      if (
        mobile
      ) {

        setIsHistoryOpen(
          false
        );

      }

    };


    handleResize();


    window.addEventListener(
      'resize',
      handleResize
    );


    return () => {

      window.removeEventListener(
        'resize',
        handleResize
      );

    };

  }, []);


  /* =======================================================
     AUTO SCROLL
  ======================================================= */

  useEffect(() => {

    const container =
      messagesContainerRef.current;


    if (!container) {
      return;
    }


    requestAnimationFrame(() => {

      container.scrollTo({

        top:
          container.scrollHeight,

        behavior:
          'smooth',

      });

    });

  }, [
    messages,
    isLoading,
    activeConversationId,
  ]);


  /* =======================================================
     SEND MESSAGE
  ======================================================= */

  const handleSend =
    async (
      customMessage?: string
    ) => {


      const userMessage =
        customMessage !== undefined
          ? customMessage.trim()
          : input.trim();


      if (
        !userMessage
      ) {
        return;
      }


      if (
        isLoading
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
     NEW CHAT
  ======================================================= */

  const handleNewChat = () => {

    if (
      isLoading
    ) {
      return;
    }


    createNewChat();


    setInput('');


    /*
      On mobile close sidebar after
      creating a new chat.
    */

    if (
      isMobile
    ) {

      setIsHistoryOpen(
        false
      );

    }

  };


  /* =======================================================
     SELECT CHAT
  ======================================================= */

  const handleSelectChat = (
    conversationId: string
  ) => {

    if (
      isLoading
    ) {
      return;
    }


    selectConversation(
      conversationId
    );


    /*
      On mobile close sidebar after
      selecting a conversation.
    */

    if (
      isMobile
    ) {

      setIsHistoryOpen(
        false
      );

    }

  };


  /* =======================================================
     DELETE CHAT
  ======================================================= */

  const handleDeleteChat = (
    event:
      React.MouseEvent<
        HTMLButtonElement
      >,

    conversationId: string
  ) => {

    event.stopPropagation();


    if (
      isLoading
    ) {
      return;
    }


    deleteConversation(
      conversationId
    );

  };


  /* =======================================================
     QUICK QUESTIONS
  ======================================================= */

  const suggestions = [

    {
      label:
        'Rain today?',

      question:
        'Will it rain today?',
    },


    {
      label:
        'Travel safety',

      question:
        'Is it safe to travel today?',
    },


    {
      label:
        'What should I wear?',

      question:
        'What should I wear based on today’s weather?',
    },


    {
      label:
        'Weather advice',

      question:
        'Give me a useful weather recommendation for today.',
    },

  ];


  /* =======================================================
     DATE HELPERS
  ======================================================= */

  const getDayStart = (
    date:
      Date
  ) => {

    return new Date(

      date.getFullYear(),

      date.getMonth(),

      date.getDate()

    ).getTime();

  };


  /* =======================================================
     GROUP CONVERSATIONS
  ======================================================= */

  const groupedConversations =
    useMemo(() => {


      const todayStart =
        getDayStart(
          new Date()
        );


      const yesterdayStart =
        todayStart -
        (24 * 60 * 60 * 1000);


      const groups: {

        today:
          ChatConversation[];

        yesterday:
          ChatConversation[];

        older:
          ChatConversation[];

      } = {

        today: [],

        yesterday: [],

        older: [],

      };


      const sorted =
        [...conversations]
          .sort(
            (
              a,
              b
            ) =>
              b.updatedAt -
              a.updatedAt
          );


      sorted.forEach(
        (
          conversation
        ) => {


          if (
            conversation.updatedAt >=
            todayStart
          ) {

            groups.today.push(
              conversation
            );

          }


          else if (

            conversation.updatedAt >=
            yesterdayStart

          ) {

            groups.yesterday.push(
              conversation
            );

          }


          else {

            groups.older.push(
              conversation
            );

          }

        }
      );


      return groups;

    }, [
      conversations
    ]);


  /* =======================================================
     HISTORY GROUP
  ======================================================= */

  const renderHistoryGroup = (

    title:
      string,

    chats:
      ChatConversation[]

  ) => {


    if (
      chats.length === 0
    ) {

      return null;

    }


    return (

      <div
        className="ai-history-group"
      >


        <div
          className="ai-history-group-title"
        >

          {title}

        </div>


        <div
          className="ai-history-list"
        >


          {chats.map(
            (
              conversation
            ) => (

              <div
                key={
                  conversation.id
                }
                className={
                  conversation.id ===
                  activeConversationId
                    ? 'ai-history-item ai-history-item-active'
                    : 'ai-history-item'
                }
                onClick={() =>
                  handleSelectChat(
                    conversation.id
                  )
                }
                role="button"
                tabIndex={0}
              >


                <div
                  className="ai-history-item-content"
                >

                  <MessageSquare
                    size={15}
                  />


                  <span>

                    {
                      conversation.title
                    }

                  </span>

                </div>


                <button
                  type="button"
                  className="ai-history-delete"
                  aria-label="Delete chat"
                  onClick={
                    (event) =>
                      handleDeleteChat(
                        event,
                        conversation.id
                      )
                  }
                >

                  <Trash2
                    size={14}
                  />

                </button>


              </div>

            )
          )}

        </div>

      </div>

    );

  };


  /* =======================================================
     RENDER SUGGESTIONS
  ======================================================= */

  const renderSuggestions = () => (

    <div
      className="ai-interface-suggestions"
    >

      {suggestions.map(
        (
          suggestion
        ) => (

          <button
            key={
              suggestion.label
            }
            type="button"
            onClick={() =>
              void handleSend(
                suggestion.question
              )
            }
            disabled={
              isLoading
            }
          >

            <MessageSquare
              size={15}
            />


            {
              suggestion.label
            }

          </button>

        )
      )}

    </div>

  );


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <div
      className="ai-interface"
    >


      {/* =================================================
          MOBILE BACKDROP
      ================================================= */}

      {isMobile &&
        isHistoryOpen && (

          <div
            className="ai-history-backdrop"
            onClick={() =>
              setIsHistoryOpen(
                false
              )
            }
          />

        )}


      {/* =================================================
          HISTORY SIDEBAR
      ================================================= */}

      <aside
        className={
          isHistoryOpen
            ? 'ai-history-sidebar ai-history-sidebar-open'
            : 'ai-history-sidebar'
        }
      >


        {/* =============================================
            HISTORY HEADER
        ============================================= */}

        <div
          className="ai-history-header"
        >


          <div
            className="ai-history-brand"
          >

            <Sparkles
              size={19}
              color="#fbbf24"
            />


            <span>
              MeghAI
            </span>

          </div>


          <button
            type="button"
            className="ai-history-close"
            onClick={() =>
              setIsHistoryOpen(
                false
              )
            }
            aria-label="Close history"
          >

            <X
              size={18}
            />

          </button>


        </div>


        {/* =============================================
            NEW CHAT
        ============================================= */}

        <button
          type="button"
          className="ai-new-chat-button"
          onClick={
            handleNewChat
          }
          disabled={
            isLoading
          }
        >

          <Plus
            size={18}
          />


          <span>
            New Chat
          </span>

        </button>


        {/* =============================================
            HISTORY LIST
        ============================================= */}

        <div
          className="ai-history-scroll"
        >

          {renderHistoryGroup(
            'Today',
            groupedConversations.today
          )}


          {renderHistoryGroup(
            'Yesterday',
            groupedConversations.yesterday
          )}


          {renderHistoryGroup(
            'Older',
            groupedConversations.older
          )}

        </div>


        {/* =============================================
            FOOTER
        ============================================= */}

        <div
          className="ai-history-footer"
        >

          <span>
            MeghAI Weather Intelligence
          </span>

        </div>


      </aside>


      {/* =================================================
          MAIN CHAT
      ================================================= */}

      <div
        className="ai-interface-main"
      >


        {/* =============================================
            TOP BAR
        ============================================= */}

        <div
          className="ai-interface-topbar"
        >


          <div
            className="ai-interface-title"
          >


            <button
              type="button"
              className="ai-menu-button"
              onClick={() =>
                setIsHistoryOpen(
                  (
                    previous
                  ) =>
                    !previous
                )
              }
              aria-label="Toggle chat history"
            >

              {isHistoryOpen &&
              !isMobile ? (

                <PanelLeftClose
                  size={20}
                />

              ) : (

                <Menu
                  size={21}
                />

              )}

            </button>


            <div
              className="ai-interface-icon"
            >

              <Sparkles
                size={22}
                color="#fbbf24"
              />

            </div>


            <div
              className="ai-title-text"
            >

              <h1>
                Ask MeghAI
              </h1>


              <p>
                Your intelligent weather assistant
              </p>

            </div>


          </div>


          {/* ===========================================
              STATUS
          =========================================== */}

          <div
            className="ai-interface-status"
          >

            <span
              className="ai-status-dot"
            />


            <span>
              Online
            </span>

          </div>


        </div>


        {/* =============================================
            CHAT BODY
        ============================================= */}

        <div
          className="ai-interface-body"
        >


          {/* ===========================================
              EMPTY CHAT STATE
          =========================================== */}

          {messages.length ===
            0 ? (

            <div
              className="ai-empty-chat-state"
            >


              <div
                className="ai-chat-welcome"
              >


                <div
                  className="ai-welcome-logo"
                >

                  <img
                    src="/logo.png"
                    alt="MeghAI"
                  />

                </div>


                <h2>
                  How can I help you today?
                </h2>


                <p>
                  Ask me about weather,
                  forecasts, rain, travel
                  conditions, or climate.
                </p>


              </div>


              {renderSuggestions()}


            </div>

          ) : (

            <>


              {/* =========================================
                  MESSAGES
              ========================================= */}

              <div
                ref={
                  messagesContainerRef
                }
                className="ai-interface-messages"
              >


                {messages.map(
                  (
                    message
                  ) => (

                    <div
                      key={
                        message.id
                      }
                      className={
                        message.role ===
                        'user'
                          ? 'ai-full-user-row'
                          : 'ai-full-bot-row'
                      }
                    >


                      {/* =================================
                          AI AVATAR
                      ================================= */}

                      {message.role ===
                        'ai' && (

                        <div
                          className="ai-full-avatar"
                        >

                          <img
                            src="/logo.png"
                            alt="MeghAI"
                          />

                        </div>

                      )}


                      {/* =================================
                          MESSAGE
                      ================================= */}

                      <div
                        className={
                          message.role ===
                          'user'
                            ? 'ai-full-user-message'
                            : 'ai-full-bot-message'
                        }
                      >

                        {
                          message.text
                        }

                      </div>


                    </div>

                  )
                )}


                {/* =======================================
                    TYPING
                ======================================= */}

                {isLoading && (

                  <div
                    className="ai-full-bot-row"
                  >


                    <div
                      className="ai-full-avatar"
                    >

                      <img
                        src="/logo.png"
                        alt="MeghAI"
                      />

                    </div>


                    <div
                      className="
                        ai-full-bot-message
                        ai-typing-bubble
                      "
                    >

                      <span />

                      <span />

                      <span />

                    </div>


                  </div>

                )}


              </div>


              {/* =========================================
                  SUGGESTIONS
              ========================================= */}

              {renderSuggestions()}


            </>

          )}


        </div>


        {/* =============================================
            INPUT AREA
        ============================================= */}

        <div
          className="ai-interface-input-area"
        >


          <div
            className="ai-interface-input-wrapper"
          >


            <input
              type="text"
              value={input}
              placeholder={
                isLoading
                  ? 'MeghAI is thinking...'
                  : 'Ask anything about weather...'
              }
              onChange={
                (event) =>
                  setInput(
                    event.target.value
                  )
              }
              onKeyDown={
                handleKeyDown
              }
              disabled={
                isLoading
              }
            />


            <button
              type="button"
              className="ai-mic-button"
              title="Voice input"
              disabled={
                isLoading
              }
              aria-label="Voice input"
            >

              <Mic
                size={19}
              />

            </button>


          </div>


          <button
            type="button"
            className="ai-send-button"
            onClick={() =>
              void handleSend()
            }
            disabled={
              isLoading ||
              !input.trim()
            }
            aria-label="Send message"
          >

            <Send
              size={18}
            />

          </button>


        </div>


      </div>


      {/* =================================================
          STYLES
      ================================================= */}

      <style>{`

        /* =============================================
           ROOT
        ============================================= */

        .ai-interface {
          width: 100%;
          height: 100%;
          min-height: 0;
          display: flex;
          position: relative;
          border-radius: 24px;
          overflow: hidden;

          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.12),
              rgba(255, 255, 255, 0.05)
            );

          backdrop-filter:
            blur(20px);

          -webkit-backdrop-filter:
            blur(20px);

          border:
            1px solid
            rgba(255, 255, 255, 0.16);

          box-shadow:
            0 8px 32px
            rgba(0, 0, 0, 0.25);
        }


        /* =============================================
           HISTORY SIDEBAR
        ============================================= */

        .ai-history-sidebar {
          width: 0;
          min-width: 0;
          height: 100%;
          opacity: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;

          background:
            linear-gradient(
              180deg,
              rgba(10, 35, 60, 0.42),
              rgba(8, 27, 48, 0.28)
            );

          backdrop-filter:
            blur(22px)
            saturate(140%);

          -webkit-backdrop-filter:
            blur(22px)
            saturate(140%);

          border-right:
            1px solid
            rgba(255, 255, 255, 0.10);

          box-shadow:
            inset -1px 0 0
            rgba(255, 255, 255, 0.025),
            8px 0 28px
            rgba(0, 0, 0, 0.10);

          transition:
            width 0.28s ease,
            min-width 0.28s ease,
            opacity 0.2s ease;

          z-index: 20;
        }


        .ai-history-sidebar-open {
          width: 270px;
          min-width: 270px;
          opacity: 1;
        }


        /* =============================================
           HISTORY HEADER
        ============================================= */

        .ai-history-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;

          padding:
            20px
            18px;

          background:
            rgba(255, 255, 255, 0.025);

          border-bottom:
            1px solid
            rgba(255, 255, 255, 0.09);
        }


        .ai-history-brand {
          display: flex;
          align-items: center;
          gap: 9px;

          color: #ffffff;
          font-size: 16px;
          font-weight: 650;
        }


        .ai-history-close {
          width: 34px;
          height: 34px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: none;
          border-radius: 9px;

          background: transparent;

          color:
            rgba(255, 255, 255, 0.65);

          cursor: pointer;
        }


        .ai-history-close:hover {
          background:
            rgba(255, 255, 255, 0.08);

          color: #ffffff;
        }


        /* =============================================
           NEW CHAT
        ============================================= */

        .ai-new-chat-button {
          margin: 16px;

          width:
            calc(100% - 32px);

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 9px;
          padding: 12px;

          border:
            1px solid
            rgba(56, 189, 248, 0.35);

          border-radius: 12px;

          background:
            linear-gradient(
              135deg,
              rgba(2, 132, 199, 0.28),
              rgba(3, 105, 161, 0.2)
            );

          color: #ffffff;

          font-size: 13px;
          font-weight: 600;

          cursor: pointer;

          transition:
            all
            0.2s
            ease;
        }


        .ai-new-chat-button:hover:not(:disabled) {
          transform:
            translateY(-1px);

          background:
            linear-gradient(
              135deg,
              rgba(2, 132, 199, 0.45),
              rgba(3, 105, 161, 0.3)
            );
        }


        .ai-new-chat-button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }


        /* =============================================
           HISTORY SCROLL
        ============================================= */

        .ai-history-scroll {
          flex: 1;
          min-height: 0;

          overflow-y: auto;
          overflow-x: hidden;

          padding:
            4px
            10px
            14px;
        }


        .ai-history-group {
          margin-bottom: 18px;
        }


        .ai-history-group-title {
          padding:
            7px
            8px;

          color:
            rgba(255, 255, 255, 0.42);

          font-size: 11px;
          font-weight: 600;

          text-transform: uppercase;
          letter-spacing: 0.7px;
        }


        .ai-history-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }


        .ai-history-item {
          width: 100%;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 6px;

          padding:
            10px
            8px;

          border-radius: 10px;

          cursor: pointer;

          color:
            rgba(255, 255, 255, 0.7);

          transition:
            background
            0.18s
            ease;
        }


        .ai-history-item:hover {
          background:
            rgba(255, 255, 255, 0.07);

          color: #ffffff;
        }


        .ai-history-item-active {
          background:
            rgba(56, 189, 248, 0.13);

          color: #ffffff;

          border:
            1px solid
            rgba(56, 189, 248, 0.18);
        }


        .ai-history-item-content {
          min-width: 0;

          display: flex;
          align-items: center;

          gap: 9px;

          flex: 1;
        }


        .ai-history-item-content svg {
          flex-shrink: 0;
        }


        .ai-history-item-content span {
          overflow: hidden;

          white-space: nowrap;

          text-overflow: ellipsis;

          font-size: 12px;
        }


        .ai-history-delete {
          width: 28px;
          height: 28px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          border: none;
          border-radius: 7px;

          background: transparent;

          color:
            rgba(255, 255, 255, 0.4);

          cursor: pointer;

          opacity: 0;

          transition:
            all
            0.18s
            ease;
        }


        .ai-history-item:hover
        .ai-history-delete {
          opacity: 1;
        }


        .ai-history-delete:hover {
          background:
            rgba(239, 68, 68, 0.15);

          color: #f87171;
        }


        /* =============================================
           HISTORY FOOTER
        ============================================= */

        .ai-history-footer {
          flex-shrink: 0;

          padding:
            14px
            16px;

          border-top:
            1px solid
            rgba(255, 255, 255, 0.08);

          color:
            rgba(255, 255, 255, 0.35);

          font-size: 10px;

          text-align: center;
        }


        /* =============================================
           MAIN
        ============================================= */

        .ai-interface-main {
          flex: 1;

          width: 0;
          min-width: 0;
          min-height: 0;

          height: 100%;

          display: flex;
          flex-direction: column;

          overflow: hidden;
        }


        /* =============================================
           TOPBAR
        ============================================= */

        .ai-interface-topbar {
          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding:
            18px
            24px;

          border-bottom:
            1px solid
            rgba(255, 255, 255, 0.12);
        }


        .ai-interface-title {
          min-width: 0;

          display: flex;
          align-items: center;

          gap: 13px;
        }


        .ai-title-text {
          min-width: 0;
        }


        .ai-menu-button {
          width: 38px;
          height: 38px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: none;
          border-radius: 10px;

          background:
            rgba(255, 255, 255, 0.07);

          color:
            rgba(255, 255, 255, 0.8);

          cursor: pointer;
          flex-shrink: 0;

          transition:
            all
            0.2s
            ease;
        }


        .ai-menu-button:hover {
          background:
            rgba(255, 255, 255, 0.13);

          color: #ffffff;
        }


        .ai-interface-icon {
          width: 46px;
          height: 46px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 14px;

          background:
            rgba(251, 191, 36, 0.12);

          border:
            1px solid
            rgba(251, 191, 36, 0.2);

          flex-shrink: 0;
        }


        .ai-interface-title h1 {
          margin: 0;

          font-size: 21px;
          font-weight: 650;

          color: #ffffff;
        }


        .ai-interface-title p {
          margin:
            4px
            0
            0;

          font-size: 13px;

          color:
            rgba(255, 255, 255, 0.65);

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }


        .ai-interface-status {
          flex-shrink: 0;

          display: flex;
          align-items: center;

          gap: 7px;

          font-size: 12px;

          color:
            rgba(255, 255, 255, 0.75);

          padding:
            7px
            12px;

          border-radius: 20px;

          background:
            rgba(255, 255, 255, 0.07);

          border:
            1px solid
            rgba(255, 255, 255, 0.1);
        }


        .ai-status-dot {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #22c55e;

          box-shadow:
            0 0 8px
            rgba(34, 197, 94, 0.8);
        }


        /* =============================================
           CHAT BODY
        ============================================= */

        .ai-interface-body {
          flex: 1;
          min-height: 0;

          overflow: hidden;

          display: flex;
          flex-direction: column;

          padding:
            18px
            24px
            12px;
        }


        /* =============================================
           EMPTY CHAT
        ============================================= */

        .ai-empty-chat-state {
          flex: 1;
          min-height: 0;

          display: flex;
          flex-direction: column;

          align-items: center;
          justify-content: center;

          padding:
            20px
            10px;
        }


        .ai-empty-chat-state
        .ai-interface-suggestions {
          justify-content: center;

          margin-top: 8px;

          max-width: 650px;
        }


        /* =============================================
           WELCOME
        ============================================= */

        .ai-chat-welcome {
          flex-shrink: 0;

          text-align: center;

          padding:
            6px
            20px
            16px;
        }


        .ai-welcome-logo {
          width: 58px;
          height: 58px;

          margin:
            0
            auto
            12px;

          border-radius: 50%;
          overflow: hidden;

          border:
            1px solid
            rgba(255, 255, 255, 0.25);

          box-shadow:
            0 0 22px
            rgba(56, 189, 248, 0.3);
        }


        .ai-welcome-logo img {
          width: 100%;
          height: 100%;

          object-fit: cover;
        }


        .ai-chat-welcome h2 {
          margin: 0;

          color: #ffffff;

          font-size: 20px;
        }


        .ai-chat-welcome p {
          margin:
            8px
            0
            0;

          color:
            rgba(255, 255, 255, 0.65);

          font-size: 13px;

          line-height: 1.5;
        }


        /* =============================================
           MESSAGES
        ============================================= */

        .ai-interface-messages {
          flex: 1;
          min-height: 0;

          overflow-y: auto;
          overflow-x: hidden;

          display: flex;
          flex-direction: column;

          gap: 16px;

          padding:
            8px
            6px
            14px;

          scrollbar-width: thin;

          scrollbar-color:
            rgba(255, 255, 255, 0.2)
            transparent;
        }


        .ai-full-user-row {
          display: flex;

          justify-content: flex-end;

          width: 100%;

          flex-shrink: 0;
        }


        .ai-full-bot-row {
          display: flex;

          align-items: flex-start;

          gap: 12px;

          width: 100%;

          flex-shrink: 0;
        }


        .ai-full-avatar {
          width: 40px;
          height: 40px;

          flex-shrink: 0;

          border-radius: 50%;

          overflow: hidden;

          border:
            1px solid
            rgba(255, 255, 255, 0.25);
        }


        .ai-full-avatar img {
          width: 100%;
          height: 100%;

          object-fit: cover;
        }


        .ai-full-user-message {
          max-width: 72%;

          padding:
            12px
            18px;

          border-radius:
            22px
            22px
            5px
            22px;

          background: #e2e8f0;

          color: #0f172a;

          font-size: 14px;

          line-height: 1.55;

          box-shadow:
            0 3px 12px
            rgba(0, 0, 0, 0.15);

          white-space: pre-wrap;

          word-break: break-word;
        }


        .ai-full-bot-message {
          max-width: 76%;

          padding:
            14px
            18px;

          border-radius:
            5px
            22px
            22px
            22px;

          background:
            rgba(248, 250, 252, 0.95);

          color: #1e293b;

          font-size: 14px;

          line-height: 1.6;

          box-shadow:
            0 4px 16px
            rgba(0, 0, 0, 0.12);

          white-space: pre-wrap;

          word-break: break-word;
        }


        /* =============================================
           TYPING
        ============================================= */

        .ai-typing-bubble {
          display: flex;

          align-items: center;

          gap: 5px;

          min-width: 54px;
        }


        .ai-typing-bubble span {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #64748b;

          animation:
            aiTyping
            1.2s
            infinite
            ease-in-out;
        }


        .ai-typing-bubble span:nth-child(2) {
          animation-delay: 0.15s;
        }


        .ai-typing-bubble span:nth-child(3) {
          animation-delay: 0.3s;
        }


        @keyframes aiTyping {

          0%,
          60%,
          100% {

            transform:
              translateY(0);

            opacity: 0.4;

          }


          30% {

            transform:
              translateY(-5px);

            opacity: 1;

          }

        }


        /* =============================================
           SUGGESTIONS
        ============================================= */

        .ai-interface-suggestions {
          flex-shrink: 0;

          display: flex;

          flex-wrap: wrap;

          gap: 8px;

          padding:
            10px
            0
            4px;
        }


        .ai-interface-suggestions button {
          display: flex;

          align-items: center;

          gap: 7px;

          padding:
            8px
            13px;

          border-radius: 20px;

          border:
            1px solid
            rgba(255, 255, 255, 0.18);

          background:
            rgba(255, 255, 255, 0.07);

          color:
            rgba(255, 255, 255, 0.9);

          font-size: 12px;

          cursor: pointer;

          transition:
            all
            0.2s
            ease;
        }


        .ai-interface-suggestions
        button:hover:not(:disabled) {
          transform:
            translateY(-1px);

          background:
            rgba(56, 189, 248, 0.12);

          border-color:
            rgba(56, 189, 248, 0.35);
        }


        .ai-interface-suggestions
        button:disabled {
          opacity: 0.45;

          cursor: not-allowed;
        }


        /* =============================================
           INPUT AREA
        ============================================= */

        .ai-interface-input-area {
          flex-shrink: 0;

          display: flex;

          align-items: center;

          gap: 12px;

          padding:
            14px
            24px
            18px;

          border-top:
            1px solid
            rgba(255, 255, 255, 0.1);

          background:
            rgba(3, 19, 39, 0.12);
        }


        .ai-interface-input-wrapper {
          flex: 1;

          min-width: 0;

          display: flex;

          align-items: center;

          padding:
            10px
            16px;

          border-radius: 26px;

          background:
            rgba(255, 255, 255, 0.94);

          box-shadow:
            0 3px 14px
            rgba(0, 0, 0, 0.12);
        }


        .ai-interface-input-wrapper input {
          flex: 1;

          min-width: 0;

          border: none;
          outline: none;

          background: transparent;

          color: #0f172a;

          font-size: 14px;
        }


        .ai-interface-input-wrapper
        input:disabled {
          cursor: not-allowed;
        }


        .ai-mic-button {
          display: flex;

          align-items: center;
          justify-content: center;

          border: none;

          background: transparent;

          color: #475569;

          cursor: pointer;

          padding: 4px;

          flex-shrink: 0;
        }


        .ai-mic-button:disabled {
          opacity: 0.5;

          cursor: not-allowed;
        }


        .ai-send-button {
          width: 46px;
          height: 46px;

          display: flex;

          align-items: center;
          justify-content: center;

          border: none;

          border-radius: 50%;

          background:
            linear-gradient(
              135deg,
              #0284c7,
              #0369a1
            );

          color: #ffffff;

          cursor: pointer;

          flex-shrink: 0;

          box-shadow:
            0 5px 16px
            rgba(2, 132, 199, 0.4);

          transition:
            transform
            0.2s
            ease;
        }


        .ai-send-button:hover:not(:disabled) {
          transform:
            scale(1.06);
        }


        .ai-send-button:disabled {
          opacity: 0.5;

          cursor: not-allowed;
        }


        /* =============================================
           MOBILE BACKDROP
        ============================================= */

        .ai-history-backdrop {
          position: absolute;

          inset: 0;

          background:
            rgba(0, 0, 0, 0.5);

          z-index: 40;
        }


        /* =============================================
           MOBILE
        ============================================= */

        @media (max-width: 767px) {

          .ai-interface {
            border-radius: 18px;
          }


          .ai-history-sidebar {
            position: absolute;

            top: 0;
            left: 0;
            bottom: 0;

            width: 0;
            min-width: 0;

            z-index: 50;

            box-shadow:
              10px
              0
              30px
              rgba(0, 0, 0, 0.3);
          }


          .ai-history-sidebar-open {
            width: 280px;
            min-width: 280px;
          }


          .ai-interface-topbar {
            padding:
              14px
              16px;
          }


          .ai-interface-body {
            padding:
              14px
              16px
              10px;
          }


          .ai-interface-input-area {
            padding:
              12px
              16px
              16px;
          }


          .ai-interface-status {
            display: none;
          }


          .ai-full-user-message {
            max-width: 82%;
          }


          .ai-full-bot-message {
            max-width: 82%;
          }


          .ai-interface-suggestions {
            overflow-x: auto;

            flex-wrap: nowrap;

            padding-bottom: 4px;

            scrollbar-width: none;
          }


          .ai-interface-suggestions::-webkit-scrollbar {
            display: none;
          }


          .ai-interface-suggestions button {
            white-space: nowrap;

            flex-shrink: 0;
          }


          .ai-history-delete {
            opacity: 1;
          }


          .ai-empty-chat-state {
            justify-content: center;

            padding:
              10px
              4px;
          }

        }


        /* =============================================
           SMALL MOBILE
        ============================================= */

        @media (max-width: 479px) {

          .ai-history-sidebar-open {
            width:
              min(
                86vw,
                290px
              );

            min-width:
              min(
                86vw,
                290px
              );
          }


          .ai-interface-title {
            gap: 9px;
          }


          .ai-interface-title h1 {
            font-size: 18px;
          }


          .ai-interface-title p {
            font-size: 11px;
          }


          .ai-interface-icon {
            width: 40px;
            height: 40px;

            border-radius: 12px;
          }


          .ai-menu-button {
            width: 36px;
            height: 36px;
          }


          .ai-full-avatar {
            width: 34px;
            height: 34px;
          }


          .ai-interface-body {
            padding:
              10px
              12px
              8px;
          }


          .ai-interface-input-area {
            gap: 8px;

            padding:
              10px
              12px
              12px;
          }


          .ai-send-button {
            width: 42px;
            height: 42px;
          }


          .ai-interface-input-wrapper {
            padding:
              9px
              14px;
          }


          .ai-mic-button {
            padding: 2px;
          }


          .ai-chat-welcome h2 {
            font-size: 18px;
          }


          .ai-chat-welcome p {
            font-size: 12px;
          }


          .ai-welcome-logo {
            width: 52px;
            height: 52px;
          }

        }


        /* =============================================
           SCROLLBAR
        ============================================= */

        .ai-history-scroll::-webkit-scrollbar,
        .ai-interface-messages::-webkit-scrollbar {
          width: 5px;
        }


        .ai-history-scroll::-webkit-scrollbar-thumb,
        .ai-interface-messages::-webkit-scrollbar-thumb {
          background:
            rgba(255, 255, 255, 0.2);

          border-radius: 10px;
        }

      `}</style>


    </div>

  );

};


export default AiChatInterface;