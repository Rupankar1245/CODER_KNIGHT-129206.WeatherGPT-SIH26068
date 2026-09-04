import React, {
    useEffect,
    useRef,
    useState,
} from 'react';

import {
    X,
    Mic,
    MicOff,
    Volume2,
    Loader2,
    Sparkles,
    AlertCircle,
} from 'lucide-react';

import {
    GoogleGenAI,
} from '@google/genai';


/* =========================================================
   TYPES
========================================================= */

interface VoiceModeProps {
    onClose: () => void;
}


type VoiceStatus =
    | 'idle'
    | 'listening'
    | 'thinking'
    | 'speaking'
    | 'error';


interface SpeechRecognitionEvent
    extends Event {

    results:
    SpeechRecognitionResultList;

}


interface SpeechRecognitionErrorEvent
    extends Event {

    error: string;

}


interface SpeechRecognitionInstance {

    continuous: boolean;

    interimResults: boolean;

    lang: string;

    start: () => void;

    stop: () => void;

    abort: () => void;

    onresult:
    | (
        (
            event:
                SpeechRecognitionEvent
        ) => void
    )
    | null;

    onerror:
    | (
        (
            event:
                SpeechRecognitionErrorEvent
        ) => void
    )
    | null;

    onend:
    | (() => void)
    | null;

}


declare global {

    interface Window {

        SpeechRecognition?:
        new () =>
            SpeechRecognitionInstance;

        webkitSpeechRecognition?:
        new () =>
            SpeechRecognitionInstance;

    }

}


/* =========================================================
   WEATHER TYPES
========================================================= */

interface CurrentWeatherData {

    location: {
        name: string | null;
        country: string | null;

        latitude: number | null;
        longitude: number | null;
    };

    weather: {

        temperature:
        number | null;

        feels_like:
        number | null;

        temperature_min:
        number | null;

        temperature_max:
        number | null;

        pressure:
        number | null;

        humidity:
        number | null;

        condition:
        string | null;

        description:
        string | null;

    };

    wind: {

        speed:
        number | null;

        direction:
        number | null;

        gust:
        number | null;

    };

    visibility:
    number | null;

    visibility_meters:
    number | null;

    clouds:
    number | null;

    rain: {

        last_1h:
        number | null;

        last_3h:
        number | null;

    };

    sun: {

        sunrise:
        number | null;

        sunset:
        number | null;

    };

    timezone:
    number | null;

    timestamp:
    number | null;

}


interface HourlyForecastItem {

    time:
    string;

    timestamp:
    number;

    tempVal:
    number;

    feelsLike:
    number;

    rainProbability:
    number;

    weather:
    string;

}


interface HourlyForecastData {

    location: {

        name:
        string | null;

        country:
        string | null;

    };

    forecast:
    HourlyForecastItem[];

    max_rain_probability:
    number;

}


interface FiveDayForecastItem {

    day:
    string;

    date:
    string;

    minTemp:
    number;

    maxTemp:
    number;

    description:
    string;

    rainProbability:
    number;

}


interface FiveDayForecastData {

    forecast:
    FiveDayForecastItem[];

}


interface AirQualityData {

    aqi:
    number | null;

    pm25:
    number | null;

    pm10:
    number | null;

    co:
    number | null;

    no2:
    number | null;

    o3:
    number | null;

    so2:
    number | null;

}


interface WeatherAlertData {

    active:
    boolean;

    severity:
    string | null;

    event:
    string | null;

    description:
    string | null;

    weather_type:
    string | null;

    updated_at:
    string | null;

}


interface UVIndexData {

    uvIndex:
    number | null;

    level:
    string | null;

    recommendation:
    string | null;

}


interface MoonEventData {

    time:
    string | null;

}


interface MoonData {

    moonrise:
    MoonEventData;

    moonset:
    MoonEventData;

    moonPhase:
    number | null;

}


interface WeatherContext {

    location: {

        name:
        string | null;

        country:
        string | null;

        latitude:
        number;

        longitude:
        number;

        timezoneOffset:
        string | null;

    };

    currentWeather:
    CurrentWeatherData | null;

    hourlyForecast:
    HourlyForecastData | null;

    fiveDayForecast:
    FiveDayForecastData | null;

    airQuality:
    AirQualityData | null;

    weatherAlerts:
    WeatherAlertData | null;

    uvIndex:
    UVIndexData | null;

    moonData:
    MoonData | null;

    availability: {

        currentWeather:
        boolean;

        airQuality:
        boolean;

        weatherAlerts:
        boolean;

        uvIndex:
        boolean;

        moonData:
        boolean;

        hourlyForecast:
        boolean;

        fiveDayForecast:
        boolean;

    };

}


interface WeatherContextSection<T> {

    available:
    boolean;

    data:
    T | null;

    error:
    string | null;

}


interface BackendWeatherContextData {

    success:
    boolean;

    location: {

        name:
        string | null;

        country:
        string | null;

        latitude:
        number;

        longitude:
        number;

        timezone_offset:
        string | null;

    };

    current_weather:
    WeatherContextSection<
        CurrentWeatherData
    >;

    hourly_forecast:
    WeatherContextSection<
        HourlyForecastData
    >;

    five_day_forecast:
    WeatherContextSection<
        FiveDayForecastData
    >;

    air_quality:
    WeatherContextSection<
        AirQualityData
    >;

    weather_alerts:
    WeatherContextSection<
        WeatherAlertData
    >;

    uv_index:
    WeatherContextSection<
        UVIndexData
    >;

    moon_data:
    WeatherContextSection<
        MoonData
    >;

    availability: {

        current_weather:
        boolean;

        air_quality:
        boolean;

        weather_alerts:
        boolean;

        uv_index:
        boolean;

        moon_data:
        boolean;

        hourly_forecast:
        boolean;

        five_day_forecast:
        boolean;

    };

}


interface BackendWeatherContextResponse {

    success:
    boolean;

    data?:
    BackendWeatherContextData;

    error?:
    string;

}


/* =========================================================
   CONFIG
========================================================= */

const GEMINI_API_KEY =
    import.meta.env
        .VITE_GEMINI_API_KEY;


const GEMINI_MODEL =
    import.meta.env
        .VITE_GEMINI_MODEL ||
    'gemini-3.1-flash-lite';


const API_BASE_URL =
    (
        import.meta.env
            .VITE_API_BASE_URL ||

        import.meta.env
            .VITE_BACKEND_URL ||

        'http://127.0.0.1:8000'
    )
        .replace(
            /\/$/,
            ''
        );


/* =========================================================
   LANGUAGE DETECTION
========================================================= */

const detectLanguage = (
    text: string
) => {

    /*
      Bengali Unicode range
    */

    if (
        /[\u0980-\u09FF]/.test(
            text
        )
    ) {

        return {
            code: 'bn-IN',
            name: 'Bengali',
        };

    }


    /*
      Hindi / Devanagari
    */

    if (
        /[\u0900-\u097F]/.test(
            text
        )
    ) {

        return {
            code: 'hi-IN',
            name: 'Hindi',
        };

    }


    return {
        code: 'en-IN',
        name: 'English',
    };

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


                navigator.geolocation
                    .getCurrentPosition(

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
   FETCH WEATHER CONTEXT
========================================================= */

const fetchWeatherContext =
    async (): Promise<
        WeatherContext | null
    > => {

        try {

            const coordinates =
                await getCurrentLocation();


            const latitude =
                coordinates.latitude;


            const longitude =
                coordinates.longitude;


            console.log(
                'Voice GPS location:',
                {
                    latitude,
                    longitude,
                }
            );


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


            const weatherContext:
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

                    data.current_weather
                        .available

                        ? data.current_weather
                            .data

                        : null,


                hourlyForecast:

                    data.hourly_forecast
                        .available

                        ? data.hourly_forecast
                            .data

                        : null,


                fiveDayForecast:

                    data.five_day_forecast
                        .available

                        ? data.five_day_forecast
                            .data

                        : null,


                airQuality:

                    data.air_quality
                        .available

                        ? data.air_quality
                            .data

                        : null,


                weatherAlerts:

                    data.weather_alerts
                        .available

                        ? data.weather_alerts
                            .data

                        : null,


                uvIndex:

                    data.uv_index
                        .available

                        ? data.uv_index
                            .data

                        : null,


                moonData:

                    data.moon_data
                        .available

                        ? data.moon_data
                            .data

                        : null,


                availability: {

                    currentWeather:
                        data.availability
                            .current_weather,

                    airQuality:
                        data.availability
                            .air_quality,

                    weatherAlerts:
                        data.availability
                            .weather_alerts,

                    uvIndex:
                        data.availability
                            .uv_index,

                    moonData:
                        data.availability
                            .moon_data,

                    hourlyForecast:
                        data.availability
                            .hourly_forecast,

                    fiveDayForecast:
                        data.availability
                            .five_day_forecast,

                },

            };


            console.log(
                'Voice Weather Context:',
                weatherContext
            );


            return weatherContext;

        }

        catch (
        error
        ) {

            console.warn(
                'Voice Weather Context Error:',
                error
            );

            return null;

        }

    };


/* =========================================================
   BUILD LIVE WEATHER CONTEXT
========================================================= */

const buildLiveContext = (
    liveWeather:
        WeatherContext | null
) => {

    if (
        !liveWeather
    ) {

        return `
LIVE WEATHER DATA STATUS:

No verified weather context was retrieved.

STRICT RULE:

Do not invent current weather,
forecast, AQI, UV Index,
or weather alerts.

If the user asks about live weather,
say that verified live data could not
be retrieved.
`;

    }


    const locationName =
        liveWeather.location.name ||
        'Unknown location';


    const country =
        liveWeather.location.country ||
        'Unavailable';


    /* =====================================================
       CURRENT WEATHER
    ===================================================== */

    let currentWeatherText =
        'CURRENT WEATHER: Unavailable.';


    if (
        liveWeather.currentWeather
    ) {

        const current =
            liveWeather.currentWeather;


        const windSpeedKmh =
            current.wind.speed !== null
                ? (
                    current.wind.speed * 3.6
                ).toFixed(1)
                : 'Unavailable';


        const visibilityKm =
            current.visibility !== null
                ? current.visibility.toFixed(1)
                : 'Unavailable';


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
`;

    }


    /* =====================================================
       HOURLY FORECAST
    ===================================================== */

    let hourlyForecastText =
        'HOURLY FORECAST: Unavailable.';


    if (
        liveWeather.hourlyForecast &&
        liveWeather.hourlyForecast
            .forecast.length > 0
    ) {

        const hourlyItems =
            liveWeather.hourlyForecast
                .forecast
                .map(
                    (
                        item
                    ) => `
${item.time}
Weather: ${item.weather}
Temperature: ${item.tempVal}°C
Feels like: ${item.feelsLike}°C
Rain probability: ${item.rainProbability}%
`
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


IMPORTANT RAIN RULE:

For questions like:

Will it rain today?
Will it rain later?
Should I carry an umbrella?

Use the hourly forecast above.
Do not answer only from current weather.
`;

    }


    /* =====================================================
       FIVE DAY FORECAST
    ===================================================== */

    let fiveDayForecastText =
        '5-DAY FORECAST: Unavailable.';


    if (
        liveWeather.fiveDayForecast &&
        liveWeather.fiveDayForecast
            .forecast.length > 0
    ) {

        const forecastItems =
            liveWeather.fiveDayForecast
                .forecast
                .map(
                    (
                        item
                    ) => `
${item.day} (${item.date})

Condition:
${item.description}

Temperature:
${item.minTemp}°C to ${item.maxTemp}°C

Rain probability:
${item.rainProbability}%
`
                )
                .join(
                    '\n'
                );


        fiveDayForecastText = `
5-DAY FORECAST:

${forecastItems}
`;

    }


    /* =====================================================
       AIR QUALITY
    ===================================================== */

    let airQualityText =
        'AIR QUALITY: Unavailable.';


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


    /* =====================================================
       WEATHER ALERTS
    ===================================================== */

    let weatherAlertText =
        'WEATHER ALERTS: Unavailable.';


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
`;

        }

        else {

            weatherAlertText = `
WEATHER ALERT STATUS:

No active weather alert is currently reported.
`;

        }

    }


    /* =====================================================
       UV INDEX
    ===================================================== */

    let uvText =
        'UV INDEX: Unavailable.';


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


    /* =====================================================
       MOON DATA
    ===================================================== */

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

Moon phase:
${moon.moonPhase ?? 'Unavailable'}
`;

    }


    /* =====================================================
       FINAL CONTEXT
    ===================================================== */

    return `
VERIFIED MEGHAI LIVE WEATHER CONTEXT


LOCATION:

Name:
${locationName}

Country:
${country}

Latitude:
${liveWeather.location.latitude}

Longitude:
${liveWeather.location.longitude}


${currentWeatherText}


${hourlyForecastText}


${fiveDayForecastText}


${airQualityText}


${weatherAlertText}


${uvText}


${moonText}


STRICT DATA RULES:

1. Use verified values above for live weather.

2. Use hourly forecast for rain questions.

3. Use 5-day forecast for future weather questions.

4. Never invent weather values.

5. For "here", "my location", or "today",
use this exact location and context.

6. Current weather and future forecast
are different things.

7. Give practical recommendations when useful.
`;

};


/* =========================================================
   COMPONENT
========================================================= */

export const VoiceMode:
    React.FC<
        VoiceModeProps
    > = ({
        onClose,
    }) => {


        /* =======================================================
           STATE
        ======================================================= */

        const [
            status,
            setStatus,
        ] = useState<
            VoiceStatus
        >(
            'idle'
        );


        const [
            transcript,
            setTranscript,
        ] = useState(
            ''
        );


        const [
            errorMessage,
            setErrorMessage,
        ] = useState(
            ''
        );


        /* =======================================================
           REFS
        ======================================================= */

        const recognitionRef =
            useRef<
                SpeechRecognitionInstance | null
            >(
                null
            );


        const isManuallyStoppedRef =
            useRef(
                false
            );


        const isMountedRef =
            useRef(
                true
            );


        const audioRef =
            useRef<
                HTMLAudioElement | null
            >(
                null
            );


        const audioUrlRef =
            useRef<
                string | null
            >(
                null
            );


        const playbackIdRef =
            useRef(
                0
            );


        /* =======================================================
           CLEANUP
        ======================================================= */

        useEffect(() => {

            isMountedRef.current =
                true;


            return () => {

                isMountedRef.current =
                    false;


                recognitionRef.current?.abort();

                playbackIdRef.current += 1;


                if (
                    audioRef.current
                ) {

                    audioRef.current.pause();

                    audioRef.current.currentTime =
                        0;

                    audioRef.current =
                        null;

                }


                if (
                    audioUrlRef.current
                ) {

                    URL.revokeObjectURL(
                        audioUrlRef.current
                    );

                    audioUrlRef.current =
                        null;

                }

            };

        }, []);


        /* =======================================================
           STOP SPEAKING
        ======================================================= */

        const stopSpeaking =
            () => {

                /* Invalidate every in-flight playback request. */
                playbackIdRef.current += 1;

                const audio =
                    audioRef.current;

                const audioUrl =
                    audioUrlRef.current;

                audioRef.current =
                    null;

                audioUrlRef.current =
                    null;

                if (
                    audio
                ) {

                    audio.onplay =
                        null;

                    audio.onended =
                        null;

                    audio.onerror =
                        null;

                    audio.pause();

                    audio.currentTime =
                        0;

                }

                if (
                    audioUrl
                ) {

                    URL.revokeObjectURL(
                        audioUrl
                    );

                }

            };


        /* =======================================================
           CLOSE
        ======================================================= */

        const handleClose = () => {

            isManuallyStoppedRef.current =
                true;


            recognitionRef.current
                ?.abort();


            stopSpeaking();


            onClose();

        };


        /* =======================================================
           SPEAK RESPONSE — EDGE TTS BACKEND
        ======================================================= */

        const speakResponse =
            async (
                text: string
            ) => {

                const playbackId =
                    playbackIdRef.current + 1;

                playbackIdRef.current =
                    playbackId;

                /* Stop old audio without invalidating this new request. */
                const previousAudio =
                    audioRef.current;

                const previousUrl =
                    audioUrlRef.current;

                audioRef.current =
                    null;

                audioUrlRef.current =
                    null;

                if (
                    previousAudio
                ) {

                    previousAudio.onplay =
                        null;

                    previousAudio.onended =
                        null;

                    previousAudio.onerror =
                        null;

                    previousAudio.pause();

                    previousAudio.currentTime =
                        0;

                }

                if (
                    previousUrl
                ) {

                    URL.revokeObjectURL(
                        previousUrl
                    );

                }

                try {

                    if (
                        isMountedRef.current
                    ) {

                        setStatus(
                            'speaking'
                        );

                        setErrorMessage(
                            ''
                        );

                    }

                    const response =
                        await fetch(

                            `${API_BASE_URL}/api/weather/tts/`,

                            {

                                method:
                                    'POST',

                                headers: {

                                    'Content-Type':
                                        'application/json',

                                    /* Do not force audio/mpeg here.
                                       DRF can return 406 during content
                                       negotiation when this header is strict. */
                                    Accept:
                                        '*/*',

                                },

                                body:
                                    JSON.stringify(
                                        {
                                            text,
                                        }
                                    ),

                            }

                        );

                    if (
                        playbackIdRef.current !==
                        playbackId
                    ) {

                        return;

                    }

                    if (
                        !response.ok
                    ) {

                        let errorMessage =
                            `TTS request failed: ${response.status}`;

                        try {

                            const errorData =
                                await response.json();

                            errorMessage =
                                errorData.error ||
                                errorMessage;

                        }

                        catch {

                            /* Non-JSON error response. */

                        }

                        throw new Error(
                            errorMessage
                        );

                    }

                    const audioBlob =
                        await response.blob();

                    if (
                        playbackIdRef.current !==
                        playbackId
                    ) {

                        return;

                    }

                    if (
                        !audioBlob.size
                    ) {

                        throw new Error(
                            'Empty audio response received.'
                        );

                    }

                    const audioUrl =
                        URL.createObjectURL(
                            audioBlob
                        );

                    if (
                        playbackIdRef.current !==
                        playbackId
                    ) {

                        URL.revokeObjectURL(
                            audioUrl
                        );

                        return;

                    }

                    const audio =
                        new Audio(
                            audioUrl
                        );

                    audioRef.current =
                        audio;

                    audioUrlRef.current =
                        audioUrl;

                    const cleanupCurrentAudio =
                        () => {

                            if (
                                audioRef.current ===
                                audio
                            ) {

                                audioRef.current =
                                    null;

                            }

                            if (
                                audioUrlRef.current ===
                                audioUrl
                            ) {

                                URL.revokeObjectURL(
                                    audioUrl
                                );

                                audioUrlRef.current =
                                    null;

                            }

                        };

                    audio.onplay =
                        () => {

                            if (
                                playbackIdRef.current ===
                                playbackId &&
                                isMountedRef.current
                            ) {

                                setStatus(
                                    'speaking'
                                );

                            }

                        };

                    audio.onended =
                        () => {

                            cleanupCurrentAudio();

                            if (
                                playbackIdRef.current ===
                                playbackId &&
                                isMountedRef.current
                            ) {

                                setStatus(
                                    'idle'
                                );

                            }

                        };

                    audio.onerror =
                        () => {

                            cleanupCurrentAudio();

                            if (
                                playbackIdRef.current ===
                                playbackId &&
                                isMountedRef.current
                            ) {

                                setStatus(
                                    'error'
                                );

                                setErrorMessage(
                                    'Voice playback failed. Please try again.'
                                );

                            }

                        };

                    try {

                        await audio.play();

                    }

                    catch (
                        error
                    ) {

                        /* pause() can intentionally interrupt play().
                           That AbortError is not a real TTS failure. */
                        if (
                            error instanceof DOMException &&
                            error.name ===
                            'AbortError'
                        ) {

                            return;

                        }

                        throw error;

                    }

                }

                catch (
                    error
                ) {

                    console.error(
                        'Edge TTS Error:',
                        error
                    );

                    /* Ignore stale / intentionally cancelled requests. */
                    if (
                        playbackIdRef.current !==
                        playbackId
                    ) {

                        return;

                    }

                    stopSpeaking();

                    if (
                        isMountedRef.current
                    ) {

                        setStatus(
                            'error'
                        );

                        setErrorMessage(
                            'MeghAI voice service কাজ করছে না। আবার চেষ্টা করুন।'
                        );

                    }

                }

            };


        /* =======================================================
           GET AI RESPONSE
        ======================================================= */

        const getAIResponse =
            async (
                userQuery: string
            ) => {

                try {

                    setStatus(
                        'thinking'
                    );


                    if (
                        !GEMINI_API_KEY
                    ) {

                        throw new Error(
                            'Gemini API key is missing.'
                        );

                    }


                    /*
                      ===============================================
                      DETECT USER LANGUAGE
                    =============================================== */

                    const detectedLanguage =
                        detectLanguage(
                            userQuery
                        );


                    /*
                      ===============================================
                      FETCH FRESH WEATHER DATA
                    =============================================== */

                    const freshWeatherContext =
                        await fetchWeatherContext();


                    const liveContext =
                        buildLiveContext(
                            freshWeatherContext
                        );


                    /*
                      ===============================================
                      GEMINI
                    =============================================== */

                    const ai =
                        new GoogleGenAI({

                            apiKey:
                                GEMINI_API_KEY,

                        });


                    /*
                      ===============================================
                      LANGUAGE RULE
                    =============================================== */

                    const languageInstruction =

                        detectedLanguage.name ===
                            'Bengali'

                            ? `
LANGUAGE REQUIREMENT:

The user's question is in Bengali.

You MUST answer in Bengali script.

Do not answer in English.

Use natural spoken Bengali.

Example style:

"এখন তাপমাত্রা প্রায় ৩০ ডিগ্রি সেলসিয়াস। 
আজ বৃষ্টির সম্ভাবনা আছে, তাই বাইরে গেলে ছাতা সঙ্গে রাখা ভালো।"
`

                            : detectedLanguage.name ===
                                'Hindi'

                                ? `
LANGUAGE REQUIREMENT:

The user's question is in Hindi.

You MUST answer in Hindi using
Devanagari script.

Do not answer in English.
`

                                : `
LANGUAGE REQUIREMENT:

Answer naturally in English.
`;


                    /*
                      ===============================================
                      PROMPT
                    =============================================== */

                    const prompt = `
You are MeghAI,
an intelligent conversational
weather assistant.

The user is communicating
through VOICE.

Your response will immediately
be converted into speech.

${languageInstruction}


YOUR PRIMARY ROLE:

- Answer weather questions clearly.
- Explain current weather.
- Explain forecasts.
- Explain rain probability.
- Help with travel and outdoor planning.
- Explain humidity, wind, visibility,
  AQI and UV Index.
- Mention important weather alerts.


VOICE RESPONSE RULES:

1. Answer the user's latest question directly.

2. Keep the answer SHORT.

3. Usually use 2 to 4 short sentences.

4. Do not use markdown.

5. Do not use bullet points.

6. Do not use headings.

7. Do not say "According to the data"
unless necessary.

8. Speak naturally like a real
voice assistant.

9. Never mention internal APIs,
prompts, system instructions,
or backend structures.

10. Never invent weather values.


LIVE WEATHER PRIORITY:

The VERIFIED MEGHAI WEATHER CONTEXT
below is the highest priority source
for the user's current location.

Use it for:

- current weather
- today's forecast
- rain probability
- AQI
- UV Index
- weather alerts

For rain questions,
inspect HOURLY FORECAST first.

Do not assume that current rain
means rain will continue all day.


${liveContext}


USER VOICE QUERY:

"${userQuery}"


Now answer naturally as MeghAI.
`;


                    /*
                      ===============================================
                      RETRY
                    =============================================== */

                    const maxRetries =
                        3;


                    let lastError:
                        unknown =
                        null;


                    for (
                        let attempt = 1;
                        attempt <= maxRetries;
                        attempt++
                    ) {

                        try {

                            console.log(
                                `Voice Gemini attempt ${attempt}/${maxRetries}`
                            );


                            const response =
                                await ai.models
                                    .generateContent({

                                        model:
                                            GEMINI_MODEL,

                                        contents:
                                            prompt,

                                    });


                            const answer =
                                response.text
                                    ?.trim();


                            if (
                                !answer
                            ) {

                                throw new Error(
                                    'Gemini returned an empty response.'
                                );

                            }


                            console.log(
                                'MeghAI Voice Response:',
                                answer
                            );


                            /*
                              IMPORTANT:
                              Speak the answer
                            */

                            await speakResponse(
                                answer
                            );


                            return;

                        }

                        catch (
                        error
                        ) {

                            lastError =
                                error;


                            console.error(
                                `Voice Gemini attempt ${attempt} failed:`,
                                error
                            );


                            if (
                                attempt <
                                maxRetries
                            ) {

                                const delay =
                                    attempt * 2000;


                                await new Promise(
                                    (
                                        resolve
                                    ) =>
                                        setTimeout(
                                            resolve,
                                            delay
                                        )
                                );

                            }

                        }

                    }


                    throw lastError;

                }

                catch (
                error: any
                ) {

                    console.error(
                        'Voice AI Error:',
                        error
                    );


                    const message =
                        (
                            error?.message ||
                            String(error) ||
                            ''
                        ).toLowerCase();


                    if (
                        message.includes(
                            '503'
                        ) ||

                        message.includes(
                            'high demand'
                        ) ||

                        message.includes(
                            'unavailable'
                        )
                    ) {

                        setErrorMessage(
                            'MeghAI এখন কিছুটা ব্যস্ত আছে। একটু পরে আবার চেষ্টা করুন।'
                        );

                    }

                    else if (
                        message.includes(
                            '429'
                        )
                    ) {

                        setErrorMessage(
                            'অনেক বেশি রিকোয়েস্ট আসছে। একটু পরে আবার চেষ্টা করুন।'
                        );

                    }

                    else if (
                        message.includes(
                            'api key'
                        )
                    ) {

                        setErrorMessage(
                            'Gemini API configuration সমস্যা হচ্ছে।'
                        );

                    }

                    else {

                        setErrorMessage(
                            'দুঃখিত, আমি এই মুহূর্তে উত্তর দিতে পারছি না। আবার চেষ্টা করুন।'
                        );

                    }


                    setStatus(
                        'error'
                    );

                }

            };


        /* =======================================================
           START LISTENING
        ======================================================= */

        const startListening = () => {

            const SpeechRecognition =

                window.SpeechRecognition ||

                window.webkitSpeechRecognition;


            if (
                !SpeechRecognition
            ) {

                setErrorMessage(
                    'এই ব্রাউজারে voice recognition supported নয়। Google Chrome ব্যবহার করুন।'
                );


                setStatus(
                    'error'
                );

                return;

            }


            stopSpeaking();


            setTranscript(
                ''
            );


            setErrorMessage(
                ''
            );


            isManuallyStoppedRef.current =
                false;


            const recognition =
                new SpeechRecognition();


            recognitionRef.current =
                recognition;


            recognition.continuous =
                false;


            recognition.interimResults =
                true;


            /*
              IMPORTANT
        
              Bengali is the primary language
              because MeghAI is being used
              primarily with Bengali users.
        
              Chrome can still recognize
              English words mixed into Bengali.
            */

            recognition.lang =
                'bn-IN';


            recognition.onresult =
                (
                    event
                ) => {

                    let finalTranscript =
                        '';


                    let interimTranscript =
                        '';


                    for (
                        let i = 0;

                        i <
                        event.results.length;

                        i++
                    ) {

                        const result =
                            event.results[i];


                        const text =
                            result[0]
                                .transcript;


                        if (
                            result.isFinal
                        ) {

                            finalTranscript +=
                                text;

                        }

                        else {

                            interimTranscript +=
                                text;

                        }

                    }


                    setTranscript(

                        finalTranscript ||

                        interimTranscript

                    );


                    if (
                        finalTranscript
                            .trim()
                    ) {

                        isManuallyStoppedRef.current =
                            true;


                        recognition.stop();


                        void getAIResponse(
                            finalTranscript
                                .trim()
                        );

                    }

                };


            recognition.onerror =
                (
                    event
                ) => {

                    console.error(
                        'Speech Recognition Error:',
                        event.error
                    );


                    if (
                        event.error ===
                        'not-allowed'
                    ) {

                        setErrorMessage(
                            'Microphone permission দেওয়া হয়নি। Microphone access allow করুন।'
                        );

                    }

                    else if (
                        event.error ===
                        'no-speech'
                    ) {

                        setErrorMessage(
                            'আমি কোনো কথা শুনতে পাইনি। আবার চেষ্টা করুন।'
                        );

                    }

                    else if (
                        event.error ===
                        'aborted'
                    ) {

                        setStatus(
                            'idle'
                        );

                        return;

                    }

                    else {

                        setErrorMessage(
                            'Voice recognition কাজ করেনি। আবার চেষ্টা করুন।'
                        );

                    }


                    setStatus(
                        'error'
                    );

                };


            recognition.onend =
                () => {

                    if (
                        !isManuallyStoppedRef
                            .current
                    ) {

                        setStatus(
                            'idle'
                        );

                    }

                };


            try {

                recognition.start();


                setStatus(
                    'listening'
                );

            }

            catch (
            error
            ) {

                console.error(
                    'Recognition Start Error:',
                    error
                );


                setStatus(
                    'idle'
                );

            }

        };


        /* =======================================================
           STOP LISTENING
        ======================================================= */

        const stopListening =
            () => {

                isManuallyStoppedRef.current =
                    true;


                recognitionRef.current
                    ?.stop();


                setStatus(
                    'idle'
                );

            };


        /* =======================================================
           MIC CLICK
        ======================================================= */

        const handleMicClick =
            () => {

                if (
                    status ===
                    'listening'
                ) {

                    stopListening();

                    return;

                }


                if (
                    status ===
                    'speaking'
                ) {

                    stopSpeaking();


                    setStatus(
                        'idle'
                    );

                    return;

                }


                if (
                    status ===
                    'thinking'
                ) {

                    return;

                }


                startListening();

            };


        /* =======================================================
           STATUS TEXT
        ======================================================= */

        const getStatusText =
            () => {

                switch (
                status
                ) {

                    case 'listening':

                        return transcript ||

                            'Listening...';


                    case 'thinking':

                        return 'MeghAI is thinking...';


                    case 'speaking':

                        return 'MeghAI is speaking...';


                    case 'error':

                        return errorMessage;


                    default:

                        return 'Tap the microphone and ask anything';

                }

            };


        /* =======================================================
           RENDER
        ======================================================= */

        return (

            <>

                <style>{`

        .voice-mode-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;

          display: flex;
          align-items: center;
          justify-content: center;

          width: 100%;
          height: 100%;

          padding: 24px;
          overflow: hidden;

          background:
            radial-gradient(
              circle at center,
              rgba(14, 165, 233, 0.18) 0%,
              rgba(2, 6, 23, 0.92) 55%,
              rgba(2, 6, 23, 0.98) 100%
            );

          backdrop-filter: blur(18px);

          -webkit-backdrop-filter:
            blur(18px);

          animation:
            voiceFadeIn
            0.3s ease;
        }


        @keyframes voiceFadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }


        .voice-mode-glow {
          position: absolute;

          width: 520px;
          height: 520px;

          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              rgba(14, 165, 233, 0.18),
              transparent 70%
            );

          filter: blur(25px);

          pointer-events: none;

          animation:
            glowPulse
            3s ease-in-out infinite;
        }


        @keyframes glowPulse {

          0%,
          100% {
            transform: scale(0.9);
            opacity: 0.55;
          }

          50% {
            transform: scale(1.1);
            opacity: 1;
          }

        }


        .voice-close-btn {
          position: absolute;

          top: 24px;
          right: 24px;

          z-index: 10;

          display: flex;
          align-items: center;
          justify-content: center;

          width: 46px;
          height: 46px;

          border:
            1px solid
            rgba(255, 255, 255, 0.12);

          border-radius: 50%;

          background:
            rgba(255, 255, 255, 0.08);

          color:
            rgba(255, 255, 255, 0.9);

          cursor: pointer;

          transition:
            all 0.2s ease;
        }


        .voice-close-btn:hover {
          background:
            rgba(255, 255, 255, 0.15);

          transform:
            rotate(90deg);
        }


        .voice-mode-content {
          position: relative;
          z-index: 2;

          display: flex;
          flex-direction: column;

          align-items: center;
          justify-content: center;

          width: 100%;
          max-width: 700px;

          text-align: center;
        }


        .voice-mode-brand {
          display: flex;
          align-items: center;

          gap: 10px;

          margin-bottom: 42px;

          color:
            rgba(255, 255, 255, 0.95);

          font-size: 22px;
          font-weight: 700;
        }


        .voice-mode-brand-icon {
          display: flex;
          align-items: center;
          justify-content: center;

          width: 38px;
          height: 38px;

          border-radius: 12px;

          background:
            linear-gradient(
              135deg,
              #0ea5e9,
              #2563eb
            );
        }


        .voice-visualizer {
          position: relative;

          display: flex;
          align-items: center;
          justify-content: center;

          width: 260px;
          height: 260px;

          margin-bottom: 38px;
        }


        .voice-ring {
          position: absolute;

          border-radius: 50%;

          border:
            1px solid
            rgba(56, 189, 248, 0.2);
        }


        .voice-ring-one {
          width: 140px;
          height: 140px;
        }


        .voice-ring-two {
          width: 190px;
          height: 190px;

          opacity: 0.7;
        }


        .voice-ring-three {
          width: 250px;
          height: 250px;

          opacity: 0.35;
        }


        .voice-visualizer.listening
        .voice-ring {
          animation:
            voiceRipple
            1.8s ease-out infinite;
        }


        .voice-visualizer.listening
        .voice-ring-two {
          animation-delay: 0.3s;
        }


        .voice-visualizer.listening
        .voice-ring-three {
          animation-delay: 0.6s;
        }


        @keyframes voiceRipple {

          0% {
            transform: scale(0.95);
            opacity: 0.8;
          }

          70% {
            transform: scale(1.08);
            opacity: 0.2;
          }

          100% {
            transform: scale(1);
            opacity: 0.5;
          }

        }


        .voice-mic-btn {
          position: relative;
          z-index: 3;

          display: flex;
          align-items: center;
          justify-content: center;

          width: 104px;
          height: 104px;

          border: none;

          border-radius: 50%;

          background:
            linear-gradient(
              135deg,
              #0ea5e9,
              #2563eb
            );

          color: #ffffff;

          cursor: pointer;

          box-shadow:
            0 15px 50px
            rgba(14, 165, 233, 0.45);

          transition:
            transform 0.2s ease;
        }


        .voice-mic-btn:hover {
          transform: scale(1.06);
        }


        .voice-mic-btn.listening {
          background:
            linear-gradient(
              135deg,
              #ef4444,
              #dc2626
            );

          animation:
            micPulse
            1.4s ease-in-out infinite;
        }


        .voice-mic-btn.disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }


        @keyframes micPulse {

          0%,
          100% {
            transform:
              scale(1);
          }

          50% {
            transform:
              scale(1.08);
          }

        }


        .voice-status {
          display: flex;
          flex-direction: column;

          align-items: center;

          gap: 12px;

          width: 100%;
        }


        .voice-status-title {
          margin: 0;

          max-width: 620px;

          color: #ffffff;

          font-size:
            clamp(
              20px,
              3vw,
              30px
            );

          font-weight: 600;

          line-height: 1.45;
        }


        .voice-status-subtitle {
          margin: 0;

          color:
            rgba(226, 232, 240, 0.65);

          font-size: 14px;

          line-height: 1.6;
        }


        .voice-status.error
        .voice-status-title {
          color: #fca5a5;
        }


        .voice-status-icon {
          display: flex;

          align-items: center;
          justify-content: center;

          width: 30px;
          height: 30px;

          color: #38bdf8;
        }


        .voice-status-icon.error {
          color: #f87171;
        }


        .voice-loader {
          animation:
            voiceSpin
            1s linear infinite;
        }


        @keyframes voiceSpin {

          from {
            transform:
              rotate(0deg);
          }

          to {
            transform:
              rotate(360deg);
          }

        }


        .voice-mode-hint {
          position: absolute;

          bottom: 28px;
          left: 50%;

          transform:
            translateX(-50%);

          width: 100%;

          padding: 0 20px;

          color:
            rgba(148, 163, 184, 0.7);

          font-size: 12px;

          text-align: center;
        }


        @media (max-width: 767px) {

          .voice-mode-overlay {
            padding: 18px;
          }


          .voice-close-btn {
            top: 18px;
            right: 18px;

            width: 42px;
            height: 42px;
          }


          .voice-mode-brand {
            margin-bottom: 32px;

            font-size: 20px;
          }


          .voice-visualizer {
            width: 220px;
            height: 220px;

            margin-bottom: 30px;
          }


          .voice-ring-one {
            width: 125px;
            height: 125px;
          }


          .voice-ring-two {
            width: 170px;
            height: 170px;
          }


          .voice-ring-three {
            width: 215px;
            height: 215px;
          }


          .voice-mic-btn {
            width: 92px;
            height: 92px;
          }

        }


        @media (max-width: 400px) {

          .voice-mode-brand {
            margin-bottom: 24px;
          }


          .voice-visualizer {
            width: 190px;
            height: 190px;

            margin-bottom: 26px;
          }


          .voice-ring-one {
            width: 110px;
            height: 110px;
          }


          .voice-ring-two {
            width: 150px;
            height: 150px;
          }


          .voice-ring-three {
            width: 188px;
            height: 188px;
          }


          .voice-mic-btn {
            width: 82px;
            height: 82px;
          }

        }

      `}</style>


                <div
                    className="voice-mode-overlay"
                    role="dialog"
                    aria-modal="true"
                    aria-label="MeghAI Voice Mode"
                >

                    <div
                        className="voice-mode-glow"
                    />


                    <button
                        type="button"
                        className="voice-close-btn"
                        aria-label="Close Voice Mode"
                        onClick={handleClose}
                    >

                        <X size={22} />

                    </button>


                    <div
                        className="voice-mode-content"
                    >


                        <div
                            className="voice-mode-brand"
                        >

                            <div
                                className="voice-mode-brand-icon"
                            >

                                <Sparkles size={20} />

                            </div>


                            <span>
                                MeghAI Voice
                            </span>

                        </div>


                        <div
                            className={`
              voice-visualizer
              ${status === 'listening'
                                    ? 'listening'
                                    : ''
                                }
            `}
                        >

                            <div
                                className="
                voice-ring
                voice-ring-one
              "
                            />

                            <div
                                className="
                voice-ring
                voice-ring-two
              "
                            />

                            <div
                                className="
                voice-ring
                voice-ring-three
              "
                            />


                            <button
                                type="button"
                                className={`
                voice-mic-btn

                ${status === 'listening'
                                        ? 'listening'
                                        : ''
                                    }

                ${status === 'thinking'
                                        ? 'disabled'
                                        : ''
                                    }
              `}
                                aria-label="Voice microphone"
                                disabled={
                                    status === 'thinking'
                                }
                                onClick={
                                    handleMicClick
                                }
                            >

                                {
                                    status === 'thinking'
                                        ? (

                                            <Loader2
                                                size={38}
                                                className="
                        voice-loader
                      "
                                            />

                                        )

                                        : status === 'speaking'

                                            ? (

                                                <Volume2
                                                    size={38}
                                                />

                                            )

                                            : status === 'listening'

                                                ? (

                                                    <MicOff
                                                        size={38}
                                                    />

                                                )

                                                : (

                                                    <Mic
                                                        size={38}
                                                    />

                                                )
                                }

                            </button>

                        </div>


                        <div
                            className={`
              voice-status
              ${status === 'error'
                                    ? 'error'
                                    : ''
                                }
            `}
                        >

                            {
                                status === 'thinking' && (

                                    <div
                                        className="
                    voice-status-icon
                  "
                                    >

                                        <Loader2
                                            size={24}
                                            className="
                      voice-loader
                    "
                                        />

                                    </div>

                                )
                            }


                            {
                                status === 'speaking' && (

                                    <div
                                        className="
                    voice-status-icon
                  "
                                    >

                                        <Volume2
                                            size={24}
                                        />

                                    </div>

                                )
                            }


                            {
                                status === 'error' && (

                                    <div
                                        className="
                    voice-status-icon
                    error
                  "
                                    >

                                        <AlertCircle
                                            size={24}
                                        />

                                    </div>

                                )
                            }


                            <h2
                                className="
                voice-status-title
              "
                            >

                                {getStatusText()}

                            </h2>


                            <p
                                className="
                voice-status-subtitle
              "
                            >

                                Speak naturally in Bengali,
                                Hindi or English

                            </p>

                        </div>


                    </div>


                    <div
                        className="
            voice-mode-hint
          "
                    >

                        Tap the microphone •
                        Ask your weather question •
                        MeghAI will answer you

                    </div>


                </div>

            </>

        );

    };