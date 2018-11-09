
export interface Repository<T> {
    login(email: string, password: string): Promise<T>;
}