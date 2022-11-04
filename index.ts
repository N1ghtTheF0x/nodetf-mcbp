import NBuffer from "@nodetf/buffer"

function readMUTF8(buffer: NBuffer)
{
    const size = buffer.readInt16()
    return buffer.readString(size,"utf-8")
}

function writeMUTF8(buffer: NBuffer,string: string)
{
    buffer.writeInt16(string.length)
    buffer.writeString(string,"utf-8")
}

function writeBoolean(buffer: NBuffer,boolean: boolean)
{
    buffer.writeInt8(boolean ? 0x01 : 0x00)
}

function readBoolean(buffer: NBuffer)
{
    return buffer.readInt8() == 0x01
}

abstract class Packet
{
    abstract readonly type: Packet.Type
    checkType(type: Packet.Type)
    {
        if(type != this.type) throw new Error(`Wrong Packet! Expected ${Packet.Type[this.type]}, got ${Packet.Type[type]}!`)
    }
    writeType(buffer: NBuffer)
    {
        buffer.writeInt8(this.type)
    }
    parse(buffer: NBuffer)
    {
        buffer.readInt8()
        return this.parseContent(buffer)
    }
    abstract parseContent(buffer: NBuffer): this
    abstract toBuffer(): NBuffer
}

namespace Packet
{
    function readType(buffer: NBuffer)
    {
        const type = buffer.readInt8()
        buffer.readOffset -= NBuffer.SizeOf.Int8
        return type as Type
    }
    export abstract class Entity extends Packet
    {
        entityID: number = NaN
    }
    export const MAX_STRING_LENGTH = 16
    export const MAX_MESSAGE_LENGTH = 119
    export enum Type
    {
        KeepAlive = 0x00,
        LoginRequest = 0x01,
        Handshake = 0x02,
        ChatMessage = 0x03,
        TimeUpdate = 0x04,
        EntityEquipment = 0x05,
        SpawnPosition = 0x06,
        UseEntity = 0x07,
        UpdateHealth = 0x08,
        Respawn = 0x09,
        Player = 0x0A,
        PlayerPosition = 0x0B,
        PlayerLook = 0x0C,
        PlayerPositionAndLook = 0x0D,
        PlayerDigging = 0x0E,
        PlayerBlockPlacement = 0x0F,
        HoldingChange = 0x10,
        UseBed = 0x11,
        Animation = 0x12,
        EntityAction = 0x13,
        NamedEntitySpawn = 0x14,
        PickupSpawn = 0x15,
        CollectItem = 0x16,
        AddObjectVehicle = 0x17,
        MobSpawn = 0x18,
        EntityPainting = 0x19,
        StanceUpdate = 0x1B,
        EntityVelocity = 0x1c,
        DestroyEntity = 0x1d,
        Entity = 0x1E,
        EntityRelativeMove = 0x1f,
        EntityLook = 0x20,
        EntityLookAndRelativeMove = 0x21,
        EntityTeleport = 0x22,
        EntityStatus = 0x26,
        AttachEntity = 0x27,
        EntityMetadata = 0x28,
        PreChunk = 0x32,
        MapChunk = 0x33,
        MultiBlockChange = 0x34,
        BlockChange = 0x35,
        BlockAction = 0x36,
        Explosion = 0x3C,
        SoundEffect = 0x3D,
        NewInvalidState = 0x46,
        Thunderbolt = 0x47,
        OpenWindow = 0x64,
        CloseWindow = 0x65,
        WindowClick = 0x66,
        SetSlot = 0x67,
        WindowItems = 0x68,
        UpdateProgressBar = 0x69,
        Transaction = 0x6A,
        UpdateSign = 0x82,
        ItemData = 0x83,
        IncrementStatistic = 0x84,
        DisconnectKick = 0xFF
    }
    export namespace Client
    {   
        export function readArray(buffer: NBuffer): ReadonlyArray<Packet>
        {
            const arr: Array<Packet> = []
            while(true) try
            {
                 arr.push(read(buffer))
            }
            catch(e)
            {
                return arr
            }
        }
        export function read(buffer: NBuffer): Packet
        {
            const type = readType(buffer)
            switch(type)
            {
                case Type.KeepAlive:
                    return new KeepAlive().parse(buffer)
                case Type.LoginRequest:
                    return new LoginRequest().parse(buffer)
                case Type.Handshake:
                    return new Handshake().parse(buffer)
                case Type.ChatMessage:
                    return new ChatMessage().parse(buffer)
                case Type.EntityEquipment:
                    return new EntityEquipment().parse(buffer)
                case Type.UseEntity:
                    return new UseEntity().parse(buffer)
                case Type.Respawn:
                    return new Respawn().parse(buffer)
                case Type.Player:
                    return new Player().parse(buffer)
                case Type.PlayerPosition:
                    return new PlayerPosition().parse(buffer)
                case Type.PlayerLook:
                    return new PlayerLook().parse(buffer)
                case Type.PlayerPositionAndLook:
                    return new PlayerPositionAndLook().parse(buffer)
                case Type.PlayerDigging:
                    return new PlayerDigging().parse(buffer)
                case Type.PlayerBlockPlacement:
                    return new PlayerBlockPlacement().parse(buffer)
                case Type.HoldingChange:
                    return new HoldingChange().parse(buffer)
                case Type.Animation:
                    return new Animation().parse(buffer)
                case Type.EntityAction:
                    return new EntityAction().parse(buffer)
                case Type.StanceUpdate:
                    return new StanceUpdate().parse(buffer)
                case Type.CloseWindow:
                    return new CloseWindow().parse(buffer)
                case Type.WindowClick:
                    return new WindowClick().parse(buffer)
                case Type.Transaction:
                    return new Transaction().parse(buffer)
                case Type.UpdateSign:
                    return new UpdateSign().parse(buffer)
                default:
                    throw new Error(`${Type[type]} is not a Client Packet!`)
            }
        }
        export class KeepAlive extends Packet
        {
            readonly type: Type = Type.KeepAlive
            toBuffer(): NBuffer 
            {
                const buffer = new NBuffer(1)
                buffer.writeInt8(this.type)
                return buffer
            }
            parseContent(buffer: NBuffer)
            {
                return this
            }
        }
        export class LoginRequest extends Packet
        {
            readonly type: Type = Type.LoginRequest
            version: number = NaN
            username: string = String()
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(23+MAX_STRING_LENGTH)
                this.writeType(buffer)
                buffer.writeInt32(this.version)
                writeMUTF8(buffer,this.username.substring(0,MAX_STRING_LENGTH))
                return buffer
            }
            parseContent(buffer: NBuffer)
            {
                this.version = buffer.readInt32()
                this.username = readMUTF8(buffer)
                return this
            }
        }
        export class Handshake extends Packet
        {
            readonly type: Type = Type.Handshake
            username: string = String()
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(3+MAX_STRING_LENGTH)
                this.writeType(buffer)
                writeMUTF8(buffer,this.username.substring(0,MAX_STRING_LENGTH))
                return buffer    
            }
            parseContent(buffer: NBuffer)
            {
                this.username = readMUTF8(buffer)
                return this  
            }
        }
        export class ChatMessage extends Packet
        {
            readonly type: Type = Type.ChatMessage
            message: string = String()
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(3+(this.message.length*2))
                this.writeType(buffer)
                writeMUTF8(buffer,this.message.substring(0,MAX_MESSAGE_LENGTH))
                return buffer    
            }
            parseContent(buffer: NBuffer)
            {
                this.message = readMUTF8(buffer)
                return this    
            }
        }
        export class EntityEquipment extends Entity
        {
            readonly type: Type = Type.EntityEquipment
            slot: number = NaN
            itemID: number = NaN
            damage: number = NaN
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(11)
                this.writeType(buffer)
                buffer.writeInt32(this.entityID)
                buffer.writeInt16(this.slot)
                buffer.writeInt16(this.itemID)
                buffer.writeInt16(this.damage)
                return buffer
            }
            parseContent(buffer: NBuffer)
            {
                this.entityID = buffer.readInt32()
                this.slot = buffer.readInt16()
                this.itemID = buffer.readInt16()
                this.damage = buffer.readInt16()
                return this       
            }
        }
        export class UseEntity extends Packet
        {
            readonly type: Type = Type.UseEntity
            user: number = NaN
            target: number = NaN
            leftClick: boolean = false
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(10)
                this.writeType(buffer)
                buffer.writeInt32(this.user)
                buffer.writeInt32(this.target)
                writeBoolean(buffer,this.leftClick)
                return buffer
            }
            parseContent(buffer: NBuffer)
            {
                this.user = buffer.readInt32()
                this.target = buffer.readInt32()
                this.leftClick = readBoolean(buffer)
                return this
            }
        }
        export class Respawn extends Packet
        {
            readonly type: Type = Type.Respawn
            world: number = NaN
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(2)
                this.writeType(buffer)
                buffer.writeInt8(this.world)
                return buffer
            }
            parseContent(buffer: NBuffer)
            {
                this.world = buffer.readInt8()
                return this 
            }
        }
        export class Player extends Packet
        {
            readonly type: Type = Type.Player
            onGround: boolean = false
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(2)
                this.writeType(buffer)
                writeBoolean(buffer,this.onGround)
                return buffer
            }
            parseContent(buffer: NBuffer)
            {
                this.onGround = readBoolean(buffer)
                return this  
            }
        }
        export class PlayerPosition extends Player
        {
            readonly type: Type = Type.PlayerPosition
            x: number = NaN
            y: number = NaN
            stance: number = NaN
            z: number = NaN
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(34)
                this.writeType(buffer)
                buffer.writeDouble(this.x)
                buffer.writeDouble(this.y)
                buffer.writeDouble(this.stance)
                buffer.writeDouble(this.z)
                writeBoolean(buffer,this.onGround)
                return buffer
            }
            parseContent(buffer: NBuffer)
            {
                this.x = buffer.readDouble()
                this.y = buffer.readDouble()
                this.stance = buffer.readDouble()
                this.z = buffer.readDouble()
                this.onGround = readBoolean(buffer)
                return this
            }
        }
        export class PlayerLook extends Player
        {
            readonly type: Type = Type.PlayerLook
            yaw: number = NaN
            pitch: number = NaN
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(10)
                this.writeType(buffer)
                buffer.writeFloat(this.yaw)
                buffer.writeFloat(this.pitch)
                writeBoolean(buffer,this.onGround)
                return buffer
            }
            parseContent(buffer: NBuffer)
            {
                this.yaw = buffer.readFloat()
                this.pitch = buffer.readFloat()
                return this 
            }
        }
        export class PlayerPositionAndLook extends Player implements PlayerPosition, PlayerLook
        {
            readonly type: Type = Type.PlayerPositionAndLook
            x: number = NaN
            stance: number = NaN
            y: number = NaN
            z: number = NaN
            yaw: number = NaN
            pitch: number = NaN
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(42)
                this.writeType(buffer)
                buffer.writeDouble(this.x)
                buffer.writeDouble(this.y)
                buffer.writeDouble(this.stance)
                buffer.writeDouble(this.z)
                buffer.writeFloat(this.yaw)
                buffer.writeFloat(this.pitch)
                writeBoolean(buffer,this.onGround)
                return buffer
            }
            parseContent(buffer: NBuffer)
            {
                this.x = buffer.readDouble()
                this.y = buffer.readDouble()
                this.stance = buffer.readDouble()
                this.z = buffer.readDouble()
                this.yaw = buffer.readFloat()
                this.pitch = buffer.readFloat()
                this.onGround = readBoolean(buffer)
                return this    
            }
        }
        export class PlayerDigging extends Packet
        {
            readonly type: Type = Type.PlayerDigging
            status: number = NaN
            x: number = NaN
            y: number = NaN
            z: number = NaN
            face: number = NaN
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(12)
                this.writeType(buffer)
                buffer.writeInt8(this.status)
                buffer.writeInt32(this.x)
                buffer.writeInt8(this.y)
                buffer.writeInt32(this.z)
                buffer.writeInt8(this.face)
                return buffer
            }
            parseContent(buffer: NBuffer): this
            {
                this.status = buffer.readInt8()
                this.x = buffer.readInt32()
                this.y = buffer.readInt8()
                this.z = buffer.readInt32()
                this.face = buffer.readInt8()
                return this 
            }
        }
        export class PlayerBlockPlacement extends Packet
        {
            readonly type: Type = Type.PlayerBlockPlacement
            x: number = NaN
            y: number = NaN
            z: number = NaN
            direction: number = NaN
            placeID: number = NaN
            amount: number = NaN
            damage: number = NaN
            toBuffer(): NBuffer
            {
                const optional = this.placeID >= 0 
                const buffer = new NBuffer(optional ? 16 : 13)
                this.writeType(buffer)
                buffer.writeInt32(this.x)
                buffer.writeInt8(this.y)
                buffer.writeInt32(this.z)
                buffer.writeInt8(this.direction)
                buffer.writeInt16(this.placeID)
                if(optional)
                {
                    buffer.writeInt8(this.amount)
                    buffer.writeInt16(this.damage)
                }
                return buffer
            }
            parseContent(buffer: NBuffer): this 
            {
                this.x = buffer.readInt32()
                this.y = buffer.readInt8()
                this.z = buffer.readInt32()
                this.direction = buffer.readInt8()
                this.placeID = buffer.readInt16()
                if(this.placeID >= 0)
                {
                    this.amount = buffer.readInt8()
                    this.damage = buffer.readInt16()
                } else this.amount = this.damage = NaN
                return this
            }
        }
        export class HoldingChange extends Packet
        {
            readonly type: Type = Type.HoldingChange
            slotID: number = NaN
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(3)
                this.writeType(buffer)
                buffer.writeInt16(this.slotID)
                return buffer
            }
            parseContent(buffer: NBuffer): this 
            {
                this.slotID = buffer.readInt16()
                return this    
            }
        }
        export class Animation extends Packet
        {
            readonly type: Type = Type.Animation
            playerID: number = NaN
            animate: number = NaN
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(6)
                this.writeType(buffer)
                buffer.writeInt32(this.playerID)
                buffer.writeInt8(this.animate)
                return buffer
            }
            parseContent(buffer: NBuffer): this
            {
                this.playerID = buffer.readInt32()
                this.animate = buffer.readInt8()
                return this   
            }
        }
        export class EntityAction extends Packet
        {
            readonly type: Type = Type.EntityAction
            playerID: number = NaN
            action: number = NaN
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(6)
                this.writeType(buffer)
                buffer.writeInt32(this.playerID)
                buffer.writeInt8(this.action)
                return buffer
            }
            parseContent(buffer: NBuffer): this
            {
                this.playerID = buffer.readInt32()
                this.action = buffer.readInt8()
                return this   
            }
        }
        export class StanceUpdate extends Packet
        {
            readonly type: Type = Type.StanceUpdate
            float1: number = NaN
            float2: number = NaN
            float3: number = NaN
            float4: number = NaN
            bool1: boolean = false
            bool2: boolean = false
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(
                    (NBuffer.SizeOf.Float*4)+(NBuffer.SizeOf.Int8*2)
                )
                this.writeType(buffer)
                buffer.writeFloat(this.float1)
                buffer.writeFloat(this.float2)
                buffer.writeFloat(this.float3)
                buffer.writeFloat(this.float4)
                writeBoolean(buffer,this.bool1)
                writeBoolean(buffer,this.bool2)
                return buffer
            }
            parseContent(buffer: NBuffer): this 
            {
                this.float1 = buffer.readFloat()
                this.float2 = buffer.readFloat()
                this.float3 = buffer.readFloat()
                this.float4 = buffer.readFloat()
                this.bool1 = readBoolean(buffer)
                this.bool2 = readBoolean(buffer)
                return this
            }
        }
        export class CloseWindow extends Packet
        {
            readonly type: Type = Type.CloseWindow
            windowID: number = NaN
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(2)
                this.writeType(buffer)
                buffer.writeInt8(this.windowID)
                return buffer
            }
            parseContent(buffer: NBuffer): this
            {
                this.windowID = buffer.readInt8()    
                return this
            }
        }
        export class WindowClick extends Packet
        {
            readonly type: Type = Type.WindowClick
            windowID: number = NaN
            slot: number = NaN
            rightClick: number = NaN
            actionNumber: number = NaN
            shift: boolean = false
            itemID: number = NaN
            itemCount: number = NaN
            itemUses: number = NaN
            toBuffer(): NBuffer
            {
                const optional = this.itemID >= 0
                const buffer = new NBuffer(optional ? 13 : 10)
                this.writeType(buffer)
                buffer.writeInt8(this.windowID)
                buffer.writeInt16(this.slot)
                buffer.writeInt8(this.rightClick)
                buffer.writeInt16(this.actionNumber)
                writeBoolean(buffer,this.shift)
                buffer.writeInt16(this.itemID)
                if(optional)
                {
                    buffer.writeInt8(this.itemCount)
                    buffer.writeInt16(this.itemUses)
                }
                return buffer
            }
            parseContent(buffer: NBuffer): this
            {
                this.windowID = buffer.readInt8()
                this.slot = buffer.readInt16()
                this.rightClick = buffer.readInt8()
                this.actionNumber = buffer.readInt16()
                this.shift = readBoolean(buffer)
                this.itemID = buffer.readInt16()
                if(this.itemID >= 0)
                {
                    this.itemCount = buffer.readInt8()
                    this.itemUses = buffer.readInt16()
                } else this.itemCount = this.itemUses = NaN
                return this
            }
        }
        export class Transaction extends Packet
        {
            readonly type: Type = Type.Transaction
            windowID: number = NaN
            actionNumber: number = NaN
            accepted: boolean = false
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(5)
                this.writeType(buffer)
                buffer.writeInt8(this.windowID)
                buffer.writeInt16(this.actionNumber)
                writeBoolean(buffer,this.accepted)
                return buffer
            }
            parseContent(buffer: NBuffer): this
            {
                this.windowID = buffer.readInt8()
                this.actionNumber = buffer.readInt16()
                this.accepted = readBoolean(buffer)
                return this    
            }
        }
        export class UpdateSign extends Packet
        {
            readonly type: Type = Type.UpdateSign
            x: number = NaN
            y: number = NaN
            z: number = NaN
            text: [string,string,string,string] = ["","","",""]
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(11+(MAX_STRING_LENGTH*4))
                this.writeType(buffer)
                buffer.writeInt32(this.x)
                buffer.writeInt8(this.y)
                buffer.writeInt32(this.z)
                for(const t of this.text) writeMUTF8(buffer,t)
                return buffer
            }
            parseContent(buffer: NBuffer): this 
            {
                this.x = buffer.readInt32()
                this.y = buffer.readInt8()
                this.z = buffer.readInt32()
                this.text = [readMUTF8(buffer),readMUTF8(buffer),readMUTF8(buffer),readMUTF8(buffer)]
                return this    
            }
        }
    }
    export namespace Server
    {
        export function readArray(buffer: NBuffer): ReadonlyArray<Packet>
        {
            const arr: Array<Packet> = []
            while(true) try
            {
                arr.push(read(buffer))
            }
            catch(e)
            {
                return arr
            }
        }
        export function read(buffer: NBuffer)
        {
            const type = readType(buffer)
            switch(type)
            {
                case Type.KeepAlive:
                    return new KeepAlive().parse(buffer)
                case Type.LoginRequest:
                    return new LoginRequest().parse(buffer)
                case Type.ChatMessage:
                    return new ChatMessage().parse(buffer)
                default:
                    throw new Error(`${Type[type]} is not a Server Packet!`)
            }
        }
        export class KeepAlive extends Packet
        {
            readonly type: Type = Type.KeepAlive
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(1)
                this.writeType(buffer)
                return buffer    
            }
            parseContent(buffer: NBuffer): this
            {
                return this    
            }
        }
        export class LoginRequest extends Entity
        {
            readonly type: Type = Type.LoginRequest
            username: string = ""
            mapSeed: bigint = BigInt(0)
            dimension: number = NaN
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(16+MAX_STRING_LENGTH)
                this.writeType(buffer)
                buffer.writeInt32(this.entityID)
                writeMUTF8(buffer,this.username.substring(0,MAX_STRING_LENGTH))
                buffer.writeInt64(this.mapSeed)
                buffer.writeInt8(this.dimension)
                return buffer
            }
            parseContent(buffer: NBuffer): this
            {
                this.entityID = buffer.readInt32()
                this.username = readMUTF8(buffer)
                this.mapSeed = buffer.readInt64()
                this.dimension = buffer.readInt8()
                return this    
            }
        }
        export class ChatMessage extends Packet
        {
            readonly type: Type = Type.ChatMessage
            message: string = String()
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(3+(this.message.length*2))
                this.writeType(buffer)
                writeMUTF8(buffer,this.message.substring(0,MAX_MESSAGE_LENGTH))
                return buffer    
            }
            parseContent(buffer: NBuffer)
            {
                this.message = readMUTF8(buffer)
                return this    
            }
        }
    }
}

export default Packet