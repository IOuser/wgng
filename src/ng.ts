import { IDestroyable } from 'utils/idestroyable';
import { ILoop, Loop, LoopState } from 'loop';
import { IController } from 'controllers/icontroller';
import { Keys } from 'utils/keys';

export type WGNGParams = {
    canvas: HTMLCanvasElement | string;
};

export class WGNG implements IDestroyable {
    private _params: WGNGParams;
    private _canvasEl: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;

    private _loop: ILoop = new Loop(this._tick.bind(this));

    private _controllers: Map<string, IController<any>> = new Map();
    // private _eventsQueue: Set<string> = new Set();
    // private _inputEvents: string[] = [
    //     'play',
    //     'pause',
    //     //
    // ];

    public constructor(params: WGNGParams) {
        this._params = params;

        // Prepare canvas
        const { canvas: canvasElOrSelector } = this._params;
        let canvasEl: HTMLCanvasElement | string | null = canvasElOrSelector;
        if (isString(canvasElOrSelector)) {
            canvasEl = document.querySelector<HTMLCanvasElement>(canvasElOrSelector);
        }

        if (!isCanvasEl(canvasEl)) {
            throw new Error('Canvas not founded');
        }

        this._canvasEl = canvasEl;

        // Prepare context
        const ctx = canvasEl.getContext('2d');
        if (ctx === null) {
            throw new Error('CTX not found');
        }

        this._ctx = ctx;
    }

    public start(): void {
        // TODO: Create a controller
        this._loop.start();
    }

    public destroy(): void {
        console.info('WGNG: Destroy');
        this._removeListeners();
        this._controllers.clear();
        this._loop.destroy();
        const { width, height } = this._canvasEl;
        this._ctx.clearRect(0, 0, width, height);
    }

    public addController(id: string, controller: IController<any>): void {
        this._controllers.set(id, controller);
        this._addListeners();
    }

    public removeController(id: string): void {
        this._controllers.delete(id);
    }

    private _addListeners(): void {
        const kb = this._controllers.get('keyboard');
        if (kb) {
            kb.subscribe(Keys.Escape, this._toggleState);
        }
    }

    private _removeListeners(): void {
        const kb = this._controllers.get('keyboard');
        if (kb) {
            kb.unsubscribe(Keys.Escape, this._toggleState);
        }
    }

    private _toggleState = () => {
        if (this._loop.state() === LoopState.Running) {
            this._loop.stop();
        } else {
            this._loop.start();
        }
    };

    // private _checkInput(_dt: number): void {
    //     for (const controller of this._controllers.values()) {
    //         if (this._loop.state() === LoopState.Running && controller.isPressed(Keys.Escape)) {
    //             this._eventsQueue.add('pause');
    //         }

    //         if (this._loop.state() === LoopState.Paused && controller.isPressed(Keys.Escape)) {
    //             this._eventsQueue.add('play');
    //         }
    //     }
    // }

    // private _fireEvents(): void {
    //     if (this._eventsQueue.has('pause')) {
    //         // console.log('stop');
    //         this._loop.stop();
    //         this._eventsQueue.delete('pause');
    //     }

    //     if (this._eventsQueue.has('play')) {
    //         // console.log('start');
    //         this._loop.start();
    //         this._eventsQueue.delete('play');
    //     }
    // }

    private _tick(state: LoopState, dt: number, t: number): void {
        // this._checkInput(dt);

        const ctx = this._ctx;
        const { width, height } = this._canvasEl;
        ctx.save();
        ctx.fillStyle = '#333';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#555';
        ctx.fillRect(0, height * 0.1, width, height - height * 0.2);

        ctx.fillStyle = '#777';
        ctx.font = '24px monospace';
        ctx.fillText(
            `${width}x${height} - S: ${state === LoopState.Running ? 'Running' : 'Paused'} - dt: ${dt.toFixed(
                1,
            )} - T: ${t}`,
            5,
            height - 10,
        );
        ctx.restore();

        // this._fireEvents();
    }
}

const isString = (val: unknown): val is string => typeof val === 'string';
const isCanvasEl = (el: unknown): el is HTMLCanvasElement => el != null && el instanceof HTMLCanvasElement;
