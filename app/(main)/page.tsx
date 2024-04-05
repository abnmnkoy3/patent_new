/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
// import { Menu } from 'primereact/menu';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ProductService } from '../../demo/service/ProductService';
import { LayoutContext } from '../../layout/context/layoutcontext';
import Link from 'next/link';
// import { Demo } from '../../types/types';
import { ChartData, ChartOptions } from 'chart.js';

const Dashboard = () => {
  return (
    <div
      id="hero"
      className="flex flex-column pt-4 px-4 lg:px-8 overflow-hidden fadein animation-duration-1000"
      style={{
        background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #EEEFAF 0%, #C3E3FA 100%)',
        clipPath: 'ellipse(150% 87% at 93% 13%)'
      }}
    >
      <div className="mx-4 md:mx-8 mt-0 md:mt-4">
        <h1 className="text-6xl font-bold text-gray-900 line-height-2">
          <span className="font-light block">Eu sem integer</span>eget magna fermentum
        </h1>
        <p className="font-normal text-2xl line-height-3 md:mt-3 text-gray-700">Sed blandit libero volutpat sed cras. Fames ac turpis egestas integer. Placerat in egestas erat... </p>
        <Button type="button" label="Get Started" rounded className="text-xl border-none mt-3 bg-blue-500 font-normal line-height-3 px-3 text-white"></Button>
      </div>
      <div className="flex justify-content-center md:justify-content-end">
        <img src="/demo/images/landing/screen-1.png" alt="Hero Image" className="w-9 md:w-auto" />
      </div>
    </div>
  );
};

export default Dashboard;
