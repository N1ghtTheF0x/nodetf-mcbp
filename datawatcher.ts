import { FLOAT_SIZE, INT16_SIZE, INT32_SIZE, INT8_SIZE, float, sint16, sint32, sint8 } from "@nodetf/buffer"
import ItemStack from "./itemstack"
import Vector3 from "./vector3"
import DataStream from "./datastream"

class DataWatcher<Type extends DataWatcher.Type = DataWatcher.Type>
{
    type: Type
    value: DataWatcher.Map[Type]
    valueId: number
    static write(stream: DataStream,list: DataWatcher[])
    {
        for(const item of list)
            item.#write(stream)
        stream.writeInt8(127)
        return stream
    }
    static size(list: DataWatcher[])
    {
        var size = 0
        for(const item of list)
            size += INT8_SIZE + item.size()
        return size + INT8_SIZE
    }
    size()
    {
        switch(this.type)
        {
            case 0:
                return INT8_SIZE
            case 1:
                return INT16_SIZE
            case 2:
                return INT32_SIZE
            case 3:
                return FLOAT_SIZE
            case 4:
                return INT16_SIZE + (this.value as string).length
            case 5:
                return INT16_SIZE + INT8_SIZE + INT16_SIZE
            case 6:
                return INT32_SIZE + INT32_SIZE + INT32_SIZE
            default:
                throw new Error(`Unknown Type: ${this.type}!`)
        }
    }
    #write(stream: DataStream)
    {
        stream.writeInt8((this.type << 5 | this.valueId & 31) & 255)
        switch(this.type)
        {
            case 0:
                stream.writeInt8(this.value as sint8)
                break
            case 1:
                stream.writeInt16(this.value as sint16)
                break
            case 2:
                stream.writeInt32(this.value as sint32)
                break
            case 3:
                stream.writeFloat(this.value as float)
                break
            case 4:
                stream.writeString16(this.value as string)
                break
            case 5:
                const item = this.value as ItemStack
                stream.writeInt16(item.itemID)
                .writeInt8(item.stackSize)
                .writeInt16(item.itemDamage)
                break
            case 6:
                const pos = this.value as Vector3
                stream.writeInt32(pos.x)
                .writeInt32(pos.y)
                .writeInt32(pos.z)
                break
            default:
                throw new Error(`Unknown Type: ${this.type}!`)
        }
    }
    static read(stream: DataStream)
    {
        const list: DataWatcher[] = []
        for(var index = stream.readInt8();index != 127;index = stream.readInt8())
        {
            const type = (index & 224) >> 5 as DataWatcher.Type
            const a = index & 31
            switch(type)
            {
                case 0:
                    list.push(new this(type,a,stream.readInt8()))
                    break
                case 1:
                    list.push(new this(type,a,stream.readInt16()))
                    break
                case 2:
                    list.push(new this(type,a,stream.readInt32()))
                    break
                case 3:
                    list.push(new this(type,a,stream.readFloat()))
                    break
                case 4:
                    list.push(new this(type,a,stream.readString16()))
                    break
                case 5:
                    list.push(new this(type,a,new ItemStack(stream.readInt16(),stream.readInt8(),stream.readInt16())))
                    break
                case 6:
                    list.push(new this(type,a,new Vector3(stream.readInt32(),stream.readInt32(),stream.readInt32())))
                    break
                default:
                    throw new Error(`Unknown Type: ${type}!`)
            }
        }
        return list
    }
    constructor(type: Type,a: number,value: DataWatcher.Map[Type])
    {
        this.type = type,this.value = value,this.valueId = a
    }
}

namespace DataWatcher
{
    export type Map = {
        0: sint8,
        1: sint16,
        2: sint32,
        3: float,
        4: string,
        5: ItemStack,
        6: Vector3
    }
    export type Type = keyof Map
    export type Values = Map[Type]
}

export default DataWatcher