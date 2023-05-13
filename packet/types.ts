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

export const PACKET_MAP = {
    [ 0]: KeepAlive,
    [ 1]: Login,
    [ 2]: Handshake,
    [ 3]: Chat,
    [ 4]: UpdateTime,
    [ 5]: PlayerInventory,
    [ 6]: SpawnPosition,
    [ 7]: UseEntity,
    [ 8]: UpdateHealth,
    [ 9]: Respawn,
    [10]: Flying,
    [11]: PlayerPosition,
    [12]: PlayerLook,
    [13]: PlayerLookMove,
    [14]: BlockDig,
    [15]: Place,
    [16]: BlockItemSwitch,
    [17]: Sleep,
    [18]: Animation,
    [19]: EntityAction,
    [20]: NamedEntitySpawn,
    [21]: PickupSpawn,
    [22]: Collect,
    [23]: VehicleSpawn,
    [24]: MobSpawn,
    [25]: EntityPainting,
}

export type PacketMap = typeof PACKET_MAP

export type Type = keyof PacketMap

export type Packets = InstanceType<PacketMap[Type]>

export type Packet<T extends Type = Type> = InstanceType<PacketMap[T]>

export default Packets