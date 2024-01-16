// require('dotenv').config();
// const ampq = require('amqplib');
// const NotesService = require('./NotesService');
// const MailSender = require('./MailSender');
// const Listener = require('./listener');

// const init = async () => {
//   const notesService = new NotesService();
//   const mailSender = new MailSender();
//   const listener = new Listener(notesService, mailSender);

//   const connection = await ampq.connect(process.env.RABBITMQ_SERVER);
//   const channel = await connection.createChannel();
//   await channel.assertQueue('export:notes', {
//     durable: true,
//   });

//   await channel.consume('export:notes', listener.listen, {
//     noAck: true,
//   });
// };

// init();

require('dotenv').config();
const ampq = require('amqplib');
const NotesService = require('./NotesService');
const MailSender = require('./MailSender');
const Listener = require('./listener');

const init = async () => {
  try {
    const notesService = new NotesService();
    const mailSender = new MailSender();
    const listener = new Listener(notesService, mailSender);

    const connection = await ampq.connect(process.env.RABBITMQ_SERVER, { timeout: 5000 });
    const channel = await connection.createChannel();
    await channel.assertQueue('export:notes', {
      durable: true,
    });

    await channel.consume('export:notes', listener.listen, {
      noAck: true,
    });
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error.message);
    process.exit(1); // Exit the process with an error code
  }
};

init();
