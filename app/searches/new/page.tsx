export default function NewSearchPage() {
  return <main><h1>Create saved discovery search</h1><div className="card">
    <form action="/api/searches" method="post">
      <label>Name<input name="name" placeholder="Germany small software projects" required /></label>
      <label>Search query<textarea name="query" rows={4} placeholder='("software development partner" OR RFP OR tender) (AI OR mobile app OR cybersecurity)' required /></label>
      <label>Countries, comma separated<input name="countries" placeholder="Germany, India, UAE" /></label>
      <label>Service tags<input name="serviceTags" placeholder="website,mobile,ai,cybersecurity,cloud,saas,automation" /></label>
      <label><input type="checkbox" name="startupFriendlyOnly" defaultChecked /> Startup-friendly scoring filter</label>
      <button type="submit">Save search</button>
    </form>
  </div></main>;
}
