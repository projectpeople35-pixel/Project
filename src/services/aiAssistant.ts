import { SensorReadings, PlantProfile } from '../types';

export interface AgroAdvice {
  category: 'Watering' | 'Climate' | 'Soil Chemistry' | 'Nutrition' | 'General';
  status: 'OPTIMAL' | 'ATTENTION' | 'CRITICAL';
  title: string;
  detail: string;
  actionableStep: string;
  scientificReference?: string;
}

export interface AssistantDiagnosticResult {
  engineType: 'RULE_BASED' | 'GEMINI_AI';
  summaryTitle: string;
  overallHealthScore: number; // 0 - 100
  recommendations: AgroAdvice[];
  timestamp: number;
}

export function evaluatePlantHealth(
  sensors: SensorReadings,
  plant: PlantProfile | null
): AssistantDiagnosticResult {
  const recommendations: AgroAdvice[] = [];
  const cropName = plant ? plant.name : 'Target Crop';
  const species = plant?.species || 'Horticultural Crop';

  const th = plant?.thresholds || {
    minMoisture: 45,
    maxMoisture: 75,
    minTemp: 18,
    maxTemp: 30,
    minPh: 6.0,
    maxPh: 6.8,
    targetEc: 2.0,
    minN: 40,
    minP: 25,
    minK: 120
  };

  let penaltyPoints = 0;

  // 1. Root-Zone Moisture Assessment
  if (sensors.soilMoisture < th.minMoisture) {
    const deficit = th.minMoisture - sensors.soilMoisture;
    penaltyPoints += Math.min(35, deficit * 2);
    recommendations.push({
      category: 'Watering',
      status: 'CRITICAL',
      title: `Low Root Hydration (${sensors.soilMoisture.toFixed(1)}%)`,
      detail: `Current volumetric substrate moisture is ${deficit.toFixed(1)}% below the ${cropName} threshold (${th.minMoisture}%). Water stress inhibits xylem flow and induces cavitation risk.`,
      actionableStep: `Initiate a controlled irrigation pulse (recommended runtime: 45-60 seconds) or enable Auto-Irrigation mode.`,
      scientificReference: `FAO-56 Irrigation guidelines for ${species}`
    });
  } else if (sensors.soilMoisture > th.maxMoisture) {
    const excess = sensors.soilMoisture - th.maxMoisture;
    penaltyPoints += Math.min(30, excess * 2);
    recommendations.push({
      category: 'Watering',
      status: 'ATTENTION',
      title: `Substrate Oversaturation (${sensors.soilMoisture.toFixed(1)}%)`,
      detail: `Soil water tension is above the ideal field capacity limit (${th.maxMoisture}%). Extended saturated conditions restrict oxygen penetration to rhizosphere root hair zones.`,
      actionableStep: `Inhibit pump actuation, ensure container drainage holes are clear, and let moisture naturally transpire down to ~${th.minMoisture + 10}%.`,
      scientificReference: `Anaerobic Rootzone Dynamics in ${species}`
    });
  } else {
    recommendations.push({
      category: 'Watering',
      status: 'OPTIMAL',
      title: `Optimal Hydration Equilibrium (${sensors.soilMoisture.toFixed(1)}%)`,
      detail: `Volumetric moisture is within the healthy capillary retention range (${th.minMoisture}% - ${th.maxMoisture}%). Water and dissolved nutrients are readily absorbable.`,
      actionableStep: `Keep automated moisture threshold set to ${th.minMoisture}%. No manual intervention required.`,
      scientificReference: `Plant Available Water (PAW) Standard`
    });
  }

  // 2. Ambient & Canopy Temperature
  if (sensors.temperature > th.maxTemp) {
    penaltyPoints += 20;
    recommendations.push({
      category: 'Climate',
      status: 'CRITICAL',
      title: `High Thermal Stress (${sensors.temperature.toFixed(1)}°C)`,
      detail: `Canopy temperature exceeds maximum physiological tolerance (${th.maxTemp}°C). High VPD increases transpiration faster than roots can replenish water.`,
      actionableStep: `Lower greenhouse heat, deploy shade screening (30-50%), or activate misting cooling fans.`,
      scientificReference: `Thermal Enzyme Inactivation Thresholds`
    });
  } else if (sensors.temperature < th.minTemp) {
    penaltyPoints += 15;
    recommendations.push({
      category: 'Climate',
      status: 'ATTENTION',
      title: `Low Temperature Growth Retardation (${sensors.temperature.toFixed(1)}°C)`,
      detail: `Substrate temperature is lower than baseline comfort (${th.minTemp}°C). Phosphorus uptake and vegetative cell division slow down significantly.`,
      actionableStep: `Shield from cold drafts, close greenhouse vents, or apply root warming mats if in nursery stage.`,
      scientificReference: `Sub-thermal Horticultural Uptake Kinetics`
    });
  } else {
    recommendations.push({
      category: 'Climate',
      status: 'OPTIMAL',
      title: `Optimal Temperature Range (${sensors.temperature.toFixed(1)}°C)`,
      detail: `Thermal conditions align with energetic metabolic balance and active photosynthesis for ${cropName}.`,
      actionableStep: `Maintain adequate daylight airflow to avoid temperature stratification.`,
      scientificReference: `Photosynthetic Q10 Optimum`
    });
  }

  // 3. Soil pH Chemistry
  if (sensors.soilPH < th.minPh) {
    penaltyPoints += 15;
    recommendations.push({
      category: 'Soil Chemistry',
      status: 'ATTENTION',
      title: `Acidic Substrate (pH ${sensors.soilPH.toFixed(2)})`,
      detail: `Root zone pH is acidic below target minimum (${th.minPh}). Severe acidity induces micronutrient toxicity (Manganese/Aluminum) and blocks Calcium/Magnesium uptake.`,
      actionableStep: `Dose with agricultural calcitic limestone (calcium carbonate) or use a mild alkaline buffer flush.`,
      scientificReference: `Nutrient Bioavailability Chart (Truog 1946)`
    });
  } else if (sensors.soilPH > th.maxPh) {
    penaltyPoints += 15;
    recommendations.push({
      category: 'Soil Chemistry',
      status: 'ATTENTION',
      title: `Alkaline Substrate (pH ${sensors.soilPH.toFixed(2)})`,
      detail: `pH is elevated above target threshold (${th.maxPh}). High alkalinity precipitates iron and phosphorus into insoluble forms causing chlorosis.`,
      actionableStep: `Apply dilute organic acid amendment (such as horticultural citric acid) or peat moss top dressing.`,
      scientificReference: `Iron Chelation Equilibrium in Soil Solution`
    });
  } else {
    recommendations.push({
      category: 'Soil Chemistry',
      status: 'OPTIMAL',
      title: `Balanced Substrate Reaction (pH ${sensors.soilPH.toFixed(2)})`,
      detail: `pH is in the ideal bioavailability band (${th.minPh} - ${th.maxPh}), enabling unimpeded cation exchange for ${cropName}.`,
      actionableStep: `Continue using balanced irrigation water (target pH 6.2 - 6.5).`,
      scientificReference: `Rhizosphere Cation Exchange Capacity (CEC)`
    });
  }

  // 4. Electrical Conductivity & NPK Fertility
  if (sensors.soilEC > 3.0) {
    penaltyPoints += 15;
    recommendations.push({
      category: 'Nutrition',
      status: 'CRITICAL',
      title: `High Soil Salinity / Osmotic Tension (${sensors.soilEC.toFixed(2)} mS/cm)`,
      detail: `Excessive soluble mineral salts create osmotic back-pressure, causing chemical drought even if soil appears wet.`,
      actionableStep: `Perform a fresh-water leaching cycle with 20% drainage runoff to flush excess salt accumulation.`,
      scientificReference: `Substrate Salinity & Osmotic Potential Guidelines`
    });
  } else if (sensors.soilEC < 0.8) {
    penaltyPoints += 10;
    recommendations.push({
      category: 'Nutrition',
      status: 'ATTENTION',
      title: `Low Substrate Ion Concentration (${sensors.soilEC.toFixed(2)} mS/cm)`,
      detail: `EC reading indicates diluted fertilizer minerals. Vegetative expansion will decline if nutrient reserves are exhausted.`,
      actionableStep: `Introduce half-strength balanced water-soluble fertilizer formulated for ${cropName}.`,
      scientificReference: `Electrical Conductivity in Substrate Hydrodynamics`
    });
  } else {
    recommendations.push({
      category: 'Nutrition',
      status: 'OPTIMAL',
      title: `Healthy Ionic Nutrient Density (${sensors.soilEC.toFixed(2)} mS/cm)`,
      detail: `Osmotic pressure is balanced. Modbus readings: Nitrogen ${sensors.nitrogen} mg/kg, Phosphorus ${sensors.phosphorus} mg/kg, Potassium ${sensors.potassium} mg/kg.`,
      actionableStep: `Maintain standard feeding schedule.`,
      scientificReference: `Macronutrient NPK Balance Ratios`
    });
  }

  // Calculate composite health score
  const overallHealthScore = Math.max(20, Math.min(100, Math.round(100 - penaltyPoints)));

  let summaryTitle = 'Excellent Growing Conditions';
  if (overallHealthScore < 60) {
    summaryTitle = 'Immediate Agronomic Attention Needed';
  } else if (overallHealthScore < 85) {
    summaryTitle = 'Stable with Minor Parametric Variations';
  }

  return {
    engineType: 'RULE_BASED',
    summaryTitle,
    overallHealthScore,
    recommendations,
    timestamp: Date.now()
  };
}
