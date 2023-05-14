import DataStream from "../datastream"
import ClientPacket from "./packet"

class EntityStatus extends ClientPacket
{
    entityId: number = NaN
    entityStatus: number = NaN
    constructor()
    {
        super(38)
    }
    read(buffer: DataStream): void 
    {
        this.entityId = buffer.readInt32()
        this.entityStatus = buffer.readInt8()
    }
    write(): DataStream 
    {
        return this.createBuffer()
        .writeInt32(this.entityId)
        .writeInt8(this.entityStatus)
    }
    size(): number 
    {
        return 5
    }
}

export default EntityStatus