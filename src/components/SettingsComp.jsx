'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const formSchema = z.object({
    firstName: z.string().min(2, { message: 'firstNameMinLength' }),
    lastName: z.string().min(2, { message: 'lastNameMinLength' }),
    email: z.string().email({ message: 'validEmail' }),
    phone: z.string().min(10, { message: 'validPhone' }),
    currentPassword: z.string().optional(),
    newPassword: z.string().min(6, { message: 'passwordMinLength' }).optional(),
    confirmPassword: z.string().optional(),
}).refine((data) => {
    if (data.newPassword && data.confirmPassword) {
        return data.newPassword === data.confirmPassword
    }
    return true
}, { message: 'passwordsDoNotMatch', path: ['confirmPassword'] })

function InputField({ label, id, register, type = 'text', error }) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm text-gray-700 mb-1">
                {label}
            </label>
            <input
                {...register}
                id={id}
                type={type}
                className="!w-full !h-9 !px-1 !border !border-gray-300 !rounded-md !text-sm !focus:outline-none !focus:ring-1 !focus:ring-[#790000] !focus:border-[#790000]"
            />
            {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
        </div>
    )
}

function PasswordField({ label, id, register, isPasswordVisible, toggleVisibility, error }) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm text-gray-700 mb-1">
                {label}
            </label>
            <div className="relative justify-end">
                <input
                    {...register}
                    id={id}
                    type={isPasswordVisible ? 'text' : 'password'}
                    className="!w-full h-9 px-3 pr-10 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#790000] focus:border-[#790000]"
                />
                <button
                    type="button"
                    onClick={toggleVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            </div>
            {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
        </div>
    )
}

export default function SettingsForm({ initialData, onSubmit }) {
    const [passwordVisibility, setPasswordVisibility] = useState({
        current: false,
        new: false,
        confirm: false,
    })

    const { t } = useTranslation()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: initialData?.firstName || '',
            lastName: initialData?.lastName || '',
            email: initialData?.email || '',
            phone: initialData?.phone || '',
        },
    })

    const handlePasswordVisibilityToggle = (field) => {
        setPasswordVisibility((prev) => ({
            ...prev,
            [field]: !prev[field],
        }))
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto space-y-6 px-4 sm:px-6">
                {/* User Information Section */}
                <div className="bg-white shadow-sm rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">{t('userInformation')}</h2>
                        <p className="mt-1 text-sm text-gray-500">{t('updatePersonalInfo')}</p>
                    </div>
                    <div className="p-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <InputField
                                    label={t('firstName')}
                                    id="firstName"
                                    register={register('firstName')}
                                    error={errors.firstName}
                                />
                                <InputField
                                    label={t('lastName')}
                                    id="lastName"
                                    register={register('lastName')}
                                    error={errors.lastName}
                                />
                            </div>
                            <InputField
                                label={t('email')}
                                id="email"
                                register={register('email')}
                                type="email"
                                error={errors.email}
                            />
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm text-white bg-[#790000] hover:bg-[#990000] rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#790000]"
                                >
                                    {t('saveChanges')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Password Update Section */}
                <div className="bg-white shadow-sm rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">{t('updatePassword')}</h2>
                        <p className="mt-1 text-sm text-gray-500">{t('passwordOptional')}</p>
                    </div>
                    <div className="p-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <PasswordField
                                label={t('currentPassword')}
                                id="currentPassword"
                                register={register('currentPassword')}
                                isPasswordVisible={passwordVisibility.current}
                                toggleVisibility={() => handlePasswordVisibilityToggle('current')}
                                error={errors.currentPassword}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <PasswordField
                                    label={t('newPassword')}
                                    id="newPassword"
                                    register={register('newPassword')}
                                    isPasswordVisible={passwordVisibility.new}
                                    toggleVisibility={() => handlePasswordVisibilityToggle('new')}
                                    error={errors.newPassword}
                                />
                                <PasswordField
                                    label={t('confirmPassword')}
                                    id="confirmPassword"
                                    register={register('confirmPassword')}
                                    isPasswordVisible={passwordVisibility.confirm}
                                    toggleVisibility={() => handlePasswordVisibilityToggle('confirm')}
                                    error={errors.confirmPassword}
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="!px-4 !py-2 !text-sm !text-white !bg-[#790000] !hover:bg-[#990000] !rounded-md !focus:outline-none !focus:ring-2 !focus:ring-offset-2 !focus:ring-[#790000]"
                                >
                                    {t('updatePassword')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

