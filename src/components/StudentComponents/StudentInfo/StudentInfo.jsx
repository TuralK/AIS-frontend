import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import CustomAlertDialog from "../../ui/custom_alert";
import {
  fetchStudentInfo,
  updateStudentInfo,
  createStudentInfo,
} from "../../../thunks/studentInfoThunks";
import { resetStudentInfoState } from "../../../slices/studentInfoSlice";
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { isEmail } from "validator";

const studentInfoSchema = z.object({
  studentPhone: z.string()
    .refine(
      (value) => {
        if (!value.startsWith('+')) return false;
        const phoneNumber = parsePhoneNumberFromString(value);
        return phoneNumber?.isValid() === true;
      },
      (value) => ({
        message: !value.startsWith('+') 
          ? "countryCodeRequired" 
          : "invalidPhone"
      })
    ),
  relativePhone: z.string()
    .refine(
      (value) => {
        if (!value.startsWith('+')) return false;
        const phoneNumber = parsePhoneNumberFromString(value);
        return phoneNumber?.isValid() === true;
      },
      (value) => ({
        message: !value.startsWith('+') 
          ? "countryCodeRequired" 
          : "invalidPhone"
      })
    ),
  // formEmail: z.string().email({ message: "validEmail" }),
  formEmail: z.string().refine(
    (val) => isEmail(val, { allow_display_name: true }),
    { message: "validEmail" }
  ),
  // cv: z
  //   .instanceof(FileList)
  //   .refine((files) => files.length > 0, { message: "cvRequired" })
  //   .refine((files) => files[0]?.type === "application/pdf", {
  //     message: "pdfOnly",
  //   })
  //   .optional() // Make cv optional for update, as it might not always be re-uploaded
  //   .nullable(),
}).refine(
  (data) => data.studentPhone !== data.relativePhone,
  {
    message: "samePhonesError",
    path: ["relativePhone"],
  }
);


function InputField({ label, id, register, type = "text", error, disabled, placeholder, maxLength }) {
  const { t } = useTranslation();
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
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full h-11 px-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
          disabled ? "bg-gray-100 cursor-not-allowed" : ""
        } ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}`}
      />
      {error && <p className="mt-1.5 text-sm text-red-600">{t(error.message)}</p>}
    </div>
  );
}

// function FileInputField({ label, id, register, error, accept, disabled }) {
//   const { t } = useTranslation();
//   return (
//     <div className="w-full">
//       <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
//         {label}
//       </label>
//       <input
//         {...register}
//         id={id}
//         type="file"
//         accept={accept}
//         disabled={disabled}
//         className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
//           disabled ? "bg-gray-100 cursor-not-allowed" : ""
//         } ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}`}
//       />
//       {error && <p className="mt-1.5 text-sm text-red-600">{t(error.message)}</p>}
//     </div>
//   );
// }

export default function StudentInfo() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { studentData, loading, error, success } = useSelector(
    (state) => state.studentInfo
  );

  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertType, setAlertType] = React.useState("success");
  const [alertMessage, setAlertMessage] = React.useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    // watch,
  } = useForm({
    resolver: zodResolver(studentInfoSchema),
    defaultValues: {
      studentPhone: "",
      relativePhone: "",
      formEmail: "",
    //   cv: undefined,
    },
  });

  // Fetch student information on component mount
  useEffect(() => {
    dispatch(fetchStudentInfo());
  }, [dispatch]);

  // Populate form with fetched data
  useEffect(() => {
    if (studentData) {
      reset({
        studentPhone: studentData.studentPhone || "",
        relativePhone: studentData.relativePhone || "",
        formEmail: studentData.formEmail || "",
        // cv: undefined,
      });
    }
  }, [studentData, reset]);

  // Handle alert message from Redux state changes
  useEffect(() => {
    if (success) {
      setAlertType("success");
      setAlertMessage(t("submitSuccess"));
      setAlertOpen(true);
      dispatch(resetStudentInfoState()); // Reset success state after showing alert
    } else if (error) {
      setAlertType("error");
      setAlertMessage(t("submitError") + `: ${error}`); // Display specific error if available
      setAlertOpen(true);
      dispatch(resetStudentInfoState()); // Reset error state after showing alert
    }
  }, [success, error, t, dispatch]);

  const onSubmit = async (formData) => {
    // Create a FormData object for file uploads
    const payload = {}
    if(studentData != null) {
        if (formData.studentPhone != studentData.studentPhone) {
            payload.studentPhone = formData.studentPhone;
        }
        if (formData.relativePhone != studentData.relativePhone) {
            payload.relativePhone = formData.relativePhone;
        }
        if (formData.formEmail != studentData.formEmail) {
            payload.formEmail = formData.formEmail;
        }
        dispatch(updateStudentInfo(payload));
    } else {
        payload.studentPhone = formData.studentPhone;
        payload.relativePhone = formData.relativePhone;
        payload.formEmail = formData.formEmail;
        dispatch(createStudentInfo(payload));
    }
    // if (formData.cv && formData.cv.length > 0) {
    //   dataToSend.append("cv", formData.cv[0]);
    // }
  };

  return (
    <div className="pb-8 bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">{t("studentInfo")}</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-rows-[auto_auto_auto] bg-white shadow-sm rounded-xl p-6 sm:p-8 gap-6">
            <h2 className="text-lg font-semibold text-gray-900">{t("applicationInfo")}</h2>

            <div className="space-y-6">
              <InputField
                label={t("studentPhone")}
                id="studentPhone"
                register={register("studentPhone")}
                type="tel"
                error={errors.studentPhone}
                disabled={loading} // Disable fields while loading
                placeholder="+[Country Code][Number] (e.g. +12345678901234)"
                maxLength={15}
              />

              <InputField
                label={t("relativePhone")}
                id="relativePhone"
                register={register("relativePhone")}
                type="tel"
                error={errors.relativePhone}
                disabled={loading}
                placeholder="+[Country Code][Number] (e.g. +98765432109876)"
                maxLength={15}
              />

              <InputField
                label={t("formEmail")}
                id="formEmail"
                register={register("formEmail")}
                type="email"
                error={errors.formEmail}
                disabled={loading}
              />
            </div>
          </div>

          {/* <div className="bg-white shadow-sm rounded-xl p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">{t("documents")}</h2>

            <FileInputField
              label={t("cvUpload")}
              id="cv"
              register={register("cv")}
              accept="application/pdf"
              error={errors.cv}
              disabled={loading}
            />
            {watch("cv")?.[0] && (
              <p className="mt-2 text-sm text-gray-600">
                {t("selectedFile")}: {watch("cv")[0].name}
              </p>
            )}
            {studentData?.cvUrl && !watch("cv")?.[0] && (
              <p className="mt-2 text-sm text-gray-600">
                {t("currentCv")}: <a href={studentData.cvUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Download Current CV</a>
              </p>
            )}
          </div> */}

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
              disabled={!isDirty || loading} // Disable if not dirty or loading
              className="px-6 py-2.5 text-sm font-medium text-white bg-[#790000] hover:bg-[#990000] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#790000]"
            >
              {loading ? t("saving") : t("saveChanges")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}