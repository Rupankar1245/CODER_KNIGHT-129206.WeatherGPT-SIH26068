import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Sparkles,
  Mic,
  Send,
} from 'lucide-react';

import { GoogleGenAI } from '@google/genai';


/* =========================================================
   TYPES
   ========================================================= */

interface ChatMessage {
  id: number;
  role: 'user' | 'ai';
  text: string;
}


/* =========================================================
   GEMINI CONFIG
   ========================================================= */

const GEMINI_API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY;

const GEMINI_MODEL =
  import.meta.env.VITE_GEMINI_MODEL ||
  'gemini-2.5-flash';


/* =========================================================
   COMPONENT
   ========================================================= */

export const AiChatPanel: React.FC = () => {

  /* =======================================================
     STATE
     ======================================================= */

  const [messages, setMessages] =
    useState<ChatMessage[]>([
      {
        id: 1,
        role: 'user',
        text: 'Will it rain today?',
      },
      {
        id: 2,
        role: 'ai',
        text:
          'Hi! I’m MeghAI 🌦️ Ask me anything about weather, forecasts, travel conditions, or climate.',
      },
    ]);

  const [input, setInput] =
    useState('');

  const [isLoading, setIsLoading] =
    useState(false);


  /* =======================================================
     MESSAGE CONTAINER REF
     
     IMPORTANT:
     We DON'T use scrollIntoView().
     That was causing the whole dashboard to move.
     ======================================================= */

  const messagesContainerRef =
    useRef<HTMLDivElement | null>(null);


  /* =======================================================
     SCROLL CHAT ONLY
     ======================================================= */

  useEffect(() => {

    const container =
      messagesContainerRef.current;

    if (!container) {
      return;
    }

    /*
     * Only the internal chat container
     * will scroll.
     *
     * The dashboard page itself will
     * remain in the same position.
     */

    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });

  }, [messages, isLoading]);


  /* =======================================================
     GEMINI
     ======================================================= */

  const askGemini = async (
    userQuestion: string
  ): Promise<string> => {

    if (!GEMINI_API_KEY) {

      throw new Error(
        'Gemini API key is missing.'
      );

    }


    /* =====================================================
       CREATE GEMINI CLIENT
       ===================================================== */

    const ai =
      new GoogleGenAI({
        apiKey: GEMINI_API_KEY,
      });


    /* =====================================================
       CONVERSATION HISTORY
       ===================================================== */

    const conversationHistory =
      messages
        .map((message) => {

          const role =
            message.role === 'user'
              ? 'User'
              : 'MeghAI';

          return `${role}: ${message.text}`;

        })
        .join('\n');


    /* =====================================================
       MEGHAI PROMPT
       ===================================================== */

    const prompt = `
You are MeghAI, an intelligent conversational weather assistant.

Your role is to help users with:

- Weather
- Current conditions
- Temperature
- Rain
- Rain probability
- Humidity
- Wind
- Visibility
- Pressure
- Weather forecasts
- Travel safety
- Outdoor activities
- Weather-related recommendations
- Climate information

IMPORTANT RULES:

1. Be concise and useful.
2. Use natural conversational language.
3. Do not invent live weather data.
4. If real-time weather data is not provided, clearly mention that.
5. Do not pretend that you have access to the user's current weather unless data is provided.
6. For general weather questions, answer normally.
7. For location-specific weather questions, explain when live weather data is required.
8. Use emojis sparingly.
9. Keep answers easy to understand.
10. Answer the user's question directly.
11. Do not repeat the entire conversation.
12. Keep normal responses around 2-6 sentences unless more detail is requested.

You are part of a weather intelligence platform called MeghAI.

Previous conversation:
${conversationHistory}

User's new question:
${userQuestion}

Now answer the user's question as MeghAI.
`;


    /* =====================================================
       GEMINI REQUEST
       ===================================================== */

    const response =
      await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });


    /* =====================================================
       RESPONSE TEXT
       ===================================================== */

    const responseText =
      response.text?.trim();


    if (!responseText) {

      throw new Error(
        'Gemini returned an empty response.'
      );

    }


    return responseText;
  };


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


    /* =====================================================
       EMPTY MESSAGE
       ===================================================== */

    if (!userMessage) {
      return;
    }


    /* =====================================================
       PREVENT DOUBLE REQUEST
       ===================================================== */

    if (isLoading) {
      return;
    }


    /* =====================================================
       ADD USER MESSAGE IMMEDIATELY
       ===================================================== */

    const userChatMessage: ChatMessage = {
      id:
        Date.now(),
      role: 'user',
      text: userMessage,
    };


    setMessages((prev) => [
      ...prev,
      userChatMessage,
    ]);


    /* =====================================================
       CLEAR INPUT
       ===================================================== */

    setInput('');

    setIsLoading(true);


    /* =====================================================
       ASK GEMINI
       ===================================================== */

    try {

      const aiResponse =
        await askGemini(
          userMessage
        );


      /* ===================================================
         ADD AI RESPONSE
         =================================================== */

      const aiChatMessage: ChatMessage = {
        id:
          Date.now() + 1,
        role: 'ai',
        text: aiResponse,
      };


      /*
       * IMPORTANT:
       * Previous messages are preserved.
       *
       * We are NOT replacing the array.
       */

      setMessages((prev) => [
        ...prev,
        aiChatMessage,
      ]);

    }

    /* =====================================================
       ERROR
       ===================================================== */

    catch (error) {

      console.error(
        'Gemini API Error:',
        error
      );


      let errorMessage =
        'Sorry, I could not process that request right now.';


      if (error instanceof Error) {

        const message =
          error.message.toLowerCase();


        if (
          message.includes(
            'api key'
          )
        ) {

          errorMessage =
            'Gemini API key is missing or invalid. Please check your .env file.';

        }

        else if (
          message.includes('429')
        ) {

          errorMessage =
            'MeghAI is receiving too many requests right now. Please try again in a moment.';

        }

        else if (
          message.includes('403')
        ) {

          errorMessage =
            'Gemini API access was denied. Please check your API key and project permissions.';

        }

        else if (
          message.includes('404')
        ) {

          errorMessage =
            `The Gemini model "${GEMINI_MODEL}" was not found. Please check VITE_GEMINI_MODEL in your .env file.`;

        }

        else {

          errorMessage =
            'Something went wrong while connecting to MeghAI. Please try again.';

        }

      }


      /* ===================================================
         SHOW ERROR INSIDE CHAT
         =================================================== */

      setMessages((prev) => [
        ...prev,
        {
          id:
            Date.now() + 2,
          role: 'ai',
          text: errorMessage,
        },
      ]);

    }

    /* =====================================================
       FINISH
       ===================================================== */

    finally {

      setIsLoading(false);

    }

  };


  /* =======================================================
     ENTER KEY
     ======================================================= */

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {

    if (
      event.key === 'Enter' &&
      !event.shiftKey
    ) {

      event.preventDefault();

      handleSend();

    }

  };


  /* =======================================================
     QUICK QUESTIONS
     ======================================================= */

  const handleQuickQuestion = (
    question: string
  ) => {

    handleSend(question);

  };


  /* =======================================================
     RENDER
     ======================================================= */

  return (

    <div style={styles.card}>

      {/* =================================================
          HEADER
          ================================================= */}

      <div style={styles.titleRow}>

        <Sparkles
          size={20}
          color="#fbbf24"
          style={{
            filter:
              'drop-shadow(0 0 6px #fbbf24)',
          }}
        />

        <h3 style={styles.heading}>
          Ask MeghAI
        </h3>

      </div>


      {/* =================================================
          MESSAGE AREA

          THIS IS THE ONLY SCROLLABLE AREA
          ================================================= */}

      <div
        ref={messagesContainerRef}
        style={styles.messagesContainer}
      >

        {messages.map((message) => (

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

            {/* =========================================
                AI AVATAR
                ========================================= */}

            {message.role === 'ai' && (

              <div
                style={styles.aiAvatarWrapper}
                className="ai-avatar-glow"
              >

                <img
                  src="/logo.png"
                  alt="MeghAI"
                  style={styles.avatarImg}
                />

              </div>

            )}


            {/* =========================================
                MESSAGE BUBBLE
                ========================================= */}

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
            TYPING INDICATOR
            ================================================= */}

        {isLoading && (

          <div
            style={styles.aiBubbleWrapper}
            className="ai-message"
          >

            <div
              style={styles.aiAvatarWrapper}
              className="ai-avatar-glow"
            >

              <img
                src="/logo.png"
                alt="MeghAI"
                style={styles.avatarImg}
              />

            </div>


            <div style={styles.aiBubble}>

              <div
                style={styles.typingContainer}
              >

                <span className="typing-dot" />

                <span className="typing-dot" />

                <span className="typing-dot" />

              </div>

            </div>

          </div>

        )}

      </div>


      {/* =================================================
          QUICK QUESTIONS
          ================================================= */}

      <div style={styles.chipList}>

        <button
          className="chip-btn"
          style={styles.chip}
          onClick={() =>
            handleQuickQuestion(
              'Will it rain today?'
            )
          }
          disabled={isLoading}
        >
          Will it rain today?
        </button>


        <button
          className="chip-btn"
          style={styles.chip}
          onClick={() =>
            handleQuickQuestion(
              'Is it safe to travel today?'
            )
          }
          disabled={isLoading}
        >
          Is it safe to travel?
        </button>


        <button
          className="chip-btn"
          style={styles.chip}
          onClick={() =>
            handleQuickQuestion(
              'Give me a weather recommendation for today.'
            )
          }
          disabled={isLoading}
        >
          Weather suggestion
        </button>

      </div>


      {/* =================================================
          INPUT
          ================================================= */}

      <div style={styles.inputSection}>

        <div style={styles.inputWrapper}>

          <input
            type="text"
            value={input}
            placeholder={
              isLoading
                ? 'MeghAI is thinking...'
                : 'Chat a message...'
            }
            onChange={(event) =>
              setInput(
                event.target.value
              )
            }
            onKeyDown={handleKeyDown}
            style={styles.input}
            disabled={isLoading}
          />


          {/* MIC */}

          <button
            style={styles.iconBtn}
            title="Voice input"
            disabled={isLoading}
          >

            <Mic
              size={18}
              color="#475569"
            />

          </button>

        </div>


        {/* SEND */}

        <button
          style={{
            ...styles.sendBtn,

            opacity:
              isLoading ||
              !input.trim()
                ? 0.55
                : 1,

            cursor:
              isLoading ||
              !input.trim()
                ? 'not-allowed'
                : 'pointer',
          }}
          className="send-btn-hover"
          title="Send message"
          onClick={() =>
            handleSend()
          }
          disabled={
            isLoading ||
            !input.trim()
          }
        >

          <Send
            size={15}
            color="#ffffff"
            style={{
              transform:
                'rotate(45deg)',
              marginLeft: '-2px',
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


          /* =============================================
             TYPING DOTS
             ============================================= */

          @keyframes typingAnimation {

            0%,
            60%,
            100% {

              transform:
                translateY(0);

              opacity: 0.4;

            }

            30% {

              transform:
                translateY(-4px);

              opacity: 1;

            }

          }


          .typing-dot {

            width: 6px;
            height: 6px;

            border-radius: 50%;

            background:
              #64748b;

            display:
              inline-block;

            animation:
              typingAnimation
              1.2s
              infinite
              ease-in-out;

          }


          .typing-dot:nth-child(2) {

            animation-delay:
              0.15s;

          }


          .typing-dot:nth-child(3) {

            animation-delay:
              0.3s;

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

    height:
      '100%',

    minHeight:
      0,

    boxSizing:
      'border-box',

    overflow:
      'hidden',
  },


  /* =====================================================
     TITLE
     ===================================================== */

  titleRow: {

    display:
      'flex',

    alignItems:
      'center',

    gap:
      '10px',

    marginBottom:
      '14px',

    flexShrink:
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
  },


  /* =====================================================
     MESSAGE CONTAINER

     KEY FIX:
     -------------------------------
     This has its own scroll.
     It will NEVER scroll the dashboard.
     ===================================================== */

  messagesContainer: {

    display:
      'flex',

    flexDirection:
      'column',

    gap:
      '14px',

    flex:
      '1 1 auto',

    minHeight:
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
  },


  inputWrapper: {

    flex:
      1,

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