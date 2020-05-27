require("dotenv").config();

const cheerio = require("cheerio");
const fetch = require("node-fetch");
const SOURCE_URL = process.env.SOURCE_URL;
const CORONA_API = process.env.CORONA_API;
const AUTH_TOKEN = process.env.AUTH_TOKEN;

const cleanUpNumber = (text) => {
  const cleaned = text.replace(/\s\s+/g, "").replace(/,/, "").replace(/\+/, "");
  return isNaN(cleaned) ? null : cleaned;
};

const cleanUpText = (text) =>
  text.replace(/\s\s+/g, "").replace(/,/, "").replace(/\+/, "");

async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response; // parses JSON response into native JavaScript objects
}

const COUNTRIES_NAMES = [
  "USA",
  "Brazil",
  "Russia",
  "Spain",
  "UK",
  "Italy",
  "France",
  "Germany",
  "Turkey",
  "India",
  "Iran",
  "Peru",
  "Canada",
  "Chile",
  "Saudi Arabia",
  "Mexico",
  "Pakistan",
  "Belgium",
  "Qatar",
  "Netherlands",
  "Belarus",
  "Ecuador",
  "Bangladesh",
  "Sweden",
  "Singapore",
  "UAE",
  "Portugal",
  "Switzerland",
  "Ireland",
  "South Africa",
  "Indonesia",
  "Colombia",
  "Kuwait",
  "Poland",
  "Ukraine",
  "Egypt",
  "Romania",
  "Israel",
  "Japan",
  "Austria",
  "Dominican Republic",
  "Philippines",
  "Argentina",
  "Afghanistan",
  "Panama",
  "Denmark",
  "S. Korea",
  "Serbia",
  "Bahrain",
  "Kazakhstan",
  "Czechia",
  "Algeria",
  "Norway",
  "Nigeria",
  "Oman",
  "Malaysia",
  "Morocco",
  "Armenia",
  "Moldova",
  "Australia",
  "Bolivia",
  "Ghana",
  "Finland",
  "Cameroon",
  "Iraq",
  "Azerbaijan",
  "Honduras",
  "Luxembourg",
  "Sudan",
  "Guatemala",
  "Hungary",
  "Uzbekistan",
  "Guinea",
  "Tajikistan",
  "Senegal",
  "Thailand",
  "Greece",
  "Ivory Coast",
  "Djibouti",
  "Bulgaria",
  "Bosnia and Herzegovina",
  "DRC",
  "Croatia",
  "Gabon",
  "El Salvador",
  "North Macedonia",
  "Cuba",
  "Estonia",
  "Iceland",
  "Somalia",
  "Lithuania",
  "Mayotte",
  "Kyrgyzstan",
  "Slovakia",
  "New Zealand",
  "Slovenia",
  "Maldives",
  "Kenya",
  "Sri Lanka",
  "Venezuela",
  "Guinea-Bissau",
  "Haiti",
  "Lebanon",
  "Mali",
  "Hong Kong",
  "Latvia",
  "Tunisia",
  "Equatorial Guinea",
  "Albania",
  "Costa Rica",
  "Niger",
  "Cyprus",
  "Zambia",
  "Paraguay",
  "Burkina Faso",
  "South Sudan",
  "Uruguay",
  "Nepal",
  "Andorra",
  "Nicaragua",
  "Sierra Leone",
  "Georgia",
  "Jordan",
  "Diamond Princess",
  "Ethiopia",
  "Chad",
  "CAR",
  "San Marino",
  "Malta",
  "Madagascar",
  "Jamaica",
  "Channel Islands",
  "Tanzania",
  "Congo",
  "Réunion",
  "Sao Tome and Principe",
  "Taiwan",
  "Palestine",
  "Togo",
  "Cabo Verde",
  "French Guiana",
  "Rwanda",
  "Isle of Man",
  "Mauritius",
  "Vietnam",
  "Montenegro",
  "Mauritania",
  "Liberia",
  "Eswatini",
  "Uganda",
  "Yemen",
  "Mozambique",
  "Benin",
  "Myanmar",
  "Martinique",
  "Faeroe Islands",
  "Guadeloupe",
  "Gibraltar",
  "Mongolia",
  "Brunei ",
  "Guyana",
  "Bermuda",
  "Cayman Islands",
  "Cambodia",
  "Syria",
  "Trinidad and Tobago",
  "Malawi",
  "Aruba",
  "Bahamas",
  "Monaco",
  "Barbados",
  "Comoros",
  "Liechtenstein",
  "Sint Maarten",
  "Libya",
  "Angola",
  "French Polynesia",
  "Zimbabwe",
  "Macao",
  "Burundi",
  "Saint Martin",
  "Eritrea",
  "Botswana",
  "Bhutan",
  "Antigua and Barbuda",
  "Gambia",
  "Timor-Leste",
  "Grenada",
  "Namibia",
  "Laos",
  "Belize",
  "Curaçao",
  "Fiji",
  "New Caledonia",
  "Saint Lucia",
  "St. Vincent Grenadines",
  "Dominica",
  "Saint Kitts and Nevis",
  "Falkland Islands",
  "Turks and Caicos",
  "Greenland",
  "Vatican City",
  "Montserrat",
  "Suriname",
  "Seychelles",
  "MS Zaandam",
  "Western Sahara",
  "British Virgin Islands",
  "Papua New Guinea",
  "Caribbean Netherlands",
  "St. Barth",
  "Anguilla",
  "Lesotho",
  "Saint Pierre Miquelon",
  "China",
];
async function main() {
  const countries = [];
  let errorCount = 0;

  await fetch(SOURCE_URL)
    .then((res) => {
      return res.text();
    })
    .then((html) => {
      const $ = cheerio.load(html);
      const table = $("#main_table_countries_today");
      const rows = table.find("tr");
      rows.each(async (i, el) => {
        const name = cleanUpText($(el).find("td").slice(1).eq(0).text());
        if (COUNTRIES_NAMES.includes(name)) {
          const short = name.toLowerCase().replace(/\s/g, "");
          const totalCases = cleanUpNumber(
            $(el).find("td").slice(1).eq(1).text()
          );
          const newCases = cleanUpNumber(
            $(el).find("td").slice(1).eq(2).text()
          );
          const totalDeaths = cleanUpNumber(
            $(el).find("td").slice(1).eq(3).text()
          );
          const newDeaths = cleanUpNumber(
            $(el).find("td").slice(1).eq(4).text()
          );
          const totalRecovered = cleanUpNumber(
            $(el).find("td").slice(1).eq(5).text()
          );

          await postData(CORONA_API, {
            short,
            name,
            totalCases,
            newCases,
            totalDeaths,
            newDeaths,
            totalRecovered,
          })
            .then((response) => response.json())
            .catch((error) =>
              console.log(`Error while reporting ${name} .Details: ${error}`)
            );
        }
      });
    });
  console.log(">>> CORONA_API: " + CORONA_API);
  console.log(">>> SOURCE: " + SOURCE_URL);
  console.log(">>> TOKEN: " + AUTH_TOKEN.split(".")[0]);
  console.log(">>> DONE");
}

main();
