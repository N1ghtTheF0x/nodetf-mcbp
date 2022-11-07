import NBuffer from "@nodetf/buffer";
import ItemStack from "./itemstack";

export class WatchableObject<Data extends WatchableObject.Type = any>
{
    constructor(readonly type: Data,readonly index: number,readonly value: WatchableObject.TypeMap[Data])
    {

    }
}

export namespace WatchableObject
{
    export function is<T extends Type>(obj: WatchableObject,type: T): obj is WatchableObject<T>
    {
        return obj.type == type
    }
    export enum Type
    {
        Any = -1,
        Byte,
        Short,
        Int,
        Float,
        String,
        ItemStack,
        Vector
    }
    export enum Sizeof
    {
        Any = -1,
        Byte = 1+1,
        Short = 1+2,
        Int = 1+4,
        Float = 1+4,
        String = 1+2/*+lengthofstring*/,
        ItemStackZero = 1+2,
        ItemStack = ItemStackZero+3,
        Vector = 1+4+4+4
    }
    export type TypeMap = {
        [Type.Any]: any
        [Type.Byte]: number
        [Type.Short]: number
        [Type.Int]: number
        [Type.Float]: number
        [Type.String]: string
        [Type.ItemStack]: ItemStack
        [Type.Vector]: {x: number,y: number,z: number}
    }
}

export type Metadata = Array<WatchableObject>

namespace DataWatcher
{
    export function getSizeOfMetadata(list: Metadata)
    {
        var size = 0
        for(const obj of list)
        {
            if(WatchableObject.is(obj,WatchableObject.Type.Byte)) size += WatchableObject.Sizeof.Byte
            else if(WatchableObject.is(obj,WatchableObject.Type.Short)) size += WatchableObject.Sizeof.Short
            else if(WatchableObject.is(obj,WatchableObject.Type.Int)) size += WatchableObject.Sizeof.Int
            else if(WatchableObject.is(obj,WatchableObject.Type.Float)) size += WatchableObject.Sizeof.Float
            else if(WatchableObject.is(obj,WatchableObject.Type.String)) size += WatchableObject.Sizeof.String+obj.value.length
            else if(WatchableObject.is(obj,WatchableObject.Type.ItemStack)) size += obj.value.id > 0 ? WatchableObject.Sizeof.ItemStack : WatchableObject.Sizeof.ItemStackZero
            else if(WatchableObject.is(obj,WatchableObject.Type.Vector)) size += WatchableObject.Sizeof.Vector
        }
        return size
    }
    export function toBuffer(list: Metadata)
    {
        const buffer = new NBuffer(getSizeOfMetadata(list))
        for(const obj of list)
        {
            const header = (obj.type << 5 | obj.index & 31) & 255
            buffer.writeInt8(header)
            switch(obj.type)
            {
                case WatchableObject.Type.Byte:
                    buffer.writeInt8(obj.value)
                    break
                case WatchableObject.Type.Short:
                    buffer.writeInt16(obj.value)
                    break
                case WatchableObject.Type.Int:
                    buffer.writeInt32(obj.value)
                    break
                case WatchableObject.Type.Float:
                    buffer.writeFloat(obj.value)
                    break
                case WatchableObject.Type.String:
                    buffer.writeInt16(obj.value.length)
                    buffer.writeString(obj.value,"utf-8")
                    break
                case WatchableObject.Type.ItemStack:
                    buffer.write(ItemStack.toBuffer(obj.value))
                    break
                case WatchableObject.Type.Vector:
                    buffer.writeInt32(obj.value.x)
                    buffer.writeInt32(obj.value.y)
                    buffer.writeInt32(obj.value.z)
                    break
            }
        }
        return buffer
    }
    export function parse(buffer: NBuffer)
    {
        const metadata: Metadata = []
        for(var value = buffer.readInt8();value != 127;value = buffer.readInt8())
        {
            const type: WatchableObject.Type = (value & 224) >> 5
            const index = value & 0x1f
            switch(type)
            {
                case WatchableObject.Type.Byte:
                    metadata.push(new WatchableObject(type,index,buffer.readInt8()))
                    break
                case WatchableObject.Type.Short:
                    metadata.push(new WatchableObject(type,index,buffer.readInt16()))
                    break
                case WatchableObject.Type.Int:
                    metadata.push(new WatchableObject(type,index,buffer.readInt32()))
                    break
                case WatchableObject.Type.Float:
                    metadata.push(new WatchableObject(type,index,buffer.readFloat()))
                    break
                case WatchableObject.Type.String:
                    const size = buffer.readInt16()
                    metadata.push(new WatchableObject(type,index,buffer.readString(size,"utf-8")))
                    break
                case WatchableObject.Type.ItemStack:
                    metadata.push(new WatchableObject(type,index,ItemStack.read(buffer)))
                    break
                case WatchableObject.Type.Vector:
                    metadata.push(new WatchableObject(type,index,{
                        x: buffer.readInt16(),
                        y: buffer.readInt16(),
                        z: buffer.readInt16()
                    }))
                    break
            }
        }
        return metadata
    }
}

export default DataWatcher