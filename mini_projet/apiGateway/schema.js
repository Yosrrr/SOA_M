const { gql } = require('@apollo/server');
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_your_stripe_secret_key'); // Remplacez par votre clé API Stripe

const typeDefs = `#graphql 
type Perfume {
    id: ID!
    name: String!
    brand: String!
    fragranceNotes: String!
}

type Query {
    perfume(id: ID!): Perfume
    perfumes: [Perfume]
}

type Mutation {
    createPerfume(name: String!, brand: String!, fragranceNotes: String!): Perfume
    updatePerfume(id: ID!, name: String, brand: String, fragranceNotes: String): Perfume
    deletePerfume(id: ID!): Perfume
    }
    `;

    module.exports = typeDefs;