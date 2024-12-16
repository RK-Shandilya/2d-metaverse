import { OutgoingMessage } from "./types";
import type { User } from "./User";

export class RoomManager {
  public rooms: Map<string, User[]>;
  public messages: Map<
    string,
    { username: string; userAvatar: string; message: string }[]
  >;
  public elements: Map<string, number[]>;
  static instance: RoomManager;

  private constructor() {
    this.rooms = new Map();
    this.messages = new Map();
    this.elements = new Map();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new RoomManager();
    }
    return this.instance;
  }

  public addUser(spaceId: string, user: User) {
    if (!this.rooms.has(spaceId)) {
      this.rooms.set(spaceId, [user]);
      return;
    }
    this.rooms.set(spaceId, [...(this.rooms.get(spaceId) ?? []), user]);
  }

  public addMessage(spaceId: string, user: User, message: string) {
    let userWithMessage = {
      userAvatar: user.userAvatar!,
      username: user.username,
      message,
    };
    if (!this.messages.has(spaceId)) {
      this.messages.set(spaceId, [userWithMessage]);
      return;
    }
    this.messages.set(spaceId, [
      ...(this.messages.get(spaceId) ?? []),
      userWithMessage,
    ]);
  }

  public addElements(spaceId: string, val: number) {
    if (!this.elements.has(spaceId)) {
      this.elements.set(spaceId, [val]);
      return;
    }
    this.elements.set(spaceId, [...(this.elements.get(spaceId) ?? []), val]);
  }
  public removeElements(spaceId: string, val: number) {
    if (!this.elements.has(spaceId)) return;
    this.elements.set(
      spaceId,
      this.elements.get(spaceId)?.filter((x) => x !== val) ?? [],
    );
  }
  public hasElements(spaceId: string, val: number) {
    if (!this.elements.has(spaceId)) return false;
    const index = this.elements.get(spaceId)?.findIndex((x) => x === val);
    if (index !== -1) return true;
    return false;
  }
  public broadcast(message: OutgoingMessage, user: User, roomId: string) {
    if (!this.rooms.has(roomId)) return;
    this.rooms.get(roomId)?.forEach((u) => {
      if (u.id != user.id) {
        u.send(message);
      }
    });
  }

  public removeUser(spaceId: string, user: User) {
    if (!this.rooms.has(spaceId)) return;
    this.rooms.set(
      spaceId,
      this.rooms.get(spaceId)?.filter((u) => u.id !== user.id) ?? [],
    );
  }
}