import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Get messages for a user
export async function getMessages(req, res) {
  // extract user ID from request parameters
  const userId = parseInt(req.params.id);
  // fetch messages where the user is either the sender or receiver
  const messages = await prisma.message.findMany({
    where: { OR: [{ fromUID: userId }, { toUID: userId }] },
    include: { from: true, to: true },
  });
  res.json(messages);
}

// Get messages between two users
export async function getMessagesBetweenUsers(req, res) {
  const id1 = parseInt(req.params.id1);
  const id2 = parseInt(req.params.id2);
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { fromUID: id1, toUID: id2 },
        { fromUID: id2, toUID: id1 },
      ],
    },
    include: { from: true, to: true },
  });
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
