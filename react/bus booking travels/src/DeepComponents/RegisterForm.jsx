import React, { useState } from 'react'
import axios from 'axios'

const RegisterForm = () => {
    const [form, setForm] = useState({
        username: '', email: '', password: ''
    })
    const [touched, setTouched] = useState({})
    const [errors, setErrors] = useState({})
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // Simple validation function
    const validate = () => {
        const newErrors = {}

        if (!form.username.trim()) {
            newErrors.username = 'Please enter username'
        }
        if (!form.email.trim()) {
            newErrors.email = 'Please enter email'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = 'Email is invalid'
        }
        if (!form.password) {
            newErrors.password = 'Please enter password'
        } else if (
            !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(form.password)
        ) {
            newErrors.password =
                'Password must be 8+ chars, with uppercase, lowercase, number & special char'
        }
        return newErrors
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })

        // Optional: validate on change for that field if touched
        if (touched[e.target.name]) {
            setErrors(validate())
        }
    }

    const handleBlur = (e) => {
        setTouched({ ...touched, [e.target.name]: true })
        setErrors(validate())
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Mark all fields as touched on submit to show all errors
        setTouched({
            username: true,
            email: true,
            password: true,
        })

        const validationErrors = validate()
        setErrors(validationErrors)
        if (Object.keys(validationErrors).length > 0) {
            return
        }

        setIsLoading(true)
        try {
            await axios.post('http://localhost:8000/api/register/', form)
            setMessage('Registration successful! You can now login.')
            setForm({ username: '', email: '', password: '' })
            setTouched({})
            setErrors({})
        } catch (error) {
            setMessage(
                'Registration failed: ' +
                    (error.response?.data?.username ||
                        error.response?.data?.email ||
                        error.message)
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create a new account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                className={`mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                                    errors.username && touched.username
                                        ? 'border-red-500'
                                        : 'border-gray-300'
                                }`}
                                value={form.username}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {errors.username && touched.username && (
                                <p className="text-red-600 text-sm mt-1">{errors.username}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className={`mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                                    errors.email && touched.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                                value={form.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {errors.email && touched.email && (
                                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                className={`mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                                    errors.password && touched.password ? 'border-red-500' : 'border-gray-300'
                                }`}
                                value={form.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {errors.password && touched.password && (
                                <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>
                    </div>

                    {message && (
                        <div
                            className={`rounded-md p-4 ${
                                message.includes('successful') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                            }`}
                        >
                            <p className="text-sm">{message}</p>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Registering...
                                </>
                            ) : (
                                'Register'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterForm
