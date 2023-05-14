import DataStream from "../datastream"
import ClientPacket from "./packet"

class PreChunk extends ClientPacket
{
    xPosition: number = NaN
    yPosition: number = NaN
    mode: boolean = false
    constructor()
    {
        super(50)
    }
    read(buffer: DataStream): void 
    {
        this.xPosition = buffer.readInt32()
        this.yPosition = buffer.readInt32()
        this.mode = buffer.readBoolean()
    }
    write(): DataStream 
    {
        return this.createBuffer()
        .writeInt32(this.xPosition)
        .writeInt32(this.yPosition)
        .writeBoolean(this.mode)
    }
    size(): number 
    {
        return 9
    }
}

export default PreChunk