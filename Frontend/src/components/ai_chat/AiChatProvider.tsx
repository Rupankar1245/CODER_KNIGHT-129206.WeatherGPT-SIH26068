import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { GoogleGenAI } from '@google/genai';

/* =========================================================
   CHAT TYPES
========================================================= */

export interface ChatMessage {
  id: number;
  role: 'user' | 'ai';
  text: string;
}

export interface ChatConversation {
  id: string;
  title: string;

  messages: ChatMessage[];

  createdAt: number;
  updatedAt: number;
}

/* =========================================================
   WEATHER CONTEXT TYPES
========================================================= */

interface CurrentWeatherData {
  location: {
    name: string | null;
    country: string | null;

    latitude: number | null;
    longitude: number | null;
  };

  weather: {
    temperature: number | null;
    feels_like: number | null;

    temperature_min: number | null;
    temperature_max: number | null;

    pressure: number | null;
    humidity: number | null;

    condition: string | null;
    description: string | null;

    icon: string | null;
  };

  wind: {
    speed: number | null;

    direction: number | null;

    gust: number | null;
  };

  visibility: number | null;

  visibility_meters: number | null;

  clouds: number | null;

  rain: {
    last_1h: number | null;
    last_3h: number | null;
  };

  sun: {
    sunrise: number | null;
    sunset: number | null;
  };

  timezone: number | null;

  timestamp: number | null;
}

interface HourlyForecastItem {
  time: string;

  timestamp: number;

  tempVal: number;

  feelsLike: number;

  rainProbability: number;

  weather: string;
}

interface HourlyForecastData {
  location: {
    name: string | null;
    country: string | null;
  };

  forecast: HourlyForecastItem[];

  max_rain_probability: number;
}

interface FiveDayForecastItem {
  day: string;

  date: string;

  icon: string;

  iconUrl: string;

  minTemp: number;

  maxTemp: number;

  description: string;

  rainProbability: number;

  barColor: string;
}

interface FiveDayForecastData {
  location: {
    name: string | null;
    country: string | null;
  };

  forecast: FiveDayForecastItem[];
}

interface AirQualityData {
  aqi: number | null;

  pm25: number | null;

  pm10: number | null;

  co: number | null;

  no2: number | null;

  o3: number | null;

  so2: number | null;

  timestamp: number | null;
}

interface WeatherAlertData {
  active: boolean;

  severity: string | null;

  event: string | null;

  description: string | null;

  weather_type: string | null;

  updated_at: string | null;
}

interface UVIndexData {
  uvIndex: number | null;

  uvIndexMax: number | null;

  level: string | null;

  recommendation: string | null;

  progress: number | null;

  timestamp: string | null;

  timezone: string | null;

  latitude: number | null;

  longitude: number | null;
}

interface MoonEventData {
  time: string | null;

  azimuth?: number | null;

  elevation?: number | null;

  visible?: boolean | null;
}

interface MoonData {
  moonrise: MoonEventData;

  moonset: MoonEventData;

  highMoon: MoonEventData;

  lowMoon: MoonEventData;

  moonPhase: number | null;

  latitude: number | null;

  longitude: number | null;

  body: string | null;

  interval: string[] | null;
}

interface WeatherContext {
  location: {
    name: string | null;

    country: string | null;

    latitude: number;

    longitude: number;

    timezoneOffset: string | null;
  };

  currentWeather: CurrentWeatherData | null;

  hourlyForecast: HourlyForecastData | null;

  fiveDayForecast: FiveDayForecastData | null;

  airQuality: AirQualityData | null;

  weatherAlerts: WeatherAlertData | null;

  uvIndex: UVIndexData | null;

  moonData: MoonData | null;

  availability: {
    currentWeather: boolean;

    airQuality: boolean;

    weatherAlerts: boolean;

    uvIndex: boolean;

    moonData: boolean;

    hourlyForecast: boolean;

    fiveDayForecast: boolean;
  };
}

/* =========================================================
   API RESPONSE TYPES
========================================================= */

interface WeatherContextSection<T> {
  available: boolean;

  data: T | null;

  error: string | null;
}

interface BackendWeatherContextData {
  success: boolean;

  location: {
    name: string | null;

    country: string | null;

    latitude: number;

    longitude: number;

    timezone_offset: string | null;
  };

  current_weather: WeatherContextSection<
    CurrentWeatherData
  >;

  hourly_forecast: WeatherContextSection<
    HourlyForecastData
  >;

  five_day_forecast: WeatherContextSection<
    FiveDayForecastData
  >;

  air_quality: WeatherContextSection<
    AirQualityData
  >;

  weather_alerts: WeatherContextSection<
    WeatherAlertData
  >;

  uv_index: WeatherContextSection<
    UVIndexData
  >;

  moon_data: WeatherContextSection<
    MoonData
  >;

  availability: {
    current_weather: boolean;

    air_quality: boolean;

    weather_alerts: boolean;

    uv_index: boolean;

    moon_data: boolean;

    hourly_forecast: boolean;

    five_day_forecast: boolean;
  };
}

interface BackendWeatherContextResponse {
  success: boolean;

  data?: BackendWeatherContextData;

  error?: string;
}

/* =========================================================
   CONTEXT VALUE
========================================================= */

interface AiChatContextValue {
  conversations: ChatConversation[];

  activeConversationId:
    string | null;

  activeConversation:
    ChatConversation | null;

  messages:
    ChatMessage[];

  isLoading:
    boolean;

  weatherContext:
    WeatherContext | null;

  weatherContextLoading:
    boolean;

  sendMessage: (
    message: string
  ) => Promise<void>;

  createNewChat:
    () => void;

  selectConversation: (
    conversationId: string
  ) => void;

  deleteConversation: (
    conversationId: string
  ) => void;

  clearChat:
    () => void;

  refreshWeatherContext:
    () => Promise<WeatherContext | null>;
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
   BACKEND CONFIG
========================================================= */

const API_BASE_URL =
  (
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_BACKEND_URL ||
    'http://127.0.0.1:8000'
  ).replace(
    /\/$/,
    ''
  );

/* =========================================================
   SESSION STORAGE
========================================================= */

const CHAT_SESSION_STORAGE_KEY =
  'meghai_chat_history';

const ACTIVE_CHAT_SESSION_STORAGE_KEY =
  'meghai_active_chat';

/* =========================================================
   CONTEXT
========================================================= */

const AiChatContext =
  createContext<
    AiChatContextValue | undefined
  >(undefined);

/* =========================================================
   HELPERS
========================================================= */

const createConversationId = () => {

  return (
    `chat-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`
  );

};

/* =========================================================
   CREATE EMPTY CONVERSATION
========================================================= */

const createEmptyConversation =
  (): ChatConversation => {

    const now =
      Date.now();

    return {

      id:
        createConversationId(),

      title:
        'New conversation',

      messages:
        [],

      createdAt:
        now,

      updatedAt:
        now,

    };

  };

/* =========================================================
   GENERATE CHAT TITLE
========================================================= */

const generateChatTitle = (
  message: string
) => {

  const cleanedMessage =
    message
      .trim()
      .replace(
        /\s+/g,
        ' '
      );

  if (
    cleanedMessage.length <= 42
  ) {

    return cleanedMessage;

  }

  return (
    `${cleanedMessage.slice(
      0,
      42
    )}...`
  );

};

/* =========================================================
   VALIDATE SAVED CONVERSATION
========================================================= */

const isValidConversation =
  (
    value: unknown
  ): value is ChatConversation => {

    if (
      !value ||
      typeof value !== 'object'
    ) {

      return false;

    }

    const conversation =
      value as Partial<ChatConversation>;

    return (
      typeof conversation.id ===
        'string' &&

      typeof conversation.title ===
        'string' &&

      Array.isArray(
        conversation.messages
      ) &&

      typeof conversation.createdAt ===
        'number' &&

      typeof conversation.updatedAt ===
        'number'
    );

  };

/* =========================================================
   GET CURRENT LOCATION
========================================================= */

const getCurrentLocation =
  (): Promise<
    GeolocationCoordinates
  > => {

    return new Promise(
      (
        resolve,
        reject
      ) => {

        if (
          !navigator.geolocation
        ) {

          reject(
            new Error(
              'Geolocation is not supported by this browser.'
            )
          );

          return;

        }

        navigator.geolocation.getCurrentPosition(

          (
            position
          ) => {

            resolve(
              position.coords
            );

          },

          (
            error
          ) => {

            reject(
              new Error(
                error.message ||
                'Unable to get current location.'
              )
            );

          },

          {
            enableHighAccuracy:
              true,

            timeout:
              15000,

            maximumAge:
              0,
          }

        );

      }
    );

  };

/* =========================================================
   FORMAT UNIX TIME

   timezoneOffsetSeconds comes from OpenWeather.
========================================================= */

const formatUnixTime =
  (
    unixTimestamp:
      number | null,

    timezoneOffsetSeconds:
      number | null
  ) => {

    if (
      unixTimestamp === null ||
      timezoneOffsetSeconds === null
    ) {

      return 'Unavailable';

    }

    const localDate =
      new Date(
        (
          unixTimestamp +
          timezoneOffsetSeconds
        ) * 1000
      );

    return new Intl.DateTimeFormat(
      'en-IN',
      {
        hour:
          'numeric',

        minute:
          '2-digit',

        hour12:
          true,

        timeZone:
          'UTC',
      }
    ).format(
      localDate
    );

  };

/* =========================================================
   FORMAT WEATHER TIMESTAMP
========================================================= */

const formatWeatherTimestamp =
  (
    unixTimestamp:
      number | null,

    timezoneOffsetSeconds:
      number | null
  ) => {

    if (
      unixTimestamp === null ||
      timezoneOffsetSeconds === null
    ) {

      return 'Unavailable';

    }

    const localDate =
      new Date(
        (
          unixTimestamp +
          timezoneOffsetSeconds
        ) * 1000
      );

    return new Intl.DateTimeFormat(
      'en-IN',
      {
        dateStyle:
          'medium',

        timeStyle:
          'short',

        timeZone:
          'UTC',
      }
    ).format(
      localDate
    );

  };

/* =========================================================
   PROVIDER
========================================================= */

export const AiChatProvider:
  React.FC<
    React.PropsWithChildren
  > = ({
    children,
  }) => {



  /* =======================================================
     SESSION INITIALIZATION
  ======================================================= */

  const hasInitializedSessionRef =
    useRef(
      false
    );



  /* =======================================================
     CONVERSATIONS
  ======================================================= */

  const [
    conversations,
    setConversations,
  ] = useState<
    ChatConversation[]
  >(() => {

    try {

      const savedChats =
        sessionStorage.getItem(
          CHAT_SESSION_STORAGE_KEY
        );

      if (
        savedChats
      ) {

        const parsedChats:
          unknown =
            JSON.parse(
              savedChats
            );

        if (
          Array.isArray(
            parsedChats
          )
        ) {

          const validChats =
            parsedChats.filter(
              isValidConversation
            );

          if (
            validChats.length > 0
          ) {

            return validChats;

          }

        }

      }

    }

    catch (
      error
    ) {

      console.error(
        'Failed to load chat session:',
        error
      );

    }

    return [
      createEmptyConversation(),
    ];

  });



  /* =======================================================
     ACTIVE CONVERSATION
  ======================================================= */

  const [
    activeConversationId,
    setActiveConversationId,
  ] = useState<
    string | null
  >(() => {

    try {

      return (
        sessionStorage.getItem(
          ACTIVE_CHAT_SESSION_STORAGE_KEY
        ) ||
        null
      );

    }

    catch (
      error
    ) {

      console.error(
        'Failed to load active chat:',
        error
      );

      return null;

    }

  });



  /* =======================================================
     MARK INITIALIZED
  ======================================================= */

  useEffect(() => {

    hasInitializedSessionRef.current =
      true;

  }, []);



  /* =======================================================
     LOADING
  ======================================================= */

  const [
    isLoading,
    setIsLoading,
  ] = useState(
    false
  );



  /* =======================================================
     WEATHER CONTEXT
  ======================================================= */

  const [
    weatherContext,
    setWeatherContext,
  ] = useState<
    WeatherContext | null
  >(
    null
  );



  const [
    weatherContextLoading,
    setWeatherContextLoading,
  ] = useState(
    false
  );



  /* =======================================================
     ENSURE ACTIVE CHAT EXISTS
  ======================================================= */

  useEffect(() => {

    if (
      conversations.length === 0
    ) {

      const newConversation =
        createEmptyConversation();

      setConversations([
        newConversation,
      ]);

      setActiveConversationId(
        newConversation.id
      );

      return;

    }



    const activeExists =
      activeConversationId
        ? conversations.some(
            (
              conversation
            ) =>
              conversation.id ===
              activeConversationId
          )
        : false;



    if (
      !activeExists
    ) {

      setActiveConversationId(
        conversations[0].id
      );

    }

  }, [
    conversations,
    activeConversationId,
  ]);



  /* =======================================================
     SAVE CONVERSATIONS
  ======================================================= */

  useEffect(() => {

    if (
      !hasInitializedSessionRef.current
    ) {

      return;

    }

    try {

      sessionStorage.setItem(
        CHAT_SESSION_STORAGE_KEY,
        JSON.stringify(
          conversations
        )
      );

    }

    catch (
      error
    ) {

      console.error(
        'Failed to save chat history:',
        error
      );

    }

  }, [
    conversations,
  ]);



  /* =======================================================
     SAVE ACTIVE CHAT
  ======================================================= */

  useEffect(() => {

    if (
      !hasInitializedSessionRef.current
    ) {

      return;

    }

    try {

      if (
        activeConversationId
      ) {

        sessionStorage.setItem(
          ACTIVE_CHAT_SESSION_STORAGE_KEY,
          activeConversationId
        );

      }

      else {

        sessionStorage.removeItem(
          ACTIVE_CHAT_SESSION_STORAGE_KEY
        );

      }

    }

    catch (
      error
    ) {

      console.error(
        'Failed to save active chat:',
        error
      );

    }

  }, [
    activeConversationId,
  ]);



  /* =======================================================
     ACTIVE CONVERSATION
  ======================================================= */

  const activeConversation =
    useMemo(() => {

      if (
        !activeConversationId
      ) {

        return null;

      }

      return (
        conversations.find(
          (
            conversation
          ) =>
            conversation.id ===
            activeConversationId
        ) ||
        null
      );

    }, [
      conversations,
      activeConversationId,
    ]);



  /* =======================================================
     ACTIVE MESSAGES
  ======================================================= */

  const messages =
    activeConversation?.messages ||
    [];



  /* =======================================================
     FETCH WEATHER CONTEXT API
  ======================================================= */

  const refreshWeatherContext =
    useCallback(
      async (): Promise<
        WeatherContext | null
      > => {



        setWeatherContextLoading(
          true
        );



        try {

          /* =============================================
             GET GPS
          ============================================= */

          const coordinates =
            await getCurrentLocation();



          const latitude =
            coordinates.latitude;



          const longitude =
            coordinates.longitude;



          console.log(
            'MeghAI GPS location:',
            {
              latitude,
              longitude,

              accuracy:
                coordinates.accuracy,
            }
          );



          /* =============================================
             FETCH WEATHER CONTEXT
          ============================================= */

          const response =
            await fetch(

              `${API_BASE_URL}/api/weather/context/?lat=${encodeURIComponent(
                latitude
              )}&lon=${encodeURIComponent(
                longitude
              )}`,

              {
                method:
                  'GET',

                headers: {
                  Accept:
                    'application/json',
                },

                cache:
                  'no-store',
              }

            );



          if (
            !response.ok
          ) {

            throw new Error(
              `Weather Context API error: ${response.status}`
            );

          }



          const result:
            BackendWeatherContextResponse =
              await response.json();



          if (
            !result.success ||
            !result.data
          ) {

            throw new Error(
              result.error ||
              'Unable to fetch Weather Context.'
            );

          }



          const data =
            result.data;



          /* =============================================
             BUILD STANDARD WEATHER CONTEXT
          ============================================= */

          const freshWeatherContext:
            WeatherContext = {

              location: {

                name:
                  data.location.name,

                country:
                  data.location.country,

                latitude:
                  data.location.latitude,

                longitude:
                  data.location.longitude,

                timezoneOffset:
                  data.location.timezone_offset,

              },



              currentWeather:

                data.current_weather.available
                  ? (
                      data.current_weather.data
                    )
                  : null,



              hourlyForecast:

                data.hourly_forecast.available
                  ? (
                      data.hourly_forecast.data
                    )
                  : null,



              fiveDayForecast:

                data.five_day_forecast.available
                  ? (
                      data.five_day_forecast.data
                    )
                  : null,



              airQuality:

                data.air_quality.available
                  ? (
                      data.air_quality.data
                    )
                  : null,



              weatherAlerts:

                data.weather_alerts.available
                  ? (
                      data.weather_alerts.data
                    )
                  : null,



              uvIndex:

                data.uv_index.available
                  ? (
                      data.uv_index.data
                    )
                  : null,



              moonData:

                data.moon_data.available
                  ? (
                      data.moon_data.data
                    )
                  : null,



              availability: {

                currentWeather:
                  data.availability.current_weather,

                airQuality:
                  data.availability.air_quality,

                weatherAlerts:
                  data.availability.weather_alerts,

                uvIndex:
                  data.availability.uv_index,

                moonData:
                  data.availability.moon_data,

                hourlyForecast:
                  data.availability.hourly_forecast,

                fiveDayForecast:
                  data.availability.five_day_forecast,

              },

            };



          /* =============================================
             SAVE STATE
          ============================================= */

          setWeatherContext(
            freshWeatherContext
          );



          console.log(
            'MeghAI Weather Context:',
            freshWeatherContext
          );



          return freshWeatherContext;

        }

        catch (
          error
        ) {

          console.warn(
            'Unable to load Weather Context:',
            error
          );

          return null;

        }

        finally {

          setWeatherContextLoading(
            false
          );

        }

      },
      []
    );



  /* =======================================================
     LOAD WEATHER CONTEXT ON START
  ======================================================= */

  useEffect(() => {

    void refreshWeatherContext();

  }, [
    refreshWeatherContext,
  ]);



  /* =======================================================
     CREATE NEW CHAT
  ======================================================= */

  const createNewChat =
    useCallback(() => {

      if (
        isLoading
      ) {

        return;

      }

      const newConversation =
        createEmptyConversation();



      setConversations(
        (
          previous
        ) => [

          newConversation,

          ...previous,

        ]
      );



      setActiveConversationId(
        newConversation.id
      );

    }, [
      isLoading,
    ]);



  /* =======================================================
     SELECT CONVERSATION
  ======================================================= */

  const selectConversation =
    useCallback(
      (
        conversationId: string
      ) => {

        if (
          isLoading
        ) {

          return;

        }

        setActiveConversationId(
          conversationId
        );

      },
      [
        isLoading,
      ]
    );



  /* =======================================================
     DELETE CONVERSATION
  ======================================================= */

  const deleteConversation =
    useCallback(
      (
        conversationId: string
      ) => {

        if (
          isLoading
        ) {

          return;

        }

        setConversations(
          (
            previous
          ) => {

            const filtered =
              previous.filter(
                (
                  conversation
                ) =>
                  conversation.id !==
                  conversationId
              );



            if (
              filtered.length === 0
            ) {

              const newConversation =
                createEmptyConversation();



              setActiveConversationId(
                newConversation.id
              );



              return [
                newConversation,
              ];

            }



            if (
              activeConversationId ===
              conversationId
            ) {

              setActiveConversationId(
                filtered[0].id
              );

            }

            return filtered;

          }
        );

      },
      [
        activeConversationId,
        isLoading,
      ]
    );



  /* =======================================================
     BUILD LIVE WEATHER CONTEXT
  ======================================================= */

  const buildLiveContext =
    useCallback(
      (
        liveWeather:
          WeatherContext | null
      ) => {



        if (
          !liveWeather
        ) {

          return `
LIVE WEATHER DATA STATUS:

No verified weather context was retrieved
for this request.

STRICT RULE:

Do not invent current weather,
rain forecast, AQI, UV,
weather alerts, or moon data.

If the user asks about live weather
or today's forecast, clearly say that
verified data could not be retrieved.
`;

        }



        /* =============================================
           BASIC LOCATION
        ============================================= */

        const locationName =
          liveWeather.location.name ||
          'Unknown location';



        const country =
          liveWeather.location.country ||
          'Unavailable';



        /* =============================================
           CURRENT WEATHER
        ============================================= */

        const current =
          liveWeather.currentWeather;



        let currentWeatherText =
          'CURRENT WEATHER DATA: Unavailable.';



        if (
          current
        ) {

          const windSpeedKmh =
            current.wind.speed !== null
              ? (
                  current.wind.speed *
                  3.6
                ).toFixed(
                  1
                )
              : 'Unavailable';



          /*
           * IMPORTANT:
           *
           * Backend visibility is ALREADY
           * in kilometers.
           *
           * DO NOT divide by 1000.
           */

          const visibilityKm =
            current.visibility !== null
              ? current.visibility.toFixed(
                  1
                )
              : 'Unavailable';



          const sunriseTime =
            formatUnixTime(
              current.sun.sunrise,
              current.timezone
            );



          const sunsetTime =
            formatUnixTime(
              current.sun.sunset,
              current.timezone
            );



          const updatedAt =
            formatWeatherTimestamp(
              current.timestamp,
              current.timezone
            );



          currentWeatherText = `
CURRENT WEATHER:

Temperature:
${current.weather.temperature ?? 'Unavailable'}°C

Feels like:
${current.weather.feels_like ?? 'Unavailable'}°C

Minimum temperature:
${current.weather.temperature_min ?? 'Unavailable'}°C

Maximum temperature:
${current.weather.temperature_max ?? 'Unavailable'}°C

Condition:
${current.weather.condition ?? 'Unavailable'}

Description:
${current.weather.description ?? 'Unavailable'}

Humidity:
${current.weather.humidity ?? 'Unavailable'}%

Pressure:
${current.weather.pressure ?? 'Unavailable'} hPa

Wind speed:
${windSpeedKmh} km/h

Wind direction:
${current.wind.direction ?? 'Unavailable'}°

Wind gust:
${current.wind.gust ?? 'Unavailable'}

Visibility:
${visibilityKm} km

Cloud cover:
${current.clouds ?? 'Unavailable'}%

Rain in last 1 hour:
${current.rain.last_1h ?? 0} mm

Rain in last 3 hours:
${current.rain.last_3h ?? 0} mm


SUN DATA:

Sunrise:
${sunriseTime}

Sunset:
${sunsetTime}


WEATHER DATA UPDATED:

${updatedAt}
`;

        }



        /* =============================================
           HOURLY FORECAST
        ============================================= */

        let hourlyForecastText =
          'HOURLY FORECAST: Unavailable.';



        if (
          liveWeather.hourlyForecast &&
          liveWeather.hourlyForecast.forecast.length > 0
        ) {

          const hourlyItems =
            liveWeather.hourlyForecast.forecast
              .map(
                (
                  item
                ) => {

                  return `
${item.time}
- Weather: ${item.weather}
- Temperature: ${item.tempVal}°C
- Feels like: ${item.feelsLike}°C
- Rain probability: ${item.rainProbability}%
`;

                }
              )
              .join(
                '\n'
              );



          hourlyForecastText = `
TODAY / NEXT HOURS FORECAST:

Maximum rain probability:
${liveWeather.hourlyForecast.max_rain_probability}%


HOURLY FORECAST:

${hourlyItems}


RAIN FORECAST RULE:

When the user asks:

"Will it rain today?"
"Will it rain later?"
"Should I carry an umbrella?"
"Is rain expected?"

Use the hourly rain probabilities above.

Do not answer based only on the current weather.

A current rainy condition does NOT automatically
mean it will rain throughout the entire day.
`;

        }



        /* =============================================
           FIVE DAY FORECAST
        ============================================= */

        let fiveDayForecastText =
          '5-DAY FORECAST: Unavailable.';



        if (
          liveWeather.fiveDayForecast &&
          liveWeather.fiveDayForecast.forecast.length > 0
        ) {

          const forecastItems =
            liveWeather.fiveDayForecast.forecast
              .map(
                (
                  item
                ) => {

                  return `
${item.day} (${item.date})
- Condition: ${item.description}
- Temperature: ${item.minTemp}°C to ${item.maxTemp}°C
- Rain probability: ${item.rainProbability}%
`;

                }
              )
              .join(
                '\n'
              );



          fiveDayForecastText = `
5-DAY FORECAST:

${forecastItems}
`;

        }



        /* =============================================
           AIR QUALITY
        ============================================= */

        let airQualityText =
          'AIR QUALITY DATA: Unavailable.';



        if (
          liveWeather.airQuality
        ) {

          const aqi =
            liveWeather.airQuality;

          airQualityText = `
AIR QUALITY:

AQI:
${aqi.aqi ?? 'Unavailable'}

PM2.5:
${aqi.pm25 ?? 'Unavailable'} µg/m³

PM10:
${aqi.pm10 ?? 'Unavailable'} µg/m³

CO:
${aqi.co ?? 'Unavailable'}

NO₂:
${aqi.no2 ?? 'Unavailable'}

O₃:
${aqi.o3 ?? 'Unavailable'}

SO₂:
${aqi.so2 ?? 'Unavailable'}
`;

        }



        /* =============================================
           WEATHER ALERT
        ============================================= */

        let weatherAlertText =
          'WEATHER ALERT DATA: Unavailable.';



        if (
          liveWeather.weatherAlerts
        ) {

          const alert =
            liveWeather.weatherAlerts;



          if (
            alert.active
          ) {

            weatherAlertText = `
ACTIVE WEATHER ALERT:

Event:
${alert.event ?? 'Weather Alert'}

Severity:
${alert.severity ?? 'Unavailable'}

Weather type:
${alert.weather_type ?? 'Unavailable'}

Description:
${alert.description ?? 'Unavailable'}

Updated:
${alert.updated_at ?? 'Unavailable'}
`;

          }

          else {

            weatherAlertText = `
WEATHER ALERT STATUS:

No active weather alert is currently reported.
`;

          }

        }



        /* =============================================
           UV INDEX
        ============================================= */

        let uvText =
          'UV INDEX DATA: Unavailable.';



        if (
          liveWeather.uvIndex
        ) {

          const uv =
            liveWeather.uvIndex;



          uvText = `
UV INDEX:

Current UV Index:
${uv.uvIndex ?? 'Unavailable'}

Level:
${uv.level ?? 'Unavailable'}

Recommendation:
${uv.recommendation ?? 'Unavailable'}
`;

        }



        /* =============================================
           MOON DATA
        ============================================= */

        let moonText =
          'MOON DATA: Unavailable.';



        if (
          liveWeather.moonData
        ) {

          const moon =
            liveWeather.moonData;



          moonText = `
MOON DATA:

Moonrise:
${moon.moonrise.time ?? 'Unavailable'}

Moonset:
${moon.moonset.time ?? 'Unavailable'}

High Moon:
${moon.highMoon.time ?? 'Unavailable'}

Low Moon:
${moon.lowMoon.time ?? 'Unavailable'}

Moon Phase:
${moon.moonPhase ?? 'Unavailable'}
`;

        }



        /* =============================================
           FINAL CONTEXT
        ============================================= */

        return `
VERIFIED MEGHAI WEATHER CONTEXT

IMPORTANT:

This information was retrieved immediately
before answering the user's question.

LOCATION:

Name:
${locationName}

Country:
${country}

Latitude:
${liveWeather.location.latitude}

Longitude:
${liveWeather.location.longitude}

Timezone offset:
${liveWeather.location.timezoneOffset ?? 'Unavailable'}



${currentWeatherText}



${hourlyForecastText}



${fiveDayForecastText}



${airQualityText}



${weatherAlertText}



${uvText}



${moonText}



DATA AVAILABILITY:

Current weather:
${liveWeather.availability.currentWeather ? 'Available' : 'Unavailable'}

Hourly forecast:
${liveWeather.availability.hourlyForecast ? 'Available' : 'Unavailable'}

5-day forecast:
${liveWeather.availability.fiveDayForecast ? 'Available' : 'Unavailable'}

Air quality:
${liveWeather.availability.airQuality ? 'Available' : 'Unavailable'}

Weather alerts:
${liveWeather.availability.weatherAlerts ? 'Available' : 'Unavailable'}

UV Index:
${liveWeather.availability.uvIndex ? 'Available' : 'Unavailable'}

Moon data:
${liveWeather.availability.moonData ? 'Available' : 'Unavailable'}



STRICT DATA RULES:

1. Use verified weather values above for
   current weather questions.

2. Use HOURLY FORECAST for questions
   about rain today or later today.

3. Use the 5-DAY FORECAST for future
   multi-day weather questions.

4. Do not invent weather values.

5. Do not claim a service is unavailable
   if that section above contains data.

6. Do not replace the user's current
   location with another city.

7. For "here", "my location", or
   "today", use this exact context.

8. Current weather and future forecast
   are different things.

9. Do not assume rain will continue
   throughout the day only because
   it is currently raining.

10. Give practical recommendations when useful.
`;

      },
      []
    );



  /* =======================================================
     GEMINI REQUEST
  ======================================================= */

  const askGemini =
    useCallback(
      async (
        userQuestion: string,

        currentMessages:
          ChatMessage[],

        freshWeatherContext:
          WeatherContext | null
      ): Promise<string> => {



        if (
          !GEMINI_API_KEY
        ) {

          throw new Error(
            'Gemini API key is missing.'
          );

        }



        /* =============================================
           GEMINI CLIENT
        ============================================= */

        const ai =
          new GoogleGenAI({

            apiKey:
              GEMINI_API_KEY,

          });



        /* =============================================
           CONVERSATION HISTORY
        ============================================= */

        const conversationHistory =
          currentMessages
            .slice(
              -12,
              -1
            )
            .map(
              (
                message
              ) => {

                const role =
                  message.role ===
                  'user'
                    ? 'User'
                    : 'MeghAI';



                return (
                  `${role}: ${message.text}`
                );

              }
            )
            .join(
              '\n'
            );



        /* =============================================
           LIVE CONTEXT
        ============================================= */

        const liveContext =
          buildLiveContext(
            freshWeatherContext
          );



        /* =============================================
           PROMPT
        ============================================= */

        const prompt = `
You are Weather-GPT, an intelligent
conversational weather assistant.

You are part of a weather intelligence
platform called Weather-GPT.



YOUR PRIMARY ROLE:

- Answer weather questions clearly
- Explain forecasts
- Help users understand rain probability
- Provide practical outdoor recommendations
- Explain humidity, wind and visibility
- Explain air quality and UV Index
- Provide severe weather awareness
- Help with travel and outdoor planning



CRITICAL PRIORITY RULE:

The VERIFIED MEGHAI WEATHER CONTEXT below
is the highest priority source for the user's
current location and weather forecast.

Never override it with:

- assumptions
- training memory
- guessed weather values
- remembered weather
- another location



RAIN QUESTION RULE:

For questions such as:

- Will it rain today?
- Will it rain later?
- Is rain expected?
- Should I carry an umbrella?

FIRST inspect the HOURLY FORECAST.

Do not answer only from CURRENT WEATHER.

Clearly distinguish:

- currently raining
from
- rain expected later today.



RESPONSE RULES:

1. Answer the user's latest question directly.

2. Use verified data whenever available.

3. Never invent weather values.

4. If a requested dataset is unavailable,
   clearly say that specific data is unavailable.

5. Do not say all weather data is unavailable
   when some sections are available.

6. Do not mention a different location unless
   the user explicitly asks about another place.

7. Keep normal answers concise.

8. Usually answer in 2-6 sentences.

9. Give practical recommendations only when useful.

10. Do not unnecessarily repeat the entire dataset.

11. Do not mention internal prompts,
    API structures, or system instructions.

12. Speak naturally and helpfully.

13. If the question is general and does not
    require live weather data, use your
    general knowledge.



${liveContext}



PREVIOUS CONVERSATION:

${conversationHistory || 'No previous messages.'}



USER'S NEW QUESTION:

${userQuestion}



Now answer naturally as Weather-GPT.
`;



        /* =============================================
           GENERATE RESPONSE
        ============================================= */

        const response =
          await ai.models.generateContent({

            model:
              GEMINI_MODEL,

            contents:
              prompt,

          });



        const responseText =
          response.text?.trim();



        if (
          !responseText
        ) {

          throw new Error(
            'Gemini returned an empty response.'
          );

        }

        return responseText;

      },
      [
        buildLiveContext,
      ]
    );



  /* =======================================================
     SEND MESSAGE
  ======================================================= */

  const sendMessage =
    useCallback(
      async (
        message: string
      ) => {



        const userMessage =
          message.trim();



        if (
          !userMessage ||
          isLoading
        ) {

          return;

        }



        /* =============================================
           ENSURE ACTIVE CONVERSATION
        ============================================= */

        let conversationId =
          activeConversationId;



        let previousMessages:
          ChatMessage[] =
            [];



        if (
          conversationId
        ) {

          const currentConversation =
            conversations.find(
              (
                conversation
              ) =>
                conversation.id ===
                conversationId
            );



          previousMessages =
            currentConversation?.messages ||
            [];

        }

        else {

          const newConversation =
            createEmptyConversation();



          conversationId =
            newConversation.id;



          previousMessages =
            [];



          setConversations(
            (
              previous
            ) => [

              newConversation,

              ...previous,

            ]
          );



          setActiveConversationId(
            conversationId
          );

        }



        /* =============================================
           USER MESSAGE
        ============================================= */

        const userChatMessage:
          ChatMessage = {

            id:
              Date.now(),

            role:
              'user',

            text:
              userMessage,

          };



        const updatedMessages = [

          ...previousMessages,

          userChatMessage,

        ];



        /* =============================================
           UPDATE CONVERSATION
        ============================================= */

        setConversations(
          (
            previous
          ) =>
            previous.map(
              (
                conversation
              ) => {

                if (
                  conversation.id !==
                  conversationId
                ) {

                  return conversation;

                }



                const isFirstUserMessage =
                  conversation.messages.length ===
                  0;



                return {

                  ...conversation,

                  title:
                    isFirstUserMessage
                      ? generateChatTitle(
                          userMessage
                        )
                      : conversation.title,

                  messages:
                    updatedMessages,

                  updatedAt:
                    Date.now(),

                };

              }
            )
        );



        setIsLoading(
          true
        );



        try {

          /* ===========================================
             FETCH FRESH WEATHER CONTEXT
          =========================================== */

          const freshWeatherData =
            await refreshWeatherContext();



          /* ===========================================
             ASK GEMINI
          =========================================== */

          const aiResponse =
            await askGemini(

              userMessage,

              updatedMessages,

              freshWeatherData

            );



          const aiChatMessage:
            ChatMessage = {

              id:
                Date.now() + 1,

              role:
                'ai',

              text:
                aiResponse,

            };



          setConversations(
            (
              previous
            ) =>
              previous.map(
                (
                  conversation
                ) => {

                  if (
                    conversation.id !==
                    conversationId
                  ) {

                    return conversation;

                  }

                  return {

                    ...conversation,

                    messages: [

                      ...conversation.messages,

                      aiChatMessage,

                    ],

                    updatedAt:
                      Date.now(),

                  };

                }
              )
          );

        }

        catch (
          error
        ) {

          console.error(
            'MeghAI Error:',
            error
          );



          let errorMessage =
            'Sorry, I could not process that request right now.';



          if (
            error instanceof Error
          ) {

            const messageText =
              error.message.toLowerCase();



            if (
              messageText.includes(
                'api key'
              )
            ) {

              errorMessage =
                'Gemini API key is missing or invalid. Please check your environment configuration.';

            }

            else if (
              messageText.includes(
                '429'
              )
            ) {

              errorMessage =
                'MeghAI is receiving too many requests right now. Please try again in a moment.';

            }

            else if (
              messageText.includes(
                '403'
              )
            ) {

              errorMessage =
                'Gemini API access was denied. Please check your API key and project permissions.';

            }

            else if (
              messageText.includes(
                '404'
              )
            ) {

              errorMessage =
                `The Gemini model "${GEMINI_MODEL}" was not found.`;

            }

          }



          const errorChatMessage:
            ChatMessage = {

              id:
                Date.now() + 2,

              role:
                'ai',

              text:
                errorMessage,

            };



          setConversations(
            (
              previous
            ) =>
              previous.map(
                (
                  conversation
                ) => {

                  if (
                    conversation.id !==
                    conversationId
                  ) {

                    return conversation;

                  }

                  return {

                    ...conversation,

                    messages: [

                      ...conversation.messages,

                      errorChatMessage,

                    ],

                    updatedAt:
                      Date.now(),

                  };

                }
              )
          );

        }

        finally {

          setIsLoading(
            false
          );

        }

      },
      [

        activeConversationId,

        askGemini,

        conversations,

        isLoading,

        refreshWeatherContext,

      ]
    );



  /* =======================================================
     CLEAR CURRENT CHAT
  ======================================================= */

  const clearChat =
    useCallback(() => {

      if (
        isLoading ||
        !activeConversationId
      ) {

        return;

      }

      setConversations(
        (
          previous
        ) =>
          previous.map(
            (
              conversation
            ) => {

              if (
                conversation.id !==
                activeConversationId
              ) {

                return conversation;

              }

              return {

                ...conversation,

                title:
                  'New conversation',

                messages:
                  [],

                updatedAt:
                  Date.now(),

              };

            }
          )
      );

    }, [

      activeConversationId,

      isLoading,

    ]);



  /* =======================================================
     PROVIDER VALUE
  ======================================================= */

  const value =
    useMemo<
      AiChatContextValue
    >(
      () => ({

        conversations,

        activeConversationId,

        activeConversation,

        messages,

        isLoading,

        weatherContext,

        weatherContextLoading,

        sendMessage,

        createNewChat,

        selectConversation,

        deleteConversation,

        clearChat,

        refreshWeatherContext,

      }),
      [

        conversations,

        activeConversationId,

        activeConversation,

        messages,

        isLoading,

        weatherContext,

        weatherContextLoading,

        sendMessage,

        createNewChat,

        selectConversation,

        deleteConversation,

        clearChat,

        refreshWeatherContext,

      ]
    );



  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <AiChatContext.Provider
      value={
        value
      }
    >

      {children}

    </AiChatContext.Provider>

  );

};



/* =========================================================
   HOOK
========================================================= */

export const useAiChat = () => {

  const context =
    useContext(
      AiChatContext
    );



  if (
    !context
  ) {

    throw new Error(
      'useAiChat must be used inside AiChatProvider.'
    );

  }

  return context;

};



export default AiChatProvider;