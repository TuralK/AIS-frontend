import React, { useState, useRef } from "react"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Check, X, Loader2 } from "lucide-react"

const CompanyTestimonialCard = ({ company, onApprove, onReject }) => {
  const { t } = useTranslation()
  const [isHovered, setIsHovered] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeButton, setActiveButton] = useState(null)
  const timeoutRef = useRef(null)
  const hoverIntentRef = useRef(null)

  const handleHoverStart = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (hoverIntentRef.current) {
      clearTimeout(hoverIntentRef.current)
    }
    setIsHovered(true)
    setIsExiting(false)
  }

  const handleHoverEnd = () => {
    if (hoverIntentRef.current) {
      clearTimeout(hoverIntentRef.current)
    }

    hoverIntentRef.current = setTimeout(() => {
      setIsExiting(true)
      timeoutRef.current = setTimeout(() => {
        setIsHovered(false)
        setIsExiting(false)
      }, 1000)
    }, 200)
  }

  const handleAction = async (action, actionType) => {
    if (isLoading) return

    setIsLoading(true)
    setActiveButton(actionType)

    try {
      await action(company.id)
    } catch (error) {
      console.error("Action failed:", error)
    } finally {
      setIsLoading(false)
      setActiveButton(null)
    }
  }

  const ButtonIcon = ({ type }) => {
    if (isLoading && activeButton === type) {
      return <Loader2 className="w-4 h-4 animate-spin" />
    }
    return type === "approve" ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />
  }

  return (
    <div className="relative w-full max-w-md" onMouseEnter={handleHoverStart} onMouseLeave={handleHoverEnd}>
      <motion.div
        className="relative w-full bg-white rounded-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ zIndex: 2 }}
      >
        <motion.div
          className="p-6 bg-gradient-to-br from-red-900 to-red-800 rounded-xl shadow-lg"
          animate={{
            scale: isHovered ? 1.02 : 1,
            y: isHovered ? -20 : 0,
            transition: { duration: 0.3 },
          }}
        >
          <motion.h2 className="text-4xl mt-2 font-bold mb-4 text-white">{company.name}</motion.h2>
          <div className="space-y-3">
            <p className="text-md font-bold flex flex-wrap items-start">
              <span className="font-medium text-[#DAE7F0] shrink-0">{t("representativeName")}:</span>
              <span className="ml-2 text-white break-all">{company.username}</span>
            </p>
            <p className="text-md font-bold flex flex-wrap items-start">
              <span className="font-medium text-[#DAE7F0] shrink-0">{t("email")}:</span>
              <span className="ml-2 text-white break-all">{company.email}</span>
            </p>
            <p className="text-md font-bold flex flex-wrap items-start">
              <span className="font-medium text-[#DAE7F0] shrink-0">{t("address")}:</span>
              <span className="ml-2 text-white break-all">{company.address}</span>
            </p>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/50"
          animate={{
            opacity: isHovered ? 0 : 1,
            y: isHovered ? 10 : 0,
          }}
        >
          <ChevronDown className="w-5 h-5 text-white" />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {(isHovered || isExiting) && (
          <motion.div
            id="button-area"
            initial={{
              opacity: 0,
              y: -30,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 10,
              scale: 0.98,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            }}
            exit={{
              opacity: 0,
              y: -30,
              scale: 0.95,
              transition: {
                duration: 1,
                ease: "easeInOut",
              },
            }}
            className="absolute ml-3 -translate-x-1/2 w-[90%]"
            style={{
              zIndex: 1,
              perspective: "1000px",
              transformStyle: "preserve-3d",
            }}
          >
            <div className="flex justify-between space-x-2 p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.2)] transform-gpu">
              <motion.button
                whileHover={{ scale: isLoading ? 1 : 1.02, y: isLoading ? 0 : -2 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                onClick={() => handleAction(onApprove, "approve")}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ButtonIcon type="approve" />
                {t("approve")}
              </motion.button>
              <motion.button
                whileHover={{ scale: isLoading ? 1 : 1.02, y: isLoading ? 0 : -2 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                onClick={() => handleAction(onReject, "reject")}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ButtonIcon type="reject" />
                {t("reject")}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CompanyTestimonialCard