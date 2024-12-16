import client  from "@repo/db/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import WebSocket  from "ws";
import { JWT_SECRET } from "./config";
import { RoomManager } from "./RoomManager";
import { OutgoingMessage } from "./types";

export class User {
  private spaceId?: string;
  private x: number;
  private y: number;
  private spaceWidth: number;
  public id!: string;
  public username!: string;
  public userAvatar: string | null;

  constructor(
    private ws: WebSocket,
  ) {
    this.x = 0;
    this.y = 0;
    this.spaceWidth = 0;
    this.userAvatar = null;
    this.initHandlers();
  }

  initHandlers() {
    this.ws.on("message", async (data: any) => {
      const parsedData = JSON.parse(data.toString());
      switch (parsedData.type) {
        case "join":
          const spaceId = parsedData.payload.spaceId;
          const token = parsedData.payload.token;
          try {
            const user = jwt.verify(token, JWT_SECRET!) as JwtPayload;
            let updatedUser = await client.user.findUnique({
              where: {
                id: user.userId,
              },
            });
            let avatar;
            if (updatedUser?.avatarId) {
              avatar = await client.avatar.findUnique({
                where: { id: updatedUser.avatarId },
              });
            }
            this.username = user.username;
            this.id = user.userId;
            if (avatar?.imageUrl) {
              this.userAvatar = avatar.imageUrl;
            }
            if (!this.id) {
              this.ws.close();
              return;
            }
            const space = await client.space.findFirst({
              where: {
                id: spaceId,
              },
              include: {
                elements: true,
              },
            });
            if (!space) {
              this.ws.close();
              return;
            }
            this.spaceId = spaceId;
            this.spaceWidth = space.width;
            space.elements.forEach((val: any) => {
              RoomManager.getInstance().addElements(
                this.spaceId!,
                val.x * this.spaceWidth + val.y,
              );
            });
            RoomManager.getInstance().addUser(spaceId, this);
            this.x = Math.floor(Math.random() * space.width);
            this.y = Math.floor(Math.random() * space.width);
            this.send({
              type: "space-joined",
              payload: {
                spawn: {
                  x: this.x,
                  y: this.y,
                },
                userId: this.id,
                username: this.username,
                users:
                  RoomManager.getInstance()
                    .rooms.get(spaceId)
                    ?.filter((x) => x.id !== this.id)
                    ?.map((u) => ({
                      userId: u.id,
                      x: u.x,
                      y: u.y,
                      username: u.username,
                      userAvatar: u.userAvatar,
                    })) ?? [],
                messages: RoomManager.getInstance()
                  .messages.get(spaceId)
                  ?.map((u) => ({
                    username: u.username,
                    userAvatar: u.userAvatar,
                    message: u.message,
                  })),
              },
            });
            RoomManager.getInstance().broadcast(
              {
                type: "user-joined",
                payload: {
                  x: this.x,
                  y: this.y,
                  userId: this.id,
                  username: this.username,
                  userAvatar: this.userAvatar,
                },
              },
              this,
              this.spaceId!,
            );
          } catch (e: any) {
            console.log(e.message);
          }
          break;
        case "move":
          try {
            const moveX = parsedData.payload.x;
            const moveY = parsedData.payload.y;

            const isElement = RoomManager.getInstance().hasElements(
              this.spaceId!,
              moveX * this.spaceWidth + moveY,
            );
            if (isElement) {
              throw new Error("Element found!");
            }

            const index = RoomManager.getInstance()
              .rooms.get(this.spaceId!)
              ?.filter((u) => u.id !== this.id)
              .findIndex((u) => u.x === moveX && u.y === moveY);

            if (index !== -1) throw new Error("Other user is already present!");
            const xD = Math.abs(this.x - moveX);
            const yD = Math.abs(this.y - moveY);
            
            if ((xD == 1 && yD == 0) || (yD == 1 && xD == 0)) {
              this.x = moveX;
              this.y = moveY;
              this.send({
                type: "user-movement",
                payload: {
                  x: this.x,
                  y: this.y,
                  userId: this.id,
                  username: this.username,
                  userAvatar: this.userAvatar,
                },
              });
              RoomManager.getInstance().broadcast(
                {
                  type: "movement",
                  payload: {
                    x: this.x,
                    y: this.y,
                    userId: this.id,
                    username: this.username,
                    userAvatar: this.userAvatar,
                  },
                },
                this,
                this.spaceId!,
              );
            } else {
              this.send({
                type: "movement-rejected",
                payload: {
                  x: this.x,
                  y: this.y,
                },
              });
            }
          } catch(e:any) {
            console.log(e.message);
          }
          break;
        case "message":
          RoomManager.getInstance().addMessage(
            this.spaceId!,
            this!,
            parsedData.payload.message,
          );
          this.send({
            type: "message",
            payload: {
              username: this.username,
              userAvatar: this.userAvatar,
              message: parsedData.payload.message,
            },
          });
          RoomManager.getInstance().broadcast(
            {
              type: "message",
              payload: {
                username: this.username,
                userAvatar: this.userAvatar,
                message: parsedData.payload.message,
              },
            },
            this!,
            this.spaceId!,
          );
          break;
        case "element-update":
          const x = parsedData.payload.x;
          const y = parsedData.payload.y;
          const isAdd = parsedData.payload.isAdd;
          if (isAdd) {
            RoomManager.getInstance().addElements(
              this.spaceId!,
              x * this.spaceWidth + y,
            );
          } else {
            RoomManager.getInstance().removeElements(
              this.spaceId!,
              x * this.spaceWidth + y,
            );
          }
          RoomManager.getInstance().broadcast(
            {
              type: "element-update",
            },
            this!,
            this.spaceId!,
          );
      }
    });
  }

  destroy() {
    RoomManager.getInstance().broadcast(
      {
        type: "user-left",
        payload: {
          userId: this.id,
        },
      },
      this,
      this.spaceId!,
    );
    RoomManager.getInstance().removeUser(this.spaceId!, this);
  }
  send(payload: OutgoingMessage) {
    this.ws.send(JSON.stringify(payload));
  }
}