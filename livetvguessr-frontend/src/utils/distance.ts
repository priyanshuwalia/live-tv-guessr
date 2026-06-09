// Haversine formula to calculate distance between two points on Earth
// Source: https://en.wikipedia.org/wiki/Haversine_formula
export function haversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRadians = (degrees: number): number => degrees * Math.PI / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Radius of Earth in kilometers
  const earthRadius = 6371;

  return earthRadius * c;
}

// Hardcoded approximate center coordinates for 20 ISO country codes
export const countryCoordinates = {
  US: { lat: 37.0902, lon: -95.7129 },
  GB: { lat: 54.5260, lon: -15.5551 },
  DE: { lat: 51.1657, lon: 10.4728 },
  QA: { lat: 25.2858, lon: 51.5317 },
  FR: { lat: 46.2276, lon: 2.3522 },
  JP: { lat: 36.2048, lon: 138.2570 },
  IN: { lat: 20.5925, lon: 78.9745 },
  MX: { lat: 23.2531, lon: -102.5522 },
  BR: { lat: -14.235, lon: -51.9253 },
  AR: { lat: -38.4161, lon: -63.6164 },
  IT: { lat: 41.8919, lon: 12.5115 },
  ES: { lat: 40.4637, lon: -3.7492 },
  GR: { lat: 39.0742, lon: 21.8243 },
  KR: { lat: 35.9078, lon: 127.7669 },
  CN: { lat: 35.8617, lon: 104.1954 },
  TH: { lat: 15.8788, lon: 100.994 },
  TR: { lat: 39.9334, lon: 32.8587 },
  AE: { lat: 23.8867, lon: 55.2708 },
  AU: { lat: -25.2744, lon: 133.8126 },
  NZ: { lat: -40.9006, lon: 176.0815 },
};
