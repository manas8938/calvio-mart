import { Matches } from 'class-validator';

export class ConfirmWhatsappDto {
  @Matches(/^[\d+\-\s()]+$/, { message: 'Invalid phone number' })
  whatsappNumber: string;
}
