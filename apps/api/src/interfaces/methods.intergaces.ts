export interface IUserCreate {
    email: string;
    name: string;
    password: string;
};

export interface IUserUpdate {
    email?: string;
    name?: string;
    password?: string;
};

export interface IUserMethods {
    createUser(data: IUserCreate): Promise<any>;
    updateUser(id: string, data: IUserUpdate): Promise<any>;
    deleteUser(id: string): Promise<any>;
    getUserById(id: string): Promise<any>;
    getAllUsers(): Promise<any[]>;
}