type CreateCustomerUseCase = {
    execute(dto: Record<string, unknown>): Promise<unknown>;
};
export declare class CustomerController {
    private readonly createCustomerUseCase;
    constructor(createCustomerUseCase: CreateCustomerUseCase);
    create(dto: Parameters<CreateCustomerUseCase['execute']>[0]): Promise<unknown>;
}
export {};
//# sourceMappingURL=CustomerController.d.ts.map