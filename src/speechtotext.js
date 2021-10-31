// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');
const fs = require('fs');

// Creates a client
const speechClient = new speech.SpeechClient();

const encoding = 'OGG_OPUS';
const sampleRateHertz = 48000;
const languageCode = 'en-US';

async function transcribe(file) {
  const audio = {
    content: file.toString('base64'),
  };

  const config = {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
    audioChannelCount: 2,
  };
  const request = {
    audio: audio,
    config: config,
  };

  // Detects speech in the audio file. This creates a recognition job that you
  // can wait for now, or get its result later.
  const [operation] = await speechClient.longRunningRecognize(request);
  // Get a Promise representation of the final result of the job
  const [response] = await operation.promise();
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  return transcription;
}

exports.transcriber = transcribe;