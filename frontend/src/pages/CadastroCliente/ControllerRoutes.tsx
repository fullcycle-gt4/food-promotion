type CreateCustomerUseCase = {
  execute(dto: Record<string, unknown>): Promise<unknown>;
};

@Controller('customers')
export class CustomerController {
  constructor(private readonly createCustomerUseCase: CreateCustomerUseCase) {}

  @Post()
  async create(dto: Parameters<CreateCustomerUseCase['execute']>[0]) {
    return await this.createCustomerUseCase.execute(dto);
  }
}

function Post(): (
  target: (dto: Parameters<CreateCustomerUseCase["execute"]>[0]) => Promise<unknown>,
  context: ClassMethodDecoratorContext<
    CustomerController,
    (dto: Parameters<CreateCustomerUseCase["execute"]>[0]) => Promise<unknown>
  >,
) => void | ((dto: Parameters<CreateCustomerUseCase["execute"]>[0]) => Promise<unknown>) {
  return (target) => target;
}
function Controller(arg0: string): (target: typeof CustomerController, context: ClassDecoratorContext<typeof CustomerController>) => void | typeof CustomerController {
  return (target, context) => {
    if (context.kind !== 'class') {
      throw new TypeError(`@Controller('${arg0}') can only be applied to a class`);
    }

    return target;
  };
}

