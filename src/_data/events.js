const axios = require('axios');

require('dotenv').config();

const {
  EVENTBRITE_TOKEN,
  EVENTBRITE_ORGANIZATION_ID
} = process.env;

const eventsAPI = axios.create({
  baseURL: 'https://www.eventbriteapi.com/v3',
  headers: {
    Authorization: `Bearer ${EVENTBRITE_TOKEN}`
  }
});

const events = () => {
  return new Promise((resolve, reject) => {
    eventsAPI.get(`/organizations/${EVENTBRITE_ORGANIZATION_ID}/events`)
      .then(r => resolve(r.data.events))
      .catch(e => reject(e));
  });
};

module.exports = events();
