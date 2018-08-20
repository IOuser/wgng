import { AnyFunction } from './function';

export interface ISubscription {
    subscribe(key: string, handler: AnyFunction): void;
    unsubscribe(key: string, handler: AnyFunction): void;
}
