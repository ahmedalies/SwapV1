
export interface Repository<T> {
    findByTwoKeys(k1: string, k2: string, v1: string|number|boolean, v2: string|number|boolean): Promise<T>;
    insert(object: T): Promise<T>;
}