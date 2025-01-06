import mysql from 'mysql2/promise';
// @ts-expect-error
import { JSDOM } from 'jsdom';
import { count } from 'drizzle-orm/sql'

let postID: any;
let test: any;
let patrik: any;

export default defineEventHandler(async event => {
   postID = null
   test = []
   patrik = null
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

   for (const post of result[0] as any[]) {
      postID = post.ID

      const slug = `${post.post_name}.html`

      const content = convertHtmlToOutputData(post.post_content, post.post_title)

      if (postID === 14188) {
         test = post.post_content
         patrik = content
      }

      const thumbnail = {
         path: post.thumbnail_url?.replaceAll('https://familnyjgerb.com', '').replaceAll('http://familnyjgerb.com', '') || '',
         alt: `Thumbnail for ${post.post_title}`,
      }

      const category: Record<string, number | null> = {
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

      const statuses: Record<string, PostStatus> = {
         'publish': 'published',
         'private': 'hidden',
         'draft': 'hidden',
         'future': 'published',
         'auto-draft': 'hidden',
      }

      // await db.insert(postsTable).values({
      //    slug,
      //    title: post.post_title,
      //    description: post.seo_description || null,
      //    content,
      //    thumbnail,
      //    status: statuses[post.post_status],
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
      test,
      patrik
   }
})

function convertHtmlToOutputData(html: string, title: string) {
   html = html
      .replaceAll('gm.RVek@yandex.ru', 'Times.family77@gmail.com')
      .replaceAll('[php snippet=3]', '+971 54 439 1710');
   const dom = new JSDOM(html);
   const document = dom.window.document;

   const blocks: any[] = [];

   const processShortcodes = (content: string): string => {
      return content.replace(
         /\[(\w+)([^\]]*)\](?:(.*?)\[\/\1\])?/gs,
         (match, shortcode, attributes, innerContent = '') => {
            const attrObj: any = {};
            attributes
               .trim()
               .split(/\s+/)
               .forEach((attr: string) => {
                  const [key, value] = attr.split('=');
                  attrObj[key] = value?.replace(/"/g, '');
               });

            if (shortcode === 'button') {
               if (
                  attrObj?.link === '/anketa-dlya-razrabotki-monogrammy' ||
                  attrObj?.link === '/anketa'
               )
                  return '';

               // You can add the "button" block if needed here
            } else if (shortcode === 'contact') {
               // TODO: Handle "contact" shortcode logic if required
            } else if (shortcode === 'fullwidth') {
               return ''; // Remove [fullwidth] shortcodes
            }

            return ''; // Default: Remove unknown shortcodes
         }
      );
   };

   const convertNodeToEditorJsBlock = (node: any) => {
      if (node.tagName?.startsWith("H") && ["H1", "H2", "H3", "H4", "H5", "H6"].includes(node.tagName)) {
         if (node.textContent !== title) {
            blocks.push({
               type: "header",
               data: {
                  text: node.textContent.trim(),
                  level: parseInt(node.tagName[1]),
               },
            });
         }
      } else if (node.tagName === "P" || node.tagName === "DIV") {
         const childBlocks: string[] = [];

         // Traverse all child nodes to combine text and inline elements
         for (const child of node.childNodes) {
            if (child.nodeType === 1) {
               // Handle inline elements like <a>, <em>, etc.
               if (child.tagName === "A") {
                  childBlocks.push(
                     `<a href="${child.href}">${child.textContent.trim()}</a>`
                  );
               } else if (child.tagName === "EM") {
                  childBlocks.push(`<em>${child.textContent.trim()}</em>`);
               } else {
                  // Default fallback for unknown tags
                  childBlocks.push(child.textContent.trim());
               }
            } else if (child.nodeType === 3) {
               // Handle plain text nodes
               const textContent = child.textContent.trim();
               if (textContent) {
                  childBlocks.push(textContent);
               }
            }
         }

         if (childBlocks.length) {
            blocks.push({
               type: "paragraph",
               data: {
                  text: childBlocks.join(" "),
               },
            });
         }
      } else if (node.tagName === "IMG") {
         blocks.push({
            type: "image",
            data: {
               file: {
                  url: node.src
                     .replaceAll("https://familnyjgerb.com", "")
                     .replaceAll("http://familnyjgerb.com", "")
                     .replaceAll("http://gerb.ainsworth.ml", ""),
               },
               caption: node.alt || "",
               withBorder: false,
               withBackground: false,
               stretched: false,
            },
         });
      } else if (node.tagName === "UL" || node.tagName === "OL") {
         const style = node.tagName === "UL" ? "unordered" : "ordered";
         const items: any[] = [];

         node.querySelectorAll("li").forEach((li: any) => {
            items.push({ content: li.textContent || "", meta: {}, items: [] });
         });

         blocks.push({
            type: "list",
            data: {
               style,
               items,
            },
         });
      } else if (node.nodeType === 3) {
         const textContent = node.textContent.trim();
         if (textContent) {
            blocks.push({
               type: "paragraph",
               data: {
                  text: processShortcodes(textContent),
               },
            });
         }
      } else if (node.tagName === "SPAN" || node.tagName === "EM") {
         for (const element of node.childNodes) {
            convertNodeToEditorJsBlock(element);
         }
      }
   };

   for (const node of document.body.childNodes) {
      convertNodeToEditorJsBlock(node);
   }

   return blocks.length
      ? {
         time: 1,
         blocks,
         version: '2.30.7',
      }
      : {
         blocks: [{ type: 'paragraph', data: { text: html } }],
         version: '2.30.7',
         time: 2,
      };
}