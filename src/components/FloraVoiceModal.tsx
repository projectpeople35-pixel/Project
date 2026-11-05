import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAgro } from '../context/AppContext';
import { getLanguage, LANGUAGES, LanguageDefinition } from '../services/languages';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Send,
  Sparkles,
  Radio,
  Languages,
  Check,
  Search,
  ChevronDown
} from 'lucide-react';

interface FloraVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'flora';
  text: string;
  timestamp: string;
  isAction?: boolean;
}

export const FloraVoiceModal: React.FC<FloraVoiceModalProps> = ({ isOpen, onClose }) => {
  const {
    sensors,
    activePlant,
    controls,
    executePumpToggle,
    executeEmergencyHalt,
    updateIrrigationConfig,
    userProfile,
    setLanguage
  } = useAgro();

  const currentLanguage = useMemo(() => getLanguage(userProfile.language), [userProfile.language]);

  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceSpeechEnabled, setVoiceSpeechEnabled] = useState(true);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [langPickerOpen, setLangPickerOpen] = useState(false);
  const [langFilterTab, setLangFilterTab] = useState<'ALL' | 'INDIAN' | 'FOREIGN'>('INDIAN');
  const [langSearch, setLangSearch] = useState('');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_0',
      sender: 'flora',
      text: currentLanguage.sampleGreeting,
      timestamp: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isListening, speechTranscript]);

  // Update initial greeting when user changes language
  useEffect(() => {
    setMessages([
      {
        id: `msg_init_${currentLanguage.code}`,
        sender: 'flora',
        text: currentLanguage.sampleGreeting,
        timestamp: 'Just now'
      }
    ]);
  }, [currentLanguage.code]);

  // Initialize Speech Recognition for active language
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = currentLanguage.bcp47;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechTranscript('');
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((r: any) => r[0].transcript)
          .join('');
        setSpeechTranscript(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (speechTranscript.trim()) {
          handleSendMessage(speechTranscript.trim());
          setSpeechTranscript('');
        }
      };

      recognitionRef.current = recognition;
    }
  }, [speechTranscript, currentLanguage]);

  // Voice speech output function in selected language
  const speakText = (text: string) => {
    if (!voiceSpeechEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLanguage.bcp47;
    utterance.rate = 1.0;
    utterance.pitch = 1.02; // Warm, friendly AI persona

    const voices = window.speechSynthesis.getVoices();
    const langPrefix = currentLanguage.bcp47.split('-')[0].toLowerCase();
    const matchedVoice = voices.find((v) =>
      v.lang.toLowerCase().replace('_', '-').startsWith(langPrefix)
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      window.speechSynthesis.cancel();
      try {
        if (recognitionRef.current) {
          recognitionRef.current.lang = currentLanguage.bcp47;
          recognitionRef.current.start();
        }
      } catch (err) {
        console.warn('Recognition start error:', err);
      }
    }
  };

  // Multilingual command parser for immediate hardware actions
  const checkForVoiceCommands = async (text: string): Promise<string | null> => {
    const t = text.toLowerCase();
    const kw = currentLanguage.voiceKeywords;

    const matchesAny = (words: string[]) => words.some((w) => t.includes(w.toLowerCase()));

    // 1. Pump activation
    if (
      t.includes('turn on pump') ||
      t.includes('start pump') ||
      t.includes('water plant') ||
      t.includes('start watering') ||
      matchesAny(kw.pumpOn)
    ) {
      await executePumpToggle(true);
      if (currentLanguage.code === 'hi') {
        return 'कमांड निष्पादित! मैंने वाटर पंप चालू कर दिया है। ड्रिप सिंचाई सक्रिय है।';
      } else if (currentLanguage.code === 'bn') {
        return 'কমান্ড সম্পন্ন হয়েছে! জলের পাম্প চালু করা হয়েছে। সেচ পাইপলাইন সক্রিয়।';
      } else if (currentLanguage.code === 'te') {
        return 'కమాండ్ పూర్తయింది! మోటార్ పంప్ ఆన్ చేయబడింది. నీరు అందుతోంది.';
      } else if (currentLanguage.code === 'ta') {
        return 'கட்டளை நிறைவேற்றப்பட்டது! மோட்டார் பம்ப் இயக்கப்பட்டு நீர் பாய்கிறது.';
      } else if (currentLanguage.code === 'mr') {
        return 'आज्ञा पूर्ण झाली! पाण्याचा पंप सुरू करण्यात आला आहे.';
      } else if (currentLanguage.code === 'gu') {
        return 'આદેશ પૂર્ણ થયો! પાણીનો પંપ ચાલુ કરી દેવામાં આવ્યો છે.';
      } else if (currentLanguage.code === 'es') {
        return '¡Comando ejecutado! He encendido la bomba de agua. El riego está activo.';
      } else if (currentLanguage.code === 'fr') {
        return 'Commande exécutée ! La pompe d’arrosage est maintenant allumée.';
      }
      return `Command executed! I have engaged the solenoid water pump. Drip lines are active.`;
    }

    // 2. Pump shutoff
    if (
      t.includes('turn off pump') ||
      t.includes('stop pump') ||
      t.includes('stop watering') ||
      t.includes('shut off pump') ||
      matchesAny(kw.pumpOff)
    ) {
      await executePumpToggle(false);
      if (currentLanguage.code === 'hi') {
        return 'कमांड निष्पादित! वाटर पंप बंद कर दिया गया है। सोलेनोइड वाल्व सुरक्षित रूप से बंद है।';
      } else if (currentLanguage.code === 'bn') {
        return 'কমান্ড সম্পন্ন হয়েছে! জলের পাম্প বন্ধ করা হয়েছে।';
      } else if (currentLanguage.code === 'te') {
        return 'కమాండ్ పూర్తయింది! వాటర్ పంప్ ఆఫ్ చేయబడింది.';
      } else if (currentLanguage.code === 'ta') {
        return 'கட்டளை நிறைவேற்றப்பட்டது! மோட்டார் பம்ப் நிறுத்தப்பட்டது.';
      } else if (currentLanguage.code === 'es') {
        return '¡Comando ejecutado! La bomba de agua está apagada y la válvula cerrada.';
      }
      return `Command executed! The water pump is disengaged and the solenoid valve is closed.`;
    }

    // 3. Emergency stop
    if (
      t.includes('emergency stop') ||
      t.includes('kill switch') ||
      t.includes('halt everything') ||
      t.includes('emergency shutoff') ||
      matchesAny(kw.emergencyStop)
    ) {
      await executeEmergencyHalt();
      if (currentLanguage.code === 'hi') {
        return 'आपातकालीन रोक सक्रिय! सुरक्षा के लिए सभी एक्ट्यूएटर और मोटर तुरंत बंद कर दिए गए हैं।';
      } else if (currentLanguage.code === 'bn') {
        return 'জরুরী শাটডাউন কার্যকর! সমস্ত ভালভ বন্ধ করা হয়েছে।';
      } else if (currentLanguage.code === 'es') {
        return '¡Parada de emergencia activada! Todos los actuadores han sido bloqueados.';
      }
      return `Emergency shutoff engaged! All actuator lines are locked off for safety.`;
    }

    // 4. Rain delay
    if (
      t.includes('rain delay') ||
      t.includes('enable rain delay') ||
      t.includes('pause for rain') ||
      matchesAny(kw.rainDelay)
    ) {
      await updateIrrigationConfig(
        controls.irrigationMode,
        controls.moistureThreshold,
        controls.maxPumpRuntimeSec,
        controls.wateringDurationSec,
        true
      );
      if (currentLanguage.code === 'hi') {
        return 'स्मार्ट वर्षा विराम सक्रिय हो गया है। मौसम साफ होने तक स्वचालित सिंचाई रुकी रहेगी।';
      }
      return `Smart rain delay has been activated. Scheduled irrigation is paused until clear weather returns.`;
    }

    // 5. Query soil moisture
    if (
      (t.includes('moisture') && (t.includes('what') || t.includes('how is') || t.includes('check'))) ||
      matchesAny(kw.moistureQuery)
    ) {
      if (currentLanguage.code === 'hi') {
        return `वर्तमान में मिट्टी की नमी ${sensors.soilMoisture.toFixed(1)} प्रतिशत है। यह आपके ${activePlant.name} के लिए बिल्कुल अनुकूल है।`;
      } else if (currentLanguage.code === 'bn') {
        return `বর্তমানে মাটির আর্দ্রতা ${sensors.soilMoisture.toFixed(1)} শতাংশ, যা আপনার ${activePlant.name} ফসলের জন্য উপযুক্ত।`;
      } else if (currentLanguage.code === 'te') {
        return `ప్రస్తుతం నేల తేమ ${sensors.soilMoisture.toFixed(1)} శాతంగా ఉంది, ఇది మీ ${activePlant.name} పంటకు సరైనది.`;
      } else if (currentLanguage.code === 'es') {
        return `La humedad del suelo es de ${sensors.soilMoisture.toFixed(1)} por ciento, un nivel óptimo para su ${activePlant.name}.`;
      }
      return `Soil moisture is currently ${sensors.soilMoisture.toFixed(1)} percent for your ${activePlant.name}.`;
    }

    return null;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Check if this is an immediate physical hardware command
      const commandResponse = await checkForVoiceCommands(query);
      if (commandResponse) {
        const floraMsg: ChatMessage = {
          id: `flo_${Date.now()}`,
          sender: 'flora',
          text: commandResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAction: true
        };
        setMessages((prev) => [...prev, floraMsg]);
        speakText(commandResponse);
        setIsLoading(false);
        return;
      }

      // Query server-side Gemini AI with language guidance
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          plantName: activePlant.name,
          species: activePlant.species,
          language: currentLanguage.name,
          languageCode: currentLanguage.code,
          nativeName: currentLanguage.nativeName,
          telemetry: {
            ...sensors,
            pumpActual: controls.pumpActual,
            rainDelayActive: controls.rainDelayActive
          }
        })
      });

      if (!res.ok) {
        throw new Error('Server unavailable');
      }

      const data = await res.json();
      const floraResponse = data.reply || currentLanguage.sampleGreeting;

      const floraMsg: ChatMessage = {
        id: `flo_${Date.now()}`,
        sender: 'flora',
        text: floraResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, floraMsg]);
      speakText(floraResponse);
    } catch (err) {
      // Local fallback response formatted for the active language
      let fallbackText = '';
      if (currentLanguage.code === 'hi') {
        fallbackText = `वर्तमान में मिट्टी की नमी ${sensors.soilMoisture.toFixed(1)}% और तापमान ${sensors.temperature.toFixed(1)}°C है। आप "पंप चालू करें" कहकर सिंचाई कर सकते हैं।`;
      } else if (currentLanguage.code === 'bn') {
        fallbackText = `মাটির আর্দ্রতা এখন ${sensors.soilMoisture.toFixed(1)}% এবং তাপমাত্রা ${sensors.temperature.toFixed(1)}°C। আপনি "পাম্প চালু করুন" বলতে পারেন।`;
      } else if (currentLanguage.code === 'te') {
        fallbackText = `నేల తేమ ${sensors.soilMoisture.toFixed(1)}% మరియు ఉష్ణోగ్రత ${sensors.temperature.toFixed(1)}°C గా ఉంది. మీరు "పంప్ ఆన్" చేయవచ్చు.`;
      } else if (currentLanguage.code === 'es') {
        fallbackText = `La humedad del suelo es de ${sensors.soilMoisture.toFixed(1)}% y la temperatura es de ${sensors.temperature.toFixed(1)}°C. Puede decir "Encender bomba" para iniciar el riego.`;
      } else {
        fallbackText = `All systems for ${activePlant.name} are active. Soil moisture is ${sensors.soilMoisture.toFixed(1)}% and ambient temperature is ${sensors.temperature.toFixed(1)}°C. You can say "Turn on the pump" to begin irrigation.`;
      }

      const floraMsg: ChatMessage = {
        id: `flo_${Date.now()}`,
        sender: 'flora',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, floraMsg]);
      speakText(fallbackText);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter languages for the in-modal selector
  const filteredLanguages = useMemo(() => {
    return LANGUAGES.filter((l) => {
      const matchCat =
        langFilterTab === 'ALL'
          ? true
          : langFilterTab === 'INDIAN'
          ? l.category === 'INDIAN_CONSTITUTION'
          : l.category === 'INTERNATIONAL';

      const matchSearch =
        !langSearch.trim() ||
        l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
        l.nativeName.toLowerCase().includes(langSearch.toLowerCase()) ||
        l.region.toLowerCase().includes(langSearch.toLowerCase());

      return matchCat && matchSearch;
    });
  }, [langFilterTab, langSearch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
      <div className="bg-slate-950 text-white w-full sm:max-w-md h-[92vh] sm:h-[84vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-800 relative">
        {/* Hologram Aura Backdrop */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-emerald-500/20 via-cyan-500/10 to-transparent pointer-events-none" />

        {/* Modal Header */}
        <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between z-10 bg-slate-950/90 backdrop-blur-sm">
          <div className="flex items-center space-x-2.5">
            <div className="relative">
              <img
                src="/src/assets/images/flora_ai_avatar_1793774183839.jpg"
                alt="Flora AI Avatar"
                className="w-10 h-10 rounded-2xl object-cover ring-2 ring-emerald-400/50 shadow-lg"
              />
              <span
                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-950 ${
                  isSpeaking ? 'bg-cyan-400 animate-ping' : isListening ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                }`}
              />
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="text-sm font-extrabold text-white tracking-tight">Flora AI</h3>
                {/* Language Switcher Button */}
                <button
                  onClick={() => setLangPickerOpen(!langPickerOpen)}
                  className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition"
                  title="Change AI & Voice Language"
                >
                  <Languages className="w-3 h-3 text-cyan-300" />
                  <span className="font-sans">{currentLanguage.nativeName}</span>
                  <ChevronDown className="w-2.5 h-2.5" />
                </button>
              </div>
              <p className="text-[11px] text-emerald-400/80 font-mono truncate">
                {isListening ? 'Listening...' : isSpeaking ? 'Flora is speaking...' : `Ready (${currentLanguage.name})`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setVoiceSpeechEnabled(!voiceSpeechEnabled)}
              className={`p-2 rounded-xl transition ${
                voiceSpeechEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
              title={voiceSpeechEnabled ? 'Mute Voice Responses' : 'Unmute Voice Responses'}
            >
              {voiceSpeechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Language Selection Dropdown Drawer */}
        {langPickerOpen && (
          <div className="bg-slate-900 border-b border-slate-800 p-3 z-20 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-emerald-400" />
                Select Voice & AI Language (40 Supported)
              </span>
              <button
                onClick={() => setLangPickerOpen(false)}
                className="text-[11px] text-slate-400 hover:text-white font-mono"
              >
                Close
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-slate-950 p-0.5 rounded-xl text-[10px] font-bold">
              <button
                onClick={() => setLangFilterTab('INDIAN')}
                className={`flex-1 py-1 rounded-lg transition ${
                  langFilterTab === 'INDIAN' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                }`}
              >
                Indian Constitution (22)
              </button>
              <button
                onClick={() => setLangFilterTab('FOREIGN')}
                className={`flex-1 py-1 rounded-lg transition ${
                  langFilterTab === 'FOREIGN' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                }`}
              >
                International (18)
              </button>
              <button
                onClick={() => setLangFilterTab('ALL')}
                className={`px-3 py-1 rounded-lg transition ${
                  langFilterTab === 'ALL' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                }`}
              >
                All (40)
              </button>
            </div>

            {/* Language Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search Hindi, Tamil, Bengali, Spanish, French..."
                value={langSearch}
                onChange={(e) => setLangSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Scrollable Language Grid */}
            <div className="max-h-48 overflow-y-auto space-y-1 pr-1 font-sans">
              {filteredLanguages.map((l) => {
                const isSelected = l.code === currentLanguage.code;
                return (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setLangPickerOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition ${
                      isSelected
                        ? 'bg-emerald-600/30 text-emerald-200 border border-emerald-500/50'
                        : 'bg-slate-950/60 hover:bg-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-baseline space-x-2 text-left">
                      <span className="font-bold text-sm text-white">{l.nativeName}</span>
                      <span className="text-[11px] text-slate-400">{l.name}</span>
                      <span className="text-[9px] text-slate-500 font-mono">({l.bcp47})</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Center Animated Hologram Waveform (Siri & Alexa Style) */}
        <div className="py-3 px-6 flex flex-col items-center justify-center border-b border-slate-900 bg-slate-950/80 shrink-0">
          <div className="relative flex items-center justify-center">
            {/* Pulsing energy rings */}
            <div
              className={`w-20 h-20 rounded-full border border-emerald-400/40 absolute transition-all duration-300 ${
                isSpeaking
                  ? 'scale-150 animate-ping opacity-60'
                  : isListening
                  ? 'scale-125 animate-pulse opacity-80'
                  : 'scale-100 opacity-20'
              }`}
            />
            <div
              className={`w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-2xl transition-transform ${
                isListening ? 'scale-110' : ''
              }`}
            >
              {isListening ? (
                <Radio className="w-7 h-7 text-white animate-spin" />
              ) : (
                <Sparkles className="w-7 h-7 text-white" />
              )}
            </div>
          </div>

          {/* Audio Waveform visualization bars */}
          <div className="flex items-center space-x-1 mt-3 h-5">
            {[4, 8, 14, 18, 12, 16, 20, 14, 8, 4].map((h, i) => (
              <span
                key={i}
                className={`w-1 bg-gradient-to-t from-emerald-500 to-cyan-300 rounded-full transition-all duration-150 ${
                  isSpeaking || isListening ? 'animate-pulse' : 'opacity-30'
                }`}
                style={{
                  height: isSpeaking || isListening ? `${h * (Math.random() * 0.8 + 0.6)}px` : '4px'
                }}
              />
            ))}
          </div>

          {speechTranscript && (
            <p className="text-xs text-amber-300 font-mono italic mt-2 animate-pulse truncate max-w-xs text-center">
              "{speechTranscript}"
            </p>
          )}
        </div>

        {/* Chat History Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : msg.isAction
                      ? 'bg-slate-900 border border-emerald-400/50 text-emerald-200 rounded-tl-none font-mono'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <span className="text-[10px] text-slate-500 font-mono mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-mono bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 w-fit">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Flora is consulting agronomic telemetry in {currentLanguage.name}...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Localized Quick Suggestion Chips */}
        <div className="px-3 py-1.5 flex space-x-1.5 overflow-x-auto no-scrollbar border-t border-slate-900 bg-slate-950">
          <button
            onClick={() => handleSendMessage(currentLanguage.voiceKeywords.moistureQuery[0] || 'Check moisture')}
            className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-lg whitespace-nowrap hover:bg-emerald-900 transition"
          >
            "{currentLanguage.voiceKeywords.moistureQuery[0] || 'Moisture'}"
          </button>
          <button
            onClick={() => handleSendMessage(currentLanguage.voiceKeywords.pumpOn[0] || 'Turn on pump')}
            className="text-[10px] font-mono text-blue-300 bg-blue-950/60 border border-blue-500/30 px-2.5 py-1 rounded-lg whitespace-nowrap hover:bg-blue-900 transition"
          >
            "{currentLanguage.voiceKeywords.pumpOn[0] || 'Turn on pump'}"
          </button>
          <button
            onClick={() => handleSendMessage(currentLanguage.voiceKeywords.phQuery[0] || 'Check pH')}
            className="text-[10px] font-mono text-purple-300 bg-purple-950/60 border border-purple-500/30 px-2.5 py-1 rounded-lg whitespace-nowrap hover:bg-purple-900 transition"
          >
            "{currentLanguage.voiceKeywords.phQuery[0] || 'pH'}"
          </button>
          <button
            onClick={() => handleSendMessage(currentLanguage.voiceKeywords.rainDelay[0] || 'Rain delay')}
            className="text-[10px] font-mono text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2.5 py-1 rounded-lg whitespace-nowrap hover:bg-amber-900 transition"
          >
            "{currentLanguage.voiceKeywords.rainDelay[0] || 'Rain delay'}"
          </button>
        </div>

        {/* Input Bar & Large Siri/Alexa Microphone Trigger */}
        <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center space-x-2">
          <button
            onClick={toggleListening}
            className={`p-3 rounded-2xl transition active:scale-90 shadow-lg ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-500/40'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
            title={isListening ? 'Stop Listening' : `Tap to Speak (${currentLanguage.name})`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            placeholder={
              isListening
                ? `Listening in ${currentLanguage.name}...`
                : `Ask Flora in ${currentLanguage.name} (${currentLanguage.nativeName})...`
            }
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim()}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-emerald-400 transition active:scale-95"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
