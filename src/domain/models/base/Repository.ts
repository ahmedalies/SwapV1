
export interface Repository<T> {
    findByOneKey(queryElement: any): Promise<T>;
    findByTwoKeys(k1: string, k2: string, v1: string|number|boolean, v2: string|number|boolean): Promise<T>;
    findOne(selections: string[], whereKeys:string[], whereValues: string[], fromQoutes: number): Promise<T>
    findMany(selections: string[], whereKeys:string[], whereValues: string[], fromQoutes: number): Promise<T[]>;
    findAll(): Promise<T[]>;
    insert(insertKeys: string[], insertValues: string[]): Promise<T>;
    update(updateKeys: string[], updateValues: string[], whereKeys: string[], whereValues: string[]): Promise<T>;
    remove(id: string): Promise<boolean>;
    findAllByOnKey(queryElement: any): Promise<T[]>;
    createSHA1Hash(value: any): Promise<string>;
}