import DataStream from "../datastream"
import AbstractPacket from "./packet"

class KeepAlive extends AbstractPacket
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