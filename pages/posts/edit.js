export default function() {
  return <div>Under development</div>
}

// export async function getStaticProps(context) {
  // when context.preview === true append '/preview' to the API endpoint
  // to fetch draft data instead of published data.
  // varies based on the CMS system used.

  // TODO: uncomment and complete when needed
  // const res = await fetch(`https://.../${content.preview ? 'preview' : ''}`)

  // Set this as the preview URL on your headless CMS or access manually,
  // and you should be able to see the preview.
  // https://<your-site>/api/preview?secret=<token>&slug=<path>
// }