from datetime import datetime
import time


class WeatherTransformer:
    """
    Converts raw OpenWeather responses into
    MeghAI's standardized weather format.
    """

    # =========================================================
    # CURRENT WEATHER
    # =========================================================

    @staticmethod
    def current_weather(data: dict) -> dict:
        """
        Converts OpenWeather current weather response
        into MeghAI's standardized current weather format.

        IMPORTANT:
        OpenWeather visibility is returned in meters.
        MeghAI exposes visibility in kilometers.
        """

        if not data:
            raise ValueError(
                "Current weather data unavailable."
            )

        # -----------------------------------------------------
        # BASIC DATA
        # -----------------------------------------------------

        coordinates = data.get("coord", {})
        system_data = data.get("sys", {})
        main_data = data.get("main", {})
        wind_data = data.get("wind", {})
        weather_list = data.get("weather", [])
        clouds_data = data.get("clouds", {})
        rain_data = data.get("rain", {})

        weather_data = (
            weather_list[0]
            if weather_list
            else {}
        )

        # -----------------------------------------------------
        # VISIBILITY
        # -----------------------------------------------------
        #
        # OpenWeather returns visibility in meters.
        #
        # Example:
        #
        # 10000 meters = 10 km
        #
        # Convert meters -> kilometers.
        # -----------------------------------------------------

        visibility_meters = data.get("visibility")

        if visibility_meters is not None:

            try:
                visibility_km = round(
                    float(visibility_meters) / 1000,
                    1,
                )

            except (TypeError, ValueError):

                visibility_km = None

        else:

            visibility_km = None

        # -----------------------------------------------------
        # TEMPERATURE
        # -----------------------------------------------------

        temperature = main_data.get("temp")

        feels_like = main_data.get(
            "feels_like"
        )

        temperature_min = main_data.get(
            "temp_min"
        )

        temperature_max = main_data.get(
            "temp_max"
        )

        # -----------------------------------------------------
        # FINAL RESPONSE
        # -----------------------------------------------------

        return {

            # =================================================
            # LOCATION
            # =================================================

            "location": {

                "name": data.get("name"),

                "country": system_data.get(
                    "country"
                ),

                "latitude": coordinates.get(
                    "lat"
                ),

                "longitude": coordinates.get(
                    "lon"
                ),
            },

            # =================================================
            # WEATHER
            # =================================================

            "weather": {

                "temperature": temperature,

                "feels_like": feels_like,

                "temperature_min": temperature_min,

                "temperature_max": temperature_max,

                "pressure": main_data.get(
                    "pressure"
                ),

                "humidity": main_data.get(
                    "humidity"
                ),

                "condition": weather_data.get(
                    "main"
                ),

                "description": weather_data.get(
                    "description"
                ),

                "icon": weather_data.get(
                    "icon"
                ),
            },

            # =================================================
            # WIND
            # =================================================

            "wind": {

                "speed": wind_data.get(
                    "speed"
                ),

                "direction": wind_data.get(
                    "deg"
                ),

                "gust": wind_data.get(
                    "gust"
                ),
            },

            # =================================================
            # VISIBILITY
            # =================================================

            "visibility": visibility_km,

            # Keep raw value available as well.
            # Useful if needed later.
            "visibility_meters": visibility_meters,

            # =================================================
            # CLOUDS
            # =================================================

            "clouds": clouds_data.get(
                "all"
            ),

            # =================================================
            # RAIN
            # =================================================

            "rain": {

                "last_1h": rain_data.get(
                    "1h",
                    0,
                ),

                "last_3h": rain_data.get(
                    "3h",
                    0,
                ),
            },

            # =================================================
            # SUN
            # =================================================

            "sun": {

                "sunrise": system_data.get(
                    "sunrise"
                ),

                "sunset": system_data.get(
                    "sunset"
                ),
            },

            # =================================================
            # META
            # =================================================

            "timezone": data.get(
                "timezone"
            ),

            "timestamp": data.get(
                "dt"
            ),
        }

    # =========================================================
    # HOURLY FORECAST
    # =========================================================

    @staticmethod
    def hourly_forecast(data: dict) -> dict:
        """
        Converts OpenWeather 5-day / 3-hour forecast
        into MeghAI's next 24-hour forecast format.
        """

        forecast_list = data.get(
            "list",
            []
        )

        city = data.get(
            "city",
            {}
        )

        if not forecast_list:

            return {
                "location": {
                    "name": city.get(
                        "name"
                    ),
                    "country": city.get(
                        "country"
                    ),
                },

                "forecast": [],

                "max_rain_probability": 0,
            }

        current_timestamp = int(
            time.time()
        )

        # -----------------------------------------------------
        # NEXT 24 HOURS
        # -----------------------------------------------------

        next_24_hours = [

            item

            for item in forecast_list

            if current_timestamp
            <= item.get("dt", 0)
            <= current_timestamp
            + (24 * 60 * 60)

        ]

        # OpenWeather 3-hour data fallback
        if not next_24_hours:

            next_24_hours = forecast_list[:8]

        hourly_forecast = []

        # -----------------------------------------------------
        # TRANSFORM EACH FORECAST
        # -----------------------------------------------------

        for item in next_24_hours:

            timestamp = item.get(
                "dt"
            )

            main_data = item.get(
                "main",
                {}
            )

            weather_list = item.get(
                "weather",
                []
            )

            weather_data = (
                weather_list[0]
                if weather_list
                else {}
            )

            # -------------------------------------------------
            # RAIN PROBABILITY
            # -------------------------------------------------

            rain_probability = round(
                (item.get("pop") or 0)
                * 100
            )

            # -------------------------------------------------
            # TIME
            # -------------------------------------------------

            if timestamp:

                formatted_time = (
                    datetime.fromtimestamp(
                        timestamp
                    )
                    .strftime("%I %p")
                    .lstrip("0")
                )

            else:

                formatted_time = "N/A"

            # -------------------------------------------------
            # APPEND
            # -------------------------------------------------

            hourly_forecast.append({

                "time": formatted_time,

                "timestamp": timestamp,

                "tempVal": round(
                    main_data.get(
                        "temp",
                        0
                    )
                ),

                "feelsLike": round(
                    main_data.get(
                        "feels_like",
                        0
                    )
                ),

                "rainProbability":
                    rain_probability,

                "weather": (
                    weather_data.get(
                        "main"
                    )
                    or "Unknown"
                ),
            })

        # -----------------------------------------------------
        # MAX RAIN PROBABILITY
        # -----------------------------------------------------

        max_rain_probability = max(

            (
                item[
                    "rainProbability"
                ]

                for item
                in hourly_forecast
            ),

            default=0,
        )

        # -----------------------------------------------------
        # FINAL RESPONSE
        # -----------------------------------------------------

        return {

            "location": {

                "name": city.get(
                    "name"
                ),

                "country": city.get(
                    "country"
                ),
            },

            "forecast":
                hourly_forecast,

            "max_rain_probability":
                max_rain_probability,
        }

    # =========================================================
    # 5-DAY FORECAST
    # =========================================================

    @staticmethod
    def five_day_forecast(data: dict) -> dict:
        """
        Converts OpenWeather 5-day / 3-hour forecast
        into MeghAI's daily 5-day forecast format.
        """

        forecast_list = data.get(
            "list",
            []
        )

        city = data.get(
            "city",
            {}
        )

        if not forecast_list:

            return {

                "location": {

                    "name": city.get(
                        "name"
                    ),

                    "country": city.get(
                        "country"
                    ),
                },

                "forecast": [],
            }

        # -----------------------------------------------------
        # GROUP BY DATE
        # -----------------------------------------------------

        grouped = {}

        for item in forecast_list:

            timestamp = item.get(
                "dt"
            )

            if not timestamp:
                continue

            date_key = datetime.fromtimestamp(
                timestamp
            ).strftime(
                "%Y-%m-%d"
            )

            if date_key not in grouped:

                grouped[date_key] = []

            grouped[date_key].append(
                item
            )

        # -----------------------------------------------------
        # BUILD DAILY FORECAST
        # -----------------------------------------------------

        daily_forecast = []

        for index, (
            date_key,
            items
        ) in enumerate(
            grouped.items()
        ):

            if index >= 5:
                break

            # -------------------------------------------------
            # MIN TEMPERATURE
            # -------------------------------------------------

            temperatures_min = [

                item.get(
                    "main",
                    {}
                ).get(
                    "temp_min"
                )

                for item in items

                if item.get(
                    "main",
                    {}
                ).get(
                    "temp_min"
                ) is not None

            ]

            min_temp = (

                round(
                    min(
                        temperatures_min
                    )
                )

                if temperatures_min

                else 0
            )

            # -------------------------------------------------
            # MAX TEMPERATURE
            # -------------------------------------------------

            temperatures_max = [

                item.get(
                    "main",
                    {}
                ).get(
                    "temp_max"
                )

                for item in items

                if item.get(
                    "main",
                    {}
                ).get(
                    "temp_max"
                ) is not None

            ]

            max_temp = (

                round(
                    max(
                        temperatures_max
                    )
                )

                if temperatures_max

                else 0
            )

            # -------------------------------------------------
            # REPRESENTATIVE WEATHER
            # CLOSEST TO 12 PM
            # -------------------------------------------------

            representative_item = min(

                items,

                key=lambda item:
                    abs(
                        datetime.fromtimestamp(
                            item.get(
                                "dt",
                                0
                            )
                        ).hour
                        - 12
                    ),
            )

            weather_list = (
                representative_item.get(
                    "weather",
                    []
                )
            )

            weather = (

                weather_list[0]

                if weather_list

                else {}
            )

            # -------------------------------------------------
            # RAIN PROBABILITY
            # -------------------------------------------------

            rain_values = [

                (item.get("pop") or 0)
                * 100

                for item in items

            ]

            rain_probability = (

                round(
                    max(
                        rain_values
                    )
                )

                if rain_values

                else 0
            )

            # -------------------------------------------------
            # DATE
            # -------------------------------------------------

            timestamp = items[0].get(
                "dt"
            )

            if timestamp:

                date_object = (
                    datetime.fromtimestamp(
                        timestamp
                    )
                )

                day_name = (
                    date_object.strftime(
                        "%A"
                    )
                )

                short_date = (
                    date_object.strftime(
                        "%d %b"
                    )
                )

            else:

                day_name = "Unknown"

                short_date = "N/A"

            # -------------------------------------------------
            # WEATHER DETAILS
            # -------------------------------------------------

            weather_id = weather.get(
                "id",
                800
            )

            weather_icon = weather.get(
                "icon",
                "01d"
            )

            weather_description = (
                weather.get(
                    "description",
                    "Unknown"
                )
            )

            # -------------------------------------------------
            # BAR COLOR
            # -------------------------------------------------

            if 200 <= weather_id < 300:

                bar_color = "#818cf8"

            elif 300 <= weather_id < 600:

                bar_color = "#38bdf8"

            elif 600 <= weather_id < 700:

                bar_color = "#bae6fd"

            elif 700 <= weather_id < 800:

                bar_color = "#94a3b8"

            elif weather_id == 800:

                bar_color = "#facc15"

            elif weather_id > 800:

                bar_color = "#60a5fa"

            else:

                bar_color = "#38bdf8"

            # -------------------------------------------------
            # FINAL DAILY OBJECT
            # -------------------------------------------------

            daily_forecast.append({

                "day": day_name,

                "date": short_date,

                "icon": weather_icon,

                "iconUrl": (
                    "https://openweathermap.org/img/wn/"
                    f"{weather_icon}@2x.png"
                ),

                "minTemp": min_temp,

                "maxTemp": max_temp,

                "description":
                    weather_description,

                "rainProbability":
                    rain_probability,

                "barColor":
                    bar_color,
            })

        # -----------------------------------------------------
        # FINAL RESPONSE
        # -----------------------------------------------------

        return {

            "location": {

                "name": city.get(
                    "name"
                ),

                "country": city.get(
                    "country"
                ),
            },

            "forecast":
                daily_forecast,
        }

    # =========================================================
    # AIR QUALITY
    # =========================================================

    @staticmethod
    def air_quality(data: dict) -> dict:
        """
        Converts OpenWeather Air Pollution response
        into MeghAI's standardized AQI format.
        """

        if not data.get("list"):

            raise ValueError(
                "Air quality data unavailable."
            )

        current = data[
            "list"
        ][0]

        main = current.get(
            "main",
            {}
        )

        components = current.get(
            "components",
            {}
        )

        return {

            "aqi": main.get(
                "aqi"
            ),

            "pm25": components.get(
                "pm2_5",
                0,
            ),

            "pm10": components.get(
                "pm10",
                0,
            ),

            "co": components.get(
                "co",
                0,
            ),

            "no2": components.get(
                "no2",
                0,
            ),

            "o3": components.get(
                "o3",
                0,
            ),

            "so2": components.get(
                "so2",
                0,
            ),

            "timestamp": current.get(
                "dt"
            ),
        }

    # =========================================================
    # UV INDEX
    # =========================================================

    @staticmethod
    def uv_index(data: dict) -> dict:
        """
        Converts WeatherAPI UV response
        into MeghAI's standardized UV Index format.
        """

        current = data.get(
            "current",
            {}
        )

        location = data.get(
            "location",
            {}
        )

        # -----------------------------------------------------
        # CURRENT UV
        # -----------------------------------------------------

        uv_index = current.get(
            "uv"
        )

        if uv_index is None:

            raise ValueError(
                "Current UV Index data unavailable."
            )

        try:

            uv_index = float(
                uv_index
            )

        except (
            TypeError,
            ValueError
        ):

            raise ValueError(
                "Invalid UV Index value received from WeatherAPI."
            )

        # -----------------------------------------------------
        # UV MAX
        # -----------------------------------------------------

        uv_index_max = uv_index

        # -----------------------------------------------------
        # UV LEVEL
        # -----------------------------------------------------

        if uv_index < 3:

            level = "Low"

            recommendation = (
                "Minimal protection required."
            )

        elif uv_index < 6:

            level = "Moderate"

            recommendation = (
                "Protection recommended."
            )

        elif uv_index < 8:

            level = "High"

            recommendation = (
                "Protection required."
            )

        elif uv_index < 11:

            level = "Very High"

            recommendation = (
                "Extra protection required."
            )

        else:

            level = "Extreme"

            recommendation = (
                "Avoid direct sunlight when possible."
            )

        # -----------------------------------------------------
        # PROGRESS
        # -----------------------------------------------------

        uv_progress = min(

            round(
                (uv_index / 11)
                * 100
            ),

            100,
        )

        # -----------------------------------------------------
        # FINAL RESPONSE
        # -----------------------------------------------------

        return {

            "uvIndex": round(
                uv_index,
                1,
            ),

            "uvIndexMax": round(
                uv_index_max,
                1,
            ),

            "level": level,

            "recommendation":
                recommendation,

            "progress":
                uv_progress,

            "timestamp":
                current.get(
                    "last_updated"
                ),

            "timezone":
                location.get(
                    "tz_id"
                ),

            "latitude":
                location.get(
                    "lat"
                ),

            "longitude":
                location.get(
                    "lon"
                ),
        }

        # =========================================================
    # MOON DATA
    # =========================================================

    @staticmethod
    def moon_data(data: dict) -> dict:
        """
        Converts MET Norway Sunrise API Moon response
        into MeghAI's standardized moon data format.
        """

        if not data:

            raise ValueError(
                "Moon data unavailable."
            )

        # =====================================================
        # BASIC DATA
        # =====================================================

        properties = data.get(
            "properties",
            {}
        )

        geometry = data.get(
            "geometry",
            {}
        )

        coordinates = geometry.get(
            "coordinates",
            []
        )

        # GeoJSON format:
        # [longitude, latitude]

        longitude = (
            coordinates[0]
            if len(coordinates) > 0
            else None
        )

        latitude = (
            coordinates[1]
            if len(coordinates) > 1
            else None
        )

        # =====================================================
        # MOON EVENTS
        # =====================================================

        moonrise_data = properties.get(
            "moonrise"
        ) or {}

        moonset_data = properties.get(
            "moonset"
        ) or {}

        high_moon_data = properties.get(
            "high_moon"
        ) or {}

        low_moon_data = properties.get(
            "low_moon"
        ) or {}

        # =====================================================
        # MOON PHASE
        # =====================================================

        moon_phase = properties.get(
            "moonphase"
        )

        # =====================================================
        # FINAL RESPONSE
        # =====================================================

        return {

            # =================================================
            # MOONRISE
            # =================================================

            "moonrise": {

                "time": moonrise_data.get(
                    "time"
                ),

                "azimuth": moonrise_data.get(
                    "azimuth"
                ),
            },

            # =================================================
            # MOONSET
            # =================================================

            "moonset": {

                "time": moonset_data.get(
                    "time"
                ),

                "azimuth": moonset_data.get(
                    "azimuth"
                ),
            },

            # =================================================
            # HIGH MOON
            # =================================================

            "highMoon": {

                "time": high_moon_data.get(
                    "time"
                ),

                "elevation": high_moon_data.get(
                    "disc_centre_elevation"
                ),

                "visible": high_moon_data.get(
                    "visible"
                ),
            },

            # =================================================
            # LOW MOON
            # =================================================

            "lowMoon": {

                "time": low_moon_data.get(
                    "time"
                ),

                "elevation": low_moon_data.get(
                    "disc_centre_elevation"
                ),

                "visible": low_moon_data.get(
                    "visible"
                ),
            },

            # =================================================
            # MOON PHASE
            # =================================================

            "moonPhase": moon_phase,

            # =================================================
            # LOCATION
            # =================================================

            "latitude": latitude,

            "longitude": longitude,

            # =================================================
            # META
            # =================================================

            "body": properties.get(
                "body"
            ),

            "interval": (
                data.get(
                    "when",
                    {}
                ).get(
                    "interval"
                )
            ),
        }