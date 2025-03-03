import { WebSocketServer, WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "@repo/backend-com/config";
import { prismaClient } from "@repo/db/client";

const ws = new WebSocketServer({ port: 8080 });

interface User {
  userId: string;
  rooms: string[];
  ws: WebSocket;
}

const users: User[] = [];

function CheckUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === "string" || !decoded?.userId) {
      return null;
    }

    return decoded.userId;
  } catch (error) {
    return null;
  }
}

ws.on('connection', function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return;
  }

  const queryparams = new URLSearchParams(url.split('?')[1]);
  const token = queryparams.get('token') || "";
  const userId = CheckUser(token);

  if (!userId) {
    ws.close();
    return;
  }

  if (!users.some(user => user.userId === userId)) {
    users.push({
      userId,
      rooms: [],
      ws
    });
  }

  ws.on('message', async function incoming(data) {
    let parseddata;
    try {
      parseddata = JSON.parse(data.toString());
    } catch (e) {
      console.log('Error while parsing data', e);
      return;
    }

    if (!parseddata?.type) {
      console.warn('Invalid message format', parseddata);
      return;
    }

    switch (parseddata.type) {
      case "join":
        const joinUser = users.find(x => x.ws === ws);
        if (joinUser) {
          try {
            await prismaClient.room.update({
              where: { id: Number(parseddata.roomId) },
              data: { adminId: joinUser.userId }
            });
            joinUser.rooms.push(parseddata.roomId);
            console.log('Joined room', joinUser.userId, parseddata.roomId);
          } catch (e) {
            console.log('Error while joining room', e);
          }
        } else {
          console.log('User not found');
        }
        break;

      case "leave":
        const leaveUser = users.find(x => x.ws === ws);
        if (leaveUser) {
          leaveUser.rooms = leaveUser.rooms.filter(x => x !== parseddata.roomId);
          console.log('Left room', leaveUser.userId, parseddata.roomId);
        } else {
          console.log('User not found');
        }
        break;

      case "message":
        const roomId = Number(parseddata.roomId);
        const message = parseddata.message;
        const messageUserId = users.find(x => x.ws === ws)?.userId;

        if (messageUserId) {
          try {
            await prismaClient.chat.create({
              data: {
                message,
                roomId,
                userId: messageUserId
              }
            });
            console.log('Message sent', messageUserId, roomId, message);
          } catch (e) {
            console.log('Error while sending message', e);
          }
        } else {
          console.log('User not found for message sending');
        }
        break;

      default:
        console.warn('Unknown message type', parseddata.type);
    }
  });
});
