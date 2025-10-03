export interface WeatherData {
  data: {
    city: string;
    country: string;
    temperature: number;
    description: string;
    humidity: number;
    pressure: number;
    windSpeed: number;
    feelsLike: number;
    icon: string;
    condition: string;
  };
  status: string;
}

export interface WeatherError {
  message: string;
  code?: string;
}