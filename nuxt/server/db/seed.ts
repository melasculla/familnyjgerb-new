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

   await db.execute('\
      CREATE OR REPLACE FUNCTION auto_set_lang_group()\
      RETURNS TRIGGER AS $$\
      BEGIN\
         IF NEW.lang_group IS NULL THEN\
            NEW.lang_group := NEW.id;\
         END IF;\
         RETURN NEW;\
      END;\
      $$ LANGUAGE plpgsql;\
   ')

   await db.execute('\
      CREATE TRIGGER auto_set_lang_group\
      BEFORE INSERT ON posts\
      FOR EACH ROW\
      EXECUTE FUNCTION auto_set_lang_group();\
   ')

   await db.execute(`
      CREATE OR REPLACE FUNCTION enforce_lang_group_for_slug()
      RETURNS TRIGGER AS $$
      BEGIN
          IF EXISTS (SELECT 1 FROM posts WHERE slug = NEW.slug) THEN
              IF (SELECT lang_group FROM posts WHERE slug = NEW.slug LIMIT 1) != NEW.lang_group THEN
                  RAISE EXCEPTION 'Slug % already exists in a different langGroup', NEW.slug;
              END IF;
          END IF;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await db.execute(`
      CREATE TRIGGER check_slug_lang_group
      BEFORE INSERT ON posts
      FOR EACH ROW
      EXECUTE FUNCTION enforce_lang_group_for_slug();
    `);

   const categories = await db.insert(categoriesTable).values([
      { id: 1, slug: 'aktsii', nameRu: 'Акции' },
      { id: 2, slug: 'geraldika-v-zhizni', nameRu: 'Геральдика в жизни' },
      { id: 3, slug: 'zapisi-geraldista', nameRu: 'Записи геральдиста' },
      { id: 4, slug: 'kompetentnoe-mnenie', nameRu: 'Компетентное мнение' },
      { id: 5, slug: 'news', nameRu: 'Новости' },
   ])

   console.log('Inserted categories:', categories)

   const galleries = await db.insert(galleriesTable).values([
      { name: 'Gerbs' },
      { name: 'Monograms' },
   ]).returning({ id: galleriesTable.id, name: galleriesTable.name });

   console.log('Inserted galleries:', galleries);

   const galleryCategories = await db.insert(galleryCategoriesTable).values([
      { name: 'standard', galleryId: galleries.find((g) => g.name === 'Gerbs')?.id! },
      { name: 'premium', galleryId: galleries.find((g) => g.name === 'Gerbs')?.id! },
      { name: 'elite', galleryId: galleries.find((g) => g.name === 'Gerbs')?.id! },
      { name: 'standard', galleryId: galleries.find((g) => g.name === 'Monograms')?.id! },
      { name: 'premium', galleryId: galleries.find((g) => g.name === 'Monograms')?.id! },
      { name: 'elite', galleryId: galleries.find((g) => g.name === 'Monograms')?.id! },
      { name: 'individual', galleryId: galleries.find((g) => g.name === 'Monograms')?.id! },
   ]);

   console.log('Inserted categories:', galleryCategories);

   console.log('Seeding completed!');
};

runSeed()
   .then(() => process.exit(0))
   .catch((err) => {
      console.error('Error seeding database:', err);
      process.exit(1);
   });