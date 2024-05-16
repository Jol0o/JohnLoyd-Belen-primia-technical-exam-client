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

function CandidateForm() {
    const [candidateForm, setCandidateForm] = useState({
        name: "",
        email: ""
    })

    let token
    if (typeof window !== 'undefined') {
        // Now we are in the client-side context
        token = localStorage.getItem('token');
        // rest of your code
    }

    const submit = (e) => {
        e.preventDefault()

        try {
            if (!candidateForm.name && !candidateForm.email) return
            if (!token) {
                throw new Error('No authentication token found');
            }

            axios.post('http://localhost:8080/api/candidates/', {
                name: candidateForm.name,
                email: candidateForm.email
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(response => {
                    setCandidateForm({ name: "", email: "" })
                    toast("Successful", {
                        description: "Successfully submitted",
                    })
                })
                .catch(error => {
                    console.error(error);
                });
        } catch (e) {
            console.error(e);
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
                <Button variant="outline">Add Candidate</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Candidate</DialogTitle>
                    <DialogDescription>
                        Create a new candidate by filling out the form below.
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

export default CandidateForm