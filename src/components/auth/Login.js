'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import axios from 'axios'
import { useRouter } from 'next/navigation'

function Login() {
    const [userForm, setUserForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [registerError, setRegisterError] = useState('')
    const router = useRouter()

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }))
    }

    const login = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                email: userForm.email,
                password: userForm.password,
            })
            localStorage.setItem('token', response.data.token)
            router.push('/dashboard')
            setError("")
        } catch (error) {
            console.error('Login failed:', error.response.data.message)
            setError(error.response.data.message)
        }
    }

    const register = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/auth/register', {
                email: userForm.email,
                password: userForm.password,
            })
            localStorage.setItem('token', response.data.token)
            router.push('/dashboard')
            setRegisterError("")
        } catch (error) {
            console.error('Login failed:', error)
            setRegisterError(error.response.data.message)
        }
    }

    const handleLogout = () => {
        // Perform logout actions
        localStorage.removeItem('token');
        router.push('/logout'); // Redirect to logout page
    };

    return (
        <div className="flex items-center justify-center w-full min-h-screen">
            <Tabs defaultValue="account" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="account">Admin</TabsTrigger>
                    <TabsTrigger value="password">Employee</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                    <Card>
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                            <CardDescription>
                                Enter your admin credentials
                            </CardDescription>
                            {error && <p className="text-sm font-medium text-red-500 capitalize">
                                {error}
                            </p>}
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input type="email" required id="email" value={userForm.email} onChange={handleChange} name="email" placeholder="a@gmail.com" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password">Password</Label>
                                <Input type="password" required id="password" value={userForm.password} onChange={handleChange} name="password" placeholder="password" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={login}>Login</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="password">
                    <Card>
                        <CardHeader>
                            <CardTitle>Register</CardTitle>
                            {registerError && <p className="text-sm font-medium text-red-500 capitalize">
                                {registerError}
                            </p>}
                            <CardDescription>
                                Enter your user credentials
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input type="email" required id="email" value={userForm.email} onChange={handleChange} name="email" placeholder="a@gmail.com" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password">Password</Label>
                                <Input type="password" required id="password" value={userForm.password} onChange={handleChange} name="password" placeholder="password" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={register}>Register</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Login
