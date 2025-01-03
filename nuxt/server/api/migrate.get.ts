import mysql from 'mysql2/promise';
// @ts-expect-error
import { JSDOM } from 'jsdom';
import { count } from 'drizzle-orm/sql'


export default defineEventHandler(async event => {
   // Connect to WordPress DB
   const wpDb = await mysql.createConnection({
      host: 'familnyjgerb-db-1',
      user: 'root',
      password: 'supertestpass',
      database: 'mi',
   });

   const result = await wpDb.execute(`
      SELECT 
         p.ID, 
         p.post_name, 
         p.post_title, 
         p.post_content, 
         p.post_date, 
         p.post_modified, 
         p.post_date_gmt,
         p.post_status,
         MAX(pm1.meta_value) AS seo_description,
         MAX(pm2.meta_value) AS seo_keywords,
         MAX(t.guid) AS thumbnail_url,
         GROUP_CONCAT(DISTINCT terms.name SEPARATOR ', ') AS categories
      FROM alf_posts p
      LEFT JOIN alf_postmeta pm1 ON pm1.post_id = p.ID AND pm1.meta_key = '_aioseop_description'
      LEFT JOIN alf_postmeta pm2 ON pm2.post_id = p.ID AND pm2.meta_key = '_aioseop_keywords'
      LEFT JOIN alf_postmeta pm3 ON pm3.post_id = p.ID AND pm3.meta_key = '_thumbnail_id'
      LEFT JOIN alf_posts t ON t.ID = pm3.meta_value
      LEFT JOIN alf_term_relationships tr ON tr.object_id = p.ID
      LEFT JOIN alf_term_taxonomy tt ON tt.term_taxonomy_id = tr.term_taxonomy_id AND tt.taxonomy = 'category'
      LEFT JOIN alf_terms terms ON terms.term_id = tt.term_id
      WHERE p.post_type = 'post' AND p.post_status NOT IN ('draft', 'auto-draft')
      GROUP BY p.ID, p.post_name, p.post_title, p.post_content, p.post_date, p.post_modified, p.post_date_gmt;
   `)

   let test;

   for (const post of result[0] as any[]) {
      const slug = `${post.post_name}.html`;

      const content = convertHtmlToOutputData(post.post_content, post.post_name)

      if (post.post_name === 'heraldic-description-blazon') {
         test = {
            old: post.post_content,
            new: content
         }
      }

      const thumbnail = {
         path: post.thumbnail_url?.replaceAll('https://familnyjgerb.com', '').replaceAll('http://familnyjgerb.com', '') || '',
         alt: `Thumbnail for ${post.post_title}`,
      }

      const category = {
         'Новости': 5,
         'Компетентное мнение': 4,
         'Записи геральдиста': 3,
         'Записи геральдиста, Новости': 3,
         'Геральдика в жизни, Записи геральдиста, Новости': 2,
         'Акции': 1,
         'Геральдика в жизни, Записи геральдиста': 2,
         'Геральдика в жизни': 2,
         'Uncategorized': null,
         'Heraldist Notes': null,
         'Геральдика в жизни, Новости': 2,
         'Геральдика в жизни, Компетентное мнение': 4,
         'Геральдика в жизни, Записи геральдиста, Компетентное мнение': 3,
         'Акции, Геральдика в жизни': 1,
         'Записи геральдиста, Компетентное мнение': 4,
         'Акции, Геральдика в жизни, Новости': 2,
      } as const

      const status = (inital: string): PostStatus => {
         if (inital === 'publish')
            return 'published'
         if (inital === 'private')
            return 'hidden'
         if (inital === 'draft')
            return 'hidden'
         if (inital === 'future')
            return 'published'
         if (inital === 'auto-draft')
            return 'hidden'

         return 'hidden'
      }

      // await db.insert(postsTable).values({
      //    slug,
      //    title: post.post_title,
      //    description: post.seo_description || null,
      //    content,
      //    thumbnail,
      //    status: status(post.post_status),
      //    createdAt: new Date(post.post_date),
      //    editedAt: new Date(post.post_modified),
      //    plannedAt: post.post_date_gmt ? new Date(post.post_date_gmt) : null,
      //    seoKeys: post.seo_keywords || '',
      //    categoryId: category[post.categories] ?? 3,
      //    langId: 1,
      // });
   }

   return {
      result: await db.select({ count: count() }).from(postsTable),
      test
   }
})

function convertHtmlToOutputData(html: string, slug?: string) {
   const dom = new JSDOM(html);
   const document = dom.window.document;

   const blocks: any = [];

   const convertNodeToEditorJsBlock = (node: any) => {
      if (node.tagName?.startsWith('H') && ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(node.tagName)) {
         blocks.push({
            type: 'header',
            data: {
               text: node.textContent,
               level: parseInt(node.tagName[1]),
            }
         })
      } else if (node.tagName === 'P') {
         blocks.push({
            type: 'paragraph',
            data: {
               text: node.innerHTML,
            }
         })
      } else if (node.tagName === 'IMG') {
         blocks.push({
            type: 'image',
            data: {
               file: {
                  url: node.src.replaceAll('https://familnyjgerb.com', '').replaceAll('http://familnyjgerb.com', '').replaceAll('http://gerb.ainsworth.ml', ''),
               },
               caption: node.alt || '',
               withBorder: false,
               withBackground: false,
               stretched: false,
            }
         })
      } else if (node.tagName === 'UL' || node.tagName === 'OL') {
         const style = node.tagName === 'UL' ? 'unordered' : 'ordered';
         const items: string[] = [];

         node.querySelectorAll('li').forEach((li: any) => {
            items.push(li.textContent || '');
         })

         blocks.push({
            type: 'list',
            data: {
               style,
               items,
            }
         })
      } else if (node.tagName === 'DIV') {
         for (const element of node.childNodes) {
            convertNodeToEditorJsBlock(element)
         }
      }
   }

   for (const node of document.body.childNodes) {
      convertNodeToEditorJsBlock(node)
   }

   return blocks.length ?
      {
         time: 1,
         blocks,
         version: '2.30.7',
      } :
      {
         blocks: [
            { type: 'paragraph', data: { text: html } },
         ],
         version: '2.30.7',
         time: 2
      }
}