import DataStream from "../datastream"
import ClientPacket from "./packet"
import { Type } from "./types"

class Entity extends ClientPacket
{
    entityId: number = NaN
    xPosition: number = NaN
    yPosition: number = NaN
    zPosition: number = NaN
    yaw: number = NaN
    pitch: number = NaN
    rotating: boolean = false
    constructor(id: Type = 30)
    {
        super(id)
    }
    read(buffer: DataStream): void 
    {
        this.entityId = buffer.readInt32()
    }
    write(): DataStream 
    {
        return this.createBuffer()
        .writeInt32(this.entityId)
    }
    size(): number 
    {
        return 4
    }
}

export default Entity