import DataStream from "../datastream"
import AbstractPacket from "./packet"

class PickupSpawn extends AbstractPacket
{
    entityId: number = NaN
    xPosition: number = NaN
    yPosition: number = NaN
    zPosition: number = NaN
    rotation: number = NaN
    pitch: number = NaN
    roll: number = NaN
    itemID: number = NaN
    count: number = NaN
    itemDamage: number = NaN
    constructor()
    {
        super(21)
    }
    read(buffer: DataStream): void 
    {
        this.entityId = buffer.readInt32()
        this.itemID = buffer.readInt16()
        this.count = buffer.readInt8()
        this.itemDamage = buffer.readInt16()
        this.xPosition = buffer.readInt32()
        this.yPosition = buffer.readInt32()
        this.zPosition = buffer.readInt32()
        this.rotation = buffer.readInt8()
        this.pitch = buffer.readInt8()
        this.roll = buffer.readInt8()
    }
    write(): DataStream 
    {
        return this.createBuffer()    
        .writeInt32(this.entityId)
        .writeInt16(this.itemID)
        .writeInt8(this.count)
        .writeInt16(this.itemDamage)
        .writeInt32(this.xPosition)
        .writeInt32(this.yPosition)
        .writeInt32(this.zPosition)
        .writeInt8(this.rotation)
        .writeInt8(this.pitch)
        .writeInt8(this.roll)
    }
    size(): number 
    {
        return    24
    }
}

export default PickupSpawn