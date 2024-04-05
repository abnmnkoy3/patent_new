'use client';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useRef, useState } from 'react';
import type { Demo, Page } from '../../../../types/types';
import { DataTable, DataTableExpandedRows, DataTableRowToggleEvent } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import '../Document/page.css'
import { OverlayPanel } from 'primereact/overlaypanel';
import { Dialog } from 'primereact/dialog';
import 'primeicons/primeicons.css';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';
import { EmptyProduct, Product } from './interface_product';
import { MenuManage } from './Component';
import { TabPanel, TabView } from 'primereact/tabview';
import { FileUpload } from 'primereact/fileupload';
import { Tag } from 'primereact/tag';
const Product: Page = () => {

    const [products, setProducts] = useState<Product[]>([]);
    const [productEdit, setProductEdit] = useState<Product[]>([]);
    const [product, setProduct]: any = useState();
    const [productFile, setProductFile]: any = useState();
    const [productDialog, setProductDialog]: any = useState();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [setTable, SetTable]: any = useState();
    const [visibleEdit, setvisibleEdit]: any = useState(false);

    useEffect(() => {
        fetch(process.env.NEXT_PUBLIC_ENV_API + 'GetDataDoc')
            .then((response) => response.json())
            .then((data) => {
                setProducts(data)

                SetTable('Document');
            });
        fetch(process.env.NEXT_PUBLIC_ENV_API + 'GetDataEdit')
            .then((response) => response.json())
            .then((data) => {
                setProductEdit(data)
            });
    }, []);


    const imageBodyTemplate = (product: Product) => {
        return (
            <>
                <img src={`data:application/pdf;base64,${product.img_base64}`} alt={product.img} className="w-8rem shadow-2 border" />
                <OverlayPanel style={{ width: '20%', height: '32%', background: '#C4DDFF' }} >
                    <img src={`data:application/pdf;base64,${product.img_base64}`} style={{ width: '100%', height: '100%' }} alt="Bamboo Watch"></img>
                </OverlayPanel>
            </>
        );
    };
    const headerTemplate = (product: Product) => {
        return (
            <React.Fragment>
                <span className="vertical-align-middle ml-2 font-bold line-height-3" > {product?.workid} </span>
            </React.Fragment>
        );
    };

    const [status_doc, setstatus_doc] = useState('');
    const getFile_req = (e: any) => {
        const formDataFile = new FormData();
        formDataFile.append("Id", e);
        formDataFile.append("doc_Id", status_doc);
        const requestOptionsFile = {
            method: "POST",
            headers: { accept: "application/json" },
            body: formDataFile,
        };
        fetch(process.env.NEXT_PUBLIC_ENV_API + 'getFile_req_document', requestOptionsFile)
            .then((response) => response.json())
            .then((data) => setProductFile(data));
    }
    const [visibleAtth, setVisibleAtth] = useState(false);
    const [Productfileshow, setProductfileshow] = useState<Product[]>([]);

    const getDataFile = () => {
        const formId: any = new FormData();
        formId.append("id", selectedProduct);
        const requestOptionsFile = {
            method: "POST",
            headers: { accept: "application/json" },
            body: formId,
        };
        fetch(process.env.NEXT_PUBLIC_ENV_API + 'GetDataDocDialog', requestOptionsFile)
            .then((response) => response.json())
            .then((data) => {
                setProductDialog(data)
                setVisibleAtth(true)
            });

        fetch(process.env.NEXT_PUBLIC_ENV_API + 'getDataFileShow', requestOptionsFile)
            .then((response) => response.json())
            .then((data) => {
                setProductfileshow(data)
            });
    }
    const [IdData, setIdData]: any = useState();

    /* ADDFILE API */
    const InsertReqNum = (id: any) => {
        const ReqNum = new FormData();
        ReqNum.append("Data", JSON.stringify(product));
        ReqNum.append("Id", id);
        const requestOptionsFile = {
            method: "POST",
            headers: { accept: "application/json" },
            body: ReqNum,
        };
        fetch(process.env.NEXT_PUBLIC_ENV_API + "InsertReqNum", requestOptionsFile)
            .then((response) => response.json())
            .then((data) => {
                fetch(process.env.NEXT_PUBLIC_ENV_API + 'GetDataDoc')
                    .then((response) => response.json())
                    .then((data) => setProducts(data));
            });
    }

    /////////////////////////////////////////////////////
    interface TypeFile {
        id: any;
    }
    const [currentFilePOA, setCurrentFilePOA] = useState<File[]>([]);
    const [currentNameFile, setCurrentNameFile]: any = useState([]);
    const [fileNamePOA, setfileNamePOA] = useState('');
    const newArr: string[] = [];


    const selectFilePOA = (event: any) => {
        const { files } = event.target;
        setCurrentNameFile(event.target.id)
        console.log(event.target)
        const selectedFiles = files as FileList;
        if (files && files.length) {
            setCurrentFilePOA(existing => existing.concat(Array.from(files)));
        }
    };

    useEffect(() => {
        console.log(currentNameFile)
        const file = currentFilePOA;
        console.log(file)
        if (file.length >= 1 && selectedProduct) {
            const formDataFile: any = new FormData();
            const requestOptionsFile = {
                method: "POST",
                headers: { accept: "application/json" },
                body: formDataFile,
            };
            file.forEach(files => {
                formDataFile.append(`files[]`, files);
                formDataFile.append(`file_name[]`, files.name);
            });
            formDataFile.append("id_ip_file", selectedProduct);
            formDataFile.append("ms_doc_id", '1');
            formDataFile.append("status_doc", 'req_doc');
            formDataFile.append("file_step", currentNameFile);
            fetch(process.env.NEXT_PUBLIC_ENV_API + "uploadFile_Attach", requestOptionsFile)
                .then((response) => response.json())
                .then((data) => {
                    setCurrentFilePOA([])
                    getFile_req(IdData)
                    fetch(process.env.NEXT_PUBLIC_ENV_API + 'GetDataDoc')
                        .then((response) => response.json())
                        .then((data) => setProducts(data));
                });
        }
    }, [currentFilePOA])

    const upload_power_of_attorney = () => {
        const file: any = currentFilePOA;

        const formDataFile = new FormData();
        const requestOptionsFile = {
            method: "POST",
            headers: { accept: "application/json" },
            body: formDataFile,
        };
        formDataFile.append("file", file);
        formDataFile.append("id_ip_file", IdData);
        formDataFile.append("ms_doc_id", '1');
        formDataFile.append("file_name", file.name);
        formDataFile.append("status_doc", 'consider_file_approve');
        formDataFile.append("file_step", 'req_power_of_attorney');
        fetch(process.env.NEXT_PUBLIC_ENV_API + "uploadFile_Attach", requestOptionsFile)
            .then((response) => response.json())
            .then((data) => {
                getFile_req(IdData)
                fetch(process.env.NEXT_PUBLIC_ENV_API + 'GetDataDoc')
                    .then((response) => response.json())
                    .then((data) => setProducts(data));
            });
    };


    ////////////////////////////////////////////////////
    const [currentFileTF, setCurrentFileTF] = useState<File>();
    const [fileNameTF, setfileNameTF] = useState('');
    const upload_transfer = () => {
        const file: any = currentFileTF;
        const formDataFile = new FormData();
        const requestOptionsFile = {
            method: "POST",
            headers: { accept: "application/json" },
            body: formDataFile,
        };
        formDataFile.append("file", file);
        formDataFile.append("id_ip_file", IdData);
        formDataFile.append("ms_doc_id", '2');
        formDataFile.append("file_name", file.name);
        formDataFile.append("status_doc", 'consider_file_approve');
        formDataFile.append("file_step", 'req_transfer');
        fetch(process.env.NEXT_PUBLIC_ENV_API + "uploadFile_Attach", requestOptionsFile)
            .then((response) => response.json())
            .then((data) => {
                getFile_req(IdData)
                fetch(process.env.NEXT_PUBLIC_ENV_API + 'GetDataDoc')
                    .then((response) => response.json())
                    .then((data) => setProducts(data));
            });
    };

    const selectFileTF = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        const selectedFiles = files as FileList;
        setCurrentFileTF(selectedFiles?.[0]);
        setfileNameTF(selectedFiles?.[0].name);
    };
    ////////////////////////////////////////////////////
    const [currentFileIV, setCurrentFileIV] = useState<File>();
    const [fileNameIV, setfileNameIV] = useState('');
    const upload_invention = () => {
        const file: any = currentFileIV;
        const formDataFile = new FormData();
        const requestOptionsFile = {
            method: "POST",
            headers: { accept: "application/json" },
            body: formDataFile,
        };
        formDataFile.append("file", file);
        formDataFile.append("id_ip_file", IdData);
        formDataFile.append("ms_doc_id", '3');
        formDataFile.append("file_name", file.name);
        formDataFile.append("status_doc", 'consider_file_approve');
        formDataFile.append("file_step", 'req_invention');
        fetch(process.env.NEXT_PUBLIC_ENV_API + "uploadFile_Attach", requestOptionsFile)
            .then((response) => response.json())
            .then((data) => {
                getFile_req(IdData)
                fetch(process.env.NEXT_PUBLIC_ENV_API + 'GetDataDoc')
                    .then((response) => response.json())
                    .then((data) => setProducts(data));
            });
    };

    const selectFileIV = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        const selectedFilesIV = files as FileList;
        setCurrentFileIV(selectedFilesIV?.[0]);
        setfileNameIV(selectedFilesIV?.[0].name);
    };
    ////////////////////////////////////////////////////
    const [currentFileCAD, setCurrentFileCAD] = useState<File>();
    const [fileNameCAD, setfileNameCAD] = useState('');
    const upload_cad = () => {
        const file: any = currentFileCAD;
        const formDataFile = new FormData();
        const requestOptionsFile = {
            method: "POST",
            headers: { accept: "application/json" },
            body: formDataFile,
        };
        formDataFile.append("file", file);
        formDataFile.append("id_ip_file", IdData);
        formDataFile.append("ms_doc_id", '4');
        formDataFile.append("file_name", file.name);
        formDataFile.append("status_doc", 'consider_file_approve');
        formDataFile.append("file_step", 'req_cad');
        fetch(process.env.NEXT_PUBLIC_ENV_API + "uploadFile_Attach", requestOptionsFile)
            .then((response) => response.json())
            .then((data) => {
                getFile_req(IdData)
                fetch(process.env.NEXT_PUBLIC_ENV_API + 'GetDataDoc')
                    .then((response) => response.json())
                    .then((data) => setProducts(data));
            });
    };

    const selectFileCAD = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        const selectedFilesCAD = files as FileList;
        setCurrentFileCAD(selectedFilesCAD?.[0]);
        setfileNameCAD(selectedFilesCAD?.[0].name);
    };
    ////////////////////////////////////////////////////
    const [currentFileSearch, setCurrentFileSearch] = useState<File>();
    const [fileNameSearch, setfileNameSearch] = useState('');
    const upload_search = () => {
        const file: any = currentFileSearch;
        const formDataFile = new FormData();
        const requestOptionsFile = {
            method: "POST",
            headers: { accept: "application/json" },
            body: formDataFile,
        };
        formDataFile.append("file", file);
        formDataFile.append("id_ip_file", IdData);
        formDataFile.append("ms_doc_id", '5');
        formDataFile.append("file_name", file.name);
        formDataFile.append("status_doc", 'consider_file_approve');
        formDataFile.append("file_step", 'req_search');
        fetch(process.env.NEXT_PUBLIC_ENV_API + "uploadFile_Attach", requestOptionsFile)
            .then((response) => response.json())
            .then((data) => {
                getFile_req(IdData)
                fetch(process.env.NEXT_PUBLIC_ENV_API + 'GetDataDoc')
                    .then((response) => response.json())
                    .then((data) => setProducts(data));
            });
    };

    const selectFileSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        const selectedFilesSearch = files as FileList;
        setCurrentFileSearch(selectedFilesSearch?.[0]);
        setfileNameSearch(selectedFilesSearch?.[0].name);
    };
    ////////////////////////////////////////////////////
    const [currentFileDraft, setCurrentFileDraft] = useState<File>();
    const [fileNameDraft, setfileNameDraft] = useState('');
    const upload_Draft = () => {
        const file: any = currentFileDraft;
        const formDataFile = new FormData();
        const requestOptionsFile = {
            method: "POST",
            headers: { accept: "application/json" },
            body: formDataFile,
        };
        formDataFile.append("file", file);
        formDataFile.append("id_ip_file", IdData);
        formDataFile.append("ms_doc_id", '6');
        formDataFile.append("file_name", file.name);
        formDataFile.append("status_doc", 'consider_file_approve');
        formDataFile.append("file_step", 'req_draft');
        fetch(process.env.NEXT_PUBLIC_ENV_API + "uploadFile_Attach", requestOptionsFile)
            .then((response) => response.json())
            .then((data) => {
                getFile_req(IdData)
                fetch(process.env.NEXT_PUBLIC_ENV_API + 'GetDataDoc')
                    .then((response) => response.json())
                    .then((data) => setProducts(data));
            });
    };

    const selectFileDraft = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        const selectedFilesDraft = files as FileList;
        setCurrentFileDraft(selectedFilesDraft?.[0]);
        setfileNameDraft(selectedFilesDraft?.[0].name);
    };
    ////////////////////////////////////////////////////
    const [currentFileForm, setCurrentFileForm] = useState<File>();
    const [fileNameForm, setfileNameForm] = useState('');
    const upload_Form = () => {
        const file: any = currentFileForm;
        const formDataFile = new FormData();
        const requestOptionsFile = {
            method: "POST",
            headers: { accept: "application/json" },
            body: formDataFile,
        };
        formDataFile.append("file", file);
        formDataFile.append("id_ip_file", IdData);
        formDataFile.append("ms_doc_id", '7');
        formDataFile.append("file_name", file.name);
        formDataFile.append("status_doc", 'consider_file_approve');
        formDataFile.append("file_step", 'req_formimg');
        fetch(process.env.NEXT_PUBLIC_ENV_API + "uploadFile_Attach", requestOptionsFile)
            .then((response) => response.json())
            .then((data) => {
                getFile_req(IdData)
                fetch(process.env.NEXT_PUBLIC_ENV_API + 'GetDataDoc')
                    .then((response) => response.json())
                    .then((data) => setProducts(data));
            });
    };

    const selectFileForm = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        const selectedFilesForm = files as FileList;
        setCurrentFileForm(selectedFilesForm?.[0]);
        setfileNameForm(selectedFilesForm?.[0].name);
    };
    ////////////////////////////////////////////////////
    const [currentFileDP, setCurrentFileDP] = useState<File>();
    const [fileNameDP, setfileNameDP] = useState('');
    const upload_design_patent = () => {
        const file: any = currentFileDP;
        const formDataFile = new FormData();
        const requestOptionsFile = {
            method: "POST",
            headers: { accept: "application/json" },
            body: formDataFile,
        };
        formDataFile.append("file", file);
        formDataFile.append("id_ip_file", IdData);
        formDataFile.append("ms_doc_id", '8');
        formDataFile.append("file_name", file.name);
        formDataFile.append("status_doc", 'consider_file_approve');
        formDataFile.append("file_step", 'req_design_patent');
        fetch(process.env.NEXT_PUBLIC_ENV_API + "uploadFile_Attach", requestOptionsFile)
            .then((response) => response.json())
            .then((data) => {
                getFile_req(IdData)
                fetch(process.env.NEXT_PUBLIC_ENV_API + 'GetDataDoc')
                    .then((response) => response.json())
                    .then((data) => setProducts(data));
            });
    };

    const selectFilesDP = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        const selectedFilesDP = files as FileList;
        setCurrentFileDP(selectedFilesDP?.[0]);
        setfileNameDP(selectedFilesDP?.[0].name);
    };
    ////////////////////////////////////////////////////
    const [currentFileImgProduct, setCurrentFileImgProduct] = useState<File>();
    const [fileNameImgProduct, setfileNameImgProduct] = useState('');
    const upload_img_product = () => {
        const file: any = currentFileImgProduct;
        const formDataFile = new FormData();
        const requestOptionsFile = {
            method: "POST",
            headers: { accept: "application/json" },
            body: formDataFile,
        };
        formDataFile.append("file", file);
        formDataFile.append("id_ip_file", IdData);
        formDataFile.append("ms_doc_id", '9');
        formDataFile.append("file_name", file.name);
        formDataFile.append("status_doc", 'consider_file_approve');
        formDataFile.append("file_step", 'req_img_product');
        fetch(process.env.NEXT_PUBLIC_ENV_API + "uploadFile_Attach", requestOptionsFile)
            .then((response) => response.json())
            .then((data) => {
                getFile_req(IdData)
                fetch(process.env.NEXT_PUBLIC_ENV_API + 'GetDataDoc')
                    .then((response) => response.json())
                    .then((data) => setProducts(data));
            });
    };

    const selectFileImgProduct = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        const selectedFilesImgProduct = files as FileList;
        setCurrentFileImgProduct(selectedFilesImgProduct?.[0]);
        setfileNameImgProduct(selectedFilesImgProduct?.[0].name);
    };
    ////////////////////////////////////////////////////
    const [currentFileOther, setCurrentFileOther] = useState<File>();
    const [fileNameOther, setfileNameOther] = useState('');
    const upload_other = () => {
        const file: any = currentFileOther;
        const formDataFile = new FormData();
        const requestOptionsFile = {
            method: "POST",
            headers: { accept: "application/json" },
            body: formDataFile,
        };
        formDataFile.append("file", file);
        formDataFile.append("id_ip_file", IdData);
        formDataFile.append("ms_doc_id", '10');
        formDataFile.append("file_name", file.name);
        formDataFile.append("status_doc", 'consider_file_approve');
        formDataFile.append("file_step", 'req_other');
        fetch(process.env.NEXT_PUBLIC_ENV_API + "uploadFile_Attach", requestOptionsFile)
            .then((response) => response.json())
            .then((data) => {
                getFile_req(IdData)
                fetch(process.env.NEXT_PUBLIC_ENV_API + 'GetDataDoc')
                    .then((response) => response.json())
                    .then((data) => setProducts(data));
            });
    };

    const selectFileOther = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        const selectedFilesOther = files as FileList;
        setCurrentFileOther(selectedFilesOther?.[0]);
        setfileNameOther(selectedFilesOther?.[0].name);
    };
    ////////////////////////////////////////////////////
    const [currentFileCommand, setCurrentFileCommand] = useState<File>();
    const [fileNameCommand, setfileNameCommand] = useState('');
    const upload_command = () => {
        const file: any = currentFileCommand;
        const formDataFile = new FormData();
        const requestOptionsFile = {
            method: "POST",
            headers: { accept: "application/json" },
            body: formDataFile,
        };
        formDataFile.append("file", file);
        formDataFile.append("id_ip_file", IdData);
        formDataFile.append("ms_doc_id", '11');
        formDataFile.append("file_name", file.name);
        formDataFile.append("status_doc", 'consider_file_approve');
        formDataFile.append("file_step", 'req_command');
        fetch(process.env.NEXT_PUBLIC_ENV_API + "uploadFile_Attach", requestOptionsFile)
            .then((response) => response.json())
            .then((data) => {
                getFile_req(IdData)
                fetch(process.env.NEXT_PUBLIC_ENV_API + 'GetDataDoc')
                    .then((response) => response.json())
                    .then((data) => setProducts(data));
            });
    };

    const selectFileCommand = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        const selectedFilesCommand = files as FileList;
        setCurrentFileCommand(selectedFilesCommand?.[0]);
        setfileNameCommand(selectedFilesCommand?.[0].name);
    };
    ////////////////////////////////////////////////////
    const [DocumentlinkFile, setDocumentlinkFile]: any = useState();

    const DocumentLink = (product: Product) => {
        return (
            product?.docname.map(function (d_product: any, index: any) {
                {
                    return (
                        <li>
                            <a className={`${product?.docfile[index]?.ms_doc_id === d_product.ms_doc_id ? 'line-through' : ''}`}>
                                {`${d_product.document_name}`}
                            </a>
                        </li>

                    )
                }
            })
        ) //line-through
    }
    const statusDoc = (product: Product) => {
        return (
            product?.docname.map(function (d_product: any, index: any) {
                {
                    return (
                        <a className={`flex flex-column text-center`}>
                            {product?.docfile[index]?.file_step === undefined ?
                                `Wait`
                                :
                                `${product?.docfile[index]?.file_step}`
                            }
                        </a>
                    )
                }
            })
        ) //line-through
    }
    /* Code Step Law */
    const GetDataLaw = () => {
        fetch(process.env.NEXT_PUBLIC_ENV_API + 'GetDataLaw')
            .then((response) => response.json())
            .then((data) => {
                setProducts(data)
                SetTable('Law');
            });
    }
    const [visibleLaw, setVisibleLaw] = useState<boolean>(false);
    const getFileLaw = (e: any, status: any) => {
        const formDataFile = new FormData();
        formDataFile.append("workId", e);
        formDataFile.append("ms_doc_id", '');
        formDataFile.append("status", status);
        const requestOptionsFile = {
            method: "POST",
            headers: { accept: "application/json" },
            body: formDataFile,
        };
        fetch(process.env.NEXT_PUBLIC_ENV_API + 'getFileWorkId', requestOptionsFile)
            .then((response) => response.json())
            .then((data) => setProductFile(data));
    }
    const buttonLawFile = (product: Product) => {
        setIdData(product.id)
        return (
            <div className="flex justify-content-center">
                <Button icon="pi pi-search" rounded outlined onClick={(e) => { setVisibleLaw(true), setProduct(product), getFileLaw(product.workid, product.status) }} severity="success" aria-label="Search" />
            </div>
        )
    }

    const approveEditLaw = (fk_table_more: any) => {
        const formDataFK = new FormData();
        formDataFK.append("fk_table_more", fk_table_more);
        const requestOptionsFile = {
            method: "POST",
            headers: { accept: "application/json" },
            body: formDataFK,
        };
        fetch(process.env.NEXT_PUBLIC_ENV_API + 'approveEditLaw', requestOptionsFile)
            .then((response) => response.json())
            .then((data) => {
                fetch(process.env.NEXT_PUBLIC_ENV_API + 'GetDataLaw')
                    .then((response) => response.json())
                    .then((data) => {
                        setProducts(data)
                        SetTable('Law');
                    });
            });

    }

    const [visiblereqNum, setvisiblereqNum] = useState<boolean>(false);
    const ManageLaw = (product: Product) => {
        setIdData(product.id_ip_file)
        return (
            product.typeQuery === 'addReqNum' ?
                <div className="flex flex-wrap justify-content-center gap-2" >
                    {
                        (product.status >= 8) ?
                            <Button label="เพิ่มข้อมูล" onClick={(e) => { setvisiblereqNum(true), setProduct(product) }} severity="secondary" outlined />
                            : <Button label="เพิ่มเลขที่คำขอ" onClick={(e) => { setvisiblereqNum(true), setProduct(product) }} severity="secondary" outlined />
                    }
                </div >
                :
                <div className="flex flex-wrap justify-content-center gap-2" >
                    <Button label="ยืนยัน" onClick={(e) => { approveEditLaw(product?.fk_table_more) }} severity="secondary" outlined />
                </div >
        )
    }
    const footerInsert_reqNum = () => {
        return (
            <div className="flex flex-wrap justify-content-center gap-2">
                <Button size='small' label="บันทึก" onClick={(e) => { InsertReqNum(product.id), setvisiblereqNum(false) }} severity="success" outlined />
            </div>
        )
    }


    const onChangeData = (index: any, value: any) => {
        let _product = { ...product };
        _product[`${index}`] = value;
        setProduct(_product)
        console.log(_product)
    }



    const buttonDataEdit = (product: Product) => {
        return (
            <Button className='p-1' label="ข้อมูล" severity="warning" onClick={(e: any) => { setvisibleEdit(true), setProduct(product) }} outlined />
        )
    }

    const [ShowFile, setShowFile] = useState('hidden');
    const [NameFile, setNameFile]: any = useState();
    const [currentFilePR, setCurrentFilePR] = useState<File>();
    const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files: any = (e.target as HTMLInputElement).files;
        setCurrentFilePR(files[0])
        setNameFile(files[0].name)
        setShowFile('')
    }
    const updateFormEdit = (productedit: any) => {
        const file: any = currentFilePR;
        const formDataFilePR = new FormData();
        formDataFilePR.append("file", file);
        formDataFilePR.append("tm_id", productedit.tm_id);
        formDataFilePR.append("tm_title_type", productedit.tm_title_type);
        formDataFilePR.append("tm_num_pr", productedit.tm_num_pr);
        formDataFilePR.append('workid', productedit.workid)

        const requestOptionsFile = {
            method: "POST",
            headers: { accept: "application/json" },
            body: formDataFilePR,
        };

        fetch(process.env.NEXT_PUBLIC_ENV_API + "updateFormEdit", requestOptionsFile)
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
            });
    }
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | Product[]>([]);


    const updatefileToConsider = (id: any) => {
        const formDataId = new FormData();
        formDataId.append("id", id);

        const requestOptionsFile = {
            method: "POST",
            headers: { accept: "application/json" },
            body: formDataId,
        };
        fetch(process.env.NEXT_PUBLIC_ENV_API + "submitfile_to_consider", requestOptionsFile)
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
            });
    }

    return (
        <>
            <Dialog header="เพิ่มเลขที่คำขอ" headerClassName={'p-0 bt-1'} style={{ width: "60rem" }} footer={footerInsert_reqNum} breakpoints={{ "960px": "75vw", "641px": "90vw" }} modal className="p-fluid text-xs" contentStyle={{ borderRadius: '0' }} visible={visiblereqNum} onHide={() => setvisiblereqNum(false)}>
                <hr />
                <div className="formgrid grid">
                    <div className="field col-12 md:col-6">
                        <label htmlFor="name" className="font-bold text-xs">
                            Name
                        </label>
                        <InputText disabled={true} style={{ height: "30px" }} id="name" value={product?.product_name} required className={classNames({ "p-invalid": !product?.product_name, })} />

                    </div>
                    <div className="field col-12 md:col-3">
                        <label htmlFor="NameCreate" className="font-bold text-xs">
                            Create By
                        </label>
                        <InputText disabled={true} style={{ height: "30px" }} id="NameCreate" required value={product?.operator} className={classNames({ "p-invalid": !product?.operator, })} />
                    </div>
                    <div className="field col-12 md:col-3">
                        <label htmlFor="Patent_Number" className="font-bold text-xs">
                            WorkId
                        </label>
                        <InputText style={{ height: "30px" }} readOnly={true} disabled={true} id="Patent_Number" value={product?.workid} required className={classNames({ "p-invalid": !product?.workid, })} />
                    </div>
                </div>
                <div className="drop">
                    <div className="grid">
                        <div className="col ">
                            <img src={`data:application/pdf;base64,${product?.img_base64}`} alt="Image" width="150" />
                        </div>
                        <div className="col flex align-items-center">
                            <span className="flex flex-column text-left ml-4 flex align-items-center">{product?.file_name}<small>{new Date().toLocaleDateString()}</small></span>
                        </div>
                        <div className="col flex align-items-center flex justify-content-end flex-wrap">
                        </div>
                    </div>
                </div>
                <div className="formgrid grid">
                    <div className="field col-12 md:col-6">
                        <label htmlFor="patentnum" className="font-bold text-xs">Patent Number</label>
                        <InputText type='text' disabled={product?.status >= 7 ? true : false} style={{ height: "30px" }} id="patentnum" autoFocus onChange={(e: any) => { onChangeData('patentnum', e.target.value) }} required />
                    </div>
                </div>
                <div className="formgrid grid">
                    <div className="field col-12 md:col-6">
                        <label htmlFor="num_req" className="font-bold text-xs">เลขที่คำขอ</label>
                        <InputText type='text' style={{ height: "30px", borderColor: '#058705' }} id="num_req" value={product?.reqnum} autoFocus onChange={(e: any) => { onChangeData('reqnum', e.target.value) }} required />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="date_req" className="font-bold text-xs">วันที่ยื่นคำขอ</label>
                        <Calendar style={{ height: "30px" }} id="date_req" value={new Date(product?.datereq)} dateFormat="dd/mm/yy" required onChange={(e: any) => { onChangeData('datereq', e.target.value.toLocaleDateString()) }} readOnlyInput className={classNames({ "p-invalid": !product?.deadline, })} />
                    </div>
                </div>
                <div className="formgrid grid">
                    <div className="field col-12 md:col-6">
                        <label htmlFor="Status_Now" className="font-bold text-xs">สถานะปัจจุบัน</label>
                        <InputText value={product?.status} style={{ height: "30px" }} id="Status_Now" required disabled={true} className={classNames({ "p-invalid": !product?.status, })} />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="Status_Next" className="font-bold text-xs">สถานะต่อไป</label>
                        <InputText style={{ height: "30px" }} id="Status_Next" value={product?.status} required disabled={true} className={classNames({ "p-invalid": !product?.status, })} />
                    </div>
                </div>
                <div className="formgrid grid">
                    <div className="field col-12 md:col-6">
                        <label htmlFor="regis_date" className="font-bold text-xs">วันออกสิทธิบัตร</label>
                        <Calendar style={{ height: "30px" }} id="regis_date" value={new Date(product?.regis_date)} onChange={(e: any) => { onChangeData('regis_date', e.target.value.toLocaleDateString()) }} dateFormat="dd/mm/yy" required disabled={product?.status >= 7 ? false : true} readOnlyInput />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="patent_expire" className="font-bold text-xs">สิทธิบัตรสิ้นอายุ</label>
                        <Calendar style={{ height: "30px" }} id="patent_expire" value={new Date(product?.expries_date)} onChange={(e: any) => { onChangeData('expries_date', e.target.value.toLocaleDateString()) }} dateFormat="dd/mm/yy" required disabled={product?.status >= 7 ? false : true} readOnlyInput />
                    </div>
                </div>
            </Dialog>
            <Dialog header="File" headerClassName={'p-0 bt-1'} contentStyle={{ borderRadius: '0' }} visible={visibleLaw} style={{ width: '50vw' }} onHide={() => setVisibleLaw(false)}>
                <hr />
                <div className='col-12 border-1 grid nested-grid'>
                    <div className='col-12'>
                        <div className='' style={{ verticalAlign: 'middle' }}>
                            <label className='p-1 ' style={{ verticalAlign: 'middle' }}>{`WorkId: ` + product?.workid}</label>
                        </div>
                        <div className='' style={{ verticalAlign: 'middle' }}>
                            <label className='p-1 ' style={{ verticalAlign: 'middle' }}>{`ชื่อภลิตภัณฑ์: ` + product?.product_name}</label>
                        </div>
                    </div>
                    <div className='col-12'>
                        <ul className="list-none p-0 m-0">
                            {productFile?.map(function (d: any, key: any) {
                                return (
                                    <>
                                        <div className='grid nested-grid '>
                                            <li className="flex align-items-center py-3 px-1 border-top-1 border-300 flex-wrap col-12  ">
                                                <div className='col-11 md:justify-content-between border-1 h-3rem m-0' key={key}>
                                                    <a href={`${d.file_address}`} target='_blank' className='p-1 line-under ' style={{ verticalAlign: 'middle' }}>{`${d.file_name}`}</a>
                                                </div>
                                            </li >
                                        </div>
                                    </>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </Dialog >

            <div className="grid p-fluid input-demo pt-5 fadein animation-duration-1000">
                <div className="col-12 md:col-6 col-offset-3">
                    <InputText style={{ borderRadius: 3, backgroundColor: '#ffffff', color: '#747272', borderColor: 'rgba(0, 0, 0, 0.65)', fontSize: '13px', borderWidth: '2px' }} placeholder="Search" type="text" className="w-full" />
                </div>
            </div>
            {
                <div className="pl-5 pr-5 flex flex-wrap justify-content-left gap-2 fadein animation-duration-1000">
                    <Button label="Patent Agent & law Firm" size='small' onClick={(e) => { GetDataLaw() }} severity="info" />
                    <MenuManage />
                </div>
            }
            <div className='flex flex-wrap'>
                <div className="pl-5 pr-5 justify-content-center pt-3 fadein animation-duration-1000 col-11">
                    <TabView className='bg-black-alpha-90'>
                        <TabPanel header="Header I">
                            {setTable === 'Document' ?
                                <DataTable value={products}
                                    rowGroupMode="subheader" groupRowsBy="workid" sortMode="single" sortField="workid"
                                    rowGroupHeaderTemplate={headerTemplate} tableStyle={{ minWidth: '50rem' }} sortOrder={1} scrollable scrollHeight="500px" rows={11} paginator
                                    expandableRowGroups expandedRows={expandedRows} onRowToggle={(e: DataTableRowToggleEvent) => setExpandedRows(e.data)}
                                    selectionMode="single" selection={selectedProduct!} onSelectionChange={(e) => setSelectedProduct(e.value.id_ip_file)} className=' datatable-1 border-1 border-round' showGridlines size={'small'}>
                                    <Column field='id' header='No' alignHeader={'center'} />
                                    <Column field='workid' header='Workid' alignHeader={'center'} />
                                    {/* <Column field='date_create' header='วันที่เพิ่มโครงการ' alignHeader={'center'} /> */}
                                    <Column field='product_name' header='ชื่อการประดิษฐ์' alignHeader={'center'} />
                                    <Column header='รูปภาพ' body={imageBodyTemplate} align={'center'} alignHeader={'center'} />
                                    <Column field='product_type' header='ประเภทผลิตภัณฑ์' alignHeader={'center'} />
                                    <Column field='' header='PatentNumber' alignHeader={'center'} />
                                    <Column body={DocumentLink} header='เอกสารแนบ' alignHeader={'center'} />
                                    <Column body={statusDoc} header='Docstatus' alignHeader={'center'} />
                                    <Column header='เอกสาร Ongoing' alignHeader={'center'} />
                                    <Column header='ผู้จัดทำ' alignHeader={'center'} />
                                    <Column header='วันที่Submit' alignHeader={'center'} />
                                    <Column header='PR No' alignHeader={'center'} />
                                    <Column header='Status' alignHeader={'center'} />
                                    <Column header='Expen Bo' alignHeader={'center'} />
                                    <Column header='Payment No' alignHeader={'center'} />
                                    <Column header='เอกสาร' alignHeader={'center'} />
                                    <Column header='สถานะ' alignHeader={'center'} />
                                    {/* <Column field='sf_name' header='สถานะ' align={'center'} alignHeader={'center'} /> */}
                                </DataTable>
                                : <DataTable value={products} selectionMode="single" selection={selectedProduct!} onSelectionChange={(e) => setSelectedProduct(e.value)} className=' datatable-1 border-1 border-round' showGridlines size={'small'} tableStyle={{ tableLayout: 'auto' }}>
                                    <Column field='id' header='No' alignHeader={'center'} />
                                    <Column field='workid' header='Workid' alignHeader={'center'} />
                                    <Column field='date_create' header='วันที่เพิ่มโครงการ' alignHeader={'center'} />
                                    <Column field='product_name' header='ชื่อการประดิษฐ์' alignHeader={'center'} />
                                    <Column header='รูปภาพ' body={imageBodyTemplate} align={'center'} alignHeader={'center'} />
                                    <Column field='product_type' header='ประเภทผลิตภัณฑ์' alignHeader={'center'} />
                                    <Column field='description' header='รายละเอียด' alignHeader={'center'} />
                                    <Column body={buttonLawFile} header='เอกสารแนบ' alignHeader={'center'} />
                                    <Column field='deadline' header='deadline' alignHeader={'center'} />
                                    <Column body={ManageLaw} header='จัดการ' align={'center'} alignHeader={'center'} />
                                    <Column field='sf_name' header='สถานะ' align={'center'} alignHeader={'center'} />
                                </DataTable>
                            }
                        </TabPanel>
                        <TabPanel header="Header II">
                            <DataTable value={productEdit} selectionMode="single" selection={selectedProduct!} onSelectionChange={(e) => setSelectedProduct(e.value)} className=' datatable-1 border-1 border-round' showGridlines size={'small'} tableStyle={{ tableLayout: 'auto', fontSize: '0.75rem' }}>
                                <Column field='id' header='No' alignHeader={'center'} />
                                <Column field='workid' header='Workid' alignHeader={'center'} />
                                <Column field='reqnum' header='เลขที่คำขอ' alignHeader={'center'} />
                                <Column field='product_name' header='ชื่อการประดิษฐ์' alignHeader={'center'} />
                                <Column header='รูปภาพ' body={imageBodyTemplate} align={'center'} alignHeader={'center'} />
                                <Column field='product_type' header='ประเภทผลิตภัณฑ์' alignHeader={'center'} />
                                <Column field='date_create' header='วันที่แจ้งเรื่อง' alignHeader={'center'} />
                                <Column body={buttonDataEdit} header='จัดการ' align={'center'} alignHeader={'center'} />
                                <Column field='edit_name' header='สถานะ' align={'center'} alignHeader={'center'} />
                            </DataTable>
                            <Dialog header="ข้อมูล" visible={visibleEdit} headerClassName='p-1' contentClassName='border-round-bottom' style={{ width: '60vw' }} onHide={() => { setvisibleEdit(false), setShowFile('hidden') }}>
                                <div className="formgrid grid">
                                    <div className='col-12 border-1 border-500 border-round mt-2 p-2'>
                                        <div className='formgrid grid m-2'>
                                            <div className='flex col-6 formgrid grid'>
                                                <p className='vertical-align-middle font-bold col-5'>เลขที่คำขอ : </p>
                                                <p className='vertical-align-middle  col-5 text-blue-700' >{`${product?.tm_reqnum}`}</p>
                                            </div>
                                            <div className='flex col-6 formgrid grid'>
                                                <p className='vertical-align-middle  font-bold col-5'>ประเภทหัวข้อ : </p>
                                                <p className='vertical-align-middle  col-5 text-blue-700' >{`${product?.edit_name}`}</p>
                                            </div>
                                        </div>
                                        <div className='formgrid grid m-2'>
                                            <div className="flex col-6 formgrid grid">
                                                <p className="vertical-align-middle pr-2 font-bold col-5">วันรับเอกสาร : </p>
                                                <p className='vertical-align-middle  col-5 text-blue-700' >{product?.tm_eceiptdate}</p>

                                            </div>
                                            <div className='flex col-6 formgrid grid'>
                                                <p className='vertical-align-middle pr-2 font-bold col-5'>จาก : </p>
                                                <p className='vertical-align-middle  col-5 text-blue-700' >{product?.tm_from}</p>
                                            </div>
                                        </div>
                                        <div className='formgrid grid m-2'>
                                            <div className='flex col-6 formgrid grid'>
                                                <p className='vertical-align-middle pr-2 font-bold col-5'>หมวดหมู่ : </p>
                                                <p className='vertical-align-middle  col-5 text-blue-700' >{product?.tm_category}</p>
                                            </div>
                                            <div className='flex col-6 formgrid grid'>
                                                <p className='vertical-align-middle pr-2 font-bold col-5'>ประเภทเลขที่คำขอ : </p>
                                                <p className='vertical-align-middle  col-5 text-blue-700' >{product?.country}</p>
                                            </div>
                                        </div>
                                        <div className='formgrid grid m-2'>
                                            <div className='flex col-6 formgrid grid'>
                                                <p className='vertical-align-middle pr-2 font-bold col-5'>เลขที่เอกสาร : </p>
                                                <p className='vertical-align-middle  col-5 text-blue-700' >{product?.tm_patentnum}</p>
                                            </div>
                                            <div className='flex col-6 formgrid grid'>
                                                <p className='vertical-align-middle pr-2 font-bold col-5'>วันที่ระบุในเอกสาร : </p>
                                                <p className='vertical-align-middle  col-5 text-blue-700' >{product?.tm_datedoc}</p>
                                            </div>
                                        </div>
                                        <div className='formgrid grid m-2'>
                                            <div className="flex col-6 formgrid grid">
                                                <p className="vertical-align-middle pr-2 font-bold col-5">ระยะเวลาดำเนินการ : </p>
                                                <p className='vertical-align-middle  col-5 text-blue-700' >{product?.tm_dateday}</p>
                                            </div>
                                            <div className="flex col-6 formgrid grid">
                                                <p className="vertical-align-middle pr-2 font-bold col-5">ระยะเวลาที่กำหนด : </p>
                                                <p className='vertical-align-middle  col-3 text-blue-700' >{product?.tm_startdate}</p>
                                                <p className="vertical-align-middle pr-2 font-bold col-1">To</p>
                                                <p className='vertical-align-middle  col-3 text-blue-700' >{product?.tm_enddate}</p>
                                            </div>
                                        </div>
                                        <div className={`formgrid grid m-2 border-round ${product?.edit_id !== 2 ? 'hidden' : ''}`}>
                                            <div className="flex col-6 formgrid grid" >
                                                <p className="vertical-align-middle pr-2 font-bold col-5" >เลขที่ PR : </p>
                                                <InputText style={{ height: "30px" }} className="p-inputtext p-1 col-7" onChange={(e: any) => { onChangeData('tm_num_pr', e.target.value) }} />
                                            </div>
                                            <div className="flex col-6 formgrid grid pb-2">
                                                <p className="vertical-align-middle pr-2 font-bold col-5">ไฟล์ PR : </p>
                                                <div className='border-double border-500 border-round col-7 flex flex-row flex-wrap ' style={{ height: '120%' }}>
                                                    <input className='pt-2' type="file" style={{ fontStyle: '0.75rem' }} title={''} id={`uploadPR`} name={`uploadPR`} onChange={(e) => { onChangeFile(e) }} />
                                                    {/* <label htmlFor={`uploadPR`}>Click me to upload image</label> */}
                                                    <div className={`col-12 flex align-items-center justify-content `}>
                                                        <i className={`pi pi-file-pdf pt-1 ${ShowFile}`} style={{ fontSize: '2.0rem' }}></i>
                                                        <a href='' className={`underline vertical-align-middle pt-1 pl-3 ${ShowFile}`} >{`${NameFile}`}</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`formgrid grid m-2 border-round ${product?.edit_id !== 3 ? 'hidden' : ''}`}>
                                            {/* <div className="flex col-6 formgrid grid" >
                                            <p className="vertical-align-middle pr-2 font-bold col-5" >เลขที่ PR : </p>
                                            <InputText style={{ height: "30px" }} className="p-inputtext p-1 col-7" onChange={(e: any) => { onChangeData('tm_num_pr', e.target.value) }} />
                                        </div> */}
                                            <div className="flex col-6 formgrid grid pb-2">
                                                <p className="vertical-align-middle pr-2 font-bold col-5">ไฟล์แบบฟอร์มชี้แจง : </p>
                                                <div className='border-double border-500 border-round col-7 flex flex-row flex-wrap ' style={{ height: '120%' }}>
                                                    <input className='pt-2' type="file" style={{ fontStyle: '0.75rem' }} title={''} id={`uploadPR`} name={`uploadPR`} onChange={(e) => { onChangeFile(e) }} />
                                                    {/* <label htmlFor={`uploadPR`}>Click me to upload image</label> */}
                                                    <div className={`col-12 flex align-items-center justify-content `}>
                                                        <i className={`pi pi-file-pdf pt-1 ${ShowFile}`} style={{ fontSize: '2.0rem' }}></i>
                                                        <a href='' className={`underline vertical-align-middle pt-1 pl-3 ${ShowFile}`} >{`${NameFile}`}</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='border-top-1 border-500 border-round col-12 p-2 mt-3 flex justify-content-end flex-wrap'>
                                        <Button className='p-2' onClick={(e: any) => { updateFormEdit(product) }} label="Submit" severity="success" outlined />
                                    </div>
                                </div>
                            </Dialog>
                        </TabPanel>
                    </TabView>
                </div>
                <div className='col-1'>
                    <Button size="small" label='แนบไฟล์' onClick={(e) => { getDataFile() }} severity="secondary" outlined className='border-noround' style={{ minWidth: '100%' }} />
                    <Button size="small" label='Printใบคำขอ' severity="secondary" outlined className='border-noround' style={{ minWidth: '100%' }} />
                    <Button size="small" label='Printใบมอบ' severity="secondary" outlined className='border-noround' style={{ minWidth: '100%' }} />
                    <Button size="small" label='Printใบโอน' severity="secondary" outlined className='border-noround' style={{ minWidth: '100%' }} />
                    <Button size="small" label='Submit' severity="secondary" outlined className='border-noround' style={{ minWidth: '100%' }} />
                    <Button size="small" label='PR/Payment' severity="secondary" outlined className='border-noround' style={{ minWidth: '100%' }} />
                    <Button size="small" label='Cancel' severity="secondary" outlined className='border-noround' style={{ minWidth: '100%' }} />
                    <Button size="small" label='แนบไฟล์' severity="secondary" outlined className='border-noround' style={{ minWidth: '100%' }} />
                    <Button size="small" label='แนบไฟล์' severity="secondary" outlined className='border-noround' style={{ minWidth: '100%' }} />
                </div>
            </div>
            {
                productDialog ?
                    <Dialog header="File" headerClassName={'p-0 bt-1'} contentStyle={{ borderRadius: '0' }} visible={visibleAtth} style={{ width: '80vw' }} onHide={() => setVisibleAtth(false)}>
                        <hr />
                        <div className='col-12 border-1'>
                            <div className="flex flex-column justify-content-center gap-2">
                                {
                                    <>
                                        {productDialog?.map(function (d_product: any) {
                                            {
                                                return (
                                                    <>
                                                        <div className='flex justify-content-between flex-wrap'>
                                                            <div className='flex align-items-center justify-content-start col-2'>
                                                                <p>{d_product.document_name}</p>
                                                            </div>
                                                            <div className='col-3'>
                                                                <td>
                                                                    <>
                                                                        {Productfileshow?.map(function (file_product: any) {
                                                                            return (
                                                                                <div className='flex flex-column '>
                                                                                    {d_product.ms_doc_id === file_product.ms_doc_id ?
                                                                                        <a className='flex align-items-center justify-content-center p'>
                                                                                            {file_product.file_name_random}
                                                                                        </a>
                                                                                        : ''}
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </>
                                                                </td>
                                                            </div>
                                                            <div className='justify-content-center col-2'>
                                                                <>
                                                                    {Productfileshow?.map(function (file_product: any) {
                                                                        return (
                                                                            <div className='flex flex-column '>
                                                                                {d_product.ms_doc_id === file_product.ms_doc_id ?
                                                                                    <a className='flex align-items-center justify-content-center p'>
                                                                                        {file_product.file_step === 'Approve' ?
                                                                                            <Tag severity="success" value="Approve" rounded></Tag>
                                                                                            :
                                                                                            <Tag severity="info" value="Wait" rounded></Tag>
                                                                                        }
                                                                                    </a>
                                                                                    : ''}
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </>
                                                            </div>
                                                            <div className='flex align-items-center justify-content-end col-3'>
                                                                <label htmlFor={`${d_product.status_document_file}`} className='p-2 border-1 border-round-md' style={{ cursor: 'pointer' }}>
                                                                    <input style={{ display: "none" }} id={`${d_product.status_document_file}`} name={`${d_product.status_document_file}`} type="file" multiple={true} onChange={selectFilePOA} />
                                                                    <i className="pi pi-file-import" style={{ fontSize: '1.0rem' }}></i>
                                                                    <a className='text-sm'>{productFile?.map(function (d: any) {
                                                                        return (
                                                                            d.file_step === `${d_product.status_docuemnt_file}` ? ` ${d.file_name}` : ''
                                                                        )
                                                                    })}</a>
                                                                </label>
                                                            </div>
                                                        </div >
                                                    </>
                                                )
                                            }
                                        })}
                                    </>
                                }
                                <hr className='p-0' />
                                <div className='flex align-items-end justify-content-end'>
                                    <Button label="Submit" id='' size='small' severity="help" onClick={(e) => updatefileToConsider(selectedProduct)} outlined />
                                </div>
                            </div>
                        </div>
                    </Dialog >
                    : ''
            }
        </>
    );
};



export default Product;
