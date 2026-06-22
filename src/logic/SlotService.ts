import { IPayoutProvider, PayoutProvider } from "./PayoutProvider";
import { SlotModel, SlotSymbol, SpinResult, SymbolsMatrix } from "./Types";
import { getMiddleRowSymbols, getRandomSymbolFromPool } from "./Utils";

export interface ISlotService {
    getSymbolPool(): SlotSymbol[];
    getSpinResult(): SpinResult;
}

export class SlotService implements ISlotService {
    private readonly payoutProvider: IPayoutProvider;

    constructor(private readonly slotModel: SlotModel) {
        this.payoutProvider = new PayoutProvider(this.slotModel.payTable);
    }

    getSymbolPool(): SlotSymbol[] {
        return [...this.slotModel.symbolPool];
    }

    getSpinResult(): SpinResult {
        const isForcedWin: boolean = Math.random() < 0.33;
        const symbolsMatrix = isForcedWin
            ? this.getWinningSymbolsMatrix()
            : this.getRandomSymbolsMatrix();

        const payout: number = this.payoutProvider.getPayout(symbolsMatrix);

        return {
            symbolsMatrix: symbolsMatrix,
            payout: payout,
            isWin: payout > 0
        }
    }

    private getWinningSymbolsMatrix(): SymbolsMatrix {
        const symbolsMatrix: SymbolsMatrix = this.getRandomSymbolsMatrix();

        const winningSymbol: SlotSymbol = getRandomSymbolFromPool(this.slotModel.symbolPool);
        const middleRowSymbols: SlotSymbol[] = getMiddleRowSymbols(symbolsMatrix);

        middleRowSymbols.fill(winningSymbol);

        console.log(`Forced win rolled: ${winningSymbol.name}`);
        return symbolsMatrix;
    }

    private getRandomSymbolsMatrix(): SymbolsMatrix {
        return Array.from({ length: this.slotModel.rowCount },
            () => Array.from({ length: this.slotModel.reelCount }, () => getRandomSymbolFromPool(this.slotModel.symbolPool)))
    }
}