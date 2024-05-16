'use client'
import { Button } from "@/components/ui/button"
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
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"
import React, { useEffect, useState } from 'react'
import { toast } from "sonner"

function EditCandidateForm({ id }) {
    const [candidateForm, setCandidateForm] = useState({
        name: "",
        email: "",
        position_id: 0,
    })

    let token
    if (typeof window !== 'undefined') {
        // Now we are in the client-side context
        token = localStorage.getItem('token');
        // rest of your code
    }

    useEffect(() => {
        const fetchPositions = async () => {
            try {
                if (!id) return
                if (!token) {
                    throw new Error('No authentication token found');
                }
                const response = await axios.get(`http://localhost:8080/api/candidates/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCandidateForm({ name: response.data.name, email: response.data.email, position_id: response.data.position_id });
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching positions:', error);
            }
        };

        fetchPositions();
    }, []);

    const submit = (e) => {
        e.preventDefault()
        try {
            if (!candidateForm.name && !candidateForm.email) return

            if (!token) {
                throw new Error('No authentication token found');
            }
            axios.put(`http://localhost:8080/api/candidates/${id}`, {
                name: candidateForm.name,
                email: candidateForm.email,
                position_id: candidateForm.position_id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(response => {
                    toast("Successfull", {
                        description: "Candidate has been successfully updated!",
                    })
                })
                .catch(error => {
                    toast("Error", {
                        description: error.message,
                    })
                });
        } catch (e) {
            console.error(e);
            toast("Error", {
                description: e.message,
            })
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setCandidateForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }))
    }

    useEffect(() => {
        console.log(candidateForm)
    }, [candidateForm])
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="justify-start px-2" variant="ghost">Edit Candidate</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Candidate Info</DialogTitle>
                    <DialogDescription>
                        Update the candidate information for the selected candidate.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid items-center grid-cols-4 gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            onChange={handleChange}
                            value={candidateForm.name}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid items-center grid-cols-4 gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            onChange={handleChange}
                            name="email"
                            value={candidateForm.email}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" onClick={submit}>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditCandidateForm