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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"
import React, { useEffect, useState } from 'react'
import { toast } from "sonner"

function AddPositionForm() {
    const [positionForm, setPositionForm] = useState({
        title: "",
        description: ""
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

            if (!positionForm.title && !positionForm.description) return
            if (!token) {
                throw new Error('No authentication token found');
            }

            axios.post('http://localhost:8080/api/positions/', {
                title: positionForm.title,
                description: positionForm.description
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(response => {
                    toast("Successfull", {
                        description: "Position added succesfully !",
                    })
                })
                .catch(error => {
                    console.error(error);
                });
        } catch (e) {
            console.error(e);
            toast("Error Adding Postion", {
                description: e.message,
            })
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setPositionForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }))
    }

    useEffect(() => {
        console.log(positionForm)
    }, [positionForm])

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Add Position</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Open New Position</DialogTitle>
                    <DialogDescription>
                        Upload new hiring positions.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid items-center grid-cols-4 gap-4">
                        <Label htmlFor="Title" className="text-right">
                            Title
                        </Label>
                        <Input
                            id="Title"
                            name="title"
                            onChange={handleChange}
                            value={positionForm.title}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid items-center grid-cols-4 gap-4">
                        <Label htmlFor="Description" className="text-right">
                            Description
                        </Label>
                        {/* <Input
                            id="Description"
                            onChange={handleChange}
                            name="description"
                            value={positionForm.description}
                            className="col-span-3"
                        /> */}
                        <Textarea id="Description"
                            onChange={handleChange}
                            name="description"
                            value={positionForm.description}
                            className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" onClick={submit}>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddPositionForm