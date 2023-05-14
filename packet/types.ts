import KeepAlive from "./0"
import Login from "./1"
import Handshake from "./2"
import Chat from "./3"
import UpdateTime from "./4"
import PlayerInventory from "./5"
import SpawnPosition from "./6"
import UseEntity from "./7"
import UpdateHealth from "./8"
import Respawn from "./9"
import Flying from "./10"
import PlayerPosition from "./11"
import PlayerLook from "./12"
import PlayerLookMove from "./13"
import BlockDig from "./14"
import Place from "./15"
import BlockItemSwitch from "./16"
import Sleep from "./17"
import Animation from "./18"
import EntityAction from "./19"
import NamedEntitySpawn from "./20"
import PickupSpawn from "./21"
import Collect from "./22"
import VehicleSpawn from "./23"
import MobSpawn from "./24"
import EntityPainting from "./25"
import Position from "./27"
import EntityVelocity from "./28"
import DestroyEntity from "./29"
import Entity from "./30"
import RelEntityMove from "./31"
import EntityLook from "./32"
import RelEntityMoveLook from "./33"
import EntityTeleport from "./34"
import EntityStatus from "./38"
import AttachEntity from "./39"
import EntityMetadata from "./40"
import PreChunk from "./50"
import MapChunk from "./51"
import MultiBlockChange from "./52"
import BlockChange from "./53"
import PlayNoteBlock from "./54"
import Explosion from "./60"
import DoorChange from "./61"
import Bed from "./70"
import Weather from "./71"
import OpenWindow from "./100"
import CloseWindow from "./101"
import WindowClick from "./102"

export const CLIENT_PACKET_MAP = {
    [  0]: KeepAlive,
    [  1]: Login,
    [  2]: Handshake,
    [  3]: Chat,
    [  4]: UpdateTime,
    [  5]: PlayerInventory,
    [  6]: SpawnPosition,
    [  7]: UseEntity,
    [  8]: UpdateHealth,
    [  9]: Respawn,
    [ 10]: Flying,
    [ 11]: PlayerPosition,
    [ 12]: PlayerLook,
    [ 13]: PlayerLookMove,
    [ 14]: BlockDig,
    [ 15]: Place,
    [ 16]: BlockItemSwitch,
    [ 17]: Sleep,
    [ 18]: Animation,
    [ 19]: EntityAction,
    [ 20]: NamedEntitySpawn,
    [ 21]: PickupSpawn,
    [ 22]: Collect,
    [ 23]: VehicleSpawn,
    [ 24]: MobSpawn,
    [ 25]: EntityPainting,
//  [ 26]: Packet26,
    [ 27]: Position,
    [ 28]: EntityVelocity,
    [ 29]: DestroyEntity,
    [ 30]: Entity,
    [ 31]: RelEntityMove,
    [ 32]: EntityLook,
    [ 33]: RelEntityMoveLook,
    [ 34]: EntityTeleport,
//  [ 35]: Packet35,
//  [ 36]: Packet36,
//  [ 37]: Packet37,
    [ 38]: EntityStatus,
    [ 39]: AttachEntity,
    [ 40]: EntityMetadata,
//  [ 41-49]: Packet41 - Packet49
    [ 50]: PreChunk,
    [ 51]: MapChunk,
    [ 52]: MultiBlockChange,
    [ 53]: BlockChange,
    [ 54]: PlayNoteBlock,
//  [ 55-59]: Packet55 - Packet59
    [ 60]: Explosion,
    [ 61]: DoorChange,
//  [ 62-69]: Packet62 - Packet69
    [ 70]: Bed,
    [ 71]: Weather,
//  [ 72-99]: Packet72 - Packet99
    [100]: OpenWindow,
    [101]: CloseWindow,
    [102]: WindowClick,
    
}

export type ClientPacketMap = typeof CLIENT_PACKET_MAP

export type ClientPacketType = keyof ClientPacketMap

export type ClientPacket<T extends ClientPacketType = ClientPacketType> = InstanceType<ClientPacketMap[T]>