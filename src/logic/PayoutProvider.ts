import { getMiddleRowSymbols } from "./Utils";
import { PayTable, SlotSymbol, SymbolsMatrix } from "./Types";

export type IPayoutProvider = {
    getPayout(symbolsMatrix: SymbolsMatrix): number;
}

export class PayoutProvider implements IPayoutProvider {
    constructor(private readonly payTable: PayTable) { }

    getPayout(symbolsMatrix: SymbolsMatrix): number {
        const middleRowSymbols = getMiddleRowSymbols(symbolsMatrix);

        const firstSymbol: SlotSymbol | undefined = middleRowSymbols[0];

        if (firstSymbol === undefined) {
            console.warn("Middle row does not contain a symbol at index: 0");
            return 0;
        }

        const isWinner: boolean = middleRowSymbols.every(symbol => symbol.id === firstSymbol.id);

        if (!isWinner) {
            return 0;
        }

        const payoutValue: number | undefined = this.payTable.get(firstSymbol.id);

        if (payoutValue === undefined) {
            console.warn(`Unable to find a payout value with key: ${firstSymbol.id}`);
            return 0;
        }

        return payoutValue;
    }

}