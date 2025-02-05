import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const adminSchema = z.object({
    username: z.string().min(2, { message: 'usernameMinLength' }),
    email: z.string().email({ message: 'validEmail' })
})

const passwordSchema = z.object({
    currentPassword: z.string().optional(),
    newPassword: z.string().min(6, { message: 'passwordMinLength' }).optional(),
    confirmPassword: z.string().optional(),
})
.refine((data) => {
    if (data.newPassword && data.confirmPassword) {
        return data.newPassword === data.confirmPassword
    }
    return true
}, { message: 'passwordsDoNotMatch', path: ['confirmPassword'] })
.refine(data => {
    if (data.newPassword) {
        return !!data.currentPassword
    }
    return true
}, { message: 'currentPasswordRequired', path: ['currentPassword'] })

function InputField({ label, id, register, type = 'text', error }) {
    const { t } = useTranslation();
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
            {error && <p className="mt-1 text-xs text-red-600">{t(`${error.message}`)}</p>}
        </div>
    )
}

function PasswordField({ label, id, register, isPasswordVisible, toggleVisibility, error }) {
    const { t } = useTranslation();
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
            {error && <p className="mt-1 text-xs text-red-600">{t(`${error.message}`)}</p>}
        </div>
    )
}

export default function DICSettings({ }) {
    const [initialData] = useState({
        
    });
        
    const [passwordVisibility, setPasswordVisibility] = useState({
        current: false,
        new: false,
        confirm: false,
    })

    const { t } = useTranslation()

    
    const { register: registerAdmin, handleSubmit: handleAdminSubmit, formState: { errors: adminErrors } } = useForm({
        resolver: zodResolver(adminSchema),
        defaultValues: initialData
    });

    const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors } } = useForm({
        resolver: zodResolver(passwordSchema)
    });

    const handlePasswordVisibilityToggle = (field) => {
        setPasswordVisibility((prev) => ({
            ...prev,
            [field]: !prev[field],
        }))
    }

    const handleAdminUpdate = (data) => {
        console.log('Admin bilgileri güncellendi:', data)
    }

    const handlePasswordUpdate = (data) => {
        console.log('Şifre güncellendi:', data)
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto space-y-6 px-4 sm:px-6">
                {/* Admin Information Section */}
                <div className="bg-white shadow-sm rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">{t('adminInformation')}</h2>
                        <p className="mt-1 text-sm text-gray-500">{t('updateAdminInfo')}</p>
                    </div>
                    <div className="p-6">
                        <form onSubmit={handleAdminSubmit(handleAdminUpdate)} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <InputField
                                    label={t('username')}
                                    id="username"
                                    register={registerAdmin('username')}
                                    error={adminErrors.username}
                                />
                                <InputField
                                    label={t('email')}
                                    id="email"
                                    register={registerAdmin('email')}
                                    type="email"
                                    error={adminErrors.email}
                                />
                            </div>
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
                        <form onSubmit={handlePasswordSubmit(handlePasswordUpdate)} className="space-y-4">
                            <PasswordField
                                label={t('currentPassword')}
                                id="currentPassword"
                                register={registerPassword('currentPassword')}
                                isPasswordVisible={passwordVisibility.current}
                                toggleVisibility={() => handlePasswordVisibilityToggle('current')}
                                error={passwordErrors.currentPassword}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <PasswordField
                                    label={t('newPassword')}
                                    id="newPassword"
                                    register={registerPassword('newPassword')}
                                    isPasswordVisible={passwordVisibility.new}
                                    toggleVisibility={() => handlePasswordVisibilityToggle('new')}
                                    error={passwordErrors.newPassword}
                                />
                                <PasswordField
                                    label={t('confirmPassword')}
                                    id="confirmPassword"
                                    register={registerPassword('confirmPassword')}
                                    isPasswordVisible={passwordVisibility.confirm}
                                    toggleVisibility={() => handlePasswordVisibilityToggle('confirm')}
                                    error={passwordErrors.confirmPassword}
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm text-white bg-[#790000] hover:bg-[#990000] rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#790000]"
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