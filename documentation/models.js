intents
articles
doctors

intents: [ // Intent
  disease,
  query,
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
]