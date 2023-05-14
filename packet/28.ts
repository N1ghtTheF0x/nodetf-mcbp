import DataStream from "../datastream"
import ClientPacket from "./packet"

class EntityVelocity extends ClientPacket
{
    entityId: number = NaN
    motionX: number = NaN
    motionY: number = NaN
    motionZ: number = NaN
    constructor()
    {
        super(28)
    }
    read(buffer: DataStream): void 
    {
        this.entityId = buffer.readInt32()
        this.motionX = buffer.readInt16()
        this.motionY = buffer.readInt16()
        this.motionZ = buffer.readInt16()
    }
    write(): DataStream 
    {
        return this.createBuffer()
        .writeInt32(this.entityId)
        .writeInt16(this.motionX)
        .writeInt16(this.motionY)
        .writeInt16(this.motionZ)
    }
    size(): number 
    {
        return 10
    }
}

export default EntityVelocity