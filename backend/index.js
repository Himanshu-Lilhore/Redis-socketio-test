require('dotenv').config()
const { createClient } = require('redis');
const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const socketIo = require('socket.io')
const port = process.env.PORT || 3000



app.use(cors({
    origin: process.env.FRONTEND_URL,
	methods: ['GET', 'POST'],
	credentials: true
}))

app.use(express.json())

const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-13032.c301.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 13032
    }
});

async function connectRedis() {
    try {
        await client.connect();
        console.log('Connected to Redis!');
    } catch (error) {
        console.error('Could not connect to Redis:', error);
    }
}

operations();

async function operations() {
    
    await connectRedis();
    
    // setVal("Himanshu")

    const res2 = await client.get('input');
    console.log('res2 : ', res2);
}

async function setVal(val) {
    const res = await client.set("input", val);
    console.log('res : ', res);
    return res;
}

async function getVal() {
    const res = await client.get("input");
    console.log('res : ', res);
    return res;
}


const server = http.createServer(app)

const io = socketIo(server, {
    connectionStateRecovery: {},
    cors: {
		origin: process.env.FRONTEND_URL,
		methods: ['GET', 'POST'],
		credentials: true
	}
})

io.on('connection', (socket) => {
    console.log(`${socket.id} connected !`);

    socket.on('connection', async () => {
        socket.emit('connection', await getVal())
    })

    socket.on('change', async (newVal) => {
        const res = await setVal(newVal);
        if(res === "OK") {
            console.log("res OK")
            io.emit('change', newVal);
        }
    })

})


server.listen(port, () => {
	console.log(`Backend live : http://localhost:${port}/`)
})