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

   const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

   if (!session) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
         status: 401,
         headers: {
            'Content-Type': 'application/json',
         },
      });
   }

   const validRoles = ['admin'];

   if (!validRoles.includes(session.user.role)) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
         status: 401,
         headers: {
            'Content-Type': 'application/json',
         },
      });
   }

   return NextResponse.next();
}
