import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ======================================================
// API
// ======================================================

const API_URL = "https://jbackend-h963.onrender.com";

// ======================================================
// INDIA STATES + DISTRICTS
// ======================================================

const INDIA_LOCATIONS = {
  "Andhra Pradesh": [
    "Alluri Sitharama Raju",
    "Anakapalli",
    "Anantapur",
    "Annamayya",
    "Bapatla",
    "Chittoor",
    "Dr. B.R. Ambedkar Konaseema",
    "East Godavari",
    "Eluru",
    "Guntur",
    "Kakinada",
    "Krishna",
    "Kurnool",
    "Nandyal",
    "NTR",
    "Palnadu",
    "Parvathipuram Manyam",
    "Prakasam",
    "Srikakulam",
    "Sri Potti Sriramulu Nellore",
    "Sri Sathya Sai",
    "Tirupati",
    "Visakhapatnam",
    "Vizianagaram",
    "West Godavari",
    "YSR Kadapa",
  ],

  "Arunachal Pradesh": [
    "Anjaw",
    "Bichom",
    "Changlang",
    "Dibang Valley",
    "East Kameng",
    "East Siang",
    "Itanagar Capital Complex",
    "Kamle",
    "Keyi Panyor",
    "Kra Daadi",
    "Kurung Kumey",
    "Lepa Rada",
    "Lohit",
    "Longding",
    "Lower Dibang Valley",
    "Lower Siang",
    "Lower Subansiri",
    "Namsai",
    "Pakke Kessang",
    "Papum Pare",
    "Shi Yomi",
    "Siang",
    "Tawang",
    "Tirap",
    "Upper Siang",
    "Upper Subansiri",
    "West Kameng",
    "West Siang",
  ],

  Assam: [
    "Baksa",
    "Bajali",
    "Barpeta",
    "Biswanath",
    "Bongaigaon",
    "Cachar",
    "Charaideo",
    "Chirang",
    "Darrang",
    "Dhemaji",
    "Dhubri",
    "Dibrugarh",
    "Dima Hasao",
    "Goalpara",
    "Golaghat",
    "Hailakandi",
    "Hojai",
    "Jorhat",
    "Kamrup",
    "Kamrup Metropolitan",
    "Karbi Anglong",
    "Karimganj",
    "Kokrajhar",
    "Lakhimpur",
    "Majuli",
    "Morigaon",
    "Nagaon",
    "Nalbari",
    "Sivasagar",
    "Sonitpur",
    "South Salmara-Mankachar",
    "Tamulpur",
    "Tinsukia",
    "Udalguri",
    "West Karbi Anglong",
  ],

  Bihar: [
    "Araria",
    "Arwal",
    "Aurangabad",
    "Banka",
    "Begusarai",
    "Bhagalpur",
    "Bhojpur",
    "Buxar",
    "Darbhanga",
    "East Champaran",
    "Gaya",
    "Gopalganj",
    "Jamui",
    "Jehanabad",
    "Kaimur",
    "Katihar",
    "Khagaria",
    "Kishanganj",
    "Lakhisarai",
    "Madhepura",
    "Madhubani",
    "Munger",
    "Muzaffarpur",
    "Nalanda",
    "Nawada",
    "Patna",
    "Purnia",
    "Rohtas",
    "Saharsa",
    "Samastipur",
    "Saran",
    "Sheikhpura",
    "Sheohar",
    "Sitamarhi",
    "Siwan",
    "Supaul",
    "Vaishali",
    "West Champaran",
  ],

  Chhattisgarh: [
    "Balod",
    "Baloda Bazar",
    "Balrampur",
    "Bastar",
    "Bemetara",
    "Bijapur",
    "Bilaspur",
    "Dantewada",
    "Dhamtari",
    "Durg",
    "Gariaband",
    "Gaurela Pendra Marwahi",
    "Janjgir Champa",
    "Jashpur",
    "Kabirdham",
    "Kanker",
    "Khairagarh Chhuikhadan Gandai",
    "Kondagaon",
    "Korba",
    "Koriya",
    "Mahasamund",
    "Manendragarh Chirmiri Bharatpur",
    "Mohla Manpur Ambagarh Chowki",
    "Mungeli",
    "Narayanpur",
    "Raigarh",
    "Raipur",
    "Rajnandgaon",
    "Sakti",
    "Sarangarh Bilaigarh",
    "Sukma",
    "Surajpur",
    "Surguja",
  ],

  Goa: [
    "North Goa",
    "South Goa",
  ],

  Gujarat: [
    "Ahmedabad",
    "Amreli",
    "Anand",
    "Aravalli",
    "Banaskantha",
    "Bharuch",
    "Bhavnagar",
    "Botad",
    "Chhota Udaipur",
    "Dahod",
    "Dang",
    "Devbhumi Dwarka",
    "Gandhinagar",
    "Gir Somnath",
    "Jamnagar",
    "Junagadh",
    "Kheda",
    "Kutch",
    "Mahisagar",
    "Mehsana",
    "Morbi",
    "Narmada",
    "Navsari",
    
    "Panchmahal",
    "Patan",
    "Porbandar",
    "Rajkot",
    "Sabarkantha",
    "Surat",
    "Surendranagar",
    "Tapi",
    "Vadodara",
    "Valsad",
  ],

  Haryana: [
    "Ambala",
    "Bhiwani",
    "Charkhi Dadri",
    "Faridabad",
    "Fatehabad",
    "Gurugram",
    "Hisar",
    "Jhajjar",
    "Jind",
    "Kaithal",
    "Karnal",
    "Kurukshetra",
    "Mahendragarh",
    "Nuh",
    "Palwal",
    "Panchkula",
    "Panipat",
    "Rewari",
    "Rohtak",
    "Sirsa",
    "Sonipat",
    "Yamunanagar",
  ],

  "Himachal Pradesh": [
    "Bilaspur",
    "Chamba",
    "Hamirpur",
    "Kangra",
    "Kinnaur",
    "Kullu",
    "Lahaul and Spiti",
    "Mandi",
    "Shimla",
    "Sirmaur",
    "Solan",
    "Una",
  ],

  Jharkhand: [
    "Bokaro",
    "Chatra",
    "Deoghar",
    "Dhanbad",
    "Dumka",
    "East Singhbhum",
    "Garhwa",
    "Giridih",
    "Godda",
    "Gumla",
    "Hazaribagh",
    "Jamtara",
    "Khunti",
    "Koderma",
    "Latehar",
    "Lohardaga",
    "Pakur",
    "Palamu",
    "Ramgarh",
    "Ranchi",
    "Sahebganj",
    "Seraikela Kharsawan",
    "Simdega",
    "West Singhbhum",
  ],

  Karnataka: [
    "Bagalkot",
    "Ballari",
    "Belagavi",
    "Bengaluru Rural",
    "Bengaluru Urban",
    "Bidar",
    "Chamarajanagar",
    "Chikkaballapur",
    "Chikkamagaluru",
    "Chitradurga",
    "Dakshina Kannada",
    "Davanagere",
    "Dharwad",
    "Gadag",
    "Hassan",
    "Haveri",
    "Kalaburagi",
    "Kodagu",
    "Kolar",
    "Koppal",
    "Mandya",
    "Mysuru",
    "Raichur",
    "Ramanagara",
    "Shivamogga",
    "Tumakuru",
    "Udupi",
    "Uttara Kannada",
    "Vijayapura",
    "Vijayanagara",
    "Yadgir",
  ],

  Kerala: [
    "Alappuzha",
    "Ernakulam",
    "Idukki",
    "Kannur",
    "Kasaragod",
    "Kollam",
    "Kottayam",
    "Kozhikode",
    "Malappuram",
    "Palakkad",
    "Pathanamthitta",
    "Thiruvananthapuram",
    "Thrissur",
    "Wayanad",
  ],

  "Madhya Pradesh": [
    "Agar Malwa",
    "Alirajpur",
    "Anuppur",
    "Ashoknagar",
    "Balaghat",
    "Barwani",
    "Betul",
    "Bhind",
    "Bhopal",
    "Burhanpur",
    "Chhatarpur",
    "Chhindwara",
    "Damoh",
    "Datia",
    "Dewas",
    "Dhar",
    "Dindori",
    "Guna",
    "Gwalior",
    "Harda",
    "Indore",
    "Jabalpur",
    "Jhabua",
    "Katni",
    "Khandwa",
    "Khargone",
    "Maihar",
    "Mandla",
    "Mandsaur",
    "Mauganj",
    "Morena",
    "Narmadapuram",
    "Narsinghpur",
    "Neemuch",
    "Panna",
    "Raisen",
    "Rajgarh",
    "Ratlam",
    "Rewa",
    "Sagar",
    "Satna",
    "Sehore",
    "Seoni",
    "Shahdol",
    "Shajapur",
    "Sheopur",
    "Shivpuri",
    "Sidhi",
    "Singrauli",
    "Tikamgarh",
    "Ujjain",
    "Umaria",
    "Vidisha",
  ],

  Maharashtra: [
    "Ahmednagar",
    "Akola",
    "Amravati",
    "Aurangabad",
    "Beed",
    "Bhandara",
    "Buldhana",
    "Chandrapur",
    "Dhule",
    "Gadchiroli",
    "Gondia",
    "Hingoli",
    "Jalgaon",
    "Jalna",
    "Kolhapur",
    "Latur",
    "Mumbai City",
    "Mumbai Suburban",
    "Nagpur",
    "Nanded",
    "Nandurbar",
    "Nashik",
    "Osmanabad",
    "Palghar",
    "Parbhani",
    "Pune",
    "Raigad",
    "Ratnagiri",
    "Sangli",
    "Satara",
    "Sindhudurg",
    "Solapur",
    "Thane",
    "Wardha",
    "Washim",
    "Yavatmal",
  ],

  Manipur: [
    "Bishnupur",
    "Chandel",
    "Churachandpur",
    "Imphal East",
    "Imphal West",
    "Jiribam",
    "Kakching",
    "Kamjong",
    "Kangpokpi",
    "Noney",
    "Pherzawl",
    "Senapati",
    "Tamenglong",
    "Tengnoupal",
    "Thoubal",
    "Ukhrul",
  ],

  Meghalaya: [
    "East Garo Hills",
    "East Jaintia Hills",
    "East Khasi Hills",
    "Eastern West Khasi Hills",
    "North Garo Hills",
    "Ri Bhoi",
    "South Garo Hills",
    "South West Garo Hills",
    "South West Khasi Hills",
    "West Garo Hills",
    "West Jaintia Hills",
    "West Khasi Hills",
  ],

  Mizoram: [
    "Aizawl",
    "Champhai",
    "Hnahthial",
    "Khawzawl",
    "Kolasib",
    "Lawngtlai",
    "Lunglei",
    "Mamit",
    "Saiha",
    "Saitual",
    "Serchhip",
  ],

  Nagaland: [
    "Chumoukedima",
    "Dimapur",
    "Kiphire",
    "Kohima",
    "Longleng",
    "Mokokchung",
    "Mon",
    "Niuland",
    "Noklak",
    "Peren",
    "Phek",
    "Shamator",
    "Tuensang",
    "Wokha",
    "Zunheboto",
  ],

  Odisha: [
    "Angul",
    "Balangir",
    "Balasore",
    "Bargarh",
    "Bhadrak",
    "Boudh",
    "Cuttack",
    "Deogarh",
    "Dhenkanal",
    "Gajapati",
    "Ganjam",
    "Jagatsinghpur",
    "Jajpur",
    "Jharsuguda",
    "Kalahandi",
    "Kandhamal",
    "Kendrapara",
    "Kendujhar",
    "Khordha",
    "Koraput",
    "Malkangiri",
    "Mayurbhanj",
    "Nabarangpur",
    "Nayagarh",
    "Nuapada",
    "Puri",
    "Rayagada",
    "Sambalpur",
    "Subarnapur",
    "Sundargarh",
  ],

  Punjab: [
    "Amritsar",
    "Barnala",
    "Bathinda",
    "Faridkot",
    "Fatehgarh Sahib",
    "Fazilka",
    "Ferozepur",
    "Gurdaspur",
    "Hoshiarpur",
    "Jalandhar",
    "Kapurthala",
    "Ludhiana",
    "Malerkotla",
    "Mansa",
    "Moga",
    "Pathankot",
    "Patiala",
    "Rupnagar",
    "Sahibzada Ajit Singh Nagar",
    "Sangrur",
    "Shaheed Bhagat Singh Nagar",
    "Sri Muktsar Sahib",
    "Tarn Taran",
  ],

  Rajasthan: [
    "Ajmer",
    "Alwar",
    "Anupgarh",
    "Balotra",
    "Banswara",
    "Baran",
    "Barmer",
    "Beawar",
    "Bharatpur",
    "Bhilwara",
    "Bikaner",
    "Bundi",
    "Chittorgarh",
    "Churu",
    "Dausa",
    "Deeg",
    "Dholpur",
    "Didwana Kuchamana",
    "Dudu",
    "Dungarpur",
    "Ganganagar",
    "Gangapur City",
    "Hanumangarh",
    "Jaipur",
    "Jaisalmer",
    "Jalore",
    "Jhalawar",
    "Jhunjhunu",
    "Jodhpur",
    "Karauli",
    "Kekri",
    "Khairthal Tijara",
    "Kota",
    "Kotputli Behror",
    "Nagaur",
    "Neem Ka Thana",
    "Pali",
    "Phalodi",
    "Pratapgarh",
    "Rajsamand",
    "Salumbar",
    "Sawai Madhopur",
    "Sikar",
    "Sirohi",
    "Tonk",
    "Udaipur",
  ],

  Sikkim: [
    "Gangtok",
    "Gyalshing",
    "Mangan",
    "Namchi",
    "Pakyong",
    "Soreng",
  ],

  "Tamil Nadu": [
    "Ariyalur",
    "Chengalpattu",
    "Chennai",
    "Coimbatore",
    "Cuddalore",
    "Dharmapuri",
    "Dindigul",
    "Erode",
    "Kallakurichi",
    "Kancheepuram",
    "Karur",
    "Krishnagiri",
    "Madurai",
    "Mayiladuthurai",
    "Nagapattinam",
    "Namakkal",
    "Nilgiris",
    "Perambalur",
    "Pudukkottai",
    "Ramanathapuram",
    "Ranipet",
    "Salem",
    "Sivaganga",
    "Tenkasi",
    "Thanjavur",
    "Theni",
    "Thoothukudi",
    "Tiruchirappalli",
    "Tirunelveli",
    "Tirupathur",
    "Tiruppur",
    "Tiruvallur",
    "Tiruvannamalai",
    "Tiruvarur",
    "Vellore",
    "Viluppuram",
    "Virudhunagar",
  ],

  Telangana: [
    "Adilabad",
    "Bhadradri Kothagudem",
    "Hanamkonda",
    "Hyderabad",
    "Jagtial",
    "Jangaon",
    "Jayashankar Bhupalpally",
    "Jogulamba Gadwal",
    "Kamareddy",
    "Karimnagar",
    "Khammam",
    "Komaram Bheem",
    "Mahabubabad",
    "Mahbubnagar",
    "Mancherial",
    "Medak",
    "Medchal Malkajgiri",
    "Mulugu",
    "Nagarkurnool",
    "Nalgonda",
    "Narayanpet",
    "Nirmal",
    "Nizamabad",
    "Peddapalli",
    "Rajanna Sircilla",
    "Rangareddy",
    "Sangareddy",
    "Siddipet",
    "Suryapet",
    "Vikarabad",
    "Wanaparthy",
    "Warangal",
    "Yadadri Bhuvanagiri",
  ],

  Tripura: [
    "Dhalai",
    "Gomati",
    "Khowai",
    "North Tripura",
    "Sepahijala",
    "South Tripura",
    "Unakoti",
    "West Tripura",
  ],

  "Uttar Pradesh": [
    "Agra",
    "Aligarh",
    "Ambedkar Nagar",
    "Amethi",
    "Amroha",
    "Auraiya",
    "Ayodhya",
    "Azamgarh",
    "Baghpat",
    "Bahraich",
    "Ballia",
    "Balrampur",
    "Banda",
    "Barabanki",
    "Bareilly",
    "Basti",
    "Bhadohi",
    "Bijnor",
    "Budaun",
    "Bulandshahr",
    "Chandauli",
    "Chitrakoot",
    "Deoria",
    "Etah",
    "Etawah",
    "Farrukhabad",
    "Fatehpur",
    "Firozabad",
    "Gautam Buddha Nagar",
    "Ghaziabad",
    "Ghazipur",
    "Gonda",
    "Gorakhpur",
    "Hamirpur",
    "Hapur",
    "Hardoi",
    "Hathras",
    "Jalaun",
    "Jaunpur",
    "Jhansi",
    "Kannauj",
    "Kanpur Dehat",
    "Kanpur Nagar",
    "Kasganj",
    "Kaushambi",
    "Kheri",
    "Kushinagar",
    "Lalitpur",
    "Lucknow",
    "Maharajganj",
    "Mahoba",
    "Mainpuri",
    "Mathura",
    "Mau",
    "Meerut",
    "Mirzapur",
    "Moradabad",
    "Muzaffarnagar",
    "Pilibhit",
    "Pratapgarh",
    "Prayagraj",
    "Raebareli",
    "Rampur",
    "Saharanpur",
    "Sambhal",
    "Sant Kabir Nagar",
    "Shahjahanpur",
    "Shamli",
    "Shravasti",
    "Siddharthnagar",
    "Sitapur",
    "Sonbhadra",
    "Sultanpur",
    "Unnao",
    "Varanasi",
  ],

  Uttarakhand: [
    "Almora",
    "Bageshwar",
    "Chamoli",
    "Champawat",
    "Dehradun",
    "Haridwar",
    "Nainital",
    "Pauri Garhwal",
    "Pithoragarh",
    "Rudraprayag",
    "Tehri Garhwal",
    "Udham Singh Nagar",
    "Uttarkashi",
  ],

  "West Bengal": [
    "Alipurduar",
    "Bankura",
    "Paschim Bardhaman",
    "Purba Bardhaman",
    "Birbhum",
    "Cooch Behar",
    "Dakshin Dinajpur",
    "Darjeeling",
    "Hooghly",
    "Howrah",
    "Jalpaiguri",
    "Jhargram",
    "Kalimpong",
    "Kolkata",
    "Maldah",
    "Murshidabad",
    "Nadia",
    "North 24 Parganas",
    "South 24 Parganas",
    "Paschim Medinipur",
    "Purba Medinipur",
    "Uttar Dinajpur",
  ],

  Delhi: [
    "Central Delhi",
    "East Delhi",
    "New Delhi",
    "North Delhi",
    "North East Delhi",
    "North West Delhi",
    "Shahdara",
    "South Delhi",
    "South East Delhi",
    "South West Delhi",
    "West Delhi",
  ],

  "Jammu and Kashmir": [
    "Anantnag",
    "Bandipora",
    "Baramulla",
    "Budgam",
    "Doda",
    "Ganderbal",
    "Jammu",
    "Kathua",
    "Kishtwar",
    "Kulgam",
    "Kupwara",
    "Poonch",
    "Pulwama",
    "Rajouri",
    "Ramban",
    "Reasi",
    "Samba",
    "Shopian",
    "Srinagar",
    "Udhampur",
  ],

  Ladakh: [
    "Kargil",
    "Leh",
  ],
};

// ======================================================
const WORK_TYPES = [
  "Mason",
  "Carpenter",
  "Painter",
  "Electrician",
  "Plumber",
  "Gardener",
  "Cleaner",
  "Welder",
  "Driver",
  "Construction Worker",
  "Helper",
  "AC Technician",
  "Mechanic",
  "Tiles Worker",
  "Furniture Worker",
  "Home Care",
  "Graphic Designer",
  "Other",
];

// ======================================================
// LOCATION MARKER
// ======================================================

const locationIcon = new L.DivIcon({
  className: "custom-location-marker",

  html: `
    <div style="
      width:34px;
      height:34px;
      background:#ef4444;
      border:3px solid white;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      box-shadow:0 3px 10px rgba(0,0,0,.35);
      position:relative;
    ">
      <div style="
        width:10px;
        height:10px;
        background:white;
        border-radius:50%;
        position:absolute;
        top:9px;
        left:9px;
      "></div>
    </div>
  `,

  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -34],
});

// ======================================================
// MAP CENTER
// ======================================================

function MapCenter({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 16);
    }
  }, [map, position]);

  return null;
}

// ======================================================
// OFFER JOB
// ======================================================

export default function OfferJob() {
  const navigate = useNavigate();

  // ====================================================
  // JOB STATES
  // ====================================================

  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobAmount, setJobAmount] = useState("");

  const [jobState, setJobState] = useState("");
  const [jobDistrict, setJobDistrict] = useState("");

  const [jobWorkType, setJobWorkType] = useState("");

  const [jobPhone, setJobPhone] = useState("");
  const [jobEmail, setJobEmail] = useState("");

  // ====================================================
  // LOCATION
  // ====================================================

  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  // ====================================================
  // SUBMIT
  // ====================================================

  const [loading, setLoading] = useState(false);

  // ====================================================
  // DISTRICTS FOR SELECTED STATE
  // ====================================================

  const availableDistricts = jobState
    ? INDIA_LOCATIONS[jobState] || []
    : [];

  // ====================================================
  // DETECT LOCATION
  // ====================================================

  const detectLocation = () => {
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError(
        "Your browser does not support location detection."
      );
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          const response = await axios.get(
            "https://api.bigdatacloud.net/data/reverse-geocode-client",
            {
              params: {
                latitude,
                longitude,
                localityLanguage: "en",
              },
            }
          );

          const data = response.data || {};

          const informative =
            data.localityInfo?.informative || [];

          // ------------------------------------------------
          // FIND LOCALITY
          // ------------------------------------------------

          const detail = informative.find((item) => {
            const description = String(
              item?.description || ""
            ).toLowerCase();

            return (
              item?.name &&
              [
                "village",
                "hamlet",
                "neighbourhood",
                "neighborhood",
                "suburb",
              ].includes(description)
            );
          });

          // ------------------------------------------------
          // VILLAGE
          // ------------------------------------------------

          const village =
            data.village ||
            "";

          // ------------------------------------------------
          // LOCALITY
          // ------------------------------------------------

          const locality =
            detail?.name ||
            data.locality ||
            "";

          // ------------------------------------------------
          // DISTRICT
          // ------------------------------------------------

          const detectedDistrict =
            data.district ||
            data.cityDistrict ||
            data.county ||
            data.city ||
            "";

          // ------------------------------------------------
          // STATE
          // ------------------------------------------------

          const detectedState =
            data.principalSubdivision ||
            "";

          // ------------------------------------------------
          // PIN
          // ------------------------------------------------

          const postcode =
            data.postcode ||
            "";

          // ------------------------------------------------
          // FIND OUR STATE
          // ------------------------------------------------

          const matchedState =
            Object.keys(INDIA_LOCATIONS).find(
              (state) =>
                state.toLowerCase() ===
                String(
                  detectedState
                ).toLowerCase()
            );

          // ------------------------------------------------
          // FIND DISTRICT
          // ------------------------------------------------

          let matchedDistrict = "";

          if (matchedState) {
            const districts =
              INDIA_LOCATIONS[
                matchedState
              ] || [];

            matchedDistrict =
              districts.find(
                (district) =>
                  district.toLowerCase() ===
                  String(
                    detectedDistrict
                  ).toLowerCase()
              ) || "";
          }

          // ------------------------------------------------
          // ADDRESS
          // ------------------------------------------------

          const address = [
            locality,
            village,
            detectedDistrict,
            detectedState,
            postcode,
          ]
            .filter(Boolean)
            .filter(
              (item, index, arr) =>
                arr.indexOf(item) === index
            )
            .join(", ");

          // ------------------------------------------------
          // LOCATION DATA
          // ------------------------------------------------

          const locationData = {
            latitude,
            longitude,

            village,
            locality,

            district:
              matchedDistrict ||
              detectedDistrict,

            state:
              matchedState ||
              detectedState,

            postcode,

            address:
              address ||
              "Current Location",
          };

          setLocation(locationData);

          // ------------------------------------------------
          // AUTO STATE
          // ------------------------------------------------

          if (matchedState) {
            setJobState(matchedState);

            // ------------------------------------------------
            // AUTO DISTRICT
            // ------------------------------------------------

            if (matchedDistrict) {
              setJobDistrict(
                matchedDistrict
              );
            } else {
              setJobDistrict("");
            }
          } else {
            setLocationError(
              "Location detected, but state/district could not be matched. Please select them manually."
            );
          }
        } catch (error) {
          console.error(
            "Reverse geocoding error:",
            error
          );

          // GPS still usable

          setLocation({
            latitude,
            longitude,
            village: "",
            locality: "",
            district: "",
            state: "",
            postcode: "",
            address: "Current Location",
          });

          setLocationError(
            "Map location found, but address could not be detected. Please select State and District manually."
          );
        } finally {
          setLocationLoading(false);
        }
      },

      (error) => {
        console.error(
          "Location error:",
          error
        );

        setLocationLoading(false);

        if (error.code === 1) {
          setLocationError(
            "Location permission denied. Please allow location access."
          );
        } else if (error.code === 2) {
          setLocationError(
            "Unable to detect your location."
          );
        } else if (error.code === 3) {
          setLocationError(
            "Location request timed out. Please try again."
          );
        } else {
          setLocationError(
            "Unable to detect your current location."
          );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  // ====================================================
  // STATE CHANGE
  // ====================================================

  const handleStateChange = (e) => {
    const value = e.target.value;

    setJobState(value);

    // State change par old district remove
    setJobDistrict("");
  };

  // ====================================================
  // SUBMIT JOB
  // ====================================================

  const submitJob = async (e) => {
    e.preventDefault();

    // ------------------------------------------------
    // TITLE
    // ------------------------------------------------

    if (!jobTitle.trim()) {
      alert("Please enter job title.");
      return;
    }

    // ------------------------------------------------
    // DESCRIPTION
    // ------------------------------------------------

    if (!jobDescription.trim()) {
      alert("Please enter job description.");
      return;
    }

    // ------------------------------------------------
    // AMOUNT
    // ------------------------------------------------

    if (
      !jobAmount ||
      Number(jobAmount) <= 0
    ) {
      alert("Please enter a valid amount.");
      return;
    }

    // ------------------------------------------------
    // STATE
    // ------------------------------------------------

    if (!jobState) {
      alert("Please select state.");
      return;
    }

    // ------------------------------------------------
    // DISTRICT
    // ------------------------------------------------

    if (!jobDistrict) {
      alert("Please select district.");
      return;
    }

    // ------------------------------------------------
    // WORK TYPE
    // ------------------------------------------------

    if (!jobWorkType) {
      alert("Please select work type.");
      return;
    }

    // ------------------------------------------------
    // PHONE
    // ------------------------------------------------

    if (jobPhone.length !== 10) {
      alert(
        "Please enter a valid 10 digit phone number."
      );
      return;
    }

    // ------------------------------------------------
    // LOCATION
    // ------------------------------------------------

    if (!location) {
      alert(
        "Please select your current job location."
      );
      return;
    }

    try {
      setLoading(true);

      // ==================================================
      // FINAL LOCATION
      // ==================================================

      const finalLocation = {
        address:
          location.address ||
          `${jobDistrict}, ${jobState}`,

        village:
          location.village || "",

        locality:
          location.locality || "",

        district:
          jobDistrict,

        state:
          jobState,

        postcode:
          location.postcode || "",

        latitude:
          location.latitude,

        longitude:
          location.longitude,
      };

      // ==================================================
      // POST JOB
      // ==================================================

      const response = await axios.post(
        `${API_URL}/jobs`,
        {
          title: jobTitle.trim(),

          description:
            jobDescription.trim(),

          amount:
            Number(jobAmount),

          // IMPORTANT
          // Existing backend ke liye district
          district:
            jobDistrict,

          // NEW
          state:
            jobState,

          workType:
            jobWorkType,

          postedByPhone:
            jobPhone,

          postedByEmail:
            jobEmail.trim(),

          location:
            finalLocation,
        }
      );

      const result =
        response.data;

      console.log(
        "Job post response:",
        result
      );

      // ==================================================
      // SUCCESS
      // ==================================================

      if (result.success) {
        alert(
          result.notifiedWorkers > 0
            ? `Job posted successfully!\n${result.notifiedWorkers} matching worker(s) notified.`
            : "Job posted successfully!\nNo matching workers found."
        );

        navigate("/");
      } else {
        alert(
          result.message ||
            "Job could not be posted."
        );
      }
    } catch (error) {
      console.error(
        "Job Posting Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to post job. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">

      <div className="mx-auto w-full max-w-2xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-7 text-center">

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mb-4 text-sm font-semibold text-slate-500 hover:text-sky-600"
          >
            ← Back to Jobs
          </button>

          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            Offer a Job
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Find a suitable worker anywhere in India.
          </p>

        </div>

        {/* =================================================
            CARD
        ================================================= */}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <form
            onSubmit={submitJob}
            className="space-y-5 p-5 sm:p-7"
          >

            {/* =================================================
                JOB TITLE
            ================================================= */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Job Title{" "}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <input
                type="text"
                value={jobTitle}
                onChange={(e) =>
                  setJobTitle(
                    e.target.value
                  )
                }
                placeholder="e.g. Electrician Required"
                className="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />

            </div>

            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Job Description{" "}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <textarea
                value={jobDescription}
                onChange={(e) =>
                  setJobDescription(
                    e.target.value
                  )
                }
                placeholder="Describe the work..."
                rows={4}
                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />

            </div>

            {/* =================================================
                AMOUNT
            ================================================= */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Work Amount{" "}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-slate-500">
                  ₹
                </span>

                <input
                  type="number"
                  min="1"
                  value={jobAmount}
                  onChange={(e) =>
                    setJobAmount(
                      e.target.value
                    )
                  }
                  placeholder="500"
                  className="h-11 w-full rounded-lg border border-slate-300 pl-9 pr-4 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />

              </div>

            </div>

            {/* =================================================
                STATE + DISTRICT
            ================================================= */}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              {/* STATE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  State{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <select
                  value={jobState}
                  onChange={handleStateChange}
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                >

                  <option value="">
                    Select State
                  </option>

                  {Object.keys(
                    INDIA_LOCATIONS
                  )
                    .sort()
                    .map((state) => (
                      <option
                        key={state}
                        value={state}
                      >
                        {state}
                      </option>
                    ))}

                </select>

              </div>

              {/* DISTRICT */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  District{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <select
                  value={jobDistrict}
                  onChange={(e) =>
                    setJobDistrict(
                      e.target.value
                    )
                  }
                  disabled={!jobState}
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none disabled:cursor-not-allowed disabled:bg-slate-100 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                >

                  <option value="">
                    {jobState
                      ? "Select District"
                      : "Select State First"}
                  </option>

                  {availableDistricts
                    .sort()
                    .map(
                      (district) => (
                        <option
                          key={district}
                          value={district}
                        >
                          {district}
                        </option>
                      )
                    )}

                </select>

              </div>

            </div>

            {/* =================================================
                WORK TYPE
            ================================================= */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Work Type{" "}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <select
                value={jobWorkType}
                onChange={(e) =>
                  setJobWorkType(
                    e.target.value
                  )
                }
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >

                <option value="">
                  Select Work Type
                </option>

                {WORK_TYPES.map(
                  (type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* =================================================
                LOCATION
            ================================================= */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Job Location{" "}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <button
                type="button"
                onClick={detectLocation}
                disabled={locationLoading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-4 text-sm font-semibold text-sky-700 transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
              >

                <span className="text-lg">
                  📍
                </span>

                {locationLoading
                  ? "Detecting Location..."
                  : location
                  ? "Update Current Location"
                  : "Use Current Location"}

              </button>

              {/* LOCATION ERROR */}

              {locationError && (
                <p className="mt-2 rounded-lg bg-red-50 p-3 text-xs text-red-600">
                  {locationError}
                </p>
              )}

              {/* LOCATION */}

              {location && (
                <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">

                  {/* MAP */}

                  <div className="h-56 w-full sm:h-64">

                    <MapContainer
                      center={[
                        Number(
                          location.latitude
                        ),
                        Number(
                          location.longitude
                        ),
                      ]}
                      zoom={16}
                      scrollWheelZoom={false}
                      className="h-full w-full"
                    >

                      <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />

                      <MapCenter
                        position={[
                          Number(
                            location.latitude
                          ),
                          Number(
                            location.longitude
                          ),
                        ]}
                      />

                      <Marker
                        position={[
                          Number(
                            location.latitude
                          ),
                          Number(
                            location.longitude
                          ),
                        ]}
                        icon={locationIcon}
                      >

                        <Popup>

                          <strong>
                            Job Location
                          </strong>

                          <br />

                          {location.address}

                        </Popup>

                      </Marker>

                    </MapContainer>

                  </div>

                  {/* LOCATION DETAILS */}

                  <div className="bg-white p-4">

                    <div className="flex items-start gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-lg">
                        📍
                      </div>

                      <div className="min-w-0">

                        <p className="text-sm font-semibold text-slate-800">
                          Job Location
                        </p>

                        <p className="mt-1 text-sm leading-5 text-slate-600">
                          {location.address}
                        </p>

                      </div>

                    </div>

                    {/* DETAILS */}

                    <div className="mt-4 grid grid-cols-2 gap-2">

                      <div className="rounded-lg bg-slate-50 p-3">

                        <p className="text-[11px] text-slate-400">
                          State
                        </p>

                        <p className="mt-1 text-xs font-semibold text-slate-700">
                          {jobState ||
                            location.state ||
                            "-"}
                        </p>

                      </div>

                      <div className="rounded-lg bg-slate-50 p-3">

                        <p className="text-[11px] text-slate-400">
                          District
                        </p>

                        <p className="mt-1 text-xs font-semibold text-slate-700">
                          {jobDistrict ||
                            location.district ||
                            "-"}
                        </p>

                      </div>

                      {location.village && (
                        <div className="rounded-lg bg-slate-50 p-3">

                          <p className="text-[11px] text-slate-400">
                            Village
                          </p>

                          <p className="mt-1 text-xs font-semibold text-slate-700">
                            {location.village}
                          </p>

                        </div>
                      )}

                      {location.locality && (
                        <div className="rounded-lg bg-slate-50 p-3">

                          <p className="text-[11px] text-slate-400">
                            Locality
                          </p>

                          <p className="mt-1 text-xs font-semibold text-slate-700">
                            {location.locality}
                          </p>

                        </div>
                      )}

                      {location.postcode && (
                        <div className="rounded-lg bg-slate-50 p-3">

                          <p className="text-[11px] text-slate-400">
                            PIN Code
                          </p>

                          <p className="mt-1 text-xs font-semibold text-slate-700">
                            {location.postcode}
                          </p>

                        </div>
                      )}

                    </div>

                  </div>

                </div>
              )}

            </div>

            {/* =================================================
                PHONE + EMAIL
            ================================================= */}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              {/* PHONE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Phone Number{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="tel"
                  value={jobPhone}
                  onChange={(e) =>
                    setJobPhone(
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10)
                    )
                  }
                  placeholder="10 digit mobile number"
                  maxLength={10}
                  inputMode="numeric"
                  className="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />

              </div>

              {/* EMAIL */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">

                  Email{" "}

                  <span className="font-normal text-slate-400">
                    (Optional)
                  </span>

                </label>

                <input
                  type="email"
                  value={jobEmail}
                  onChange={(e) =>
                    setJobEmail(
                      e.target.value
                    )
                  }
                  placeholder="your@email.com"
                  className="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />

              </div>

            </div>

            {/* =================================================
                SUBMIT
            ================================================= */}

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-lg bg-sky-600 font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Posting Job..."
                : "Post Job"}
            </button>

            {/* SECURITY */}

            <p className="text-center text-xs text-slate-400">
              🔒 Your information is securely handled.
            </p>

          </form>

        </div>

      </div>

    </div>
  );
}