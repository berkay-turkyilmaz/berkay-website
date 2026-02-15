import createMiddleware from 'next-intl/middleware';
import {routing} from 'src/i18n/routing';
 
export default createMiddleware(routing);
 
export const config = {
  // Buradaki '/' ifadesi localhost:3000'i yakalamasını sağlar
  matcher: ['/', '/(tr|en|de)/:path*', '/((?!_next|_vercel|.*\\..*).*)']
};