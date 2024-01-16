require('dotenv').config();
const ampq = require('amqplib');
const NotesService = require('./NotesService');
const MailSender = require('./MailSender');
const Listener = require('./listener');

const init = async () => {
  const notesService = new NotesService();
  const mailSender = new MailSender();
  const listener = new Listener(notesService, mailSender);

  //   const connection = await ampq.connect(process.env.RABBITMQ_SERVER);
  const connection = await ampq.connect({
    hostname: process.env.RABBITMQ_SERVER,
    port: 5672,
    username: process.env.RABBITMQ_USER,
    password: process.env.RABBITMQ_PASSWORD,
  });
  const channel = await connection.createChannel();
  await channel.assertQueue('export:notes', {
    durable: true,
  });

  await channel.consume('export:notes', listener.listen, {
    noAck: true,
  });
};

init();
