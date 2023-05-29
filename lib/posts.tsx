import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";

const postsDirectory = path.join(process.cwd(), "blogposts");

export function getSortedPostsData() {
  // Get file names uder /blogposts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    const blogPost: BlogPost = {
      id,
      title: matterResult.data.title,
      date: matterResult.data.date,
    };

    // Combine the data with the id
    return blogPost;
  });
  return allPostData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // md -> html
  const processedContent = await remark()
    // .use(html)
    .process(matterResult.content);

  const contentHtml = processedContent.toString();
  const blogPostWithHtml: BlogPost & { contentHtml: string } = {
    id,
    title: matterResult.data.title,
    date: matterResult.data.date,
    contentHtml,
  };

  return blogPostWithHtml;
}
