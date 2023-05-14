import DataStream from "../datastream"
import ClientPacket from "./packet"

class Weather extends ClientPacket
{
    field_27054_a: number = NaN
    field_27055_e: number = NaN
    field_27053_b: number = NaN
    field_27057_c: number = NaN
    field_27056_d: number = NaN
    constructor()
    {
        super(71)
    }
    read(buffer: DataStream): void 
    {
        this.field_27054_a = buffer.readInt32()
        this.field_27055_e = buffer.readInt8()
        this.field_27053_b = buffer.readInt32()
        this.field_27057_c = buffer.readInt32()
        this.field_27056_d = buffer.readInt32()
    }
    write(): DataStream 
    {
        return this.createBuffer()
        .writeInt32(this.field_27054_a)
        .writeInt8(this.field_27055_e)
        .writeInt32(this.field_27053_b)
        .writeInt32(this.field_27057_c)
        .writeInt32(this.field_27056_d)
    }
    size(): number 
    {
        return 17
    }
}

export default Weather