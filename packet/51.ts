import DataStream from "../datastream"
import ClientPacket from "./packet"

class MapChunk extends ClientPacket
{
    xPosition: number = NaN
    yPosition: number = NaN
    zPosition: number = NaN
    xSize: number = NaN
    ySize: number = NaN
    zSize: number = NaN
    chunk: ArrayBuffer = new ArrayBuffer(0)
    chunkSize: number = NaN
    constructor()
    {
        super(51)
    }
    read(buffer: DataStream): void 
    {
        this.xPosition = buffer.readInt32()
        this.yPosition = buffer.readInt16()
        this.zPosition = buffer.readInt32()
        this.xSize = buffer.readInt8() + 1
        this.ySize = buffer.readInt8() + 1
        this.zSize = buffer.readInt8() + 1
        this.chunkSize = buffer.readInt32()
        const chunk = buffer.readBuffer(this.chunkSize)
        try
        {
            const { inflateSync } = require("node:zlib")
            this.chunk = new Uint8Array(inflateSync(chunk)).buffer
        }
        catch(e)
        {
            console.warn("Can't inflate Chunk!")
            this.chunk = chunk
        }
    }
    write(): DataStream 
    {
        var chunk: ArrayBuffer = new ArrayBuffer(this.chunkSize)
        try
        {
            const { deflateSync } = require("node:zlib")
            chunk = new Uint8Array(deflateSync(this.chunk)).buffer
        }
        catch(e)
        {
            console.warn("Can't deflate Chunk!")
        }
        return this.createBuffer()
        .writeInt32(this.xPosition)
        .writeInt16(this.yPosition)
        .writeInt32(this.zPosition)
        .writeInt8(this.xSize - 1)
        .writeInt8(this.ySize - 1)
        .writeInt8(this.zSize - 1)
        .writeInt32(this.chunkSize)
        .writeBuffer(chunk)
    }
    size(): number 
    {
        return 17 + this.chunkSize
    }
}

export default MapChunk