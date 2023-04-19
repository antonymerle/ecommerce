export default {
  name: 'upperBanner',
  title: 'Upper banner',
  type: 'document',
  fields: [
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'smallText',
      title: 'Small text - top left',
      type: 'string',
    },
    {
      name: 'product',
      title: 'Product',
      type: 'string',
    },
    {
      name: 'midText',
      title: 'MidText - top left',
      type: 'string',
    },
    {
      name: 'buttonText',
      title: 'ButtonText - bottom right ',
      type: 'string',
    },
    {
      name: 'largeText',
      title: 'LargeText - center left',
      type: 'string',
    },
    {
      name: 'discount',
      title: 'Discount',
      type: 'string',
    },
    {
      name: 'saleTime',
      title: 'SaleTime',
      type: 'string',
    },
    {
      name: 'desc',
      title: 'Bottom right description',
      type: 'string',
    },
  ],
}
