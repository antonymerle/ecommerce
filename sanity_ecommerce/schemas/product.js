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
    {name: 'price', title: 'Price', type: 'number'},
    {name: 'promotion', title: 'Promotion', type: 'number'},
    {name: 'oldPrice', title: 'Old Price', type: 'number'},
    {name: 'details', title: 'Details', type: 'string'},
    {name: 'ratings', title: 'Ratings', type: 'array', of: [{type: 'number'}]},
  ],
}
