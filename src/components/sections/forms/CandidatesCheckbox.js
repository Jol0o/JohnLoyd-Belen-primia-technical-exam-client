'use client'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"
import React, { useEffect, useState } from 'react'
import { toast } from "sonner"

function CandidatesCheckbox({ id }) {
    const [candidates, setCandidates] = useState([])
    const [selected, setSelected] = useState([])

    let token
    if (typeof window !== 'undefined') {
        // Now we are in the client-side context
        token = localStorage.getItem('token');
        // rest of your code
    }

    useEffect(() => {
        const fetchCandidates = async () => {
            try {

                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await axios.get('http://localhost:8080/api/candidates/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const candidatesWithoutPosition = response.data.filter(candidate => !candidate.position_id);
                setCandidates(candidatesWithoutPosition);
            } catch (error) {
                console.error('Error fetching positions:', error);
            }
        };
        fetchCandidates();
    }, []);


    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            if (selected.length === 0) return


            if (!token) {
                throw new Error('No authentication token found');
            }

            selected.map(item => {
                axios.put(`http://localhost:8080/api/candidates/${item.id}`, {
                    name: item.name,
                    email: item.email,
                    position_id: id,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                    .then(response => {
                        toast("Successful", {
                            description: "Successfully submitted",
                        })
                    })
                    .catch(error => {
                        console.error(error);
                    });
            })

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        console.log(selected)
    }, [selected])

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="justify-start w-full p-0 px-2" variant="ghost">Add Candidate</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Select Candidates</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {candidates && candidates.map(item => (
                        <div className="flex items-center gap-4" key={item.id}>
                            <Checkbox
                                checked={selected.some((selectedItem) => selectedItem.id === item.id)}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        setSelected([...selected, item])
                                    } else {
                                        setSelected(selected.filter((selectedItem) => selectedItem.id !== item.id))
                                    }
                                }}
                            />
                            <Label className="text-sm font-normal text-nowrap">
                                {item.name}
                            </Label>
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit}>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CandidatesCheckbox