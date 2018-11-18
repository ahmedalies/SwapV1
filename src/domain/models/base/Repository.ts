
export interface Repository<T> {
    findByOneKey(queryElement: any): Promise<T>;
    findByTwoKeys(k1: string, k2: string, v1: string|number|boolean, v2: string|number|boolean): Promise<T>;
    findAll(): Promise<T[]>;
    insert(object: T): Promise<T>;
    update(id: string, object: T): Promise<T>;
    remove(id: string): Promise<boolean>;
    findAllByOnKey(queryElement: any): Promise<T[]>;
}