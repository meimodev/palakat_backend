import { Controller } from '@nestjs/common';
import { ChurchService } from './church.service';

@Controller('church')
export class ChurchController {
  constructor(private readonly churchService: ChurchService) {}
}
