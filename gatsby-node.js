/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

// Define the template for blog post
const blogPost = path.resolve(`./src/templates/blog-post.js`)
const sanityPost = path.resolve(`./src/templates/sanity-post.js`)

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  await createBlogPages({ graphql, createPage, reporter })
  await createSanityPages({ graphql, createPage, reporter })
}

createBlogPages = async ({ graphql, createPage, reporter }) => {
  // Get all markdown blog posts sorted by date
  const result = await graphql(`
    {
      allMarkdownRemark(sort: { frontmatter: { date: ASC } }, limit: 1000) {
        nodes {
          id
          frontmatter {
            isDraft
          }
          fields {
            slug
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }

  const posts = result.data.allMarkdownRemark.nodes

  // Create blog posts pages
  // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL

  const [draftPosts, publishedPosts] = posts.reduce(
    (acc, post) => {
      if (post.frontmatter.isDraft) {
        acc[0].push(post)
      } else {
        acc[1].push(post)
      }
      return acc
    },
    [[], []]
  )

  if (publishedPosts.length > 0) {
    publishedPosts.forEach((post, index) => {
      const previousPostId = index === 0 ? null : publishedPosts[index - 1].id
      const nextPostId =
        index === publishedPosts.length - 1
          ? null
          : publishedPosts[index + 1].id

      createPage({
        path: post.fields.slug,
        component: blogPost,
        context: {
          id: post.id,
          previousPostId,
          nextPostId,
        },
      })
    })
  }

  if (draftPosts.length > 0) {
    draftPosts.forEach((post, index) => {
      createPage({
        path: post.fields.slug,
        component: blogPost,
        context: {
          id: post.id,
        },
      })
    })
  }
}

createSanityPages = async ({ graphql, createPage, reporter }) => {
  const sanityResult = await graphql(`
    {
      allSanityPost(sort: { publishedAt: DESC }) {
        nodes {
          id
          title
          isDraft
          fields {
            slug
          }
        }
      }
    }
  `)

  if (sanityResult.errors) {
    throw sanityResult.errors
  }

  const sanityPosts = sanityResult.data.allSanityPost.nodes || []

  const [draftPosts, publishedPosts] = sanityPosts.reduce(
    (acc, post) => {
      console.log(post.isDraft)
      if (post.isDraft) {
        acc[0].push(post)
      } else {
        acc[1].push(post)
      }
      return acc
    },
    [[], []]
  )

  if (publishedPosts.length > 0) {
    publishedPosts.forEach((post, index) => {
      const previousPostId = index === 0 ? null : publishedPosts[index - 1].id
      const nextPostId =
        index === publishedPosts.length - 1
          ? null
          : publishedPosts[index + 1].id

      createPage({
        path: post.fields.slug,
        component: sanityPost,
        context: { id: post.id, previousPostId, nextPostId },
      })
    })
  }

  if (draftPosts.length > 0) {
    draftPosts.forEach((post, index) => {
      createPage({
        path: post.fields.slug,
        component: sanityPost,
        context: { id: post.id },
      })
    })
  }
}

/**
 * @type {import('gatsby').GatsbyNode['onCreateNode']}
 */
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    // NOTE(yunsi): create a slug for Markdown posts. e.g. `/blog-post/my-post`
    const value = `/blog-post${createFilePath({ node, getNode })}`

    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }

  if (node.internal.type === `SanityPost`) {
    // NOTE(yunsi): create a slug for Sanity posts. e.g. `/sanity-post/my-post`
    const value = `/sanity-post/${node.slug.current}/`

    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

/**
 * @type {import('gatsby').GatsbyNode['createSchemaCustomization']}
 */
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
      isDraft: Boolean
    }

    type Fields {
      slug: String
    }

    type SanityPost implements Node {
      fields: Fields
    }
  `)
}
