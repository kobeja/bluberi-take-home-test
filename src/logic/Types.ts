export enum SlotPhase {
    Idle = "Idle",
    Spinning = "Spinning"
}

export type SlotSymbol = {
    readonly id: number;
    readonly name: string;
    readonly symbolIcon: string;
}

export type SymbolsMatrix = SlotSymbol[][]

export type SlotState = {
    symbolsMatrix: SymbolsMatrix;
    phase: SlotPhase;
}

export type SpinResult = {
    readonly isWin: boolean;
    readonly payout: number;
    readonly symbolsMatrix: SymbolsMatrix;
}

export type PayTable = Map<number, number>

export type SlotConfigResponseDto = {
    name: string;
    id: number;
    reelCount: number;
    rowCount: number;
    symbolPool: SlotSymbol[];
    payTable: Record<string, number>;
}

export class SlotModel {
    public constructor(
        public readonly name: string,
        public readonly id: number,
        public readonly reelCount: number,
        public readonly rowCount: number,
        public readonly symbolPool: SlotSymbol[],
        public readonly payTable: PayTable
    ) { }
}