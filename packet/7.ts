import DataStream from "../datastream"
import AbstractPacket from "./packet"

class UseEntity extends AbstractPacket
{
    playerEntityId: number = NaN
    targetEntity: number = NaN
    isLeftClick: number = NaN
    constructor()
    {
        super(0x07)
    }
    read(buffer: DataStream): void 
    {
        this.playerEntityId = buffer.readInt32()
        this.targetEntity = buffer.readInt32()
        this.isLeftClick = buffer.readInt8()    
    }
    write(): DataStream 
    {
        return this.createBuffer()
        .writeInt32(this.playerEntityId)
        .writeInt32(this.targetEntity)
        .writeInt8(this.isLeftClick)    
    }
    size(): number 
    {
        return 9
    }
}

export default UseEntity