import { ISlotMachine } from "./logic/SlotMachine";
import { ISlotMachineFactory, SlotMachineFactory } from "./logic/SlotMachineFactory";
import { ISlotService, SlotService } from "./logic/SlotService";
import { SlotConfigResponseDto, SlotModel } from "./logic/Types";
import { mapSlotConfigToDomain } from "./logic/Utils";
import "./style.css";
import { ISlotView, SlotView } from "./ui/SlotView";

async function main(): Promise<void> {
    const response = await fetch("/data/slotConfigResponse.json");

    if (!response.ok) {
        throw new Error(`Failed to load slot config. Status: ${response.status}`);
    }

    const data: unknown = await response.json();
    const config: SlotConfigResponseDto = data as SlotConfigResponseDto;
    const slotModel: SlotModel = mapSlotConfigToDomain(config);

    const slotView: ISlotView = new SlotView();
    const slotService: ISlotService = new SlotService(slotModel);
    const slotMachineFactory: ISlotMachineFactory = new SlotMachineFactory();
    const slotMachine: ISlotMachine = slotMachineFactory.createSlotMachine(slotModel, slotService, slotView);

    slotMachine.initialize();
}

main().catch(error => { console.error(`Failed to initialize the app.`, error) });