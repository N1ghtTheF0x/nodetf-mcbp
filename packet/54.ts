import DataStream from "../datastream"
import ClientPacket from "./packet"

class PlayNoteBlock extends ClientPacket
{
    xLocation: number = NaN
    yLocation: number = NaN
    zLocation: number = NaN
    instrumentType: number = NaN
    pitch: number = NaN
    constructor()
    {
        super(54)
    }
    read(buffer: DataStream): void 
    {
        this.xLocation = buffer.readInt32()
        this.yLocation = buffer.readInt16()
        this.zLocation = buffer.readInt32()
        this.instrumentType = buffer.readInt8()
        this.pitch = buffer.readInt8()
    }
    write(): DataStream 
    {
        return this.createBuffer()
        .writeInt32(this.xLocation)
        .writeInt8(this.yLocation)
        .writeInt32(this.zLocation)
        .writeInt8(this.instrumentType)
        .writeInt8(this.pitch)
    }
    size(): number 
    {
        return 12
    }
}

export default PlayNoteBlock