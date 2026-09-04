from concurrent.futures import ThreadPoolExecutor, as_completed

from .openweather import OpenWeatherService
from .transformer import WeatherTransformer
from .alert_service import WeatherAlertService
from .uv_service import UVService
from .moon_service import MoonService


class WeatherContextService:
    """
    Collects all available MeghAI weather data and
    converts it into a unified AI-ready context.

    Optimizations:
    - Forecast API is called only once.
    - The same forecast response is used for:
        1. Hourly forecast
        2. Five-day forecast
    - Independent APIs are fetched concurrently.
    - Failure of one provider does not break
      the complete weather context.
    """

    DEFAULT_TIMEZONE_OFFSET = "+05:30"

    # =========================================================
    # PUBLIC METHOD
    # =========================================================

    @classmethod
    def get_weather_context(
        cls,
        latitude: float,
        longitude: float,
        timezone_offset: str = None,
        target_date: str = None,
    ) -> dict:
        """
        Fetches all available MeghAI weather data for
        the given coordinates.
        """

        # =====================================================
        # NORMALIZE + VALIDATE COORDINATES
        # =====================================================

        latitude, longitude = (
            cls._validate_coordinates(
                latitude,
                longitude,
            )
        )

        # =====================================================
        # DEFAULT TIMEZONE
        # =====================================================

        timezone_offset = (
            timezone_offset
            or cls.DEFAULT_TIMEZONE_OFFSET
        )

        # =====================================================
        # FETCH ALL RAW/TRANSFORMED DATA
        # =====================================================

        results = (
            cls._fetch_weather_data(
                latitude=latitude,
                longitude=longitude,
                timezone_offset=timezone_offset,
                target_date=target_date,
            )
        )

        # =====================================================
        # BUILD FINAL CONTEXT
        # =====================================================

        return cls._build_context(
            latitude=latitude,
            longitude=longitude,
            timezone_offset=timezone_offset,
            results=results,
        )

    # =========================================================
    # VALIDATE COORDINATES
    # =========================================================

    @staticmethod
    def _validate_coordinates(
        latitude,
        longitude,
    ):
        """
        Converts and validates latitude and longitude.
        """

        try:

            latitude = float(latitude)
            longitude = float(longitude)

        except (
            TypeError,
            ValueError,
        ):

            raise ValueError(
                "Latitude and longitude "
                "must be valid numbers."
            )

        if not -90 <= latitude <= 90:

            raise ValueError(
                "Latitude must be between -90 and 90."
            )

        if not -180 <= longitude <= 180:

            raise ValueError(
                "Longitude must be between -180 and 180."
            )

        return (
            latitude,
            longitude,
        )

    # =========================================================
    # FETCH WEATHER DATA
    # =========================================================

    @classmethod
    def _fetch_weather_data(
        cls,
        latitude: float,
        longitude: float,
        timezone_offset: str,
        target_date: str = None,
    ) -> dict:
        """
        Fetches independent weather APIs concurrently.

        Important optimization:

        OpenWeather forecast API is fetched only once.
        """

        tasks = {

            # -------------------------------------------------
            # CURRENT WEATHER
            # -------------------------------------------------

            "current_weather": (
                lambda:
                cls._get_current_weather(
                    latitude,
                    longitude,
                )
            ),

            # -------------------------------------------------
            # FORECAST
            #
            # This single response will later be used for:
            #
            # - Hourly forecast
            # - Five-day forecast
            # -------------------------------------------------

            "forecast_raw": (
                lambda:
                cls._get_forecast_raw(
                    latitude,
                    longitude,
                )
            ),

            # -------------------------------------------------
            # AIR QUALITY
            # -------------------------------------------------

            "air_quality": (
                lambda:
                cls._get_air_quality(
                    latitude,
                    longitude,
                )
            ),

            # -------------------------------------------------
            # WEATHER ALERTS
            # -------------------------------------------------

            "weather_alerts": (
                lambda:
                cls._get_weather_alerts(
                    latitude,
                    longitude,
                )
            ),

            # -------------------------------------------------
            # UV INDEX
            # -------------------------------------------------

            "uv_index": (
                lambda:
                cls._get_uv_index(
                    latitude,
                    longitude,
                )
            ),

            # -------------------------------------------------
            # MOON DATA
            # -------------------------------------------------

            "moon_data": (
                lambda:
                cls._get_moon_data(
                    latitude,
                    longitude,
                    timezone_offset,
                    target_date,
                )
            ),
        }

        results = {}

        # =====================================================
        # RUN CONCURRENT REQUESTS
        # =====================================================

        with ThreadPoolExecutor(
            max_workers=len(tasks)
        ) as executor:

            future_to_name = {

                executor.submit(
                    task
                ): name

                for name,
                task in tasks.items()
            }

            for future in as_completed(
                future_to_name
            ):

                name = future_to_name[
                    future
                ]

                try:

                    results[name] = (
                        future.result()
                    )

                except Exception as error:

                    results[name] = {

                        "available": False,

                        "data": None,

                        "error": str(error),
                    }

        # =====================================================
        # PROCESS FORECAST DATA
        # =====================================================

        results = (
            cls._process_forecast_data(
                results
            )
        )

        return results

    # =========================================================
    # CURRENT WEATHER
    # =========================================================

    @staticmethod
    def _get_current_weather(
        latitude: float,
        longitude: float,
    ) -> dict:
        """
        Fetches and transforms current weather.
        """

        raw_data = (
            OpenWeatherService
            .get_current_weather(
                latitude,
                longitude,
            )
        )

        transformed_data = (
            WeatherTransformer
            .current_weather(
                raw_data
            )
        )

        return {

            "available": True,

            "data": transformed_data,

            "error": None,
        }

    # =========================================================
    # RAW FORECAST
    # =========================================================

    @staticmethod
    def _get_forecast_raw(
        latitude: float,
        longitude: float,
    ) -> dict:
        """
        Fetches the OpenWeather forecast once.

        This raw response is reused for both:

        - Hourly forecast
        - Five-day forecast
        """

        raw_data = (
            OpenWeatherService
            .get_forecast(
                latitude,
                longitude,
            )
        )

        if not raw_data:

            raise ValueError(
                "Forecast data unavailable."
            )

        return {

            "available": True,

            "data": raw_data,

            "error": None,
        }

    # =========================================================
    # PROCESS FORECAST DATA
    # =========================================================

    @staticmethod
    def _process_forecast_data(
        results: dict,
    ) -> dict:
        """
        Converts the single raw forecast response into:

        - Hourly forecast
        - Five-day forecast
        """

        forecast_result = (
            results.get(
                "forecast_raw",
                {}
            )
        )

        # =====================================================
        # FORECAST REQUEST FAILED
        # =====================================================

        if not forecast_result.get(
            "available",
            False,
        ):

            error_message = (
                forecast_result.get(
                    "error"
                )
                or "Forecast data unavailable."
            )

            results["hourly_forecast"] = {

                "available": False,

                "data": None,

                "error": error_message,
            }

            results["five_day_forecast"] = {

                "available": False,

                "data": None,

                "error": error_message,
            }

            # Raw forecast should never be exposed
            # in the final AI context.
            results.pop(
                "forecast_raw",
                None,
            )

            return results

        # =====================================================
        # GET RAW FORECAST
        # =====================================================

        raw_forecast = (
            forecast_result.get(
                "data"
            )
        )

        # =====================================================
        # HOURLY FORECAST
        # =====================================================

        try:

            hourly_data = (
                WeatherTransformer
                .hourly_forecast(
                    raw_forecast
                )
            )

            results["hourly_forecast"] = {

                "available": True,

                "data": hourly_data,

                "error": None,
            }

        except Exception as error:

            results["hourly_forecast"] = {

                "available": False,

                "data": None,

                "error": str(error),
            }

        # =====================================================
        # FIVE DAY FORECAST
        # =====================================================

        try:

            five_day_data = (
                WeatherTransformer
                .five_day_forecast(
                    raw_forecast
                )
            )

            results["five_day_forecast"] = {

                "available": True,

                "data": five_day_data,

                "error": None,
            }

        except Exception as error:

            results["five_day_forecast"] = {

                "available": False,

                "data": None,

                "error": str(error),
            }

        # =====================================================
        # REMOVE RAW FORECAST
        # =====================================================

        results.pop(
            "forecast_raw",
            None,
        )

        return results

    # =========================================================
    # AIR QUALITY
    # =========================================================

    @staticmethod
    def _get_air_quality(
        latitude: float,
        longitude: float,
    ) -> dict:
        """
        Fetches and transforms air quality data.
        """

        raw_data = (
            OpenWeatherService
            .get_air_quality(
                latitude,
                longitude,
            )
        )

        transformed_data = (
            WeatherTransformer
            .air_quality(
                raw_data
            )
        )

        return {

            "available": True,

            "data": transformed_data,

            "error": None,
        }

    # =========================================================
    # WEATHER ALERTS
    # =========================================================

    @staticmethod
    def _get_weather_alerts(
        latitude: float,
        longitude: float,
    ) -> dict:
        """
        Fetches weather alerts.
        """

        alert_data = (
            WeatherAlertService
            .get_alert(
                latitude,
                longitude,
            )
        )

        if not alert_data:

            alert_data = {}

        return {

            "available": True,

            "data": alert_data,

            "error": None,
        }

    # =========================================================
    # UV INDEX
    # =========================================================

    @staticmethod
    def _get_uv_index(
        latitude: float,
        longitude: float,
    ) -> dict:
        """
        Fetches and transforms UV Index data.
        """

        raw_data = (
            UVService
            .get_uv_index(
                latitude,
                longitude,
            )
        )

        transformed_data = (
            WeatherTransformer
            .uv_index(
                raw_data
            )
        )

        return {

            "available": True,

            "data": transformed_data,

            "error": None,
        }

    # =========================================================
    # MOON DATA
    # =========================================================

    @staticmethod
    def _get_moon_data(
        latitude: float,
        longitude: float,
        timezone_offset: str,
        target_date: str = None,
    ) -> dict:
        """
        Fetches and transforms moon data.
        """

        raw_data = (
            MoonService
            .get_moon_data(
                latitude,
                longitude,
                timezone_offset,
                target_date,
            )
        )

        transformed_data = (
            WeatherTransformer
            .moon_data(
                raw_data
            )
        )

        return {

            "available": True,

            "data": transformed_data,

            "error": None,
        }

    # =========================================================
    # BUILD FINAL CONTEXT
    # =========================================================

    @staticmethod
    def _build_context(
        latitude: float,
        longitude: float,
        timezone_offset: str,
        results: dict,
    ) -> dict:
        """
        Builds the final AI-ready weather context.
        """

        # =====================================================
        # DEFAULT LOCATION
        # =====================================================

        location = {

            "name": None,

            "country": None,

            "latitude": latitude,

            "longitude": longitude,

            "timezone_offset":
                timezone_offset,
        }

        # =====================================================
        # GET LOCATION FROM CURRENT WEATHER
        # =====================================================

        current_weather_result = (
            results.get(
                "current_weather",
                {}
            )
        )

        current_weather_data = (
            current_weather_result.get(
                "data"
            )
        )

        if current_weather_data:

            api_location = (
                current_weather_data.get(
                    "location",
                    {}
                )
            )

            location["name"] = (
                api_location.get(
                    "name"
                )
            )

            location["country"] = (
                api_location.get(
                    "country"
                )
            )

        # =====================================================
        # DATA AVAILABILITY
        # =====================================================

        availability = {

            name:
            result.get(
                "available",
                False,
            )

            for name,
            result in results.items()
        }

        # =====================================================
        # FINAL CONTEXT
        # =====================================================

        return {

            "success": True,

            "location":
                location,

            "current_weather":
                results.get(
                    "current_weather"
                ),

            "hourly_forecast":
                results.get(
                    "hourly_forecast"
                ),

            "five_day_forecast":
                results.get(
                    "five_day_forecast"
                ),

            "air_quality":
                results.get(
                    "air_quality"
                ),

            "weather_alerts":
                results.get(
                    "weather_alerts"
                ),

            "uv_index":
                results.get(
                    "uv_index"
                ),

            "moon_data":
                results.get(
                    "moon_data"
                ),

            "availability":
                availability,
        }

    # =========================================================
    # AI ENTRY POINT
    # =========================================================

    @classmethod
    def get_ai_summary(
        cls,
        latitude: float,
        longitude: float,
        timezone_offset: str = None,
        target_date: str = None,
    ) -> dict:
        """
        Semantic entry point for AI services.

        Returns the complete unified weather context.
        """

        return cls.get_weather_context(
            latitude=latitude,
            longitude=longitude,
            timezone_offset=timezone_offset,
            target_date=target_date,
        )