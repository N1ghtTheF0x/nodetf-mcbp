import DataStream from "../datastream"
import Entity from "./30"
import ClientPacket from "./packet"

class RelEntityMove extends Entity
{
    constructor()
    {
        super(31)
    }
    read(buffer: DataStream): void 
    {
        super.read(buffer)
        this.xPosition = buffer.readInt8()
        this.yPosition = buffer.readInt8()
        this.zPosition = buffer.readInt8()
    }
    write(): DataStream 
    {
        return super.write()
        .writeInt8(this.xPosition)
        .writeInt8(this.yPosition)
        .writeInt8(this.zPosition)
    }
    size(): number 
    {
        return 7
    }
}

export default RelEntityMove