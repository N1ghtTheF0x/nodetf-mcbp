import DataStream from "../datastream"
import Flying from "./10"
import AbstractPacket from "./packet"

class PlayerLookMove extends Flying
{
    constructor()
    {
        super(13)
    }
    read(buffer: DataStream): void 
    {
        this.xPosition = buffer.readDouble()
        this.yPosition = buffer.readDouble()
        this.stance = buffer.readDouble()
        this.zPosition = buffer.readDouble()
        this.yaw = buffer.readFloat()
        this.pitch = buffer.readFloat()
        super.read(buffer)
    }
    write(): DataStream 
    {
        return this.createBuffer()
        .writeDouble(this.xPosition)
        .writeDouble(this.yPosition)
        .writeDouble(this.stance)
        .writeDouble(this.zPosition)
        .writeFloat(this.yaw)
        .writeFloat(this.pitch)
        .writeBuffer(super.write().buffer)    
    }
    size(): number 
    {
        return    41
    }
}

export default PlayerLookMove