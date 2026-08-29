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
  cargoHandlingRateTpd: number; // Tonnes per day
  cycloneWarning: boolean; // Weather risk flag
}

export const VESSEL_PROFILES: Record<string, VesselProfile> = {
  Handysize: { type: "Handysize", minCapacity: 15000, maxCapacity: 39999, avgDraftMeters: 10.0, avgLoaMeters: 175, baseRateUsdPerTon: 22 },
  Supramax: { type: "Supramax", minCapacity: 50000, maxCapacity: 59999, avgDraftMeters: 12.2, avgLoaMeters: 199, baseRateUsdPerTon: 18 },
  Panamax: { type: "Panamax", minCapacity: 65000, maxCapacity: 79999, avgDraftMeters: 14.5, avgLoaMeters: 225, baseRateUsdPerTon: 15 },
  Capesize: { type: "Capesize", minCapacity: 150000, maxCapacity: 400000, avgDraftMeters: 18.0, avgLoaMeters: 290, baseRateUsdPerTon: 12 }, // Cheaper per ton, but requires deep draft
};

export const LIGHTERING_PENALTY_USD_PER_TON = 4.5; // Cost penalty if ship must be lightered (e.g. Capesize in 14m draft)

export const INDIAN_EAST_COAST_PORTS: Record<string, PortConstraint> = {
  Haldia: { name: "Haldia", region: "West Bengal", maxDraftMeters: 8.5, maxLoaMeters: 230, cargoHandlingRateTpd: 15000, cycloneWarning: false },
  SagarSandheads: { name: "Sagar-Sandheads", region: "West Bengal", maxDraftMeters: 20.0, maxLoaMeters: 400, cargoHandlingRateTpd: 25000, cycloneWarning: false }, // Deep-water anchorage for lightering
  Paradip: { name: "Paradip", region: "Odisha", maxDraftMeters: 14.5, maxLoaMeters: 260, cargoHandlingRateTpd: 40000, cycloneWarning: true }, // SIMULATED CYCLONE WARNING
  Dhamra: { name: "Dhamra", region: "Odisha", maxDraftMeters: 18.0, maxLoaMeters: 320, cargoHandlingRateTpd: 50000, cycloneWarning: true }, // SIMULATED CYCLONE WARNING
  Vizag: { name: "Vizag", region: "Andhra Pradesh", maxDraftMeters: 14.5, maxLoaMeters: 260, cargoHandlingRateTpd: 35000, cycloneWarning: false },
  Gangavaram: { name: "Gangavaram", region: "Andhra Pradesh", maxDraftMeters: 18.5, maxLoaMeters: 300, cargoHandlingRateTpd: 50000, cycloneWarning: false },
  Gopalpur: { name: "Gopalpur", region: "Odisha", maxDraftMeters: 12.5, maxLoaMeters: 225, cargoHandlingRateTpd: 20000, cycloneWarning: false },
};

// Global Origin Ports (SIH Specified)
export const ORIGIN_PORTS = {
  Australia: { name: "Australia (Newcastle)", coordinates: [151.7817, -32.9283] },
  US: { name: "United States (Norfolk)", coordinates: [-76.2859, 36.8508] },
  Mozambique: { name: "Mozambique (Maputo)", coordinates: [32.5892, -25.9692] },
  Russia: { name: "Russia (Vladivostok)", coordinates: [131.8869, 43.1198] },
  Indonesia: { name: "Indonesia (Kalimantan)", coordinates: [116.0385, -0.2787] },
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
