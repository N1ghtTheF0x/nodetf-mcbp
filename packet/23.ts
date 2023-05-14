import DataStream from "../datastream"
import ClientPacket from "./packet"

class VehicleSpawn extends ClientPacket
{
    entityId: number = NaN
    xPosition: number = NaN
    yPosition: number = NaN
    zPosition: number = NaN
    field_28047_e: number = NaN
    field_28046_f: number = NaN
    field_28045_g: number = NaN
    type: number = NaN
    field_28044_i: number = NaN
    constructor()
    {
        super(23)
    }
    read(buffer: DataStream): void 
    {
        this.entityId = buffer.readInt32()
        this.type = buffer.readInt8()
        this.xPosition = buffer.readInt32()
        this.yPosition = buffer.readInt32()
        this.zPosition = buffer.readInt32()
        this.field_28044_i = buffer.readInt32()
        if(this.field_28044_i > 0)
        {
            this.field_28047_e = buffer.readInt16()
            this.field_28046_f = buffer.readInt16()
            this.field_28045_g = buffer.readInt16()
        }
    }
    write(): DataStream 
    {
        const buffer = this.createBuffer()
        .writeInt32(this.entityId)
        .writeInt8(this.type)
        .writeInt32(this.xPosition)
        .writeInt32(this.yPosition)
        .writeInt32(this.zPosition)
        .writeInt32(this.field_28044_i)
        return this.field_28044_i > 0 ? buffer
        .writeInt16(this.field_28047_e)
        .writeInt16(this.field_28046_f)
        .writeInt16(this.field_28045_g) : buffer
    }
    size(): number 
    {
        return 21 + this.field_28044_i > 0 ? 6 : 0
    }
}

export default VehicleSpawn