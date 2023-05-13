import DataStream from "../datastream"
import AbstractPacket from "./packet"
import { Type } from "./types"

class Flying extends AbstractPacket
{
    xPosition: number = NaN
    yPosition: number = NaN
    zPosition: number = NaN
    stance: number = NaN
    yaw: number = NaN
    pitch: number = NaN
    onGround: boolean = false
    moving: boolean = false
    rotating: boolean = false
    constructor(id: Type = 0x0A)
    {
        super(id)
    }
    read(buffer: DataStream): void 
    {
        this.onGround = buffer.readBoolean()    
    }
    write(): DataStream 
    {
        return this.createBuffer()
        .writeBoolean(this.onGround)    
    }
    size(): number 
    {
        return 1
    }
}

export default Flying