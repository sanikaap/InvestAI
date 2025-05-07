# 🏠 AI Real Estate Insights – Project Story

## ✨ Inspiration
We were inspired by the increasing complexity of real estate data and how time-consuming it can be for investors, buyers, and analysts to manually research market trends, property risks, and investment potential. With AI rapidly transforming industries, we wanted to explore how Large Language Models (LLMs) could simplify property research by generating insights from natural language queries.

## 💡 What We Built
We created a **prototype web app that uses OpenRouter’s free LLM API to answer real estate-related questions.**  
Users can input queries like:  
- *“What are the risks of buying property in downtown LA?”*  
- *“Summarize recent trends in rental prices in Austin.”*

The app fetches AI-generated insights and displays them in a clean, simple interface. We intentionally kept it frontend-only (without authentication or backend) to focus on showcasing the AI interaction and fast prototyping.

## 🛠️ How We Built It
We used:
- **Next.js (App Router)** for frontend development
- **Tailwind CSS** for styling
- **OpenRouter API** to access a free Large Language Model for answering queries

We integrated the OpenRouter API using `fetch` with an API key in the frontend code. To keep things simple for prototyping, we avoided using a backend, database, or authentication—just a direct call to the LLM API and rendering the result.

## 🚧 Challenges We Faced
- Initially faced a **build error related to PostCSS/Tailwind configuration in Next.js** → we resolved it by manually adding a `postcss.config.js` file to override incorrect defaults.
- Learned how to **handle CORS and API key placement safely for frontend-only calls**—since exposing keys on the frontend isn’t secure for production, we focused on short-term testing rather than security.
- Limited time (7 hours left) pushed us to **prioritize a simple, functional prototype over adding features like chat history or authentication.**

## 📚 What We Learned
- How to work with **OpenRouter and LLM APIs** in a frontend environment
- The importance of **clear PostCSS and Tailwind setup** in a Next.js project
- Rapid prototyping skills: focusing on an MVP that demonstrates core functionality under time constraints

## 🚀 Conclusion
This project gave us hands-on experience with AI integration in real estate tech. We hope it sparks ideas for more AI-powered tools that democratize access to real estate insights for everyone—from casual home buyers to seasoned investors.
