import { IController, TControllerState } from './icontroller';
import { IDestroyable } from 'utils/idestroyable';

export abstract class Controller<K extends string> implements IController<K>, IDestroyable {
    protected _state: TControllerState<K> = {};
    protected _handlers: Map<string, Set<() => void>> = new Map();

    public subscribe(key: string, handler: () => void): void {
        let set = this._handlers.get(key);
        if (set === undefined) {
            set = new Set();
            this._handlers.set(key, set);
        }

        set.add(handler);
    }

    public unsubscribe(key: string, handler: () => void): void {
        const set = this._handlers.get(key);
        if (set !== undefined) {
            set.delete(handler);
        }
    }

    public destroy(): void {
        this._removeListeners();
    }

    public isPressed(key: K): boolean {
        return Boolean(this._state[key]);
    }

    protected abstract _addListeners(): void;

    protected abstract _removeListeners(): void;
}
