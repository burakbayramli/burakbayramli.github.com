// ============================================================================
// =================== New Open-Meteo Forecast & AQI Logic ====================
// ============================================================================

// WMO Weather Code Lookup Table
const WMO_CODES = {
    0: "Clear sky", 1: "Mostly clear", 2: "Partly cloudy", 3: "Overcast", 45: "Fog",
    48: "Depositing rime fog", 51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
    56: "Light freezing drizzle", 57: "Dense freezing drizzle", 61: "Slight rain",
    63: "Moderate rain", 65: "Heavy rain", 66: "Light freezing rain", 67: "Heavy freezing rain",
    71: "Slight snow fall", 73: "Moderate snow fall", 75: "Heavy snow fall", 77: "Snow grains",
    80: "Slight rain showers", 81: "Moderate rain showers", 82: "Violent rain showers",
    85: "Slight snow showers", 86: "Heavy snow showers", 95: "Thunderstorm (Slight/Moderate)",
    96: "Thunderstorm with slight hail", 99: "Thunderstorm with heavy hail"
};

// --- AQI CATEGORIZATION FUNCTIONS (Simplified US EPA Standard) ---

/**
 * Returns an object containing the category HTML (for display) and a numeric severity rank (1=Good, 6=Hazardous).
 * Used for PM2.5 and for generating the Overall Category text.
 */
function get_aqi_category_and_rank(value) {
    if (value <= 12.0) {
        return { category: `<span style="color:green;">Good (0-50)</span>`, rank: 1, name: "Good" };
    } else if (value <= 35.4) {
        return { category: `<span style="color:yellow;">Moderate (51-100)</span>`, rank: 2, name: "Moderate" };
    } else if (value <= 55.4) {
        return { category: `<span style="color:orange;">Unhealthy for Sensitive Groups (101-150)</span>`, rank: 3, name: "Unhealthy for Sensitive Groups" };
    } else if (value <= 150.4) {
        return { category: `<span style="color:red;">Unhealthy (151-200)</span>`, rank: 4, name: "Unhealthy" };
    } else if (value <= 250.4) {
        return { category: `<span style="color:purple;">Very Unhealthy (201-300)</span>`, rank: 5, name: "Very Unhealthy" };
    } else {
        return { category: `<span style="color:maroon;">Hazardous (>300)</span>`, rank: 6, name: "Hazardous" };
    }
}

/**
 * Returns the numeric severity rank (1=Good, 6=Hazardous) for PM10 (using US EPA 24hr breakpoints in µg/m³).
 */
function get_pm10_aqi_rank(value) {
    if (value <= 54) return 1; // Good
    if (value <= 154) return 2; // Moderate
    if (value <= 254) return 3; // Unhealthy for Sensitive Groups
    if (value <= 354) return 4; // Unhealthy
    if (value <= 424) return 5; // Very Unhealthy
    return 6; // Hazardous
}

/**
 * Returns the numeric severity rank for Ozone (O3), using US EPA 1-hour breakpoints (in µg/m³ for high concentrations).
 */
function get_o3_aqi_rank(value) {
    if (value <= 120) return 1; // Good
    if (value <= 168) return 2; // Moderate
    if (value <= 228) return 3; // Unhealthy for Sensitive Groups
    if (value <= 404) return 4; // Unhealthy
    if (value <= 504) return 5; // Very Unhealthy
    return 6; // Hazardous
}

/**
 * Returns the numeric severity rank for Nitrogen Dioxide (NO2), using US EPA 1-hour breakpoints (in µg/m³).
 */
function get_no2_aqi_rank(value) {
    if (value <= 100) return 1; // Good
    if (value <= 200) return 2; // Moderate
    if (value <= 399) return 3; // Unhealthy for Sensitive Groups
    if (value <= 799) return 4; // Unhealthy
    if (value <= 1000) return 5; // Very Unhealthy
    return 6; // Hazardous
}

/**
 * Returns the numeric severity rank for Carbon Monoxide (CO), using simplified breakpoints (in mg/m³ as provided by Open-Meteo).
 * Note: A true AQI uses a complex 8-hour average and conversion from ppm, this is a simplified hourly rank.
 */
function get_co_aqi_rank(value) {
    if (value <= 5) return 1; // Good (~4.4 ppm)
    if (value <= 10) return 2; // Moderate (~9.4 ppm)
    if (value <= 17) return 3; // Unhealthy for Sensitive Groups
    if (value <= 34) return 4; // Unhealthy
    if (value <= 40) return 5; // Very Unhealthy
    return 6; // Hazardous
}

/**
 * Returns the numeric severity rank for Sulfur Dioxide (SO2), using US EPA 1-hour breakpoints (in µg/m³).
 */
function get_so2_aqi_rank(value) {
    if (value <= 92) return 1; // Good
    if (value <= 184) return 2; // Moderate
    if (value <= 300) return 3; // Unhealthy for Sensitive Groups
    if (value <= 600) return 4; // Unhealthy
    if (value <= 800) return 5; // Very Unhealthy
    return 6; // Hazardous
}

// --- STANDARD HELPER FUNCTIONS ---

function get_weather_description(code) {
    // Convert float to integer for lookup
    return WMO_CODES[Math.round(code)] || "Unknown/N/A";
}


// Shared global location variables
var lat;
var lon;

function getLocation() {
    if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(showPosition);
    }
}

function hardCodePosition(latarg,lonarg) {
    lat = latarg;
    lon = lonarg;
    document.getElementById("weatherposition").innerHTML = lat + " " + lon;    
}

function showPosition(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    document.getElementById("weatherposition").innerHTML = lat + " " + lon;    
}

function getLocationFromPicker() {
    coords = sessionStorage.getItem('picker_coord').split(" ");
    lat = parseFloat(coords[0]);
    lon = parseFloat(coords[1]);
    document.getElementById("weatherposition").innerHTML = lat + " " + lon;    
}


// NEW: Main function to fetch and display the Open-Meteo 3-hour forecast & AQI
function fetchOpenMeteoForecast() {
    if(typeof lat === 'undefined' || typeof lon === 'undefined') {
	document.getElementById("weatherposition").innerHTML = "<font color='red'>Position not set</font>";
    document.getElementById('tdout').innerHTML = ''; // Clear output
	return;
    }

    const FORECAST_DAYS = 5;
    const STEP_HOURS = 3;
    const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";
    const AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";


    // 1. Define API Endpoints
    // ADDED: relative_humidity_2m to the weather API call
    const WEATHER_ENDPOINT = `${WEATHER_URL}?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,wind_speed_10m,weathercode&forecast_days=${FORECAST_DAYS}&timezone=auto&temperature_unit=celsius&wind_speed_unit=kmh`;
    
    // UPDATED: Requesting ALL six criteria pollutants for comprehensive AQI calculation
    const AQI_ENDPOINT = `${AIR_QUALITY_URL}?latitude=${lat}&longitude=${lon}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=auto`;
    
    document.getElementById('tdout').innerHTML = "Fetching weather and air quality data...";
    document.getElementById('fcout').innerHTML = "";

    // 2. Fetch both in parallel using Promise.all
    Promise.all([
        fetch(WEATHER_ENDPOINT).then(res => {
            if (!res.ok) throw new Error(`Weather HTTP error! status: ${res.status}`);
            return res.json();
        }),
        fetch(AQI_ENDPOINT).then(res => {
            if (!res.ok) throw new Error(`AQI HTTP error! status: ${res.status}`);
            return res.json();
        })
    ])
	.then(([weatherData, aqiData]) => {
        const hourly = weatherData.hourly;
        const remote_timezone_str = weatherData.timezone;
        const temp_unit = weatherData.hourly_units.temperature_2m;
        const wind_unit = weatherData.hourly_units.wind_speed_10m;
        const humidity_unit = weatherData.hourly_units.relative_humidity_2m;
        
        // --- Automated Time Index Calculation (Shared for Weather & AQI) ---
        
        const now_ms = new Date().getTime();
        const start_of_day_utc_str = hourly.time[0] + ':00.000Z';
        const start_of_day_utc = new Date(start_of_day_utc_str);
        const timezone_offset_ms = weatherData.timezone_abbreviation ? weatherData.timezone_abbreviation.slice(3) * 60 * 1000 : 0; 
        const MS_PER_HOUR = 3600000;
        const time_elapsed_ms = now_ms - start_of_day_utc.getTime() + timezone_offset_ms;
        const START_INDEX = Math.floor(time_elapsed_ms / MS_PER_HOUR);

        // --- Process Current Status (tdout) ---
        let today_out = `<p>Current Status</p>`;
        
        if (START_INDEX >= 0 && START_INDEX < hourly.time.length) {
            const current_time_iso = hourly.time[START_INDEX];
            const current_dt = new Date(current_time_iso); 
            const current_temp = hourly.temperature_2m[START_INDEX];
            const current_humidity = hourly.relative_humidity_2m[START_INDEX];
            const current_wind = hourly.wind_speed_10m[START_INDEX];
            const current_precip_prob = hourly.precipitation_probability[START_INDEX];
            const current_desc = get_weather_description(hourly.weathercode[START_INDEX]);
            
            const time_options = { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit', 
                timeZoneName: 'short',
                timeZone: remote_timezone_str
            };
            const current_time_str = current_dt.toLocaleString('en-US', time_options);

            today_out += `<p>Time: ${current_time_str}</p>`;
            today_out += `<p>Condition: ${current_desc}</p>`;
            today_out += `<p>Temperature: ${current_temp} ${temp_unit}</p>`;
            // ADDED: Display Humidity
            today_out += `<p>Humidity: ${current_humidity} ${humidity_unit}</p>`;
            today_out += `<p>Wind Speed: ${current_wind} ${wind_unit}</p>`;
            today_out += `<p>Precip. Prob: ${current_precip_prob}%</p>`;

            // --- Add Comprehensive AQI Data ---
            const aqi_hourly = aqiData.hourly;
            if (START_INDEX < aqi_hourly.pm2_5.length) {
		// 1. Get Pollutant Concentrations
		const pm25 = aqi_hourly.pm2_5[START_INDEX].toFixed(2);
		const pm10 = aqi_hourly.pm10[START_INDEX].toFixed(2);
		
		// --- MODIFICATION HERE: Convert CO from µg/m³ to mg/m³ ---
		// Assuming Open-Meteo returns CO in µg/m³ despite the unit label
		const raw_co_ug = aqi_hourly.carbon_monoxide[START_INDEX];
		const co = (raw_co_ug / 1000).toFixed(3); // Convert to mg/m³ for get_co_aqi_rank function

		const no2 = aqi_hourly.nitrogen_dioxide[START_INDEX].toFixed(2);
		const so2 = aqi_hourly.sulphur_dioxide[START_INDEX].toFixed(2);
		const o3 = aqi_hourly.ozone[START_INDEX].toFixed(2);
		
		// 2. Get Units
		const pm_unit = aqiData.hourly_units.pm2_5; // µg/m³
		const co_unit = aqiData.hourly_units.carbon_monoxide; // mg/m³ (Note: The value is now converted)
		const gas_unit = aqiData.hourly_units.ozone; // µg/m³
		
		// 3. Determine Ranks for all 6 pollutants
		const pm25_rank = get_aqi_category_and_rank(parseFloat(pm25)).rank;
		const pm10_rank = get_pm10_aqi_rank(parseFloat(pm10));
		// co is now in mg/m³ as expected by the function
		const co_rank = get_co_aqi_rank(parseFloat(co)); 
		const no2_rank = get_no2_aqi_rank(parseFloat(no2));
		const so2_rank = get_so2_aqi_rank(parseFloat(so2));
		const o3_rank = get_o3_aqi_rank(parseFloat(o3));                
                // 4. Determine Overall AQI (The MAX/Worst Rank)
                const overall_rank = Math.max(pm25_rank, pm10_rank, co_rank, no2_rank, so2_rank, o3_rank);
                
                // 5. Get the corresponding category text for the worst rank
                let worst_rank_value = 1.0; // Placeholder for rank 1
                if (overall_rank === 2) worst_rank_value = 15.0; // Moderate PM2.5 range
                else if (overall_rank === 3) worst_rank_value = 40.0; // USG PM2.5 range
                else if (overall_rank === 4) worst_rank_value = 60.0; // Unhealthy PM2.5 range
                else if (overall_rank === 5) worst_rank_value = 160.0; // Very Unhealthy PM2.5 range
                else if (overall_rank === 6) worst_rank_value = 300.0; // Hazardous PM2.5 range
                
                const overall_score_category = get_aqi_category_and_rank(worst_rank_value).category;
                const dominant_pollutant_name = get_aqi_category_and_rank(worst_rank_value).name;


                today_out += `<p>Air Quality Index (AQI)</p>`;
                // UPDATED: Overall AQI Score based on the worst pollutant rank
                today_out += `<p>Overall AQI Score: ${overall_score_category} (Worst Pollutant: ${dominant_pollutant_name})</p>`;
                today_out += `<p>Pollutant Concentrations:</p>`;
                today_out += `<ul>`;
                today_out += `<li>PM2.5: ${pm25} ${pm_unit} (${pm25_rank})</li>`;
                today_out += `<li>PM10: ${pm10} ${pm_unit} (${pm10_rank})</li>`;
                today_out += `<li>Ozone (O3): ${o3} ${gas_unit} (${o3_rank})</li>`;
                today_out += `<li>Nitrogen Dioxide (NO2): ${no2} ${gas_unit} (${no2_rank})</li>`;
                today_out += `<li>Carbon Monoxide (CO): ${co} ${co_unit} (${co_rank})</li>`;
                today_out += `<li>Sulfur Dioxide (SO2): ${so2} ${gas_unit} (${so2_rank})</li>`;
                today_out += `</ul>`;
                
            } else {
                 today_out += `<p>Air quality data unavailable for current hour.</p>`;
            }

        } else {
            today_out += `<p>Could not retrieve current status data.</p>`;
        }
        document.getElementById('tdout').innerHTML = today_out;

        // --- Print the Forecast Table (fcout) ---
        let forecast_out = `<p>3-Hourly Weather Forecast</p>`;
        forecast_out += "<table>";
        // ADDED: Humidity column to the table header
        forecast_out += `<tr><th>Time (${remote_timezone_str})</th><th>Temp (${temp_unit})</th><th>Humidity (${humidity_unit})</th><th>Precip. Prob</th><th>Wind (${wind_unit})</th><th>Condition</th></tr>`;

        // Loop for the next 6 intervals (0, 3, 6, 9, 12, 15 hours), covering 18 hours.
        const max_intervals = 20;
        for (let i = 0; i < max_intervals; i++) {
            const index = START_INDEX + (i * STEP_HOURS);
            
            if (index < hourly.time.length) {
                const time_iso = hourly.time[index];
                const dt_obj = new Date(time_iso);
                
                const time_options = { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    timeZone: remote_timezone_str 
                };
                const display_time = dt_obj.toLocaleString('en-US', time_options);
                
                const temp = hourly.temperature_2m[index].toFixed(1);
                // ADDED: humidity data for the forecast row
                const humidity = hourly.relative_humidity_2m[index];
                const precip_prob = hourly.precipitation_probability[index];
                const wind_speed = hourly.wind_speed_10m[index].toFixed(1);
                const weather_desc = get_weather_description(hourly.weathercode[index]);
                
                // ADDED: Humidity cell to the table row
                forecast_out += `<tr><td>${display_time}</td><td>${temp}</td><td>${humidity}%</td><td>${precip_prob}%</td><td>${wind_speed}</td><td>${weather_desc}</td></tr>`;
            } else {
                break; // Stop if we run out of data
            }
        }
        forecast_out += "</table>";
        document.getElementById('fcout').innerHTML = forecast_out;

	})
	.catch(error => {
	    document.getElementById('tdout').innerHTML = `<p style="color:red;">Error fetching data. Ensure your position is set and try again. Details: ${error.message}</p>`;
        document.getElementById('fcout').innerHTML = '';
	    console.error("Fetch Error:", error);
	});
}


function init() {
    // Left empty as there is no API key to initialize
}

function getWeatherData() {
    // Single entry point now fetches both weather and AQI
    fetchOpenMeteoForecast();    
}
