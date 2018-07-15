intents
articles
doctors

intent: { // Intent
  name,
  articles: [
    { // Article
      name,
      age-group: {
        low,
        high,
      },
      country: [],
      linkurl,
      snippet,
      upvotes,
      doctors: [{ // Doctor
        name,
        education,
      }]
    }
  ]
}