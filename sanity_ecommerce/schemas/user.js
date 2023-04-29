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
  ],
}
