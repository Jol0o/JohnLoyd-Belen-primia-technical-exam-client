// Dashboard.js
'use client'
import React, { useState } from 'react';
import PositionTable from '@/components/sections/tables/PositionTable';
import Header from '@/components/sections/Header';
import CandidatesTable from '@/components/sections/tables/CandidatesTable';

export default function Page() {
    const [table, setTable] = useState("position")

    return (
        <>
            <Header tabs setTable={setTable} />
            <div className="w-full max-w-[1300px] m-auto">
                <div className="p-3">
                    {
                        table === "position" ? <PositionTable /> :
                            <CandidatesTable />
                    }
                </div>
            </div>
        </>
    );
}