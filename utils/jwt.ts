import jwt from 'jsonwebtoken';

export const signToken = (_id: string, email: string) => {
   if (!process.env.JWT_SEED) {
      throw new Error('There is no JWT seed, review environment variables.');
   }

   return jwt.sign(
      // payload
      { _id, email },
      // Seed
      process.env.JWT_SEED,
      // Options
      { expiresIn: '1d' }
   );
};

export const isValidToken = async (token: string): Promise<string> => {
   if (!process.env.JWT_SEED) {
      throw new Error('There is no JWT seed, review environment variables.');
   }

   return new Promise((resolve, reject) => {
      try {
         jwt.verify(token, process.env.JWT_SEED || '', (error, payload) => {
            if (error) return reject('Invalid JWT');

            const { _id } = payload as { _id: string };

            resolve(_id);
         });
      } catch (error) {
         reject('Invalid JWT');
      }
   });
};
