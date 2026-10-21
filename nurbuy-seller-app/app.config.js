// Adds the Firebase file for phone push only when it is present, so the app still builds before Firebase is set up.
const fs = require('fs');
const path = require('path');

module.exports = ({ config }) => {
  const gs = path.join(__dirname, 'google-services.json');
  if (fs.existsSync(gs)) config.android = { ...config.android, googleServicesFile: './google-services.json' };
  return config;
};
