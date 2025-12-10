
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Get messages between users
export async function getMessages(req, res) {
  console.log('Hitting message endpoing with id:', req.params.id);
  // extract user ID from request parameters
  const userId = parseInt(req.params.id);
  // fetch messages where the user is either the sender or receiver
  const messages = await prisma.message.findMany({
    where: { OR: [{ fromUID: userId }, { toUID: userId }] },
    include: { from: true, to: true },
  });
  console.log('hi');
  res.json(messages);
}

// Send a message to a user
export async function sendMessage(req, res) {
  // extract message details from request body
  const { fromUID, toUID, messageText } = req.body;
  // create a new message record in the database
  const message = await prisma.message.create({
    data: { fromUID, toUID, messageText },
  });
  res.json(message);
}
