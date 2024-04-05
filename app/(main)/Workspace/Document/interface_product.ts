
export interface workIdRow {
    workid: any;
}
export interface Product {
    id?: any;
    workid?: any;
    date_create?: any;
    reqnum?: any;
    product_name?: any;
    img?: any;
    linkother?: any;
    deadline?: any;
    quantity?: any;
    inventoryStatus?: any;
    rating?: any;
    img_base64?: any;
    status_doc?: any;
    document_name?: any;
    file_step?: any;
    status_docuemnt_file?: any;
    ms_doc_id?: any;
    id_ip_file?: any;
    file_name?: any;
    sf_name?: any;
    status?: any;
    workIdRow: workIdRow
    regis_date?: any;
    expries_date?: any;
    tm_id?: any;
    tm_title_type?: any;
    tm_num_pr?: any;
    typeQuery?: any;
    fk_table_more?: any;
    docname?: any;
    docfile?: any;
}

export interface Manage {
    id?: string;
    img?: string;
    status?: string;
}

export let EmptyProduct = {
    id: null,
    workid: "",
    date_create: '',
    reqnum: '',
    product_name: '',
    img: '',
    linkother: '',
    deadline: '',
    quantity: '',
    inventoryStatus: '',
    rating: '',
    img_base64: '',
    status_doc: '',
    document_name: '',
    file_step: '',
    status_document_file: '',
    ms_doc_id: '',
    id_ip_file: '',
    file_name: '',
    sf_name: '',
    status: '',
}