const { Router } = require('express');
const axios = require('axios');
const router = Router();

/* GET index page. */
router.get('/', (req, res) => {
  let location = req.query.location;
  console.log(location)
  axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json?', {
    params: {
      key: process.env.GOOGLE_API_KEY,
      query: location,
      type : 'restaurant',
      region: 'th'
    }
  })
    .then(data => {
      // console.log(data.data.results);
      res.json(data.data.results);

    });

});

module.exports = router;
