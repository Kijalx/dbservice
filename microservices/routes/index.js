let express = require('express');
let router = express.Router();

let Mongoose = require('mongoose').Mongoose;
let Schema = require('mongoose').Schema;
let oldMong = new Mongoose();
oldMong.connect('mongodb://mongodb:27017/db', { useNewUrlParser: true, useUnifiedTopology: true });

let meetingSchema = new Schema({
  meetingId: String,
  title: String,
  image: String,
  address: String,
  description: String
}, { collection: 'meetings' });

let meetings = oldMong.model('meetings', meetingSchema);

router.get('/', async function (req, res, next) {
  const meetings = await getMeetings();
  res.render('index');
});

router.post('/getMeetings', async function (req, res, next) {
  const meetings = await getMeetings();
  res.json(meetings);
});

async function getMeetings() {
  data = await meetings.find().lean();
  return { meetings: data };
}

router.post('/saveMeeting', async function (req, res, next) {
  const meetings = await saveMeeting(req.body);
  res.json(meetings);
});

async function saveMeeting(theMeeting) {
  console.log('theMeeting: ' + theMeeting);
  await meetings.create(theMeeting,
    function (err, res) {
      if (err) {
        console.log('Could not insert new meeting')
        return { saveMeetingResponse: "fail" };
      }
    }
  )
  return { saveMeetingResponse: "success" };
}

module.exports = router;