import DataStream from "../datastream"
import ClientPacket from "./packet"

class KeepAlive extends ClientPacket
{
    constructor()
    {
        super(0x00)
    }
    read(stream: DataStream): void
    {
        
    }
    write()
    {
        return this.createBuffer()
    }
    size()
    {
        return 0
    }
}

export default KeepAlive