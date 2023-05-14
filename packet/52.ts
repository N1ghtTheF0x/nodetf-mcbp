import DataStream from "../datastream"
import ClientPacket from "./packet"

class MultiBlockChange extends ClientPacket
{
    xPosition: number = NaN
    zPosition: number = NaN
    coordinateArray: number[] = []
    typeArray: number[] = []
    metadataArray: number[] = []
    arraySize: number = NaN
    constructor()
    {
        super(52)
    }
    read(buffer: DataStream): void 
    {
        this.xPosition = buffer.readInt32()
        this.zPosition = buffer.readInt32()
        this.arraySize = buffer.readInt16()
        this.coordinateArray = buffer.readArray("sint16",this.arraySize)
        this.typeArray = buffer.readArray("sint8",this.arraySize)
        this.metadataArray = buffer.readArray("sint8",this.arraySize)
    }
    write(): DataStream 
    {
        return this.createBuffer()
        .writeInt32(this.xPosition)
        .writeInt32(this.zPosition)
        .writeInt16(this.arraySize)
        .writeArray("sint16",this.coordinateArray)
        .writeArray("sint8",this.typeArray)
        .writeArray("sint8",this.metadataArray)
    }
    size(): number 
    {
        return 10 + this.arraySize * 4
    }
}

export default MultiBlockChange