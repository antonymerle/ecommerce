export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'image',
      title: 'Image',
      type: 'array',
      of: [{type: 'image'}],
      options: {
        hotspot: true,
      },
    },
    {name: 'name', title: 'Name', type: 'string'},
    {name: 'slug', title: 'Slug', type: 'slug', options: {source: 'name', maxLength: 90}},
    {name: 'priceHT', title: 'PriceHT', type: 'number'},
    {name: 'tax', title: 'Taxe', type: 'number'},
    {name: 'promotion', title: 'Promotion', type: 'number'},
    {name: 'oldPrice', title: 'Old Price', type: 'number'},
    {name: 'details', title: 'Details', type: 'string'},
    {name: 'ratings', title: 'Ratings', type: 'array', of: [{type: 'number'}]},
  ],
}
