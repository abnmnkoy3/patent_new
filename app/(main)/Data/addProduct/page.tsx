'use client'
import type { Demo, Page } from '../../../../types/types';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Nullable } from "primereact/ts-helpers";
import './page.css';
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';
import { useRouter } from 'next/navigation';
import React, { use, useContext, useEffect, useRef, useState } from 'react';

const AddProduct: Page = () => {

    interface InputValue {
        name: any;
        code: any;
    }

    // const toast = useRef<Toast | null>(null);
    // const fileUploadRef: any = useRef(null);
    const [Productname, SetProductname] = useState('');
    const [Description, Setdescription]: any = useState('');
    const [Important, Setimportant]: any = useState('');
    const [Workstart, Setworkstart]: any = useState<Nullable<Date>>(null);
    const [Deadline, Setdeadline]: any = useState<Nullable<Date>>(null);
    const [TotalSize, SetTotalSize] = useState(0);
    const router = useRouter();

    const radioselect = [
        { name: 'ในประเทศ', key: 'In' },
        { name: 'นอกประเทศ', key: 'Out' },
    ];
    const [selectedradioselect, setSelectedradioselect] = useState(radioselect[1]);

    /*# Dropdown #*/

    const [ArrayIpType, setArrayIpType]: any = useState();
    const [ArrayGroupIntellectual, setArrayGroupIntellectual]: any = useState();
    const [disabledSub, setdisabledSub]: any = useState(true);
    const useDropDownMain_type = (Type: any) => {
        const formData = new FormData();
        formData.append("Type", Type);
        const requestOptions = {
            method: "post",
            headers: { accept: "application/json" },
            body: formData,
        };

        fetch(process.env.NEXT_PUBLIC_ENV_API + 'getsubGroupIntellectual', requestOptions) /*change  now */
            .then((response) => response.json())
            .then((data) => {
                setArrayGroupIntellectual(data)
                setdisabledSub(false);
            });
    }

    useEffect(() => {
        fetch(process.env.NEXT_PUBLIC_ENV_API + "get_ip_type") /*change  now */
            .then((response) => response.json())
            .then((data) => {
                setArrayIpType(data)
            });
    }, [])
    const [dropdownProductType, setDropdownProductType]: any = useState(null);

    const dropdownProductTypes: InputValue[] = ArrayIpType;

    // }
    useEffect(() => {
        console.log(dropdownProductType)
    }, [dropdownProductType])
    console.log(ArrayIpType)

    const [dropdownValue, setDropdownValue]: any = useState(null);
    const dropdownValues: InputValue[] = ArrayGroupIntellectual;

    /*# Dropdown #*/
    /*# Template Uploads#*/
    const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'hidden custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };
    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i className="pi pi-image mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: '#f9f9f947', color: '#ffffff' }}></i>
                <span style={{ fontSize: '1.2em', color: '#ffffff' }} className="my-5">
                    Drag and Drop File Here
                </span>
            </div>
        );
    };
    /*# Template Uploads#*/

    const SubmitData = () => {
        const formCreateData: any = new FormData();
        const year: any = new Date().getFullYear();
        formCreateData.append('workid', dropdownProductType.code + selectedProductGroup + '-' + dropdownValue.code + '-');
        // formCreateData.append('reqnum', reqnum);
        formCreateData.append('type_sub',dropdownValue.code)
        formCreateData.append('product_name', Productname);
        formCreateData.append('img', fileName);
        formCreateData.append('country', selectedradioselect.key);
        formCreateData.append('linkother', 'linkother');
        formCreateData.append('description', Description);
        formCreateData.append('product_type', dropdownProductType.name);
        formCreateData.append('important', Important);
        formCreateData.append('workstart', Workstart.toLocaleDateString('fr-CA'));
        formCreateData.append('deadline', Deadline.toLocaleDateString('fr-CA'));
        formCreateData.append('operator', 'jakkawan.s');
        formCreateData.append("file", addFile);

        const requestOptions = {
            method: "post",
            headers: { accept: "application/json" },
            body: formCreateData,
        };
        fetch(process.env.NEXT_PUBLIC_ENV_API + 'CreateData', requestOptions) /*change now */
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            });
        router.refresh();
        router.push('/Workspace/Ongoing');
        sessionStorage.setItem('WorkSpacePage', 'Ongoing');
    }

    const onTemplateRemove = (file: any, callback: any) => {
        SetTotalSize(TotalSize - file.size);
        callback();
    };

    const onTemplateClear = () => {
        SetTotalSize(0);
    };

    /* ADDFILE API */
    const [addFile, setFiles]: any = useState(null);
    const [fileName, setfileName] = useState('');

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
    const headerTemplate = (options: any) => {
        const { className, chooseButton, uploadButton } = options;
        const value = TotalSize / 100000;

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
                    <ProgressBar
                        value={value}
                        showValue={false}
                        style={{ width: "10rem", height: "12px" }}
                    ></ProgressBar>
                </div>
            </div>
        );
    };
    /* ADDFILE API */

    /* Dropdown Group */
    interface City {
        label: string;
        value: string;
    }

    interface Country {
        label: string;
        code: string;
        items: City[];
    }

    const [selectedProductGroup, setSelectedProductGroup] = useState<City | null>(null);
    const [ArrayDropdown, setArrayDopdown]: any = useState();

    useEffect(() => {
        fetch(process.env.NEXT_PUBLIC_ENV_API + "getProductGroup")
            .then((response) => response.json())
            .then((data) => setArrayDopdown(data));
    }, [])
    const groupedCities: Country[] = ArrayDropdown;

    const groupedItemTemplate = (option: City) => {
        return (
            <div className="flex align-items-center">
                <div>{option.label}</div>
            </div>
        );
    };
    /* Dropdown Group */

    return (
        <>
            <div className='layout-main flex  fadein animation-duration-1000'>

                <div className='p-5 ' style={{ width: '50%' }}>
                    <FileUpload contentClassName="background-input setborder_file" headerClassName="background-1" name="demo[]" url="/api/upload" emptyTemplate={emptyTemplate} chooseOptions={chooseOptions} uploadOptions={uploadOptions} itemTemplate={itemTemplate} headerTemplate={headerTemplate} cancelOptions={cancelOptions} multiple accept="image/*" maxFileSize={1000000} />

                </div>

                <div className='p-5' style={{ width: '50%' }}>
                    <div className='card background-1'>
                        <div className='formgrid grid'>
                            <div className="pb-3 field col">
                                <label style={{ color: '#ffffff' }} htmlFor="value1">ชื่อการประดิษฐ์</label>
                                <InputText className='background-input' style={{ fontSize: '12px', width: '100%' }} id="value1" type="text" value={Productname} onChange={(e) => SetProductname(e.target.value)} />
                            </div>
                            <div className='field col pb-3'>
                                <label style={{ color: '#ffffff' }} htmlFor="value1">ประเภททรัพย์สินทางปัญญา</label>
                                <Dropdown className='custom-dropdown' style={{ borderRadius: 3, width: '100%' }} value={dropdownProductType} onChange={(e) => { setDropdownProductType(e.value), useDropDownMain_type(e.value.code) }} options={dropdownProductTypes} optionLabel="name" placeholder="-- เลือก --" />
                            </div>

                        </div>
                        <div className="field col-12 flex gap-3 pb-3">
                            {radioselect.map((category) => {
                                return (
                                    <div key={category.key} className="flex align-items-center">
                                        <RadioButton inputId={category.key} name="category" value={category} onChange={(e: RadioButtonChangeEvent) => setSelectedradioselect(e.value)} checked={selectedradioselect.key === category.key} />
                                        <label htmlFor={category.key} className="ml-2">{category.name}</label>
                                    </div>
                                );
                            })}
                        </div>
                        <div className='formgrid grid'>
                            <div className='field col pb-3'>
                                <label style={{ color: '#ffffff' }} htmlFor="value1">กลุ่มย่อยของทรัพย์สินทางปัญญา</label>
                                <Dropdown className='custom-dropdown' style={{ borderRadius: 3, width: '100%', color: '#FF5722' }} value={dropdownValue} onChange={(e) => setDropdownValue(e.value)} options={dropdownValues} disabled={disabledSub} optionLabel="name" placeholder="-- เลือก --" />
                            </div>
                            <div className="field col pb-3 ">
                                <label style={{ color: '#ffffff' }} htmlFor="value1">กลุ่มผลิตภัณฑ์</label>
                                <Dropdown className='custom-dropdown' value={selectedProductGroup} style={{ borderRadius: 3, width: '100%' }} id="value1" onChange={(e: DropdownChangeEvent) => { setSelectedProductGroup(e.value) }} options={groupedCities} optionLabel="label"
                                    optionGroupLabel="label" optionGroupChildren="items" optionGroupTemplate={groupedItemTemplate} placeholder="-- เลือก --" />
                            </div>
                        </div>
                        <div className='formgrid grid'>
                            <div className='field col pb-3'>
                                <span className="">
                                    <label style={{ color: '#ffffff' }} htmlFor="description">รายละเอียด</label>

                                    <InputTextarea className='background-input' id="description" value={Description} style={{ width: '100%' }} onChange={(e) => Setdescription(e.target.value)} />
                                </span>
                            </div>
                        </div>
                        <div className='formgrid grid'>
                            <div className='field col'>
                                <span className=" pb-3">
                                    <label style={{ color: '#ffffff' }} htmlFor="value2">ความสำคัญ</label>
                                    <InputText className='background-input' style={{ fontSize: '12px', width: '100%' }} id="value2" type="text" value={Important} onChange={(e) => Setimportant(e.target.value)} />
                                </span>
                            </div>
                        </div>
                        <div className='formgrid grid '>
                            <div className='field col pb-3'>
                                <span className="pb-3">
                                    <label style={{ color: '#ffffff' }} htmlFor="value1">วันที่เริ่มทำงาน</label>
                                    <Calendar className='background-input' style={{ borderRadius: 3, width: '100%' }} dateFormat="yy-mm-dd" value={Workstart} onChange={(e: any) => Setworkstart(e.value)} showIcon />
                                </span>
                            </div>
                            <div className='field col pb-3'>
                                <span className="pb-3">
                                    <label style={{ color: '#ffffff' }} htmlFor="value1">deadline</label>
                                    <Calendar className='background-input' style={{ borderRadius: 3, width: '100%' }} dateFormat="yy-mm-dd" value={Deadline} onChange={(e: any) => Setdeadline(e.value)} showIcon />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {<div className='flex justify-content-center flex-wrap pb-3 fadein animation-duration-1000'>
                <Button className='' size='small' style={{ background: '#ffffff', color: '#000000', borderColor: '#f9f9f947', borderRadius: 0, borderWidth: '2px' }} onClick={() => {
                    SubmitData();
                }} label="เพิ่มโครงการ" severity="secondary" outlined />
            </div>}

        </>
    )
}
export default AddProduct;