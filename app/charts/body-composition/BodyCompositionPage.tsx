'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Loading from '@/components/Loader';

const BodyCompositionPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const [startDate, setStartDate] = useState<string>(() => {
        const today = new Date();
        return `2024-04-01`;
    });

    const [endDate, setEndDate] = useState<string>(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    });

    const [rows, setRows] = useState<UserBodyfatData[]>([]);

    const fetchUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/get-bodyfat-data?startDate=${startDate}&endDate=${endDate}`;

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await fetch(fetchUrl, { method: 'GET', credentials: 'include' });
            if (!res.ok) {
                setHasError(true);
                setIsLoading(false);
                return;
            }

            const data: UserBodyfatData[] = await res.json();
            setRows(data);
            setHasError(false);
        } catch {
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    }, [fetchUrl]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (isLoading || hasError) {
        return <Loading />;
    }

    const sortedRows = [...rows].sort((a, b) => a.measurement_date.localeCompare(b.measurement_date));

    const formatDateShort = (value: string) => {
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return value;
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = String(d.getFullYear()).slice(-2);
        return `${day}/${month}/${year}`;
    };

    const formatNumber = (value: number | string | null | undefined, digits = 2) => {
        if (value === null || value === undefined) return '';
        const num = typeof value === 'number' ? value : parseFloat(value);
        if (Number.isNaN(num)) return '';
        return num.toFixed(digits);
    };

    const deltaValue = (index: number, field: keyof UserBodyfatData) => {
        if (index === 0) return '';
        const current = sortedRows[index][field];
        const prev = sortedRows[index - 1][field];
        if (current === null || current === undefined || prev === null || prev === undefined) return '';
        return formatNumber(Number(current) - Number(prev));
    };

    if (sortedRows.length === 0) {
        return (
            <div className="verify-email pb-20" id="bodyfat-page">
                <div className="container mx-auto">
                    <div className="about-us-section-wrap">
                        <h1 className="mx-8 mt-16">Body Composition</h1>
                        <div className="mx-8 mt-10">No records found.</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="verify-email pb-20" id="bodyfat-page">
            <div className="container mx-auto">
                <div className="about-us-section-wrap">

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 chart-dates-filter-wrap flex items-center mt-[30px] mx-auto">
                        <div className="flex flex-col">
                            <label className="text-sm mb-1">Start date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="border rounded px-3 py-2"
                                max={endDate}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm mb-1">End date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="border rounded px-3 py-2"
                                min={startDate}
                            />
                        </div>

                        <div className="flex flex-col">
                            <button
                                type="button"
                                className="green-btn mt-[25px] dateApplyBtn"
                                onClick={() => {
                                    if (!startDate || !endDate) return;
                                    if (startDate > endDate) return;
                                    fetchData();
                                }}
                            >
                                Apply
                            </button>
                        </div>
                    </div>

                    <div className="mx-8 mt-10 overflow-x-auto">
                        <table className="bodyfat-table min-w-[1200px] w-full border-collapse">
                            <thead>
                                <tr className="">
                                    <th className="border px-2 py-2 text-left">Ημερομηνία</th>
                                    {sortedRows.map((row) => (
                                        <th key={row.id} className="border px-2 py-2 text-center">
                                            {formatDateShort(row.measurement_date)}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bf-row-weight">
                                    <th className="border px-2 py-2 text-left">Βάρος (Kg)</th>
                                    {sortedRows.map((row) => (
                                        <td key={row.id} className="border px-2 py-2 text-center">{formatNumber(row.weight_kg)}</td>
                                    ))}
                                </tr>
                                <tr className="bf-row-bmi">
                                    <th className="border px-2 py-2 text-left">ΔΜΣ (Kg/m2)</th>
                                    {sortedRows.map((row) => (
                                        <td key={row.id} className="border px-2 py-2 text-center">{formatNumber(row.bmi)}</td>
                                    ))}
                                </tr>
                                <tr className="bf-row-fat-percent">
                                    <th className="border px-2 py-2 text-left">Λίπος (%)</th>
                                    {sortedRows.map((row) => (
                                        <td key={row.id} className="border px-2 py-2 text-center">{formatNumber(row.body_fat_percent)}</td>
                                    ))}
                                </tr>
                                <tr className="bf-row-fat-kg">
                                    <th className="border px-2 py-2 text-left">Λίπος (Kg)</th>
                                    {sortedRows.map((row) => (
                                        <td key={row.id} className="border px-2 py-2 text-center">{formatNumber(row.body_fat_kg)}</td>
                                    ))}
                                </tr>
                                <tr className="bf-row-lean">
                                    <th className="border px-2 py-2 text-left">Άλιπη μάζα σώματος (Kg)</th>
                                    {sortedRows.map((row) => (
                                        <td key={row.id} className="border px-2 py-2 text-center">{formatNumber(row.lean_body_mass_kg)}</td>
                                    ))}
                                </tr>
                                <tr className="bf-row-muscle">
                                    <th className="border px-2 py-2 text-left">Μυϊκός ιστός (Kg)</th>
                                    {sortedRows.map((row) => (
                                        <td key={row.id} className="border px-2 py-2 text-center">{formatNumber(row.muscle_mass_kg)}</td>
                                    ))}
                                </tr>
                                <tr className="bf-row-water">
                                    <th className="border px-2 py-2 text-left">Συνολικό Νερό (%)</th>
                                    {sortedRows.map((row) => (
                                        <td key={row.id} className="border px-2 py-2 text-center">{formatNumber(row.total_body_water_percent)}</td>
                                    ))}
                                </tr>
                                <tr className="bf-row-waist">
                                    <th className="border px-2 py-2 text-left">Περίμετρος μέσης (cm)</th>
                                    {sortedRows.map((row) => (
                                        <td key={row.id} className="border px-2 py-2 text-center">{formatNumber(row.waist_circumference_cm)}</td>
                                    ))}
                                </tr>
                                <tr className="bf-row-visceral">
                                    <th className="border px-2 py-2 text-left">Σπλαχνικό λίπος</th>
                                    {sortedRows.map((row) => (
                                        <td key={row.id} className="border px-2 py-2 text-center">{formatNumber(row.visceral_fat)}</td>
                                    ))}
                                </tr>
                                <tr className="bf-row-spacer">
                                    <th className="border px-2 py-2 text-left"> </th>
                                    {sortedRows.map((row) => (
                                        <td key={row.id} className="border px-2 py-2 text-center"></td>
                                    ))}
                                </tr>
                                <tr className="bf-row-weight-change">
                                    <th className="border px-2 py-2 text-left">Μεταβολή Βάρους (Kg)</th>
                                    {sortedRows.map((row, idx) => (
                                        <td key={row.id} className="border px-2 py-2 text-center">{deltaValue(idx, 'weight_kg')}</td>
                                    ))}
                                </tr>
                                <tr className="bf-row-fatpct-change">
                                    <th className="border px-2 py-2 text-left">Μεταβολή Λίπους (%)</th>
                                    {sortedRows.map((row, idx) => (
                                        <td key={row.id} className="border px-2 py-2 text-center">{deltaValue(idx, 'body_fat_percent')}</td>
                                    ))}
                                </tr>
                                <tr className="bf-row-fatkg-change">
                                    <th className="border px-2 py-2 text-left">Μεταβολή Λίπους (kg)</th>
                                    {sortedRows.map((row, idx) => (
                                        <td key={row.id} className="border px-2 py-2 text-center">{deltaValue(idx, 'body_fat_kg')}</td>
                                    ))}
                                </tr>
                                <tr className="bf-row-muscle-change">
                                    <th className="border px-2 py-2 text-left">Μεταβολή Μυϊκού ιστού (Kg)</th>
                                    {sortedRows.map((row, idx) => (
                                        <td key={row.id} className="border px-2 py-2 text-center">{deltaValue(idx, 'muscle_mass_kg')}</td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BodyCompositionPage;
