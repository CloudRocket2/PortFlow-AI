export interface VesselProfile {
  type: string;
  minCapacity: number;
  maxCapacity: number;
  avgDraftMeters: number;
  avgLoaMeters: number;
  baseRateUsdPerTon: number; // For financial ROI calculations
}

export interface PortConstraint {
  name: string;
  region: string;
  maxDraftMeters: number;
  maxLoaMeters: number;
  maxBeamMeters: number;
  cargoHandlingRateTpd: number; // Tonnes per day
  cycloneWarning: boolean; // Weather risk flag
  coordinates?: [number, number]; // [lng, lat]
}

export const VESSEL_PROFILES: Record<string, VesselProfile> = {
  Handysize: { type: "Handysize", minCapacity: 15000, maxCapacity: 39999, avgDraftMeters: 10.0, avgLoaMeters: 175, baseRateUsdPerTon: 22 },
  Supramax: { type: "Supramax", minCapacity: 50000, maxCapacity: 59999, avgDraftMeters: 12.2, avgLoaMeters: 199, baseRateUsdPerTon: 18 },
  Panamax: { type: "Panamax", minCapacity: 65000, maxCapacity: 79999, avgDraftMeters: 14.5, avgLoaMeters: 225, baseRateUsdPerTon: 15 },
  Capesize: { type: "Capesize", minCapacity: 150000, maxCapacity: 400000, avgDraftMeters: 18.0, avgLoaMeters: 290, baseRateUsdPerTon: 12 }, // Cheaper per ton, but requires deep draft
};

export const LIGHTERING_PENALTY_USD_PER_TON = 4.5; // Cost penalty if ship must be lightered (e.g. Capesize in 14m draft)

export const INDIAN_EAST_COAST_PORTS: Record<string, PortConstraint> = {
  Haldia: { name: "Haldia", region: "West Bengal", maxDraftMeters: 8.5, maxLoaMeters: 230, maxBeamMeters: 32.2, cargoHandlingRateTpd: 15000, cycloneWarning: false },
  SagarSandheads: { name: "Sagar-Sandheads", region: "West Bengal", maxDraftMeters: 20.0, maxLoaMeters: 400, maxBeamMeters: 60.0, cargoHandlingRateTpd: 25000, cycloneWarning: false }, // Deep-water anchorage for lightering
  Paradip: { name: "Paradip", region: "Odisha", maxDraftMeters: 14.5, maxLoaMeters: 260, maxBeamMeters: 43.0, cargoHandlingRateTpd: 40000, cycloneWarning: true }, // SIMULATED CYCLONE WARNING
  Dhamra: { name: "Dhamra", region: "Odisha", maxDraftMeters: 18.0, maxLoaMeters: 320, maxBeamMeters: 50.0, cargoHandlingRateTpd: 50000, cycloneWarning: true }, // SIMULATED CYCLONE WARNING
  Vizag: { name: "Vizag", region: "Andhra Pradesh", maxDraftMeters: 14.5, maxLoaMeters: 260, maxBeamMeters: 43.0, cargoHandlingRateTpd: 35000, cycloneWarning: false },
  Gangavaram: { name: "Gangavaram", region: "Andhra Pradesh", maxDraftMeters: 18.5, maxLoaMeters: 300, maxBeamMeters: 50.0, cargoHandlingRateTpd: 50000, cycloneWarning: false },
  Gopalpur: { name: "Gopalpur", region: "Odisha", maxDraftMeters: 12.5, maxLoaMeters: 225, maxBeamMeters: 32.2, cargoHandlingRateTpd: 20000, cycloneWarning: false },
};

// Global Origin Ports (SIH Specified)
export const ORIGIN_PORTS: Record<string, PortConstraint> = {
  Australia: { name: "Australia (Newcastle)", region: "Oceania", coordinates: [151.7817, -32.9283], maxDraftMeters: 15.2, maxLoaMeters: 300, maxBeamMeters: 50.0, cargoHandlingRateTpd: 80000, cycloneWarning: false },
  US: { name: "United States (Norfolk)", region: "North America", coordinates: [-76.2859, 36.8508], maxDraftMeters: 15.0, maxLoaMeters: 300, maxBeamMeters: 50.0, cargoHandlingRateTpd: 75000, cycloneWarning: false },
  Mozambique: { name: "Mozambique (Maputo)", region: "Africa", coordinates: [32.5892, -25.9692], maxDraftMeters: 14.3, maxLoaMeters: 280, maxBeamMeters: 45.0, cargoHandlingRateTpd: 40000, cycloneWarning: false },
  Russia: { name: "Russia (Vladivostok)", region: "Asia", coordinates: [131.8869, 43.1198], maxDraftMeters: 13.0, maxLoaMeters: 260, maxBeamMeters: 40.0, cargoHandlingRateTpd: 45000, cycloneWarning: false },
  Indonesia: { name: "Indonesia (Kalimantan)", region: "Asia", coordinates: [116.0385, -0.2787], maxDraftMeters: 14.0, maxLoaMeters: 270, maxBeamMeters: 45.0, cargoHandlingRateTpd: 55000, cycloneWarning: false },
};

// Mock Time-Series Data for Freight Forecast (USD per Tonne)
export const MOCK_FREIGHT_FORECAST = [
  { date: "Oct 01", actual: 14.2, predicted: null },
  { date: "Oct 08", actual: 14.8, predicted: null },
  { date: "Oct 15", actual: 15.5, predicted: null },
  { date: "Oct 22", actual: 16.1, predicted: null },
  { date: "Oct 29", actual: 15.8, predicted: null },
  { date: "Nov 05", actual: 15.9, predicted: 15.9 }, // Present Day
  { date: "Nov 12", actual: null, predicted: 16.5 },
  { date: "Nov 19", actual: null, predicted: 17.2 },
  { date: "Nov 26", actual: null, predicted: 16.8 },
  { date: "Dec 03", actual: null, predicted: 15.5 },
  { date: "Dec 10", actual: null, predicted: 14.9 },
];

export const MULTI_YEAR_SEASONALITY_DATA = [
  { month: "Jan", "2024": 12.5, "2025": 13.1, "2026_Predicted": 13.8 },
  { month: "Feb", "2024": 11.2, "2025": 11.9, "2026_Predicted": 12.5 },
  { month: "Mar", "2024": 14.5, "2025": 15.2, "2026_Predicted": 16.0 },
  { month: "Apr", "2024": 15.8, "2025": 16.5, "2026_Predicted": 17.1 },
  { month: "May", "2024": 16.2, "2025": 16.9, "2026_Predicted": 17.5 },
  { month: "Jun", "2024": 17.5, "2025": 18.1, "2026_Predicted": 18.9 }, // Pre-monsoon rush
  { month: "Jul", "2024": 19.8, "2025": 20.5, "2026_Predicted": 21.2 }, // Peak monsoon delays
  { month: "Aug", "2024": 18.5, "2025": 19.2, "2026_Predicted": 20.0 }, // Monsoon
  { month: "Sep", "2024": 15.2, "2025": 15.9, "2026_Predicted": 16.5 },
  { month: "Oct", "2024": 14.1, "2025": 14.8, "2026_Predicted": 15.2 },
  { month: "Nov", "2024": 13.5, "2025": 14.1, "2026_Predicted": 14.8 },
  { month: "Dec", "2024": 12.8, "2025": 13.5, "2026_Predicted": 14.1 },
];

// Mock Time-Series Data for Macro Volatility Index (0-100 scale)
export const MOCK_VOLATILITY_INDEX = [
  { date: "Aug 01", score: 42 },
  { date: "Aug 15", score: 45 },
  { date: "Sep 01", score: 48 },
  { date: "Sep 15", score: 55 },
  { date: "Oct 01", score: 62 },
  { date: "Oct 15", score: 75 },
  { date: "Nov 01", score: 85 },
  { date: "Nov 05", score: 92 }, // Peak spike near today
  { date: "Nov 15", score: 88 },
  { date: "Dec 01", score: 70 },
  { date: "Dec 15", score: 60 },
];
