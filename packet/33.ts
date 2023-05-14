import DataStream from "../datastream"
import Entity from "./30"
import ClientPacket from "./packet"

class RelEntityMoveLook extends Entity
{
    constructor()
    {
        super(33)
    }
    read(buffer: DataStream): void 
    {
        super.read(buffer)
        this.xPosition = buffer.readInt8()
        this.yPosition = buffer.readInt8()
        this.zPosition = buffer.readInt8()
        this.yaw = buffer.readInt8()
        this.pitch = buffer.readInt8()
    }
    write(): DataStream 
    {
        return super.write()
        .writeInt8(this.xPosition)
        .writeInt8(this.yPosition)
        .writeInt8(this.zPosition)
        .writeInt8(this.yaw)
        .writeInt8(this.pitch)
    }
    size(): number 
    {
        return 9
    }
}

export default RelEntityMoveLook