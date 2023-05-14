import DataStream from "../datastream"
import ClientPacket from "./packet"

class DoorChange extends ClientPacket
{
    field_28050_a: number = NaN
    field_28049_b: number = NaN
    field_28053_c: number = NaN
    field_28052_d: number = NaN
    field_28051_e: number = NaN
    constructor()
    {
        super(61)
    }
    read(buffer: DataStream): void 
    {
        this.field_28050_a = buffer.readInt32()
        this.field_28053_c = buffer.readInt32()
        this.field_28052_d = buffer.readInt8()
        this.field_28051_e = buffer.readInt32()
        this.field_28049_b = buffer.readInt32()
    }
    write(): DataStream 
    {
        return this.createBuffer()
        .writeInt32(this.field_28050_a)
        .writeInt32(this.field_28053_c)
        .writeInt8(this.field_28052_d)
        .writeInt32(this.field_28051_e)
        .writeInt32(this.field_28049_b)
    }
    size(): number 
    {
        return 20
    }
}

export default DoorChange