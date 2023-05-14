import DataStream from "../datastream"
import ClientPacket from "./packet"

class PlayerInventory extends ClientPacket
{
    entityID: number = NaN
    slot: number = NaN
    itemID: number = NaN
    itemDamage: number = NaN
    constructor()
    {
        super(0x05)
    }
    read(buffer: DataStream): void 
    {
        this.entityID = buffer.readInt32()
        this.slot = buffer.readInt16()
        this.itemID = buffer.readInt16()
        this.itemDamage = buffer.readInt16()    
    }
    write(): DataStream 
    {
        return this.createBuffer()
        .writeInt32(this.entityID)
        .writeInt16(this.slot)
        .writeInt16(this.itemID)
        .writeInt16(this.itemDamage)    
    }
    size(): number 
    {
        return 8
    }
}

export default PlayerInventory