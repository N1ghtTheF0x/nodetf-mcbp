import DataStream from "../datastream"
import Entity from "./30"
import ClientPacket from "./packet"

class EntityLook extends Entity
{
    constructor()
    {
        super(32)
    }
    read(buffer: DataStream): void 
    {
        super.read(buffer)
        this.yaw = buffer.readInt8()
        this.pitch = buffer.readInt8()
    }
    write(): DataStream 
    {
        return super.write()
        .writeInt8(this.yaw)
        .writeInt8(this.pitch)
    }
    size(): number 
    {
        return 6
    }
}

export default EntityLook