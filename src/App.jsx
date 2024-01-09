import { useEffect, useState } from "react";
import Icon from "react-icons-kit";
import { search } from "react-icons-kit/icomoon/search";
import { arrowUp } from "react-icons-kit/feather/arrowUp";
import { arrowDown } from "react-icons-kit/feather/arrowDown";
import { droplet } from "react-icons-kit/feather/droplet";
import { wind } from "react-icons-kit/feather/wind";
import { activity } from "react-icons-kit/feather/activity";
import { useDispatch, useSelector } from "react-redux";
import { get5DaysForecast, getCityData } from "./store/Slices/WeatherSlice";
import { SphereSpinner } from "react-spinners-kit";

function App() {
  const {
    citySearchLoading,
    citySearchData,
    forecastLoading,
    forecastData,
    forecastError,
  } = useSelector((state) => state.weather);

  const [loading, setLoading] = useState(true);
  const allLoadings = [citySearchLoading, forecastLoading];

  useEffect(() => {
    const isAnyChildLoading = allLoadings.some((state) => state);
    setLoading(isAnyChildLoading);
  }, [allLoadings]);

  const [city, setCity] = useState("Baku");
  const [unit, setUnit] = useState("metric");

  const toggleUnit = () => {
    setLoading(true);
    setUnit(unit === "metric" ? "imperial" : "metric");
  };

  const dispatch = useDispatch();

  const fetchData = () => {
    dispatch(
      getCityData({
        city,
        unit,
      })
    ).then((res) => {
      if (!res.payload.error) {
        dispatch(
          get5DaysForecast({
            lat: res.payload.data.coord.lat,
            lon: res.payload.data.coord.lon,
            unit,
          })
        )
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, [unit]);

  const handleCitySearch = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchData();
  };

  const filterForecastByFirstObjTime = (forecastData) => {
    if(!forecastData) {
      return []
    }
    const firstObjTime = forecastData[0].dt_txt.split(" ")[1];
    return forecastData.filter((data) => data.dt_txt.endsWith(firstObjTime));
  }

  const filteredForecast = filterForecastByFirstObjTime(forecastData?.list);

  return (
    <>
      <div className="background">
        <div className="box">
          <form autoComplete="off" onSubmit={handleCitySearch}>
            <label>
              <Icon icon={search} size={20} />
            </label>
            <input
              type="text"
              className="city-input"
              placeholder="Enter City"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button type="submit">Go</button>
          </form>
          <div className="current-weather-details-box">
            <div className="details-box-header">
              <h4>Current Weather</h4>
              <div className="switch" onClick={toggleUnit}>
                <div
                  className={`switch-toggle ${unit === "metric" ? "c" : "f"}`}
                ></div>
                <span className="c">C</span>
                <span className="f">F</span>
              </div>
            </div>
            {loading ? (
              <div className="loader">
                <SphereSpinner loading={loading} color="#2fa5ed" size={20} />
              </div>
            ) : (
              <>
                {citySearchData && citySearchData.error ? (
                  <div className="error-msg">{citySearchData.error}</div>
                ) : (
                  <>
                    {forecastError ? (
                      <div className="error-msg">{forecastError}</div>
                    ) : (
                      <>
                        {citySearchData && citySearchData.data ? (
                          <>
                            <div className="weather-details-container">
                              {/* details */}
                              <div className="details">
                                <h4 className="city-name">
                                  {citySearchData.data.name}
                                </h4>
                                <div className="icon-and-temp">
                                  <img
                                    src={`https://openweathermap.org/img/wn/${citySearchData.data.weather[0].icon}@2x.png`}
                                    alt="icon"
                                  />
                                  <h1>{citySearchData.data.main.temp}&deg;</h1>
                                </div>

                                <h4 className="description">
                                  {citySearchData.data.weather[0].description}
                                </h4>
                              </div>
                              {/* metrices */}
                              <div className="metrices">
                                {/* feels like */}
                                <h4>
                                  Feels like{" "}
                                  {citySearchData.data.main.feels_like}
                                  &deg;
                                  {unit === "metric" ? "c" : "f"}
                                </h4>
                                {/* min max temp */}
                                <div className="key-value-box">
                                  <div className="key">
                                    <Icon
                                      icon={arrowUp}
                                      size={20}
                                      className="icon"
                                    />
                                    <span className="value">
                                      {citySearchData.data.main.temp_max}
                                      &deg;
                                      {unit === "metric" ? "c" : "f"}
                                    </span>
                                  </div>
                                  <div className="key">
                                    <Icon
                                      icon={arrowDown}
                                      size={20}
                                      className="icon"
                                    />
                                    <span className="value">
                                      {citySearchData.data.main.temp_min}
                                      &deg;
                                      {unit === "metric" ? "c" : "f"}
                                    </span>
                                  </div>
                                </div>

                                {/* humidity */}
                                <div className="key-value-box">
                                  <div className="key">
                                    <Icon
                                      icon={droplet}
                                      size={20}
                                      className="icon"
                                    />
                                    <span>Humidity</span>
                                  </div>
                                  <div className="value">
                                    <span>
                                      {citySearchData.data.main.humidity}%
                                    </span>
                                  </div>
                                </div>

                                {/* wind */}
                                <div className="key-value-box">
                                  <div className="key">
                                    <Icon
                                      icon={wind}
                                      size={20}
                                      className="icon"
                                    />
                                    <span>Wind</span>
                                  </div>
                                  <div className="value">
                                    <span>
                                      {citySearchData.data.wind.speed}kph
                                    </span>
                                  </div>
                                </div>

                                {/* pressure */}
                                <div className="key-value-box">
                                  <div className="key">
                                    <Icon
                                      icon={activity}
                                      size={20}
                                      className="icon"
                                    />
                                    <span>Pressure</span>
                                  </div>
                                  <div className="value">
                                    <span>
                                      {citySearchData.data.main.pressure}
                                      hPa
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="error-msg">No data found</div>
                        )}
                         <h4 className="extended-forecast-heading">
                        Extended Forecast
                      </h4>
                      {filteredForecast.length > 0 ? (
                        <div className="extended-forecasts-container">
                          {filteredForecast.map((data, index) => {
                            const date = new Date(data.dt_txt);
                            const day = date.toLocaleDateString("en-US", {
                              weekday: "short",
                            });
                            return (
                              <div className="forecast-box" key={index}>
                                <h5>{day}</h5>
                                <img
                                  src={`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`}
                                  alt="icon"
                                />
                                <h5>{data.weather[0].description}</h5>
                                <h5 className="min-max-temp">
                                  {data.main.temp_max}&deg; /{" "}
                                  {data.main.temp_min}&deg;
                                </h5>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="error-msg">No Data Found</div>
                      )}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
