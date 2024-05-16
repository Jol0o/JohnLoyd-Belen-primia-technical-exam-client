'use client'
import React, { useState, useEffect } from "react";
import { useTable, useFilters } from 'react-table';
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import AddPositionForm from "../forms/AddPositionForm";
import CandidatesCheckbox from "../forms/CandidatesCheckbox";
import axios from "axios";
import EditPositionForm from "../forms/EditPositionForm";
import { toast } from "sonner";



export default function PositionTable() {
    const [positions, setPositions] = useState([]);
    const [filteredPositions, setFilteredPositions] = useState([]);
    const [filter, setFilter] = useState('');

    let token
    if (typeof window !== 'undefined') {
        // Now we are in the client-side context
        token = localStorage.getItem('token');
        // rest of your code
    }

    useEffect(() => {
        const fetchPositions = async () => {
            try {

                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await axios.get('http://localhost:8080/api/positions/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPositions(response.data);
                setFilteredPositions(response.data)
            } catch (error) {
                console.error('Error fetching positions:', error);
            }
        };

        fetchPositions();
    }, []);


    useEffect(() => {
        const filtered = positions.filter((position) =>
            position.title.toLowerCase().includes(filter.toLowerCase())
        );
        setFilteredPositions(filtered);
    }, [filter, positions]);

    const deletePosition = (id) => {
        if (!token) {
            throw new Error('No authentication token found');
        }
        console.log(id)
        try {
            axios.delete(`http://localhost:8080/api/positions/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(response => {
                    console.log(response.status);
                    toast("Successfull", {
                        description: "Position has been successfully deleted!",
                    })
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        } catch (error) {
            console.error('Error deleting position:', error);
            toast("Error", {
                description: error.message,
            })
        }
    }


    return (
        <div className="w-full">
            <div className="flex items-center justify-between py-4">
                <Input
                    placeholder="Filter Position Title..."
                    onChange={(event) => setFilter(event.target.value)}
                    className="max-w-sm"
                />
                <AddPositionForm />
            </div>
            <div className="border rounded-md">
                {filteredPositions && filteredPositions.length ? <Table>
                    <TableHeader>
                        <TableRow>
                            {Object.keys(filteredPositions[0]).map((key) => {
                                return <TableHead className="capitalize" key={key}>{key}</TableHead>;
                            })}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            filteredPositions.map(item =>
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.id}</TableCell>
                                    <TableCell className="capitalize">{item.title}</TableCell>
                                    <TableCell className="capitalize max-w-[300px] truncate text-nowrap">{item.description}</TableCell>
                                    <TableCell className="capitalize">{item.status}</TableCell>
                                    <TableCell className="capitalize max-w-[100px]">{item.candidates.map(item => item.name).join(', ')}</TableCell>
                                    <TableCell className="max-w-[30px]"> <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="w-8 h-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem
                                                onClick={() => navigator.clipboard.writeText(item.id)}
                                            >
                                                Copy Position ID
                                            </DropdownMenuItem>
                                            <div className="flex flex-col items-start">
                                                <CandidatesCheckbox id={item.id} />
                                                <EditPositionForm id={item.id} />
                                            </div>
                                            <DropdownMenuItem
                                                onClick={() => deletePosition(item.id)}
                                            >
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu></TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table> : <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell
                                colSpan={filteredPositions.length}
                                className="h-24 text-center"
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>}
            </div>
            <div className="flex items-center justify-end py-4 space-x-2">
                <div className="flex-1 text-sm text-muted-foreground">
                    {filteredPositions.length} of{" "}
                    {positions.length} row(s) selected.
                </div>
            </div>
        </div>
    )
}
