import { Controller, Get, Query } from "@nestjs/common";
import { DataService } from "./data.service";

@Controller('data')
export class DataController {
    constructor(private readonly dataService: DataService) {}

    @Get('holders_project_distribution')
    async getHoldersProjectDistribution(@Query('contract') contract: string): Promise<string> {
        return this.dataService.getHoldersProjectDistribution(contract)
    }

}