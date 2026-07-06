import { useEffect, useState } from "react";
import { Compass } from "lucide-react";

interface CityWeather {
  temp: number | null;
  code: number | null;
}

export const WeatherWidget = () => {
  const [hofWeather, setHofWeather] = useState<CityWeather>({ temp: null, code: null });
  const [hamburgWeather, setHamburgWeather] = useState<CityWeather>({ temp: null, code: null });
  const [loading, setLoading] = useState(true);

  // Map Open-Meteo weather codes to emojis and icons
  const getWeatherSymbol = (code: number | null) => {
    if (code === null) return "✨";
    if (code === 0) return "☀️"; // Clear
    if (code >= 1 && code <= 3) return "⛅"; // Cloudy
    if (code === 45 || code === 48) return "🌫️"; // Fog
    if ((code >= 51 && code <= 65) || (code >= 80 && code <= 82)) return "🌧️"; // Rain/Drizzle
    if (code >= 71 && code <= 77) return "❄️"; // Snow
    if (code >= 95) return "⛈️"; // Thunderstorm
    return "⛅";
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Fetch Hof (50.3167, 11.9167) and Hamburg (53.5511, 9.9937) in one request
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=50.3167,53.5511&longitude=11.9167,9.9937&current_weather=true"
        );
        const data = await res.json();
        
        if (data && data.length === 2) {
          setHofWeather({
            temp: Math.round(data[0].current_weather.temperature),
            code: data[0].current_weather.weathercode,
          });
          setHamburgWeather({
            temp: Math.round(data[1].current_weather.temperature),
            code: data[1].current_weather.weathercode,
          });
        } else if (data && data.current_weather) {
          // If response is singular for some reason
          setHamburgWeather({
            temp: Math.round(data.current_weather.temperature),
            code: data.current_weather.weathercode,
          });
        }
      } catch (err) {
        console.warn("Weather fetch failed, using fallback connection display.", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // Auto refresh weather every 10 minutes
    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto px-6 py-2.5 bg-slate-950/20 border-b border-gold/5 flex flex-col items-center justify-center text-center z-20">
      <div className="flex items-center gap-2 text-xs font-display tracking-widest text-sage/90">
        <span>Hof</span>
        <span className="text-gold-light font-normal">
          {loading ? "--" : `${hofWeather.temp}°C ${getWeatherSymbol(hofWeather.code)}`}
        </span>
        <span className="text-gold/30">|</span>
        <span>Hamburg</span>
        <span className="text-gold-light font-normal">
          {loading ? "--" : `${hamburgWeather.temp}°C ${getWeatherSymbol(hamburgWeather.code)}`}
        </span>
      </div>
      
      <p className="font-sans text-[9px] tracking-wider text-sage/55 mt-1 uppercase flex items-center gap-1">
        <Compass size={8} className="text-gold/45 animate-spin-slow" />
        Distanz: 525 km — aber nur einen Fingertipp entfernt.
      </p>
    </div>
  );
};
