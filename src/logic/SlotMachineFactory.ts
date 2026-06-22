import { ISlotView } from "../ui/SlotView";
import { SlotMachine } from "./SlotMachine";
import { ISlotService } from "./SlotService";
import { SlotModel, SlotPhase, SlotState, SymbolsMatrix } from "./Types";
import { getRandomSymbolFromPool } from "./Utils";

export interface ISlotMachineFactory {
    createSlotMachine(slotModel: SlotModel, slotService: ISlotService, slotView: ISlotView): SlotMachine;
}

export class SlotMachineFactory implements ISlotMachineFactory {
    createSlotMachine(slotModel: SlotModel, slotService: ISlotService, slotView: ISlotView): SlotMachine {
        const initialSymbolsMatrix: SymbolsMatrix = Array.from({ length: slotModel.rowCount }, () =>
            Array.from({ length: slotModel.reelCount }, () => getRandomSymbolFromPool(slotModel.symbolPool)))

        const initialState: SlotState = {
            symbolsMatrix: initialSymbolsMatrix,
            phase: SlotPhase.Idle
        }

        return new SlotMachine(slotService, initialState, slotView)
    }
}