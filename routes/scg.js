const {Router} = require('express');
const axios = require('axios');
const router = Router();
const redis = require('../redis');

const googlePlaceKey = process.env.REDIS_GOOGLE_PLACE_KEY;
const setCache = (data) => {
    return redis.set(googlePlaceKey, JSON.stringify(data), (err) => {
        return err
    });
}

function getCache() {
    const promise = new Promise((resolve, reject) => {
        redis.get(googlePlaceKey, (err, placeObj) => {
            if (!placeObj) {
                // console.log('no');
                resolve(null)
            } else {
                // console.log('มี', JSON.parse(placeObj));
                resolve(JSON.parse(placeObj))
            }
        });
    });
    return promise
}

/* GET index page. */
router.get('/', async (req, res) => {
    let location = req.query.location;
    // console.log(location)
    let placeObj = await getCache();
    if (!placeObj) {
        axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json?', {
            params: {
                key: process.env.GOOGLE_API_KEY,
                query: location,
                type: 'restaurant',
                region: 'th'
            }
        })
            .then(data => {
                // console.log(data.data.results);
                setCache(data.data.results);
                res.json({source: 'api', result: data.data.results})
            });
    } else {
        res.json({source: 'cache', result: placeObj})
    }

});

module.exports = router;
