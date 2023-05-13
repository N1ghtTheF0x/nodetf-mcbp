import DataStream from "../datastream"
import AbstractPacket from "./packet"

class EntityAction extends AbstractPacket
{
    entityId: number = NaN
    state: number = NaN
    constructor()
    {
        super(19)
    }
    read(buffer: DataStream): void 
    {
        this.entityId = buffer.readInt32()
        this.state = buffer.readInt8()
    }
    write(): DataStream 
    {
        return this.createBuffer()    
        .writeInt32(this.entityId)
        .writeInt8(this.state)
    }
    size(): number 
    {
        return    5
    }
}

export default EntityAction