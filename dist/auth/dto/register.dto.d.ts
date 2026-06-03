export declare enum Role {
    ADMIN = "ADMIN",
    KASIR = "KASIR",
    PELANGGAN = "PELANGGAN"
}
export declare class RegisterDto {
    name: string;
    email: string;
    password: string;
    role?: Role;
}
