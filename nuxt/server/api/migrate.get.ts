import mysql from 'mysql2/promise';
// @ts-expect-error
import he from 'he';
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

      const content = convertHtmlToOutputData(post.post_content, he.decode(post.post_title))

      if (postID === 14387) { // 14387 22046 14188 13693 21355
         test.push(post.post_content)
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
      .replaceAll('[php snippet=3]', '+971 54 439 1710')
      .replaceAll('https://familnyjgerb.com/wp-content', '/api/media/wp-content')
      .replaceAll('http://familnyjgerb.com/wp-content', '/api/media/wp-content')
      .replaceAll("https://familnyjgerb.com", "")
      .replaceAll("http://familnyjgerb.com", "")
      .replaceAll("http://gerb.ainsworth.ml", "")

   const dom = new JSDOM(html, { contentType: "text/html" });
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

               // test.push(attrObj)
            } else if (shortcode === 'contact') {
               // Handle "contact" shortcode logic if required
               return ''
            } else if (shortcode === 'fullwidth') {
               return ''; // Remove [fullwidth] shortcodes
            }

            return ''; // Default: Remove unknown shortcodes
         }
      );
   };

   const convertNodeToEditorJsBlock = (node: any, nextNode?: any, nestedLevel: boolean = false) => {
      if (!nestedLevel && nextNode && (nextNode.nodeType === 3 || nextNode.nodeType === 1)) {
         if (node.nodeType === 1 && nextNode.nodeType === 3) {
            if (node.tagName === 'IMG' || node.tagName === 'P') { // || node.tagName?.startsWith('H')

            } else {
               const wrapper = document.createElement("p");
               wrapper.appendChild(node.cloneNode(true));

               const textNode = document.createTextNode(' ' + nextNode.textContent.trim());
               wrapper.appendChild(textNode)

               node = wrapper
               nextNode.remove();
            }
         }
      }

      //    } else if (node.nodeType === 3 && nextNode.nodeType === 1) {
      //       if (nextNode.tagName === "A") {
      //          node.textContent += `<a href="${nextNode.href}">${nextNode.textContent.trim()}</a>`
      //       } else if (nextNode.tagName === "EM" || nextNode.tagName === "I") {
      //          node.textContent += `<i>${nextNode.textContent.trim()}</i>`
      //       } else if (nextNode.tagName === "STRONG" || nextNode.tagName === "B") {
      //          let text = ''
      //          for (const element of nextNode.childNodes) {
      //             if (element.outerHTML) {
      //                text += element.outerHTML.trim() + ' '
      //             } else {
      //                text += element.textContent.trim() + ' '
      //             }
      //          }
      //          node.textContent += `<b>${text.trim()}</b>`
      //       } else if (nextNode.tagName === "SPAN") {
      //          node.textContent += `<span>${nextNode.textContent.trim()}</span>`
      //       } else {
      //          node.textContent += nextNode.textContent.trim()
      //       }
      //       nextNode.remove();
      //    }
      // }

      // if (node.nodeType === 3 || node.nodeType === 1) {
      //    const wrapper = document.createElement("P");
      //    wrapper.appendChild(node.cloneNode(true));
      //    node = wrapper;
      // }

      // if (postID === 21355) test.push({
      //    tag: node.tagName,
      //    types: {
      //       current: node.nodeType,
      //       next: nextNode?.nodeType,
      //    },
      //    content: node.outerHTML ?? node.textContent,
      //    nested: nestedLevel,
      // })

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

         for (const child of node.childNodes) {
            if (child.nodeType === 3) {
               const textContent = child.textContent.trim();

               if (textContent) {
                  const paragraphs = textContent.split(/\n+/).map((line: string) => line.trim());

                  paragraphs.forEach((paragraph: string) => {
                     if (paragraph) {
                        childBlocks.push(processShortcodes(paragraph))
                     }
                  });
               }
            } else if (child.nodeType === 1) {
               if (child.tagName === "A") {
                  const images: any = Array.from(child.childNodes).filter((item: any) => item.tagName === 'IMG')
                  for (const image of images) {
                     if (!image.src)
                        continue

                     blocks.push({
                        type: "image",
                        data: {
                           file: {
                              url: image.src
                                 .replaceAll("/api/media", "")
                                 .replaceAll("https://familnyjgerb.com", "")
                                 .replaceAll("http://familnyjgerb.com", "")
                                 .replaceAll("http://gerb.ainsworth.ml", ""),
                           },
                           caption: image.alt || "",
                           withBorder: false,
                           withBackground: false,
                           stretched: false,
                        },
                     });

                     image.remove()
                  }
                  // childBlocks.push(child.innerHTML ? child.innerHTML.trim() : `<a href="${child.href}">${child.textContent.trim()}</a>`);
                  childBlocks.push(`<a href="${child.href}">${child.textContent.trim()}</a>`);
               } else if (child.tagName === "EM" || child.tagName === "I") {
                  const images: any = Array.from(child.childNodes).filter((item: any) => item.tagName === 'IMG')
                  for (const image of images) {
                     if (!image.src)
                        continue

                     blocks.push({
                        type: "image",
                        data: {
                           file: {
                              url: image.src
                                 .replaceAll("/api/media", "")
                                 .replaceAll("https://familnyjgerb.com", "")
                                 .replaceAll("http://familnyjgerb.com", "")
                                 .replaceAll("http://gerb.ainsworth.ml", ""),
                           },
                           caption: image.alt || "",
                           withBorder: false,
                           withBackground: false,
                           stretched: false,
                        },
                     });

                     image.remove()
                  }
                  childBlocks.push(child.innerHTML ? child.innerHTML.replaceAll('em>', 'i>').trim() : `<i>${child.textContent.trim()}</i>`);
               } else if (child.tagName === "STRONG" || child.tagName === "B") {
                  const images: any = Array.from(child.childNodes).filter((item: any) => item.tagName === 'IMG')
                  for (const image of images) {
                     if (!image.src)
                        continue

                     blocks.push({
                        type: "image",
                        data: {
                           file: {
                              url: image.src
                                 .replaceAll("/api/media", "")
                                 .replaceAll("https://familnyjgerb.com", "")
                                 .replaceAll("http://familnyjgerb.com", "")
                                 .replaceAll("http://gerb.ainsworth.ml", ""),
                           },
                           caption: image.alt || "",
                           withBorder: false,
                           withBackground: false,
                           stretched: false,
                        },
                     });

                     image.remove()
                  }
                  childBlocks.push(child.innerHTML ? child.innerHTML.replaceAll('strong>', 'b>').trim() : `<b>${child.textContent.trim()}</b>`);
               } else if (child.tagName === "SPAN") {
                  const images: any = Array.from(child.childNodes).filter((item: any) => item.tagName === 'IMG')
                  for (const image of images) {
                     if (!image.src)
                        continue

                     blocks.push({
                        type: "image",
                        data: {
                           file: {
                              url: image.src
                                 .replaceAll("/api/media", "")
                                 .replaceAll("https://familnyjgerb.com", "")
                                 .replaceAll("http://familnyjgerb.com", "")
                                 .replaceAll("http://gerb.ainsworth.ml", ""),
                           },
                           caption: image.alt || "",
                           withBorder: false,
                           withBackground: false,
                           stretched: false,
                        },
                     });

                     image.remove()
                  }
                  childBlocks.push(child.innerHTML ? child.innerHTML.replaceAll('em>', 'i>').replaceAll('strong>', 'b>').trim() : `<span>${child.textContent.trim()}</span>`);
               } else if (child.tagName === "P") {
                  const images: any = Array.from(child.childNodes).filter((item: any) => item.tagName === 'IMG')
                  for (const image of images) {
                     if (!image.src)
                        continue

                     blocks.push({
                        type: "image",
                        data: {
                           file: {
                              url: image.src
                                 .replaceAll("/api/media", "")
                                 .replaceAll("https://familnyjgerb.com", "")
                                 .replaceAll("http://familnyjgerb.com", "")
                                 .replaceAll("http://gerb.ainsworth.ml", ""),
                           },
                           caption: image.alt || "",
                           withBorder: false,
                           withBackground: false,
                           stretched: false,
                        },
                     });

                     image.remove()
                  }
                  childBlocks.push(child.innerHTML ? child.innerHTML.trim() : child.textContent.trim());
               } else if (child.tagName === "IMG") {
                  blocks.push({
                     type: "image",
                     data: {
                        file: {
                           url: child.src
                              .replaceAll("/api/media", "")
                              .replaceAll("https://familnyjgerb.com", "")
                              .replaceAll("http://familnyjgerb.com", "")
                              .replaceAll("http://gerb.ainsworth.ml", ""),
                        },
                        caption: child.alt || "",
                        withBorder: false,
                        withBackground: false,
                        stretched: false,
                     },
                  });
               } else if (child.tagName?.startsWith("H") && ["H1", "H2", "H3", "H4", "H5", "H6"].includes(child.tagName)) {
                  if (child.textContent !== title) {
                     blocks.push({
                        type: "header",
                        data: {
                           text: child.textContent.trim(),
                           level: parseInt(child.tagName[1]),
                        },
                     });
                  }
               } else if (child.tagName === "DIV") {
                  for (const nestedNode of child.childNodes) {
                     convertNodeToEditorJsBlock(nestedNode, undefined, true)
                  }
               } else {
                  childBlocks.push(child.textContent.trim());
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
                     .replaceAll("/api/media", "")
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
         const items: any = Array.from(node.childNodes).filter((item: any) => ['DIV', 'UL', 'OL', 'P'].includes(item.tagName))
         if (items.length) {
            for (const [eIndex, element] of node.childNodes.entries()) {
               const nextChildNode = node.childNodes[eIndex + 1]
               element.outerHTML = element.outerHTML.replaceAll('em>', 'i>').replaceAll('strong>', 'b>')
               convertNodeToEditorJsBlock(element, nextChildNode, true);
            }
         } else {
            const textContent = node.innerHTML?.replaceAll('em>', 'i>').replaceAll('strong>', 'b>').trim() ?? node.textContent.replaceAll('em>', 'i>').replaceAll('strong>', 'b>').trim();
            if (textContent) {
               blocks.push({
                  type: "paragraph",
                  data: {
                     text: processShortcodes(textContent),
                  },
               });
            }
         }
      }
   };

   for (const [index, node] of document.body.childNodes.entries()) {
      const nextNode = document.body.childNodes[index + 1]
      convertNodeToEditorJsBlock(node, nextNode)
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