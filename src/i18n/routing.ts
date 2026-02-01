import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';
 
export const routing = defineRouting({
  locales: [
    'tr', 
    'en', 
    'de', 
    'es',
    'fr',
    'ar', 
    'ja'
  ], 
    // Desteklediğimiz diller
  defaultLocale: 'tr',   // Varsayılan dil
  localePrefix: 'as-needed' // /tr yazmasın, sadece /en yazsın istiyorsan
});
 
export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);