/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';

import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { AppTopbarRef } from '../types/types';
import { LayoutContext } from './context/layoutcontext';
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { TabMenu } from 'primereact/tabmenu';
import { useRouter } from 'next/navigation';
import './AppTopbar.css';
const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);
    const Permission: any = localStorage.getItem('Permission');
    useEffect(() => {
        if (Permission == null) {
            router.push('/auth/login');
        }
    }, [])

    const nestedMenuitems = [
        {
            label: 'Home',
            command: () => router.push('/')
        },
        {
            label: 'Dashboard',
            items: [
                {
                    label: 'Product',
                    command: () => router.push('/Data/Product')
                },
                {
                    label: 'Statistcal data',
                },
                {
                    label: 'Library',
                }
                ,
                {
                    label: 'Case Study',
                }
            ]
        },
        {
            label: 'Workspace',
            items: [
                {
                    label: 'On going',
                    command: () => { router.refresh(), router.push('/Workspace/Ongoing'), sessionStorage.setItem('WorkSpacePage', 'Ongoing') },
                },
                {
                    label: 'Document preparation',
                    // visible: Permission === '01' ? true : false,
                    command: () => { router.refresh(), router.push('/Workspace/Document'), sessionStorage.setItem('WorkSpacePage', 'Document') }
                },
                {
                    label: 'Consider',
                    // visible: Permission === '01' ? true : false,
                    command: () => { router.refresh(), router.push('/Workspace/Consider'), sessionStorage.setItem('WorkSpacePage', 'Consider') }
                }
            ]
        },
        {
            label: 'Report',
            items: [
                {
                    label: 'ลิขสิทธิ์',
                    command: () => { window.open(process.env.NEXT_PUBLIC_ENV_API + "ExportExcel/CR", '_blank') }
                    // command: () => { router.refresh() }
                },
                {
                    label: 'สิทธิบัตร',
                    command: () => { window.open(process.env.NEXT_PUBLIC_ENV_API + "ExportExcel/PT", '_blank') }
                    // command: () => { router.refresh() }
                },
                {
                    label: 'เครื่องหมายการค้า',
                    command: () => { window.open(process.env.NEXT_PUBLIC_ENV_API + "ExportExcel/TM", '_blank') }
                    // command: () => { router.refresh() }
                },
                {
                    label: 'สิ่งบ่งชี้ทางภูมิศาสตร์',
                    command: () => { window.open(process.env.NEXT_PUBLIC_ENV_API + "ExportExcel/GI", '_blank') }
                    // command: () => { router.refresh() }
                },
                {
                    label: 'แบบผังภูมิวงจรรวม',
                    command: () => { window.open(process.env.NEXT_PUBLIC_ENV_API + "ExportExcel/IC", '_blank') }
                    // command: () => { router.refresh() }
                },
                {
                    label: 'ความลับทางการค้า',
                    command: () => { fetch(process.env.NEXT_PUBLIC_ENV_API + "ExportExcel/TS") }
                    // command: () => { router.refresh() }
                },
            ]
        },
        {
            label: 'Contect',
        },
        {
            label: 'Law (UpdateData)',
            command: () => { router.refresh(), router.push('/Workspace/Law'), sessionStorage.setItem('WorkSpacePage', 'Law') },
        }
    ];

    const wizardItems = [
        { label: 'Personal', },//command: () => router.push('/uikit/menu') },
        { label: 'Seat', },//command: () => router.push('/uikit/menu/seat') },
        { label: 'Payment' },// command: () => router.push('/uikit/menu/payment') },
        {
            label: 'Confirmation',
            // command: () => router.push('/uikit/menu/confirmation')
        }
    ];

    const menubarEndTemplate = () => {
        return (
            <span className="p-input-icon-left">
                <Button icon="pi pi-user" rounded outlined severity="info" aria-label="User" onClick={(e) => { location.replace(process.env.NEXT_PUBLIC_ENV_URL + '/auth/login') }} />
            </span>
        );
    };
    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    const startText = () => {
        return (
            <a style={{ fontSize: 20 }} className='menu-top cursor-pointer' onClick={() => { router.push('/') }} >Intellectual Property</a>
            // <a style={{ fontSize: 20 }} className='menu-top cursor-pointer'>Intellectual Property</a>
        );
    }

    return (
        <div style={{ backgroundColor: 'black' }} className='menu-main'>
            <Menubar style={{ backgroundColor: '#0061FF', zIndex: 11, width: '100%', position: 'fixed', background: '#000000', color: '#FFFFFF', borderColor: '#FFFFFF', borderBottom: '7', borderLeft: '0px', borderRight: '0px', borderTop: '0px', borderRadius: '0' }}
                start={startText} model={nestedMenuitems} end={menubarEndTemplate}
            ></Menubar>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
