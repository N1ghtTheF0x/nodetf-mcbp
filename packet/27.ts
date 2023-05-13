import DataStream from "../datastream"
import AbstractPacket from "./packet"

class Position extends AbstractPacket
{
    field_22039_a: number = NaN
    field_22038_b: number = NaN
    field_22043_c: boolean = false
    field_22042_d: boolean = false
    field_22041_e: number = NaN
    
    constructor()
    {
        super()
    }
    read(buffer: DataStream): void 
    {
        
    }
    write(): DataStream 
    {
        return this.createBuffer()    
    }
    size(): number 
    {
        return    
    }
}

export default Position