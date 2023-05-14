import DataStream from "../datastream"
import ItemStack from "../itemstack"
import AbstractPacket from "./packet"

class WindowClick extends AbstractPacket
{
    window_Id: number = NaN
    inventorySlot: number = NaN
    mouseClick: number = NaN
    action: number = NaN
    itemStack: ItemStack | null = null
    field_27050_f: boolean = false
    constructor()
    {
        super(102)
    }
    read(buffer: DataStream): void 
    {
        this.window_Id = buffer.readInt8()
        this.inventorySlot = buffer.readInt16()
        this.mouseClick = buffer.readInt8()
        this.action = buffer.readInt16()
        this.field_27050_f = buffer.readBoolean()
        const type = buffer.readInt16()
        if(type >= 0) this.itemStack = new ItemStack(type,buffer.readInt8(),buffer.readInt16())
        else this.itemStack = null
    }
    write(): DataStream 
    {
        const b = this.createBuffer()
        .writeInt8(this.window_Id)
        .writeInt16(this.inventorySlot)
        .writeInt8(this.mouseClick)
        .writeInt16(this.action)
        .writeBoolean(this.field_27050_f)
        return this.itemStack == null ? b.writeInt16(-1) : b.writeInt16(this.itemStack.itemID)
        .writeInt8(this.itemStack.stackSize)
        .writeInt16(this.itemStack.itemDamage)
    }
    size(): number 
    {
        return 9 + (this.itemStack != null ? 3 : 0)
    }
}

export default WindowClick