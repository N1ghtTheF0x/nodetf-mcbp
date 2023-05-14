import DataStream from "../datastream"
import ClientPacket from "./packet"

class Chat extends ClientPacket
{
    message: string = String()
    constructor()
    {
        super(0x03)
    }
    read(buffer: DataStream): void 
    {
        this.message = buffer.readString16()    
    }
    write(): DataStream 
    {
        return this.createBuffer()
        .writeString16(this.message.substring(0,119))    
    }
    size(): number 
    {
        return this.message.substring(0,119).length    
    }
}

export default Chat