import { I18n } from "@grammyjs/i18n";

export const i18n = new I18n({
  defaultLocale: "en", // see below for more information
  directory: "locales", // Load all translation files from locales/.
  useSession: true,
});
