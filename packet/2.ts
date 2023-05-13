import DataStream from "../datastream"
import AbstractPacket from "./packet"

class Handshake extends AbstractPacket
{
    username: string = String()
    constructor()
    {
        super(0x02)
    }
    read(buffer: DataStream): void 
    {
        this.username = buffer.readString16()    
    }
    write(): DataStream 
    {
        return this.createBuffer()
        .writeString16(this.username.substring(0,32))    
    }
    size(): number 
    {
        return 4 + this.username.substring(0,32).length + 4    
    }
}

export default Handshake