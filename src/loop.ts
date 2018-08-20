import { IDestroyable } from 'utils/idestroyable';

export const enum LoopState {
    Running,
    Paused,
}

export type TLoopCallback = (state: LoopState, dt: number, t: number) => void;

export interface ILoop extends IDestroyable {
    start(): void;
    stop(): void;
    state(): LoopState;
}

export class Loop implements ILoop {
    private _state: LoopState = LoopState.Running;
    private _t: number = 0;
    private _rafID: number = -1;
    private _callback: TLoopCallback;
    private _t0: number = performance.now();

    public constructor(callback: TLoopCallback) {
        this._callback = callback;
    }

    public start(): void {
        console.log('start');
        this._state = LoopState.Running;
        this._t0 = performance.now();
        this._scheduleFrame();
    }

    public stop(): void {
        console.log('stop');
        this._state = LoopState.Paused;
    }

    public state(): LoopState {
        return this._state;
    }

    public destroy(): void {
        console.info('Loop: Destroy');
        window.cancelAnimationFrame(this._rafID);
    }

    private _scheduleFrame(): void {
        this._rafID = window.requestAnimationFrame(this._tick);
    }

    private _tick = () => {
        const t1 = performance.now();
        const dt = t1 - this._t0;
        this._t0 = t1;

        if (this._state === LoopState.Running) {
            this._t += dt;
        }

        this._callback(this._state, dt, this._t);
        this._scheduleFrame();
    };
}
