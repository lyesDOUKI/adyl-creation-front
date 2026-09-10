import {useAsyncCreateState} from "@/ui/hooks/core/use-async-create-state.ts";
import {customerUseCases} from "@/composition/container.ts";

export const useRegisterCustomer = () => {
    const {
        submitAction,
        ...state
    } = useAsyncCreateState(customerUseCases.register);

    return {
        ...state,
        isRegistering: state.isSubmitting,
        registerCustomer: submitAction,
    };
};