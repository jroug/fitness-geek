'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Loading from '@/components/Loading';

const BodyCompositionPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const [startDate, setStartDate] = useState<string>(() => '2024-04-01');

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

    const formatNumber = (value: number | string | null | undefined, digits = 1) => {
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

    return (
        <div className="mx-auto w-full max-w-[2000px] px-4 pb-24 md:px-8" id="bodyfat-page">
            <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-sky-900 to-cyan-700 p-6 text-white shadow-xl md:p-8">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Chart</p>
                <h1 className="mt-2 text-2xl font-bold md:text-3xl">Body Composition History</h1>
                <p className="mt-2 text-sm text-cyan-100">Review your body composition trends and compare key measurements over time.</p>
            </section>
            <div className="mt-6 rounded-2xl bg-white p-4 md:p-7">
                <div className="flex flex-col gap-4 md:flex-row md:items-end w-full max-w-[700px]">
                    <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="flex flex-col">
                            <label className="mb-1 text-sm font-semibold text-slate-700">Start date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                                max={endDate}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 text-sm font-semibold text-slate-700">End date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                                min={startDate}
                            />
                        </div>
                    </div>

                    <button
                        type="button"
                        className="translate-y-[-4px] inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 md:w-auto"
                        onClick={() => {
                            if (!startDate || !endDate) return;
                            if (startDate > endDate) return;
                            fetchData();
                        }}
                    >
                        Apply
                    </button>
                </div>
        
                {sortedRows.length === 0 ? (
                    <p className="mt-[40px] text-sm text-slate-600">No records found for this period.</p>
                ) : (
                    <div className="mt-[40px] overflow-x-auto">
                        <table className="bodyfat-table min-w-[1200px] w-full border-collapse">
                            <thead>
                                <tr>
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
                )}
            </div>
        </div>
    );
};

export default BodyCompositionPage;
