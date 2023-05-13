import DataStream from "../datastream"
import AbstractPacket from "./packet"
import Packets, {Type as PacketType, PACKET_MAP, PacketMap, Packet} from "./types"

export function readPackets(data: Buffer)
{
    const stream = new DataStream(data)
    const packets: (Packets | null)[] = []
    while(stream.readOffset < stream.byteLength)
    {
        const type = stream.readUInt8() as PacketType
        try
        {
            const clazz = PACKET_MAP[type]
            const packet: AbstractPacket = new clazz()
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

function __calcSize(packets: (Packets | null)[])
{
    var size = 0
    for(const packet of packets)
        if(packet) size += (1 + packet.size())
    return size
}

export function writePackets(packets: (Packets | null)[]): DataStream
{
    const stream = new DataStream(Buffer.alloc(__calcSize(packets)))
    for(const packet of packets)
        if(packet) stream.writeBuffer(packet.write().buffer)
    return stream
}

export function isPacket<Type extends PacketType>(packet: Packets,type: Type): packet is Packet<Type>
{
    return packet.id == type
}