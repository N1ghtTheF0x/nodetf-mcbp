import DataStream from "../datastream"
import AbstractPacket from "./packet"

class UpdateHealth extends AbstractPacket
{
    healthMP: number = NaN
    constructor()
    {
        super(0x08)
    }
    read(buffer: DataStream): void 
    {
        this.healthMP = buffer.readInt16()    
    }
    write(): DataStream 
    {
        return this.createBuffer()
        .writeInt16(this.healthMP)
    }
    size(): number 
    {
        return 2
    }
}

export default UpdateHealth