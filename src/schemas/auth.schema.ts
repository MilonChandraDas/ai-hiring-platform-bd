import {z} from 'zod'

export const loginSchema = z.object({
    email: z.string().email('Enter Valid email'),
    password: z.string().min(6, "At list 6 char enter")
})

export const registerSchema = z.object({
    username: z.string().min(3, "At list 3 char enter"),
    email: z.string().email("Enter Valid email"),
    password: z.string().min(6, "At list 6 char enter"),
    role: z.enum(['CANDIDATE', 'RECRUITER'], {message: "Role Select please"})

})

export type LoginDto = z.infer<typeof loginSchema>
export type RegisterDto = z.infer<typeof registerSchema>