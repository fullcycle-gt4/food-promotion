export declare function listarCategoriasDoCatalogo(): any;
export declare function listarProdutosDoCatalogo({ category, search, sort, onlyAvailable, page, pageSize }: {
    category: any;
    onlyAvailable: any;
    page: any;
    pageSize: any;
    search: any;
    sort: any;
}): {
    data: any;
    pagination: {
        page: any;
        pageSize: any;
        total: any;
        totalPages: number;
    };
};
export declare function buscarProdutoPorId(productId: any): any;
//# sourceMappingURL=catalog.service.d.ts.map