import axios from "axios";

const API_KEY = "d6def4924ad5f9a9b59f3ae895b234cb";
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

export const getWeatherByCoordinates = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      `${BASE_URL}forecast?lat=${latitude}&lon=${longitude}&units=metric&lang=fr&appid=${API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data: ", error);
    throw error;
  }
};

export const getWeatherByCity = async (city) => {
  try {
    const response = await axios.get(
      `${BASE_URL}forecast?q=${city}&units=metric&lang=fr&appid=${API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data by city: ", error);
    throw error;
  }
};
