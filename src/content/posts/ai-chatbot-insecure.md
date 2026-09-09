---
title: "I Asked a Retailer's Chatbot What to Do About a Complaint. It Told Me to Sue."
urlPath: "ai-chatbot-insecure-zimbabwe"
date: "2026-03-30"
kind: essay
categories: 
  - "ai"
tags: 
  - "ai"
  - "chatbots"
  - "ai deployment"
  - "zimbabwe"
  - "prompt injection"
  
metaDescription: "A retail chatbots recommends taking legal action against the company. A look at how brittle AI deployments can be, and some solutions"
---

While shopping for some household items, I asked Tina*, their chatbot, what to do about a faulty product that the manager had refused to take back. The bot helpfully provided me with a complaints form and a link to their returns policy. 

I pushed further. I told her I had already done all of that with no success. What other options did I have?

She recommended legal action against the store. 

Initially I had been shopping for household items and wanted to ask about delivery options. But I was also just curious about how AI agents and bots are being deployed, especially in Africa, and their behaviour in the wild, as this in an area of professional interest.

I asked Tina to reverse a linked list in python and she did. I asked her to write a thousand word essay on the fallout between Pompey and Caesar. She began:

_The rivalry between Gnaeus Pompeius Magnus (Pompey the Great) and Gaius Julius Caesar was one of the most defining conflicts in Roman history. It marked the transition from the Roman Republic to the Roman Empire, reshaping Rome's political landscape and leaving a legacy that influenced governance for centuries._

I asked her to write a letter to my landlord asking for rent extension on account of having spent all my money on this particular store. She wrote it without hesitation. 

Then I hacked the system prompt using techniques that have been publicly documented for years and that worked too. 

So I set out to test how widespread this is.

## How chatbots are being deployed

Tina is not an outlier. Looking around several Zimbabwean retail sites it appears the pattern for deploying chatbots is: Find an LLM/AI Chat provider, throw in an API key, drop a chat widget on the website, give it a name, and let the bot get to work. No guardrails. No scope restrictions.No testing. 

The result are bots that do not behave as assistants for a particular company, but as general purpose systems equally happy to recommend a competitor, write Python code, discuss ancient history, or advise your customers to take you to court.  

And this leads to lots of easily fixed issues, some detailed below.

## The problems 

Poor chatbot/agent implementations cause issues such as:

**The bot answers everything**
The bots will answer any and all questions. They have no idea of their role, no boundaries between what they know and what they ought to do. They do things that no business would authorise.

Good practice is to tighten scope, as this keeps the conversation focused and minimises vulnerabilities. A good chatbot must have a clearly defined identity, gently steering the customer to its core business. 

**You're paying for it**
AI models are not free. The cost goes up with requests, and longer, more complex questions cost more money.  When a chatbot solves code, or writes thousands of words on the battle of Pharsalus, it consumes a lot of tokens. Multiply this across every user who discovers this vulnerability and you get a hefty bill with zero business return. 

In fact this particular chatbot could be used for research purposes, or other work, for free. When I generated the essay on Caesar, and drafted a letter to my landlord, the business paid for it.

**The bots are not connected to reality**
I found many chatbots are not grounded in realtime data (some perform a limited scraping of the website to find information). They give responses that don't make any business sense or respond with false information, coming up with generic products and using descriptions from their training data instead of company data. 

**Brand damage**
When I asked one bot to compare its products with that of a rival firm that I said was closer to my house it gave a balanced comparison, suggesting that I should order from the closer store. The AI assistant, in being helpful, was actively working against the business that deployed her.


If you think of your chatbot as an employee, which you should, then this behaviour is damaging to your brand and totally unacceptable. No company would tolerate this from a from a human worker, and that same standard must be applied to chatbots.

## How to think about deploying chatbots/ai agents that work for you

While rapid advances in AI capabilities mean that vulnerabilities are discovered each day,  there are some general techniques that can make agents more reliable. 

A good way of thinking about AI deployments is to think in terms of reliability. In safety-critical fields like aviation, nuclear energy, or industrial automation, reliability means four things: consistency, robustness, predictability, and safety.  A reliable system behaves the same way for the same inputs, resists being pushed of course, does what you expect, and doesn't cause harm.

For most chatbots a couple of changes would greatly improve their reliability:

**A robust system prompt** - The persona of the chatbot should be clearly defined, with a clear role, behaviour, and safety guardrails. It must specify the bot's tone, what to refuse, when and how to call external tools, and graceful fallback behaviour. 

A weak system prompt says, "_You are Tina, a helpful assistant for JJ's Electronics_" whereas a good prompt might say: 
  
"_You are Tina, the customer service assistant for JJ's Electronics. You help customers with product questions, delivery, and returns. You do not answer questions outside this scope. If asked about anything unrelated to our products or services, politely explain that you can only assist with store-related queries. Never recommend legal action. Never recommend competitors._"
  
  
**An input/intent classifier** - A smaller model to check the whether the input is within scope. Off-topic messages get a polite refusal and never consume tokens. 

**Access to real company data** - Chatbots perform vastly better when they have more relevant company information rather than generic model data. Therefore the chatbot should be  connected to external knowledge sources, for example the company docs or inventory using Retrieval Augmented Generation (RAG). This minimises hallucinations about products availability, pricing, and other cases of poor business logic. 

**Access to tools** - Tools allow agents to pull in additional context as they work.

**Rate limiting** -Developers must limit tokens per user or session and set a reasonable context window length to prevent huge API costs. A genuine user looking to buy a TV need not generate responses thousands of words long.

**Evaluation** - It is critical to test how your chatbot behaves with adversarial prompts and in edge cases both before deployment and after. Additionally it's important to track key metrics like refusal rates and read chat transcripts to identify evaluation gaps. 

## Closing thoughts

Tina is still live as I write this, burning through tokens, happily discussing any topic thrown at her,  recommending rival products, and occasionally suggesting litigation. So are most of the other chatbots I looked at. 

Given that chatbots are becoming an increasingly popular way for customers to interact with businesses, they must be carefully designed so that they promote your business instead of harming it. 
