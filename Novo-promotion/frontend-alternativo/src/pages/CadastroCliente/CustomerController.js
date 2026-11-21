@Controller('customers')
export class CustomerController {
    createCustomerUseCase;
    constructor(createCustomerUseCase) {
        this.createCustomerUseCase = createCustomerUseCase;
    }
    @Post()
    async create(dto) {
        return await this.createCustomerUseCase.execute(dto);
    }
}
function Post() {
    return (target) => target;
}
function Controller(arg0) {
    return (target, context) => {
        if (context.kind !== 'class') {
            throw new TypeError(`@Controller('${arg0}') can only be applied to a class`);
        }
        return target;
    };
}
//# sourceMappingURL=CustomerController.js.map