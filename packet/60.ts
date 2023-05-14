import DataStream from "../datastream"
import Vector3 from "../vector3"
import ClientPacket from "./packet"

class Explosion extends ClientPacket
{
    explosionX: number = NaN
    explosionY: number = NaN
    explosionZ: number = NaN
    explosionSize: number = NaN
    destroyedBlockPositions: Set<Vector3> = new Set()
    constructor()
    {
        super(60)
    }
    read(buffer: DataStream): void 
    {
        this.explosionX = buffer.readDouble()
        this.explosionY = buffer.readDouble()
        this.explosionZ = buffer.readDouble()
        this.explosionSize = buffer.readFloat()
        const setSize = buffer.readInt32()
        this.destroyedBlockPositions = new Set()
        for(var index = 0;index < setSize;index++)
            this.destroyedBlockPositions.add(new Vector3(
                buffer.readInt8() + this.explosionX,
                buffer.readInt8() + this.explosionY,
                buffer.readInt8() + this.explosionZ
            ))
    }
    write(): DataStream 
    {
        const b = this.createBuffer()
        .writeDouble(this.explosionX)
        .writeDouble(this.explosionY)
        .writeDouble(this.explosionZ)
        .writeFloat(this.explosionSize)
        .writeInt32(this.destroyedBlockPositions.size)
        for(const pos of this.destroyedBlockPositions)
        {
            b.writeInt8(pos.x - this.explosionX)
            .writeInt8(pos.y - this.explosionY)
            .writeInt8(pos.z - this.explosionZ)
        }
        return b
    }
    size(): number 
    {
        return 32 + this.destroyedBlockPositions.size * 3
    }
}

export default Explosion