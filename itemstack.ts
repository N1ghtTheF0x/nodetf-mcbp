class ItemStack
{
    itemID: number
    stackSize: number
    itemDamage: number
    constructor(id: number,size: number,damage: number)
    {
        this.itemID = id
        this.stackSize = size
        this.itemDamage = damage
    }
}

export default ItemStack