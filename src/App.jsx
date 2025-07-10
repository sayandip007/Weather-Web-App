import React, { useState } from "react";

const WeatherDashboard = () => {
  const [cityInput, setCityInput] = useState("");
  const [weatherCards, setWeatherCards] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiKey = "592be2da0dc547b47ee2a14ed5768b67";

  const fetchWeather = async (city) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      const data = await res.json();

      if (!res.ok) {
        alert(`❌ ${data.message}`);
        setLoading(false);
        return;
      }

      // Check for duplicates
      if (weatherCards.some((card) => card.name === data.name)) {
        alert("❗ This city is already added.");
        setLoading(false);
        return;
      }

      setWeatherCards((prev) => [...prev, data]);
    } catch (err) {
      console.error(err);
      alert("⚠️ Network error. Try again!");
    }
    setLoading(false);
  };

  const handleSearch = () => {
    if (cityInput.trim() !== "") {
      fetchWeather(cityInput.trim());
      setCityInput("");
    }
  };

  const getIconUrl = (code) =>
    `https://openweathermap.org/img/wn/${code}@2x.png`;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-8">🌦️ Weather Dashboard</h1>

      {/* Input */}
      <div className="max-w-xl mx-auto flex gap-3 mb-10">
        <input
          type="text"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          placeholder="Enter a city"
          className="flex-1 px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold transition"
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {/* Weather Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {weatherCards.map((data) => (
          <div
            key={data.id}
            className="bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition hover:scale-105"
          >
            <h2 className="text-xl font-bold mb-2">
              {data.name}, {data.sys.country}
            </h2>
            <div className="flex items-center gap-4">
              <img
                src={getIconUrl(data.weather[0].icon)}
                alt={data.weather[0].description}
                className="w-16 h-16"
              />
              <div>
                <p className="text-3xl font-bold">{data.main.temp}°C</p>
                <p className="capitalize">{data.weather[0].description}</p>
              </div>
            </div>
            <div className="text-sm mt-3 text-gray-300 space-y-1">
              <p>💧 Humidity: {data.main.humidity}%</p>
              <p>💨 Wind: {data.wind.speed} m/s</p>
              <p>🌡️ Feels Like: {data.main.feels_like}°C</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherDashboard;
