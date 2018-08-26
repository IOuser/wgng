import { AnyFunction } from './function';

export interface ISubscription {
    subscribe(handler: AnyFunction): void;
    unsubscribe(handler: AnyFunction): void;
}
