import DataStream from "../datastream"
import AbstractPacket from "./packet"

class Animation extends AbstractPacket
{
    entityId: number = NaN
    animate: number = NaN
    constructor()
    {
        super(18)
    }
    read(buffer: DataStream): void 
    {
        this.entityId = buffer.readInt32()
        this.animate = buffer.readInt8()
    }
    write(): DataStream 
    {
        return this.createBuffer()    
        .writeInt32(this.entityId)
        .writeInt8(this.animate)
    }
    size(): number 
    {
        return    5
    }
}

export default Animation