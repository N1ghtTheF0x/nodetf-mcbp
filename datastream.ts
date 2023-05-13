import NBuffer from "@nodetf/buffer/lib/buffer"

class DataStream extends NBuffer
{
    constructor(buffer: ArrayBufferLike,byteOffset?: number,byteLength?: number)
    {
        super(buffer,byteOffset,byteLength)
        this.endianness = "big"
    }
    readString8()
    {
        const length = this.readInt16()
        return this.readString(length)
    }
    writeString8(string: string)
    {
        return this.writeInt16(string.length).writeString(string)
    }
    readString16()
    {
        const length = this.readInt16()
        return this.readString(length,(buf) => String.fromCharCode(...new Int16Array(buf)))
    }
    writeString16(string: string)
    {
        return this.writeInt16(string.length).writeString(string,(s) => new Int16Array([...string].map((c) => c.charCodeAt(0))))
    }
    readBoolean()
    {
        return this.readInt8() != 0
    }
    writeBoolean(boolean: boolean)
    {
        return this.writeInt8(boolean ? 1 : 0)
    }
}

export default DataStream