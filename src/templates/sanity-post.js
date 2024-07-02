import * as React from "react"
import { Link, graphql } from "gatsby"
import { PortableText } from "@portabletext/react"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

const SanityPostTemplate = ({
  data: { previous, next, site, sanityPost: post },
  location,
}) => {
  console.log("SanityPostTemplate", previous, next, post)
  const siteTitle = site.siteMetadata?.title || `Title`

  return (
    <Layout location={location} title={siteTitle}>
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{post.title}</h1>
          <p>{post.publishedAt}</p>
        </header>
        <PortableText value={post._rawBody} />

        <hr />
        <footer>
          <Bio />
        </footer>
      </article>
      <nav className="blog-post-nav">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export const Head = ({ data: { sanityPost: post } }) => {
  return <Seo title={post.title} />
}

export default SanityPostTemplate

export const pageQuery = graphql`
  query SanityPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    sanityPost(id: { eq: $id }) {
      id
      title
      publishedAt(formatString: "MMMM DD, YYYY")
      _rawBody(resolveReferences: { maxDepth: 5 })
    }
    previous: sanityPost(id: { eq: $previousPostId }) {
      title
      fields {
        slug
      }
    }
    next: sanityPost(id: { eq: $nextPostId }) {
      title
      fields {
        slug
      }
    }
  }
`
