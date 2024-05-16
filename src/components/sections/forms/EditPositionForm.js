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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

function EditPositionForm({ id }) {
    const [positionForm, setPositionForm] = useState({
        title: "",
        description: "",
        status: ""
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
                const response = await axios.get(`http://localhost:8080/api/positions/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPositionForm({ title: response.data.title, description: response.data.description, status: response.data.status });
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
            if (!positionForm.title && !positionForm.description) return


            if (!token) {
                throw new Error('No authentication token found');
            }
            axios.put(`http://localhost:8080/api/positions/${id}`, {
                title: positionForm.title,
                description: positionForm.description,
                status: positionForm.status
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(response => {
                    toast("Successfull", {
                        description: "Position has been successfully updated!",
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
                <Button className="justify-start w-full p-0 px-2" variant="ghost">Edit Position</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Position</DialogTitle>
                    <DialogDescription>
                        Update the position details in the position form below.
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
                    <div className="grid items-center grid-cols-4 gap-4">
                        <Label htmlFor="Description" className="text-right">
                            Hiring
                        </Label>
                        <Checkbox
                            checked={positionForm.status === "open"}
                            onCheckedChange={(checked) => {
                                setPositionForm((prevForm) => ({
                                    ...prevForm,
                                    status: checked ? "open" : "closed",
                                }))
                            }}
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

export default EditPositionForm