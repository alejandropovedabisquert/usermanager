export type User = {
    _id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    role: string;
    password?: string;
    createdAt: string;
    updatedAt: string;
}