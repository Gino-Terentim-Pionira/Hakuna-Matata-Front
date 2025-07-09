import { atom } from "recoil";

export interface IPremiumTier {
    name: string;
    description: string;
    details: string;
    productId: string;
    premiumValue: number;
    checkoutId: string;
    isSubscription: boolean;
    isUserSubscribed: boolean;
}

const premiumTierState = atom<IPremiumTier[]>({
    key: "premiumTierState",
    default: []
});

export {
    premiumTierState
};
