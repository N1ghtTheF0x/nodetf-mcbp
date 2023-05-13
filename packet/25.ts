import DataStream from "../datastream"
import AbstractPacket from "./packet"

class EntityPainting extends AbstractPacket
{
    entityId: number = NaN
    xPosition: number = NaN
    yPosition: number = NaN
    zPosition: number = NaN
    direction: number = NaN
    title: string = String()
    constructor()
    {
        super(25)
    }
    read(buffer: DataStream): void 
    {
        this.entityId = buffer.readInt32()
        this.title = buffer.readString16()
        this.xPosition = buffer.readInt32()
        this.yPosition = buffer.readInt32()
        this.zPosition = buffer.readInt32()
        this.direction = buffer.readInt32()
    }
    write(): DataStream 
    {
        return this.createBuffer()    
        .writeInt32(this.entityId)
        .writeString16(this.title)
        .writeInt32(this.xPosition)
        .writeInt32(this.yPosition)
        .writeInt32(this.zPosition)
        .writeInt32(this.direction)
    }
    size(): number 
    {
        return    24
    }
}

export default EntityPainting