export default async (req, res) => {
  if (req.query.secret !== 'MY_SECRET_TOKEN' || !req.query.slug) {
    return res.status(401).json({message: 'invalid token'})
  }

  // fetch content from headless cms using getPostBySlug
  const post = await getPostBySlug(req.query.slug)

  // if no slug do not activate preview mode
  if (!post) {
    return res.status(401).json({ message: 'Invalid slug' })
  }
  // enable preview mode, set cookies
  // can set a max age in the params
  // data can be set manually, has a 2kb limit
  res.setPreviewData(data, {
    maxAge: 60 * 60 
  })

  // redirect to preview path; don't reuse req.query.slug
  res.redirect(post.slug)
}

// To use: https://nextjs.org/docs/advanced-features/preview-mode#securely-accessing-it-from-your-headless-cms