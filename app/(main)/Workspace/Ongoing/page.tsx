'use client';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useRef, useState } from 'react';
import type { Page } from '../../../../types/types';
import { Product, Manage } from './interface_product';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import '../Ongoing/page.css'
import { useRouter } from 'next/navigation';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Dialog } from 'primereact/dialog';
import { MenuItem } from 'primereact/menuitem';
import { Steps } from 'primereact/steps';
import { FileUpload, FileUploadHandlerEvent, ItemTemplateOptions } from 'primereact/fileupload';

const Product: Page = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [product, setProduct]: any = useState();
    // const Permission = sessionStorage.getItem('Permission');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const router = useRouter();
    const sessionWorkSpace = sessionStorage.getItem('WorkSpacePage');
    const [activeIndex, setActiveIndex] = useState<number>(1);
    /* Mode Dialog */
    const fileUploadRef: any = useRef(null);
    const chooseOptions_Download = { icon: 'pi pi-fw pi-images', iconOnly: false, className: 'custom-choose-btn p-button-rounded p-button-outlined p-1 -mt-1 border-round-sm text-xs' };

    /* Mode Step */
    const [visibleManage, setVisibleManage] = useState<boolean>(false);
    const items: MenuItem[] = [
        {
            label: 'ตั้งเรื่อง',
        },
        {
            label: 'สืบค้น',
        },
        {
            label: 'ร่าง',
        },
        {
            label: 'รอพิจารณา',
        },
        {
            label: 'รวบรวมเอกสาร',
        },
        {
            label: 'ยื่นเอกสาร',
        },
        {
            label: 'ได้รับเลขที่คำขอ',
        },

    ];
    /* Mode Step */

    const footerContent = (
        <div>
            <Button label="No" icon="pi pi-times" onClick={() => setVisibleManage(false)} className="p-button-text" />
            <Button label="Yes" icon="pi pi-check" onClick={() => setVisibleManage(false)} autoFocus />
        </div>
    );
    /* Mode Dialog */
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
    const Manage = (product: Product) => {
        setIdData(product.id)
        return (
            <div className="flex flex-wrap justify-content-center gap-2">
                <Button label="Manage" size={'small'} severity="info" onClick={(e) => { setVisibleManage(true), setProduct(product), SearchPOA(product.id) }} />
            </div>
        )
    }

    /* Send Document */
    const SendDocument = (e: any) => {
        const SendDoc = new FormData();
        SendDoc.append('Id', e);
        const requestOptions = {
            method: "POST",
            headers: {
                accept: "application/json",
            },
            body: SendDoc,
        };
        fetch(process.env.NEXT_PUBLIC_ENV_API + 'SendDocument', requestOptions)
            .then((response) => response.json())
            .then((data: any) => {
                fetch(process.env.NEXT_PUBLIC_ENV_API + `GetData`)
                    .then((response) => response.json())
                    .then((data) => setProducts(data));
            })
    }
    /* Send Document */

    /* Search File */
    const [status_document, setstatus_document] = useState('รอดำเนินการ');
    const [Design_Patent, setDesign_Patent] = useState('รอดำเนินการ');
    const SearchPOA = (e: any) => {
        const SearchPOA = new FormData();
        SearchPOA.append("Id", e);
        const requestOptions = {
            method: "POST",
            headers: {
                accept: "application/json",
            },
            body: SearchPOA,
        };
        fetch(process.env.NEXT_PUBLIC_ENV_API + 'SearchPOA', requestOptions)
            .then((response) => response.json())
            .then((data: any) => {
                let Num: number = 0;
                data.forEach((datas: any, index: any) => {
                    if (datas.ms_doc_id === '1' || datas.ms_doc_id === '2' || datas.ms_doc_id === '4') {
                        Num = Num + 1;
                    } else if (data !== null && datas.ms_doc_id === '3') {
                        console.log(data)
                        setDesign_Patent('อนุมัติไฟล์')
                    }
                })
                console.log(Num)
                if (Num === 3) {
                    setstatus_document('อนุมัติไฟล์')
                }
            }
            );
    }
    /* Search File  */


    useEffect(() => {
        fetch(process.env.NEXT_PUBLIC_ENV_API + `GetData`)
            .then((response) => response.json())
            .then((data) => setProducts(data));
    }, []);

    const [disabledManageDoc, setdisabledManageDoc] = useState(false);
    const CommandManageDoc = (e: any) => {
        const formManageDoc = new FormData();
        formManageDoc.append("Id", e);
        formManageDoc.append('Skip', '');
        const requestOptions = {
            method: "POST",
            headers: {
                accept: "application/json",
            },
            body: formManageDoc,
        };
        fetch(process.env.NEXT_PUBLIC_ENV_API + `ManageDoc`, requestOptions)
            .then((response) => response.json())
            .then((data) =>
                setdisabledManageDoc(data)
            );
    }

    const Submit_Form = (e: any) => {
        const formSubmit = new FormData();
        formSubmit.append("Id", e);
        const requestOptions = {
            method: "POST",
            headers: {
                accept: "application/json",
            },
            body: formSubmit,
        };
        fetch(process.env.NEXT_PUBLIC_ENV_API + `Submit_Form`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setdisabledManageDoc(data);
                setVisibleManage(false);
                fetch(process.env.NEXT_PUBLIC_ENV_API + `GetData`)
                    .then((response) => response.json())
                    .then((data) => setProducts(data));
            }
            );
    }

    const [log_comment, setlog_comment]: any = useState(null);

    // useEffect(() => {
    //     const formcheckID: any = new FormData();
    //     formcheckID.append('id_kaizen', '6');
    //     const requestOptions = {
    //         method: "POST",
    //         headers: { accept: "application/json" },
    //         body: formcheckID,
    //     };
    //     fetch("https://kpi.vandapac.com/getcomment_log", requestOptions)
    //         .then((response) => response.json())
    //         .then((data) => {
    //             {
    //                 setlog_comment(data);
    //                 console.log(data)
    //             }
    //         })

    // }, [])

    const [fileName, setfileName] = useState('');
    const [addFile, setFiles]: any = useState(null);
    const [IdData, setIdData]: any = useState();
    const [status_doc, setstatus_doc] = useState('');
    const upload_patent_description = async (event: FileUploadHandlerEvent) => {
        const file: any = event.files[0];
        setfileName(file.name);
        setFiles(file);
        const formDataFile = new FormData();
        const requestOptionsFile = {
            method: "POST",
            headers: {
                accept: "application/json",
            },
            body: formDataFile,
        };
        formDataFile.append("file", event.files[0]);
        formDataFile.append("Id", IdData);
        formDataFile.append("file_name", event.files[0].name);
        formDataFile.append("status_doc", 'req_doc');
        formDataFile.append("file_step", 'patent_description');
        fetch(
            process.env.NEXT_PUBLIC_ENV_API + "uploadFile_Attach",
            requestOptionsFile
        )
            .then((response) => response.json())
            .then((data) => console.log(data));

        const formManageDoc = new FormData();
        formManageDoc.append("Id", IdData);
        formManageDoc.append("Skip", 'patent_description');
        const requestOptions = {
            method: "POST",
            headers: {
                accept: "application/json",
            },
            body: formManageDoc,
        };
        fetch(process.env.NEXT_PUBLIC_ENV_API + `ManageDoc`, requestOptions)
            .then((response) => response.json())
            .then((data) =>
                setdisabledManageDoc(data)
            );
    };
    const status_check = (product: Product) => {
        if (product.edit_status !== null) {
            return <p>{product.edit_name}</p>
        } else {
            return <p>{product.status_name}</p>
        }
    }

    return (
        <>
            {/* Dialog Manage */}
            <Dialog header="Header" visible={visibleManage} style={{ width: '70vw' }} headerStyle={{ borderRadius: '0%', borderBottom: '1px' }} contentStyle={{ borderRadius: '0%' }} onHide={() => setVisibleManage(false)} footer={footerContent} >
                <div className='grid nested-grid'>
                    <div className='col-8'>
                        <div className='grid'>
                            <div className='col-6'>
                                <label>ชื่อการประดิษฐ์ : {product?.product_name}</label>
                            </div>
                            <div className='col-6'>
                                <label className=''>Deadline : {product?.deadline}</label>
                            </div>
                            <div className='col-12 pt-8'>
                                <div className='grid'>
                                    <div className='col-3'>
                                        <label>สถานะดำเนินการ: </label>
                                    </div>
                                    <div className='col-9 text-center border-1'>
                                        <label>{product?.status_name}</label>
                                    </div>
                                </div>
                            </div>
                            <div className='col-12'>
                                <div className='grid'>
                                    <div className='col-3'>
                                        <label>สถานะดำเนินการ: </label>
                                    </div>
                                    <div className='col-9 text-center border-1'>
                                        <Steps style={{ fontSize: 10 }} model={items} activeIndex={+product?.status - 1} readOnly={false} />
                                    </div>
                                </div>
                            </div>
                            <div className='col-12 p-0'>
                                <div className='grid p-0'>
                                    <div className='col-4 pb-1'>
                                        <Button className='border-1 p-1' disabled={true} style={{ width: '100%', borderColor: '#000', borderRadius: '0%', background: '#C5CBC6', color: '#000000' }} onClick={(e) => CommandManageDoc(product?.id)}>คำสั่งส่งดำเนินการจัดทำเอกสาร</Button>
                                    </div>
                                    <div className='col-3 pb-1 text-right' >
                                        <label className='border-1 p-1 ' style={{ verticalAlign: 'middle', background: '#B1F0BC' }}>{`${status_document}`}</label>
                                    </div>
                                </div>
                            </div>
                            <div className='col-12 p-0'>
                                <div className='grid'>
                                    <div className='col-4 pb-1'>
                                        <Button className='border-1 p-1' disabled={true} style={{ width: '100%', borderColor: '#000', borderRadius: '0%', background: '#C5CBC6', color: '#000' }}>คำสั่งส่งดำเนินการขอไฟล์ cad</Button>
                                    </div>
                                    <div className='col-3 pb-1 text-right' >
                                        <label className='border-1 p-1 ' style={{ verticalAlign: 'middle', background: '#FEB1AB' }}>{`[STATUS]`}</label>
                                    </div>
                                </div>
                            </div>
                            <div className='col-12 p-0'>
                                <div className='grid'>
                                    <div className='col-4 pb-1'>
                                        <Button className='border-1 p-1' disabled={true} style={{ width: '100%', borderColor: '#000', borderRadius: '0%', background: '#C5CBC6', color: '#000' }} onClick={(e) => { }}>แบบฟอร์มร่างคำขอ</Button>
                                    </div>
                                    <div className='col-3 pb-1 text-right' >
                                        <label className='border-1 p-1 ' style={{ verticalAlign: 'middle', background: '#BBBBBB' }}>{`[STATUS]`}</label>
                                    </div>
                                </div>
                            </div>
                            <div className='col-12 p-0'>
                                <div className='grid'>
                                    <div className='col-4 flex pb-1'>
                                        <Button className='border-1 p-1' disabled={true} style={{ width: '100%', borderColor: '#000', borderRadius: '0%', background: '#C5CBC6', color: '#000' }}>แบบฟอร์มร่างคำพรรณนา</Button>
                                    </div>
                                    <div className='col-3 pb-1 text-right' >
                                        <label className='border-1 p-1 ' style={{ verticalAlign: 'middle', background: '#BBBBBB' }}>{`${Design_Patent}`}</label>
                                    </div>
                                    {/* <div className='col-2 pb-1 text-center' >
                                        <a className='p-1' href={`${process.env.NEXT_PUBLIC_ENV_API}${process.env.NEXT_PUBLIC_ENV_DOWNLOAD}/${process.env.NEXT_PUBLIC_ENV_LIST_4}`} style={{ verticalAlign: 'middle', textDecoration: 'underline' }}>{`Download`}</a>
                                    </div>
                                    <div className='col-2 pb-1 text-center' >
                                        <FileUpload ref={fileUploadRef} className='button_upload p-0 text-xs' headerClassName='' mode="basic" name="demo[]" url="" accept="doc/*" chooseOptions={chooseOptions_Download} customUpload uploadHandler={upload_patent_description} style={{ borderRadius: 0, padding: '0rem', fontSize: '0.75rem' }} maxFileSize={1000000} chooseLabel="Browse" />
                                    </div> */}
                                </div>
                            </div>
                            <div className='col-12 p-0'>
                                <div className='grid'>
                                    <div className='col-4 pb-1'>
                                        <Button className='border-1 p-1' disabled={true} style={{ width: '100%', borderColor: '#000', borderRadius: '0%', background: '#C5CBC6', color: '#000' }}>แบบฟอร์มรูป</Button>
                                    </div>
                                    <div className='col-3 pb-1 text-right' >
                                        <label className='border-1 p-1 ' style={{ verticalAlign: 'middle', background: '#BBBBBB' }}>{`[STATUS]`}</label>
                                    </div>
                                </div>
                            </div>
                            <div className='col-12 p-0'>
                                <div className='grid'>
                                    <div className='col-4 pb-1'>
                                        <Button className='border-1 p-1' disabled={true} style={{ width: '100%', borderColor: '#000', borderRadius: '0%', background: '#C5CBC6', color: '#000' }}>แบบฟอร์มสืบค้น</Button>
                                    </div>
                                    <div className='col-3 pb-1 text-right' >
                                        <label className='border-1 p-1 ' style={{ verticalAlign: 'middle', background: '#BBBBBB' }}>{`[STATUS]`}</label>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className='col-4 '>
                        <div className='grid'>
                            <div className='col-3'>
                                <label>รูปภาพ :</label>
                            </div>
                            <div style={{ width: '70%' }} className='col-9 border-1' >
                                <img src={`data:application/pdf;base64,` + product?.img_base64} style={{ width: '100%', height: '60%' }} alt="Bamboo Watch"></img>
                            </div>
                        </div>
                    </div>
                    <div className='col-12 p-0 flex justify-content-center '>
                        <div className='col-4 pb-1'>
                            <Button className='border-1 p-1' onClick={(e) => { Submit_Form(product.id) }} style={{ width: '100%', borderColor: '#000', borderRadius: '0%', background: '#C5CBC6', color: '#000' }} label="คำสั่งพิจารณาร่างสิทธิบัตร" />
                        </div>
                    </div>
                </div>
            </Dialog >
            {/* Dialog Manage */}

            <div className="grid p-fluid input-demo pt-5 fadein animation-duration-1000">
                <div className="col-12 md:col-6 col-offset-3">
                    <InputText style={{ borderRadius: 3, backgroundColor: '#ffffff', color: '#747272', borderColor: 'rgba(0, 0, 0, 0.65)', fontSize: '13px', borderWidth: '2px' }} placeholder="Search" type="text" className="w-full" />
                </div>

            </div>
            <div className='pl-5 pr-5 flex justify-content-left flex-wrap pt-3 fadein animation-duration-1000'>
                <Button className='' size='small' style={{ background: '#ffffff', color: '#0061ff', borderColor: '#0061ff', borderRadius: 0, borderWidth: '2px' }} onClick={() => {
                    router.push('/Data/addProduct')
                }} label="เพิ่มโครงการ" severity="secondary" outlined />
            </div>
            <div className="pl-5 pr-5 justify-content-center pt-3 fadein animation-duration-1000">

                <DataTable value={products} selectionMode="single" selection={selectedProduct!} onSelectionChange={(e) => setSelectedProduct(e.value)} className=' datatable-1 border-1 border-round' showGridlines size={'small'} tableStyle={{ tableLayout: 'auto' }}>
                    <Column field='id' header='No' alignHeader={'center'} />
                    <Column field='date_create' header='วันที่เพิ่มโครงการ' alignHeader={'center'} />
                    <Column field='workid' header='WorkId' alignHeader={'center'} />
                    <Column field='reqnum' header='เลขที่คำขอ' alignHeader={'center'} />
                    <Column field='product_name' header='ชื่อการประดิษฐ์' alignHeader={'center'} />
                    <Column header='รูปภาพ' body={imageBodyTemplate} align={'center'} alignHeader={'center'} />
                    <Column field='country' header='ใน/นอก ประเทศ' alignHeader={'center'} />
                    <Column field='statusreq' header='คำสั่งดำเนินการ' alignHeader={'center'} />
                    <Column field='product_type' header='ประเภทผลิตภัณฑ์' alignHeader={'center'} />
                    <Column field='description' header='รายละเอียด' alignHeader={'center'} />
                    <Column field='linkother' header='ลิ้งดำเนินการ' alignHeader={'center'} />
                    <Column field='important' header='ความสำคัญ' alignHeader={'center'} />
                    <Column field='work_start' header='วันที่เริ่มทำงาน' alignHeader={'center'} />
                    <Column field='deadline' header='deadline' alignHeader={'center'} />
                    <Column field='operator' header='ผู้ดำเนินการ' alignHeader={'center'} />
                    <Column body={status_check} header='สถานะ' alignHeader={'center'} />
                    <Column body={Manage} header='จัดการ' align={'center'} alignHeader={'center'} />
                </DataTable>
            </div>
            {/* <div>
                <Accordion activeIndex={1}>
                    <AccordionTab header="Comment" headerClassName='p-0  text-xs' headerStyle={{ padding: '0%' }} style={{ padding: '0%' }}>
                        <div>
                            {
                                log_comment && log_comment?.map(({ comment }: any) => <tr style={{ fontSize: '.75rem' }}>{comment}</tr>)
                            }
                        </div>
                    </AccordionTab>
                </Accordion>
            </div> */}
        </>
    );
};

export default Product;
