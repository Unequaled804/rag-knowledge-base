import Fastify from 'fastify';
import cors from '@fastify/cors';
import { prisma } from './prisma/index.js';

const fastify = Fastify({
	logger: true
});

await fastify.register(cors, {
	origin: 'http://localhost:5173'
});

fastify.get('/', (req, res) => {
	res.send('Hello World');
});

fastify.get('/user', async (req, res) => {
	const users = await prisma.user.findMany();
	res.send(users);
});

fastify.post('/user', async (req, res) => {
	const { email, password } = req.body;
	console.log(req.body);
	try {
		const user = await prisma.user.create({
			data: { email, password }
		});
		res.send(user);
	} catch (error) {
		console.log(error.stack);
		res.status(500).send({
			error: 'Failed to create user',
			message: (error as Error).message
		});
	}
});

fastify.listen({ port: 3000 }, (err, address) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
	fastify.log.info(`Server is running on ${address}`);
});
