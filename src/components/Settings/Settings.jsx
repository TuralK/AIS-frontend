"use client"

import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMatches } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from "react-redux"
import { resetState as resetSuccessState } from "../../slices/settingsSlice"
import { fetchInfo, updateUserInfo } from "../../thunks/settingsThunk"
import CustomAlertDialog from "../ui/custom_alert"
import PasswordField from "./PasswordField"

const settingsSchema = z
  .object({
    firstName: z.string().min(2, { message: "firstNameMinLength" }).optional(),
    lastName: z.string().min(2, { message: "lastNameMinLength" }).optional(),
    email: z.string().email({ message: "validEmail" }).optional(),
    currentPassword: z
      .preprocess(val => (val === "" ? undefined : val), z.string().optional()),
    newPassword: z
      .preprocess(val => (val === "" ? undefined : val), z.string().min(6, { message: "passwordMinLength" }).optional()),
    confirmPassword: z
      .preprocess(val => (val === "" ? undefined : val), z.string().optional()),
  })
  .superRefine((data, ctx) => {
    if (!data.firstName && !data.lastName && !data.email && !data.newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "atLeastOneFieldRequired",
        path: ["root"],
      })
    }

    if (data.newPassword && data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "passwordsDoNotMatch",
        path: ["confirmPassword"],
      })
    }

    if (data.newPassword && !data.currentPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "currentPasswordRequired",
        path: ["currentPassword"],
      })
    }
  })

function InputField({ label, id, register, type = "text", error, disabled }) {
  const { t } = useTranslation()
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        {...register}
        id={id}
        type={type}
        disabled={disabled}
        className={`w-full h-11 px-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
          disabled ? "bg-gray-100 cursor-not-allowed" : ""
        } ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}`}
      />
      {error && <p className="mt-1.5 text-sm text-red-600">{t(error.message)}</p>}
    </div>
  )
}

export default function Settings({ apiUrl }) {
  const matches = useMatches();
  const { t } = useTranslation();
  const currentMatch = matches[matches.length - 1];
  const titleKey = currentMatch?.handle?.titleKey;

  React.useEffect(() => {
    const baseTitle = 'IMS';
    document.title = titleKey ? `${baseTitle} | ${t(titleKey)}` : baseTitle;
  }, [titleKey, t]);

  
  const dispatch = useDispatch()
  const { userData, loading, error, success } = useSelector((state) => state.settings)

  const [passwordVisibility, setPasswordVisibility] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [alertOpen, setAlertOpen] = useState(false)
  const [alertType, setAlertType] = useState("success")
  const [alertMessage, setAlertMessage] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    resolver: zodResolver(settingsSchema),
  })

  useEffect(() => {
    dispatch(fetchInfo(apiUrl))
  }, [dispatch, apiUrl])

  useEffect(() => {
    if (userData?.username) {
      const parts = userData.username.split(" ");
      let firstName, lastName;

      if (parts.length === 3) {
        firstName = parts.slice(0, 2).join(" ");
        lastName = parts[2];
      } else {
        firstName = parts[0] || "";
        lastName = parts.slice(1).join(" ") || "";
      }

      reset({
        firstName,
        lastName,
        email: userData.email || "",
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [userData, reset]);

  useEffect(() => {
    if (error) {
      setAlertType("error")
      setAlertMessage(error.message || t("updateError"))
      setAlertOpen(true)
    }
  }, [error, t])

  useEffect(() => {
    if (success) {
      setAlertType("success")
      setAlertMessage(t("updateSuccess"))
      setAlertOpen(true)
      dispatch(resetSuccessState())
      dispatch(fetchInfo(apiUrl))
    }
  }, [success, dispatch, apiUrl, t])

  const handlePasswordVisibilityToggle = (field) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const onSubmit = async (formData) => {
    const payload = {}

    const initialFirstName = userData?.username?.split(" ")[0] || ""
    const initialLastName = userData?.username?.split(" ").slice(1).join(" ") || ""

    if (formData.firstName !== initialFirstName || formData.lastName !== initialLastName) {
      payload.firstName = formData.firstName
      payload.lastName = formData.lastName
    }

    if (formData.email !== userData?.email) {
      payload.email = formData.email
    }

    if (formData.newPassword) {
      payload.currentPassword = formData.currentPassword
      payload.password = formData.newPassword
      payload.confirmPassword = formData.confirmPassword
    }

    if (Object.keys(payload).length > 0) {
      dispatch(updateUserInfo({ apiUrl, formData: payload }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">{t("settings")}</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Info Section */}
          <div className="grid grid-rows-[auto_auto_auto] bg-white shadow-sm rounded-xl p-6 sm:p-8 gap-6">
            <h2 className="text-lg font-semibold text-gray-900">{t("personalInfo")}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InputField
                label={t("firstName")}
                id="firstName"
                register={register("firstName")}
                error={errors.firstName}
                disabled={loading}
              />
              <InputField
                label={t("lastName")}
                id="lastName"
                register={register("lastName")}
                error={errors.lastName}
                disabled={loading}
              />
            </div>

            <div className="w-full">
              <InputField
                label={t("email")}
                id="email"
                register={register("email")}
                type="email"
                error={errors.email}
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Section */}
          <div className="bg-white shadow-sm rounded-xl p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">{t("passwordSection")}</h2>

            <div className="space-y-6">
              <PasswordField
                label={t("currentPassword")}
                id="currentPassword"
                register={register("currentPassword")}
                isPasswordVisible={passwordVisibility.current}
                toggleVisibility={() => handlePasswordVisibilityToggle("current")}
                error={errors.currentPassword}
                disabled={loading}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <PasswordField
                  label={t("newPassword")}
                  id="newPassword"
                  register={register("newPassword")}
                  isPasswordVisible={passwordVisibility.new}
                  toggleVisibility={() => handlePasswordVisibilityToggle("new")}
                  error={errors.newPassword}
                  disabled={loading}
                />
                <PasswordField
                  label={t("confirmPassword")}
                  id="confirmPassword"
                  register={register("confirmPassword")}
                  isPasswordVisible={passwordVisibility.confirm}
                  toggleVisibility={() => handlePasswordVisibilityToggle("confirm")}
                  error={errors.confirmPassword}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <CustomAlertDialog
            isOpen={alertOpen}
            onClose={() => setAlertOpen(false)}
            title={alertType === "success" ? t("success") : t("error")}
            description={alertMessage}
            onConfirm={() => setAlertOpen(false)}
            confirmLabel={t("ok")}
            variant={alertType}
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !isDirty}
              className="px-6 py-2.5 text-sm font-medium text-white bg-[#790000] hover:bg-[#990000] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#790000]"
            >
              {loading ? t("saving") : t("saveChanges")}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}