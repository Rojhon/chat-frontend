import { io } from "socket.io-client";

const URL = "http://localhost:5000"
export const socket = io(URL);

socket.on("connect", () => {
    console.log("Im Connected to Socket id ", socket.id);
    socket.emit("socket:add-user", "1");
});

socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
});

socket.on("socket:new-user", (userId) => {
    console.log("New User ", userId)
})

socket.on("socket:alrealdy-login", () => {
    console.log("Already Login")
});