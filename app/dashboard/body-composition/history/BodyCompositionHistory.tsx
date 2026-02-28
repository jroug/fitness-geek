'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import useSWR, { mutate } from 'swr';
import Loading from '@/components/Loading';
import { bodyCompositionSWRCacheKeyPrefix } from '@/lib/bodyCompositionSWR';
import { bodyCompositionSWRFetcher, bodyCompositionSWRKey } from '@/lib/bodyCompositionSWR';

type BodyMetricField =
    | 'weight_kg'
    | 'bmi'
    | 'body_fat_percent'
    | 'body_fat_kg'
    | 'lean_body_mass_kg'
    | 'muscle_mass_kg'
    | 'total_body_water_percent'
    | 'waist_circumference_cm'
    | 'visceral_fat';

type ValueRowConfig = {
    kind: 'value' | 'delta';
    className: string;
    label: string;
    field: BodyMetricField;
};

type CaptionRowConfig = {
    kind: 'caption';
    className: string;
    label: string;
};

type TableRowConfig = ValueRowConfig | CaptionRowConfig;

const BodyCompositionHistory: React.FC = () => {
    const [startDate, setStartDate] = useState<string>(() => '2024-04-01');

    const [endDate, setEndDate] = useState<string>(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    });

    const [appliedStartDate, setAppliedStartDate] = useState<string>(startDate);
    const [appliedEndDate, setAppliedEndDate] = useState<string>(endDate);
    const [deletingRecordId, setDeletingRecordId] = useState<string | number | null>(null);
    const swrKey = bodyCompositionSWRKey(appliedStartDate, appliedEndDate);
    const { data: rows = [], error, isLoading } = useSWR<UserBodyfatData[]>(swrKey, bodyCompositionSWRFetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: false
    });

    if (isLoading || error) {
        return <Loading />;
    }

    const formatDateShort = (value: string) => {
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return value;
        const day = String(d.getDate()).padStart(2, '0');
        const month = d.toLocaleString('en-US', { month: 'short' });
        const year = String(d.getFullYear()).slice(-2);
        return `${day} ${month} ${year}`;
    };

    const formatNumber = (value: number | string | null | undefined, digits = 1) => {
        if (value === null || value === undefined) return '';
        const num = typeof value === 'number' ? value : parseFloat(value);
        if (Number.isNaN(num)) return '';
        return num.toFixed(digits);
    };

    const deltaValue = (index: number, field: BodyMetricField) => {
        if (index === 0) return '';
        const current = rows[index][field];
        const prev = rows[index - 1][field];
        if (current === null || current === undefined || prev === null || prev === undefined) return '';
        return formatNumber(Number(current) - Number(prev));
    };

    const tableRows: TableRowConfig[] = [
        { kind: 'value', className: 'bf-row-weight', label: 'Βάρος (Kg)', field: 'weight_kg' },
        { kind: 'value', className: 'bf-row-bmi', label: 'ΔΜΣ (Kg/m2)', field: 'bmi' },
        { kind: 'value', className: 'bf-row-fat-percent', label: 'Λίπος (%)', field: 'body_fat_percent' },
        { kind: 'value', className: 'bf-row-fat-kg', label: 'Λίπος (Kg)', field: 'body_fat_kg' },
        { kind: 'value', className: 'bf-row-lean', label: 'Άλιπη μάζα σώματος (Kg)', field: 'lean_body_mass_kg' },
        { kind: 'value', className: 'bf-row-muscle', label: 'Μυϊκός ιστός (Kg)', field: 'muscle_mass_kg' },
        { kind: 'value', className: 'bf-row-water', label: 'Συνολικό Νερό (%)', field: 'total_body_water_percent' },
        { kind: 'value', className: 'bf-row-waist', label: 'Περίμετρος μέσης (cm)', field: 'waist_circumference_cm' },
        { kind: 'value', className: 'bf-row-visceral', label: 'Σπλαχνικό λίπος', field: 'visceral_fat' },
        { kind: 'caption', className: 'bf-row-delta-caption', label: 'Μεταβολες' },
        { kind: 'delta', className: 'bf-row-weight-change', label: 'Μεταβολή Βάρους (Kg)', field: 'weight_kg' },
        { kind: 'delta', className: 'bf-row-fatpct-change', label: 'Μεταβολή Λίπους (%)', field: 'body_fat_percent' },
        { kind: 'delta', className: 'bf-row-fatkg-change', label: 'Μεταβολή Λίπους (kg)', field: 'body_fat_kg' },
        { kind: 'delta', className: 'bf-row-muscle-change', label: 'Μεταβολή Μυϊκού ιστού (Kg)', field: 'muscle_mass_kg' },
        { kind: 'delta', className: 'bf-row-water-change', label: 'Μεταβολή Νερου (%)', field: 'total_body_water_percent' },
        { kind: 'delta', className: 'bf-row-waist-change', label: 'Μεταβολή Περίμετρος μέσης (cm)', field: 'waist_circumference_cm' },
        { kind: 'delta', className: 'bf-row-visceral-change', label: 'Μεταβολή Σπλαχνικού λίπους', field: 'visceral_fat' }
    ];

    const handleDeleteRecord = async (recordId: string | number) => {
        const confirmed = window.confirm('Delete this body composition record?');
        if (!confirmed) return;

        setDeletingRecordId(recordId);
        try {
            const response = await fetch('/api/delete-body-composition', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: recordId,
                    action: 'delete_bodycomposition'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to delete record');
            }

            await mutate(
                (key) => typeof key === 'string' && key.startsWith(bodyCompositionSWRCacheKeyPrefix),
                undefined,
                { revalidate: true }
            );
        } catch {
            window.alert('Could not delete this record. Please try again.');
        } finally {
            setDeletingRecordId(null);
        }
    };

    const renderDateHeaders = () => {
        const headers: React.ReactNode[] = [];
        for (const row of rows) {
            const rowId = row.id;
            const isDeleting = deletingRecordId === rowId;
            headers.push(
                <th key={row.id} className="border px-2 py-2 text-center">
                    <div className="flex min-w-[90px] items-center justify-center gap-2">
                        <span>{formatDateShort(row.measurement_date)}</span>
                        <button
                            type="button"
                            className="inline-flex h-6 w-6 items-center justify-center rounded-sm transition hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40"
                            disabled={isDeleting}
                            onClick={() => handleDeleteRecord(rowId)}
                            aria-label="Delete record"
                            title="Delete record"
                        >
                            <img
                                src="/svg/trashbin.svg"
                                alt=""
                                className={`h-4 w-4 ${isDeleting ? 'opacity-60' : ''}`}
                            />
                        </button>
                    </div>
                </th>
            );
        }
        return headers;
    };

    const renderMetricCells = (config: ValueRowConfig) => {
        const cells: React.ReactNode[] = [];
        for (let idx = 0; idx < rows.length; idx += 1) {
            const row = rows[idx];
            const value = config.kind === 'delta' ? deltaValue(idx, config.field) : formatNumber(row[config.field]);
            cells.push(
                <td key={`${row.id}-${config.className}`} className="border px-2 py-2 text-center">
                    {value}
                </td>
            );
        }
        return cells;
    };

    return (
        <div className="mx-auto w-full max-w-[2200px] px-4 pb-24 md:px-8" id="bodyfat-page">
            <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-sky-900 to-cyan-700 p-6 text-white shadow-xl md:p-8">
                <div className="mt-3 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Data</p>
                        <h1 className="mt-2 text-2xl font-bold md:text-3xl">Body Composition History</h1>
                        <p className="mt-2 text-sm text-cyan-100">Review your body composition trends and compare key measurements over time.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/dashboard/body-composition/add-new"
                            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-cyan-100"
                        >
                            Add New BC
                        </Link>

                    </div>
                </div>
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
                            setAppliedStartDate(startDate);
                            setAppliedEndDate(endDate);
                        }}
                    >
                        Apply
                    </button>
                </div>
        
                {rows.length === 0 ? (
                    <p className="mt-[40px] text-sm text-slate-600">No records found for this period.</p>
                ) : (
                    <div className="mt-[40px] overflow-x-auto">
                        <table className="bodyfat-table min-w-[1200px] w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="border px-2 py-2 text-left">Ημερομηνία</th>
                                    {renderDateHeaders()}
                                </tr>
                            </thead>
                            <tbody>
                                {tableRows.map((config) => {
                                    if (config.kind === 'caption') {
                                        return (
                                            <tr key={config.className} className={config.className}>
                                                <th colSpan={rows.length + 1} className="border px-3 py-2 text-left">
                                                    {config.label}
                                                </th>
                                            </tr>
                                        );
                                    }

                                    return (
                                        <tr key={config.className} className={config.className}>
                                            <th className="border px-2 py-2 text-left">{config.label}</th>
                                            {renderMetricCells(config)}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BodyCompositionHistory;
