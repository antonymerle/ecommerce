export default {
  name: 'user',
  title: 'Authenticated User',
  type: 'document',
  fields: [
    {
      name: 'providerId',
      title: 'providerId',
      type: 'string',
    },
    {
      name: 'given_name',
      title: 'First Name',
      type: 'string',
    },
    {
      name: 'family_name',
      title: 'Last Name',
      type: 'string',
    },
    {
      name: 'email',
      title: 'email',
      type: 'string',
    },
    {
      name: 'password',
      title: 'Password',
      type: 'string',
    },
    {
      name: 'profileImage',
      title: 'Profile picture',
      type: 'string',
    },
    {
      name: 'role',
      title: 'Role',
      type: 'string',
    },
    {
      name: 'provider',
      title: 'Provider',
      type: 'string',
    },
    {
      title: 'Rated products',
      name: 'ratedProducts',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              title: 'Product',
              name: 'product',
              type: 'reference',
              to: [{type: 'product'}],
            },
            {
              title: 'Rate',
              name: 'rate',
              type: 'number',
              validation: (Rule) => Rule.integer().min(1).max(5), // Set validation rules for rate field
            },
          ],
        },
      ],
    },
    {
      title: 'Favorites',
      name: 'favorites',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'product',
              type: 'reference',
              to: [{type: 'product'}],
            },
            {
              title: 'IsFaved',
              name: 'isFaved',
              type: 'boolean',
            },
          ],
        },
      ],
    },
    {
      title: 'Orders',
      name: 'orders',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {title: 'Command id', name: 'command_id', type: 'string'},
            {title: 'Line id', name: 'line_id', type: 'string'},
            {title: 'object', name: 'object', type: 'string'},
            {title: 'amount_discount', name: 'amount_discount', type: 'number'},
            {title: 'amount_subtotal', name: 'amount_subtotal', type: 'number'},
            {title: 'amount_tax', name: 'amount_tax', type: 'number'},
            {title: 'amount_total', name: 'amount_total', type: 'number'},
            {title: 'currency', name: 'currency', type: 'string'},
            {title: 'description', name: 'description', type: 'string'},
            // {title: 'price', name: 'price', type: 'object'},   // TODO : map the price object to schema
            {title: 'quantity', name: 'quantity', type: 'number'},
          ],
        },
      ],
    },
  ],
}
