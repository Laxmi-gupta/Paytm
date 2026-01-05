import { z } from "zod";
declare const login: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
declare const register: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    number: z.ZodString;
}, z.core.$strip>;
export type LoginCred = z.infer<typeof login>;
export type SignupCred = z.infer<typeof register>;
export declare const authSchema: {
    login: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
    }, z.core.$strip>;
    register: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodString;
        password: z.ZodString;
        number: z.ZodString;
    }, z.core.$strip>;
};
export {};
//# sourceMappingURL=authSchema.d.ts.map