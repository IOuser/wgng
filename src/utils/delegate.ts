import { ISubscription } from './isubscription';
import { IDestroyable } from './idestroyable';

export type THandler<T> = (arg: T) => void;

export interface IDelegate<T> extends ISubscription, IDestroyable {
    subscribe(handler: THandler<T>): void;
    unsubscribe(handler: THandler<T>): void;
    fire(value: T): void;
}

export class Delegate<T> implements IDelegate<T> {
    private _handlers: Set<THandler<T>> = new Set();

    public destroy(): void {
        this._handlers.clear();
    }

    public subscribe(handler: THandler<T>): void {
        this._handlers.add(handler);
    }

    public unsubscribe(handler: THandler<T>): void {
        this._handlers.delete(handler);
    }

    public fire(value: T): void {
        const itr = this._handlers.values();
        for (const handler of itr) {
            handler(value);
        }
    }
}
