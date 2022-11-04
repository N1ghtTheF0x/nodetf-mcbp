import NBuffer from "@nodetf/buffer"
import { Socket, createServer } from "node:net"

import Packet from "."

var socket: Socket

const proxyClient = new Socket()

function isPlayerPacket(type: Packet["type"])
{
    return type == Packet.Type.Player ||
           type == Packet.Type.PlayerPosition ||
           type == Packet.Type.PlayerLook ||
           type == Packet.Type.PlayerPositionAndLook
}

proxyClient.on("data",(data) =>
{
    const buffer = new NBuffer(data)
    buffer.endian = "big"
    const packets = Packet.Server.readArray(buffer)
    if(packets.length > 0) console.dir(packets)
    if(socket) socket.write(data)
})

const proxyServer = createServer((S) =>
{
    if(socket) socket.destroy()
    socket = S
    proxyClient.connect({
        host: "localhost",
        port: 25565
    })
    S.on("data",(data) =>
    {
        const buffer = new NBuffer(data)
        buffer.endian = "big"
        const packet = Packet.Client.read(buffer)
        if(!isPlayerPacket(packet.type)) console.dir(packet)
        proxyClient.write(data)
    })
})

proxyServer.listen(43434)