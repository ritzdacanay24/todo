
import io from "socket.io-client";

function createSocket() {
    return io('localhost:4001');
}

export {
    createSocket
}
