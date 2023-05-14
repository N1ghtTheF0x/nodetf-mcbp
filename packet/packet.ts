import DataStream from "../datastream"
import { ClientPacketType } from "./types"

abstract class ClientPacket
{
    abstract size(): number
    abstract read(buffer: DataStream): void
    abstract write(): DataStream

    protected constructor(readonly id: ClientPacketType)
    {

    }

    protected createBuffer()
    {
        return new DataStream(new ArrayBuffer(this.size()))
    }
}

export default ClientPacket