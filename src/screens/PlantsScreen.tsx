import React, { useState } from 'react';
import { useAgro } from '../context/AppContext';
import { PlantProfile } from '../types';
import {
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Cpu,
  Check,
  X,
  Droplets,
  Thermometer,
  TestTube,
  Activity,
  Image as ImageIcon
} from 'lucide-react';

const presetImages = [
  { label: 'Roma Tomato', url: '/src/assets/images/crop_roma_tomato_1793772058323.jpg' },
  { label: 'Genovese Basil', url: '/src/assets/images/crop_genovese_basil_1793772057574.jpg' },
  { label: 'Sweet Bell Pepper', url: '/src/assets/images/crop_bell_pepper_1793772057709.jpg' },
  { label: 'AgroSmart Emblem', url: '/src/assets/images/agrosmart_brand_logo_1793772055945.jpg' },
];

export const PlantsScreen: React.FC<{ onNavigateToTab: (tab: any) => void }> = ({ onNavigateToTab }) => {
  const {
    plants,
    activePlantId,
    setActivePlantId,
    addPlant,
    updatePlant,
    deletePlant,
    availableDevices
  } = useAgro();

  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingPlantId, setEditingPlantId] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [imageUrl, setImageUrl] = useState(presetImages[0].url);
  const [plantedDate, setPlantedDate] = useState(new Date().toISOString().split('T')[0]);
  const [growthStage, setGrowthStage] = useState<PlantProfile['growthStage']>('Vegetative');
  const [assignedDeviceId, setAssignedDeviceId] = useState('ESP32_AGRO_01');
  const [notes, setNotes] = useState('');

  // Thresholds
  const [minMoisture, setMinMoisture] = useState(45);
  const [maxMoisture, setMaxMoisture] = useState(75);
  const [minTemp, setMinTemp] = useState(18);
  const [maxTemp, setMaxTemp] = useState(30);
  const [minPh, setMinPh] = useState(6.0);
  const [maxPh, setMaxPh] = useState(6.8);
  const [targetEc, setTargetEc] = useState(2.0);

  const openCreateModal = () => {
    setModalMode('create');
    setEditingPlantId(null);
    setName('');
    setSpecies('');
    setImageUrl(presetImages[0].url);
    setPlantedDate(new Date().toISOString().split('T')[0]);
    setGrowthStage('Vegetative');
    setAssignedDeviceId(availableDevices[0] || 'ESP32_AGRO_01');
    setNotes('');
    setMinMoisture(45);
    setMaxMoisture(75);
    setMinTemp(18);
    setMaxTemp(30);
    setMinPh(6.0);
    setMaxPh(6.8);
    setTargetEc(2.0);
  };

  const openEditModal = (plant: PlantProfile) => {
    setModalMode('edit');
    setEditingPlantId(plant.id);
    setName(plant.name);
    setSpecies(plant.species);
    setImageUrl(plant.imageUrl);
    setPlantedDate(plant.plantedDate);
    setGrowthStage(plant.growthStage);
    setAssignedDeviceId(plant.assignedDeviceId);
    setNotes(plant.notes || '');
    setMinMoisture(plant.thresholds.minMoisture);
    setMaxMoisture(plant.thresholds.maxMoisture);
    setMinTemp(plant.thresholds.minTemp);
    setMaxTemp(plant.thresholds.maxTemp);
    setMinPh(plant.thresholds.minPh);
    setMaxPh(plant.thresholds.maxPh);
    setTargetEc(plant.thresholds.targetEc);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const plantPayload: PlantProfile = {
      id: modalMode === 'edit' && editingPlantId ? editingPlantId : `PLANT_${Date.now()}`,
      name,
      species,
      imageUrl,
      plantedDate,
      growthStage,
      assignedDeviceId,
      notes,
      thresholds: {
        minMoisture: Number(minMoisture),
        maxMoisture: Number(maxMoisture),
        minTemp: Number(minTemp),
        maxTemp: Number(maxTemp),
        minPh: Number(minPh),
        maxPh: Number(maxPh),
        targetEc: Number(targetEc)
      }
    };

    if (modalMode === 'edit') {
      updatePlant(plantPayload);
    } else {
      addPlant(plantPayload);
    }

    setModalMode(null);
  };

  return (
    <div className="p-4 space-y-4 pb-28 max-w-2xl mx-auto">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Crop Management</h2>
          <p className="text-xs text-slate-500">Configure agronomic limits and hardware bindings</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center space-x-1.5 bg-[#1b4332] hover:bg-[#2d6a4f] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Plant Profile</span>
        </button>
      </div>

      {/* Plants Cards */}
      <div className="space-y-3.5">
        {plants.map((plant) => {
          const isActive = plant.id === activePlantId;
          return (
            <div
              key={plant.id}
              className={`bg-white rounded-3xl overflow-hidden border shadow-sm transition hover:shadow-md ${
                isActive ? 'border-[#1b4332] ring-2 ring-[#1b4332]/20' : 'border-slate-100'
              }`}
            >
              {/* Photo Banner with gradient scrim */}
              <div className="h-36 sm:h-44 w-full relative overflow-hidden bg-slate-900">
                <img
                  src={plant.imageUrl}
                  alt={plant.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
                        {plant.growthStage}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400 text-emerald-950 font-mono">
                          ACTIVE DASHBOARD CROP
                        </span>
                      )}
                    </div>
                    <h3 className="text-white font-extrabold text-lg leading-tight truncate">
                      {plant.name}
                    </h3>
                    <p className="text-emerald-200 text-xs italic truncate">
                      {plant.species}
                    </p>
                  </div>
                </div>
              </div>

              {/* Threshold specs */}
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold">
                      <Droplets className="w-3 h-3 text-blue-500" />
                      Moisture
                    </span>
                    <span className="font-bold text-slate-800 font-mono mt-0.5 block">
                      {plant.thresholds.minMoisture}% – {plant.thresholds.maxMoisture}%
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold">
                      <Thermometer className="w-3 h-3 text-amber-500" />
                      Thermal Range
                    </span>
                    <span className="font-bold text-slate-800 font-mono mt-0.5 block">
                      {plant.thresholds.minTemp}°C – {plant.thresholds.maxTemp}°C
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold">
                      <TestTube className="w-3 h-3 text-purple-500" />
                      Soil pH
                    </span>
                    <span className="font-bold text-slate-800 font-mono mt-0.5 block">
                      {plant.thresholds.minPh} – {plant.thresholds.maxPh}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold">
                      <Activity className="w-3 h-3 text-emerald-500" />
                      Target EC
                    </span>
                    <span className="font-bold text-slate-800 font-mono mt-0.5 block">
                      {plant.thresholds.targetEc} mS/cm
                    </span>
                  </div>
                </div>

                {plant.notes && (
                  <p className="text-xs text-slate-600 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                    {plant.notes}
                  </p>
                )}

                {/* Footer Controls & Device Assignment */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center space-x-3 text-slate-500">
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {plant.plantedDate}
                    </span>
                    <span className="flex items-center font-mono">
                      <Cpu className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {plant.assignedDeviceId}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {!isActive && (
                      <button
                        onClick={() => setActivePlantId(plant.id)}
                        className="px-2.5 py-1 text-xs font-bold text-[#1b4332] bg-emerald-50 hover:bg-emerald-100 rounded-lg transition"
                      >
                        Set Active
                      </button>
                    )}
                    <button
                      onClick={() => openEditModal(plant)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                      title="Edit plant profile"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {plants.length > 1 && (
                      <button
                        onClick={() => deletePlant(plant.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete plant profile"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Plant Profile Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md max-h-[90vh] rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl flex flex-col overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3 mb-3">
              <h3 className="text-base font-bold text-slate-900">
                {modalMode === 'edit' ? 'Edit Plant Profile' : 'Register New Crop'}
              </h3>
              <button
                onClick={() => setModalMode(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Crop Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Roma Plum Tomato #2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-[#1b4332] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Botanical Species</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solanum lycopersicum"
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-[#1b4332] outline-none"
                />
              </div>

              {/* Plant Image Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Crop Photo</label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {presetImages.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImageUrl(img.url)}
                      className={`h-14 rounded-xl overflow-hidden border-2 relative transition ${
                        imageUrl === img.url ? 'border-[#1b4332] ring-2 ring-[#1b4332]/30' : 'border-slate-200'
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                      {imageUrl === img.url && (
                        <div className="absolute inset-0 bg-[#1b4332]/40 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Growth Stage</label>
                  <select
                    value={growthStage}
                    onChange={(e) => setGrowthStage(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-[#1b4332] outline-none"
                  >
                    <option value="Germination">Germination</option>
                    <option value="Vegetative">Vegetative</option>
                    <option value="Flowering">Flowering</option>
                    <option value="Fruiting">Fruiting</option>
                    <option value="Harvest">Harvest</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Device</label>
                  <select
                    value={assignedDeviceId}
                    onChange={(e) => setAssignedDeviceId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-[#1b4332] outline-none font-mono"
                  >
                    {availableDevices.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Thresholds Section */}
              <div className="pt-2 border-t border-slate-100">
                <span className="block font-bold text-slate-800 mb-2">Agronomic Thresholds</span>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">Min Moisture %</label>
                    <input
                      type="number"
                      value={minMoisture}
                      onChange={(e) => setMinMoisture(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">Max Moisture %</label>
                    <input
                      type="number"
                      value={maxMoisture}
                      onChange={(e) => setMaxMoisture(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">Min Temp (°C)</label>
                    <input
                      type="number"
                      value={minTemp}
                      onChange={(e) => setMinTemp(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">Max Temp (°C)</label>
                    <input
                      type="number"
                      value={maxTemp}
                      onChange={(e) => setMaxTemp(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">Min Soil pH</label>
                    <input
                      type="number"
                      step="0.1"
                      value={minPh}
                      onChange={(e) => setMinPh(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">Max Soil pH</label>
                    <input
                      type="number"
                      step="0.1"
                      value={maxPh}
                      onChange={(e) => setMaxPh(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Agronomic Notes</label>
                <textarea
                  rows={2}
                  placeholder="Special feeding regime, container size, rootzone characteristics..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-[#1b4332] outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold py-3 rounded-xl transition text-xs shadow-md active:scale-95"
                >
                  {modalMode === 'edit' ? 'Save Changes' : 'Register Plant Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
