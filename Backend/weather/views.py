import asyncio
import os
import uuid

import edge_tts

from django.http import FileResponse
from django.conf import settings

from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from .services.openweather import OpenWeatherService
from .services.transformer import WeatherTransformer
from .services.alert_service import WeatherAlertService
from .services.uv_service import UVService
from .services.moon_service import MoonService
from .services.map_service import WeatherMapService
from .services.weather_context_service import WeatherContextService



# =========================================================
# CURRENT WEATHER
# =========================================================

class CurrentWeatherView(APIView):
    """
    API endpoint for current weather data.
    """

    def get(self, request):

        latitude = request.query_params.get("lat")
        longitude = request.query_params.get("lon")

        if not latitude or not longitude:

            return Response(
                {
                    "success": False,
                    "error": (
                        "Both 'lat' and 'lon' "
                        "query parameters are required."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:

            latitude = float(latitude)
            longitude = float(longitude)

        except ValueError:

            return Response(
                {
                    "success": False,
                    "error": (
                        "'lat' and 'lon' "
                        "must be valid numbers."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:

            raw_data = (
                OpenWeatherService
                .get_current_weather(
                    latitude,
                    longitude,
                )
            )

            weather_data = (
                WeatherTransformer
                .current_weather(
                    raw_data
                )
            )

            return Response(
                {
                    "success": True,
                    "data": weather_data,
                },
                status=status.HTTP_200_OK,
            )

        except Exception as error:

            return Response(
                {
                    "success": False,
                    "error": str(error),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# =========================================================
# HOURLY FORECAST
# =========================================================

class HourlyForecastView(APIView):
    """
    API endpoint for next 24-hour weather forecast.
    """

    def get(self, request):

        latitude = request.query_params.get("lat")
        longitude = request.query_params.get("lon")

        if not latitude or not longitude:

            return Response(
                {
                    "success": False,
                    "error": (
                        "Both 'lat' and 'lon' "
                        "query parameters are required."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:

            latitude = float(latitude)
            longitude = float(longitude)

        except ValueError:

            return Response(
                {
                    "success": False,
                    "error": (
                        "'lat' and 'lon' "
                        "must be valid numbers."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:

            raw_data = (
                OpenWeatherService
                .get_forecast(
                    latitude,
                    longitude,
                )
            )

            hourly_data = (
                WeatherTransformer
                .hourly_forecast(
                    raw_data
                )
            )

            return Response(
                {
                    "success": True,
                    "data": hourly_data,
                },
                status=status.HTTP_200_OK,
            )

        except Exception as error:

            return Response(
                {
                    "success": False,
                    "error": str(error),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# =========================================================
# 5-DAY FORECAST
# =========================================================

class FiveDayForecastView(APIView):
    """
    API endpoint for 5-day weather forecast.
    """

    def get(self, request):

        # =====================================================
        # GET COORDINATES
        # =====================================================

        latitude = request.query_params.get("lat")
        longitude = request.query_params.get("lon")

        # =====================================================
        # VALIDATE PARAMETERS
        # =====================================================

        if not latitude or not longitude:

            return Response(
                {
                    "success": False,
                    "error": (
                        "Both 'lat' and 'lon' "
                        "query parameters are required."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # =====================================================
        # CONVERT COORDINATES
        # =====================================================

        try:

            latitude = float(latitude)
            longitude = float(longitude)

        except ValueError:

            return Response(
                {
                    "success": False,
                    "error": (
                        "'lat' and 'lon' "
                        "must be valid numbers."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # =====================================================
        # FETCH + TRANSFORM
        # =====================================================

        try:

            raw_data = (
                OpenWeatherService
                .get_forecast(
                    latitude,
                    longitude,
                )
            )

            forecast_data = (
                WeatherTransformer
                .five_day_forecast(
                    raw_data
                )
            )

            return Response(
                {
                    "success": True,
                    "data": forecast_data,
                },
                status=status.HTTP_200_OK,
            )

        except Exception as error:

            return Response(
                {
                    "success": False,
                    "error": str(error),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# =========================================================
# AIR QUALITY
# =========================================================

class AirQualityView(APIView):
    """
    API endpoint for current air quality data.
    """

    def get(self, request):

        latitude = request.query_params.get("lat")
        longitude = request.query_params.get("lon")

        if not latitude or not longitude:

            return Response(
                {
                    "success": False,
                    "error": (
                        "Both 'lat' and 'lon' "
                        "query parameters are required."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:

            latitude = float(latitude)
            longitude = float(longitude)

        except ValueError:

            return Response(
                {
                    "success": False,
                    "error": (
                        "'lat' and 'lon' "
                        "must be valid numbers."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:

            raw_data = (
                OpenWeatherService
                .get_air_quality(
                    latitude,
                    longitude,
                )
            )

            air_quality = (
                WeatherTransformer
                .air_quality(
                    raw_data
                )
            )

            return Response(
                {
                    "success": True,
                    "data": air_quality,
                },
                status=status.HTTP_200_OK,
            )

        except Exception as error:

            return Response(
                {
                    "success": False,
                    "error": str(error),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )




# =========================================================
# WEATHER ALERT
# =========================================================

class WeatherAlertView(APIView):
    """
    API endpoint for weather alerts.
    """

    def get(self, request):

        # =====================================================
        # GET COORDINATES
        # =====================================================

        latitude = request.query_params.get("lat")
        longitude = request.query_params.get("lon")

        # =====================================================
        # VALIDATE PARAMETERS
        # =====================================================

        if not latitude or not longitude:

            return Response(
                {
                    "success": False,
                    "error": (
                        "Both 'lat' and 'lon' "
                        "query parameters are required."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # =====================================================
        # CONVERT COORDINATES
        # =====================================================

        try:

            latitude = float(latitude)
            longitude = float(longitude)

        except ValueError:

            return Response(
                {
                    "success": False,
                    "error": (
                        "'lat' and 'lon' "
                        "must be valid numbers."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # =====================================================
        # FETCH WEATHER ALERT
        # =====================================================

        try:

            alert_data = (
                WeatherAlertService
                .get_alert(
                    latitude,
                    longitude,
                )
            )

            return Response(
                alert_data,
                status=status.HTTP_200_OK,
            )

        except Exception as error:

            return Response(
                {
                    "success": False,
                    "error": str(error),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

# =========================================================
# UV INDEX
# =========================================================

class UVIndexView(APIView):
    """
    API endpoint for current UV Index data.
    """

    def get(self, request):

        # =====================================================
        # GET COORDINATES
        # =====================================================

        latitude = request.query_params.get("lat")
        longitude = request.query_params.get("lon")

        # =====================================================
        # VALIDATE PARAMETERS
        # =====================================================

        if not latitude or not longitude:

            return Response(
                {
                    "success": False,
                    "error": (
                        "Both 'lat' and 'lon' "
                        "query parameters are required."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # =====================================================
        # CONVERT COORDINATES
        # =====================================================

        try:

            latitude = float(latitude)
            longitude = float(longitude)

        except ValueError:

            return Response(
                {
                    "success": False,
                    "error": (
                        "'lat' and 'lon' "
                        "must be valid numbers."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # =====================================================
        # FETCH + TRANSFORM UV DATA
        # =====================================================

        try:

            raw_data = (
                UVService
                .get_uv_index(
                    latitude,
                    longitude,
                )
            )

            uv_data = (
                WeatherTransformer
                .uv_index(
                    raw_data
                )
            )

            return Response(
                {
                    "success": True,
                    "data": uv_data,
                },
                status=status.HTTP_200_OK,
            )

        except Exception as error:

            return Response(
                {
                    "success": False,
                    "error": str(error),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

# =========================================================
# MOON DATA
# =========================================================

class MoonView(APIView):
    """
    API endpoint for moonrise, moonset
    and other lunar data.
    """

    def get(self, request):

        # =====================================================
        # GET COORDINATES
        # =====================================================

        latitude = request.query_params.get("lat")
        longitude = request.query_params.get("lon")

        # =====================================================
        # VALIDATE PARAMETERS
        # =====================================================

        if not latitude or not longitude:

            return Response(
                {
                    "success": False,
                    "error": (
                        "Both 'lat' and 'lon' "
                        "query parameters are required."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # =====================================================
        # CONVERT COORDINATES
        # =====================================================

        try:

            latitude = float(latitude)
            longitude = float(longitude)

        except ValueError:

            return Response(
                {
                    "success": False,
                    "error": (
                        "'lat' and 'lon' "
                        "must be valid numbers."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # =====================================================
        # VALIDATE COORDINATE RANGE
        # =====================================================

        if not -90 <= latitude <= 90:

            return Response(
                {
                    "success": False,
                    "error": (
                        "'lat' must be between "
                        "-90 and 90."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not -180 <= longitude <= 180:

            return Response(
                {
                    "success": False,
                    "error": (
                        "'lon' must be between "
                        "-180 and 180."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # =====================================================
        # OPTIONAL PARAMETERS
        # =====================================================

        timezone_offset = (
            request.query_params.get("offset")
            or "+05:30"
        )

        target_date = (
            request.query_params.get("date")
            or None
        )

        # =====================================================
        # FETCH MOON DATA
        # =====================================================

        try:

            raw_data = (
                MoonService
                .get_moon_data(
                    latitude,
                    longitude,
                    timezone_offset,
                    target_date,
                )
            )

            # -------------------------------------------------
            # TEMPORARY RAW RESPONSE
            # -------------------------------------------------
            #
            # We will replace this with:
            #
            # WeatherTransformer.moon_data(raw_data)
            #
            # after confirming the exact MET API response.
            # -------------------------------------------------

            moon_data = (
                WeatherTransformer
                .moon_data(
                    raw_data
                )
            )

            return Response(
                {
                    "success": True,
                    "data": moon_data,
                },
                status=status.HTTP_200_OK,
            )

        except Exception as error:

            return Response(
                {
                    "success": False,
                    "error": str(error),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

# =========================================================
# PRECIPITATION MAP
# =========================================================

class PrecipitationMapView(APIView):
    """
    API endpoint for precipitation map data.

    Required query parameters:
    - north
    - south
    - east
    - west

    Optional:
    - grid_size
    """

    def get(self, request):

        # =====================================================
        # GET MAP BOUNDS
        # =====================================================

        north = request.query_params.get("north")
        south = request.query_params.get("south")
        east = request.query_params.get("east")
        west = request.query_params.get("west")

        grid_size = (
            request.query_params.get("grid_size")
            or 6
        )

        # =====================================================
        # VALIDATE REQUIRED PARAMETERS
        # =====================================================

        if (
            north is None
            or south is None
            or east is None
            or west is None
        ):

            return Response(
                {
                    "success": False,
                    "error": (
                        "The query parameters "
                        "'north', 'south', 'east', and "
                        "'west' are required."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # =====================================================
        # CONVERT PARAMETERS
        # =====================================================

        try:

            north = float(north)
            south = float(south)
            east = float(east)
            west = float(west)

            grid_size = int(grid_size)

        except ValueError:

            return Response(
                {
                    "success": False,
                    "error": (
                        "Map bounds must be valid numbers "
                        "and 'grid_size' must be an integer."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # =====================================================
        # VALIDATE LATITUDE RANGE
        # =====================================================

        if not -90 <= north <= 90:

            return Response(
                {
                    "success": False,
                    "error": (
                        "'north' must be between "
                        "-90 and 90."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not -90 <= south <= 90:

            return Response(
                {
                    "success": False,
                    "error": (
                        "'south' must be between "
                        "-90 and 90."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # =====================================================
        # VALIDATE LONGITUDE RANGE
        # =====================================================

        if not -180 <= east <= 180:

            return Response(
                {
                    "success": False,
                    "error": (
                        "'east' must be between "
                        "-180 and 180."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not -180 <= west <= 180:

            return Response(
                {
                    "success": False,
                    "error": (
                        "'west' must be between "
                        "-180 and 180."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # =====================================================
        # VALIDATE BOUND ORDER
        # =====================================================

        if north <= south:

            return Response(
                {
                    "success": False,
                    "error": (
                        "'north' must be greater than "
                        "'south'."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # =====================================================
        # FETCH PRECIPITATION MAP DATA
        # =====================================================

        try:

            map_data = (
                WeatherMapService
                .get_precipitation_map(
                    north=north,
                    south=south,
                    east=east,
                    west=west,
                    grid_size=grid_size,
                )
            )

            return Response(
                {
                    "success": True,
                    "data": map_data,
                },
                status=status.HTTP_200_OK,
            )

        except Exception as error:

            return Response(
                {
                    "success": False,
                    "error": str(error),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

# =========================================================
# WEATHER CONTEXT
# =========================================================

class WeatherContextView(APIView):
    """
    API endpoint that aggregates all available MeghAI
    weather data into a single response.

    Required query parameters:
    - lat
    - lon

    Optional:
    - offset
    - date
    """

    def get(self, request):

        # =====================================================
        # GET COORDINATES
        # =====================================================

        latitude = request.query_params.get("lat")
        longitude = request.query_params.get("lon")

        # =====================================================
        # VALIDATE REQUIRED PARAMETERS
        # =====================================================

        if not latitude or not longitude:

            return Response(
                {
                    "success": False,
                    "error": (
                        "Both 'lat' and 'lon' "
                        "query parameters are required."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # =====================================================
        # CONVERT COORDINATES
        # =====================================================

        try:

            latitude = float(latitude)
            longitude = float(longitude)

        except (TypeError, ValueError):

            return Response(
                {
                    "success": False,
                    "error": (
                        "'lat' and 'lon' "
                        "must be valid numbers."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # =====================================================
        # VALIDATE LATITUDE
        # =====================================================

        if not -90 <= latitude <= 90:

            return Response(
                {
                    "success": False,
                    "error": (
                        "'lat' must be between "
                        "-90 and 90."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # =====================================================
        # VALIDATE LONGITUDE
        # =====================================================

        if not -180 <= longitude <= 180:

            return Response(
                {
                    "success": False,
                    "error": (
                        "'lon' must be between "
                        "-180 and 180."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # =====================================================
        # OPTIONAL PARAMETERS
        # =====================================================

        timezone_offset = (
            request.query_params.get("offset")
            or "+05:30"
        )

        target_date = (
            request.query_params.get("date")
            or None
        )

        # =====================================================
        # FETCH COMPLETE WEATHER CONTEXT
        # =====================================================

        try:

            weather_context = (
                WeatherContextService
                .get_weather_context(
                    latitude=latitude,
                    longitude=longitude,
                    timezone_offset=timezone_offset,
                    target_date=target_date,
                )
            )

            return Response(
                {
                    "success": True,

                    "data": weather_context,
                },
                status=status.HTTP_200_OK,
            )

        except Exception as error:

            return Response(
                {
                    "success": False,

                    "error": str(error),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

# =========================================================
# EDGE TTS
# =========================================================

class EdgeTTSView(APIView):
    """
    API endpoint for converting text into speech
    using Microsoft Edge TTS.
    """

    def post(self, request):

        # =====================================================
        # GET TEXT
        # =====================================================

        text = request.data.get(
            "text"
        )

        if not text:

            return Response(
                {
                    "success": False,
                    "error": (
                        "'text' is required."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # =====================================================
        # VALIDATE TYPE
        # =====================================================

        if not isinstance(
            text,
            str
        ):

            return Response(
                {
                    "success": False,
                    "error": (
                        "'text' must be a string."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        text = text.strip()

        # =====================================================
        # VALIDATE EMPTY TEXT
        # =====================================================

        if not text:

            return Response(
                {
                    "success": False,
                    "error": (
                        "Text cannot be empty."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # =====================================================
        # LIMIT TEXT LENGTH
        # =====================================================

        if len(text) > 5000:

            return Response(
                {
                    "success": False,
                    "error": (
                        "Maximum text length is "
                        "5000 characters."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # =====================================================
        # TEMP DIRECTORY
        # =====================================================

        temp_dir = os.path.join(
            settings.BASE_DIR,
            "temp_tts"
        )

        os.makedirs(
            temp_dir,
            exist_ok=True
        )

        # =====================================================
        # FILE NAME
        # =====================================================

        filename = (
            f"meghai-{uuid.uuid4()}.mp3"
        )

        output_path = os.path.join(
            temp_dir,
            filename
        )

        # =====================================================
        # GENERATE TTS
        # =====================================================

        async def generate_speech():

            communicate = edge_tts.Communicate(

                text=text,

                voice=(
                    "bn-IN-TanishaaNeural"
                ),

                rate="+0%",

                volume="+0%",

                pitch="+0Hz",

            )

            await communicate.save(
                output_path
            )

        try:

            asyncio.run(
                generate_speech()
            )

            # =================================================
            # RETURN AUDIO
            # =================================================

            audio_file = open(
                output_path,
                "rb"
            )

            response = FileResponse(
                audio_file,
                content_type=(
                    "audio/mpeg"
                ),
            )

            response[
                "Content-Disposition"
            ] = (
                f'inline; filename="{filename}"'
            )

            return response

        except Exception as error:

            print(
                "Edge TTS Error:",
                str(error)
            )

            return Response(
                {
                    "success": False,

                    "error":
                        str(error),

                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )