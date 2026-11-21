declare const openApiSpec: {
    openapi: string;
    info: {
        title: string;
        version: string;
        description: string;
    };
    servers: {
        url: string;
        description: string;
    }[];
    tags: {
        name: string;
        description: string;
    }[];
    paths: {
        '/api/v1/health': {
            get: {
                tags: string[];
                summary: string;
                operationId: string;
                responses: {
                    200: {
                        description: any;
                        headers: {
                            'X-Request-Id': {
                                $ref: string;
                            };
                        };
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: ({
                                        $ref: string;
                                        type?: never;
                                        properties?: never;
                                    } | {
                                        $ref?: never;
                                        type: string;
                                        properties: {
                                            data: any;
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                    500: {
                        description: any;
                        headers: {
                            'X-Request-Id': {
                                $ref: string;
                            };
                        };
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        '/api/v1/categories': {
            get: {
                tags: string[];
                summary: string;
                operationId: string;
                responses: {
                    200: {
                        description: any;
                        headers: {
                            'X-Request-Id': {
                                $ref: string;
                            };
                        };
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: ({
                                        $ref: string;
                                        type?: never;
                                        properties?: never;
                                    } | {
                                        $ref?: never;
                                        type: string;
                                        properties: {
                                            data: any;
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                    500: {
                        description: any;
                        headers: {
                            'X-Request-Id': {
                                $ref: string;
                            };
                        };
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        '/api/v1/products': {
            get: {
                tags: string[];
                summary: string;
                operationId: string;
                parameters: ({
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        maxLength: number;
                        enum?: never;
                        minimum?: never;
                        maximum?: never;
                        default?: never;
                    };
                    description?: never;
                } | {
                    name: string;
                    in: string;
                    description: string;
                    schema: {
                        maxLength?: never;
                        type: string;
                        default: boolean;
                        enum?: never;
                        minimum?: never;
                        maximum?: never;
                    };
                } | {
                    description?: never;
                    name: string;
                    in: string;
                    schema: {
                        maxLength?: never;
                        type: string;
                        enum: string[];
                        default: string;
                        minimum?: never;
                        maximum?: never;
                    };
                } | {
                    description?: never;
                    name: string;
                    in: string;
                    schema: {
                        maxLength?: never;
                        enum?: never;
                        type: string;
                        minimum: number;
                        default: number;
                        maximum?: never;
                    };
                } | {
                    description?: never;
                    name: string;
                    in: string;
                    schema: {
                        maxLength?: never;
                        enum?: never;
                        type: string;
                        minimum: number;
                        maximum: number;
                        default: number;
                    };
                })[];
                responses: {
                    200: {
                        description: any;
                        headers: {
                            'X-Request-Id': {
                                $ref: string;
                            };
                        };
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: ({
                                        $ref: string;
                                        type?: never;
                                        properties?: never;
                                    } | {
                                        $ref?: never;
                                        type: string;
                                        properties: {
                                            data: any;
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                    400: {
                        description: any;
                        headers: {
                            'X-Request-Id': {
                                $ref: string;
                            };
                        };
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    500: {
                        description: any;
                        headers: {
                            'X-Request-Id': {
                                $ref: string;
                            };
                        };
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        '/api/v1/products/{id}': {
            get: {
                tags: string[];
                summary: string;
                operationId: string;
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        minimum: number;
                    };
                }[];
                responses: {
                    200: {
                        description: any;
                        headers: {
                            'X-Request-Id': {
                                $ref: string;
                            };
                        };
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: ({
                                        $ref: string;
                                        type?: never;
                                        properties?: never;
                                    } | {
                                        $ref?: never;
                                        type: string;
                                        properties: {
                                            data: any;
                                        };
                                    })[];
                                };
                            };
                        };
                    };
                    400: {
                        description: any;
                        headers: {
                            'X-Request-Id': {
                                $ref: string;
                            };
                        };
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    404: {
                        description: any;
                        headers: {
                            'X-Request-Id': {
                                $ref: string;
                            };
                        };
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    500: {
                        description: any;
                        headers: {
                            'X-Request-Id': {
                                $ref: string;
                            };
                        };
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        '/users': {
            get: {
                tags: string[];
                summary: string;
                operationId: string;
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    items: {
                                        $ref: string;
                                    };
                                };
                            };
                        };
                    };
                };
            };
            post: {
                tags: string[];
                summary: string;
                operationId: string;
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    email: {
                                        type: string;
                                        format: string;
                                    };
                                    name: {
                                        type: string[];
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    201: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    400: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    required: string[];
                                    properties: {
                                        error: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    409: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    required: string[];
                                    properties: {
                                        error: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        '/users/{id}': {
            parameters: {
                name: string;
                in: string;
                required: boolean;
                schema: {
                    type: string;
                    minimum: number;
                };
            }[];
            get: {
                tags: string[];
                summary: string;
                operationId: string;
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    404: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    required: string[];
                                    properties: {
                                        error: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            put: {
                tags: string[];
                summary: string;
                operationId: string;
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                minProperties: number;
                                properties: {
                                    email: {
                                        type: string;
                                        format: string;
                                    };
                                    name: {
                                        type: string[];
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    400: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    required: string[];
                                    properties: {
                                        error: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    404: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    required: string[];
                                    properties: {
                                        error: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    409: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    required: string[];
                                    properties: {
                                        error: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            delete: {
                tags: string[];
                summary: string;
                operationId: string;
                responses: {
                    204: {
                        description: string;
                    };
                    404: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    required: string[];
                                    properties: {
                                        error: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        '/posts': {
            get: {
                tags: string[];
                summary: string;
                operationId: string;
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    items: {
                                        $ref: string;
                                    };
                                };
                            };
                        };
                    };
                };
            };
            post: {
                tags: string[];
                summary: string;
                operationId: string;
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    title: {
                                        type: string;
                                    };
                                    content: {
                                        type: string[];
                                    };
                                    authorId: {
                                        type: string;
                                        minimum: number;
                                    };
                                    published: {
                                        type: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    201: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    400: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    required: string[];
                                    properties: {
                                        error: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    409: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    required: string[];
                                    properties: {
                                        error: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        '/posts/{id}': {
            parameters: {
                name: string;
                in: string;
                required: boolean;
                schema: {
                    type: string;
                    minimum: number;
                };
            }[];
            get: {
                tags: string[];
                summary: string;
                operationId: string;
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    404: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    required: string[];
                                    properties: {
                                        error: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            put: {
                tags: string[];
                summary: string;
                operationId: string;
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                minProperties: number;
                                properties: {
                                    title: {
                                        type: string;
                                    };
                                    content: {
                                        type: string[];
                                    };
                                    authorId: {
                                        type: string;
                                        minimum: number;
                                    };
                                    published: {
                                        type: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    400: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    required: string[];
                                    properties: {
                                        error: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    404: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    required: string[];
                                    properties: {
                                        error: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    409: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    required: string[];
                                    properties: {
                                        error: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            delete: {
                tags: string[];
                summary: string;
                operationId: string;
                responses: {
                    204: {
                        description: string;
                    };
                    404: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    required: string[];
                                    properties: {
                                        error: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
    };
    components: {
        schemas: {
            SuccessResponse: {
                type: string;
                required: string[];
                properties: {
                    data: {};
                    meta: {
                        type: string;
                        required: string[];
                        properties: {
                            requestId: {
                                type: string;
                                format: string;
                            };
                            pagination: {
                                type: string;
                                required: string[];
                                properties: {
                                    page: {
                                        type: string;
                                        minimum: number;
                                    };
                                    pageSize: {
                                        type: string;
                                        minimum: number;
                                        maximum: number;
                                    };
                                    total: {
                                        type: string;
                                        minimum: number;
                                    };
                                    totalPages: {
                                        type: string;
                                        minimum: number;
                                    };
                                };
                            };
                        };
                    };
                };
            };
            ErrorResponse: {
                type: string;
                required: string[];
                properties: {
                    error: {
                        type: string;
                        required: string[];
                        properties: {
                            code: {
                                type: string;
                                example: string;
                            };
                            message: {
                                type: string;
                            };
                            requestId: {
                                type: string;
                                format: string;
                            };
                            details: {
                                type: string;
                                items: {
                                    type: string;
                                    required: string[];
                                    properties: {
                                        field: {
                                            type: string;
                                        };
                                        message: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            Product: {
                type: string;
                required: string[];
                properties: {
                    id: {
                        type: string;
                        example: number;
                    };
                    name: {
                        type: string;
                        example: string;
                    };
                    brand: {
                        type: string;
                        example: string;
                    };
                    category: {
                        type: string;
                        example: string;
                    };
                    description: {
                        type: string;
                    };
                    originalPrice: {
                        type: string;
                        format: string;
                        example: number;
                    };
                    promoPrice: {
                        type: string;
                        format: string;
                        example: number;
                    };
                    discount: {
                        type: string;
                        minimum: number;
                        maximum: number;
                        example: number;
                    };
                    stock: {
                        type: string;
                        minimum: number;
                        example: number;
                    };
                    expiresAt: {
                        type: string;
                        format: string;
                        example: string;
                    };
                    batch: {
                        type: string;
                    };
                    images: {
                        type: string;
                        items: {
                            type: string;
                            format: string;
                        };
                    };
                    store: {
                        type: string;
                        additionalProperties: boolean;
                    };
                };
            };
            Category: {
                type: string;
                required: string[];
                properties: {
                    id: {
                        type: string;
                        example: number;
                    };
                    name: {
                        type: string;
                        example: string;
                    };
                };
            };
            User: {
                type: string;
                required: string[];
                properties: {
                    id: {
                        type: string;
                        example: number;
                    };
                    email: {
                        type: string;
                        format: string;
                    };
                    name: {
                        type: string[];
                    };
                    posts: {
                        type: string;
                        items: {
                            $ref: string;
                        };
                    };
                };
            };
            Post: {
                type: string;
                required: string[];
                properties: {
                    id: {
                        type: string;
                        example: number;
                    };
                    title: {
                        type: string;
                    };
                    content: {
                        type: string[];
                    };
                    published: {
                        type: string;
                    };
                    authorId: {
                        type: string;
                    };
                    author: {
                        $ref: string;
                    };
                };
            };
        };
        headers: {
            RequestId: {
                description: string;
                schema: {
                    type: string;
                    format: string;
                };
            };
        };
    };
};
export default openApiSpec;
//# sourceMappingURL=openapi.d.ts.map