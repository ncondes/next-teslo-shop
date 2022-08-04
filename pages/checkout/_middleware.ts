import { getToken } from 'next-auth/jwt';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
   // const { token = '' } = req.cookies;
   // try {
   //    await jwt.isValidToken(token);
   //    return NextResponse.next();
   // } catch (error) {
   //    return NextResponse.redirect(`/auth/login?p=${req.page.name}`);
   // }

   const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

   if (!session) {
      return NextResponse.redirect(`/auth/login?p=${req.page.name}`);
   }

   return NextResponse.next();
}
