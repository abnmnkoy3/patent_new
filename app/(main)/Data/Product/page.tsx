'use client';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useState } from 'react';
import { CountryService } from '../../../../demo/service/CountryService';
import type { Demo, Page } from '../../../../types/types';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { ProgressBar } from 'primereact/progressbar';
import { MultiSelect } from 'primereact/multiselect';
import '../Product/page.css'
import { useRouter } from 'next/navigation';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';

const Product: Page = () => {
    const [products, setProducts]: any = useState([]);
    const router = useRouter();

    interface Product {
        id: string;
        code: string;
        name: string;
        description: string;
        image: string;
        price: number;
        category: string;
        quantity: number;
        inventoryStatus: string;
        rating: number;
    }

    interface ColumnMeta {
        field: string;
        header: string;
    }

    useEffect(() => {
        fetch(
            process.env.NEXT_PUBLIC_ENV_API + "GetDataProduct"
        )
            .then((response) => response.json())
            .then((data) => setProducts(data));
    }, [])
    const columns: ColumnMeta[] = [
        { field: 'workid', header: 'จำนวน' },
        { field: 'product_name', header: 'ประเภทผลิตภัณฑ์' },
        { field: 'img', header: 'รูปภาพ' },
        { field: 'reqnum', header: 'เลขที่คำขอ' },
        { field: 'description', header: 'รายละเอียดที่เกี่ยวข้อง' },
        { field: 'country', header: 'ใน / นอก ประเทศ' },
        { field: 'statusreq', header: 'คำสั่งดำเนินการ' },
        { field: 'product_type', header: 'ประเภทผลิตภัณฑ์' },
        { field: 'description', header: 'รายละเอียด' },
        { field: 'linkother', header: 'ลิงค์ดำเนินการ' },
        { field: 'important', header: 'ความสำคัญ' },
        { field: 'work_start', header: 'วันที่เริ่มทำงาน' },
        { field: 'deadline', header: 'deadline' },
        { field: 'operator', header: 'ผู้ดำเนินการ' },
        { field: 'name', header: 'สถานะ' },
    ];

    const headerGroup = (
        <ColumnGroup>
            <Row>
                <Column header="จำนวน" rowSpan={2} />
                <Column header="Sale Rate" colSpan={4} />
            </Row>
            <Row>
                <Column header="Sales" colSpan={2} />
                <Column header="Profits" colSpan={2} />
            </Row>
            <Row>
                <Column header="Last Year" sortable field="lastYearSale" />
                <Column header="This Year" sortable field="thisYearSale" />
                <Column header="Last Year" sortable field="lastYearProfit" />
                <Column header="This Year" sortable field="thisYearProfit" />
            </Row>
        </ColumnGroup>
    );

    return (
        <>
            <div className="grid p-fluid input-demo pt-5 fadein animation-duration-1000">
                <div className="col-12 md:col-6 col-offset-3">
                    <InputText style={{ backgroundColor: '#ffffff', color: '#0061ff', borderColor: '#0061ff', fontSize: '13px', borderWidth: '2px' }} placeholder="Search" type="text" className="w-full" />
                </div>

            </div>
            <div className="pl-5 pr-5 justify-content-center pt-3 fadein animation-duration-1000">
                <DataTable className='datatable-1 border-1 border-round' showGridlines size={'small'} value={products} style={{ width: 'auto', overflow: 'auto' }} >
                    {columns.map((col, i) => (
                        <Column key={col.field} field={col.field} header={col.header} />
                    ))}
                </DataTable>
            </div>
        </>
    );
};

export default Product;
