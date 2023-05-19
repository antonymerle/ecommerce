export default {
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    {
      title: 'customer',
      name: 'customer',
      type: 'reference',
      to: [{type: 'user'}],
    },
    {title: 'Command id', name: 'command_id', type: 'string'},
    {title: 'Timestamp', name: 'timestamp', type: 'number'},
    {
      title: 'items',
      name: 'items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
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
