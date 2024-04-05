'use client';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column, ColumnEditorOptions } from 'primereact/column';
import { DataTable, DataTableRowEditCompleteEvent } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { Image } from 'primereact/image';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Nullable } from 'primereact/ts-helpers';
import { classNames } from 'primereact/utils';
import React, { useState, useEffect, useRef } from 'react';
import '../Law/page.css'
export default function View_Page_1() {
    sessionStorage.setItem('Type', 'trade_mark')
    const [refreshKey, setRefreshKey] = useState<number>(0);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [emptyProduct, setEmptyProduct] = useState<any>({
        id: null,
        name: '',
        image: null,
        name_create: '',
        num_req: '',
        date_req: '',
        num_patent: '',
        status_now: '',
        status_next: '',
        regis_date: '',
        patent_expire: '',
        regis_num: '',
        request_num: '',
        type_num: '',
        description: '',
        lastrenew_date: '',
        nextrenew_date: '',
        expire_date: '',
        remark: '',
    });
    interface Product {
        id?: any;
        workId?: any;
        name?: any;
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
        operator?: any;
        workid?: any;
        status?: any;
        work_start?: any;
        description?: any;
        remark?: any;
        type?: any;
        datereq?: any;
    }

    const [addfilename, setfileName] = useState<string>('');
    const [addFile, setFiles]: any = useState(null);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [productDialog, setProductDialog]: any = useState(false);
    const [dialogFile, setdialogFile] = useState<boolean>(false);

    const [products, setProducts] = useState<Product[]>([]);
    const [product, setProduct]: any = useState();
    const [totalSize, setTotalSize] = useState<number>(0);
    const [isEdit, setisEdit]: any = useState(null);
    const [visibles, setVisible] = useState<boolean>(false);
    const [fileedit, setfileedit] = useState<any>(null); // Define the correct type for fileedit state
    const [namefileedit, setnamefileedit] = useState<any>(null); // Define the correct type for namefileedit state
    const [fileOther, setfileOther] = useState<any>([]);
    const [id_type, setidtype]: any = useState(null);

    const fileUploadRef = useRef<any>(null);
    const toast = useRef<any>(null);
    const Type_page: any | null = sessionStorage.getItem('Type');

    useEffect(() => {
        const formDataget = new FormData();
        formDataget.append('type', 'TM');
        setheaderTM('TM')
        const requestOptions = {
            method: 'post',
            headers: { accept: 'application/json' },
            body: formDataget,
        };
        fetch(process.env.NEXT_PUBLIC_ENV_API + `GetDataReportLaw`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setProducts(data)
                setProduct(data)
            });
    }, []);

    const hideDialog: () => void = () => {
        setSubmitted(false);
        setisEdit(null);
        setProductDialog(false);
    };

    const fileInput = useRef<HTMLInputElement>(null);

    //! (!= tradeMARK) //
    const openFile = (event: any) => {
        setidtype(event);
        const formfileOther = new FormData();
        formfileOther.append("type_id", event);
        formfileOther.append("Type", Type_page); // Assuming Type_page is defined elsewhere
        const requestOptions = {
            method: "POST",
            headers: { accept: "application/json" },
            body: formfileOther,
        };
        fetch(
            "http://localhost:8000/api/getfileOther",
            requestOptions
        )
            .then((response) => response.json())
            .then((data) => {
                setfileOther(data);
            });
        setdialogFile(true);
    };

    const pdfContentType: string = "application/pdf";

    const base64toBlob = (data: string): Blob => {
        // Cut the prefix `data:application/pdf;base64` from the raw base 64
        const base64WithoutPrefix = data.substr("data:application/pdf;base64,".length);
        const bytes = atob(base64WithoutPrefix);
        let length = bytes.length;
        let out = new Uint8Array(length);

        while (length--) {
            out[length] = bytes.charCodeAt(length);
        }

        return new Blob([out], { type: "application/pdf" });
    };

    const saveProduct = (product: Product) => {
        setSubmitted(true);

        const id = isEdit
        const formDataFile = new FormData();
        const requestOptionsFile = {
            method: "POST",
            headers: { accept: "application/json" },
            body: formDataFile,
        };
        formDataFile.append('id', id);
        formDataFile.append("file", addFile);

        fetch(process.env.NEXT_PUBLIC_ENV_API + "editFile_attach", requestOptionsFile)
            .then((response) => response.json())
            .then((data) => {
                setProductDialog(false);
                setisEdit(null);
                trademark_test(data.type)
            });
        // toast.current.show({
        //     severity: "success",
        //     summary: "Successful",
        //     detail: "Product Updated",
        //     life: 3000,
        // });

        // setRefreshKey((oldKey) => oldKey + 1);
    };

    const productDialogFooter_edit = (
        <React.Fragment>
            <Button
                size="small"
                label="Cancel"
                icon="pi pi-times"
                outlined
                onClick={hideDialog}
            />
            <Button
                size="small"
                label="Edit"
                severity="warning"
                icon="pi pi-check"
                outlined
                onClick={saveProduct}
            />
        </React.Fragment>
    );

    const onTemplateSelect = (e: any) => {
        let _totalSize = totalSize;
        let files = e.files;

        Object.keys(files).forEach((key) => {
            _totalSize += files[key].size || 0;
        });

        setTotalSize(_totalSize);
    };

    const onTemplateUpload = (e: any) => {
        let _totalSize = 0;

        e.files.forEach((file: any) => {
            _totalSize += file.size || 0;
        });

        setTotalSize(_totalSize);
        toast.current.show({
            severity: "info",
            summary: "Success",
            detail: "File Uploaded",
        });
    };
    const fileInputRef = useRef<HTMLInputElement>(null);

    const change_image = async (event: any) => {
        const file = event.target.files[0];
        const base64 = await convertBase64(file);
        setfileedit(base64);
        setFiles(file);
        setnamefileedit(event.target.files[0].name);
        console.log(file);
    };

    const convertBase64 = (file: any) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const onTemplateRemove = (file: any, callback: any) => {
        setTotalSize(totalSize - file.size);
        callback();
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };

    const headerTemplate = (options: any) => {
        const { className, chooseButton, uploadButton } = options;
        const value = totalSize / 100000;
        const formatedValue =
            fileUploadRef && fileUploadRef.current
                ? fileUploadRef.current.formatSize(totalSize)
                : "0 B";

        return (
            <div
                className={className}
                style={{
                    backgroundColor: "transparent",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                {chooseButton}
                <div className="flex align-items-center gap-3 ml-auto">
                    <span className="text-xs">{formatedValue} / 10 MB</span>
                    <ProgressBar
                        value={value}
                        showValue={false}
                        style={{ width: "10rem", height: "12px" }}
                    ></ProgressBar>
                </div>
            </div>
        );
    };

    const fileImport = () => {
        const formDataFile = new FormData();
        const requestOptionsFile = {
            method: "POST",
            headers: { accept: "application/json" },
            body: formDataFile,
        };
        formDataFile.append("file", addFile);
        formDataFile.append("Type", Type_page);
        formDataFile.append('product_type', selectedProductType.code);
        fetch("http://localhost:8000/api/importData", requestOptionsFile)
            .then((response) => response.json())
            .then((data) => {
                console.log(data.message);
                setRefreshKey((oldKey) => oldKey + 1);
                if (data.message === "successful") {
                    setVisible(false);
                }
            });
    };

    const [selectedProductType, setselectedProductType]: any = useState();
    const cities = [
        { name: 'ทะเบียนเครื่องหมายการค้า', code: 'TM' },
        { name: 'บัญชีรายการจดอนุสิทธิบัตร', code: 'PT3' },
        { name: 'บัญชีรายการจดสิทธิบัตรการประดิษฐ์', code: 'PT' },
        { name: 'บัญชีรายการสิทธิบัตรการออกแบบผลิตภัณฑ์', code: 'PT2' },
    ];

    const headerTemplates = (options: any) => {
        const { className, chooseButton, uploadButton } = options;
        const value = totalSize / 100000;
        const formatedValue =
            fileUploadRef && fileUploadRef.current
                ? fileUploadRef.current.formatSize(totalSize)
                : "0 B";

        return (
            <div
                className={className}
                style={{
                    backgroundColor: "transparent",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                {chooseButton}
                <Button
                    className="custom-upload-btn p-button-sm p-button-success p-button-rounded p-button-outlined text-xs"
                    onClick={fileImport}
                >
                    <span
                        className="p-button-icon p-clickable p-button-icon-left pi pi-fw pi-cloud-upload"
                        data-pc-section="chooseicon"
                    ></span>
                    <b>Upload</b>
                </Button>
                <Dropdown value={selectedProductType} onChange={(e: any) => setselectedProductType(e.value)} options={cities} optionLabel="name"
                    placeholder="Product Type" className="w-full md:w-14rem" />

                <div className="flex align-items-center gap-3 ml-auto">
                    <span className="text-xs">{formatedValue} / 10 MB</span>
                    <ProgressBar
                        value={value}
                        showValue={false}
                        style={{ width: "10rem", height: "12px" }}
                    ></ProgressBar>
                </div>
            </div>
        );
    };

    const itemTemplate = (file: any, props: any) => {
        setfileName(file.name);
        setFiles(file);
        return (
            <div className="flex align-items-center flex-wrap">
                <div
                    className="flex align-items-center text-xs"
                    style={{ width: "40%", height: "50%" }}
                >
                    <img
                        alt={file.name}
                        role="presentation"
                        src={file.objectURL}
                        width={200}
                    />
                    <span className="flex flex-column text-left ml-3 ">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <span className="flex flex-column text-left ml-8 ">
                    <Tag
                        value={props.formatSize}
                        severity="warning"
                        className="px-2 py-0 text-xs"
                    />
                </span>
                <Button
                    type="button"
                    icon="pi pi-times"
                    className="p-button-outlined p-button-rounded p-button-danger ml-auto p-button-sm text-xs"
                    onClick={() => onTemplateRemove(file, props.onRemove)}
                >
                    Cancel
                </Button>
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i
                    className="pi pi-image mt-0 p-0"
                    style={{
                        fontSize: "5em",
                        borderRadius: "50%",
                        backgroundColor: "var(--surface-b)",
                        color: "var(--surface-d)",
                    }}
                ></i>
                <span
                    style={{ fontSize: "1em", color: "var(--text-color-secondary)" }}
                    className="text-xs"
                >
                    Drag and Drop File Excel Here
                </span>
            </div>
        );
    };

    const chooseOptions = {
        icon: "pi pi-fw pi-images",
        iconOnly: false,
        className:
            "custom-choose-btn p-button-sm p-button-rounded p-button-outlined text-xs",
    };
    const uploadOptions = {
        icon: "pi pi-fw pi-cloud-upload",
        iconOnly: false,
        className:
            "custom-upload-btn p-button-sm p-button-success p-button-rounded p-button-outlined text-xs",
    };

    const cancelOptions = {
        icon: "pi pi-fw pi-times",
        iconOnly: true,
        className:
            "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined hidden",
    };
    const onUpload = () => {
        toast.current.show({
            severity: "info",
            summary: "Success",
            detail: "File Uploaded",
        });
    };

    const footer = `In total there are ${products ? products.length : 0
        } products.`;



    const imageBodyTemplate: (products: any) => JSX.Element = (products: any) => {
        return (
            <center>
                <img
                    className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
                    src={`data:image/png;base64,${products.img_base64}`}
                    alt={`${products.img}`}

                />
            </center>
        );
    };
    const [checkbuttonSave, setCheckButtonSave] = useState(false);
    const Button_Edit = (product: Product) => {
        const id = product.id;
        if (id === showButtonSave) {
            setCheckButtonSave(true)
        }
        return (
            <>
                <center>
                    <div className='flex align-items-center justify-content-center'>
                        <div className='flex align-items-center justify-content-center'>
                            <Button
                                icon="pi pi-cloud-upload"
                                rounded text
                                severity="secondary"
                                aria-label="edit"
                                // style={{ height: "35px", width: "15px" }}
                                onClick={(e) => { setisEdit(id), setProductDialog(true), setProduct(product), setfileedit(`data:image/png;base64,${product.img_base64}`); }}
                                // size="small"
                                id={id}
                            />
                        </div>
                    </div>
                </center>
            </>
        );
    };

    const trademark_test = (type: any) => {
        const formDataget = new FormData();
        formDataget.append('type', type);
        const requestOptions = {
            method: 'post',
            headers: { accept: 'application/json' },
            body: formDataget,
        };
        fetch(process.env.NEXT_PUBLIC_ENV_API + `GetDataReportLaw`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setProduct(data)
                setProducts(data)
            });
    }
    const [dateReqArray, setdateReqArray]: any = useState();
    const [fetchDatereq, setfetchDatereq]: any = useState();
    const [idChange, setidChange]: any = useState();
    let _dateReqArray = { ...dateReqArray };

    const testgetValue = (id: any, value: any) => {
        _dateReqArray[`${id}`] = { id, value };
        console.log(_dateReqArray)
    }
    const post_datereq = () => {
        setfetchDatereq(_dateReqArray);
        const formCreateData: any = new FormData();
        formCreateData.append('data', JSON.stringify(_dateReqArray));
        const requestOptions = {
            method: "post",
            headers: { accept: "application/json" },
            body: formCreateData,
        };
        fetch(process.env.NEXT_PUBLIC_ENV_API + 'test_fetcharray', requestOptions) /*change now */
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            });
    }

    const [showButtonSave, setshowButtonSave]: any = useState();
    const [newdateReq, setnewdateReq]: any = useState<Nullable<Date>>(null);
    const datereqChange = (options: ColumnEditorOptions) => {
        return (
            <Calendar style={{ fontSize: '0.75rem' }} inputClassName='text-xs p-2' value={options.value} dateFormat="dd/mm/yy" onChange={(e: any) => { setnewdateReq(e.target.value.toLocaleDateString()), testgetValue(options.rowData.id, e.value.toLocaleDateString()) }} selectionMode="single" readOnlyInput />
        )
    }
    const [newrenewDate, setrenewDate]: any = useState<Nullable<Date>>(null);
    const renewDateChange = (options: ColumnEditorOptions) => {
        return (
            <Calendar inputClassName='text-xs p-2' value={options.value} dateFormat="dd/mm/yy" onChange={(e: any) => { setrenewDate(e.target.value.toLocaleDateString()), testgetValue(options.rowData.id, e.value.toLocaleDateString()) }} selectionMode="single" readOnlyInput />
        )
    }

    const [newissueDate, setissueDate]: any = useState<Nullable<Date>>(null);
    const issuedateChange = (options: ColumnEditorOptions) => {
        return (
            <Calendar inputClassName='text-xs p-2' value={options.value} dateFormat="dd/mm/yy" onChange={(e: any) => { setissueDate(e.target.value.toLocaleDateString()), testgetValue(options.rowData.id, e.value.toLocaleDateString()) }} selectionMode="single" readOnlyInput />
        )
    }

    const [newexpiresDate, setexpiresDate]: any = useState<Nullable<Date>>(null);
    const expiresdateChange = (options: ColumnEditorOptions) => {
        return (
            <Calendar inputClassName='text-xs p-2' value={options.value} dateFormat="dd/mm/yy" onChange={(e: any) => { setexpiresDate(e.target.value.toLocaleDateString()), testgetValue(options.rowData.id, e.value.toLocaleDateString()) }} selectionMode="single" readOnlyInput />
        )
    }

    const allowEdit = (product: Product) => {
    };

    const onRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
        let _products = [...products];
        let { newData, index } = e;

        _products[index] = e.data;
        console.log(_products[index].id)

        const formUpdateLaw = new FormData();
        const requestOptionsLaw = {
            method: "POST",
            headers: { accept: "application/json" },
            body: formUpdateLaw,
        };
        formUpdateLaw.append('id', _products[index].id);
        formUpdateLaw.append("datereq", newdateReq);
        formUpdateLaw.append("renewdate", newrenewDate);
        formUpdateLaw.append("issuedate", newissueDate);
        formUpdateLaw.append("expiredate", newexpiresDate);
        fetch(process.env.NEXT_PUBLIC_ENV_API + "updateDataLaw", requestOptionsLaw)
            .then((response) => response.json())
            .then((data) => {
                toast.current?.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Product Updated",
                    life: 3000,
                })
                setnewdateReq(null);
                setrenewDate(null);
                setissueDate(null);
                setexpiresDate(null);
                trademark_test(_products[index].type)
            })
    };

    const [headerTM, setheaderTM]: any = useState();
    //endreturn
    return (
        <>
            <Button className='mr-2 p-1 ' size='small' severity="warning" outlined onClick={(e) => { trademark_test('TM'), setheaderTM('TM') }}>ทะเบียนเครื่องหมายการค้า</Button>
            <Button className='mr-2 p-1 ' size='small' severity="warning" outlined onClick={(e) => { trademark_test('PT'), setheaderTM('PT') }}>สิทธิบัตรการประดิษฐ์</Button>
            <Button className='mr-2 p-1 ' size='small' severity="warning" outlined onClick={(e) => { trademark_test('PT2'), setheaderTM('PT2') }}>สิทธิบัตรการออกแบบ</Button>
            <Button className='mr-2 p-1 ' size='small' severity="warning" outlined onClick={(e) => { trademark_test('PT3'), setheaderTM('PT3') }}>อนุสิทธิบัตร</Button>
            {/* <Button className='mr-2' size='small' severity="warning" outlined onClick={(e) => { post_datereq() }}>testfetcharray</Button> */}

            <Dialog
                visible={productDialog}
                style={{ width: "60rem" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                header={`Edit Data`}
                modal
                className="p-fluid text-xs"
                footer={productDialogFooter_edit}
                onHide={hideDialog}
            >
                <div className="formgrid grid">
                    <div className="field col-12 md:col-6">
                        <label htmlFor="name" className="font-bold text-xs"> Name </label>
                        <InputText
                            style={{ height: "30px",fontSize:'0.75rem' }}
                            id="name"
                            value={product?.product_name}
                            readOnly={true}
                        />
                    </div>
                    <div className="field col-12 md:col-3">
                        <label htmlFor="Patent_Number" className="font-bold text-xs">
                            Patent Number
                        </label>
                        <InputText
                            style={{ height: "30px",fontSize:'0.75rem' }}
                            readOnly={true}
                            id="Patent_Number"
                            value={product?.patentnum}
                            required
                        />
                    </div>
                    <div className="field col-12 md:col-3">
                        <label htmlFor="num_req" className="font-bold text-xs">
                            Request Number
                        </label>
                        <InputText
                            value={product?.reqnum}
                            readOnly={true}
                            style={{ height: "30px",fontSize:'0.75rem' }}
                            id="num_req"
                            required
                        />
                    </div>
                </div>
                <div>
                    {isEdit === null ? (
                        <FileUpload
                            ref={fileUploadRef}
                            name="demo[]"
                            url="/api/upload"
                            multiple
                            accept="image/*"
                            maxFileSize={10000000}
                            onUpload={onTemplateUpload}
                            onSelect={onTemplateSelect}
                            onError={onTemplateClear}
                            onClear={onTemplateClear}
                            headerTemplate={headerTemplate}
                            itemTemplate={itemTemplate}
                            emptyTemplate={emptyTemplate}
                            chooseOptions={chooseOptions}
                            uploadOptions={uploadOptions}
                        />
                    ) : (
                        <>
                            <div className="header_edit">
                                <div>
                                    <label htmlFor="contained-button-file">
                                        <Button
                                            onClick={() => { fileInputRef.current?.click() }}
                                            // variant=""
                                            color="primary"
                                            // component="span"
                                            style={{ width: '8%' }}
                                            className="custom-choose-btn p-button-sm p-button-rounded p-button-outlined text-xs"
                                        >
                                            Upload
                                        </Button>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            style={{ display: "none" }}
                                            ref={fileInputRef}
                                            onChange={(e: any) => {
                                                change_image(e);
                                            }}
                                            id="contained-button-file"
                                        />
                                    </label>
                                </div>
                                <div className="flex align-items-center gap-3 ml-auto"></div>
                            </div>
                            <div className="drop">
                                <div className="grid">
                                    <div className="col ">
                                        <img
                                            src={`${fileedit}`}
                                            alt="Image"
                                            width="150"
                                        />
                                    </div>
                                    <div className="col flex align-items-center">
                                        <span className="flex flex-column text-left ml-4 flex align-items-center">
                                            {product?.img}

                                            <small>{new Date().toLocaleDateString()}</small>
                                        </span>
                                    </div>
                                    <div className="col flex align-items-center flex justify-content-end flex-wrap">
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </Dialog>
            {/* //! (!= tradeMARK) // */}
            <DataTable
                value={products}
                // footer={footer}
                size='small'
                className="font text-sm testwrap"
                style={{ minWidth: "60rem", overflowX: 'scroll', margin: '5px', padding: '0px' }}
                tableStyle={{ margin: '0px', padding: '0px', fontSize: '0.7rem' }}
                onRowEditComplete={onRowEditComplete}
                showGridlines

                editMode="row" dataKey="id"
            //  selectionMode="single" selection={selectedProduct!} onSelectionChange={(e) => setSelectedProduct(e.value)}
            >
                <Column field="number" header="ลำดับ" body={(_, { rowIndex }) => rowIndex + 1}></Column>
                <Column
                    field="product_name"
                    // bodyStyle={{ width: "20%" }}
                    header={headerTM === 'TM' ? 'ประเภทสินค้า' : 'ชื่อสิ่งประดิษฐ์'}
                    headerStyle={{ width: '12%', minWidth: '3rem' }}
                // body={name}
                ></Column>
                <Column
                    field="image"
                    header={headerTM === 'TM' ? 'รูปเครื่องหมาย' : 'ภาพสิ่งประดิษฐิ์'}
                    body={imageBodyTemplate}
                ></Column>
                <Column field="reqnum" header={headerTM === 'TM' ? 'คำขอเลขที่' : 'เลขที่คำขอ'} headerStyle={{ width: '1%', minWidth: '2rem' }} ></Column>
                <Column
                    field="datereq"
                    header={headerTM === 'TM' ? 'วันที่จดทะเบียน' : 'วันที่ยื่นคำขอ'}
                // body={date_req}
                ></Column>
                <Column
                    header={headerTM === 'TM' ? 'Edit วันที่จดทะเบียน' : 'Edit วันที่ยื่นคำขอ'}
                    // style={{fontSize:'0.75rem'}}
                    editor={(options: any) => datereqChange(options)}
                ></Column>
                <Column
                    field="category"
                    header={headerTM === 'TM' ? 'จำพวก' : ''}
                    hidden={headerTM === 'TM' ? false : true}
                ></Column>
                <Column
                    field="patentnum"
                    header={headerTM === 'TM' ? 'เลขทะเบียน' : 'เลขที่สิทธิบัตร'}
                ></Column>
                <Column
                    field="statusnow"
                    header="สถานะปัจจุบัน"
                    hidden={headerTM === 'TM' ? true : false}
                ></Column>
                <Column
                    field="statusnext"
                    header="สถานะต่อไป"
                    hidden={headerTM === 'TM' ? true : false}
                ></Column>
                <Column
                    field="renewdate"
                    header={headerTM === 'TM' ? 'วันที่ต่ออายุ' : ''}
                    hidden={headerTM === 'TM' ? false : true}
                ></Column>
                <Column
                    header="แก้ไขวันที่ต่ออายุ"
                    editor={(options: any) => renewDateChange(options)}
                    hidden={headerTM === 'TM' ? false : true}
                ></Column>
                <Column
                    field="issuedate"
                    header={headerTM === 'TM' ? 'กำหนดการต่ออายุ' : 'วันออกสิทธิบัตร'}
                ></Column>
                <Column
                    header={headerTM === 'TM' ? 'Edit กำหนดการต่ออายุ' : 'Edit วันออกสิทธิบัตร'}
                    editor={(options: any) => issuedateChange(options)}
                ></Column>
                <Column
                    field="expiresdate"
                    header={headerTM === 'TM' ? 'วันสิ้นอายุ 10ปี' : 'สิทธิบัตรสิ้นอายุ'}
                ></Column>
                <Column
                    header={headerTM === 'TM' ? 'Edit วันสิ้นอายุ 10ปี' : 'Edit สิทธิบัตรสิ้นอายุ'}
                    editor={(options: any) => expiresdateChange(options)}
                ></Column>
                <Column rowEditor header="แก้ไขข้อมูล" headerStyle={{ width: '6%', minWidth: '3rem', backgroundColor: 'gray' }} bodyStyle={{ textAlign: 'center' }} ></Column>
                <Column headerStyle={{ width: '5%', minWidth: '3rem', backgroundColor: 'orange' }} header="แก้ไขรูป" body={Button_Edit}></Column>
            </DataTable >
            <Dialog
                header="Header"
                visible={visibles}
                style={{ width: "50vw" }}
                onHide={() => setVisible(false)}
            >
                <FileUpload
                    ref={fileUploadRef}
                    name="fileimport"
                    url="http://vdpapi.vandapac.com/api/public/api/importData"
                    accept="*"
                    maxFileSize={100000000}
                    onUpload={onTemplateUpload}
                    onSelect={onTemplateSelect}
                    onError={onTemplateClear}
                    onClear={onTemplateClear}
                    headerTemplate={headerTemplates}
                    itemTemplate={itemTemplate}
                    emptyTemplate={emptyTemplate}
                    chooseOptions={chooseOptions}
                    uploadOptions={uploadOptions}
                    cancelOptions={cancelOptions}
                />
                <InputText hidden value={Type_page} id="type_file" />
            </Dialog>
        </>
    );
}