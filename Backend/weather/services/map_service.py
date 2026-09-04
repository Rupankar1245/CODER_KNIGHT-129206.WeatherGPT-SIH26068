import math

from .openweather import OpenWeatherService


class WeatherMapService:
    """
    Service responsible for generating weather map data.

    Currently supports:
    - Precipitation map data

    The service generates a geographic grid inside
    the requested map bounds and fetches weather data
    for each grid point.
    """


    # =========================================================
    # GRID CONFIGURATION
    # =========================================================

    DEFAULT_GRID_SIZE = 6

    MIN_GRID_SIZE = 3

    MAX_GRID_SIZE = 8


    # =========================================================
    # PRECIPITATION MAP
    # =========================================================

    @classmethod
    def get_precipitation_map(
        cls,
        north: float,
        south: float,
        east: float,
        west: float,
        grid_size: int = DEFAULT_GRID_SIZE,
    ):
        """
        Generate precipitation data for a geographic area.

        Parameters:
        - north: Northern latitude
        - south: Southern latitude
        - east: Eastern longitude
        - west: Western longitude
        - grid_size: Number of grid divisions

        Returns a list of geographic points containing:
        - latitude
        - longitude
        - rain intensity
        - snow intensity
        - precipitation intensity
        - weather condition
        """


        # =====================================================
        # VALIDATE GRID SIZE
        # =====================================================

        grid_size = max(
            cls.MIN_GRID_SIZE,
            min(
                int(grid_size),
                cls.MAX_GRID_SIZE,
            ),
        )


        # =====================================================
        # GENERATE GRID
        # =====================================================

        lat_step = (
            (north - south)
            / grid_size
        )


        lon_step = (
            (east - west)
            / grid_size
        )


        precipitation_points = []


        # =====================================================
        # FETCH WEATHER DATA FOR EACH GRID POINT
        # =====================================================

        for lat_index in range(
            grid_size + 1
        ):

            latitude = (
                south
                + (
                    lat_index
                    * lat_step
                )
            )


            for lon_index in range(
                grid_size + 1
            ):

                longitude = (
                    west
                    + (
                        lon_index
                        * lon_step
                    )
                )


                try:

                    raw_weather = (
                        OpenWeatherService
                        .get_current_weather(
                            latitude,
                            longitude,
                        )
                    )


                    # =========================================
                    # RAIN
                    # =========================================

                    rain_data = (
                        raw_weather.get(
                            "rain",
                            {},
                        )
                    )


                    rain_1h = (
                        rain_data.get(
                            "1h",
                            0,
                        )
                    )


                    # =========================================
                    # SNOW
                    # =========================================

                    snow_data = (
                        raw_weather.get(
                            "snow",
                            {},
                        )
                    )


                    snow_1h = (
                        snow_data.get(
                            "1h",
                            0,
                        )
                    )


                    # =========================================
                    # WEATHER CONDITION
                    # =========================================

                    weather_list = (
                        raw_weather.get(
                            "weather",
                            [],
                        )
                    )


                    if weather_list:

                        condition = (
                            weather_list[0]
                            .get(
                                "main",
                                "Unknown",
                            )
                        )

                    else:

                        condition = (
                            "Unknown"
                        )


                    # =========================================
                    # TEMPERATURE
                    # =========================================

                    temperature = (
                        raw_weather
                        .get(
                            "main",
                            {},
                        )
                        .get(
                            "temp",
                            None,
                        )
                    )


                    # =========================================
                    # TOTAL PRECIPITATION
                    # =========================================

                    precipitation = (
                        float(rain_1h)
                        + float(snow_1h)
                    )


                    # =========================================
                    # STORE GRID POINT
                    # =========================================

                    precipitation_points.append(
                        {
                            "lat": round(
                                latitude,
                                5,
                            ),

                            "lon": round(
                                longitude,
                                5,
                            ),

                            "rain_1h": round(
                                float(rain_1h),
                                2,
                            ),

                            "snow_1h": round(
                                float(snow_1h),
                                2,
                            ),

                            "precipitation": round(
                                precipitation,
                                2,
                            ),

                            "temperature": (
                                round(
                                    float(
                                        temperature
                                    ),
                                    1,
                                )
                                if temperature
                                is not None
                                else None
                            ),

                            "condition": (
                                condition
                            ),
                        }
                    )


                except Exception as error:

                    # =========================================
                    # DON'T FAIL ENTIRE MAP
                    # =========================================
                    #
                    # If one grid point fails,
                    # skip that point and continue.
                    # =========================================

                    print(
                        "Failed to fetch "
                        f"weather for "
                        f"{latitude}, "
                        f"{longitude}: "
                        f"{error}"
                    )


        # =====================================================
        # RETURN MAP DATA
        # =====================================================

        return {
            "layer": "precipitation",

            "bounds": {
                "north": north,
                "south": south,
                "east": east,
                "west": west,
            },

            "grid_size": grid_size,

            "points": (
                precipitation_points
            ),
        }