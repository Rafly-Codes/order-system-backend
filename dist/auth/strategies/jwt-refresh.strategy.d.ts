import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';
declare const JwtRefreshStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtRefreshStrategy extends JwtRefreshStrategy_base {
    private usersService;
    constructor(usersService: UsersService);
    validate(req: Request, payload: {
        sub: string;
    }): Promise<{
        refreshToken: string;
        id: string;
        createdAt: Date;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
}
export {};
