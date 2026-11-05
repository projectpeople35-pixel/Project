export interface LanguageDefinition {
  code: string;           // ISO 639-1 / 639-3 code
  name: string;           // English name
  nativeName: string;     // Name in native script
  category: 'INDIAN_CONSTITUTION' | 'INTERNATIONAL';
  bcp47: string;          // Primary BCP-47 tag for speech synthesis & recognition
  fallbackBcp47?: string; // Fallback tag if primary speech voice is unavailable
  region: string;         // Geographic/State indicator
  sampleGreeting: string; // Used in Flora AI introduction
  voiceKeywords: {
    pumpOn: string[];
    pumpOff: string[];
    emergencyStop: string[];
    rainDelay: string[];
    moistureQuery: string[];
    phQuery: string[];
  };
}

export const LANGUAGES: LanguageDefinition[] = [
  // ==========================================
  // 22 LANGUAGES OF THE 8TH SCHEDULE (CONSTITUTION OF INDIA)
  // ==========================================
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    category: 'INDIAN_CONSTITUTION',
    bcp47: 'hi-IN',
    region: 'North & Central India (Official)',
    sampleGreeting: 'नमस्ते! मैं फ्लोरा हूँ, आपकी कृषि एआई सहायक। मैं आपकी फसल की निगरानी और सिंचाई नियंत्रण के लिए तैयार हूँ।',
    voiceKeywords: {
      pumpOn: ['पंप चालू', 'पानी दो', 'सिंचाई शुरू', 'मोटर चालू'],
      pumpOff: ['पंप बंद', 'पानी रोको', 'सिंचाई बंद', 'मोटर बंद'],
      emergencyStop: ['इमरजेंसी', 'आपातकाल', 'तुरंत रोको', 'कटऑफ'],
      rainDelay: ['बारिश मोड', 'वर्षा विराम', 'रेन डिले'],
      moistureQuery: ['नमी', 'मिट्टी की नमी', 'पानी का स्तर'],
      phQuery: ['पीएच', 'अम्लता', 'क्षारीयता']
    }
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    category: 'INDIAN_CONSTITUTION',
    bcp47: 'bn-IN',
    region: 'West Bengal, Tripura, Assam',
    sampleGreeting: 'নমস্কার! আমি ফ্লোরা, আপনার কৃষি এআই সহকারী। আপনার ফসলের আর্দ্রতা ও সেচ নিয়ন্ত্রণের জন্য প্রস্তুত।',
    voiceKeywords: {
      pumpOn: ['পাম্প চালু', 'জল দাও', 'সেচ শুরু', 'মোটর অন'],
      pumpOff: ['পাম্প বন্ধ', 'জল বন্ধ', 'সেচ বন্ধ', 'মোটর অফ'],
      emergencyStop: ['জরুরী অবস্থা', 'জরুরি বন্ধ', 'থামাও'],
      rainDelay: ['বৃষ্টি বিলম্ব', 'বৃষ্টি মোড'],
      moistureQuery: ['আর্দ্রতা', 'মাটির আর্দ্রতা', 'জল কত'],
      phQuery: ['পিএইচ', 'মাটির পিএইচ']
    }
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    category: 'INDIAN_CONSTITUTION',
    bcp47: 'te-IN',
    region: 'Andhra Pradesh & Telangana',
    sampleGreeting: 'నమస్కారం! నేను ఫ్లోరాను, మీ వ్యవసాయ ఏఐ సహాయకురాలిని. మీ పంట సంరక్షణ మరియు నీటిపారుదల కోసం సిద్ధంగా ఉన్నాను.',
    voiceKeywords: {
      pumpOn: ['మోటార్ ఆన్', 'నీరు పెట్టు', 'పంప్ ఆన్', 'నీరు పోయి'],
      pumpOff: ['మోటార్ ఆఫ్', 'నీరు ఆపు', 'పంప్ ఆఫ్'],
      emergencyStop: ['అత్యవసర ఆపు', 'ఎమర్జెన్సీ', 'ఆపు'],
      rainDelay: ['వర్షం విరామం', 'వర్షం మోడ్'],
      moistureQuery: ['తేమ', 'నేల తేమ', 'నీటి శాతం'],
      phQuery: ['పిహెచ్', 'నేల పిహెచ్']
    }
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    category: 'INDIAN_CONSTITUTION',
    bcp47: 'mr-IN',
    region: 'Maharashtra & Goa',
    sampleGreeting: 'नमस्कार! मी फ्लोरा आहे, तुमची शेती एआय सहाय्यक. पिकांची स्थिती व पाणीपुरवठा नियंत्रणासाठी मी सज्ज आहे.',
    voiceKeywords: {
      pumpOn: ['पंप चालू', 'पाणी द्या', 'मोटर चालू', 'सिंचन सुरू'],
      pumpOff: ['पंप बंद', 'पाणी थांबवा', 'मोटर बंद'],
      emergencyStop: ['आणीबाणी', 'तातडीने बंद', 'थांबवा'],
      rainDelay: ['पाऊस विलंब', 'पाऊस मोड'],
      moistureQuery: ['ओलावा', 'मातीतील ओलावा', 'नमी'],
      phQuery: ['पीएच', 'सामू']
    }
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    category: 'INDIAN_CONSTITUTION',
    bcp47: 'ta-IN',
    region: 'Tamil Nadu & Puducherry',
    sampleGreeting: 'வணக்கம்! நான் ஃப்ளோரா, உங்கள் விவசாய ஏஐ உதவியாளர். உங்கள் பயிர் நலம் மற்றும் பாசனத்தை கவனிக்க தயாராக உள்ளேன்.',
    voiceKeywords: {
      pumpOn: ['பம்பை ஆன் செய்', 'தண்ணீர் விடு', 'மோட்டார் ஆன்', 'பாசனம் தொடங்கு'],
      pumpOff: ['பம்பை ஆப் செய்', 'தண்ணீர் நிறுத்து', 'மோட்டார் ஆப்'],
      emergencyStop: ['அவசர நிறுத்தம்', 'உடனே நிறுத்து'],
      rainDelay: ['மழை தாமதம்', 'மழை முறை'],
      moistureQuery: ['ஈரப்பதம்', 'மண் ஈரப்பதம்', 'ஈரம்'],
      phQuery: ['பிஎச்', 'மண் காரத்தன்மை']
    }
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    category: 'INDIAN_CONSTITUTION',
    bcp47: 'ur-IN',
    region: 'Jammu & Kashmir, Telangana, UP, Bihar',
    sampleGreeting: 'آداب! میں فلورا ہوں، آپ کی زرعی اے آئی معاون۔ آپ کی فصل کی نگرانی اور آبپاشی کے لیے حاضر ہوں۔',
    voiceKeywords: {
      pumpOn: ['پمپ چالو', 'پانی دو', 'موٹر چالو', 'آبپاشی شروع'],
      pumpOff: ['پمپ بند', 'پانی روکو', 'موٹر بند'],
      emergencyStop: ['ہنگامی بندش', 'فوری روکو'],
      rainDelay: ['بارش تاخیر', 'بارش موڈ'],
      moistureQuery: ['نمی', 'مٹی کی نمی'],
      phQuery: ['پی ایچ', 'تیزابیت']
    }
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    category: 'INDIAN_CONSTITUTION',
    bcp47: 'gu-IN',
    region: 'Gujarat, Daman & Diu',
    sampleGreeting: 'નમસ્તે! હું ફ્લોરા છું, તમારી કૃષિ એઆઈ સહાયક. તમારા પાકની સુરક્ષા અને સિંચાઈ માટે હાજર છું.',
    voiceKeywords: {
      pumpOn: ['પંપ ચાલુ', 'પાણી આપો', 'મોટર ચાલુ'],
      pumpOff: ['પંપ બંધ', 'પાણી બંધ', 'મોટર બંધ'],
      emergencyStop: ['કટોકટી સ્ટોપ', 'તાત્કાલિક બંધ'],
      rainDelay: ['વરસાદ વિલંબ', 'વરસાદ મોડ'],
      moistureQuery: ['ભેજ', 'જમીનનો ભેજ'],
      phQuery: ['પીએચ', 'જમીન પીએચ']
    }
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    category: 'INDIAN_CONSTITUTION',
    bcp47: 'kn-IN',
    region: 'Karnataka',
    sampleGreeting: 'ನಮಸ್ಕಾರ! ನಾನು ಫ್ಲೋರಾ, ನಿಮ್ಮ ಕೃಷಿ ಎಐ ಸಹಾಯಕ. ನಿಮ್ಮ ಬೆಳೆ ಆರೋಗ್ಯ ಮತ್ತು ನೀರಾವರಿ ನಿಯಂತ್ರಣಕ್ಕೆ ಸಿದ್ಧನಾಗಿದ್ದೇನೆ.',
    voiceKeywords: {
      pumpOn: ['ಪಂಪ್ ಆನ್', 'ನೀರು ಹಾಯಿಸು', 'ಮೋಟಾರ್ ಆನ್'],
      pumpOff: ['ಪಂಪ್ ಆಫ್', 'ನೀರು ನಿಲ್ಲಿಸು', 'ಮೋಟಾರ್ ಆಫ್'],
      emergencyStop: ['ತುರ್ತು ನಿಲುಗಡೆ', 'ಕೂಡಲೇ ನಿಲ್ಲಿಸು'],
      rainDelay: ['ಮಳೆ ವಿಳಂಬ', 'ಮಳೆ ಮೋಡ್'],
      moistureQuery: ['ತೇವಾಂಶ', 'ಮಣ್ಣಿನ ತೇವಾಂಶ'],
      phQuery: ['ಪಿಎಚ್', 'ಮಣ್ಣಿನ ಪಿಎಚ್']
    }
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    category: 'INDIAN_CONSTITUTION',
    bcp47: 'ml-IN',
    region: 'Kerala & Lakshadweep',
    sampleGreeting: 'നമസ്കാരം! ഞാൻ ഫ്ലോറ, നിങ്ങളുടെ കാർഷിക എഐ സഹായി. നിങ്ങളുടെ വിളകളുടെ പരിപാലനത്തിനും നനയ്ക്കലിനുമായി ഞാൻ സജ്ജമാണ്.',
    voiceKeywords: {
      pumpOn: ['പമ്പ് ഓൺ ചെയ്യുക', 'വെള്ളമൊഴിക്കുക', 'മോട്ടോർ ഓൺ'],
      pumpOff: ['പമ്പ് ഓഫ് ചെയ്യുക', 'വെള്ളം നിർത്തുക', 'മോട്ടോർ ഓഫ്'],
      emergencyStop: ['അടിയന്തര സ്റ്റോപ്പ്', 'ഉടൻ നിർത്തുക'],
      rainDelay: ['മഴ തടസ്സം', 'മഴ മോഡ്'],
      moistureQuery: ['ഈർപ്പം', 'മണ്ണിലെ ഈർപ്പം'],
      phQuery: ['പിഎച്ച്', 'മണ്ണ് പിഎച്ച്']
    }
  },
  {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    category: 'INDIAN_CONSTITUTION',
    bcp47: 'or-IN',
    fallbackBcp47: 'hi-IN',
    region: 'Odisha',
    sampleGreeting: 'ନମସ୍କାର! ମୁଁ ଫ୍ଲୋରା, ଆପଣଙ୍କର କୃଷି ଏଆଇ ସହାୟକ। ଆପଣଙ୍କ ଫସଲର ଯତ୍ନ ଓ ଜଳସେଚନ ପାଇଁ ପ୍ରସ୍ତୁତ।',
    voiceKeywords: {
      pumpOn: ['ପମ୍ପ ଚାଲୁ', 'ପାଣି ଦିଅ', 'ମୋଟର ଚାଲୁ'],
      pumpOff: ['ପମ୍ପ ବନ୍ଦ', 'ପାଣି ବନ୍ଦ', 'ମୋଟର ବନ୍ଦ'],
      emergencyStop: ['ଜରୁରୀକାଳୀନ ବନ୍ଦ', 'ତୁରନ୍ତ ବନ୍ଦ'],
      rainDelay: ['ବର୍ଷା ବିଳମ୍ବ', 'ବର୍ଷା ମୋଡ୍'],
      moistureQuery: ['ଆର୍ଦ୍ରତା', 'ମାଟିର ଆର୍ଦ୍ରତା'],
      phQuery: ['ପିଏଚ୍', 'ମାଟି ପିଏଚ୍']
    }
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    category: 'INDIAN_CONSTITUTION',
    bcp47: 'pa-IN',
    region: 'Punjab & Chandigarh',
    sampleGreeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਫਲੋਰਾ ਹਾਂ, ਤੁਹਾਡੀ ਖੇਤੀਬਾੜੀ ਏਆਈ ਸਹਾਇਕ। ਤੁਹਾਡੀ ਫਸਲ ਦੀ ਦੇਖਭਾਲ ਅਤੇ ਸਿੰਚਾਈ ਲਈ ਤਿਆਰ ਹਾਂ।',
    voiceKeywords: {
      pumpOn: ['ਪੰਪ ਚਲਾਓ', 'ਪਾਣੀ ਲਾਓ', 'ਮੋਟਰ ਚਲਾਓ'],
      pumpOff: ['ਪੰਪ ਬੰਦ ਕਰੋ', 'ਪਾਣੀ ਰੋਕੋ', 'ਮੋਟਰ ਬੰਦ'],
      emergencyStop: ['ਐਮਰਜੈਂਸੀ ਬੰਦ', 'ਤੁਰੰਤ ਰੋਕੋ'],
      rainDelay: ['ਮੀਂਹ ਦੇਰੀ', 'ਮੀਂਹ ਮੋਡ'],
      moistureQuery: ['ਨਮੀ', 'ਮਿੱਟੀ ਦੀ ਨਮੀ'],
      phQuery: ['ਪੀਐਚ', 'ਮਿੱਟੀ ਪੀਐਚ']
    }
  },
  {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    category: 'INDIAN_CONSTITUTION',
    bcp47: 'as-IN',
    fallbackBcp47: 'bn-IN',
    region: 'Assam',
    sampleGreeting: 'নমস্কাৰ! মই ফ্ল’ৰা, আপোনাৰ কৃষি এআই সহায়িকা। আপোনাৰ শস্য নিৰীক্ষণ আৰু জলসিঞ্চনৰ বাবে মই প্ৰস্তুত।',
    voiceKeywords: {
      pumpOn: ['পাম্প চলাওক', 'পানী দিয়ক', 'মটৰ অন'],
      pumpOff: ['পাম্প বন্ধ কৰক', 'পানী বন্ধ', 'মটৰ অফ'],
      emergencyStop: ['জৰুৰীকালীন বন্ধ', 'ৰখাওক'],
      rainDelay: ['বৰষুণ পলম', 'বৰষুণ মোড'],
      moistureQuery: ['আৰ্দ্ৰতা', 'মাটিৰ আৰ্দ্ৰতা'],
      phQuery: ['পিএইচ', 'মাটিৰ পিএইচ']
    }
  },
  {
    code: 'sa',
    name: 'Sanskrit',
    nativeName: 'संस्कृतम्',
    category: 'INDIAN_CONSTITUTION',
    bcp47: 'sa-IN',
    fallbackBcp47: 'hi-IN',
    region: 'Ancient / Pan-India',
    sampleGreeting: 'नमो नमः! अहं फ्लोरा, भवतां कृषिविज्ञान-सहायिका। सस्यानां रक्षणाय सेचनाय च सन्नद्धा अस्मि।',
    voiceKeywords: {
      pumpOn: ['यन्त्रं चालय', 'जलं सिञ्च', 'सेचनं कुरु'],
      pumpOff: ['यन्त्रं स्थगय', 'जलं निरुन्धि'],
      emergencyStop: ['आपत्काले स्थगनम्', 'शीघ्रं स्थगय'],
      rainDelay: ['वृष्टि-विरामः', 'वृष्टि-कालः'],
      moistureQuery: ['आर्द्रता', 'मृत्तिकायाः आर्द्रता'],
      phQuery: ['पीएच', 'मृत्तिका-गुणः']
    }
  },
  {
    code: 'mai',
    name: 'Maithili',
    nativeName: 'मैथिली',
    category: 'INDIAN_CONSTITUTION',
    bcp47: 'mai-IN',
    fallbackBcp47: 'hi-IN',
    region: 'Bihar & Jharkhand',
    sampleGreeting: 'प्रणाम! हम फ्लोरा छी, अहाँक कृषि एआई सहायक। फसलक देखभाल आ पटौनीक लेल तैयार छी।',
    voiceKeywords: {
      pumpOn: ['पंप चालू करू', 'पानी दियौ', 'मोटर चालू करू'],
      pumpOff: ['पंप बंद करू', 'पानी रोकू', 'मोटर बंद करू'],
      emergencyStop: ['आपातकालीन रोक', 'तुरंत रोकू'],
      rainDelay: ['वर्षा विराम', 'बरखा मोड़'],
      moistureQuery: ['नमी', 'माटिक नमी'],
      phQuery: ['पीएच', 'माटिक पीएच']
    }
  },
  {
    code: 'ks',
    name: 'Kashmiri',
    nativeName: 'कॉशुर / كٲشُر',
    category: 'INDIAN_CONSTITUTION',
    bcp47: 'ks-IN',
    fallbackBcp47: 'ur-IN',
    region: 'Jammu & Kashmir',
    sampleGreeting: 'سلام! بَہ چھَس فلورا، تُہنٛز زراعت اے۔آئی مددگار۔ فصَلَن ہِنٛز نِگرٲنی تہٕ آبپاشی باپتھ تیار۔',
    voiceKeywords: {
      pumpOn: ['پمپ چالو', 'آب دیو', 'موٹر چالو'],
      pumpOff: ['پمپ بند', 'آب بند', 'موٹر بند'],
      emergencyStop: ['ہنگامی رُکاوٹ', 'جلدی روکو'],
      rainDelay: ['رُود تاخیر', 'بارش موڈ'],
      moistureQuery: ['نمی', 'زمینچ نمی'],
      phQuery: ['پی ایچ', 'مٹی پی ایچ']
    }
  },
  {
    code: 'ne',
    name: 'Nepali',
    nativeName: 'नेपाली',
    category: 'INDIAN_CONSTITUTION',
    bcp47: 'ne-NP',
    fallbackBcp47: 'hi-IN',
    region: 'Sikkim, West Bengal, Assam',
    sampleGreeting: 'नमस्ते! म फ्लोरा हुँ, तपाईंको कृषि एआई सहयोगी। बालीको हेरचाह र सिँचाइ नियन्त्रणका लागि तयार छु।',
    voiceKeywords: {
      pumpOn: ['पम्प चलाउनुहोस्', 'पानी लगाउनुहोस्', 'मोटर अन'],
      pumpOff: ['पम्प बन्द गर्नुहोस्', 'पानी रोक्नुहोस्'],
      emergencyStop: ['आपतकालीन बन्द', 'तुरुन्त रोक्नुहोस्'],
      rainDelay: ['पानी पर्ने ढिलाइ', 'वर्षा मोड'],
      moistureQuery: ['चिस्यान', 'माटोको चिस्यान'],
      phQuery: ['पीएच', 'माटोको पीएच']
    }
  },
  {
    code: 'kok',
    name: 'Konkani',
    nativeName: 'कोंकणी',
    category: 'INDIAN_CONSTITUTION',
    bcp47: 'kok-IN',
    fallbackBcp47: 'mr-IN',
    region: 'Goa, Karnataka, Maharashtra',
    sampleGreeting: 'नमस्कार! हांव फ्लोरा, तुमची शेती एआय सांगाती। पिकांची जतनाय आनी उदक पुरवण करूंक हांव तयार आसां।',
    voiceKeywords: {
      pumpOn: ['पंप चालू करात', 'उदक दियात', 'मोटर चालू'],
      pumpOff: ['पंप बंद करात', 'उदक रावायात'],
      emergencyStop: ['तातडीक बंद', 'आणीबाणी रोक'],
      rainDelay: ['पावस मोड', 'पावस आडोणी'],
      moistureQuery: ['ओलसाण', 'मातयेची ओलसाण'],
      phQuery: ['पीएच', 'माती सामू']
    }
  },
  {
    code: 'sd',
    name: 'Sindhi',
    nativeName: 'सिन्धी / سنڌي',
    category: 'INDIAN_CONSTITUTION',
    bcp47: 'sd-IN',
    fallbackBcp47: 'hi-IN',
    region: 'Gujarat, Maharashtra, Rajasthan',
    sampleGreeting: 'نمسڪار / اَسلام عليڪم! مان فلورا آهيان، توهان جي زراعت اي آءِ مددگار۔ فصل جي سنڀال ۽ پاڻي لاءِ تيار آهيان۔',
    voiceKeywords: {
      pumpOn: ['پمپ چالو', 'پاڻي ڏيو', 'موٽر چالو'],
      pumpOff: ['پمپ بند', 'پاڻي روڪيو'],
      emergencyStop: ['هنگامي روڪ', 'جلدي بند'],
      rainDelay: ['برسات موڊ', 'مينهن دير'],
      moistureQuery: ['نمي', 'زمين جي نمي'],
      phQuery: ['پي ايڇ', 'مٽي پي ايڇ']
    }
  },
  {
    code: 'doi',
    name: 'Dogri',
    nativeName: 'डोगरी',
    category: 'INDIAN_CONSTITUTION',
    bcp47: 'doi-IN',
    fallbackBcp47: 'hi-IN',
    region: 'Jammu & Kashmir, Himachal Pradesh',
    sampleGreeting: 'नमस्ते! मैं फ्लोरा आं, तुंदी खेती एआई मददगार। फसल दी देखभाल ते पानी लाग्ने लेई तैयार आं।',
    voiceKeywords: {
      pumpOn: ['पंप चलाओ', 'पानी लाओ', 'मोटर चलाओ'],
      pumpOff: ['पंप बंद करो', 'पानी रोको'],
      emergencyStop: ['तुरंत रोको', 'आपात रोक'],
      rainDelay: ['बरखा देरी', 'बरखा मोड़'],
      moistureQuery: ['नमी', 'मिट्टी दी नमी'],
      phQuery: ['पीएच', 'मिट्टी पीएच']
    }
  },
  {
    code: 'mni',
    name: 'Manipuri (Meitei)',
    nativeName: 'মৈতৈলোন্',
    category: 'INDIAN_CONSTITUTION',
    bcp47: 'mni-IN',
    fallbackBcp47: 'bn-IN',
    region: 'Manipur',
    sampleGreeting: 'খোৰুমজৰি! ঐহাক ফ্লোৰা কৌই, অদোমগী লৌউ-শিংউগী এআই মতেং পাংবীনি। পাম্বীশিংগী ঈথৈ-লৌথোই য়েংশিন্নবা শেম-শাদুনা লৈরে।',
    voiceKeywords: {
      pumpOn: ['পম্প হানগৎলু', 'ঈশিং থাদোকউ', 'পম্প অন'],
      pumpOff: ['পম্প থিংজিনখ্ৰু', 'ঈশিং লেপখ্ৰু'],
      emergencyStop: ['অকনবা লেপখ্ৰু', 'খুদক্তা লেপউ'],
      rainDelay: ['নোং চুবা লেপপা', 'নোং মোড'],
      moistureQuery: ['অশুবা', 'লৈবাক্কী অশুবা'],
      phQuery: ['পিএইচ', 'লৈবাক পিএইচ']
    }
  },
  {
    code: 'brx',
    name: 'Bodo',
    nativeName: 'बड़ो',
    category: 'INDIAN_CONSTITUTION',
    bcp47: 'brx-IN',
    fallbackBcp47: 'hi-IN',
    region: 'Bodoland / Assam',
    sampleGreeting: 'खुलुमबाय! आं फ्ल’रा, नोंथांनि आबाद एआई हेफाजाबगिरि। फसलनि नायदिं आरो दै होनायनि थाखाय आं थियारि।',
    voiceKeywords: {
      pumpOn: ['पम्प फोजों', 'दै हो', 'मटर अन'],
      pumpOff: ['पम्प फोजोब', 'दै बन्द'],
      emergencyStop: ['गोख्रों बन्द', 'थासिम थाद्दि'],
      rainDelay: ['अखा गाबनाय', 'अखा मड'],
      moistureQuery: ['सिदोबथि', 'हा सिदोबथि'],
      phQuery: ['पिइस', 'हा पिइस']
    }
  },
  {
    code: 'sat',
    name: 'Santali',
    nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ / संताली',
    category: 'INDIAN_CONSTITUTION',
    bcp47: 'sat-IN',
    fallbackBcp47: 'hi-IN',
    region: 'Jharkhand, Odisha, West Bengal',
    sampleGreeting: 'ᱡᱚᱦᱟᱨ! ᱤᱧ ᱫᱚ ᱯᱷᱞᱳᱨᱟ, ᱟᱯᱮᱭᱟᱜ ᱪᱟᱥ-ᱵᱟᱥ ᱮᱟᱭ ᱜᱚᱲᱚᱭᱤᱡ᱾ ᱫᱟᱜ ᱟᱨ ᱫᱟᱨᱮ-ᱱᱟᱹᱲᱤ ᱧᱮᱞ-ᱥᱟᱢᱴᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱥᱟᱯᱲᱟᱣ ᱢᱮᱱᱟᱹᱧᱟ᱾',
    voiceKeywords: {
      pumpOn: ['ᱯᱟᱢᱯ ᱪᱟᱹᱞᱩ', 'ᱫᱟᱜ ᱮᱢ', 'ᱢᱚᱴᱚᱨ ᱚᱱ'],
      pumpOff: ['ᱯᱟᱢᱯ ᱵᱚᱱᱫᱚ', 'ᱫᱟᱜ ᱵᱚᱱᱫᱚ'],
      emergencyStop: ['ᱞᱚᱜᱚᱱ ᱵᱚᱱᱫᱚ', 'ᱛᱷᱩᱠᱟᱹᱢ'],
      rainDelay: ['ᱫᱟᱜ ᱵᱤᱞᱚᱢ', 'ᱡᱟᱹᱯᱩᱫ ᱢᱳᱰ'],
      moistureQuery: ['ᱦᱟᱥᱟ ᱨᱮ ᱫᱟᱜ', 'ᱟᱨᱫᱨᱚᱛᱟ'],
      phQuery: ['ᱯᱤᱮᱪ', 'ᱦᱟᱥᱟ ᱜᱩᱱ']
    }
  },

  // ==========================================
  // MAJOR INTERNATIONAL / FOREIGN LANGUAGES
  // ==========================================
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    category: 'INTERNATIONAL',
    bcp47: 'en-US',
    region: 'Global / International Standard',
    sampleGreeting: "Hello! I'm Flora, your agricultural AI voice assistant. I am connected live to your sensors and ready for commands.",
    voiceKeywords: {
      pumpOn: ['turn on pump', 'start pump', 'water plant', 'turn on watering', 'pump on'],
      pumpOff: ['turn off pump', 'stop pump', 'stop watering', 'shut off pump', 'pump off'],
      emergencyStop: ['emergency stop', 'kill switch', 'halt everything', 'emergency shutoff'],
      rainDelay: ['rain delay', 'enable rain delay', 'pause for rain', 'rain pause'],
      moistureQuery: ['moisture', 'soil moisture', 'water level', 'how wet'],
      phQuery: ['ph', 'soil ph', 'acidity', 'alkalinity']
    }
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    category: 'INTERNATIONAL',
    bcp47: 'es-ES',
    region: 'Spain & Latin America',
    sampleGreeting: '¡Hola! Soy Flora, tu asistente agronómica por voz e inteligencia artificial. Lista para controlar el riego y tus sensores.',
    voiceKeywords: {
      pumpOn: ['encender bomba', 'activar riego', 'regar planta', 'prender bomba'],
      pumpOff: ['apagar bomba', 'detener riego', 'parar bomba'],
      emergencyStop: ['parada de emergencia', 'alto total', 'freno de emergencia'],
      rainDelay: ['retraso por lluvia', 'modo lluvia', 'pausa por lluvia'],
      moistureQuery: ['humedad', 'humedad del suelo', 'nivel de agua'],
      phQuery: ['ph', 'ph del suelo', 'acidez']
    }
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    category: 'INTERNATIONAL',
    bcp47: 'fr-FR',
    region: 'France, Canada, Francophonie',
    sampleGreeting: 'Bonjour ! Je suis Flora, votre assistante agricole intelligente. Je suis prête à surveiller vos cultures et gérer l’irrigation.',
    voiceKeywords: {
      pumpOn: ['allumer la pompe', 'activer irrigation', 'arroser', 'démarrer la pompe'],
      pumpOff: ['arrêter la pompe', 'stopper arrosage', 'éteindre la pompe'],
      emergencyStop: ['arrêt d urgence', 'coupure d urgence', 'stop absolu'],
      rainDelay: ['délai pluie', 'pause pluie', 'mode pluie'],
      moistureQuery: ['humidité', 'humidité du sol', 'niveau d eau'],
      phQuery: ['ph', 'ph du sol', 'acidité']
    }
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    category: 'INTERNATIONAL',
    bcp47: 'de-DE',
    region: 'Germany, Austria, Switzerland',
    sampleGreeting: 'Hallo! Ich bin Flora, Ihre KI-Assistentin für Präzisionslandwirtschaft. Bereit für Telemetrie und Bewässerungssteuerung.',
    voiceKeywords: {
      pumpOn: ['pumpe einschalten', 'bewässerung starten', 'pumpe an', 'gießen'],
      pumpOff: ['pumpe ausschalten', 'bewässerung stoppen', 'pumpe aus'],
      emergencyStop: ['notaus', 'notstopp', 'sofortiger halt'],
      rainDelay: ['regenverzögerung', 'regenpause', 'regenmodus'],
      moistureQuery: ['feuchtigkeit', 'bodenfeuchtigkeit', 'feuchte'],
      phQuery: ['ph wert', 'boden ph', 'säure']
    }
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    category: 'INTERNATIONAL',
    bcp47: 'pt-BR',
    region: 'Brazil & Portugal',
    sampleGreeting: 'Olá! Eu sou Flora, sua assistente agrícola com IA. Estou pronta para monitorar seus sensores e controlar a irrigação.',
    voiceKeywords: {
      pumpOn: ['ligar bomba', 'iniciar irrigação', 'regar planta', 'ativar bomba'],
      pumpOff: ['desligar bomba', 'parar irrigação', 'desativar bomba'],
      emergencyStop: ['parada de emergência', 'bloqueio imediato'],
      rainDelay: ['pausa de chuva', 'modo chuva', 'atraso por chuva'],
      moistureQuery: ['umidade', 'umidade do solo', 'nível de umidade'],
      phQuery: ['ph', 'ph do solo', 'acidez']
    }
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    category: 'INTERNATIONAL',
    bcp47: 'ru-RU',
    region: 'Eastern Europe & Central Asia',
    sampleGreeting: 'Здравствуйте! Я Флора, ваш голосовой ИИ-помощник по агрономии. Готова к контролю полива и анализу почвы.',
    voiceKeywords: {
      pumpOn: ['включить насос', 'начать полив', 'запустить насос'],
      pumpOff: ['выключить насос', 'остановить полив', 'стоп насос'],
      emergencyStop: ['аварийная остановка', 'экстренный стоп'],
      rainDelay: ['задержка из-за дождя', 'пауза дождь'],
      moistureQuery: ['влажность', 'влажность почвы'],
      phQuery: ['кислотность', 'рн почвы', 'рн']
    }
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    category: 'INTERNATIONAL',
    bcp47: 'ar-SA',
    region: 'Middle East & North Africa',
    sampleGreeting: 'مرحباً! أنا فلورا، مساعدتكم الزراعية الذكية بالصوت والذكاء الاصطناعي. جاهزة لمراقبة المحصول والتحكم في الري.',
    voiceKeywords: {
      pumpOn: ['تشغيل المضخة', 'ابدأ الري', 'سقي النبات', 'شغل المضخة'],
      pumpOff: ['إيقاف المضخة', 'أوقف الري', 'اطفئ المضخة'],
      emergencyStop: ['توقف طارئ', 'إيقاف اضطراري'],
      rainDelay: ['تأجيل المطر', 'وضع المطر'],
      moistureQuery: ['رطوبة', 'رطوبة التربة'],
      phQuery: ['حموضة', 'درجة الحموضة', 'بي اتش']
    }
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    category: 'INTERNATIONAL',
    bcp47: 'ja-JP',
    region: 'Japan',
    sampleGreeting: 'こんにちは！私は植物AIアシスタントのフローラです。センサー監視と自動灌漑の準備が整いました。',
    voiceKeywords: {
      pumpOn: ['ポンプをつけて', '給水開始', '水やりして', 'ポンプ起動'],
      pumpOff: ['ポンプを止めて', '給水停止', '水やり停止'],
      emergencyStop: ['緊急停止', 'エマージェンシーストップ'],
      rainDelay: ['雨天待機', '雨モード', 'レインディレイ'],
      moistureQuery: ['水分量', '土壌水分', '湿度は'],
      phQuery: ['ペーハー', 'ph', '土壌ph']
    }
  },
  {
    code: 'zh',
    name: 'Chinese (Simplified)',
    nativeName: '简体中文',
    category: 'INTERNATIONAL',
    bcp47: 'zh-CN',
    region: 'China & Global Mandarin',
    sampleGreeting: '你好！我是农业AI语音助手 Flora。我已实时连接您的土壤传感器，随时准备执行灌溉指令。',
    voiceKeywords: {
      pumpOn: ['打开水泵', '开始浇水', '启动水泵', '灌溉'],
      pumpOff: ['关闭水泵', '停止浇水', '关闭灌溉'],
      emergencyStop: ['紧急停止', '急停'],
      rainDelay: ['雨天延迟', '下雨暂停'],
      moistureQuery: ['土壤湿度', '湿度多少', '水分'],
      phQuery: ['酸碱度', 'ph值', '土壤ph']
    }
  },
  {
    code: 'zh-TW',
    name: 'Chinese (Traditional)',
    nativeName: '繁體中文',
    category: 'INTERNATIONAL',
    bcp47: 'zh-TW',
    region: 'Taiwan & Hong Kong',
    sampleGreeting: '您好！我是農業AI語音助手 Flora。我已實時連線您的土壤感測器，隨時準備執行灌溉指令。',
    voiceKeywords: {
      pumpOn: ['開啟水泵', '開始澆水', '啟動水泵'],
      pumpOff: ['關閉水泵', '停止澆水'],
      emergencyStop: ['緊急停止', '急停'],
      rainDelay: ['雨天延遲', '雨天暫停'],
      moistureQuery: ['土壤濕度', '水分多少'],
      phQuery: ['酸鹼度', 'ph值']
    }
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    category: 'INTERNATIONAL',
    bcp47: 'ko-KR',
    region: 'South Korea',
    sampleGreeting: '안녕하세요! 저는 농업 AI 음성 어시스턴트 플로라(Flora)입니다. 센서 모니터링과 급수 제어를 시작할 준비가 되었습니다.',
    voiceKeywords: {
      pumpOn: ['펌프 켜줘', '물 줘', '관수 시작', '펌프 가동'],
      pumpOff: ['펌프 꺼줘', '물 멈춰', '관수 정지'],
      emergencyStop: ['비상 정지', '즉시 중단'],
      rainDelay: ['우천 지연', '비 모드'],
      moistureQuery: ['토양 수분', '수분량', '습도'],
      phQuery: ['산도', 'ph', '토양 산도']
    }
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    category: 'INTERNATIONAL',
    bcp47: 'it-IT',
    region: 'Italy & Southern Europe',
    sampleGreeting: 'Ciao! Sono Flora, la tua assistente vocale agricola intelligente. Sono pronta a monitorare i sensori e gestire l’irrigazione.',
    voiceKeywords: {
      pumpOn: ['accendi pompa', 'avvia irrigazione', 'annaffia pianta'],
      pumpOff: ['spegni pompa', 'ferma irrigazione', 'arresta pompa'],
      emergencyStop: ['arresto di emergenza', 'stop totale'],
      rainDelay: ['ritardo pioggia', 'pausa pioggia', 'modalità pioggia'],
      moistureQuery: ['umidità', 'umidità del suolo', 'livello acqua'],
      phQuery: ['ph', 'ph del suolo', 'acidità']
    }
  },
  {
    code: 'id',
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    category: 'INTERNATIONAL',
    bcp47: 'id-ID',
    region: 'Indonesia & Southeast Asia',
    sampleGreeting: 'Halo! Saya Flora, asisten AI pertanian Anda. Saya siap memantau kelembapan tanah dan mengontrol pompa irigasi Anda.',
    voiceKeywords: {
      pumpOn: ['nyalakan pompa', 'siram tanaman', 'hidupkan pompa'],
      pumpOff: ['matikan pompa', 'hentikan siram', 'stop pompa'],
      emergencyStop: ['berhenti darurat', 'stop darurat'],
      rainDelay: ['tunda hujan', 'mode hujan'],
      moistureQuery: ['kelembapan', 'kelembapan tanah'],
      phQuery: ['ph', 'ph tanah', 'keasaman']
    }
  },
  {
    code: 'sw',
    name: 'Swahili',
    nativeName: 'Kiswahili',
    category: 'INTERNATIONAL',
    bcp47: 'sw-KE',
    region: 'East Africa (Kenya, Tanzania, Uganda)',
    sampleGreeting: 'Hujambo! Mimi ni Flora, msaidizi wako wa kilimo cha kidijitali. Nipo tayari kusaidia umwagiliaji na udongo wako.',
    voiceKeywords: {
      pumpOn: ['washa pampu', 'mwagilia mimea', 'anza maji'],
      pumpOff: ['zima pampu', 'simamisha maji'],
      emergencyStop: ['simamisha dharura', 'kusimamisha mara moja'],
      rainDelay: ['chelewesha mvua', 'hali ya mvua'],
      moistureQuery: ['unyevu', 'unyevu wa udongo'],
      phQuery: ['kiwango cha ph', 'ph ya udongo']
    }
  },
  {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    category: 'INTERNATIONAL',
    bcp47: 'tr-TR',
    region: 'Turkey & Eurasia',
    sampleGreeting: 'Merhaba! Ben Flora, tarım yapay zeka sesli asistanınızım. Sensör verilerinizi takip etmeye ve sulamayı kontrol etmeye hazırım.',
    voiceKeywords: {
      pumpOn: ['pompayı aç', 'sulama başlat', 'su ver'],
      pumpOff: ['pompayı kapat', 'sulamayı durdur'],
      emergencyStop: ['acil durdurma', 'acil stop'],
      rainDelay: ['yağmur gecikmesi', 'yağmur modu'],
      moistureQuery: ['nem', 'toprak nemi', 'nem oranı'],
      phQuery: ['ph', 'toprak ph', 'asitlik']
    }
  },
  {
    code: 'nl',
    name: 'Dutch',
    nativeName: 'Nederlands',
    category: 'INTERNATIONAL',
    bcp47: 'nl-NL',
    region: 'Netherlands & Belgium',
    sampleGreeting: 'Hallo! Ik ben Flora, je slimme agrarische AI-assistent. Klaar om je bodemsensoren uit te lezen en irrigatie te regelen.',
    voiceKeywords: {
      pumpOn: ['pomp aanzetten', 'start bewatering', 'pomp aan'],
      pumpOff: ['pomp uitzetten', 'stop bewatering', 'pomp uit'],
      emergencyStop: ['noodstop', 'direct stoppen'],
      rainDelay: ['regenvertraging', 'regenpauze'],
      moistureQuery: ['vochtigheid', 'bodemvocht'],
      phQuery: ['ph waarde', 'bodem ph']
    }
  },
  {
    code: 'vi',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    category: 'INTERNATIONAL',
    bcp47: 'vi-VN',
    region: 'Vietnam',
    sampleGreeting: 'Xin chào! Tôi là Flora, trợ lý AI nông nghiệp của bạn. Tôi sẵn sàng theo dõi cảm biến và điều khiển tưới tiêu cho cây trồng.',
    voiceKeywords: {
      pumpOn: ['bật máy bơm', 'tưới cây', 'mở nước'],
      pumpOff: ['tắt máy bơm', 'dừng tưới', 'khóa nước'],
      emergencyStop: ['dừng khẩn cấp', 'ngắt khẩn cấp'],
      rainDelay: ['hoãn do mưa', 'chế độ mưa'],
      moistureQuery: ['độ ẩm', 'độ ẩm đất'],
      phQuery: ['độ ph', 'ph đất']
    }
  },
  {
    code: 'th',
    name: 'Thai',
    nativeName: 'ภาษาไทย',
    category: 'INTERNATIONAL',
    bcp47: 'th-TH',
    region: 'Thailand',
    sampleGreeting: 'สวัสดีค่ะ! ฉันคือฟลอร่า ผู้ช่วย AI ด้านการเกษตรของคุณ พร้อมดูแลความชื้นในดินและควบคุมระบบรดน้ำแล้วค่ะ',
    voiceKeywords: {
      pumpOn: ['เปิดปั๊มน้ำ', 'รดน้ำต้นไม้', 'เริ่มรดน้ำ'],
      pumpOff: ['ปิดปั๊มน้ำ', 'หยุดรดน้ำ'],
      emergencyStop: ['หยุดฉุกเฉิน', 'ปิดทันที'],
      rainDelay: ['หน่วงเวลารอฝน', 'โหมดฝนตก'],
      moistureQuery: ['ความชื้น', 'ความชื้นในดิน'],
      phQuery: ['ค่าพีเอช', 'ค่า ph ในดิน']
    }
  }
];

// Helper to look up language definition by code
export function getLanguage(code: string): LanguageDefinition {
  const found = LANGUAGES.find((l) => l.code === code);
  return found || LANGUAGES[22]; // Default to English (code: 'en')
}

// Core UI translation keys for multiple languages
export const UI_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    dashboard: 'Dashboard',
    plants: 'Plants',
    irrigation: 'Irrigation',
    iotLab: 'IoT Lab',
    analytics: 'Analytics',
    advisor: 'Advisor',
    settings: 'Settings',
    founders: 'Founders',
    soilMoisture: 'Soil Moisture',
    temperature: 'Temperature',
    humidity: 'Air Humidity',
    soilPh: 'Soil pH',
    soilEc: 'Electrical Conductivity (EC)',
    npkNutrients: 'NPK Nutrients',
    pumpOn: 'Turn ON Pump',
    pumpOff: 'Turn OFF Pump',
    emergencyStop: 'Emergency Stop',
    rainDelay: 'Smart Rain Delay',
    statusOnline: 'Online',
    statusOffline: 'Offline',
    languageSection: 'Language & Regional Localization',
    tagline: 'Grow Smarter, Live Greener.'
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    plants: 'फसलें व पौधे',
    irrigation: 'सिंचाई नियंत्रण',
    iotLab: 'आईओटी लैब',
    analytics: 'एनालिटिक्स व ग्राफ',
    advisor: 'एआई सलाहकार',
    settings: 'सेटिंग्स',
    founders: 'संस्थापक गण',
    soilMoisture: 'मिट्टी की नमी',
    temperature: 'तापमान',
    humidity: 'हवा की आर्द्रता',
    soilPh: 'मिट्टी का पीएच',
    soilEc: 'विद्युत चालकता (EC)',
    npkNutrients: 'एनपीके पोषक तत्व',
    pumpOn: 'पंप चालू करें',
    pumpOff: 'पंप बंद करें',
    emergencyStop: 'आपातकालीन रोक',
    rainDelay: 'वर्षा विराम मोड',
    statusOnline: 'ऑनलाइन',
    statusOffline: 'ऑफलाइन',
    languageSection: 'भाषा और क्षेत्रीय चयन',
    tagline: 'समझदारी से उगाएं, हरियाली फैलाएं।'
  },
  bn: {
    dashboard: 'ড্যাশবোর্ড',
    plants: 'গাছপালা ও ফসল',
    irrigation: 'সেচ নিয়ন্ত্রণ',
    iotLab: 'আইওটি ল্যাব',
    analytics: 'বিশ্লেষণ ও গ্রাফ',
    advisor: 'এআই উপদেষ্টা',
    settings: 'সেটিংস',
    founders: 'প্রতিষ্ঠাতাবৃন্দ',
    soilMoisture: 'মাটির আর্দ্রতা',
    temperature: 'তাপমাত্রা',
    humidity: 'বাতাসের আর্দ্রতা',
    soilPh: 'মাটির পিএইচ',
    soilEc: 'তড়িৎ পরিবাহিতা (EC)',
    npkNutrients: 'এনপিকে পুষ্টি উপাদান',
    pumpOn: 'পাম্প চালু করুন',
    pumpOff: 'পাম্প বন্ধ করুন',
    emergencyStop: 'জরুরী স্টপ',
    rainDelay: 'বৃষ্টি বিলম্ব মোড',
    statusOnline: 'অনলাইন',
    statusOffline: 'অফলাইন',
    languageSection: 'ভাষা ও আঞ্চলিক নির্বাচন',
    tagline: 'বুদ্ধিদীপ্ত চাষ, সবুজ প্রকাশ।'
  },
  te: {
    dashboard: 'డ్యాష్‌బోర్డ్',
    plants: 'మొక్కలు & పంటలు',
    irrigation: 'నీటిపారుదల నియంత్రణ',
    iotLab: 'ఐఓటీ ల్యాబ్',
    analytics: 'విశ్లేషణలు',
    advisor: 'ఏఐ సలహాదారు',
    settings: 'సెట్టింగ్‌లు',
    founders: 'వ్యవస్థాపకులు',
    soilMoisture: 'నేల తేమ',
    temperature: 'ఉష్ణోగ్రత',
    humidity: 'గాలి తేమ',
    soilPh: 'నేల పిహెచ్',
    soilEc: 'విద్యుత్ వాహకత (EC)',
    npkNutrients: 'NPK పోషకాలు',
    pumpOn: 'పంప్ ఆన్ చేయండి',
    pumpOff: 'పంప్ ఆఫ్ చేయండి',
    emergencyStop: 'అత్యవసర ఆపు',
    rainDelay: 'వర్షం విరామం',
    statusOnline: 'ఆన్‌లైన్',
    statusOffline: 'ఆఫ్‌లైన్',
    languageSection: 'భాష మరియు ప్రాంతీయ ఎంపిక',
    tagline: 'స్మార్ట్‌గా సాగు చేయండి, పచ్చగా జీవించండి.'
  },
  ta: {
    dashboard: 'டாஷ்போர்டு',
    plants: 'செடிகள் & பயிர்கள்',
    irrigation: 'பாசனக் கட்டுப்பாடு',
    iotLab: 'ஐஓடி ஆய்வகம்',
    analytics: 'பகுப்பாய்வு',
    advisor: 'ஏஐ ஆலோசகர்',
    settings: 'அமைப்புகள்',
    founders: 'நிறுவனர்கள்',
    soilMoisture: 'மண் ஈரப்பதம்',
    temperature: 'வெப்பநிலை',
    humidity: 'காற்று ஈரப்பதம்',
    soilPh: 'மண் காரத்தன்மை (pH)',
    soilEc: 'மின்கடத்துதிறன் (EC)',
    npkNutrients: 'NPK சத்துக்கள்',
    pumpOn: 'பம்பை இயக்கவும்',
    pumpOff: 'பம்பை நிறுத்தவும்',
    emergencyStop: 'அவசர நிறுத்தம்',
    rainDelay: 'மழை தாமதம்',
    statusOnline: 'ஆன்லைன்',
    statusOffline: 'ஆஃப்லைன்',
    languageSection: 'மொழி மற்றும் பிராந்திய தேர்வு',
    tagline: 'புத்திசாலியாக வளருங்கள், பசுமையாக வாழுங்கள்.'
  },
  es: {
    dashboard: 'Panel de Control',
    plants: 'Plantas y Cultivos',
    irrigation: 'Control de Riego',
    iotLab: 'Laboratorio IoT',
    analytics: 'Analítica y Gráficos',
    advisor: 'Asesor IA',
    settings: 'Ajustes',
    founders: 'Fundadores',
    soilMoisture: 'Humedad del Suelo',
    temperature: 'Temperatura',
    humidity: 'Humedad del Aire',
    soilPh: 'pH del Suelo',
    soilEc: 'Conductividad Eléctrica (EC)',
    npkNutrients: 'Nutrientes NPK',
    pumpOn: 'Encender Bomba',
    pumpOff: 'Apagar Bomba',
    emergencyStop: 'Parada de Emergencia',
    rainDelay: 'Pausa Inteligente por Lluvia',
    statusOnline: 'En línea',
    statusOffline: 'Desconectado',
    languageSection: 'Idioma y Localización Regional',
    tagline: 'Cultiva con Inteligencia, Vive con Más Verde.'
  },
  fr: {
    dashboard: 'Tableau de Bord',
    plants: 'Plantes & Cultures',
    irrigation: 'Gestion d’Irrigation',
    iotLab: 'Labo IoT',
    analytics: 'Analyses & Graphiques',
    advisor: 'Conseiller IA',
    settings: 'Paramètres',
    founders: 'Fondateurs',
    soilMoisture: 'Humidité du Sol',
    temperature: 'Température',
    humidity: 'Humidité de l’Air',
    soilPh: 'pH du Sol',
    soilEc: 'Conductivité Électrique (EC)',
    npkNutrients: 'Nutriments NPK',
    pumpOn: 'Allumer la Pompe',
    pumpOff: 'Éteindre la Pompe',
    emergencyStop: 'Arrêt d’Urgence',
    rainDelay: 'Délai Pluie Intelligent',
    statusOnline: 'En ligne',
    statusOffline: 'Hors ligne',
    languageSection: 'Langue et Régionalisation',
    tagline: 'Cultivez Plus Intelligemment, Vivez Plus Vert.'
  }
};

export function translateUI(key: string, langCode: string): string {
  const dict = UI_TRANSLATIONS[langCode] || UI_TRANSLATIONS['en'];
  return dict[key] || UI_TRANSLATIONS['en'][key] || key;
}
