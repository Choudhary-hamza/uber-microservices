const amqplib = require('amqplib');

let connection, channel;

async function connect() {
    try {
        connection = await amqplib.connect(process.env.RABBIT_KEY);
        channel = await connection.createChannel();
        console.log("user server rabbitMq has been connected");
    } catch (error) {
        console.error('Failed to connect to RabbitMQ', error);
    }
}

async function subscribeToQueue(queue, callback) {
    if (!channel) {
        await connect();
    }
    await channel.assertQueue(queue, { durable: true });
    channel.consume(queue, (msg) => {
        if (msg !== null) {
            callback(msg.content.toString());
            channel.ack(msg);
        }
    });
}

async function publishToQueue(queue, message) {
    if (!channel) {
        await connect();
    }
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(message));
}

module.exports = {
    subscribeToQueue,
    publishToQueue,
    connect
};
