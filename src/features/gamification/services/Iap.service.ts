import * as IAP from 'react-native-iap';
import { CurrencyService } from './Currency.service';
import { userCurrenciesRepository } from '../../../db_local/repositories';
import { useCurrencyStore } from '../../../store/CurrencyStore';
import { supabase } from '../../../api/supabaseClient';

/**
 * SKUs defined in Google Play Console
 */
export const IAP_SKUS = {
    SARDINE_FOR_NEKO: 'sardine_for_neko',
    REMOVE_ADS: 'premium_remove_ads',
};

const itemSkus = [IAP_SKUS.SARDINE_FOR_NEKO, IAP_SKUS.REMOVE_ADS];

export class IapService {
    private static purchaseUpdateSubscription: any = null;
    private static purchaseErrorSubscription: any = null;

    /**
     * Initialize IAP Connection
     */
    static async init(): Promise<boolean> {
        try {
            await IAP.initConnection();
            console.log('[IAP] Connection initialized (Android Only)');
            this.setupListeners();
            return true;
        } catch (err) {
            console.error('[IAP] Error initializing connection:', err);
            return false;
        }
    }

    /**
     * Fetch products information (prices, descriptions) from Store
     */
    static async getProducts(): Promise<IAP.Product[]> {
        try {
            const products = await IAP.fetchProducts({ skus: itemSkus });
            return (products as IAP.Product[]) || [];
        } catch (err) {
            console.error('[IAP] Error fetching products:', err);
            return [];
        }
    }

    /**
     * Main Listener for successful purchases
     */
    private static setupListeners() {
        if (this.purchaseUpdateSubscription) return;

        this.purchaseUpdateSubscription = IAP.purchaseUpdatedListener(async (purchase: IAP.Purchase) => {
            console.log('[IAP] Purchase Updated:', purchase.productId);
            
            // En Android usamos purchaseToken para validar que la compra existe
            if (purchase.purchaseToken && purchase.purchaseState === 'purchased') {
                try {
                    const isConsumable = purchase.productId === IAP_SKUS.SARDINE_FOR_NEKO;

                    if (purchase.productId === IAP_SKUS.SARDINE_FOR_NEKO) {
                        await this.handleSardinePurchase();
                    } else if (purchase.productId === IAP_SKUS.REMOVE_ADS) {
                        await this.handleRemoveAdsPurchase();
                    }

                    // Acknowledge/Consume and Finish
                    await IAP.finishTransaction({ purchase, isConsumable });
                } catch (ackErr) {
                    console.warn('[IAP] Error finishing transaction:', ackErr);
                }
            }
        });

        this.purchaseErrorSubscription = IAP.purchaseErrorListener((error: IAP.PurchaseError) => {
            console.warn('[IAP] Purchase Error:', error);
        });
    }

    private static async handleSardinePurchase() {
        await CurrencyService.addRewards(0, 1000);
        await CurrencyService.syncCurrencies();
        console.log('[IAP] Sardine for Neko! 1000 Coins awarded');
    }

    private static async handleRemoveAdsPurchase() {
        // Prevent duplicate activation/rewards
        const currentInventory = useCurrencyStore.getState().currencies.inventory;
        if (currentInventory?.remove_ads) {
            console.log('[IAP] Remove Ads already active. Skipping bonus.');
            return;
        }

        const newInventoryState = { remove_ads: true };
        await userCurrenciesRepository.updateInventory(newInventoryState);
        useCurrencyStore.getState().updateInventory(newInventoryState);
        
        // Grant 1500 coins bonus
        await CurrencyService.addRewards(0, 1500);
        
        await CurrencyService.syncCurrencies();
        console.log('[IAP] Remove Ads activated + 1500 coins awarded');
    }

    /**
     * Trigger a purchase request
     */
    static async buyItem(sku: string): Promise<void> {
        try {
            // Estructura correcta para v12+ / v14
            await IAP.requestPurchase({ 
                type: 'in-app',
                request: {
                    google: {
                        skus: [sku]
                    }
                }
            });
        } catch (err: any) {
            console.error('[IAP] Error requesting purchase:', err.message);
            if (err.code === 'E_ALREADY_OWNED') {
                 console.log('[IAP] Item already owned. Attempting to restore...');
                 await this.restorePurchases();
            }
            throw err;
        }
    }

    static async restorePurchases(): Promise<void> {
        try {
            console.log('[IAP] Attempting to restore purchases...');
            const purchases = await IAP.getAvailablePurchases();
            
            for (const purchase of purchases) {
                // Focus on non-consumables (Premium)
                if (purchase.productId === IAP_SKUS.REMOVE_ADS) {
                    // Validar por dispositivo, no nos importa backend ni cuentas anteriores:
                    await this.handleRemoveAdsPurchase();
                    console.log('[IAP] Purchase restored successfully (Local Device):', purchase.productId);
                }
            }
        } catch (err) {
            console.error('[IAP] Error restoring purchases:', err);
        }
    }

    /**
     * Cleanup listeners
     */
    static end() {
        if (this.purchaseUpdateSubscription) {
            this.purchaseUpdateSubscription.remove();
            this.purchaseUpdateSubscription = null;
        }
        if (this.purchaseErrorSubscription) {
            this.purchaseErrorSubscription.remove();
            this.purchaseErrorSubscription = null;
        }
        IAP.endConnection();
    }
}


