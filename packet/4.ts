import DataStream from "../datastream"
import ClientPacket from "./packet"

class UpdateTime extends ClientPacket
{
    time: bigint = 0n
    constructor()
    {
        super(0x04)
    }
    read(buffer: DataStream)
    {
        this.time = buffer.readInt64()
    }
    write(): DataStream 
    {
        return this.createBuffer()
        .writeInt64(this.time)    
    }
    size(): number 
    {
        return 8    
    }
}

export default UpdateTime