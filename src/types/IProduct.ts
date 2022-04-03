import {HydratedDocument} from 'mongoose'

export default interface IProduct {
    name: string,
    price: number,
    quantity: number,
    description: string,
    images: string[],
    nextImageId: number
}

export type ProductDocument = HydratedDocument<IProduct>