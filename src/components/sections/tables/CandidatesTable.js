'use client'
import React, { useState, useEffect } from "react";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import AddPositionForm from "../forms/AddPositionForm";
import AddCandidateForm from "../forms/CandidatesCheckbox";
import axios from "axios";
import CandidateForm from "../forms/CandidateForm";
import { toast } from "sonner"
import EditCandidateForm from "../forms/EditCandidateForm";

function CandidatesTable() {
    const [candidate, setCandidate] = useState([]);
    const [filteredCandidate, setFilteredCandidate] = useState([]);
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

                const response = await axios.get('http://localhost:8080/api/candidates/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCandidate(response.data);
                console.log(response.data);
                setFilteredCandidate(response.data)
            } catch (error) {
                console.error('Error fetching positions:', error);
            }
        };

        fetchPositions();
    }, []);


    useEffect(() => {
        const filtered = candidate.filter((item) =>
            item.name.toLowerCase().includes(filter.toLowerCase()) ||
            item.email.toLowerCase().includes(filter.toLowerCase())
        );
        setFilteredCandidate(filtered);
    }, [filter, candidate]);

    const deleteCandidate = (id) => {
        if (!token) {
            throw new Error('No authentication token found');
        }
        console.log(id)
        axios.delete(`http://localhost:8080/api/candidates/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                console.log(response.status);
            })
            .catch(error => {
                console.error('Error deleting position:', error);
            });
    }

    const registerUser = async (item) => {
        try {
            if (!item) return;
            const response = await axios.post('http://localhost:8080/api/auth/register', {
                email: item.email,
                password: "12345678",
            })
            toast("Successfull", {
                description: "User has been registered successfully!",
            })
        } catch (error) {
            console.error('Login failed:', error)
            toast("Error", {
                description: error.response.data.message,
            })
        }
    }


    return (
        <div className="w-full">
            <div className="flex items-center justify-between py-4">
                <Input
                    placeholder="Filter Candidate Name..."
                    onChange={(event) => setFilter(event.target.value)}
                    className="max-w-sm"
                />
                <CandidateForm />
            </div>
            <div className="border rounded-md">
                {filteredCandidate && filteredCandidate.length ? <Table>
                    <TableHeader>
                        <TableRow>
                            {Object.keys(filteredCandidate[0]).map((key) => {
                                return <TableHead className="capitalize" key={key}>{key}</TableHead>;
                            })}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            filteredCandidate.map(item =>
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.id}</TableCell>
                                    <TableCell className="capitalize">{item.name}</TableCell>
                                    <TableCell className="capitalize max-w-[300px] truncate text-nowrap">{item.email}</TableCell>
                                    <TableCell className="capitalize">{item.position_id}</TableCell>
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
                                                Copy Candidate ID
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => registerUser(item)}
                                            >
                                                Hire
                                            </DropdownMenuItem>

                                            <EditCandidateForm id={item.id} />

                                            <DropdownMenuItem
                                                onClick={() => deleteCandidate(item.id)}
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
                                colSpan={candidate.length}
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
                    {filteredCandidate.length} of{" "}
                    {candidate.length} row(s) selected.
                </div>
            </div>
        </div>
    )
}

export default CandidatesTable