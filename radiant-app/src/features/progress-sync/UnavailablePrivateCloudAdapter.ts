import { CloudUnavailableError, type PrivateCloudPort } from './progressSync.types';

/**
 * Adaptador padrão enquanto o plugin do iCloud não passou por build interno.
 * Responde `cloud-unavailable`; o cartão informa e o estudo segue normal.
 */
export class UnavailablePrivateCloudAdapter implements PrivateCloudPort {
    async pull(): Promise<never> {
        throw new CloudUnavailableError();
    }

    async push(): Promise<never> {
        throw new CloudUnavailableError();
    }
}
