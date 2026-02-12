export interface CityData {
    name: string;
    country: string;
    timezone: string;
    coordinates: [number, number]; // [longitude, latitude]
}

export const POPULAR_CITIES: CityData[] = [
    { name: "New York", country: "USA", timezone: "America/New_York", coordinates: [-74.006, 40.7128] },
    { name: "London", country: "UK", timezone: "Europe/London", coordinates: [-0.1276, 51.5074] },
    { name: "Tokyo", country: "Japan", timezone: "Asia/Tokyo", coordinates: [139.6917, 35.6895] },
    { name: "Sydney", country: "Australia", timezone: "Australia/Sydney", coordinates: [151.2093, -33.8688] },
    { name: "Dubai", country: "UAE", timezone: "Asia/Dubai", coordinates: [55.2708, 25.2048] },
    { name: "Paris", country: "France", timezone: "Europe/Paris", coordinates: [2.3522, 48.8566] },
    { name: "San Francisco", country: "USA", timezone: "America/Los_Angeles", coordinates: [-122.4194, 37.7749] },
    { name: "Singapore", country: "Singapore", timezone: "Asia/Singapore", coordinates: [103.8198, 1.3521] },
    { name: "Hong Kong", country: "China", timezone: "Asia/Hong_Kong", coordinates: [114.1694, 22.3193] },
    { name: "Los Angeles", country: "USA", timezone: "America/Los_Angeles", coordinates: [-118.2437, 34.0522] },
    { name: "Berlin", country: "Germany", timezone: "Europe/Berlin", coordinates: [13.4050, 52.5200] },
    { name: "Mumbai", country: "India", timezone: "Asia/Kolkata", coordinates: [72.8777, 19.0760] },
    { name: "Shanghai", country: "China", timezone: "Asia/Shanghai", coordinates: [121.4737, 31.2304] },
    { name: "Moscow", country: "Russia", timezone: "Europe/Moscow", coordinates: [37.6173, 55.7558] },
    { name: "Cairo", country: "Egypt", timezone: "Africa/Cairo", coordinates: [31.2357, 30.0444] },
    { name: "Rio de Janeiro", country: "Brazil", timezone: "America/Sao_Paulo", coordinates: [-43.1729, -22.9068] },
    { name: "Toronto", country: "Canada", timezone: "America/Toronto", coordinates: [-79.3832, 43.6532] },
    { name: "Bangkok", country: "Thailand", timezone: "Asia/Bangkok", coordinates: [100.5018, 13.7563] },
    { name: "Seoul", country: "South Korea", timezone: "Asia/Seoul", coordinates: [126.9780, 37.5665] },
    { name: "Istanbul", country: "Turkey", timezone: "Europe/Istanbul", coordinates: [28.9784, 41.0082] },
];
