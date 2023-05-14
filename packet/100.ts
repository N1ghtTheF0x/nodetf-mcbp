import DataStream from "../datastream"
import AbstractPacket from "./packet"

class OpenWindow extends AbstractPacket
{
    windowId: number = NaN
    inventoryType: number = NaN
    windowTitle: string = String()
    slotsCount: number = NaN
    constructor()
    {
        super(100)
    }
    read(buffer: DataStream): void 
    {
        this.windowId = buffer.readInt8()
        this.inventoryType = buffer.readInt8()
        this.windowTitle = buffer.readString8()
        this.slotsCount = buffer.readInt8()
    }
    write(): DataStream 
    {
        return this.createBuffer()
        .writeInt8(this.windowId)
        .writeInt8(this.inventoryType)
        .writeString8(this.windowTitle)
        .writeInt8(this.slotsCount)
    }
    size(): number 
    {
        return 3 + this.windowTitle.length
    }
}

export default OpenWindow