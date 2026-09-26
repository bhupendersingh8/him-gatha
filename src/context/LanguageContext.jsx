/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from 'react';

const translations = {
  en: {
    home: "Home",
    explore: "Sacred Atlas",
    sacred_atlas: "Sacred Atlas",
    deity_archive: "Deity Archive",
    dev_melas: "Dev-Melas",
    contribute: "Contribute",
    admin_dashboard: "Dashboard",
    admin_portal: "Admin Portal",
    search_placeholder: "Search deities, lore, or districts...",
    sacred_lore: "Sacred Lore",
    admin_framework: "Admin Framework",
    dev_yatra_guide: "Dev-Yatra Guide",
    view_lore: "View Sacred Lore",
    view_associated_deity: "View Associated Deity",
    filter_by_district: "Filter by District",
    
    // Home Page & Custom Grid
    sacred_topography: "Sacred Topography",
    himachal_atlas: "Himachal Atlas",
    atlas_description: "Click on any of the 12 districts below to instantly filter the Dev-Sanskriti database and explore local deities, pilgrimages, and lore.",
    
    // Contribution Form
    contribute_title: "Contribute to the Archive",
    contribute_desc: "Help us document the living Dev-Sanskriti of Himachal Pradesh. Submit details of local deities, lore, and verified village coordinates.",
    deity_name: "Deity Name",
    district_region: "District / Region",
    village_location: "Village / Valley Location",
    latitude: "Latitude (Himachal Bounds)",
    longitude: "Longitude (Himachal Bounds)",
    your_name: "Your Name",
    email_address: "Email Address",
    lore_details: "Sacred Lore & Ritual Details",
    upload_visuals: "Upload Visual Materials",
    choose_files: "Choose files",
    submit_entry: "Submit Entry",
    
    // Dev-Mela Calendar
    calendar_title: "Dev-Mela Calendar",
    calendar_desc: "A chronological guide to the sacred Jatars, festivals, and divine processions across Himachal Pradesh.",
    search_festivals: "Search festivals or locations...",
    no_events: "No sacred events found matching your search.",
    no_deities_found: "No sacred deity records found matching your criteria.",
    view_all_festivals: "View Full Dev-Mela Calendar",
    heritage_spotlight: "Heritage Shrines Spotlight",
    traditional_governance: "Living Dev-Sanskriti Governance",
    living_governance_desc: "The sacred heritage of Himachal Pradesh is preserved through centuries-old hereditary community institutions and vernacular craftsmanship.",
    
    // Deity Details
    sacred_lineages: "Sacred Lineages",
    mythology_history: "Mythology & History",
    traditional_admin: "Traditional Administration",
    pilgrimage_info: "Pilgrimage Information",
    how_to_reach: "How to Reach",
    by_air: "By Air",
    by_train: "By Train",
    by_road: "By Road",
    sacred_trek: "Sacred Trek",
    back_to_archive: "Back to Archive",
    retrieving_records: "Retrieving sacred records...",
    sacred_chant: "Sacred Chant / Audio",
    kathkuni_architecture: "Traditional Kath-Kuni Architecture",
    analyze_layout: "Analyze 3D Layout",
    current_gur: "Current Gur (Oracle)",
    current_kardar: "Current Kardar (Manager)",
    record_unavailable: "Record unavailable",
    lineage_not_found: "No direct recorded lineage connections or rivalries found in the archive for this entity.",
    lineage_update_note: "Relationships are continually being updated by traditional Kardars.",
    
    // Heritage wording replacements
    submit_oral_history: "Submit Oral History",
    registry_contributions: "Registry Contributions",
    accuracy_score: "Accuracy Score",
    contribute_record: "Contribute Record",
    data_completeness: "Data Completeness"
  },
  hi: {
    home: "मुख्य पृष्ठ",
    explore: "पवित्र एटलस",
    sacred_atlas: "पवित्र एटलस",
    deity_archive: "देवता संग्रह",
    dev_melas: "देव-मेले",
    contribute: "योगदान करें",
    admin_dashboard: "डैशबोर्ड",
    admin_portal: "प्रशासक पोर्टल",
    search_placeholder: "देवता, परंपरा या जिला खोजें...",
    sacred_lore: "पवित्र कथा",
    admin_framework: "प्रशासनिक ढांचा",
    dev_yatra_guide: "देव-यात्रा मार्गदर्शिका",
    view_lore: "पवित्र कथा देखें",
    view_associated_deity: "संबंधित देवता देखें",
    filter_by_district: "जिला अनुसार छाँटें",
    
    // Home Page & Custom Grid
    sacred_topography: "पवित्र स्थलाकृति",
    himachal_atlas: "हिमाचल एटलस",
    atlas_description: "देव-संस्कृति डेटाबेस को तुरंत फ़िल्टर करने और स्थानीय देवताओं, तीर्थयात्राओं और लोक कथाओं का पता लगाने के लिए नीचे दिए गए 12 जिलों में से किसी पर भी क्लिक करें।",
    
    // Contribution Form
    contribute_title: "अभिलेखागार में योगदान करें",
    contribute_desc: "हिमाचल प्रदेश की जीवंत देव-संस्कृति को प्रलेखित करने में हमारी सहायता करें। स्थानीय देवताओं, लोक कथाओं और सत्यापित गांव के निर्देशांकों का विवरण जमा करें।",
    deity_name: "देवता का नाम",
    district_region: "जिला / क्षेत्र",
    village_location: "गांव / घाटी का स्थान",
    latitude: "अक्षांश (हिमाचल सीमा)",
    longitude: "रेखांश (हिमाचल सीमा)",
    your_name: "आपका नाम",
    email_address: "ईमेल पता",
    lore_details: "पवित्र लोककथा और अनुष्ठान विवरण",
    upload_visuals: "दृश्य सामग्री अपलोड करें",
    choose_files: "फाइलें चुनें",
    submit_entry: "प्रविष्टि जमा करें",
    
    // Dev-Mela Calendar
    calendar_title: "देव-मेला कैलेंडर",
    calendar_desc: "हिमाचल प्रदेश में पवित्र जातरों, त्योहारों और दिव्य जुलूसों का एक कालानुक्रमिक विवरण।",
    search_festivals: "त्योहारों या स्थानों की खोज करें...",
    no_events: "आपकी खोज से मेल खाता कोई पवित्र कार्यक्रम नहीं मिला।",
    no_deities_found: "आपकी खोज मानदंड से मेल खाता कोई देवता रिकॉर्ड नहीं मिला।",
    view_all_festivals: "संपूर्ण देव-मेला कैलेंडर देखें",
    heritage_spotlight: "प्रमुख देव स्थल",
    traditional_governance: "जीवंत देव-संस्कृति प्रशासनिक ढांचा",
    living_governance_desc: "हिमाचल प्रदेश की पवित्र धरोहर सदियों पुरानी पारंपरिक संस्थाओं और काठ-कुणी स्थापत्य कला द्वारा संरक्षित है।",
    
    // Deity Details
    sacred_lineages: "देव-वंशावली",
    mythology_history: "पौराणिक कथा और इतिहास",
    traditional_admin: "पारंपरिक प्रशासन",
    pilgrimage_info: "तीर्थयात्रा सूचना",
    how_to_reach: "कैसे पहुँचें",
    by_air: "हवाई मार्ग से",
    by_train: "रेल मार्ग से",
    by_road: "सड़क मार्ग से",
    sacred_trek: "पवित्र ट्रेक",
    back_to_archive: "संग्रह पर वापस जाएँ",
    retrieving_records: "पवित्र रिकॉर्ड प्राप्त किए जा रहे हैं...",
    sacred_chant: "पवित्र भजन / ऑडियो",
    kathkuni_architecture: "पारंपरिक काठ-कुणी वास्तुकला",
    analyze_layout: "3D लेआउट का विश्लेषण करें",
    current_gur: "वर्तमान गूर (देव-वाणी)",
    current_kardar: "वर्तमान कारदार (प्रबंधक)",
    record_unavailable: "रिकॉर्ड अनुपलब्ध",
    lineage_not_found: "इस इकाई के लिए संग्रह में कोई सीधा दर्ज वंशावली संबंध या प्रतिद्वंद्विता नहीं मिली।",
    lineage_update_note: "पारंपरिक कारदारों द्वारा संबंधों को लगातार अपडेट किया जा रहा है।",
    
    // Heritage wording replacements
    submit_oral_history: "मौखिक इतिहास जमा करें",
    registry_contributions: "पंजीकरण योगदान",
    accuracy_score: "सटीकता स्कोर",
    contribute_record: "प्रविष्टि योगदान",
    data_completeness: "डेटा पूर्णता"
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('himgatha_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('himgatha_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'hi' : 'en');
  };

  const t = (key) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);
