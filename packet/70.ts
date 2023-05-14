import DataStream from "../datastream"
import ClientPacket from "./packet"

class Bed extends ClientPacket
{
    field_25019_b: number = NaN
    constructor()
    {
        super(70)
    }
    read(buffer: DataStream): void 
    {
        this.field_25019_b = buffer.readInt8()   
    }
    write(): DataStream 
    {
        return this.createBuffer()
        .writeInt8(this.field_25019_b)
    }
    size(): number 
    {
        return 1
    }
}

export default Bed