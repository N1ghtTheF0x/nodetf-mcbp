import DataStream from "../datastream"
import Flying from "./10"
import AbstractPacket from "./packet"

class PlayerPosition extends Flying
{
    constructor()
    {
        super(11)
    }
    read(buffer: DataStream): void 
    {
        this.xPosition = buffer.readDouble()
        this.yPosition = buffer.readDouble()
        this.stance = buffer.readDouble()
        this.zPosition = buffer.readDouble()
    }
    write(): DataStream 
    {
        return this.createBuffer()    
        .writeDouble(this.xPosition)
        .writeDouble(this.yPosition)
        .writeDouble(this.stance)
        .writeDouble(this.zPosition)
    }
    size(): number 
    {
        return    33
    }
}

export default PlayerPosition