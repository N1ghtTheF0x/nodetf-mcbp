import NBuffer from "@nodetf/buffer"

type ItemStack = {
    id: number
    count: number
    data: number
}

namespace ItemStack
{
    export function read(buffer: NBuffer): ItemStack
    {
        const id = buffer.readInt16()
        const count = id >= 0 ? buffer.readInt8() : NaN
        const data = id >= 0 ? buffer.readInt16() : NaN
        return {
            id,count,data
        }
    }
    export function toBuffer(item: ItemStack)
    {
        const buffer = new NBuffer(item.id >= 0 ? 5 : 2)
        buffer.writeInt16(item.id)
        if(item.id >= 0)
        {
            buffer.writeInt8(item.count)
            buffer.writeInt16(item.data)
        }
        return buffer
    }
    export function getSizeOfList(items: ItemStack[])
    {
        var size = 0

        return size
    }
}

export default ItemStack