import DataStream from "../datastream"
import ClientPacket from "./packet"

class Sleep extends ClientPacket
{
    field_22045_a: number = NaN
    field_22044_b: number = NaN
    field_22048_c: number = NaN
    field_22047_d: number = NaN
    field_22046_e: number = NaN
    constructor()
    {
        super(17)
    }
    read(buffer: DataStream): void 
    {
        this.field_22045_a = buffer.readInt32()
        this.field_22046_e = buffer.readInt8()
        this.field_22044_b = buffer.readInt32()
        this.field_22048_c = buffer.readInt8()
        this.field_22047_d = buffer.readInt32()
    }
    write(): DataStream 
    {
        return this.createBuffer()    
        .writeInt32(this.field_22045_a)
        .writeInt8(this.field_22046_e)
        .writeInt32(this.field_22044_b)
        .writeInt8(this.field_22048_c)
        .writeInt32(this.field_22047_d)
    }
    size(): number 
    {
        return    14
    }
}

export default Sleep