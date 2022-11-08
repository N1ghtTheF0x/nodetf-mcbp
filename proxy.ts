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

function isEntityPacket(type: Packet["type"])
{
    return type == Packet.Type.Entity ||
           type == Packet.Type.EntityAction ||
           type == Packet.Type.EntityEquipment ||
           type == Packet.Type.EntityLook ||
           type == Packet.Type.EntityLookAndRelativeMove ||
           type == Packet.Type.EntityMetadata ||
           type == Packet.Type.EntityPainting ||
           type == Packet.Type.EntityRelativeMove ||
           type == Packet.Type.EntityStatus ||
           type == Packet.Type.EntityTeleport ||
           type == Packet.Type.EntityVelocity ||
           type == Packet.Type.MobSpawn ||
           type == Packet.Type.DestroyEntity ||
           type == Packet.Type.MultiBlockChange ||
           type == Packet.Type.BlockChange ||
           type == Packet.Type.AddObjectVehicle
}

proxyClient.on("data",(data) =>
{
    const buffer = new NBuffer(data)
    buffer.endian = "big"
    const packets = Packet.Server.readArray(buffer).filter((p) => !isEntityPacket(p.type))
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
        const packets = Packet.Client.readArray(buffer).filter((p) => !isPlayerPacket(p.type))
        if(packets.length > 0) console.dir(packets)
        proxyClient.write(data)
    })
})

proxyServer.listen(43434)