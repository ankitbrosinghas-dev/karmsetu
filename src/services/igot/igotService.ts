import { IgotService } from './igotTypes';
import { IgotClient } from './igotClient';
import { IgotMockService } from './igotMockService';
import { igotConfig } from './igotConfig';

let serviceInstance: IgotService | null = null;

export function getIgotService(): IgotService {
  if (!serviceInstance) {
    if (igotConfig.isDemoMode) {
      serviceInstance = new IgotMockService();
    } else {
      serviceInstance = new IgotClient();
    }
  }
  return serviceInstance;
}
