import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const SendMessage = async (req, res) => {
  const { senderId, carId, name, message, phone } = req.body;

  try {
    const newMessage = await prisma.message.create({
      data: {
        senderId,
        carId,
        name,
        message,
        phone,
      },
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const GetMessagesBySenderId = async (req, res) => {
  const { senderId } = req.params;

  try {
    const messages = await prisma.message.findMany({
      where: {
        senderId,
      },
      orderBy: {
        createdAt: "desc", // Optional: Order messages by creation date in descending order
      },
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error getting messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const DeleteMessage = async (req, res) => {
  const { messageId } = req.params;

  try {
    await prisma.message.delete({
      where: {
        id: messageId,
      },
    });

    res.status(204).end();
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const UpdateMessageContent = async (req, res) => {
  const { messageId } = req.params;
  const { message } = req.body;

  try {
    const updatedMessage = await prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        message,
      },
    });

    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error("Error updating message content:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const GetAllMessages = async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error getting all messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const GetMessageById = async (req, res) => {
  const { messageId } = req.params;

  try {
    const message = await prisma.message.findUnique({
      where: {
        id: messageId,
      },
    });

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.status(200).json(message);
  } catch (error) {
    console.error("Error getting message by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export {
  SendMessage,
  GetMessagesBySenderId,
  DeleteMessage,
  UpdateMessageContent,
};
