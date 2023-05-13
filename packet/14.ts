import DataStream from "../datastream"
import AbstractPacket from "./packet"

class BlockDig extends AbstractPacket
{
    xPosition: number = NaN
    yPosition: number = NaN
    zPosition: number = NaN
    face: number = NaN
    status: number = NaN
    constructor()
    {
        super(14)
    }
    read(buffer: DataStream): void 
    {
        this.status = buffer.readInt8()
        this.xPosition = buffer.readInt32()
        this.yPosition = buffer.readInt8()
        this.zPosition = buffer.readInt32()
        this.face = buffer.readInt8()
    }
    write(): DataStream 
    {
        return this.createBuffer()    
        .writeInt8(this.status)
        .writeInt32(this.xPosition)
        .writeInt8(this.yPosition)
        .writeInt32(this.zPosition)
        .writeInt8(this.face)
    }
    size(): number 
    {
        return    11
    }
}

export default BlockDig