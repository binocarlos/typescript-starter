require('ts-node/register')
import settings from './src/settings'
import getDatabaseSettings from './src/settings_database'
module.exports = getDatabaseSettings(settings).postgres