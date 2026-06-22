import { PayTable, SlotConfigResponseDto, SlotModel, SlotSymbol, SymbolsMatrix } from "./Types";

export function delay(milliseconds: number): Promise<void> {
    if (milliseconds < 0) {
        throw new Error("Delay duration cannot be negative.");
    }

    return new Promise(resolve => window.setTimeout(resolve, milliseconds));
}

export function mapSlotConfigToDomain(config: SlotConfigResponseDto): SlotModel {
    const payTable: PayTable = new Map(
        Object.entries(config.payTable).map(([symbolId, payoutValue]) => [
            Number(symbolId),
            payoutValue
        ])
    )

    return new SlotModel(
        config.name,
        config.id,
        config.reelCount,
        config.rowCount,
        config.symbolPool,
        payTable
    )
}

export function getMiddleRowSymbols(symbolsMatrix: SymbolsMatrix): SlotSymbol[] {
    const middleRowIndex: number = Math.floor(symbolsMatrix.length / 2);
    const middleRowSymbols: SlotSymbol[] | undefined = symbolsMatrix[middleRowIndex];

    if (middleRowSymbols === undefined) {
        throw new Error(`Could not find a row of symbols at index: ${middleRowIndex}`);
    }

    return middleRowSymbols;
}

export function getRandomSymbolFromPool(symbolPool: SlotSymbol[]): SlotSymbol {
    if (symbolPool.length === 0) {
        throw new Error("Cannot select a random symbol from an empty pool.");
    }

    const randomIndex: number = Math.floor(Math.random() * symbolPool.length);
    const symbol: SlotSymbol | undefined = symbolPool[randomIndex];

    if (symbol === undefined) {
        throw new Error(`Symbol is of type: ${typeof(undefined)}.`);
    }

    return symbol;
}