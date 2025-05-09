import { useParams } from "next/navigation";
import pt from "../translations/pt.json";
import en from "../translations/en.json";

type TranslationType = typeof pt;
type NestedKeys<T> = T extends object
  ? {
      [K in keyof T]: `${K & string}${T[K] extends object
        ? `.${NestedKeys<T[K]>}`
        : ""}`;
    }[keyof T]
  : never;

const translations = {
  pt,
  en,
} as const;

export function useTranslations() {
  const params = useParams();
  const locale = (params?.locale as keyof typeof translations) || "pt";

  const t = (key: NestedKeys<TranslationType>) => {
    const keys = key.split(".");
    let value: any = translations[locale];

    for (const k of keys) {
      value = value?.[k];
    }

    return (value as string) || key;
  };

  return { t, locale };
}
