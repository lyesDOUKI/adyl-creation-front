export interface AsyncReadState<TData> {
    data: TData;
    isLoading: boolean;
    error: string | null;
}