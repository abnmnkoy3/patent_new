'use client';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useRef, useState } from 'react';
// import { CountryService } from '../../../../demo/service/CountryService';
// import { ProductService } from '/../service/ProductService';
import { ProductService } from '../../../../demo/service/ProductService';
import type { Demo, Page } from '../../../../types/types';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { ProgressBar } from 'primereact/progressbar';
import { MultiSelect } from 'primereact/multiselect';
import '../Ongoing/page.css'
import { useRouter } from 'next/navigation';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Dialog } from 'primereact/dialog';
import { Console } from 'console';
// import { Worker } from '@react-pdf-viewer/core';
// import { CharacterMap, Viewer } from '@react-pdf-viewer/core';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import WebViewer from '@pdftron/webviewer';
import { InputTextarea } from 'primereact/inputtextarea';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
// import { pdfjs } from "react-pdf";
// pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

const Product: Page = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [product, setProduct]: any = useState();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const router = useRouter();
    const op = useRef(null);
    const [productFile, setProductFile]: any = useState();
    const [urlblob, seturlblob] = useState('');
    const [visiblepreview, setvisiblepreview] = useState(false);
    const [visibleReject, setvisibleReject] = useState(false);
    const [visibleEdit, setvisibleEdit] = useState(false);
    const [fileedit, setFileedit]: any = useState(null);
    const [checkbox, setCheckbox] = useState<string[]>([]);

    interface WorkIdRow {
        workid: string;
    }
    interface Product {
        id?: string;
        reqnum?: string;
        workid?: any;
        fk_table_more?: any;
        product_name?: string;
        img?: string;
        linkother?: string;
        operator?: number;
        status?: any;
        status_name?: any;
        img_base64?: any;
        quantity?: number;
        id_ip_file?: number;
        id_id?: number,
        ms_doc_id?: any;
        typeQuery?: any;
        tm_reqnum?: any;
        tm_title?: any;
        tm_title_type?: any;
        tm_eceiptdate?: any;
        tm_from?: any;
        tm_category?: any;
        tm_country?: any;
        tm_patentnum?: any;
        tm_datedoc?: any;
        tm_dateday?: any;
        tm_startdate?: any;
        tm_enddate?: any;
        tm_num_pr?: any;
        tm_filename_pr?: any;
        tm_status?: any;
        tm_comment?: any;
        tm_id?: any;
        tm_userlastupdate?: any;
        tm_lastupdate?: any;
        edit_id?: any;
        edit_name?: any;
        edit_status?: any;
        workidrow: WorkIdRow;
        name_file_letter_random?: any;
        name_file_letter?: any;
    }

    useEffect(() => {
        fetch(process.env.NEXT_PUBLIC_ENV_API + 'GetDataConsider', { mode: 'cors' })
            .then((response) => response.json())
            .then((data) => {
                if (data) {
                    setProducts(data);
                    setProduct(data);
                }
            }
            );
    }, []);

    const headerTemplate = (product: Product) => {
        return (
            <React.Fragment>
                <span className="vertical-align-middle ml-2 font-bold line-height-3" > {product.workid} {`[ ${product.status_name} ]`} </span>
            </React.Fragment>
        );
    };

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
    const ApproveConsiderFile = (id_ip_file: any, edit_id: any, ms_doc_id: any, status: any) => {
        const formCreateData: any = new FormData();
        formCreateData.append('id_ip_file', id_ip_file);
        formCreateData.append('ms_doc_id', ms_doc_id);
        formCreateData.append('status', status);
        formCreateData.append('edit_id', edit_id);
        const requestOptions = {
            method: "post",
            headers: { accept: "application/json" },
            body: formCreateData,
        };
        fetch(process.env.NEXT_PUBLIC_ENV_API + 'ManageConsider', requestOptions) /*change now */
            .then((response) => response.json())
            .then((data) => {
                fetch(process.env.NEXT_PUBLIC_ENV_API + 'GetDataConsider')
                    .then((response) => response.json())
                    .then((data) => {
                        setProducts(data)
                    }
                    );
            });
    }
    const ApproveConsiderForm = (id: any, status: any, fk_table_more: any) => {
        const formCreateData: any = new FormData();
        formCreateData.append('id_ip_file', id);
        formCreateData.append('ms_doc_id', '');
        formCreateData.append('status', status);
        formCreateData.append('fk_table_more', fk_table_more)
        const requestOptions = {
            method: "post",
            headers: { accept: "application/json" },
            body: formCreateData,
        };
        fetch(process.env.NEXT_PUBLIC_ENV_API + 'ManageConsider', requestOptions) /*change now */
            .then((response) => response.json())
            .then((data) => {
                fetch(process.env.NEXT_PUBLIC_ENV_API + 'GetDataConsider')
                    .then((response) => response.json())
                    .then((data) => {
                        setProducts(data)
                    }

                    );
            });
    }
    const Manage = (product: Product) => {
        return (
            <>
                {product.typeQuery === 'File' ?
                    <div className="flex flex-wrap justify-content-center gap-2">
                        <Button onClick={(e) => { ApproveConsiderFile(product.id_ip_file, product.edit_id, product.ms_doc_id, 'Reject') }} label="Reject" size={'small'} severity="danger" />
                        <Button onClick={(e) => { ApproveConsiderFile(product.id_ip_file, product.edit_id, product.ms_doc_id, 'Approve') }} label="Approve" size={'small'} severity="secondary" />
                        {/* <Button label="Reject" size={'small'} severity="danger" /> */}
                    </div>
                    : product.typeQuery === 'Form' ?
                        <div className="flex flex-wrap justify-content-center gap-2">
                            <Button onClick={(e) => { ApproveConsiderForm(product.id, 'Reject', product.fk_table_more) }} label="Reject" size={'small'} severity="danger" />
                            <Button onClick={(e) => { ApproveConsiderForm(product.id, 'Approve', product.fk_table_more) }} label="Approves" size={'small'} severity="secondary" />
                            {/* <Button label="Reject" size={'small'} severity="danger" /> */}
                        </div>
                        : product.typeQuery === 'Edit' ?
                            <div className="flex flex-wrap justify-content-center gap-2">
                                <Button onClick={(e) => { tableMoreedit(product.tm_title_type, product.reqnum), setProduct(product) }} label="Manage" size={'small'} severity="secondary" />
                            </div> :
                            product.typeQuery === 'EditApprove' ?
                                <div className="flex flex-wrap justify-content-center gap-2">
                                    <Button onClick={(e) => { ApproveEdit(product.edit_id, product.fk_table_more), setProduct(product) }} label="ApproveEdit" size={'small'} severity="secondary" />
                                </div>
                                :
                                <div className="flex flex-wrap justify-content-center gap-2">
                                    <Button onClick={(e) => { ApproveConsiderFile(product.id_ip_file, product.edit_id, product.ms_doc_id, 'Reject') }} label="Reject" size={'small'} severity="danger" />
                                    <Button onClick={(e) => { ApproveConsiderFile(product.id_ip_file, product.edit_id, product.ms_doc_id, 'ApproveFileEdit') }} label="Approve" size={'small'} severity="secondary" />
                                </div>
                }
            </>
        )
    }

    const getFile_req = (e: any, ms_doc_id: any, status: any) => {
        const formDataFile = new FormData();
        formDataFile.append("workId", e);
        formDataFile.append("ms_doc_id", ms_doc_id);
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
    const buttonOtherFile = (product: Product) => {
        const formDataFile = new FormData();
        return (
            <div className="flex justify-content-center">
                <Button icon="pi pi-search" size='small' rounded outlined onClick={(e) => { setVisible(true), setProduct(product), getFile_req(product.workid, product.ms_doc_id, product.status), setworkIdApprove(product.workid, product.ms_doc_id, product.status) }} severity="success" aria-label="Search" />
            </div>
        )
    }
    const [visible, setVisible] = useState<boolean>(false);
    // Dialog Reject
    const footerReject = (product: Product) => {
        console.log(product)
        return (
            <div>
                <Button label="No" icon="pi pi-times" onClick={() => setvisibleReject(false)} size='small' className="p-button-text" />
                <Button label="Yes" icon="pi pi-check" onClick={(e) => { setvisibleReject(false) }} size='small' autoFocus />
            </div>
        )
    }

    const ConfirmReject = (Id: any) => {
        const formCreateData: any = new FormData();
        formCreateData.append('Id', Id);
        const requestOptions = {
            method: "post",
            headers: { accept: "application/json" },
            body: formCreateData,
        };
        fetch(process.env.NEXT_PUBLIC_ENV_API + 'ConfirmReject', requestOptions) /*change now */
            .then((response) => response.json())
            .then((data) => {
                fetch(process.env.NEXT_PUBLIC_ENV_API + 'GetDataConsider')
                    .then((response) => response.json())
                    .then((data) => setProducts(data));
            });
    }
    // Dialog Reject

    // Approve File
    const [workIdApprove, setworkIdApprove]: any = useState();
    const UpdateStatusFile = (Id: any, Status: any) => {
        const formApproveId: any = new FormData();
        formApproveId.append('Id', Id);
        formApproveId.append('Status', Status);
        const requestOptions = {
            method: "post",
            headers: { accept: "application/json" },
            body: formApproveId,
        };
        fetch(process.env.NEXT_PUBLIC_ENV_API + 'ApproveFile_Dialog', requestOptions) /*change now */
            .then((response) => response.json())
            .then((data) => {
                getFile_req(workIdApprove.workid, workIdApprove.ms_doc_id, workIdApprove.status);
                console.log('UpdateStatusFile Ok')
            });
    }
    const [showPay, setshowPay] = useState(true);
    const tableMoreedit = (code: any, reqNum: any) => {
        const formData = new FormData();
        formData.append("key", code);
        formData.append("reqnum", reqNum);
        const requestOptionsFile = {
            method: "POST",
            headers: { accept: "application/json" },
            body: formData,
        };
        fetch(process.env.NEXT_PUBLIC_ENV_API + 'getmasterDoc', requestOptionsFile)
            .then((response) => response.json())
            .then((data) => {
                if (data !== null) {
                    if (code === '1' && data !== 'not found') {
                        setFileedit(data)
                        setvisibleEdit(true)
                    } else if (code === '2' && data !== 'not found') {
                        setvisibleEdit(true)
                        setshowPay(false)
                    } else if (code === '3' && data !== 'not found') {
                        setvisibleEdit(true)
                        setshowPay(false)
                    }
                } else {

                }
            });
    }
    const ApproveEdit = (edit_id: any, fk_table_more: any) => {

        const formapproveEdit: any = new FormData();
        formapproveEdit.append('fk_table_more', fk_table_more);
        formapproveEdit.append('edit_id', edit_id);
        const requestOptions = {
            method: "post",
            headers: { accept: "application/json" },
            body: formapproveEdit,
        };
        fetch(process.env.NEXT_PUBLIC_ENV_API + 'approveEdit', requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
            });
    }
    const onIngredientsChange = (e: CheckboxChangeEvent) => {
        let _checkbox = [...checkbox];
        if (e.checked)
            _checkbox.push(e.value);
        else
            _checkbox.splice(_checkbox.indexOf(e.value), 1);
        setCheckbox(_checkbox);
        console.log(_checkbox)
    }
    const manageEdit = (fk_table_more: any, edit_id: any) => {
        if (edit_id == 1) {
            const formsetFileEdit: any = new FormData();
            formsetFileEdit.append('fk_table_more', fk_table_more);
            formsetFileEdit.append('edit_id', edit_id)
            formsetFileEdit.append('id_doc_file', JSON.stringify(checkbox));
            const requestOptions = {
                method: "post",
                headers: { accept: "application/json" },
                body: formsetFileEdit,
            };
            fetch(process.env.NEXT_PUBLIC_ENV_API + 'setFileFromEdit', requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)
                });
        } else if (edit_id == 2 || edit_id == 3) {
            const formapproveEdit: any = new FormData();
            formapproveEdit.append('fk_table_more', fk_table_more);
            formapproveEdit.append('edit_id', edit_id);
            const requestOptions = {
                method: "post",
                headers: { accept: "application/json" },
                body: formapproveEdit,
            };
            fetch(process.env.NEXT_PUBLIC_ENV_API + 'approveEdit', requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)
                });
        }
    }

    const status_check = (product: Product) => {
        if (product?.edit_status !== null) {
            return <p>{product?.edit_name}</p>
        } else {
            return <p>{product?.status_name}</p>
        }
    }

    const calculateCustomerTotal = (name: any) => {
        let total = 0;

        if (products) {
            for (let product of products) {
                if (product.workid === name) {
                    total++;
                }
            }
        }

        return total;
    };

    return (
        <>
            {/* Dialog Reject */}
            <Dialog header="Comment Reject" visible={visibleReject} style={{ width: '20vw' }} onHide={() => setvisibleReject(false)} footer={footerReject}>
                <InputTextarea placeholder={`Comment`} style={{ width: '100%' }} />
            </Dialog>
            {/* Dialog Reject */}
            <div className="grid p-fluid input-demo pt-5 fadein animation-duration-1000">
                <div className="col-12 md:col-6 col-offset-3">
                    <InputText style={{ borderRadius: 3, backgroundColor: '#ffffff', color: '#747272', borderColor: 'rgba(0, 0, 0, 0.65)', fontSize: '13px', borderWidth: '2px' }} placeholder="Search" type="text" className="w-full" />
                </div>
            </div>
            <Dialog header="File" headerClassName={'p-0 bt-1'} contentStyle={{ borderRadius: '0' }} visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                <hr />
                <div className='col-12 border-1 grid nested-grid'>
                    <div className='col-12'>
                        <div className='' style={{ verticalAlign: 'middle' }}>
                            <label className='p-1 ' style={{ verticalAlign: 'middle' }}>{`WorkId: ` + product?.workid}</label>
                        </div>
                        <div className='' style={{ verticalAlign: 'middle' }}>
                            <label className='p-1 ' style={{ verticalAlign: 'middle' }}>{`ชื่อผลิตภัณฑ์: ` + product?.product_name}</label>
                        </div>
                    </div>
                    <div className='col-12'>
                        <div className=''>
                            <div className='col-12'>
                                <div className="surface-0">
                                    <ul className="list-none p-0 m-0">
                                        {productFile?.map(function (d: any, key: any) {
                                            return (
                                                <>
                                                    {product?.ms_doc_id === d.ms_doc_id ?
                                                        <div className='grid nested-grid'>
                                                            <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap col-12  ">
                                                                <p className='p-0 m-0'>{`${d.document_name} :`}</p>
                                                                <div className='col-11 md:justify-content-between border-1 h-3rem m-1' key={key}>
                                                                    <a href={`${d.file_address}`} target='_blank' className='p-1 line-under ' style={{ verticalAlign: 'middle' }}>{`${d.file_name_random}`}</a>
                                                                </div>
                                                            </li >
                                                        </div>
                                                        : <div className='flex flex-column'>
                                                            <li className="flex align-items-center py-1 px-1 border-top-1 border-300 flex-wrap col-12  ">
                                                                <p className='p-0 m-0'>{`${d.document_name} :`}</p>
                                                                <div className='col-12 md:justify-content-between border-1 h-0rem m-1' key={key}>
                                                                    <a href={`${d.file_address}`} target='_blank' className='p-1 line-under ' style={{ verticalAlign: 'middle' }}>{`${d.file_name_random}`}</a>
                                                                </div>
                                                            </li >
                                                        </div>}
                                                </>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog >
            <Dialog header={`${product?.edit_name}`} headerClassName='p-2' visible={visibleEdit} style={{ width: '60vw' }} onHide={() => { setvisibleEdit(false) }}>
                <div className="formgrid grid">
                    <div className='col-12 border-1 border-500 border-round mt-2 p-2'>
                        <div className='formgrid grid m-2'>
                            <div className='flex col-6 formgrid grid'>
                                <p className='vertical-align-middle font-bold text-xs col-5'>เลขที่คำขอ : </p>
                                <p className='vertical-align-middle  text-xs col-5 text-blue-700' >{`${product?.tm_reqnum}`}</p>
                            </div>
                            <div className='flex col-6 formgrid grid'>
                                <p className='vertical-align-middle  font-bold text-xs col-5'>ประเภทหัวข้อ : </p>
                                <p className='vertical-align-middle  text-xs col-5 text-blue-700' >{`${product?.edit_name}`}</p>
                            </div>
                        </div>
                        <div className='formgrid grid m-2'>
                            <div className="flex col-6  formgrid grid">
                                <p className="vertical-align-middle pr-2 font-bold text-xs col-5">วันรับเอกสาร : </p>
                                <p className='vertical-align-middle  text-xs col-5 text-blue-700' >{product?.tm_eceiptdate}</p>

                            </div>
                            <div className='flex col-6 formgrid grid'>
                                <p className='vertical-align-middle pr-2 font-bold text-xs col-5'>จาก : </p>
                                <p className='vertical-align-middle  text-xs col-5 text-blue-700' >{product?.tm_from}</p>
                            </div>

                        </div>
                        <div className='formgrid grid m-2'>
                            <div className='flex col-6 formgrid grid'>
                                <p className='vertical-align-middle pr-2 font-bold text-xs col-5'>หมวดหมู่ : </p>
                                <p className='vertical-align-middle  text-xs col-5 text-blue-700' >{product?.tm_category}</p>
                            </div>
                            <div className='flex col-6 formgrid grid'>
                                <p className='vertical-align-middle pr-2 font-bold text-xs col-6'>ประเภทเลขที่คำขอ : </p>
                                <p className='vertical-align-middle  text-xs col-5 text-blue-700' >{product?.tm_country}</p>
                            </div>
                        </div>
                        <div className='formgrid grid m-2'>
                            <div className='flex col-6 formgrid grid'>
                                <p className='vertical-align-middle pr-2 font-bold text-xs col-5'>เลขที่เอกสาร : </p>
                                <p className='vertical-align-middle  text-xs col-5 text-blue-700' >{product?.tm_patentnum}</p>
                            </div>
                            <div className='flex col-6 formgrid grid'>
                                <p className='vertical-align-middle pr-2 font-bold text-xs col-5'>วันที่ระบุในเอกสาร : </p>
                                <p className='vertical-align-middle  text-xs col-5 text-blue-700' >{product?.tm_datedoc}</p>
                            </div>
                        </div>
                        <div className='formgrid grid m-2'>
                            <div className="flex col-6 formgrid grid">
                                <p className="vertical-align-middle pr-2 font-bold text-xs col-5">ระยะเวลาดำเนินการ : </p>
                                <p className='vertical-align-middle  text-xs col-5 text-blue-700' >{product?.tm_dateday}</p>
                            </div>
                            <div className="flex col-6 formgrid grid">
                                <p className="vertical-align-middle pr-2 font-bold text-xs col-5">ระยะเวลาที่กำหนด : </p>
                                <p className='vertical-align-middle  text-xs col-3 text-blue-700' >{product?.tm_startdate}</p>
                                <p className="vertical-align-middle pr-2 font-bold text-xs col-1">To</p>
                                <p className='vertical-align-middle  text-xs col-3 text-blue-700' >{product?.tm_enddate}</p>
                            </div>
                        </div>
                        {/* <div className={`formgrid grid m-2 ${product?.edit_id == 2 ? '' : 'hidden'}`}>
                            <div className="flex col-6 formgrid grid" >
                                <p className="vertical-align-middle pr-2 font-bold text-xs col-5" >เลขที่ PR : </p>
                                <p className='vertical-align-middle  text-xs col-5 text-blue-700' >{product?.tm_num_pr}</p>
                            </div>
                            <div className="flex col-6 formgrid grid" >
                                <p className="vertical-align-middle pr-2 font-bold text-xs col-5">ไฟล์ PR : </p>
                                <p className='vertical-align-middle  text-xs col-5 text-blue-700' >{product?.tm_filename_pr}</p>
                            </div>
                        </div> */}
                        <div className='formgrid grid m-2'>
                            <div className="flex col-6 formgrid grid">
                                <p className="vertical-align-middle pr-2 font-bold text-xs col-5">คำอธิบายเพิ่มเติม : </p>
                                {
                                    product?.tm_comment !== '' ?
                                        <p className='vertical-align-middle  text-xs col-5 text-blue-700' >{product?.tm_comment}</p>
                                        : <p className='vertical-align-middle  text-xs col-5 text-blue-700' >-</p>
                                }
                            </div>
                            <div className="flex col-6 formgrid grid">
                                <p className="vertical-align-middle pr-2 font-bold text-xs col-5">ไฟล์แนบ : </p>
                                <div className='border-double border-500 border-round col-7 flex flex-row flex-wrap' style={{ height: '120%' }}>
                                    <div className={`col-12 flex align-items-center justify-content`}>
                                        <i className={`pi pi-file-pdf pt-1 `} style={{ fontSize: '2.5rem' }}></i>
                                        <a href={`${process.env.NEXT_PUBLIC_ENV_LETTER}${new Date().getFullYear()}/${product?.reqnum}/${product?.name_file_letter_random}`} className={`underline vertical-align-middle pt-1 pl-3 `} >{`${product?.name_file_letter}`}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="formgrid grid">

                    {fileedit !== null ?
                        <div className='col-12 border-1 border-500 border-round pt-2 mt-3'>
                            <p className='underline'><b>เอกสาร</b></p>
                            <div className='formgrid grid m-2'>
                                <div className="flex flex-column col-6">
                                    <p className="vertical-align-middle pr-2 font-bold text-sm col-5">On Going </p><hr className='mt-0' />
                                    {

                                        fileedit?.map(({ document_name, id, role }: any) => {
                                            return (
                                                role === 'ongoing' ?
                                                    <div className='p'><Checkbox value={id} onChange={onIngredientsChange} checked={checkbox.includes(id)}></Checkbox> <label className='text-xs'>{document_name}</label> <hr /></div>
                                                    : ''
                                            )
                                        })
                                    }
                                </div>
                                <div className="flex flex-column col-6">
                                    <p className="vertical-align-middle pr-2 font-bold text-sm col-5">Document </p><hr className='mt-0' />
                                    {

                                        fileedit?.map(({ document_name, id, role }: any) => {
                                            return (
                                                role === 'document' ?
                                                    <div className='p'><Checkbox value={id} onChange={onIngredientsChange} checked={checkbox.includes(id)}></Checkbox> <label className='text-xs'>{document_name}</label> <hr /></div>
                                                    : ''
                                            )
                                        })
                                    }
                                </div>
                            </div>

                        </div>
                        : ''
                    }
                    <div className='border-1 border-500 border-round col-12 p-2 mt-3'>
                        <InputTextarea placeholder='Comment' className='text-blue-700' onChange={(e: any) => { }} value={''} style={{ width: '100%' }} />
                    </div>
                    <div className='border-top-1 border-500 border-round col-12 p-2 mt-3 flex justify-content-end flex-wrap'>
                        <Button className='p-2 mr-2' onClick={(e: any) => { }} label="Reject" size={'small'} severity="danger" outlined />
                        <Button className='p-2' onClick={(e: any) => { manageEdit(product?.fk_table_more, product?.edit_id) }} label="Approve" severity="success" outlined />
                    </div>
                </div>
            </Dialog >

            <div className="pl-5 pr-5 justify-content-center pt-3 fadein animation-duration-1000">
                <DataTable value={products}
                    rowGroupMode="subheader" groupRowsBy="workid" sortMode="single" sortField="workid"
                    scrollable
                    scrollHeight="500px"
                    style={{ minWidth: '100%' }}

                    rows={11}
                    paginator
                    rowGroupHeaderTemplate={headerTemplate} sortOrder={1} className=' datatable-1 border-1 border-round' showGridlines size={'small'} tableStyle={{ tableLayout: 'auto' }}>
                    <Column field='id' header='No' alignHeader={'center'} />
                    <Column field='date_create' header='วันที่เพิ่มโครงการ' alignHeader={'center'} />
                    <Column field='reqnum' header='เลขที่คำขอ' alignHeader={'center'} />
                    <Column field='product_name' header='ชื่อการประดิษฐ์' alignHeader={'center'} />
                    <Column header='รูปภาพ' body={imageBodyTemplate} align={'center'} alignHeader={'center'} />
                    <Column field='country' header='ใน/นอก ประเทศ' alignHeader={'center'} />
                    <Column field='statusreq' header='คำสั่งดำเนินการ' alignHeader={'center'} />
                    <Column field='product_type' header='ประเภทผลิตภัณฑ์' alignHeader={'center'} />
                    <Column field='description' header='รายละเอียด' alignHeader={'center'} />
                    <Column body={buttonOtherFile} header='ลิ้งดำเนินการ' alignHeader={'center'} />
                    <Column field='important' header='ความสำคัญ' alignHeader={'center'} />
                    <Column field='work_start' header='วันที่เริ่มทำงาน' alignHeader={'center'} />
                    <Column field='deadline' header='deadline' alignHeader={'center'} />
                    <Column field='operator' header='ผู้ดำเนินการ' alignHeader={'center'} />
                    <Column body={status_check} header='สถานะ' alignHeader={'center'} />
                    <Column body={Manage} headerStyle={{ width: '13%' }} header='จัดการ' align={'center'} alignHeader={'center'} />
                </DataTable>
            </div>
        </>
    );
};

export default Product;
