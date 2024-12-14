import { WebSocketServer } from "ws";
import { User } from "./User";
const wss = new WebSocketServer({ port: 3001 });

wss.on("connection", (ws)=> {
    console.log("Client connected");
    let user : User | undefined;
    user = new User(ws);
    ws.on("error", console.error);
    ws.on("close", ()=>{
        user?.destroy();
    })
})