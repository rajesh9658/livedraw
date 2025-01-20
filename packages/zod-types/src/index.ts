import {z} from 'zod';

export const userschema = z.object({
    name:z.string().min(3).max(10),
    fname:z.string().min(5).max(50),
    email:z.string().email(),
    password:z.string().min(5).max(15).regex(/^[a-zA-Z0-9]{3,30}$/),
})


export const roomschema = z.object({
    name:z.string().min(3).max(15),
    description:z.string().min(5).max(50),
    slug:z.string().min(5).max(50),
})

export const loginschema = z.object({
    email:z.string().email(),
    password:z.string().min(5).max(15).regex(/^[a-zA-Z0-9]{3,30}$/),
})