import DataStream from "../datastream"
import DataWatcher from "../datawatcher"
import ClientPacket from "./packet"

class MobSpawn extends ClientPacket
{
    entityId: number = NaN
    type: number = NaN
    xPosition: number = NaN
    yPosition: number = NaN
    zPosition: number = NaN
    yaw: number = NaN
    pitch: number = NaN
    metaData: DataWatcher[] = []
    get receivedMetadata(){return this.metaData}
    set receivedMetadata(val){this.metaData = val}
    constructor()
    {
        super(24)
    }
    read(buffer: DataStream): void 
    {
        this.entityId = buffer.readInt32()
        this.type = buffer.readInt8()
        this.xPosition = buffer.readInt32()
        this.yPosition = buffer.readInt32()
        this.zPosition = buffer.readInt32()
        this.yaw = buffer.readInt8()
        this.pitch = buffer.readInt8()
        this.metaData = DataWatcher.read(buffer)
    }
    write(): DataStream 
    {
        return DataWatcher.write(this.createBuffer()
        .writeInt32(this.entityId)
        .writeInt8(this.type)
        .writeInt32(this.xPosition)
        .writeInt32(this.yPosition)
        .writeInt32(this.zPosition)
        .writeInt8(this.yaw)
        .writeInt8(this.pitch)
        ,this.metaData)    
    }
    size(): number 
    {
        return 19 + DataWatcher.size(this.metaData)
    }
}

export default MobSpawn