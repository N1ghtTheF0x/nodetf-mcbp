import DataStream from "../datastream"
import ClientPacket from "./packet"

class AttachEntity extends ClientPacket
{
    entityId: number = NaN
    vehicleEntityId: number = NaN
    constructor()
    {
        super(39)
    }
    read(buffer: DataStream): void 
    {
        this.entityId = buffer.readInt32()
        this.vehicleEntityId = buffer.readInt32()
    }
    write(): DataStream 
    {
        return this.createBuffer()
        .writeInt32(this.entityId)
        .writeInt32(this.vehicleEntityId)
    }
    size(): number 
    {
        return 8
    }
}

export default AttachEntity