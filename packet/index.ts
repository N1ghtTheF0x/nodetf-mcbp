import DataStream from "../datastream"
import {ClientPacketType, CLIENT_PACKET_MAP, ClientPacketMap, ClientPacket} from "./types"

export function readClientPackets(data: Buffer)
{
    const stream = new DataStream(data)
    const packets: (ClientPacket | null)[] = []
    while(stream.readOffset < stream.byteLength)
    {
        const type = stream.readUInt8() as ClientPacketType
        try
        {
            const clazz = CLIENT_PACKET_MAP[type]
            const packet: ClientPacket = new clazz()
            packet.read(stream)
            packets.push(packet)
        }
        catch(e)
        {
            console.error(e)
            packets.push(null)
        }
    }
    return packets
}

function __calcSize(packets: (ClientPacket | null)[])
{
    var size = 0
    for(const packet of packets)
        if(packet) size += (1 + packet.size())
    return size
}

export function writeClientPackets(packets: (ClientPacket | null)[]): DataStream
{
    const stream = new DataStream(Buffer.alloc(__calcSize(packets)))
    for(const packet of packets)
        if(packet) stream.writeBuffer(packet.write().buffer)
    return stream
}

export function isClientPacket<Type extends ClientPacketType>(packet: ClientPacket,type: Type): packet is ClientPacket<Type>
{
    return packet.id == type
}