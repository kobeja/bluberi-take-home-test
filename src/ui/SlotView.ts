import { SlotSymbol, SpinResult, SymbolsMatrix } from "../logic/Types";
import { delay, getRandomSymbolFromPool } from "../logic/Utils";

export interface ISlotView {
    initialize(symbolsMatrix: SymbolsMatrix, symbolPool: SlotSymbol[]): void,
    playSpinAnimationAsync(spinResult: SpinResult): Promise<void>,
    onSpinRequested(callback: () => Promise<void> | void): void
}

export class SlotView implements ISlotView {
    private readonly reelsElement = this.getRequiredElement<HTMLDivElement>("#reels");
    private readonly messageElement = this.getRequiredElement<HTMLParagraphElement>("#message");
    private readonly spinButton = this.getRequiredElement<HTMLButtonElement>("#spin-button");
    private readonly symbolCellElements: HTMLDivElement[] = Array.from(
        this.reelsElement.querySelectorAll<HTMLDivElement>(".slot-cell"));

    private symbolPool: SlotSymbol[] = [];

    initialize(symbolsMatrix: SymbolsMatrix, symbolPool: SlotSymbol[]): void {
        this.symbolPool = [...symbolPool];
        this.renderSymbols(symbolsMatrix);
        this.messageElement.textContent = "Ready to spin.";
    }

    async playSpinAnimationAsync(spinResult: SpinResult): Promise<void> {
        const spinDurationInMs: number = 1200;
        const spinSpeedInMs: number = 100;
        const startTimeInMs: number = performance.now();

        this.spinButton.disabled = true;
        this.messageElement.textContent = "Spinning...";

        while (performance.now() - startTimeInMs < spinDurationInMs) {
            const tempSymbolsMatrix: SymbolsMatrix = spinResult.symbolsMatrix.map(row =>
                row.map(() => getRandomSymbolFromPool(this.symbolPool)))

            this.renderSymbols(tempSymbolsMatrix);
            await delay(spinSpeedInMs);
        }

        this.renderSymbols(spinResult.symbolsMatrix);
        this.spinButton.disabled = false;
        this.messageElement.textContent = spinResult.isWin
            ? `You've won ${spinResult.payout}!`
            : "Unlucky... Spin again!"
    }

    onSpinRequested(callback: () => Promise<void> | void): void {
        this.spinButton.addEventListener("click", () => {
            Promise.resolve(callback()).catch(error => {
                console.error("Spin request failed.", error);
                this.spinButton.disabled = false;
                this.messageElement.textContent = "Spin failed... Try again."
            })
        })
    }

    private getRequiredElement<TElement extends HTMLElement>(selector: string): TElement {
        const element: TElement | null = document.querySelector<TElement>(selector);

        if (element === null) {
            throw new Error(`Missing required element: ${selector}`);
        }

        return element;
    }

    private renderSymbols(symbolsMatrix: SymbolsMatrix) {
        const rows: SlotSymbol[][] = symbolsMatrix;
        const columnCount: number = rows[0]?.length ?? 0;
        const symbolCount: number = rows.length * columnCount;

        if (rows.length === 0 || columnCount === 0) {
            throw new Error("Symbols matrix is missing elements, cannot render.");
        }

        if (this.symbolCellElements.length !== symbolCount) {
            throw new Error(`Symbols mismatch detected. Expected ${symbolCount} slot cells but found ${this.symbolCellElements.length}`);
        }

        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            const row: SlotSymbol[] = rows[rowIndex]!;

            if (row.length !== columnCount) {
                throw new Error("Cannot render a symbols matrix with uneven row lengths.");
            }

            for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
                const symbol: SlotSymbol = row[columnIndex]!;
                const cellIndex: number = rowIndex * columnCount + columnIndex;
                const cellElement: HTMLDivElement | undefined = this.symbolCellElements[cellIndex];

                if (cellElement === undefined) {
                    throw new Error(`Missing slot cell at index: ${cellIndex}.`);
                }

                cellElement.textContent = symbol.symbolIcon;
            }
        }
    }
}