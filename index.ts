import NBuffer from "@nodetf/buffer"
import Metadata from "./metadata"

import { inflateSync } from "node:zlib"

function readString8(buffer: NBuffer)
{
    const size = buffer.readInt16()
    return buffer.readString(size,"utf-8")
}

function writeString8(buffer: NBuffer,string: string)
{
    buffer.writeInt16(string.length)
    buffer.writeString(string,"utf-8")
}

function readString16(buffer: NBuffer)
{
    const size = buffer.readInt16()
    return buffer.readString(size,"ucs-2")
}

function writeString16(buffer: NBuffer,string: string)
{
    buffer.writeInt16(string.length)
    buffer.writeString(string,"ucs-2")
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
    protected checkType(type: Packet.Type)
    {
        if(type != this.type) throw new Error(`Wrong Packet! Expected ${Packet.Type[this.type]}, got ${Packet.Type[type]}!`)
    }
    protected writeType(buffer: NBuffer)
    {
        buffer.writeInt8(this.type)
    }
    parse(buffer: NBuffer)
    {
        this.checkType(buffer.readInt8())
        return this.parseContent(buffer)
    }
    protected abstract parseContent(buffer: NBuffer): this
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
    export abstract class IEntity extends Packet
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
    export namespace Common
    {
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
        export class ChatMessage extends Packet
        {
            readonly type: Type = Type.ChatMessage
            message: string = String()
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(3+(this.message.length*2))
                this.writeType(buffer)
                writeString16(buffer,this.message.substring(0,MAX_MESSAGE_LENGTH))
                return buffer    
            }
            parseContent(buffer: NBuffer)
            {
                this.message = readString16(buffer)
                return this    
            }
        }
        export class EntityEquipment extends IEntity
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
            protected parseContent(buffer: NBuffer): this
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
            protected parseContent(buffer: NBuffer): this 
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
            protected parseContent(buffer: NBuffer): this 
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
            protected parseContent(buffer: NBuffer): this
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
            protected parseContent(buffer: NBuffer): this
            {
                this.playerID = buffer.readInt32()
                this.action = buffer.readInt8()
                return this   
            }
        }
        export class EntityPainting extends IEntity
        {
            readonly type: Type = Type.EntityPainting
            title: string = String()
            x: number = NaN
            y: number = NaN
            z: number = NaN
            direction: number = NaN
            toBuffer(): NBuffer
            {
                const title = this.title.substring(0,13)
                const buffer = new NBuffer(21+title.length)
                this.writeType(buffer)
                buffer.writeInt32(this.entityID)
                writeString16(buffer,title)
                buffer.writeInt32(this.x)
                buffer.writeInt32(this.y)
                buffer.writeInt32(this.z)
                buffer.writeInt32(this.direction)
                return buffer
            }
            protected parseContent(buffer: NBuffer): this
            {
                this.entityID = buffer.readInt32()
                this.title = readString16(buffer)
                this.x = buffer.readInt32()
                this.y = buffer.readInt32()
                this.z = buffer.readInt32()
                this.direction = buffer.readInt32()
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
            protected parseContent(buffer: NBuffer): this 
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
            protected parseContent(buffer: NBuffer): this
            {
                this.windowID = buffer.readInt8()    
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
            protected parseContent(buffer: NBuffer): this
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
                for(const t of this.text) writeString16(buffer,t)
                return buffer
            }
            protected parseContent(buffer: NBuffer): this 
            {
                this.x = buffer.readInt32()
                this.y = buffer.readInt8()
                this.z = buffer.readInt32()
                this.text = [readString16(buffer),readString16(buffer),readString16(buffer),readString16(buffer)]
                return this    
            }
        }
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
                    return new Common.KeepAlive().parse(buffer)
                case Type.LoginRequest:
                    return new LoginRequest().parse(buffer)
                case Type.Handshake:
                    return new Handshake().parse(buffer)
                case Type.ChatMessage:
                    return new Common.ChatMessage().parse(buffer)
                case Type.EntityEquipment:
                    return new Common.EntityEquipment().parse(buffer)
                case Type.UseEntity:
                    return new Common.UseEntity().parse(buffer)
                case Type.Respawn:
                    return new Common.Respawn().parse(buffer)
                case Type.Player:
                    return new Player().parse(buffer)
                case Type.PlayerPosition:
                    return new PlayerPosition().parse(buffer)
                case Type.PlayerLook:
                    return new PlayerLook().parse(buffer)
                case Type.PlayerPositionAndLook:
                    return new PlayerPositionAndLook().parse(buffer)
                case Type.PlayerDigging:
                    return new Common.PlayerDigging().parse(buffer)
                case Type.PlayerBlockPlacement:
                    return new Common.PlayerBlockPlacement().parse(buffer)
                case Type.HoldingChange:
                    return new Common.HoldingChange().parse(buffer)
                case Type.Animation:
                    return new Common.Animation().parse(buffer)
                case Type.EntityAction:
                    return new Common.EntityAction().parse(buffer)
                case Type.StanceUpdate:
                    return new Common.StanceUpdate().parse(buffer)
                case Type.CloseWindow:
                    return new Common.CloseWindow().parse(buffer)
                case Type.WindowClick:
                    return new WindowClick().parse(buffer)
                case Type.Transaction:
                    return new Common.Transaction().parse(buffer)
                case Type.UpdateSign:
                    return new Common.UpdateSign().parse(buffer)
                default:
                    throw new Error(`${Type[type]} is not a Client Packet!`)
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
                writeString16(buffer,this.username.substring(0,MAX_STRING_LENGTH))
                return buffer
            }
            parseContent(buffer: NBuffer)
            {
                this.version = buffer.readInt32()
                this.username = readString16(buffer)
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
                writeString16(buffer,this.username.substring(0,MAX_STRING_LENGTH))
                return buffer    
            }
            parseContent(buffer: NBuffer)
            {
                this.username = readString16(buffer)
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
        export class PlayerPositionAndLook extends Player implements PlayerLook,PlayerPosition
        {
            readonly type: Type = Type.PlayerPositionAndLook
            onGround: boolean = false
            x: number = NaN
            y: number = NaN
            stance: number = NaN
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
            protected parseContent(buffer: NBuffer): this
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
                    return new Common.KeepAlive().parse(buffer)
                case Type.LoginRequest:
                    return new LoginRequest().parse(buffer)
                case Type.ChatMessage:
                    return new Common.ChatMessage().parse(buffer)
                case Type.TimeUpdate:
                    return new TimeUpdate().parse(buffer)
                case Type.EntityEquipment:
                    return new Common.EntityEquipment().parse(buffer)
                case Type.SpawnPosition:
                    return new SpawnPosition().parse(buffer)
                case Type.UpdateHealth:
                    return new UpdateHealth().parse(buffer)
                case Type.PlayerPositionAndLook:
                    return new PlayerPositionAndLook().parse(buffer)
                case Type.UseBed:
                    return new UseBed().parse(buffer)
                case Type.NamedEntitySpawn:
                    return new NamedEntitySpawn().parse(buffer)
                case Type.PickupSpawn:
                    return new PickupSpawn().parse(buffer)
                case Type.CollectItem:
                    return new CollectItem().parse(buffer)
                case Type.AddObjectVehicle:
                    return new AddObjectVehicle().parse(buffer)
                case Type.MobSpawn:
                    return new MobSpawn().parse(buffer)
                case Type.EntityVelocity:
                    return new EntityVelocity().parse(buffer)
                case Type.DestroyEntity:
                    return new DestroyEntity().parse(buffer)
                case Type.Entity:
                    return new Entity().parse(buffer)
                case Type.EntityLook:
                    return new EntityLook().parse(buffer)
                case Type.EntityLookAndRelativeMove:
                    return new EntityLookAndRelativeMove().parse(buffer)
                case Type.EntityTeleport:
                    return new EntityTeleport().parse(buffer)
                case Type.EntityStatus:
                    return new EntityStatus().parse(buffer)
                case Type.AttachEntity:
                    return new AttachEntity().parse(buffer)
                case Type.EntityMetadata:
                    return new EntityMetadata().parse(buffer)
                case Type.PreChunk:
                    return new PreChunk().parse(buffer)
                case Type.MapChunk:
                    return new MapChunk().parse(buffer)
                case Type.MultiBlockChange:
                    return new MultiBlockChange().parse(buffer)
                case Type.BlockChange:
                    return new BlockChange().parse(buffer)
                default:
                    throw new Error(`${Type[type]} is not a Server Packet!`)
            }
        }
        export class LoginRequest extends IEntity
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
                writeString16(buffer,this.username.substring(0,MAX_STRING_LENGTH))
                buffer.writeInt64(this.mapSeed)
                buffer.writeInt8(this.dimension)
                return buffer
            }
            protected parseContent(buffer: NBuffer): this
            {
                this.entityID = buffer.readInt32()
                this.username = readString16(buffer)
                this.mapSeed = buffer.readInt64()
                this.dimension = buffer.readInt8()
                return this    
            }
        }
        export class TimeUpdate extends Packet
        {
            readonly type: Type = Type.TimeUpdate
            time: bigint = BigInt(0)
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(9)
                this.writeType(buffer)
                buffer.writeInt64(this.time)
                return buffer
            }
            protected parseContent(buffer: NBuffer): this
            {
                this.time = buffer.readInt64()
                return this    
            }
        }
        export class SpawnPosition extends Packet
        {
            readonly type: Type = Type.SpawnPosition
            x: number = NaN
            y: number = NaN
            z: number = NaN
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(13)
                this.writeType(buffer)
                buffer.writeInt32(this.x)
                buffer.writeInt32(this.y)
                buffer.writeInt32(this.z)
                return buffer
            }
            protected parseContent(buffer: NBuffer): this
            {
                this.x = buffer.readInt32()
                this.y = buffer.readInt32()
                this.z = buffer.readInt32()
                return this    
            }
        }
        export class UpdateHealth extends Packet
        {
            readonly type: Type = Type.UpdateHealth
            health: number = NaN
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(3)
                this.writeType(buffer)
                buffer.writeInt16(this.health)
                return buffer
            }
            protected parseContent(buffer: NBuffer): this 
            {
                this.health = buffer.readInt16()
                return this                
            }
        }
        export class PlayerPositionAndLook extends Packet
        {
            readonly type: Type = Type.PlayerPositionAndLook
            onGround: boolean = false
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
                buffer.writeDouble(this.stance)
                buffer.writeDouble(this.y)
                buffer.writeDouble(this.z)
                buffer.writeFloat(this.yaw)
                buffer.writeFloat(this.pitch)
                writeBoolean(buffer,this.onGround)
                return buffer
            }
            parseContent(buffer: NBuffer)
            {
                this.x = buffer.readDouble()
                this.stance = buffer.readDouble()
                this.y = buffer.readDouble()
                this.z = buffer.readDouble()
                this.yaw = buffer.readFloat()
                this.pitch = buffer.readFloat()
                this.onGround = readBoolean(buffer)
                return this
            }
        }
        export class UseBed extends IEntity
        {
            readonly type: Type = Type.UseBed
            inBed: number = NaN
            x: number = NaN
            y: number = NaN
            z: number = NaN
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(15)
                this.writeType(buffer)
                this.entityID = buffer.readInt32()
                this.inBed = buffer.readInt8()
                this.x = buffer.readInt32()
                this.y = buffer.readInt8()
                this.z = buffer.readInt32()
                return buffer
            }
            protected parseContent(buffer: NBuffer): this
            {
                this.entityID = buffer.readInt32()
                this.inBed = buffer.readInt8()
                this.x = buffer.readInt32()
                this.y = buffer.readInt8()
                this.z = buffer.readInt32()
                return this    
            }
        }
        export class NamedEntitySpawn extends IEntity
        {
            readonly type: Type = Type.NamedEntitySpawn
            username: string = String()
            x: number = NaN
            y: number = NaN
            z: number = NaN
            rotation: number = NaN
            pitch: number = NaN
            currentItem: number = NaN
            toBuffer(): NBuffer
            {
                const username = this.username.substring(0,MAX_STRING_LENGTH)
                const buffer = new NBuffer(23+username.length)
                this.writeType(buffer)
                buffer.writeInt32(this.entityID)
                writeString16(buffer,username.substring(0,MAX_STRING_LENGTH))
                buffer.writeInt32(this.x)
                buffer.writeInt32(this.y)
                buffer.writeInt32(this.z)
                buffer.writeInt8(this.rotation)
                buffer.writeInt32(this.pitch)
                buffer.writeInt16(this.currentItem)
                return buffer
            }
            protected parseContent(buffer: NBuffer): this 
            {
                this.entityID = buffer.readInt32()
                this.username = readString16(buffer)
                this.x = buffer.readInt32()
                this.y = buffer.readInt32()
                this.z = buffer.readInt32()
                this.rotation = buffer.readInt8()
                this.pitch = buffer.readInt8()
                this.currentItem = buffer.readInt16()
                return this    
            }
        }
        export class PickupSpawn extends IEntity
        {
            readonly type: Type = Type.PickupSpawn
            item: number = NaN
            count: number = NaN
            data: number = NaN
            damage: number = NaN
            x: number = NaN
            y: number = NaN
            z: number = NaN
            rotation: number = NaN
            pitch: number = NaN
            roll: number = NaN
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(25)
                this.writeType(buffer)
                buffer.writeInt32(this.entityID)
                buffer.writeInt16(this.item)
                buffer.writeInt8(this.count)
                buffer.writeInt16(this.data)
                buffer.writeInt32(this.x)
                buffer.writeInt32(this.y)
                buffer.writeInt32(this.z)
                buffer.writeInt8(this.rotation)
                buffer.writeInt8(this.pitch)
                buffer.writeInt8(this.roll)
                return buffer
            }
            protected parseContent(buffer: NBuffer): this
            {
                this.entityID = buffer.readInt32()
                this.item = buffer.readInt16()
                this.count = buffer.readInt8()
                this.damage = this.data = buffer.readInt16()
                this.x = buffer.readInt32()
                this.y = buffer.readInt32()
                this.z = buffer.readInt32()
                this.rotation = buffer.readInt8()
                this.pitch = buffer.readInt8()
                this.roll = buffer.readInt8()
                return this    
            }
        }
        export class CollectItem extends IEntity
        {
            readonly type: Type = Type.CollectItem
            pickupID: number = NaN
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(9)
                this.writeType(buffer)
                buffer.writeInt32(this.pickupID)
                buffer.writeInt32(this.entityID)
                return buffer
            }
            protected parseContent(buffer: NBuffer): this
            {
                this.pickupID = buffer.readInt32()
                this.entityID = buffer.readInt32()
                return this    
            }
        }
        export class AddObjectVehicle extends IEntity
        {
            readonly type: Type = Type.AddObjectVehicle
            objType: number = NaN
            x: number = NaN
            y: number = NaN
            z: number = NaN
            flag: number = NaN
            short1: number = NaN
            short2: number = NaN
            short3: number = NaN
            toBuffer(): NBuffer
            {
                const optional = this.flag > 0
                const buffer = new NBuffer(optional ? 28 : 22)
                this.writeType(buffer)
                buffer.writeInt32(this.entityID)
                buffer.writeInt8(this.objType)
                buffer.writeInt32(this.x)
                buffer.writeInt32(this.y)
                buffer.writeInt32(this.z)
                buffer.writeInt32(this.flag)
                if(optional)
                {
                    buffer.writeInt16(this.short1)
                    buffer.writeInt16(this.short2)
                    buffer.writeInt16(this.short3)
                }
                return buffer
            }
            protected parseContent(buffer: NBuffer): this
            {
                this.entityID = buffer.readInt32()
                this.objType = buffer.readInt8()
                this.x = buffer.readInt32()
                this.y = buffer.readInt32()
                this.z = buffer.readInt32()
                this.flag = buffer.readInt32()
                if(this.flag > 0)
                {
                    this.short1 = buffer.readInt16()
                    this.short2 = buffer.readInt16()
                    this.short3 = buffer.readInt16()
                }
                return this
            }
        }
        export class MobSpawn extends IEntity
        {
            readonly type: Type = Type.MobSpawn
            mobType: number = NaN
            x: number = NaN
            y: number = NaN
            z: number = NaN
            yaw: number = NaN
            pitch: number = NaN
            metadata: Metadata[] = []
            toBuffer(): NBuffer
            {
                throw new Error("Method not implemented!")
            }
            protected parseContent(buffer: NBuffer): this 
            {
                this.entityID = buffer.readInt32()
                this.mobType = buffer.readInt8()
                this.x = buffer.readInt32()
                this.y = buffer.readInt32()
                this.z = buffer.readInt32()
                this.yaw = buffer.readInt8()
                this.pitch = buffer.readInt8()
                this.metadata = Metadata.read(buffer)
                return this
            }
        }
        export class EntityVelocity extends IEntity
        {
            readonly type: Type = Type.EntityVelocity
            velX: number = NaN
            velY: number = NaN
            velZ: number = NaN
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(11)
                this.writeType(buffer)
                buffer.writeInt32(this.entityID)
                buffer.writeInt16(this.velX)
                buffer.writeInt16(this.velY)
                buffer.writeInt16(this.velZ)
                return buffer
            }
            protected parseContent(buffer: NBuffer): this
            {
                this.entityID = buffer.readInt32()
                this.velX = buffer.readInt16()
                this.velY = buffer.readInt16()
                this.velZ = buffer.readInt16()    
                return this
            }
        }
        export class DestroyEntity extends IEntity
        {
            readonly type: Type = Type.DestroyEntity
            toBuffer(): NBuffer 
            {
                const buffer = new NBuffer(5)
                this.writeType(buffer)
                buffer.writeInt32(this.entityID)
                return buffer    
            }
            protected parseContent(buffer: NBuffer): this
            {
                this.entityID = buffer.readInt32()
                return this    
            }
        }
        export class Entity extends IEntity
        {
            readonly type: Type = Type.Entity
            toBuffer(): NBuffer 
            {
                const buffer = new NBuffer(5)
                this.writeType(buffer)
                buffer.writeInt32(this.entityID)
                return buffer    
            }
            protected parseContent(buffer: NBuffer): this
            {
                this.entityID = buffer.readInt32()
                return this    
            }
        }
        export class EntityLook extends IEntity
        {
            readonly type: Type = Type.EntityLook
            yaw: number = NaN
            pitch: number = NaN
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(7)
                this.writeType(buffer)
                buffer.writeInt32(this.entityID)
                buffer.writeInt8(this.yaw)
                buffer.writeInt8(this.pitch)
                return buffer
            }
            protected parseContent(buffer: NBuffer): this
            {
                this.entityID = buffer.readInt32()
                this.yaw = buffer.readInt8()
                this.pitch = buffer.readInt8()
                return this    
            }
        }
        export class EntityLookAndRelativeMove extends EntityLook
        {
            readonly type: Type = Type.EntityLookAndRelativeMove
            dX: number = NaN
            dY: number = NaN
            dZ: number = NaN
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(10)
                this.writeType(buffer)
                buffer.writeInt32(this.entityID)
                buffer.writeInt8(this.dX)
                buffer.writeInt8(this.dY)
                buffer.writeInt8(this.dZ)
                buffer.writeInt8(this.yaw)
                buffer.writeInt8(this.pitch)
                return buffer
            }
            protected parseContent(buffer: NBuffer): this
            {
                this.entityID = buffer.readInt32()
                this.dX = buffer.readInt8()
                this.dY = buffer.readInt8()
                this.dZ = buffer.readInt8()
                this.yaw = buffer.readInt8()
                this.pitch = buffer.readInt8()
                return this    
            }
        }
        export class EntityTeleport extends EntityLook
        {
            readonly type: Type = Type.EntityTeleport
            x: number = NaN
            y: number = NaN
            z: number = NaN
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(19)
                this.writeType(buffer)
                buffer.writeInt32(this.entityID)
                buffer.writeInt32(this.x)
                buffer.writeInt32(this.y)
                buffer.writeInt32(this.z)
                buffer.writeInt8(this.yaw)
                buffer.writeInt8(this.pitch)
                return buffer
            }
            protected parseContent(buffer: NBuffer): this
            {
                this.entityID = buffer.readInt32()
                this.x = buffer.readInt32()
                this.y = buffer.readInt32()
                this.z = buffer.readInt32()
                this.yaw = buffer.readInt8()
                this.pitch = buffer.readInt8()
                return this    
            }
        }
        export class EntityStatus extends IEntity
        {
            readonly type: Type = Type.EntityStatus
            status: number = NaN
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(6)
                this.writeType(buffer)
                buffer.writeInt32(this.entityID)
                buffer.writeInt32(this.status)
                return buffer
            }
            protected parseContent(buffer: NBuffer): this
            {
                this.entityID = buffer.readInt32()
                this.status = buffer.readInt8()
                return this    
            }
        }
        export class AttachEntity extends IEntity
        {
            readonly type: Type = Type.AttachEntity
            vehicleID: number = NaN
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(9)
                this.writeType(buffer)
                buffer.writeInt32(this.entityID)
                buffer.writeInt32(this.vehicleID)
                return buffer
            }
            protected parseContent(buffer: NBuffer): this 
            {
                this.entityID = buffer.readInt32()
                this.vehicleID = buffer.readInt32()
                return this    
            }
        }
        export class EntityMetadata extends IEntity
        {
            readonly type: Type = Type.EntityMetadata
            metadata: Metadata[] = []
            toBuffer(): NBuffer
            {
                throw new Error("Method not implemented!")    
            }
            protected parseContent(buffer: NBuffer): this 
            {
                this.entityID = buffer.readInt32()
                this.metadata = Metadata.read(buffer)
                return this    
            }
        }
        export class PreChunk extends Packet
        {
            readonly type: Type = Type.PreChunk
            x: number = NaN
            z: number = NaN
            mode: boolean = false
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(10)
                this.writeType(buffer)
                buffer.writeInt32(this.x)
                buffer.writeInt32(this.z)
                writeBoolean(buffer,this.mode)
                return buffer
            }
            protected parseContent(buffer: NBuffer): this 
            {
                this.x = buffer.readInt32()
                this.z = buffer.readInt32()
                this.mode = readBoolean(buffer)
                return this    
            }
        }
        export class MapChunk extends Packet
        {
            readonly type: Type = Type.MapChunk
            x: number = NaN
            y: number = NaN
            z: number = NaN
            sizeX: number = NaN
            sizeY: number = NaN
            sizeZ: number = NaN
            dataSize: number = NaN
            data: NBuffer = new NBuffer(0)
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(18+this.dataSize)
                this.writeType(buffer)
                buffer.writeInt32(this.x)
                buffer.writeInt8(this.y)
                buffer.writeInt32(this.z)
                buffer.writeInt8(this.sizeX)
                buffer.writeInt8(this.sizeY)
                buffer.writeInt8(this.sizeZ)
                buffer.writeInt32(this.dataSize)
                buffer.write(this.data)
                return buffer
            }
            protected parseContent(buffer: NBuffer): this
            {
                this.x = buffer.readInt32()
                this.y = buffer.readInt8() 
                this.z = buffer.readInt32()
                this.sizeX = buffer.readInt8()+1
                this.sizeY = buffer.readInt8()+1
                this.sizeZ = buffer.readInt8()+1
                this.dataSize = buffer.readInt32()
                this.data = buffer.subarray(this.dataSize)
                return this
            }
            getChunkData()
            {
                const chunkX = this.x >> 4
                const chunkY = this.y >> 7
                const chunkZ = this.z >> 4
                const startX = this.x & 15
                const startY = this.y & 127
                const startZ = this.z & 15
                const dataSize = this.sizeX*this.sizeY*this.sizeZ*2.5
                const data = new NBuffer(inflateSync(this.data.getNodeJSBuffer()))
                return {
                    chunkX,chunkY,chunkZ,
                    startX,startY,startZ,
                    dataSize,data
                }
            }
        }
        export class MultiBlockChange extends Packet
        {
            readonly type: Type = Type.MultiBlockChange
            chunkX: number = NaN
            chunkZ: number = NaN
            size: number = NaN
            coordinates: number[] = []
            types: number[] = []
            metadata: number[] = []
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(11+(this.size*3))
                this.writeType(buffer)
                buffer.writeInt32(this.chunkX)
                buffer.writeInt32(this.chunkZ)
                buffer.writeInt16(this.size)
                buffer.writeArray(this.coordinates,NBuffer.SizeOf.Int16)
                buffer.writeArray(this.types,NBuffer.SizeOf.Int8)
                buffer.writeArray(this.metadata,NBuffer.SizeOf.Int8)
                return buffer
            }
            protected parseContent(buffer: NBuffer): this 
            {
                this.chunkX = buffer.readInt32()
                this.chunkZ = buffer.readInt32()
                this.size = buffer.readInt16()
                this.coordinates = buffer.readArray(this.size,NBuffer.SizeOf.Int16)
                this.types = buffer.readArray(this.size,NBuffer.SizeOf.Int8)
                this.metadata = buffer.readArray(this.size,NBuffer.SizeOf.Int8)
                return this    
            }
        }
        export class BlockChange extends Packet
        {
            readonly type: Type = Type.BlockChange
            x: number = NaN
            y: number = NaN
            z: number = NaN
            blockType: number = NaN
            metadata: number = NaN
            toBuffer(): NBuffer
            {
                const buffer = new NBuffer(12)
                this.writeType(buffer)
                buffer.writeInt32(this.x)
                buffer.writeInt8(this.y)
                buffer.writeInt32(this.z)
                buffer.writeInt8(this.blockType)
                buffer.writeInt8(this.metadata)
                return buffer
            }
            protected parseContent(buffer: NBuffer): this 
            {
                this.x = buffer.readInt32()
                this.y = buffer.readInt16()
                this.z = buffer.readInt32()
                this.blockType = buffer.readInt8()
                this.metadata = buffer.readInt8()
                return this    
            }
        }
    }
}

export default Packet