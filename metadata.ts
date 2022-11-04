import NBuffer from "@nodetf/buffer"

class Metadata
{
    constructor(readonly type: Metadata.Type,readonly bitmask: number,readonly data: Metadata.TypeMap[Metadata["type"]])
    {

    }
}

namespace Metadata
{
    export enum Type
    {
        None = -1,
        Byte,
        Short,
        Int,
        Float,
        String,
        Item,
        Vector
    }
    export interface TypeMap
    {
        [Type.None]: never
        [Type.Byte]: number
        [Type.Short]: number
        [Type.Int]: number
        [Type.Float]: number
        [Type.String]: string
        [Type.Item]: {id: number,count: number,damage: number}
        [Type.Vector]: {x: number,y: number,z: number}
    }
    export function read(buffer: NBuffer)
    {
        const arr: Metadata[] = []
        for(var index = buffer.readInt8();index != 127;index = buffer.readInt8())
        {
            const type: Type = (index & 0xe0) >> 5
            const bitmask = index & 0x1f
            switch(type)
            {
                case Type.Byte:
                    arr.push(new Metadata(Type.Byte,bitmask,buffer.readInt8()))
                    break
                case Type.Short:
                    arr.push(new Metadata(Type.Short,bitmask,buffer.readInt16()))
                    break
                case Type.Int:
                    arr.push(new Metadata(Type.Int,bitmask,buffer.readInt32()))
                    break
                case Type.Float:
                    arr.push(new Metadata(Type.Float,bitmask,buffer.readFloat()))
                    break
                case Type.Item:
                    arr.push(new Metadata(Type.Item,bitmask,{
                        id: buffer.readInt16(),
                        count: buffer.readInt8(),
                        damage: buffer.readInt16()
                    }))
                    break
                case Type.Vector:
                    arr.push(new Metadata(Type.Vector,bitmask,{
                        x: buffer.readInt32(),
                        y: buffer.readInt32(),
                        z: buffer.readInt32()
                    }))
                    break
            }
        }
        return arr
    }
}

export default Metadata