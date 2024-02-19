import type { Products, Product } from './interfaces';

export let product_index: Products = {
  products: [
    {
      name: "ESG Analytics",
      type: "api,ah",
      displayName: "ESG Analytics",
      description: "Our ESG data product offers a detailed view of companies' environmental, social, and governance performance.",
      approvalType: "automatic",
      imageUrl: "https://lh3.googleusercontent.com/BIBxLqAC64K5tHvh9frdpClAcsYx-rUgxNvqBua81T0anU-wTV9PFyYWiQ9xAvbwx3Lfxegx-8Uw-vXOlxOc=w80-h64",
      specUrl: "https://raw.githubusercontent.com/tyayers/apigee-data-marketplace/main/specs/stock-transactions.yaml",
      status: "active",
      access: "public",
      attributes: [
        {
          name: "tags",
          value: "ESG/Environmental, ESG/Social, ESG/Governance"
        },
        {
          name: "groups",
          value: "Internal"
        }
      ]
    },
    {
      name: "Index Research",
      type: "api,ah",
      displayName: "Index Research",
      description: "Get in-depth index data and analysis for smarter investment strategies.",
      approvalType: "automatic",
      imageUrl: "https://lh3.googleusercontent.com/BIBxLqAC64K5tHvh9frdpClAcsYx-rUgxNvqBua81T0anU-wTV9PFyYWiQ9xAvbwx3Lfxegx-8Uw-vXOlxOc=w80-h64",
      specUrl: "https://raw.githubusercontent.com/tyayers/apigee-data-marketplace/main/specs/stock-transactions.yaml",
      status: "active",
      access: "public",
      attributes: [
        {
          name: "tags",
          value: "Investment/Research, Investment/Statistics, Investment/Management"
        }
      ]
    },
    {
      name: "STOXX Indexes",
      type: "api,sync",
      displayName: "STOXX Indexes",
      description: "Get in-depth STOXX index data and analysis for smarter investment strategies.",
      approvalType: "automatic",
      imageUrl: "https://lh3.googleusercontent.com/BIBxLqAC64K5tHvh9frdpClAcsYx-rUgxNvqBua81T0anU-wTV9PFyYWiQ9xAvbwx3Lfxegx-8Uw-vXOlxOc=w80-h64",
      specUrl: "https://raw.githubusercontent.com/tyayers/apigee-data-marketplace/main/specs/stock-transactions.yaml",
      status: "active",
      access: "public",
      attributes: [
        {
          name: "tags",
          value: "Investment/Research, Investment/Statistics, Investment/Management"
        }
      ]
    },
    {
      name: "DAX Indexes",
      type: "api,sync",
      displayName: "DAX Indexes",
      description: "Get in-depth DAX index data and analysis for smarter investment strategies.",
      approvalType: "automatic",
      imageUrl: "https://lh3.googleusercontent.com/BIBxLqAC64K5tHvh9frdpClAcsYx-rUgxNvqBua81T0anU-wTV9PFyYWiQ9xAvbwx3Lfxegx-8Uw-vXOlxOc=w80-h64",
      specUrl: "https://raw.githubusercontent.com/tyayers/apigee-data-marketplace/main/specs/stock-transactions.yaml",
      status: "active",
      access: "public",
      attributes: [
        {
          name: "tags",
          value: "Investment/Research, Investment/Statistics, Investment/Management"
        }
      ]
    },
    {
      name: "Market Structure",
      type: "api,sync",
      displayName: "Market Structure",
      description: "Get in-depth pre-IPO listing data and analysis for smarter investment strategies.",
      approvalType: "automatic",
      imageUrl: "https://lh3.googleusercontent.com/BIBxLqAC64K5tHvh9frdpClAcsYx-rUgxNvqBua81T0anU-wTV9PFyYWiQ9xAvbwx3Lfxegx-8Uw-vXOlxOc=w80-h64",
      specUrl: "https://raw.githubusercontent.com/tyayers/apigee-data-marketplace/main/specs/stock-transactions.yaml",
      status: "active",
      access: "public",
      attributes: [
        {
          name: "tags",
          value: "Pre-IPO/Research, Pre-IPO/Statistics, Pre-IPO/Management, Listing/Research, Listing/Statistics, Listing/Management"
        }
      ]
    },
    {
      name: "Growth Venture Networks",
      type: "api,ah",
      displayName: "Growth Venture Networks",
      description: "Get in-depth pre-IPO listing data and analysis for smarter investment strategies.",
      approvalType: "automatic",
      imageUrl: "https://lh3.googleusercontent.com/BIBxLqAC64K5tHvh9frdpClAcsYx-rUgxNvqBua81T0anU-wTV9PFyYWiQ9xAvbwx3Lfxegx-8Uw-vXOlxOc=w80-h64",
      specUrl: "https://raw.githubusercontent.com/tyayers/apigee-data-marketplace/main/specs/stock-transactions.yaml",
      status: "active",
      access: "public",
      attributes: [
        {
          name: "tags",
          value: "Pre-IPO/Research, Pre-IPO/Statistics"
        }
      ]
    },
    {
      name: "Public Offerings",
      type: "api,ah",
      displayName: "Public Offerings",
      description: "Get in-depth public offering listing data and analysis for smarter investment strategies.",
      approvalType: "automatic",
      imageUrl: "https://lh3.googleusercontent.com/BIBxLqAC64K5tHvh9frdpClAcsYx-rUgxNvqBua81T0anU-wTV9PFyYWiQ9xAvbwx3Lfxegx-8Uw-vXOlxOc=w80-h64",
      specUrl: "https://raw.githubusercontent.com/tyayers/apigee-data-marketplace/main/specs/stock-transactions.yaml",
      status: "active",
      access: "public",
      attributes: [
        {
          name: "tags",
          value: "Pre-IPO/Research, Pre-IPO/Statistics"
        }
      ]
    },
    {
      name: "Trading locations",
      type: "api,ah",
      displayName: "Trading locations",
      description: "Get in-depth public trading location data and analysis for smarter investment strategies.",
      approvalType: "automatic",
      imageUrl: "https://lh3.googleusercontent.com/BIBxLqAC64K5tHvh9frdpClAcsYx-rUgxNvqBua81T0anU-wTV9PFyYWiQ9xAvbwx3Lfxegx-8Uw-vXOlxOc=w80-h64",
      specUrl: "https://raw.githubusercontent.com/tyayers/apigee-data-marketplace/main/specs/stock-transactions.yaml",
      status: "active",
      access: "public",
      attributes: [
        {
          name: "tags",
          value: "Trading/Research, Trading/Statistics"
        }
      ]
    },
    {
      name: "Trading data",
      type: "api,ah",
      displayName: "Trading products",
      description: "Get in-depth public trading location data and analysis for smarter investment strategies.",
      approvalType: "automatic",
      imageUrl: "https://lh3.googleusercontent.com/BIBxLqAC64K5tHvh9frdpClAcsYx-rUgxNvqBua81T0anU-wTV9PFyYWiQ9xAvbwx3Lfxegx-8Uw-vXOlxOc=w80-h64",
      specUrl: "https://raw.githubusercontent.com/tyayers/apigee-data-marketplace/main/specs/stock-transactions.yaml",
      status: "active",
      access: "public",
      attributes: [
        {
          name: "tags",
          value: "Trading/Research, Trading/Statistics, Trading/Classes"
        }
      ]
    }
  ]
}