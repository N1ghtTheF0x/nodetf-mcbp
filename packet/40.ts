import DataStream from "../datastream"
import DataWatcher from "../datawatcher"
import ClientPacket from "./packet"

class EntityMetadata extends ClientPacket
{
    entityId: number = NaN
    field_210048: DataWatcher[] = []
    constructor()
    {
        super(40)
    }
    read(buffer: DataStream): void 
    {
        this.entityId = buffer.readInt32()
        this.field_210048 = DataWatcher.read(buffer)
    }
    write(): DataStream 
    {
        return DataWatcher.write(this.createBuffer()
        .writeInt32(this.entityId),this.field_210048)
    }
    size(): number 
    {
        return 4 + DataWatcher.size(this.field_210048)
    }
}

export default EntityMetadata