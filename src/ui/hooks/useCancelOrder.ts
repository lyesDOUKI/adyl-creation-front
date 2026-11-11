import {useAsyncCreateState} from "@/ui/hooks/core/use-async-create-state.ts";
import {orderUseCases} from "@/composition/container.ts";

export const useCancelOrder = () => {
    return useAsyncCreateState(orderUseCases.cancel);
}