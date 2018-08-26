import { AnyFunction } from 'utils/function';

export interface IController<K> {
    isPressed(key: K): boolean;
    subscribe(key: K, handler: AnyFunction): void;
    unsubscribe(key: K, handler: AnyFunction): void;
}

export type TControllerState<K extends string> = { [key in K]?: boolean };
