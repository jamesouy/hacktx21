var userToFile = new Map;
const fs = require('fs');

const createNewChunk = () => {
  const pathToFile = __dirname + `/../recordings/${Date.now()}.pcm`;
  return fs.createWriteStream(pathToFile);
};

function transcribeUser(_id, _channelId) {
  console.log(`Sliding into ${_channelId.name} ...`);
  _channelId.join().then(conn => {
    const dispatcher = conn;
    dispatcher.on('finish', () => { console.log(`Joined ${_channelId.name}!\n\nREADY TO RECORD\n`); });

    const receiver = conn.receiver;
    conn.on('speaking', (user, speaking) => {
      if (speaking) {
        console.log(`${user.username} started speaking`);
        const audioStream = receiver.createStream(user, { mode: 'pcm' });
        audioStream.pipe(createNewChunk());
        audioStream.on('end', () => { console.log(`${user.username} stopped speaking`); });
      }
    });
  })
    .catch(err => { throw err; });
  
}