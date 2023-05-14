import DataStream from "../datastream"
import ClientPacket from "./packet"

class BlockItemSwitch extends ClientPacket
{
    itemID: number = NaN
    constructor()
    {
        super(16)
    }
    read(buffer: DataStream): void 
    {
        this.itemID = buffer.readInt16()
    }
    write(): DataStream 
    {
        return this.createBuffer()   
        .writeInt16(this.itemID) 
    }
    size(): number 
    {
        return    2
    }
}

export default BlockItemSwitch