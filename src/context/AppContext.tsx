import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { auth, rtdb, hasLiveFirebaseConfig, sendIrrigationCommand, triggerEmergencyStop } from '../services/firebase';
import {
  SensorReadings,
  DeviceControls,
  DeviceStatus,
  PlantProfile,
  AgroAlert,
  HistoricalTelemetryPoint,
  UserProfile,
  WateringEvent
} from '../types';
import { translateUI, getLanguage } from '../services/languages';

// Default plant profiles featuring the newly generated photorealistic assets
const defaultPlants: PlantProfile[] = [
  {
    id: 'PLANT_001',
    name: 'San Marzano Tomato #1',
    species: 'Solanum lycopersicum',
    imageUrl: '/src/assets/images/crop_roma_tomato_1793772058323.jpg',
    plantedDate: '2025-02-20',
    growthStage: 'Fruiting',
    assignedDeviceId: 'ESP32_AGRO_01',
    notes: 'Greenhouse raised bed 3. High potassium demand during fruit swelling phase.',
    thresholds: {
      minMoisture: 45,
      maxMoisture: 75,
      minTemp: 18,
      maxTemp: 30,
      minPh: 6.0,
      maxPh: 6.8,
      targetEc: 2.1,
      minN: 45,
      minP: 30,
      minK: 160
    }
  },
  {
    id: 'PLANT_002',
    name: 'Genovese Basil Pot A',
    species: 'Ocimum basilicum',
    imageUrl: '/src/assets/images/crop_genovese_basil_1793772057574.jpg',
    plantedDate: '2025-03-05',
    growthStage: 'Vegetative',
    assignedDeviceId: 'ESP32_AGRO_01',
    notes: 'Aromatic herb container. Requires consistent moisture without waterlogging.',
    thresholds: {
      minMoisture: 50,
      maxMoisture: 80,
      minTemp: 20,
      maxTemp: 29,
      minPh: 6.2,
      maxPh: 7.0,
      targetEc: 1.6,
      minN: 50,
      minP: 25,
      minK: 120
    }
  },
  {
    id: 'PLANT_003',
    name: 'Sweet Bell Pepper Row 2',
    species: 'Capsicum annuum',
    imageUrl: '/src/assets/images/crop_bell_pepper_1793772057709.jpg',
    plantedDate: '2025-02-28',
    growthStage: 'Flowering',
    assignedDeviceId: 'ESP32_AGRO_02',
    notes: 'High susceptibility to blossom end rot if calcium/moisture drops suddenly.',
    thresholds: {
      minMoisture: 48,
      maxMoisture: 72,
      minTemp: 19,
      maxTemp: 31,
      minPh: 6.0,
      maxPh: 6.7,
      targetEc: 2.0,
      minN: 40,
      minP: 35,
      minK: 175
    }
  }
];

const initialSensors: SensorReadings = {
  soilMoisture: 43.8, // Slightly below 45% threshold to demonstrate smart alert and auto-irrigation trigger
  temperature: 24.8,
  humidity: 61.4,
  soilPH: 6.45,
  soilEC: 1.88,
  nitrogen: 48,
  phosphorus: 32,
  potassium: 190,
  lastUpdated: Date.now()
};

const initialWateringHistory: WateringEvent[] = [
  {
    id: 'WATER_001',
    timestamp: Date.now() - 1000 * 60 * 60 * 6, // 6 hours ago
    durationSec: 45,
    triggerType: 'AUTO',
    waterVolumeLiters: 1.8,
    initialMoisture: 41.2,
    finalMoisture: 68.5
  },
  {
    id: 'WATER_002',
    timestamp: Date.now() - 1000 * 60 * 60 * 28, // 28 hours ago
    durationSec: 60,
    triggerType: 'MANUAL',
    waterVolumeLiters: 2.4,
    initialMoisture: 39.0,
    finalMoisture: 72.0
  },
  {
    id: 'WATER_003',
    timestamp: Date.now() - 1000 * 60 * 60 * 54, // 54 hours ago
    durationSec: 40,
    triggerType: 'AUTO',
    waterVolumeLiters: 1.6,
    initialMoisture: 43.1,
    finalMoisture: 67.2
  }
];

const initialControls: DeviceControls = {
  pumpRequested: false,
  pumpActual: false,
  irrigationMode: 'AUTO',
  moistureThreshold: 45,
  maxPumpRuntimeSec: 60,
  wateringDurationSec: 45,
  emergencyStop: false,
  rainDelayActive: false,
  lastCommandTimestamp: Date.now() - 3600000,
  lastWateringTimestamp: Date.now() - 1000 * 60 * 60 * 6,
  wateringHistory: initialWateringHistory
};

const initialStatus: DeviceStatus = {
  online: true,
  ip: '192.168.1.145',
  rssi: -58,
  firmwareVersion: '1.2.0',
  lastSeen: Date.now(),
  hardwareModel: 'ESP32-WROOM-32D',
  freeHeapBytes: 184520,
  sensorErrors: []
};

const initialAlerts: AgroAlert[] = [
  {
    id: 'ALERT_1',
    type: 'LOW_MOISTURE',
    severity: 'WARNING',
    title: 'Moisture Below Threshold',
    message: 'Soil moisture is currently 43.8%, below the minimum target of 45%. Auto-irrigation is armed.',
    timestamp: Date.now() - 1000 * 60 * 12,
    read: false
  },
  {
    id: 'ALERT_2',
    type: 'PUMP_STOPPED',
    severity: 'INFO',
    title: 'Irrigation Cycle Complete',
    message: 'Scheduled 45s irrigation pulse delivered 1.8L. Solenoid valve confirmed closed.',
    timestamp: Date.now() - 1000 * 60 * 60 * 6,
    read: true
  }
];

interface AppContextType {
  user: User | null;
  authLoading: boolean;
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  selectedDeviceId: string;
  setSelectedDeviceId: (id: string) => void;
  availableDevices: string[];
  deviceStatus: DeviceStatus;
  setDeviceStatus: React.Dispatch<React.SetStateAction<DeviceStatus>>;
  sensors: SensorReadings;
  setSensors: React.Dispatch<React.SetStateAction<SensorReadings>>;
  controls: DeviceControls;
  plants: PlantProfile[];
  activePlantId: string;
  setActivePlantId: (id: string) => void;
  activePlant: PlantProfile;
  alerts: AgroAlert[];
  unreadAlertCount: number;
  markAlertRead: (id: string) => void;
  clearAllAlerts: () => void;
  addAlert: (alert: Omit<AgroAlert, 'id' | 'timestamp' | 'read'>) => void;
  executePumpToggle: (turnOn: boolean) => Promise<void>;
  executeEmergencyHalt: () => Promise<void>;
  resetEmergencyStop: () => Promise<void>;
  updateIrrigationConfig: (
    mode: 'MANUAL' | 'AUTO',
    threshold: number,
    runtimeSec: number,
    durationSec: number,
    rainDelay?: boolean
  ) => Promise<void>;
  addPlant: (plant: PlantProfile) => void;
  updatePlant: (plant: PlantProfile) => void;
  deletePlant: (id: string) => void;
  historicalData: HistoricalTelemetryPoint[];
  analyticsTimeframe: '24h' | '7d' | '30d';
  setAnalyticsTimeframe: (tf: '24h' | '7d' | '30d') => void;
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  setLanguage: (code: string) => void;
  t: (key: string) => string;
  simulateSensorsTick: () => void;
  toggleNewbieMode: () => void;
  speakStatusBriefing: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  // Default to Demo Mode so the app is immediately fully functional and explore-ready without requiring hardware upfront
  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('ESP32_AGRO_01');
  const availableDevices = useMemo(() => ['ESP32_AGRO_01', 'ESP32_AGRO_02'], []);

  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>(initialStatus);
  const [sensors, setSensors] = useState<SensorReadings>(initialSensors);
  const [controls, setControls] = useState<DeviceControls>(initialControls);
  const [plants, setPlants] = useState<PlantProfile[]>(defaultPlants);
  const [activePlantId, setActivePlantId] = useState<string>('PLANT_001');
  const [alerts, setAlerts] = useState<AgroAlert[]>(initialAlerts);
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<'24h' | '7d' | '30d'>('24h');

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const savedLang = typeof window !== 'undefined' ? localStorage.getItem('agrosmart_lang') : null;
    return {
      displayName: 'Lead Horticulturalist',
      email: 'grower@agrosmart.io',
      tempUnit: 'C',
      notificationsEnabled: true,
      soundAlerts: true,
      autoRefreshIntervalSec: 5,
      newbieMode: true,
      language: savedLang || 'en'
    };
  });

  const activePlant = useMemo(() => {
    return plants.find((p) => p.id === activePlantId) || plants[0] || defaultPlants[0];
  }, [plants, activePlantId]);

  const unreadAlertCount = useMemo(() => {
    return alerts.filter((a) => !a.read).length;
  }, [alerts]);

  // Auth observer
  useEffect(() => {
    if (auth) {
      const unsub = onAuthStateChanged(auth, (usr) => {
        setUser(usr);
        setAuthLoading(false);
        if (usr) {
          // If logged into real Firebase, default demoMode to false unless chosen
          setDemoMode(false);
        }
      });
      return () => unsub();
    } else {
      setAuthLoading(false);
    }
  }, []);

  // Real-time Firebase Listener when NOT in demo mode
  useEffect(() => {
    if (demoMode || !user || !rtdb) return;

    const deviceRef = ref(rtdb, `users/${user.uid}/devices/${selectedDeviceId}`);
    const unsubDevice = onValue(deviceRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        if (val.status) setDeviceStatus(val.status);
        if (val.sensors) setSensors(val.sensors);
        if (val.controls) setControls(val.controls);
        if (val.alerts) {
          const alertList = Object.keys(val.alerts).map((k) => ({
            id: k,
            ...val.alerts[k]
          }));
          setAlerts(alertList);
        }
      }
    });

    const plantsRef = ref(rtdb, `users/${user.uid}/plants`);
    const unsubPlants = onValue(plantsRef, (snapshot) => {
      if (snapshot.exists()) {
        const pObj = snapshot.val();
        const pList = Object.keys(pObj).map((k) => pObj[k]);
        setPlants(pList);
      }
    });

    return () => {
      unsubDevice();
      unsubPlants();
    };
  }, [demoMode, user, selectedDeviceId]);

  // Demo mode simulated sensor drift & auto-watering checks
  useEffect(() => {
    if (!demoMode) return;

    const interval = setInterval(() => {
      setSensors((prev) => {
        // If pump is active, moisture increases gradually
        let newMoisture = prev.soilMoisture;
        if (controls.pumpActual) {
          newMoisture = Math.min(85, prev.soilMoisture + 1.2);
        } else {
          // Slow natural evaporation
          newMoisture = Math.max(25, prev.soilMoisture - 0.05);
        }

        // Tiny realistic sensor noise
        const tempNoise = (Math.random() - 0.5) * 0.15;
        const humNoise = (Math.random() - 0.5) * 0.3;

        return {
          ...prev,
          soilMoisture: Number(newMoisture.toFixed(1)),
          temperature: Number((prev.temperature + tempNoise).toFixed(1)),
          humidity: Number(Math.min(99, Math.max(30, prev.humidity + humNoise)).toFixed(1)),
          lastUpdated: Date.now()
        };
      });

      // Update device heartbeat lastSeen
      setDeviceStatus((prev) => ({
        ...prev,
        lastSeen: Date.now()
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, [demoMode, controls.pumpActual]);

  // Demo auto-watering evaluation
  useEffect(() => {
    if (!demoMode) return;
    if (controls.emergencyStop) return;
    if (controls.irrigationMode !== 'AUTO') return;
    // Eco-safety: if rain delay is active, do not engage automatic irrigation
    if (controls.rainDelayActive) return;

    // Check if moisture dropped below threshold and pump is not already on
    if (sensors.soilMoisture < controls.moistureThreshold && !controls.pumpActual && !controls.pumpRequested) {
      // Trigger auto watering
      setControls((prev) => ({
        ...prev,
        pumpRequested: true,
        lastCommandTimestamp: Date.now()
      }));

      // Simulate ESP32 acknowledgement
      setTimeout(() => {
        setControls((prev) => ({
          ...prev,
          pumpActual: true,
          lastWateringTimestamp: Date.now()
        }));

        setAlerts((prev) => [
          {
            id: `ALERT_${Date.now()}`,
            type: 'PUMP_STARTED',
            severity: 'INFO',
            title: 'Auto Irrigation Triggered',
            message: `Soil moisture (${sensors.soilMoisture}%) fell beneath threshold (${controls.moistureThreshold}%). Valve opened.`,
            timestamp: Date.now(),
            read: false
          },
          ...prev
        ]);
      }, 1200);
    } else if (sensors.soilMoisture >= controls.moistureThreshold + 15 && controls.pumpActual) {
      // Target replenishment achieved, turn pump off
      setControls((prev) => ({
        ...prev,
        pumpRequested: false,
        pumpActual: false
      }));

      // Record watering event
      const newEvent: WateringEvent = {
        id: `WATER_${Date.now()}`,
        timestamp: Date.now(),
        durationSec: controls.wateringDurationSec,
        triggerType: 'AUTO',
        waterVolumeLiters: Number(((controls.wateringDurationSec * 2.4) / 60).toFixed(1)),
        initialMoisture: controls.moistureThreshold - 2,
        finalMoisture: Number(sensors.soilMoisture.toFixed(1))
      };

      setControls((prev) => ({
        ...prev,
        wateringHistory: [newEvent, ...prev.wateringHistory]
      }));

      setAlerts((prev) => [
        {
          id: `ALERT_${Date.now()}`,
          type: 'PUMP_STOPPED',
          severity: 'SUCCESS',
          title: 'Irrigation Completed',
          message: `Target soil moisture satisfied (${sensors.soilMoisture}%). Solenoid valve confirmed OFF.`,
          timestamp: Date.now(),
          read: false
        },
        ...prev
      ]);
    }
  }, [demoMode, sensors.soilMoisture, controls.moistureThreshold, controls.pumpActual, controls.pumpRequested, controls.emergencyStop, controls.irrigationMode, controls.wateringDurationSec]);

  // Execute pump manual command with authentic 2-phase ESP32 handshake
  const executePumpToggle = useCallback(
    async (turnOn: boolean) => {
      if (controls.emergencyStop && turnOn) {
        throw new Error('Emergency STOP is active. Reset the safety lock before engaging the pump.');
      }

      if (demoMode || !user || !hasLiveFirebaseConfig) {
        // Step 1: Write requested state (App command)
        setControls((prev) => ({
          ...prev,
          pumpRequested: turnOn,
          lastCommandTimestamp: Date.now()
        }));

        // Step 2: ESP32 hardware receives command, checks relay safety limits, switches relay, and acknowledges confirmed pumpActual state
        setTimeout(() => {
          setControls((prev) => {
            const nextWateringHistory = turnOn
              ? prev.wateringHistory
              : [
                  {
                    id: `WATER_${Date.now()}`,
                    timestamp: Date.now(),
                    durationSec: 30,
                    triggerType: 'MANUAL' as const,
                    waterVolumeLiters: 1.2,
                    initialMoisture: prev.moistureThreshold - 3,
                    finalMoisture: sensors.soilMoisture
                  },
                  ...prev.wateringHistory
                ];

            return {
              ...prev,
              pumpActual: turnOn,
              lastWateringTimestamp: turnOn ? Date.now() : prev.lastWateringTimestamp,
              wateringHistory: nextWateringHistory
            };
          });

          // Create notification
          setAlerts((prev) => [
            {
              id: `ALERT_${Date.now()}`,
              type: turnOn ? 'PUMP_STARTED' : 'PUMP_STOPPED',
              severity: turnOn ? 'INFO' : 'SUCCESS',
              title: turnOn ? 'Pump Activated (Confirmed)' : 'Pump Stopped (Confirmed)',
              message: turnOn
                ? 'ESP32 relay confirmed closed. Pressure nominal in drip manifold.'
                : 'ESP32 relay confirmed open. Water flow halted.',
              timestamp: Date.now(),
              read: false
            },
            ...prev
          ]);
        }, 1400); // Realistic 1.4-second IoT network/relay handshake latency
        return;
      }

      // Live mode
      await sendIrrigationCommand(user.uid, selectedDeviceId, {
        pumpRequested: turnOn
      });
    },
    [controls.emergencyStop, demoMode, user, selectedDeviceId, sensors.soilMoisture]
  );

  // Emergency halt
  const executeEmergencyHalt = useCallback(async () => {
    if (demoMode || !user || !hasLiveFirebaseConfig) {
      setControls((prev) => ({
        ...prev,
        pumpRequested: false,
        pumpActual: false,
        emergencyStop: true,
        lastCommandTimestamp: Date.now()
      }));

      setAlerts((prev) => [
        {
          id: `ALERT_${Date.now()}`,
          type: 'SENSOR_ERROR',
          severity: 'CRITICAL',
          title: 'EMERGENCY SHUTOFF ENGAGED',
          message: 'Hardware fail-safe lockout triggered. All actuator lines forced OFF.',
          timestamp: Date.now(),
          read: false
        },
        ...prev
      ]);
      return;
    }

    await triggerEmergencyStop(user.uid, selectedDeviceId);
  }, [demoMode, user, selectedDeviceId]);

  // Reset emergency lock
  const resetEmergencyStop = useCallback(async () => {
    if (demoMode || !user || !hasLiveFirebaseConfig) {
      setControls((prev) => ({
        ...prev,
        emergencyStop: false,
        lastCommandTimestamp: Date.now()
      }));
      return;
    }

    await sendIrrigationCommand(user.uid, selectedDeviceId, {
      emergencyStop: false
    });
  }, [demoMode, user, selectedDeviceId]);

  // Update irrigation parameters
  const updateIrrigationConfig = useCallback(
    async (
      mode: 'MANUAL' | 'AUTO',
      threshold: number,
      runtimeSec: number,
      durationSec: number,
      rainDelay?: boolean
    ) => {
      const isRainDelay = rainDelay !== undefined ? rainDelay : controls.rainDelayActive;

      if (demoMode || !user || !hasLiveFirebaseConfig) {
        setControls((prev) => ({
          ...prev,
          irrigationMode: mode,
          moistureThreshold: threshold,
          maxPumpRuntimeSec: runtimeSec,
          wateringDurationSec: durationSec,
          rainDelayActive: isRainDelay,
          lastCommandTimestamp: Date.now()
        }));
        return;
      }

      await sendIrrigationCommand(user.uid, selectedDeviceId, {
        irrigationMode: mode,
        moistureThreshold: threshold,
        maxPumpRuntimeSec: runtimeSec,
        wateringDurationSec: durationSec,
        rainDelayActive: isRainDelay
      });
    },
    [demoMode, user, selectedDeviceId, controls.rainDelayActive]
  );

  const toggleNewbieMode = useCallback(() => {
    setUserProfile((prev) => ({ ...prev, newbieMode: !prev.newbieMode }));
  }, []);

  const speakStatusBriefing = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const langDef = getLanguage(userProfile.language);

    let activeText = `AgroSmart telemetry briefing: Monitored plant is ${activePlant.name}. Soil moisture is ${sensors.soilMoisture.toFixed(0)} percent. Substrate temperature is ${sensors.temperature.toFixed(0)} degrees Celsius. Irrigation pump is currently ${controls.pumpActual ? 'running' : 'idle'}. Overall condition is vigorous.`;

    if (userProfile.language === 'hi') {
      activeText = `एग्रोस्मार्ट टेलीमेट्री ब्रीफिंग: फसल ${activePlant.name} है। मिट्टी की नमी ${sensors.soilMoisture.toFixed(0)} प्रतिशत है। तापमान ${sensors.temperature.toFixed(0)} डिग्री सेल्सियस है। सिंचाई पंप वर्तमान में ${controls.pumpActual ? 'चालू' : 'बंद'} है।`;
    } else if (userProfile.language === 'bn') {
      activeText = `অ্যাগ্রোস্মার্ট ব্রিফিং: আপনার ফসল ${activePlant.name}। মাটির আর্দ্রতা ${sensors.soilMoisture.toFixed(0)} শতাংশ। পাম্প এখন ${controls.pumpActual ? 'চালু' : 'বন্ধ'}।`;
    } else if (userProfile.language === 'te') {
      activeText = `అగ్రోస్మార్ట్ బ్రీఫింగ్: పంట ${activePlant.name}। నేల తేమ ${sensors.soilMoisture.toFixed(0)} శాతం। పంప్ ప్రస్తుతం ${controls.pumpActual ? 'నడుస్తోంది' : 'ఆగిపోయింది'}।`;
    } else if (userProfile.language === 'ta') {
      activeText = `அக்ரோஸ்மார்ட் அறிக்கை: பயிர் ${activePlant.name}। மண் ஈரப்பதம் ${sensors.soilMoisture.toFixed(0)} சதவீதம்। மோட்டார் இப்போது ${controls.pumpActual ? 'இயங்குகிறது' : 'நிறுத்தப்பட்டுள்ளது'}।`;
    } else if (userProfile.language === 'es') {
      activeText = `Informe de telemetría AgroSmart: Planta monitoreada: ${activePlant.name}. Humedad del suelo: ${sensors.soilMoisture.toFixed(0)} por ciento. La bomba de riego está ${controls.pumpActual ? 'activa' : 'en espera'}.`;
    }

    const utterance = new SpeechSynthesisUtterance(activeText);
    utterance.lang = langDef.bcp47;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find((v) =>
      v.lang.toLowerCase().replace('_', '-').startsWith(langDef.bcp47.split('-')[0].toLowerCase())
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    window.speechSynthesis.speak(utterance);
  }, [activePlant.name, sensors.soilMoisture, sensors.temperature, controls.pumpActual, userProfile.language]);

  // Plant management
  const addPlant = useCallback((newPlant: PlantProfile) => {
    setPlants((prev) => [newPlant, ...prev]);
    setActivePlantId(newPlant.id);
  }, []);

  const updatePlant = useCallback((updated: PlantProfile) => {
    setPlants((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }, []);

  const deletePlant = useCallback((id: string) => {
    setPlants((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      if (filtered.length > 0 && activePlantId === id) {
        setActivePlantId(filtered[0].id);
      }
      return filtered;
    });
  }, [activePlantId]);

  // Alert management
  const markAlertRead = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  }, []);

  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const addAlert = useCallback((alert: Omit<AgroAlert, 'id' | 'timestamp' | 'read'>) => {
    setAlerts((prev) => [
      {
        ...alert,
        id: `ALERT_${Date.now()}`,
        timestamp: Date.now(),
        read: false
      },
      ...prev
    ]);
  }, []);

  // Update user profile
  const updateUserProfile = useCallback((patch: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const updated = { ...prev, ...patch };
      if (patch.language && typeof window !== 'undefined') {
        localStorage.setItem('agrosmart_lang', patch.language);
      }
      return updated;
    });
  }, []);

  const setLanguage = useCallback((code: string) => {
    updateUserProfile({ language: code });
  }, [updateUserProfile]);

  const t = useCallback((key: string) => {
    return translateUI(key, userProfile.language);
  }, [userProfile.language]);

  // Manual trigger for sensor simulation step
  const simulateSensorsTick = useCallback(() => {
    setSensors((prev) => ({
      ...prev,
      soilMoisture: Number((Math.min(95, Math.max(20, prev.soilMoisture + (Math.random() - 0.45) * 4))).toFixed(1)),
      temperature: Number((prev.temperature + (Math.random() - 0.5) * 0.8).toFixed(1)),
      humidity: Number((Math.min(95, Math.max(35, prev.humidity + (Math.random() - 0.5) * 2))).toFixed(1)),
      soilPH: Number((Math.min(7.8, Math.max(5.5, prev.soilPH + (Math.random() - 0.5) * 0.1))).toFixed(2)),
      soilEC: Number((Math.min(3.2, Math.max(1.0, prev.soilEC + (Math.random() - 0.5) * 0.08))).toFixed(2)),
      lastUpdated: Date.now()
    }));
  }, []);

  // Historical telemetry generation for analytics
  const historicalData: HistoricalTelemetryPoint[] = useMemo(() => {
    const points: HistoricalTelemetryPoint[] = [];
    const now = Date.now();

    if (analyticsTimeframe === '24h') {
      const count = 24; // Hourly intervals
      for (let i = count; i >= 0; i--) {
        const t = new Date(now - i * 3600 * 1000);
        const hour = t.getHours();
        const timeLabel = `${hour.toString().padStart(2, '0')}:00`;

        // Diurnal curve simulation: warmer during daytime, cooler at night
        const diurnalFactor = Math.sin(((hour - 6) / 24) * Math.PI * 2);
        const temp = 22 + diurnalFactor * 5 + (Math.random() - 0.5);
        const hum = 65 - diurnalFactor * 15 + (Math.random() - 0.5);

        // Water event occurred at 16:00
        let moisture = 52 - (i % 8) * 1.5;
        let pumpActive = false;
        if (hour === 16 || hour === 8) {
          moisture += 18;
          pumpActive = true;
        }

        points.push({
          timestamp: t.getTime(),
          timeLabel,
          soilMoisture: Number(Math.max(25, Math.min(88, moisture)).toFixed(1)),
          temperature: Number(temp.toFixed(1)),
          humidity: Number(hum.toFixed(1)),
          soilPH: Number((6.35 + (i % 5) * 0.04).toFixed(2)),
          soilEC: Number((1.8 + (i % 4) * 0.05).toFixed(2)),
          nitrogen: 45 + (i % 6),
          phosphorus: 30 + (i % 4),
          potassium: 185 + (i % 8) * 2,
          pumpActive
        });
      }
    } else if (analyticsTimeframe === '7d') {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let i = 6; i >= 0; i--) {
        const t = new Date(now - i * 24 * 3600 * 1000);
        const dayName = days[t.getDay()];
        points.push({
          timestamp: t.getTime(),
          timeLabel: dayName,
          soilMoisture: Number((54 + Math.sin(i) * 12).toFixed(1)),
          temperature: Number((25 + Math.cos(i) * 3).toFixed(1)),
          humidity: Number((62 + Math.sin(i * 1.5) * 8).toFixed(1)),
          soilPH: Number((6.4 + (i % 3) * 0.06).toFixed(2)),
          soilEC: Number((1.85 + (i % 2) * 0.1).toFixed(2)),
          nitrogen: 46 + (i * 2),
          phosphorus: 31 + (i % 3),
          potassium: 188 + (i * 3),
          pumpActive: i % 2 === 0
        });
      }
    } else {
      // 30 Days view
      for (let i = 29; i >= 0; i -= 2) {
        const t = new Date(now - i * 24 * 3600 * 1000);
        const dayStr = `${t.getMonth() + 1}/${t.getDate()}`;
        points.push({
          timestamp: t.getTime(),
          timeLabel: dayStr,
          soilMoisture: Number((56 + Math.sin(i * 0.8) * 14).toFixed(1)),
          temperature: Number((24.5 + Math.cos(i * 0.5) * 4).toFixed(1)),
          humidity: Number((60 + Math.sin(i * 0.6) * 10).toFixed(1)),
          soilPH: Number((6.42 + (i % 4) * 0.05).toFixed(2)),
          soilEC: Number((1.9 + (i % 3) * 0.08).toFixed(2)),
          nitrogen: 48,
          phosphorus: 32,
          potassium: 192,
          pumpActive: i % 3 === 0
        });
      }
    }

    return points;
  }, [analyticsTimeframe]);

  return (
    <AppContext.Provider
      value={{
        user,
        authLoading,
        demoMode,
        setDemoMode,
        selectedDeviceId,
        setSelectedDeviceId,
        availableDevices,
        deviceStatus,
        setDeviceStatus,
        sensors,
        setSensors,
        controls,
        plants,
        activePlantId,
        setActivePlantId,
        activePlant,
        alerts,
        unreadAlertCount,
        markAlertRead,
        clearAllAlerts,
        addAlert,
        executePumpToggle,
        executeEmergencyHalt,
        resetEmergencyStop,
        updateIrrigationConfig,
        addPlant,
        updatePlant,
        deletePlant,
        historicalData,
        analyticsTimeframe,
        setAnalyticsTimeframe,
        userProfile,
        updateUserProfile,
        setLanguage,
        t,
        simulateSensorsTick,
        toggleNewbieMode,
        speakStatusBriefing
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAgro = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAgro must be used within AppProvider');
  return context;
};
