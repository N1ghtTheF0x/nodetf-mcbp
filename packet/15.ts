import DataStream from "../datastream"
import ItemStack from "../itemstack"
import AbstractPacket from "./packet"

class Place extends AbstractPacket
{
    xPosition: number = NaN
    yPosition: number = NaN
    zPosition: number = NaN
    direction: number = NaN
    itemStack: ItemStack | null = null
    constructor()
    {
        super(15)
    }
    read(buffer: DataStream): void 
    {
        this.xPosition = buffer.readInt32()
        this.yPosition = buffer.readInt8()
        this.zPosition = buffer.readInt32()
        this.direction = buffer.readInt8()
        const id = buffer.readInt16()
        if(id >= 0) this.itemStack = new ItemStack(id,buffer.readInt8(),buffer.readInt16())
        else this.itemStack = null
    }
    write(): DataStream 
    {
        const buffer = this.createBuffer()    
        .writeInt32(this.xPosition)
        .writeInt8(this.yPosition)
        .writeInt32(this.zPosition)
        .writeInt8(this.direction)

        return this.itemStack == null ? buffer.writeInt8(-1) : buffer
        .writeInt16(this.itemStack.itemID)
        .writeInt8(this.itemStack.stackSize)
        .writeInt16(this.itemStack.itemDamage)
    }
    size(): number 
    {
        return 15
    }
}

export default Place