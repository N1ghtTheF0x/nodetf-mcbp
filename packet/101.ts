import DataStream from "../datastream"
import AbstractPacket from "./packet"

class CloseWindow extends AbstractPacket
{
    windowId: number = NaN
    constructor()
    {
        super(101)
    }
    read(buffer: DataStream): void 
    {
        this.windowId = buffer.readInt8()
    }
    write(): DataStream 
    {
        return this.createBuffer()
        .writeInt8(this.windowId)
    }
    size(): number 
    {
        return 1
    }
}

export default CloseWindow