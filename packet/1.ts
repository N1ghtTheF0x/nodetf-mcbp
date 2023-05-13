import DataStream from "../datastream"
import AbstractPacket from "./packet"

class Login extends AbstractPacket
{
    protocolVersion: number = NaN
    username: string = String()
    mapSeed: bigint = 0n
    dimension: number = NaN
    constructor()
    {
        super(0x1)
    }
    read(stream: DataStream): void
    {
        this.protocolVersion = stream.readInt32()
        this.username = stream.readString16()
        this.mapSeed = stream.readInt64()
        this.dimension = stream.readInt8()
    }
    write()
    {
        return this.createBuffer()
        .writeInt32(this.protocolVersion)
        .writeString16(this.username.substring(0,16))
        .writeInt64(this.mapSeed)
        .writeInt8(this.dimension)
    }
    size()
    {
        return 4 + this.username.length + 4 + 5
    }
}

namespace Login
{
    
}

export default Login