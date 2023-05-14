import DataStream from "../datastream"
import ClientPacket from "./packet"

class BlockChange extends ClientPacket
{
    xPosition: number = NaN
    yPosition: number = NaN
    zPosition: number = NaN
    type: number = NaN
    metadata: number = NaN
    constructor()
    {
        super(53)
    }
    read(buffer: DataStream): void 
    {
        this.xPosition = buffer.readInt32()
        this.yPosition = buffer.readInt8()
        this.zPosition = buffer.readInt32()
        this.type = buffer.readInt8()
        this.metadata = buffer.readInt8()
    }
    write(): DataStream 
    {
        return this.createBuffer()
        .writeInt32(this.xPosition)
        .writeInt8(this.yPosition)
        .writeInt32(this.zPosition)
        .writeInt8(this.type)
        .writeInt8(this.metadata)
    }
    size(): number 
    {
        return 11
    }
}

export default BlockChange