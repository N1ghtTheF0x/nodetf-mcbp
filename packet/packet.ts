import DataStream from "../datastream"
import { Type as PacketType } from "./types"

abstract class AbstractPacket
{
    abstract size(): number
    abstract read(buffer: DataStream): void
    abstract write(): DataStream

    protected constructor(readonly id: PacketType)
    {

    }

    protected createBuffer()
    {
        return new DataStream(new ArrayBuffer(this.size()))
    }
}

export default AbstractPacket