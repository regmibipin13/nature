import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create default PageContent records
  const pageContents = [
    {
      pageType: 'HERO',
      content: {
        icon: '🌿',
        title: '<h1>Welcome to Nature & Nurtures</h1>',
        description: '<p>Discover our premium collection of natural and organic products.</p>',
        buttonText: 'Shop Now',
        backgroundColor: '#f8f9fa',
        imageUrl: '/product/amber/1.png',
        videoUrl: ''
      }
    },
    {
      pageType: 'INFO',
      content: {
        title: '<h2>Why Choose Us</h2>',
        description: '<p>We offer the finest quality natural products sourced from trusted suppliers.</p>',
        features: [
          { title: 'Quality Assured', description: '100% natural and organic products', icon: '✓' },
          { title: 'Fast Delivery', description: 'Quick and secure shipping', icon: '🚚' },
          { title: 'Customer Support', description: '24/7 support for all your needs', icon: '💬' }
        ]
      }
    },
    {
      pageType: 'FAQ',
      content: {
        headline: '<h2>Frequently Asked Questions</h2>',
        accordionItems: [
          {
            title: 'What are your shipping options?',
            content: 'We offer standard and express shipping options. Standard shipping takes 3-5 business days, while express shipping takes 1-2 business days.'
          },
          {
            title: 'Do you offer returns?',
            content: 'Yes, we offer a 30-day return policy for all products. Please contact our customer support for more details.'
          },
          {
            title: 'Are your products organic?',
            content: 'Yes, all our products are 100% natural and organic, sourced from certified suppliers.'
          }
        ],
        imageUrl: '/product/amber/1.png'
      }
    },
    {
      pageType: 'FOOTER',
      content: {
        logoUrl: '/logo.png',
        copyrightText: '© 2025 NATURE AND NURTURES COMPANY, INC. ALL RIGHTS RESERVED.',
        socialLinks: [
          { icon: 'facebook', url: 'https://facebook.com', value: 'Facebook' },
          { icon: 'instagram', url: 'https://instagram.com', value: 'Instagram' },
          { icon: 'twitter', url: 'https://twitter.com', value: 'Twitter' }
        ]
      }
    }
  ]

  for (const pageContent of pageContents) {
    await prisma.pageContent.upsert({
      where: { pageType: pageContent.pageType },
      update: { content: pageContent.content },
      create: {
        pageType: pageContent.pageType,
        content: pageContent.content
      }
    })
    console.log(`✓ Created/Updated PageContent: ${pageContent.pageType}`)
  }

  // Create a default category
  await prisma.category.upsert({
    where: { slug: 'essential-oils' },
    update: {},
    create: {
      name: 'Essential Oils',
      slug: 'essential-oils',
      description: 'Pure and natural essential oils',
      active: true,
      featured: true,
      imageUrl: '/product/amber/1.png'
    }
  })
  console.log('✓ Created default category: Essential Oils')

  console.log('\n✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
