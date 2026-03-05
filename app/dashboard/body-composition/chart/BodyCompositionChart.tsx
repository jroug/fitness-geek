'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import Loading from '@/components/Loading';
import { bodyCompositionSWRFetcher, bodyCompositionSWRKey } from '@/lib/bodyCompositionSWR';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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

type BodyMetricConfig = {
    label: string;
    field: BodyMetricField;
    color: string;
};

const METRICS: BodyMetricConfig[] = [
    { label: 'Βάρος (Kg)', field: 'weight_kg', color: '#14532d' },
    { label: 'ΔΜΣ (Kg/m2)', field: 'bmi', color: '#0f172a' },
    { label: 'Λίπος (%)', field: 'body_fat_percent', color: '#c2410c' },
    { label: 'Λίπος (Kg)', field: 'body_fat_kg', color: '#a16207' },
    { label: 'Άλιπη μάζα σώματος (Kg)', field: 'lean_body_mass_kg', color: '#3730a3' },
    { label: 'Μυϊκός ιστός (Kg)', field: 'muscle_mass_kg', color: '#b91c1c' },
    { label: 'Συνολικό Νερό (%)', field: 'total_body_water_percent', color: '#0c4a6e' },
    { label: 'Περίμετρος μέσης (cm)', field: 'waist_circumference_cm', color: '#6d28d9' },
    { label: 'Σπλαχνικό λίπος', field: 'visceral_fat', color: '#be123c' }
];

const BodyCompositionChart: React.FC = () => {
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
    const swrKey = bodyCompositionSWRKey(appliedStartDate, appliedEndDate);
    const { data: rows = [], error, isLoading } = useSWR<UserBodyfatData[]>(swrKey, bodyCompositionSWRFetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: false
    });

    const formatDateShort = (value: string) => {
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return value;
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = String(d.getFullYear()).slice(-2);
        return `${day}/${month}/${year}`;
    };

    const chartData = useMemo(() => {
        return {
            labels: rows.map((row) => formatDateShort(row.measurement_date)),
            datasets: METRICS.map((metric) => ({
                label: metric.label,
                data: rows.map((row) => row[metric.field] as number | null),
                borderColor: metric.color,
                backgroundColor: metric.color,
                spanGaps: true,
                tension: 0.35,
                pointRadius: 3,
                pointHoverRadius: 5,
                borderWidth: 2
            }))
        };
    }, [rows]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index' as const,
            intersect: false
        },
        plugins: {
            legend: {
                position: 'top' as const
            },
            title: {
                display: false,
                text: ''
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                ticks: {
                    precision: 1
                }
            }
        }
    };

    if (isLoading || error) {
        return <Loading />;
    }

    return (
        <div className="mx-auto w-full max-w-[2000px] px-4 pb-24 md:px-8" id="bodyfat-page">
            <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-sky-900 to-cyan-700 p-6 text-white shadow-xl md:p-8">
                <div className="mt-3 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Chart</p>
                        <h1 className="mt-2 text-2xl font-bold md:text-3xl">Body Composition History</h1>
                        <p className="mt-2 text-sm text-cyan-100">Review your body composition trends over time.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/dashboard/body-composition/add-new"
                            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-cyan-100"
                        >
                            Add Measurement
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
                    <div className="mt-[40px] h-[640px] rounded-2xl border border-slate-200 bg-white p-3 md:p-5">
                        <Line options={chartOptions} data={chartData} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default BodyCompositionChart;
