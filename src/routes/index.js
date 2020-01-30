const { Router } = require('express');

const router = Router();
const redis = require('../../redis');

const seriesSequenceKey = process.env.REDIS_SERIES_SEQUENCE_KEY;
const setSeriesSequenceCache = numberBox => redis.set(seriesSequenceKey, JSON.stringify(numberBox), err => err);

function getSeriesSequenceCache() {
  const numberBox = {
    1: 3, 2: 5, 3: 9, 4: 15
  };
  const promise = new Promise((resolve, reject) => {
    redis.get(seriesSequenceKey, (err, seriesSequence) => {
      if (!seriesSequence) {
        console.log('ไม่มี');
        setSeriesSequenceCache(numberBox);
        resolve(numberBox);
      } else {
        console.log('มี', JSON.parse(seriesSequence));
        resolve(JSON.parse(seriesSequence));
      }
    });
  });
  return promise;
}

async function findSeriesSequence(n) {
  let seriesSequence = await getSeriesSequenceCache();
  if (seriesSequence[n]) {
    return seriesSequence[n];
  }
  const next = await findSeriesSequence(n - 1) + 2 * (n - 1);
  seriesSequence = await getSeriesSequenceCache();
  if (next) {
    seriesSequence[n] = next;
    await setSeriesSequenceCache(seriesSequence);
    return next;
  }
}

router.get('/:n', async (req, res) => {
  const seriesSequence = await getSeriesSequenceCache();
  // console.log(seriesSequence, req.params.n ,seriesSequence[req.params.n] );
  if (seriesSequence[req.params.n]) {
    return res.json({ source: 'cache', result: seriesSequence[req.params.n] });
  }
  const data = await findSeriesSequence(req.params.n);
  if (data) {
    res.json({ source: 'api', result: data });
  } else {
    console.log('error');
  }
});

module.exports = router;
