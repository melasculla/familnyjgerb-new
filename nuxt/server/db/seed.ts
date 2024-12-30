import { db } from '../utils/useDB'
import {
   galleriesTable,
   galleryCategoriesTable,
   langsTable
} from './schema';


const runSeed = async () => {
   console.log('Seeding database...');

   const langs = await db.insert(langsTable).values([
      { lang: 'ru' },
      { lang: 'en' },
   ]).returning({ id: langsTable.id, name: langsTable.lang });

   console.log('Inserted langs:', langs)

   const galleries = await db.insert(galleriesTable).values([
      { name: 'Gerbs' },
      { name: 'Monograms' },
   ]).returning({ id: galleriesTable.id, name: galleriesTable.name });

   console.log('Inserted galleries:', galleries);

   const categories = await db.insert(galleryCategoriesTable).values([
      { name: 'standard', galleryId: galleries.find((g) => g.name === 'Gerbs')?.id! },
      { name: 'premium', galleryId: galleries.find((g) => g.name === 'Gerbs')?.id! },
      { name: 'elite', galleryId: galleries.find((g) => g.name === 'Gerbs')?.id! },
      { name: 'standard', galleryId: galleries.find((g) => g.name === 'Monograms')?.id! },
      { name: 'premium', galleryId: galleries.find((g) => g.name === 'Monograms')?.id! },
      { name: 'elite', galleryId: galleries.find((g) => g.name === 'Monograms')?.id! },
      { name: 'individual', galleryId: galleries.find((g) => g.name === 'Monograms')?.id! },
   ]);

   console.log('Inserted categories:', categories);

   console.log('Seeding completed!');
};

runSeed()
   .then(() => process.exit(0))
   .catch((err) => {
      console.error('Error seeding database:', err);
      process.exit(1);
   });