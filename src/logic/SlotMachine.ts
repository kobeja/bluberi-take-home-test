import { ISlotView } from "../ui/SlotView";
import { ISlotService } from "./SlotService";
import { SlotPhase, SlotState, SpinResult } from "./Types";

export interface ISlotMachine {
    initialize(): void
}

export class SlotMachine implements ISlotMachine {
    constructor(
        private readonly slotService: ISlotService,
        private readonly slotState: SlotState,
        private readonly slotView: ISlotView
    ) { }

    initialize(): void {
        this.slotView.initialize(this.slotState.symbolsMatrix, this.slotService.getSymbolPool());
        this.slotView.onSpinRequested(() => this.onSpinRequestedAsync());
    }

    private async onSpinRequestedAsync(): Promise<void> {
        if (this.slotState.phase === SlotPhase.Spinning) {
            console.warn("Spin requested while the slot is already spinning.")
            return;
        }

        this.slotState.phase = SlotPhase.Spinning;

        try {
            const spinResult: SpinResult = this.slotService.getSpinResult();
            await this.slotView.playSpinAnimationAsync(spinResult);
            this.slotState.symbolsMatrix = spinResult.symbolsMatrix;
        }
        finally {
            this.slotState.phase = SlotPhase.Idle;
        }
    }
}