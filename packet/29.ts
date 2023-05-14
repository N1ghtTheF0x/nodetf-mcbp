import DataStream from "../datastream"
import ClientPacket from "./packet"

class DestroyEntity extends ClientPacket
{
    entityId: number = NaN
    constructor()
    {
        super(29)
    }
    read(buffer: DataStream): void 
    {
        this.entityId = buffer.readInt32()
    }
    write(): DataStream 
    {
        return this.createBuffer()
        .writeInt32(this.entityId)
    }
    size(): number 
    {
        return 4
    }
}

export default DestroyEntity