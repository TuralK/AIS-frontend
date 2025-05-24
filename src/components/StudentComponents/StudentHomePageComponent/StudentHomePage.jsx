import React from "react"
import { useTranslation } from "react-i18next"
import { useMatches } from 'react-router-dom';

const StudentHomePage = () => {
  const matches = useMatches();
  const { t } = useTranslation();
  const currentMatch = matches[matches.length - 1];
  const titleKey = currentMatch?.handle?.titleKey;
  
  React.useEffect(() => {
    const baseTitle = 'IMS';
    document.title = titleKey ? `${baseTitle} | ${t(titleKey)}` : baseTitle;
  }, [titleKey, t]);

  const rules = [
    t("summerRule1"), t("summerRule2"), t("summerRule3"), t("summerRule4"), t("summerRule5"),
    t("summerRule6"), t("summerRule7"), t("summerRule8"), t("summerRule9"), t("summerRule10"),
    t("summerRule11"),
  ]

  return (
    <div className="relative w-full min-h-screen">
      <div className="text-center p-5">
        <h2 className="mt-7 text-2xl font-medium">{t("summerRegulations")}</h2>
        <table className="mx-auto mt-10 w-[90%] border-collapse bg-[#f1f1f1]">
          <thead>
            <tr>
              <th className="border border-[#ddd] p-2 bg-[#f2f2f2] text-left"></th>
              <th className="border border-[#ddd] p-2 bg-[#f2f2f2] text-left">{t("description")}</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule, index) => (
              <tr key={index}>
                <td className="border border-[#ddd] p-2 bg-[#f2f2f2] text-left">{index + 1}</td>
                <td className="border border-[#ddd] p-2 align-top text-left">{rule}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StudentHomePage