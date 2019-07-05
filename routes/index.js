const { Router } = require('express');
const axios = require('axios');
const router = Router();

/* GET index page. */
router.get('/', (req, res) => {
  axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json?', {
    params: {
      key: 'AIzaSyDl_k1hquEPQpUcQBoMi4CvIt0uqeLH2cs',
      location: 'bang sue',
      query: 'bang%sue',
      type : 'restaurant',
      region: 'th'
    }
  })
    .then(data => {
      console.log(data.data.results);
      res.json(data.data.results);

    });

});

module.exports = router;
