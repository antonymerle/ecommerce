export default {
  name: 'footerBanner',
  title: 'Footer banner',
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
      name: 'largeText1',
      title: 'LargeText1 - center left',
      type: 'string',
    },
    {
      name: 'largeText2',
      title: 'LargeText2 - center right',
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
