import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AppService } from "./app.service";

@ApiTags("health")
@Controller("health")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: "Проверка здоровья сервиса" })
  @ApiResponse({ status: 200, description: "Сервис работает" })
  async getHealth() {
    return this.appService.getHealth();
  }
}
