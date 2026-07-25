import { orderUseCases } from "@/composition/container"
import { useAsyncCreateState } from "./core/use-async-create-state"

export const useCreateOrder = () => {
    return useAsyncCreateState(orderUseCases.create);
}