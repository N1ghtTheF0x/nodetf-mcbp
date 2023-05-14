import DataStream from "../datastream"
import ClientPacket from "./packet"

class Position extends ClientPacket
{
    field_22039_a: number = NaN
    field_22038_b: number = NaN
    field_22043_c: boolean = false
    field_22042_d: boolean = false
    field_22041_e: number = NaN
    field_22040_f: number = NaN
    constructor()
    {
        super(27)
    }
    read(buffer: DataStream): void 
    {
        this.field_22039_a = buffer.readFloat()
        this.field_22038_b = buffer.readFloat()
        this.field_22041_e = buffer.readFloat()
        this.field_22040_f = buffer.readFloat()
        this.field_22043_c = buffer.readBoolean()
        this.field_22042_d = buffer.readBoolean()
    }
    write(): DataStream 
    {
        return this.createBuffer()    
        .writeFloat(this.field_22039_a)
        .writeFloat(this.field_22038_b)
        .writeFloat(this.field_22041_e)
        .writeFloat(this.field_22040_f)
        .writeBoolean(this.field_22043_c)
        .writeBoolean(this.field_22042_d)
    }
    size(): number 
    {
        return    18
    }
}

export default Position