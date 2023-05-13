import DataStream from "../datastream"
import AbstractPacket from "./packet"

class NamedEntitySpawn extends AbstractPacket
{
    entityId: number = NaN
    name: string = String()
    xPosition: number = NaN
    yPosition: number = NaN
    zPosition: number = NaN
    rotation: number = NaN
    pitch: number = NaN
    currentItem: number = NaN
    constructor()
    {
        super(20)
    }
    read(buffer: DataStream): void 
    {
        this.entityId = buffer.readInt32()
        this.name = buffer.readString16()
        this.xPosition = buffer.readInt32()
        this.yPosition = buffer.readInt32()
        this.zPosition = buffer.readInt32()
        this.rotation = buffer.readInt8()
        this.pitch = buffer.readInt8()
        this.currentItem = buffer.readInt16()
    }
    write(): DataStream 
    {
        return this.createBuffer()    
        .writeInt32(this.entityId)
        .writeString16(this.name.substring(0,16))
        .writeInt32(this.xPosition)
        .writeInt32(this.yPosition)
        .writeInt32(this.zPosition)
        .writeInt8(this.rotation)
        .writeInt8(this.pitch)
        .writeInt16(this.currentItem)
    }
    size(): number 
    {
        return    28
    }
}

export default NamedEntitySpawn