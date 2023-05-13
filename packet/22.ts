import DataStream from "../datastream"
import AbstractPacket from "./packet"

class Collect extends AbstractPacket
{
    collectedEntityId: number = NaN
    collectorEntityId: number = NaN
    constructor()
    {
        super(22)
    }
    read(buffer: DataStream): void 
    {
        this.collectedEntityId = buffer.readInt32()
        this.collectorEntityId = buffer.readInt32()
    }
    write(): DataStream 
    {
        return this.createBuffer()    
        .writeInt32(this.collectedEntityId)
        .writeInt32(this.collectorEntityId)
    }
    size(): number 
    {
        return    8
    }
}

export default Collect