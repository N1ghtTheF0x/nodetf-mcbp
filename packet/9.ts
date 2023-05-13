import DataStream from "../datastream"
import AbstractPacket from "./packet"

class Respawn extends AbstractPacket
{
    field_28048_a: number = NaN
    constructor()
    {
        super(0x09)
    }
    read(buffer: DataStream): void 
    {
        this.field_28048_a = buffer.readInt8()    
    }
    write(): DataStream 
    {
        return this.createBuffer()
        .writeInt8(this.field_28048_a)    
    }
    size(): number 
    {
        return 1    
    }
}

export default Respawn