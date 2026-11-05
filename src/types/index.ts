export interface SensorReadings {
  soilMoisture: number;    // % (0 - 100)
  temperature: number;     // °C
  humidity: number;        // % RH (0 - 100)
  soilPH: number;          // pH (0 - 14)
  soilEC: number;          // mS/cm
  nitrogen: number;        // mg/kg
  phosphorus: number;      // mg/kg
  potassium: number;       // mg/kg
  lastUpdated: number;     // Unix epoch ms
}

export interface WateringEvent {
  id: string;
  timestamp: number;
  durationSec: number;
  triggerType: 'MANUAL' | 'AUTO';
  waterVolumeLiters: number;
  initialMoisture: number;
  finalMoisture: number;
}

export interface DeviceControls {
  pumpRequested: boolean;
  pumpActual: boolean;
  irrigationMode: 'MANUAL' | 'AUTO';
  moistureThreshold: number;
  maxPumpRuntimeSec: number;
  wateringDurationSec: number;
  emergencyStop: boolean;
  rainDelayActive: boolean;
  lastCommandTimestamp: number;
  lastWateringTimestamp: number;
  wateringHistory: WateringEvent[];
}

export interface DeviceStatus {
  online: boolean;
  ip: string;
  rssi: number;
  firmwareVersion: string;
  lastSeen: number;
  hardwareModel: string;
  freeHeapBytes: number;
  sensorErrors: string[];
}

export interface PlantProfile {
  id: string;
  name: string;
  species: string;
  imageUrl: string;
  plantedDate: string;
  growthStage: 'Germination' | 'Vegetative' | 'Flowering' | 'Fruiting' | 'Harvest';
  assignedDeviceId: string;
  notes?: string;
  thresholds: {
    minMoisture: number;
    maxMoisture: number;
    minTemp: number;
    maxTemp: number;
    minPh: number;
    maxPh: number;
    targetEc: number;
    minN?: number;
    minP?: number;
    minK?: number;
  };
}

export interface HistoricalTelemetryPoint {
  timestamp: number;
  timeLabel: string;
  soilMoisture: number;
  temperature: number;
  humidity: number;
  soilPH: number;
  soilEC: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  pumpActive: boolean;
}

export interface AgroAlert {
  id: string;
  type:
    | 'LOW_MOISTURE'
    | 'HIGH_MOISTURE'
    | 'HIGH_TEMP'
    | 'LOW_TEMP'
    | 'UNUSUAL_HUMIDITY'
    | 'PH_OUT_OF_RANGE'
    | 'EC_OUT_OF_RANGE'
    | 'DEVICE_OFFLINE'
    | 'SENSOR_ERROR'
    | 'PUMP_STARTED'
    | 'PUMP_STOPPED'
    | 'RAIN_DELAY_ENABLED'
    | 'LOW_WATER_RESERVOIR';
  severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

export interface WeatherForecastItem {
  timeLabel: string;
  temperature: number;
  humidity: number;
  rainProbability: number; // 0 - 100%
  condition: 'Clear' | 'Partly Cloudy' | 'Overcast' | 'Light Rain' | 'Heavy Rain';
  uvIndex: number;
}

export interface VpdData {
  vpdKPa: number;
  status: 'UNDER_TRANSPIRING' | 'SWEET_SPOT' | 'HIGH_TRANSPIRATION_STRESS';
  airSaturationPressure: number; // kPa
  actualVaporPressure: number;   // kPa
  transpirationRateEstimate: string; // e.g. "Optimal (1.1 kPa)"
}

export interface TankTelemetry {
  currentLiters: number;
  maxLiters: number;
  percentage: number;
  flowRateLpm: number;
  isLowWaterAlarm: boolean;
}

export interface HardwarePinInfo {
  pinNumber: number;
  label: string;
  gpioName: string;
  type: 'ADC1' | 'GPIO_OUT' | 'I2C' | 'UART' | 'POWER_3V3' | 'POWER_5V' | 'GND';
  connectedDevice: string;
  currentVoltage: string;
  purpose: string;
  safetyNote: string;
}

export interface UserProfile {
  displayName: string;
  email: string;
  tempUnit: 'C' | 'F';
  notificationsEnabled: boolean;
  soundAlerts: boolean;
  autoRefreshIntervalSec: number;
  newbieMode: boolean;
  language: string;
  customFirebaseUrl?: string;
  customFirebaseSecret?: string;
}
