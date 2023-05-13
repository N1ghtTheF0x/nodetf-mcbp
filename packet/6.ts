import DataStream from "../datastream"
import AbstractPacket from "./packet"

class SpawnPosition extends AbstractPacket
{
    xPosition: number = NaN
    yPosition: number = NaN
    zPosition: number = NaN
    constructor()
    {
        super(0x06)
    }
    read(buffer: DataStream): void 
    {
        this.xPosition = buffer.readInt32()
        this.yPosition = buffer.readInt32()
        this.zPosition = buffer.readInt32()    
    }
    write(): DataStream 
    {
        return this.createBuffer()
        .writeInt32(this.xPosition)
        .writeInt32(this.yPosition)
        .writeInt32(this.zPosition)    
    }
    size(): number 
    {
        return 12
    }
}

export default SpawnPosition