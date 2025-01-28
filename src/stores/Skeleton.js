import { defineStore } from 'pinia';
import { SkeletonService } from '@/services';

export const useSkeletonStore = defineStore('SkeletonStore', () => {
    const logFunction = () => {
        return SkeletonService.test();
    };

    return {
        logFunction
    };
});
