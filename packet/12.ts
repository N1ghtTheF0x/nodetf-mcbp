import DataStream from "../datastream"
import Flying from "./10"
import AbstractPacket from "./packet"

class PlayerLook extends Flying
{
    constructor()
    {
        super(12)
    }
    read(buffer: DataStream): void 
    {
        this.yaw = buffer.readFloat()
        this.pitch = buffer.readFloat()
        super.read(buffer)
    }
    write(): DataStream 
    {
        return this.createBuffer()    
        .writeFloat(this.yaw)
        .writeFloat(this.pitch)
        .writeBuffer(super.write().buffer)
    }
    size(): number 
    {
        return    9
    }
}

export default PlayerLook