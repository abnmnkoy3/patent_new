import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import React, { useEffect, useRef, useState } from 'react';
export const MenuManage = () => {
    const [visible, setVisible] = useState<boolean>(false);

    interface Header {
        name: string;
        code: string;
    }

    const datamore = {
        reqnum: "",
        title: "",
        eceipt_date: "",
        from: "",
        category: "",
        patentnum: "",
        country: "",
        datedoc: "",
        dateday: "",
        startdate: "",
        enddate: "",
        status: "",
        comment: "",
        userlastupdate: "",
        lastupdate: "",
    }

    const [dataMore, setdataMore]: any = useState(datamore);
    const [selectedHeader, setSelectedHeader] = useState<Header | null>(null);
    const [showNoti, setshowNoti]: any = useState(true);
    const [fileedit, setFileedit]: any = useState(null);
    const [ReqNum, setReqNum]: any = useState(null);
    const [listData, setListData]: any = useState(true);
    const [checkbox, setCheckbox] = useState<string[]>([]);

    const [showPay, setshowPay]: any = useState('hidden');
    const manage = (code: any) => {
        const formData = new FormData();
        formData.append("key", code);
        formData.append("reqnum", ReqNum);
        const requestOptionsFile = {
            method: "POST",
            headers: { accept: "application/json" },
            body: formData,
        };
        fetch(process.env.NEXT_PUBLIC_ENV_API + 'getmasterDoc', requestOptionsFile)
            .then((response) => response.json())
            .then((data) => {
                if (data !== null) {
                    if (data === 'not found') {
                        setshowNoti(false)
                    } else {
                        setshowNoti(true)
                    }
                    if (code === 'editdata' && data !== 'not found') {
                        setFileedit(data)
                        setListData(false);
                        // setshoweditData(false)
                    } else if (data === 'pay' && data !== 'not found') {
                        setFileedit(data)
                        setListData(false);
                    } else if (data === 'oppose' && data !== 'not found') {
                        setFileedit(data)
                        setListData(false);
                    } else {
                        setListData(true)
                    }
                } else {
                    setListData(true) 
                }
            });
    }

    const cities: Header[] = [
        { name: 'แก้ไขคำขอ', code: '1' },
        { name: 'ชำระค่าธรรมเนียมประกาศโฆษณา', code: '2' },
        { name: 'คัดค้าน', code: '3' },
        { name: 'ยื่นตรวจสอบการประดิษฐ์', code: '4' },
        { name: 'อื่นๆ', code: 'other' }
    ];

    const onIngredientsChange = (e: CheckboxChangeEvent) => {
        let _checkbox = [...checkbox];
        if (e.checked)
            _checkbox.push(e.value);
        else
            _checkbox.splice(_checkbox.indexOf(e.value), 1);
        setCheckbox(_checkbox);
    }

    const [ingredient, setIngredient] = useState<string>('');

    const onChangeData = (index: any, value: any) => {
        let _product = { ...dataMore };

        _product[`${index}`] = value;
        setdataMore(_product)
    }

    const [ShowFile, setShowFile] = useState('hidden');
    const [NameFile, setNameFile]: any = useState();
    const [currentFileLetter, setCurrentFileLetter] = useState<File>();
    const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files: any = (e.target as HTMLInputElement).files;
        setCurrentFileLetter(files[0])
        setNameFile(files[0].name)
        setShowFile('')
    }
    const apiDataMore = () => {
        const formCreateData: any = new FormData();
        formCreateData.append('data', JSON.stringify(dataMore));
        formCreateData.append('file', currentFileLetter)
        const requestOptions = {
            method: "post",
            headers: { accept: "application/json" },
            body: formCreateData,
        };
        fetch(process.env.NEXT_PUBLIC_ENV_API + 'CreateDataMore', requestOptions) /*change now */
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
            });
    }
    return (
        <>
            <Button className='p-1' label="Menu" size='small' severity="warning" onClick={(e: any) => { setVisible(true) }} outlined />
            <Dialog header="ตั้งเรื่องเพิ่มเติม" visible={visible} style={{ width: '60vw' }} onHide={() => { setVisible(false), setListData(true), setShowFile('hidden') }}>
                <div className="formgrid grid">
                    <div className='col-12 border-1 border-500 border-round mt-2 p-2'>
                        <div className='formgrid grid m-2'>
                            <div className='flex col-6 formgrid grid'>
                                <p className='vertical-align-middle font-bold text-xs col-5'>เลขที่คำขอ : </p>
                                <InputText style={{ height: "30px" }} className="p-inputtext-sm p-1 col-7" onChange={(e: any) => { setReqNum(e.target.value), onChangeData('reqnum', e.target.value) }} />
                            </div>
                            <div className='flex col-6 formgrid grid'>
                                <p className='vertical-align-middle  font-bold text-xs col-5'>ประเภทหัวข้อ : </p><Dropdown disabled={ReqNum ? false : true} value={selectedHeader} onChange={(e: any) => { ReqNum ? setSelectedHeader(e.value) : setSelectedHeader(null), manage(e.value.code), onChangeData('title_type', e.target.value.code), e.target.value.code === '2' ? setshowPay('') : setshowPay('hidden') }} options={cities} optionLabel="name"
                                    placeholder="-- เลือก --" className="vertical-align-middle text-center col-7" />
                            </div>
                            <div className='flex justify-content-center flex-wrap col-12' >
                                <p style={{ color: 'red' }} hidden={showNoti}>
                                    *เลขที่คำขอไม่ถูกต้อง
                                </p>
                            </div>
                        </div>
                        <div>
                            <div className='formgrid grid m-2'>
                                <div className="flex col-6  formgrid grid">
                                    <p className="vertical-align-middle pr-2 font-bold text-xs col-5">วันรับเอกสาร : </p>
                                    <Calendar style={{ height: "30px" }} id="patent_expire" className='p-0 col-7' value='' onChange={(e: any) => { onChangeData('eceipt_date', e.target.value.toLocaleDateString()) }} dateFormat="dd/mm/yy" required readOnlyInput />
                                </div>
                                <div className='flex col-6 formgrid grid'>
                                    <p className='vertical-align-middle pr-2 font-bold text-xs col-5'>จาก : </p>
                                    <InputText style={{ height: "30px" }} className="p-inputtext-sm col-7" onChange={(e: any) => { onChangeData('from', e.target.value) }} />
                                </div>

                            </div>
                            <div className='formgrid grid m-2'>
                                <div className='flex col-6 formgrid grid'>
                                    <p className='vertical-align-middle pr-2 font-bold text-xs col-5'>หมวดหมู่ : </p>
                                    <InputText style={{ height: "30px" }} className="p-inputtext-sm p-1 col-7" onChange={(e: any) => { onChangeData('category', e.target.value) }} />
                                </div>
                                <div className='flex col-6 formgrid grid'>
                                    <p className='vertical-align-middle pr-2 font-bold text-xs col-6'>ประเภทเลขที่คำขอ : </p>
                                    <div className="flex formgrid grid col-3" >
                                        <RadioButton inputId="ingredient1" name="in" value="ในประเทศ" onChange={(e: RadioButtonChangeEvent) => { setIngredient(e.value), onChangeData('country', e.value) }} checked={ingredient === 'ในประเทศ'} />
                                        <label htmlFor="ingredient1" className="p-inputtext-sm text-xs">ในประเทศ</label>
                                    </div>
                                    <div className="flex formgrid grid col-3">
                                        <RadioButton inputId="ingredient2" name="out" value="นอกประเทศ" onChange={(e: RadioButtonChangeEvent) => { setIngredient(e.value), onChangeData('country', e.value) }} checked={ingredient === 'นอกประเทศ'} />
                                        <label htmlFor="ingredient2" className="p-inputtext-sm text-xs">นอกประเทศ</label>
                                    </div>
                                </div>
                            </div>
                            <div className='formgrid grid m-2'>
                                <div className='flex col-6 formgrid grid'>
                                    <p className='vertical-align-middle pr-2 font-bold text-xs col-5'>เลขที่เอกสาร : </p>
                                    <InputText style={{ height: "30px" }} className="p-inputtext-sm p-1 col-7" onChange={(e: any) => { onChangeData('patentnum', e.target.value) }} />
                                </div>
                                <div className='flex col-6 formgrid grid'>
                                    <p className='vertical-align-middle pr-2 font-bold text-xs col-5'>วันที่ระบุในเอกสาร : </p>
                                    {/* <InputText style={{ height: "30px" }} className="p-inputtext-sm p-1 col-7" onChange={(e: any) => { onChangeData('datedoc', e.target.value) }} /> */}
                                    <Calendar style={{ height: "30px" }} id="patent_expire" className='col-7 p-0' value={''} onChange={(e: any) => { onChangeData('datedoc', e.target.value.toLocaleDateString()) }} dateFormat="dd/mm/yy" required readOnlyInput />
                                </div>
                            </div>
                            <div className='formgrid grid m-2'>
                                <div className="flex col-6 formgrid grid">
                                    <p className="vertical-align-middle pr-2 font-bold text-xs col-5">ระยะเวลาดำเนินการ : </p>
                                    <InputText style={{ height: "30px" }} className="p-inputtext-sm p-1 col-7" onChange={(e: any) => { onChangeData('dateday', e.target.value) }} />
                                </div>
                                <div className="flex col-6 formgrid grid">
                                    <p className="vertical-align-middle pr-2 font-bold text-xs col-5">ระยะเวลาที่กำหนด : </p>
                                    <Calendar style={{ height: "30px" }} id="patent_expire" className='col-3 p-0' value={''} onChange={(e: any) => { onChangeData('startdate', e.target.value.toLocaleDateString()) }} dateFormat="dd/mm/yy" required readOnlyInput />
                                    <p className="vertical-align-middle p-2 font-bold text-xs">To</p>
                                    <Calendar style={{ height: "30px" }} id="patent_expire" className='col-3 p-0' value={''} onChange={(e: any) => { onChangeData('enddate', e.target.value.toLocaleDateString()) }} dateFormat="dd/mm/yy" required readOnlyInput />
                                </div>
                            </div>
                            <div className='formgrid grid m-2 mb-3'>
                                <div className="flex col-6 formgrid grid">
                                    <p className="vertical-align-middle pr-2 font-bold text-xs col-5">ไฟล์แนบจดหมาย : </p>
                                    <div className='border-double border-500 border-round col-7 flex flex-row flex-wrap' style={{ height: '120%' }}>
                                        <input className='pt-2' type="file" onChange={(e) => { onChangeFile(e) }} />
                                        <div className={`col-12 flex align-items-center justify-content`}>
                                            <i className={`pi pi-file-pdf pt-1 ${ShowFile}`} style={{ fontSize: '2.5rem' }}></i>
                                            <a href='' className={`underline vertical-align-middle pt-1 pl-3 ${ShowFile}`} >{`${NameFile}`}.pdf</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div className={`formgrid grid m-2 ${showPay}`}>
                                <div className="flex col-6 formgrid grid" >
                                    <p className="vertical-align-middle pr-2 font-bold text-xs col-5" >เลขที่ PR : </p>
                                    <InputText style={{ height: "30px" }} className="p-inputtext-sm p-1 col-7" onChange={(e: any) => { onChangeData('dateday', e.target.value) }} />
                                </div>
                                <div className="flex col-6 formgrid grid" >
                                    <p className="vertical-align-middle pr-2 font-bold text-xs col-5">ไฟล์ PR : </p>
                                    <label className='p-0 col-7' >
                                        <i className="pi pi-cloud-upload pr-2" style={{ fontSize: '1rem' }}></i>Upload
                                        <input hidden type="file"></input>
                                    </label>
                                </div>
                            </div> */}
                        </div>
                    </div>
                    <div className='border-1 border-500 border-round col-12 p-2 mt-3'>
                        <InputTextarea placeholder='Comment' onChange={(e: any) => { onChangeData('comment', e.target.value) }} style={{ width: '100%' }} />
                    </div>
                    <div className='border-top-1 border-500 border-round col-12 p-2 mt-3 flex justify-content-end flex-wrap'>
                        <Button className='p-2' onClick={(e: any) => { apiDataMore() }} label="ยืนยัน" severity="success" outlined />
                    </div>
                </div>
            </Dialog >
        </>
    )
}