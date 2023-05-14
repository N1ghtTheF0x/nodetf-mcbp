import DataStream from "../datastream"
import ClientPacket from "./packet"

class EntityTeleport extends ClientPacket
{
    entityId: number = NaN
    xPosition: number = NaN
    yPosition: number = NaN
    zPosition: number = NaN
    yaw: number = NaN
    pitch: number = NaN
    constructor()
    {
        super(34)
    }
    read(buffer: DataStream): void 
    {
        this.entityId = buffer.readInt32()
        this.xPosition = buffer.readInt32()
        this.yPosition = buffer.readInt32()
        this.zPosition = buffer.readInt32()
        this.yaw = buffer.readInt8()
        this.pitch = buffer.readInt8()
    }
    write(): DataStream 
    {
        return this.createBuffer()
        .writeInt32(this.entityId)
        .writeInt32(this.xPosition)
        .writeInt32(this.yPosition)
        .writeInt32(this.zPosition)
        .writeInt8(this.yaw)
        .writeInt8(this.pitch)
    }
    size(): number 
    {
        return 34
    }
}

export default EntityTeleport