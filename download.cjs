const fs = require("fs");
const https = require("https");
const path = require("path");

const baseUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl";
const outputDir = path.join(__dirname, "sprites");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

for (let i = 1; i <= 493; i++) {
  const file = fs.createWriteStream(`${outputDir}/${i}.png`);
  
  https.get(`${baseUrl}/${i}.png`, (response) => {
    response.pipe(file);
  });
}
