---
  title: Usage Guideline
  weight: 30
  render-file: false
---

*Model binding without ID:* Do NOT bind to Models that do NOT have an `id` assigned. This will cause for extra listeners
and cause potentially large memory leak problems. See the example app for one possible workaround.

*Namespace construction:* When constructing the namespace, as with the the ioSync method, for a given model ioBind
will default to the `url` of the collectionthat model is a part of, else it will use the models `urlRoot`.

*Reserved events:* Do NOT bind to reserved backbone events, such as `change`, `remove`, and `add`. Proxy these
events using different event tags such as `update`, `delete`, and `create`.