package models

type OpenWeatherResponse struct {
	Name string `json:"name"`
	Sys  struct {
		Country string `json:"country"`
	} `json:"sys"`
	Main struct {
		Temp      float64 `json:"temp"`
		Humidity  int     `json:"humidity"`
		Pressure  int     `json:"pressure"`
		FeelsLike float64 `json:"feels_like"`
	} `json:"main"`
	Wind struct {
		Speed float64 `json:"speed"`
	} `json:"wind"`
	Weather []struct {
		Description string `json:"description"`
		Icon        string `json:"icon"`
		Main        string `json:"main"`
	} `json:"weather"`
	Cod     int    `json:"cod"`
	Message string `json:"message"`
}

type OpenWeatherError struct {
	Cod     int    `json:"cod"`
	Message string `json:"message"`
}

type Weather struct {
	City        string  `json:"city"`
	Country     string  `json:"country"`
	Temperature float64 `json:"temperature"`
	Description string  `json:"description"`
	Humidity    int     `json:"humidity"`
	Pressure    int     `json:"pressure"`
	WindSpeed   float64 `json:"windSpeed"`
	FeelsLike   float64 `json:"feelsLike"`
	Icon        string  `json:"icon"`
	Condition   string  `json:"condition"`
}

type Response struct {
	Data   interface{} `json:"data,omitempty"`
	Status string      `json:"status"`
	Error  string      `json:"error,omitempty"`
}
